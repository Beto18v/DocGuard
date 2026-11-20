import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "Eclipse — Universal Dark Mode",
    description: "Intelligent, zero-flashbang universal dark mode with smart media protection and site toggles.",
    version: "1.0.0",
    permissions: ["storage", "activeTab"],
    commands: {
      "toggle-dark-mode": {
        suggested_key: {
          default: "Alt+Shift+D",
          mac: "Alt+Shift+D",
        },
        description: "Toggle dark mode on current site",
      },
    },
    action: {
      default_title: "Eclipse Dark Mode",
    },
  },
});
