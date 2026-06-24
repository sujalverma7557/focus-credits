import { ManifestV3Export } from "@crxjs/vite-plugin";

export const manifest: ManifestV3Export = {
  manifest_version: 3,

  name: "Focus Credits",

  description:
    "Earn social media time through focused work.",

  version: "0.1.0",

  permissions: [
    "storage",
    "tabs",
    "webNavigation",
    "alarms",
  ],

  host_permissions: [
    "<all_urls>"
  ],

  action: {
    default_popup: "popup.html"
  },

  background: {
    service_worker: "src/background/background.ts",
    type: "module"
  },
  
  web_accessible_resources: [
    {
      resources: ["block.html"],
      matches: ["<all_urls>"],
    },
  ],
};

export default manifest;