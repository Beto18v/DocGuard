document.addEventListener("DOMContentLoaded", async () => {
  const globalToggle = document.getElementById("global-toggle") as HTMLInputElement;
  const siteToggle = document.getElementById("site-toggle") as HTMLInputElement;
  const siteLabel = document.getElementById("site-label") as HTMLElement;
  const siteSublabel = document.getElementById("site-sublabel") as HTMLElement;

  // 1. Get current active tab hostname and check if restricted
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let currentHost = "";
  let isRestricted = false;

  if (tab?.url) {
    try {
      const url = new URL(tab.url);
      currentHost = url.hostname;
      if (!["http:", "https:"].includes(url.protocol)) {
        isRestricted = true;
      }
    } catch {
      isRestricted = true;
    }
  } else {
    isRestricted = true;
  }

  // Helper to notify the active tab immediately (0ms latency direct messaging)
  async function notifyActiveTab(payload: Record<string, unknown>) {
    if (tab?.id && !isRestricted) {
      chrome.tabs.sendMessage(tab.id, payload).catch(() => {});
    }
  }

  // Gracefully handle UI state for internal or restricted pages
  if (isRestricted) {
    siteToggle.disabled = true;
    siteToggle.checked = false;
    siteLabel.textContent = "No disponible";
    siteSublabel.textContent = currentHost || "Página interna";
  } else {
    siteSublabel.textContent = currentHost;
  }

  // 2. Load stored settings
  const data = await chrome.storage.local.get(["eclipse_enabled", "eclipse_disabled_sites"]);
  const isGlobalEnabled = data.eclipse_enabled !== false;
  const disabledSites: string[] = data.eclipse_disabled_sites || [];
  const isSiteDisabled = disabledSites.some(
    (site) => currentHost === site || currentHost.endsWith(`.${site}`)
  );

  globalToggle.checked = isGlobalEnabled;
  if (!isRestricted) {
    siteToggle.checked = !isSiteDisabled;
  }

  // 3. Handle global toggle change
  globalToggle.addEventListener("change", async () => {
    const globalEnabled = globalToggle.checked;
    notifyActiveTab({ type: "ECLIPSE_SET_STATE", globalEnabled });
    await chrome.storage.local.set({ eclipse_enabled: globalEnabled });
  });

  // 4. Handle per-site toggle change
  siteToggle.addEventListener("change", async () => {
    if (isRestricted || !currentHost) return;
    const siteEnabled = siteToggle.checked;
    notifyActiveTab({ type: "ECLIPSE_SET_STATE", siteEnabled });

    const currentData = await chrome.storage.local.get(["eclipse_disabled_sites"]);
    let list: string[] = currentData.eclipse_disabled_sites || [];

    if (siteEnabled) {
      list = list.filter((s) => s !== currentHost && !currentHost.endsWith(`.${s}`));
    } else {
      if (!list.includes(currentHost)) {
        list.push(currentHost);
      }
    }

    await chrome.storage.local.set({ eclipse_disabled_sites: list });
  });
});
