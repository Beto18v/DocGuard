interface RecordingState {
  isRecording: boolean;
  tabId?: number;
  mode?: string;
  mic?: boolean;
  startTime?: number;
}

export default defineBackground(() => {
  // Listen for messages across popup, content script, and preview
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'START_RECORDING_REQUEST') {
      (async () => {
        const mode = message.mode || 'screen-camera';
        const mic = message.mic !== false;
        const openStudioRecorder = async () => {
          const recorderUrl = chrome.runtime.getURL(
            `recorder.html?mode=${encodeURIComponent(mode)}&mic=${encodeURIComponent(String(mic))}`
          );
          const tab = await chrome.tabs.create({ url: recorderUrl });
          return tab;
        };

        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          const restrictedProtocols = ['chrome:', 'chrome-extension:', 'edge:', 'about:', 'view-source:', 'chrome-search:'];
          const isRestricted = !tab?.id || !tab.url || restrictedProtocols.some((p) => tab.url?.startsWith(p));

          if (isRestricted || !tab?.id) {
            // Restricted page or tab without ID: open Universal Studio Recorder tab immediately
            await openStudioRecorder();
            sendResponse({ success: true, studio: true });
            return;
          }

          const activeTabId: number = tab.id;

          // Save pending recording state
          const state: RecordingState = {
            isRecording: true,
            tabId: activeTabId,
            mode,
            mic,
            startTime: Date.now(),
          };
          await chrome.storage.local.set({ recordflow_state: state });

          // Forward start command to active tab content script
          chrome.tabs.sendMessage(
            activeTabId,
            {
              type: 'START_RECORDING_INTERNAL',
              mode,
              mic,
            },
            async (response: any) => {
              if (chrome.runtime.lastError || !response?.success) {
                // If content script is not injected or fails, fall back to Universal Studio Recorder!
                try {
                  await openStudioRecorder();
                  sendResponse({ success: true, studio: true });
                } catch (e: any) {
                  chrome.storage.local.set({
                    recordflow_state: { isRecording: false } as RecordingState,
                  });
                  sendResponse({
                    success: false,
                    error: e?.message || 'CONTENT_NOT_READY',
                  });
                }
              } else {
                sendResponse({ success: true, tabId: activeTabId });
              }
            }
          );
        } catch (err: any) {
          try {
            await openStudioRecorder();
            sendResponse({ success: true, studio: true });
          } catch {
            await chrome.storage.local.set({
              recordflow_state: { isRecording: false } as RecordingState,
            });
            sendResponse({ success: false, error: err?.message || 'UNKNOWN_ERROR' });
          }
        }
      })();
      return true; // Keep message channel open for async response
    }

    if (message.type === 'STOP_RECORDING_REQUEST') {
      (async () => {
        try {
          const data = (await chrome.storage.local.get('recordflow_state')) as {
            recordflow_state?: RecordingState;
          };
          const tabId = data.recordflow_state?.tabId;
          if (tabId) {
            chrome.tabs.sendMessage(tabId, { type: 'STOP_RECORDING_INTERNAL' }).catch(() => {});
          }

          // Broadcast stop to any recorder.html tabs
          const allTabs = await chrome.tabs.query({});
          for (const t of allTabs) {
            if (t.id && t.url?.includes('recorder.html')) {
              chrome.tabs.sendMessage(t.id, { type: 'STOP_RECORDING_INTERNAL' }).catch(() => {});
            }
          }

          await chrome.storage.local.set({
            recordflow_state: { isRecording: false } as RecordingState,
          });
          sendResponse({ success: true });
        } catch (err: any) {
          sendResponse({ success: false, error: err?.message });
        }
      })();
      return true;
    }

    if (message.type === 'RECORDING_FINISHED') {
      (async () => {
        await chrome.storage.local.set({
          recordflow_state: { isRecording: false } as RecordingState,
        });

        // Open preview page with recorded video ID
        const previewUrl = chrome.runtime.getURL(`preview.html?id=${message.id}`);
        chrome.tabs.create({ url: previewUrl });
        sendResponse({ success: true });
      })();
      return true;
    }

    if (message.type === 'RECORDING_CANCELLED') {
      chrome.storage.local.set({
        recordflow_state: { isRecording: false } as RecordingState,
      });
      sendResponse({ success: true });
      return true;
    }

    if (message.type === 'GET_RECORDING_STATE') {
      chrome.storage.local.get('recordflow_state', (data: { recordflow_state?: RecordingState }) => {
        sendResponse(data.recordflow_state || { isRecording: false });
      });
      return true;
    }
  });

  // When a recording tab is closed, clean up state
  chrome.tabs.onRemoved.addListener(async (tabId) => {
    const data = (await chrome.storage.local.get('recordflow_state')) as {
      recordflow_state?: RecordingState;
    };
    if (data.recordflow_state?.tabId === tabId) {
      await chrome.storage.local.set({
        recordflow_state: { isRecording: false } as RecordingState,
      });
    }
  });
});
