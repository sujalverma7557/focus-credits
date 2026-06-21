console.log(
    "Focus Credits background service worker started"
  );
  
  chrome.runtime.onInstalled.addListener(() => {
    console.log("Focus Credits installed");
  });