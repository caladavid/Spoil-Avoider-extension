/* chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ spoilerList: ["Batman", "Deadpool", "One Piece", "AI", "internet", "Porsche", "IA", "Shein"] });
}); */

// Listener for messages sent from other parts of the extension (e.g., popup or content scripts).
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSpoilerList') {
    chrome.storage.sync.get(['spoilerList'], (data) => {
      sendResponse({ spoilerList: data.spoilerList || [] }); // Send empty list if not set
    });
    return true; // Indicate that the response is asynchronous
  }
});

// Listener for updates to tabs in the browser.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
// Skip URLs like "chrome://" or "edge://" to avoid errors specific to these internal pages.
  if (tab.url?.startsWith("chrome://") || tab.url?.startsWith("edge://")) return undefined;

  if (changeInfo.status === 'complete' && tab.url) {
    const scriptsToExecute = ['common.js'];
    if (/https:\/\/www.youtube.com\/watch.*/.test(tab.url)) {
      scriptsToExecute.push('content-watch.js');
    } else if (/https:\/\/www.youtube.com\/shorts.*/.test(tab.url)) {
      scriptsToExecute.push('content-shorts.js');
    } else {
      scriptsToExecute.push('content-general.js');
    }

    // Inject the determined scripts into the tab.
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: scriptsToExecute
    });
  }
});

