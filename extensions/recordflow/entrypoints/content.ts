import { saveRecording } from '@/utils/db';
import { getCurrentLang, t, formatDate, formatDuration } from '@/utils/i18n';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
    let mediaRecorder: MediaRecorder | null = null;
    let recordedChunks: Blob[] = [];
    let overlayHost: HTMLElement | null = null;
    let shadowRoot: ShadowRoot | null = null;
    let timerInterval: number | null = null;
    let recordingStartTime = 0;
    let totalDurationSeconds = 0;
    let isStopping = false;

    // Active streams to clean up
    let cameraStream: MediaStream | null = null;
    let screenStream: MediaStream | null = null;
    let micStream: MediaStream | null = null;
    let combinedStream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;

    // Determine supported WebM mime type
    function getSupportedMimeType(): string {
      const types = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=h264,opus',
        'video/webm',
      ];
      for (const type of types) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
          return type;
        }
      }
      return 'video/webm';
    }

    // Stop all tracks and release camera / mic hardware immediately
    function releaseAllHardware() {
      const streams = [cameraStream, screenStream, micStream, combinedStream];
      for (const st of streams) {
        if (st) {
          st.getTracks().forEach((track) => {
            try {
              track.stop();
              track.enabled = false;
            } catch {
              // ignore
            }
          });
        }
      }
      cameraStream = null;
      screenStream = null;
      micStream = null;
      combinedStream = null;

      if (audioContext && audioContext.state !== 'closed') {
        try {
          audioContext.close();
        } catch {
          // ignore
        }
        audioContext = null;
      }
    }

    // Remove floating overlay from DOM
    function removeOverlay() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      if (overlayHost && overlayHost.parentNode) {
        overlayHost.parentNode.removeChild(overlayHost);
      }
      overlayHost = null;
      shadowRoot = null;
    }

    // Stop recording, persist blob to IndexedDB, and open preview
    async function stopRecording(mode: string) {
      if (isStopping) return;
      isStopping = true;

      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }

      totalDurationSeconds = Math.max(1, Math.round((Date.now() - recordingStartTime) / 1000));

      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      } else {
        await finishAndSave(mode);
      }
    }

    async function finishAndSave(mode: string) {
      releaseAllHardware();
      removeOverlay();

      const mimeType = getSupportedMimeType();
      const finalBlob = new Blob(recordedChunks, { type: mimeType });
      const recId = `rf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const lang = await getCurrentLang();
      const title = `${t('app_name', lang)} — ${formatDate(Date.now(), lang)}`;

      try {
        await saveRecording({
          id: recId,
          title,
          timestamp: Date.now(),
          duration: totalDurationSeconds,
          size: finalBlob.size,
          mode: mode as any,
          mimeType,
          blob: finalBlob,
        });

        chrome.runtime.sendMessage({
          type: 'RECORDING_FINISHED',
          id: recId,
        });
      } catch (err) {
        console.error('[RecordFlow] Failed to save recording to IndexedDB:', err);
      } finally {
        recordedChunks = [];
        mediaRecorder = null;
        isStopping = false;
      }
    }

    // Create and inject the floating circular camera bubble & control bar
    function injectFloatingUI(camStream: MediaStream | null, mode: string, lang: 'es' | 'en') {
      removeOverlay();

      overlayHost = document.createElement('div');
      overlayHost.id = 'recordflow-overlay-root';
      overlayHost.style.position = 'fixed';
      overlayHost.style.zIndex = '2147483647';
      overlayHost.style.pointerEvents = 'none'; // container transparent to clicks
      overlayHost.style.top = '0';
      overlayHost.style.left = '0';
      overlayHost.style.width = '100vw';
      overlayHost.style.height = '100vh';

      shadowRoot = overlayHost.attachShadow({ mode: 'open' });

      // CSS styles inside shadow root (zero bleed, 100% isolated)
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          user-select: none;
        }

        .bubble-wrapper {
          position: fixed;
          bottom: 32px;
          left: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          pointer-events: auto;
          cursor: grab;
          transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bubble-wrapper:active {
          cursor: grabbing;
        }

        /* Circular Webcam Bubble */
        .camera-bubble {
          width: 156px;
          height: 156px;
          border-radius: 50%;
          overflow: hidden;
          background: #0f172a;
          border: 3.5px solid #6366f1;
          box-shadow: 
            0 0 25px rgba(99, 102, 241, 0.55),
            0 10px 30px rgba(0, 0, 0, 0.45);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateZ(0);
        }

        .camera-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1); /* Mirror camera for natural feel */
        }

        /* Floating Control Bar */
        .control-bar {
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 9999px;
          padding: 6px 14px 6px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
          color: #ffffff;
        }

        .rec-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #f87171;
        }

        .rec-dot {
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          border-radius: 50%;
          animation: pulse-dot 1.2s infinite ease-in-out;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.85); }
        }

        .timer-display {
          font-size: 13px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          color: #f1f5f9;
        }

        .btn-finish {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #ef4444;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
        }

        .btn-finish:hover {
          background: #dc2626;
          transform: scale(1.03);
        }

        .btn-finish:active {
          transform: scale(0.97);
        }

        .square-icon {
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-radius: 2px;
        }
      `;

      shadowRoot.appendChild(styleEl);

      const wrapper = document.createElement('div');
      wrapper.className = 'bubble-wrapper';

      // If camera enabled, create circular bubble
      if (camStream) {
        const bubble = document.createElement('div');
        bubble.className = 'camera-bubble';

        const video = document.createElement('video');
        video.className = 'camera-video';
        video.autoplay = true;
        video.playsInline = true;
        video.muted = true;
        video.srcObject = camStream;

        bubble.appendChild(video);
        wrapper.appendChild(bubble);
      }

      // Control bar
      const controlBar = document.createElement('div');
      controlBar.className = 'control-bar';

      const recIndicator = document.createElement('div');
      recIndicator.className = 'rec-indicator';
      const recDot = document.createElement('span');
      recDot.className = 'rec-dot';
      const recText = document.createElement('span');
      recText.textContent = t('floating_recording', lang);
      recIndicator.appendChild(recDot);
      recIndicator.appendChild(recText);

      const timerSpan = document.createElement('span');
      timerSpan.className = 'timer-display';
      timerSpan.textContent = '00:00';

      const finishBtn = document.createElement('button');
      finishBtn.className = 'btn-finish';
      const squareIcon = document.createElement('span');
      squareIcon.className = 'square-icon';
      const finishText = document.createElement('span');
      finishText.textContent = t('floating_finish', lang);

      finishBtn.appendChild(squareIcon);
      finishBtn.appendChild(finishText);

      finishBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopRecording(mode);
      });

      controlBar.appendChild(recIndicator);
      controlBar.appendChild(timerSpan);
      controlBar.appendChild(finishBtn);
      wrapper.appendChild(controlBar);

      // Mouse / Pointer Dragging implementation
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let elemX = 32;
      let elemY = window.innerHeight - 240;

      // Set initial position
      wrapper.style.left = `${elemX}px`;
      wrapper.style.top = `${elemY}px`;
      wrapper.style.bottom = 'auto';

      const onPointerDown = (e: PointerEvent) => {
        // Ignore clicks directly on the finish button
        if ((e.target as HTMLElement).closest('.btn-finish')) return;

        isDragging = true;
        startX = e.clientX - elemX;
        startY = e.clientY - elemY;
        wrapper.setPointerCapture(e.pointerId);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;

        let newX = e.clientX - startX;
        let newY = e.clientY - startY;

        // Clamp to screen boundaries
        const wrapperRect = wrapper.getBoundingClientRect();
        const maxX = window.innerWidth - wrapperRect.width - 10;
        const maxY = window.innerHeight - wrapperRect.height - 10;

        elemX = Math.max(10, Math.min(newX, maxX));
        elemY = Math.max(10, Math.min(newY, maxY));

        wrapper.style.left = `${elemX}px`;
        wrapper.style.top = `${elemY}px`;
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;
        try {
          wrapper.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      };

      wrapper.addEventListener('pointerdown', onPointerDown);
      wrapper.addEventListener('pointermove', onPointerMove);
      wrapper.addEventListener('pointerup', onPointerUp);
      wrapper.addEventListener('pointercancel', onPointerUp);

      shadowRoot.appendChild(wrapper);
      document.body.appendChild(overlayHost);

      // Start live timer
      recordingStartTime = Date.now();
      timerInterval = window.setInterval(() => {
        const elapsedSecs = Math.floor((Date.now() - recordingStartTime) / 1000);
        timerSpan.textContent = formatDuration(elapsedSecs);
      }, 1000);
    }

    // Main start recording logic
    async function startRecording(mode: string, mic: boolean) {
      try {
        const lang = await getCurrentLang();
        recordedChunks = [];
        isStopping = false;

        let finalCaptureStream: MediaStream;

        if (mode === 'camera') {
          // Camera Only Mode
          cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              facingMode: 'user',
            },
            audio: mic ? { echoCancellation: true, noiseSuppression: true } : false,
          });

          finalCaptureStream = cameraStream;
          injectFloatingUI(cameraStream, mode, lang);
        } else {
          // Screen Only or Screen + Camera Mode
          if (mode === 'screen-camera') {
            try {
              cameraStream = await navigator.mediaDevices.getUserMedia({
                video: {
                  width: { ideal: 640 },
                  height: { ideal: 640 },
                  facingMode: 'user',
                },
                audio: false,
              });
            } catch (camErr) {
              console.warn('[RecordFlow] Camera access failed for bubble:', camErr);
              cameraStream = null;
            }
          }

          // Inject UI onto the webpage BEFORE screen capture so screen capture records the overlay
          injectFloatingUI(cameraStream, mode, lang);

          // Prompt user to pick screen / window / tab
          screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              displaySurface: 'monitor',
            },
            audio: true, // Screen audio
          });

          // Handle user stopping via Chrome's native bar
          screenStream.getVideoTracks()[0].onended = () => {
            stopRecording(mode);
          };

          // Handle microphone mixing if active
          if (mic) {
            try {
              micStream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true },
              });

              audioContext = new AudioContext();
              const destination = audioContext.createMediaStreamDestination();

              const screenAudioTracks = screenStream.getAudioTracks();
              if (screenAudioTracks.length > 0) {
                const screenAudioSource = audioContext.createMediaStreamSource(
                  new MediaStream(screenAudioTracks)
                );
                screenAudioSource.connect(destination);
              }

              const micAudioSource = audioContext.createMediaStreamSource(micStream);
              micAudioSource.connect(destination);

              finalCaptureStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...destination.stream.getAudioTracks(),
              ]);
            } catch (micErr) {
              console.warn('[RecordFlow] Mic mixing failed, falling back to screen audio:', micErr);
              finalCaptureStream = screenStream;
            }
          } else {
            finalCaptureStream = screenStream;
          }
        }

        combinedStream = finalCaptureStream;
        const mimeType = getSupportedMimeType();

        mediaRecorder = new MediaRecorder(finalCaptureStream, {
          mimeType,
          videoBitsPerSecond: 3_000_000, // Crisp 1080p WebM recording
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          finishAndSave(mode);
        };

        mediaRecorder.start(1000); // 1s timeslices for smooth progressive chunk capture
        return { success: true };
      } catch (err: any) {
        console.error('[RecordFlow] Recording error:', err);
        releaseAllHardware();
        removeOverlay();
        chrome.runtime.sendMessage({ type: 'RECORDING_CANCELLED' });
        return { success: false, error: err?.message || 'USER_CANCELLED' };
      }
    }

    // Listen for commands from background or popup
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === 'START_RECORDING_INTERNAL') {
        startRecording(message.mode || 'screen-camera', message.mic !== false)
          .then((res) => sendResponse(res))
          .catch((err) => sendResponse({ success: false, error: err.message }));
        return true; // Keep async response channel open
      }

      if (message.type === 'STOP_RECORDING_INTERNAL') {
        stopRecording(message.mode || 'screen-camera');
        sendResponse({ success: true });
        return true;
      }
    });
  },
});
