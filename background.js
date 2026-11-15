/* ═══════════════════════════════════════════════════════════
   DocGuard v2.0 — Background Service Worker (Manifest V3)
   Handles: Google Doc text export + DuckDuckGo web verification
   Zero API keys · Zero external dependencies
   ═══════════════════════════════════════════════════════════ */

const enableSidePanelOnActionClick = async () => {
  try {
    if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    }
  } catch (error) {
    console.error("DocGuard: Error configuring sidePanel:", error);
  }
};

enableSidePanelOnActionClick();
chrome.runtime.onInstalled.addListener(enableSidePanelOnActionClick);

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  // 1. Download plain text from the active Google Doc (CORS-free via service worker)
  if (msg.type === "FETCH_DOC_TEXT") {
    const exportUrl = `https://docs.google.com/document/d/${encodeURIComponent(msg.docId)}/export?format=txt`;
    fetch(exportUrl, {
      method: "GET",
      credentials: "include",
      redirect: "follow",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} exporting document.`);
        }
        const contentType = (
          res.headers.get("content-type") || ""
        ).toLowerCase();
        const text = await res.text();
        if (
          contentType.includes("text/html") ||
          text.trimStart().startsWith("<!DOCTYPE html") ||
          text.trimStart().startsWith("<html")
        ) {
          throw new Error(
            "Google Docs returned a login page instead of document text."
          );
        }
        sendResponse({ ok: true, text: text.replace(/^\uFEFF/, "").trim() });
      })
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  // 2. Verify exact phrase match on DuckDuckGo HTML (no API key needed)
  if (msg.type === "CHECK_WEB_PHRASE") {
    const query = encodeURIComponent(`"${msg.phrase}"`);
    fetch(`https://html.duckduckgo.com/html/?q=${query}`)
      .then((res) => res.text())
      .then((html) => {
        const noResults =
          html.includes("No results found") ||
          html.includes("No se encontraron resultados") ||
          !html.includes("result__a");

        let sourceUrl = "";
        const linkMatch = html.match(/class="result__a"[^>]*href="([^"]+)"/);
        if (linkMatch && linkMatch[1]) {
          sourceUrl = linkMatch[1];
          // Decode clean URL from DuckDuckGo's uddg redirect wrapper
          const uddgMatch = sourceUrl.match(/uddg=([^&]+)/);
          if (uddgMatch && uddgMatch[1]) {
            sourceUrl = decodeURIComponent(uddgMatch[1]);
          }
        }
        sendResponse({ ok: true, matched: !noResults, sourceUrl });
      })
      .catch(() => sendResponse({ ok: true, matched: false, sourceUrl: "" }));
    return true;
  }
});
