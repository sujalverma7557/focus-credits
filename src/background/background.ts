import {BLOCKED_SITES, SOCIAL_SESSION_KEY} from "../shared/constants";


async function endSocialSession() {
  const session =
    (
      await chrome.storage.local.get(
        SOCIAL_SESSION_KEY
      )
    )[SOCIAL_SESSION_KEY];

  if (!session) {
    return;
  }

  console.log(
    "Session:",
    session
  );

  const elapsedMinutes =
    Math.floor(
      (Date.now() -
        session.startTime) /
        60000
    );

  const remainingCredits =
    Math.max(
      0,
      session.creditsAtStart -
        elapsedMinutes
    );

  await chrome.storage.local.set({
    availableCredits:
      remainingCredits,
  });

  await chrome.storage.local.remove(
    SOCIAL_SESSION_KEY
  );

  console.log(
    "Spent minutes:",
    elapsedMinutes
  );

  console.log(
    "Remaining credits:",
    remainingCredits
  );
}

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

      const existingSession =
        (
          await chrome.storage.local.get(
            SOCIAL_SESSION_KEY
          )
        )[SOCIAL_SESSION_KEY];
      
      if (!existingSession) {
        const credits =
          (
            await chrome.storage.local.get(
              "availableCredits"
            )
          ).availableCredits ?? 0;

        await chrome.storage.local.set({
          [SOCIAL_SESSION_KEY]: {
            domain: tab.url,
            startTime: Date.now(),
            creditsAtStart: credits,
          },
        });
      
        console.log(
          "Started social session"
        );
      }

      const credits =
        (
          await chrome.storage.local.get(
            "availableCredits"
          )
        ).availableCredits ?? 0;

        if (credits <= 0) {
          const blockPageUrl =
            chrome.runtime.getURL("block.html");

          chrome.tabs.update(tabId, {
            url: blockPageUrl,
          });
        }
    }
  }
);

chrome.tabs.onActivated.addListener(
  async ({ tabId }) => {
    const tab =
      await chrome.tabs.get(tabId);

    if (!tab.url) {
      return;
    }

    const isBlockedSite =
      BLOCKED_SITES.some((site) =>
        tab.url!.includes(site)
      );

    if (isBlockedSite) {
      const existingSession =
        (
          await chrome.storage.local.get(
            SOCIAL_SESSION_KEY
          )
        )[SOCIAL_SESSION_KEY];

      if (!existingSession) {
        const credits =
          (
            await chrome.storage.local.get(
              "availableCredits"
            )
          ).availableCredits ?? 0;

        await chrome.storage.local.set({
          [SOCIAL_SESSION_KEY]: {
            domain: tab.url,
            startTime: Date.now(),
            creditsAtStart: credits,
          },
        });

        console.log(
          "Started social session"
        );
      }

    } else {
      await endSocialSession();
      console.log(
        "Ended social session"
      );
    }
  }
);