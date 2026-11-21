import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "RecordFlow — Screen & Camera Recorder",
    description:
      "Free, unlimited, local-first screen and circular webcam recording. No time limits, no 25-video caps, 100% private.",
    version: "1.0.0",
    permissions: ["storage", "activeTab", "tabs"],
    action: {
      default_title: "RecordFlow",
    },
    icons: {
      16: "icon-16.png",
      48: "icon-48.png",
      128: "icon-128.png",
    },
  },
});
