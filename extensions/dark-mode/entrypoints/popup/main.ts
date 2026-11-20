document.addEventListener("DOMContentLoaded", async () => {
  const globalToggle = document.getElementById("global-toggle") as HTMLInputElement;
  const siteToggle = document.getElementById("site-toggle") as HTMLInputElement;
  const siteLabel = document.getElementById("site-label") as HTMLElement;
  const siteSublabel = document.getElementById("site-sublabel") as HTMLElement;

  // 1. Get current active tab hostname
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let currentHost = "";
  if (tab?.url) {
    try {
      const url = new URL(tab.url);
      currentHost = url.hostname;
    } catch {
      currentHost = "";
    }
  }

  siteSublabel.textContent = currentHost || "Página interna";
  if (!currentHost || currentHost.startsWith("chrome") || currentHost.startsWith("edge")) {
    siteToggle.disabled = true;
    siteLabel.textContent = "No disponible";
  }

  // 2. Load stored settings
  const data = await chrome.storage.local.get(["eclipse_enabled", "eclipse_disabled_sites"]);
  const isGlobalEnabled = data.eclipse_enabled !== false;
  const disabledSites: string[] = data.eclipse_disabled_sites || [];

  globalToggle.checked = isGlobalEnabled;
  siteToggle.checked = !disabledSites.includes(currentHost);

  // 3. Handle global toggle change
  globalToggle.addEventListener("change", async () => {
    await chrome.storage.local.set({ eclipse_enabled: globalToggle.checked });
  });

  // 4. Handle per-site toggle change
  siteToggle.addEventListener("change", async () => {
    if (!currentHost) return;
    const currentData = await chrome.storage.local.get(["eclipse_disabled_sites"]);
    let list: string[] = currentData.eclipse_disabled_sites || [];

    if (siteToggle.checked) {
      // Enabled on site -> remove from disabled list
      list = list.filter((s) => s !== currentHost);
    } else {
      // Disabled on site -> add to disabled list
      if (!list.includes(currentHost)) {
        list.push(currentHost);
      }
    }

    await chrome.storage.local.set({ eclipse_disabled_sites: list });
  });
});
