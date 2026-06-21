import {BLOCKED_SITES,} from "../shared/constants";

console.log(
    "Focus Credits background service worker started"
);

chrome.runtime.onInstalled.addListener(() => {
  console.log("Focus Credits installed");
});

chrome.tabs.onUpdated.addListener(
  async (
    tabId,
    changeInfo,
    tab
  ) => {
    if (!tab.url) {
      return;
    }

    const isBlockedSite =
      BLOCKED_SITES.some((site) =>
        tab.url!.includes(site)
      );

    if (isBlockedSite) {
      const credits =
        (
          await chrome.storage.local.get(
            "availableCredits"
          )
        ).availableCredits ?? 0;

        if (credits <= 0) {
          chrome.tabs.update(tabId, {
            url: "https://google.com",
          });
        }
    }
  }
);