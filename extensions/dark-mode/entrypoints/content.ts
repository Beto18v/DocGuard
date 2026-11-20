export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_start",
  main() {
    const STYLE_ID = "__eclipse_dark_theme__";
    const hostname = window.location.hostname;

    // CSS Engine: Inverts the DOM while strictly protecting all visual media
    const DARK_CSS = `
      html {
        filter: invert(90%) hue-rotate(180deg) contrast(95%) !important;
        background-color: #121212 !important;
      }

      /* Re-invert images, videos, canvas, and media elements to preserve real colors */
      img,
      video,
      canvas,
      iframe,
      picture,
      svg:not(:root),
      [role="img"],
      [style*="background-image"]:not([style*="linear-gradient"]) {
        filter: invert(100%) hue-rotate(180deg) !important;
      }

      /* Ensure scrollbars match dark aesthetic */
      ::-webkit-scrollbar {
        width: 10px !important;
        height: 10px !important;
        background-color: #1a1a1a !important;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #333333 !important;
        border-radius: 5px !important;
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: #555555 !important;
      }
    `;

    function applyDark() {
      if (document.getElementById(STYLE_ID)) return;
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = DARK_CSS;
      (document.head || document.documentElement).appendChild(style);
    }

    function removeDark() {
      const existing = document.getElementById(STYLE_ID);
      if (existing) existing.remove();
    }

    async function checkAndApply() {
      try {
        const data = await chrome.storage.local.get(["eclipse_enabled", "eclipse_disabled_sites"]);
        const isGlobalEnabled = data.eclipse_enabled !== false; // Default: true
        const disabledSites: string[] = data.eclipse_disabled_sites || [];

        const isSiteDisabled = disabledSites.some((site) => hostname === site || hostname.endsWith(`.${site}`));

        if (isGlobalEnabled && !isSiteDisabled) {
          applyDark();
        } else {
          removeDark();
        }
      } catch {
        // Fallback: apply default if storage read is delayed
        applyDark();
      }
    }

    // Toggle shortcut/message listener
    chrome.runtime.onMessage.addListener(async (msg, _sender, sendResponse) => {
      if (msg.type === "ECLIPSE_TOGGLE_SITE") {
        const data = await chrome.storage.local.get(["eclipse_disabled_sites"]);
        let disabledSites: string[] = data.eclipse_disabled_sites || [];

        if (disabledSites.includes(hostname)) {
          disabledSites = disabledSites.filter((s) => s !== hostname);
        } else {
          disabledSites.push(hostname);
        }

        await chrome.storage.local.set({ eclipse_disabled_sites: disabledSites });
        checkAndApply();
        sendResponse({ ok: true, isSiteDisabled: disabledSites.includes(hostname) });
      }

      if (msg.type === "ECLIPSE_GET_STATUS") {
        const data = await chrome.storage.local.get(["eclipse_enabled", "eclipse_disabled_sites"]);
        const isGlobalEnabled = data.eclipse_enabled !== false;
        const disabledSites: string[] = data.eclipse_disabled_sites || [];
        sendResponse({
          global: isGlobalEnabled,
          siteDisabled: disabledSites.includes(hostname),
          hostname,
        });
      }
    });

    // React to storage changes immediately across tabs
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && (changes.eclipse_enabled || changes.eclipse_disabled_sites)) {
        checkAndApply();
      }
    });

    // Zero-flashbang execution: apply before body finishes loading
    checkAndApply();
  },
});
