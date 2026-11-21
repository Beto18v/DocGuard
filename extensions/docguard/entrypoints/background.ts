/**
 * DocGuard v2.1 — Background Service Worker (Manifest V3)
 * Handles: Google Doc text export + Hybrid Web Engine (Wikipedia + OpenAlex)
 * Zero external dependencies · Zero API keys
 */

export default defineBackground(() => {
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

  chrome.runtime.onMessage.addListener(
    (msg: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
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
            const contentType = (res.headers.get("content-type") || "").toLowerCase();
            const text = await res.text();
            if (
              contentType.includes("text/html") ||
              text.trimStart().startsWith("<!DOCTYPE html") ||
              text.trimStart().startsWith("<html")
            ) {
              throw new Error("Google Docs returned a login page instead of document text.");
            }
            sendResponse({ ok: true, text: text.replace(/^\uFEFF/, "").trim() });
          })
          .catch((err: Error) => sendResponse({ ok: false, error: err.message }));
        return true;
      }

      // 2. Verify exact phrase match across open knowledge (Wikipedia + OpenAlex)
      if (msg.type === "CHECK_WEB_PHRASE") {
        const phrase = (msg.phrase || "").trim();
        const primaryLang = msg.lang === "en" ? "en" : "es";
        const secondaryLang = primaryLang === "es" ? "en" : "es";

        interface WebSuccessResult {
          matched: boolean;
          sourceUrl: string;
          sourceTitle: string;
          sourceSnippet: string;
          sourceType: string;
        }

        interface RateLimitResult {
          ok: false;
          error: "rate_limited";
        }

        // Layer A: Wikipedia Full-Text Search
        const queryWiki = async (lang: string, queryPhrase: string): Promise<WebSuccessResult | null> => {
          try {
            const url = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent('"' + queryPhrase + '"')}&utf8=&format=json&origin=*`;
            const res = await fetch(url);
            if (!res.ok) return null;
            const data = await res.json();
            const hits = data.query?.search;
            if (hits && hits.length > 0) {
              const top = hits[0];
              const cleanTitle = top.title;
              const pageUrl = `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(cleanTitle.replace(/ /g, "_"))}`;
              const cleanSnippet = (top.snippet || "").replace(/<[^>]+>/g, "").trim();
              return {
                matched: true,
                sourceUrl: pageUrl,
                sourceTitle: `${cleanTitle} (Wikipedia)`,
                sourceSnippet: cleanSnippet,
                sourceType: "wikipedia",
              };
            }
          } catch {
            // Fall through
          }
          return null;
        };

        // Layer B: OpenAlex Academic Papers & Research (250M+ scientific publications)
        const queryOpenAlex = async (queryPhrase: string): Promise<WebSuccessResult | RateLimitResult | null> => {
          try {
            const cleanPhrase = queryPhrase.replace(/["\\]/g, "").trim();
            const quoted = `"${cleanPhrase}"`;
            const url = `https://api.openalex.org/works?search=${encodeURIComponent(quoted)}&per_page=1&mailto=docguard.open@gmail.com`;
            const res = await fetch(url);
            if (!res.ok) {
              if (res.status === 429) return { ok: false, error: "rate_limited" };
              return null;
            }
            const data = await res.json();
            const count = data.meta?.count || 0;
            if (count > 0 && data.results && data.results.length > 0) {
              const top = data.results[0];
              if (top.title) {
                const paperUrl = top.doi || top.id || `https://openalex.org/${top.id}`;
                const shortTitle = top.title.length > 55 ? `${top.title.slice(0, 52)}…` : top.title;
                return {
                  matched: true,
                  sourceUrl: paperUrl,
                  sourceTitle: `${shortTitle} (Paper)`,
                  sourceSnippet: top.title,
                  sourceType: "academic",
                };
              }
            }
          } catch {
            // Fall through
          }
          return null;
        };

        (async () => {
          try {
            // 1. Try primary Wikipedia
            let result: WebSuccessResult | RateLimitResult | null = await queryWiki(primaryLang, phrase);

            // 2. Try secondary Wikipedia
            if (!result) {
              result = await queryWiki(secondaryLang, phrase);
            }

            // 3. Try OpenAlex for academic papers if phrase has sufficient depth
            if (!result && phrase.split(/\s+/).length >= 5) {
              result = await queryOpenAlex(phrase);
            }

            if (result && "error" in result && result.error === "rate_limited") {
              sendResponse({ ok: false, error: "rate_limited" });
            } else if (result && "matched" in result) {
              sendResponse({
                ok: true,
                matched: true,
                sourceUrl: result.sourceUrl,
                sourceTitle: result.sourceTitle,
                sourceSnippet: result.sourceSnippet,
                sourceType: result.sourceType,
              });
            } else {
              sendResponse({ ok: true, matched: false, sourceUrl: "" });
            }
          } catch (err: unknown) {
            sendResponse({ ok: false, error: err instanceof Error ? err.message : String(err) });
          }
        })();
        return true;
      }

      // Unknown message type
      return false;
    }
  );
});
