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
| **🛡️ DocGuard** | EdTech / NLP | **WXT** + Vite + TypeScript | ✅ **Microsoft Edge Add-ons** (`0RDCKDXTP32J`) | In-browser NLP (Shingling + Jaccard), OpenAlex (250M+ papers), Wikipedia API, $0 cloud cost. |
| **🌙 Eclipse** | Productivity / Utility | **WXT** + Vite + TypeScript | 🚀 Ready to load (Unpacked / Zip) | Zero-flashbang universal dark mode (`document_start`), smart media protection, per-site toggles, `Alt+Shift+D`. |
| **⏺️ RecordFlow** | Video / Productivity | **WXT** + Vite + TypeScript | 🚀 Ready to load (Unpacked / Zip) | Free, unlimited Loom alternative. Circular floating draggable webcam bubble, local-first IndexedDB storage, 0 caps. |

---

## ⚡ 60-Second Quickstart (Test in Chrome, Edge, or Brave)

### 1. Test **Eclipse (Universal Dark Mode)**
1. Build the extension:
   ```bash
   npm run build:dark-mode
   ```
2. Open `chrome://extensions` (or `edge://extensions` / `brave://extensions`).
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select `extensions/dark-mode/.output/chrome-mv3`.
5. Visit any light website and toggle dark mode with `Alt + Shift + D` or from the popup menu!

### 2. Test **RecordFlow (Screen & Camera Recorder — Loom Alternative)**
1. Build the extension:
   ```bash
   npm run build:recordflow
   ```
2. In `chrome://extensions` (or `edge://extensions`), click **Load unpacked**.
3. Select the folder `extensions/recordflow/.output/chrome-mv3`.
4. Click the RecordFlow icon in the extensions bar, pick your mode (**Pantalla + Cámara**, **Solo Pantalla**, or **Solo Cámara**), and click **Iniciar Grabación**!
5. Experience the circular draggable webcam bubble, live timer, and instant preview studio with local `.webm` downloads.

### 3. Test **DocGuard (Originality Auditor)**
1. Build the extension:
   ```bash
   npm run build:docguard
   ```
2. In `chrome://extensions` (or `edge://extensions`), click **Load unpacked**.
3. Select the folder `extensions/docguard/.output/chrome-mv3`.
4. Open any [Google Doc](https://docs.google.com/document/create).
5. Click the DocGuard icon in the extensions bar to open the SidePanel and run the audit.

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

## 📦 One-Click Packaging (`/releases`)

Generate production-ready store zip files for **all 3 extensions** with automatic versioning:

```bash
npm run pack
```

All ZIP archives are automatically built, versioned, and collected into the root `releases/` directory:
- `releases/docguard-v2.1.0.zip`
- `releases/dark-mode-universal-v1.0.0.zip`
- `releases/recordflow-v1.0.0.zip`

*(A pre-commit Git hook and GitHub Action automatically keep these ZIPs fresh whenever you commit and push).*

---

## 🛠️ Tech Stack & Engineering Highlights

- **WXT (Web Extension Framework):** Next-gen extension tooling powered by Vite, providing instant HMR and automatic MV3 compilation.
- **Floating Circular Webcam Overlay:** Draggable Shadow DOM bubble with glowing indigo border and live mirror webcam feed with zero host page CSS interference.
- **Local-First Zero-Cloud Storage:** High-performance IndexedDB streaming storage for unlimited recordings without third-party cloud costs or privacy exposure.
- **Zero-Flashbang DOM Injection:** Injects dark themes at `document_start` before HTML parsing finishes, eliminating bright white flashes.
- **Smart Media Inversion Protection:** Preserves original colors for `<img>`, `<video>`, `<canvas>`, and `<iframe>` elements.
- **Client-Side NLP Engine:** High-performance shingling (5-gram) and cosine similarity without sending user data to external servers.

---

## 👤 Author

**Nicolas Valenzuela** — *AI & Full-Stack Software Engineer*  
- Portfolio: [nival.is-a.dev](https://nival.is-a.dev)  
- GitHub: [@Beto18v](https://github.com/Beto18v)  
- LinkedIn: [in/beto18v](https://www.linkedin.com/in/beto18v/)
