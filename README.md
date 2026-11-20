# 🌐 Browser Extensions Suite

<div align="center">

**Modular, production-ready browser extensions built with WXT, Manifest V3, TypeScript, and Vite.**

[![Manifest V3](https://img.shields.io/badge/Manifest_V3-Chrome_%7C_Edge_%7C_Brave-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![WXT Framework](https://img.shields.io/badge/WXT-Framework-6366f1?logo=vite&logoColor=white)](https://wxt.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📦 Extensions in this Suite

| Extension | Category | Architecture | Store Status | Features |
|---|---|---|---|---|
| **🛡️ DocGuard** | EdTech / NLP | Manifest V3 + Vanilla JS | ✅ **Microsoft Edge Add-ons** (`0RDCKDXTP32J`) | In-browser NLP (Shingling + Jaccard), OpenAlex (250M+ papers), Wikipedia API, $0 cloud cost. |
| **🌙 Eclipse** | Productivity / Utility | **WXT** + Vite + TypeScript | 🚀 Ready to load (Unpacked / Zip) | Zero-flashbang universal dark mode (`document_start`), smart media protection, per-site toggles, `Alt+Shift+D`. |

---

## ⚡ 60-Second Quickstart (Test in Chrome, Edge, or Brave)

### 1. Test **Eclipse (Universal Dark Mode)**
1. Clone this repository:
   ```bash
   git clone https://github.com/Beto18v/browser-extensions.git
   cd browser-extensions/extensions/dark-mode
   ```
2. Install dependencies & build:
   ```bash
   npm install
   npm run build
   ```
3. Open `chrome://extensions` (or `edge://extensions` / `brave://extensions`).
4. Enable **Developer mode** (toggle in the top-right corner).
5. Click **Load unpacked** and select `extensions/dark-mode/.output/chrome-mv3`.
6. Visit any light website (e.g. Wikipedia or news site) and toggle dark mode with `Alt + Shift + D` or from the popup menu!

### 2. Test **DocGuard (Originality Auditor)**
1. In `chrome://extensions` (or `edge://extensions`), click **Load unpacked**.
2. Select the folder `extensions/docguard`.
3. Open any [Google Doc](https://docs.google.com/document/create).
4. Click the DocGuard icon in the extensions bar to open the SidePanel and run the audit.

---

## 🧪 Automated Testing

DocGuard includes a standalone test suite verifying NLP algorithms, table of contents filters, math formula protections, and live knowledge APIs:

```bash
npm run test:docguard
```

```text
Results: 16 passed, 0 failed
```

---

## 🛠️ Tech Stack & Engineering Highlights

- **WXT (Web Extension Framework):** Next-gen extension tooling powered by Vite, providing instant HMR and automatic MV3 compilation.
- **Zero-Flashbang DOM Injection:** Injects dark themes at `document_start` before HTML parsing finishes, eliminating bright white flashes.
- **Smart Media Inversion Protection:** Preserves original colors for `<img>`, `<video>`, `<canvas>`, and `<iframe>` elements.
- **Client-Side NLP Engine:** High-performance shingling (5-gram) and cosine similarity without sending user data to external servers.

---

## 👤 Author

**Nicolas Valenzuela** — *AI & Full-Stack Software Engineer*  
- Portfolio: [nival.is-a.dev](https://nival.is-a.dev)  
- GitHub: [@Beto18v](https://github.com/Beto18v)  
- LinkedIn: [in/beto18v](https://www.linkedin.com/in/beto18v/)
