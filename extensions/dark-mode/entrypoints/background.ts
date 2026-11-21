export default defineBackground(() => {
  // Toggle dark mode on current tab via keyboard shortcut (Alt+Shift+D)
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === "toggle-dark-mode") {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (
          tab?.id &&
          tab.url &&
          !tab.url.startsWith("chrome://") &&
          !tab.url.startsWith("edge://") &&
          !tab.url.startsWith("chrome-extension://") &&
          !tab.url.startsWith("about:")
        ) {
          chrome.tabs.sendMessage(tab.id, { type: "ECLIPSE_TOGGLE_SITE" }).catch(() => {});
        }
      } catch {
        // Prevent uncaught errors on closed or restricted tabs
      }
    }
  });
});
