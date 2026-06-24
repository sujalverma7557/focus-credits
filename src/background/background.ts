import {BLOCKED_SITES, SOCIAL_SESSION_KEY} from "../shared/constants";
import { getRemainingCredits } from "../shared/credits";

const CREDIT_CHECK_ALARM =
  "creditCheck";


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

  const remainingCredits =
  getRemainingCredits(session);

  await chrome.storage.local.set({
    availableCredits:
      remainingCredits,
  });

  await chrome.storage.local.remove(
    SOCIAL_SESSION_KEY
  );

  await chrome.alarms.clear(
    CREDIT_CHECK_ALARM
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
        
        return;
      }

      if (!existingSession) {
        await chrome.storage.local.set({
          [SOCIAL_SESSION_KEY]: {
            domain: tab.url,
            startTime: Date.now(),
            creditsAtStart: credits,
          },
        });

        chrome.alarms.create(
          CREDIT_CHECK_ALARM,
          {
            periodInMinutes: 1,
          }
        );

        console.log(
          "Started social session"
        );
      }

      // const credits =
      //   (
      //     await chrome.storage.local.get(
      //       "availableCredits"
      //     )
      //   ).availableCredits ?? 0;

        // if (credits <= 0) {
        //   const blockPageUrl =
        //     chrome.runtime.getURL("block.html");

        //   chrome.tabs.update(tabId, {
        //     url: blockPageUrl,
        //   });
        // }
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
      
        return;
      }

      if (!existingSession) {
        await chrome.storage.local.set({
          [SOCIAL_SESSION_KEY]: {
            domain: tab.url,
            startTime: Date.now(),
            creditsAtStart: credits,
          },
        });

        chrome.alarms.create(
          CREDIT_CHECK_ALARM,
          {
            periodInMinutes: 1,
          }
        );

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

chrome.alarms.onAlarm.addListener(
  async (alarm) => {
    if (
      alarm.name !==
      CREDIT_CHECK_ALARM
    ) {
      return;
    }

    const session =
      (
        await chrome.storage.local.get(
          SOCIAL_SESSION_KEY
        )
      )[SOCIAL_SESSION_KEY];

    if (!session) {
      return;
    }

    const remainingCredits =
      getRemainingCredits(session);

    await chrome.storage.local.set({
      availableCredits:
        remainingCredits,
    });

    if (remainingCredits <= 0) {
      console.log(
        "Credits exhausted"
      );
    
      await chrome.storage.local.remove(
        SOCIAL_SESSION_KEY
      );
    
      await chrome.alarms.clear(
        CREDIT_CHECK_ALARM
      );
    
      const tabs =
        await chrome.tabs.query({});
    
      const blockedTab = tabs.find(
        (tab) =>
          tab.url &&
          BLOCKED_SITES.some((site) =>
            tab.url!.includes(site)
          )
      );
    
      if (blockedTab?.id) {
        const blockPageUrl =
          chrome.runtime.getURL(
            "block.html"
          );
    
        chrome.tabs.update(
          blockedTab.id,
          {
            url: blockPageUrl,
          }
        );
      }
    }

    console.log(
      "Alarm fired:",
      alarm.name
    );

    console.log(
      "Remaining credits:",
      remainingCredits
    );
  }
);