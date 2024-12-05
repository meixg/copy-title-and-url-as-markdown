import { INITIAL_OPTION_VALUES } from "./constant";
import { escapeBrackets, copyToClipboard } from "./util";

chrome.commands.onCommand.addListener((command) => {
  console.log("Command:", command);

  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    // All commands are like `copy_as_format_*` (*: 1 or 2 or 3)
    const formatIndex = command.slice(-1);
    console.log("format: ", formatIndex);

    const key = `optionalFormat${formatIndex}`;
    chrome.storage.local.get(INITIAL_OPTION_VALUES, function (options) {
      const tab = tabs[0];
      const title = tab.title?.replace(/[\u200B-\u200D\uFEFF\u2060\u2061\u2062\u2063\u2064\u206A-\u206F\u2028\u2029\u202A-\u202E\u00AD]/g, '') || "";
      const url = tab.url || "";
      const tabId = tab.id || 0;

      console.log(tab.url, tab.title);
      console.log(options);

      chrome.scripting.executeScript({
        target: { tabId },
        func: copyToClipboard,
        args: [options[key], title, escapeBrackets(url)],
      });

      chrome.action.setBadgeText({ text: formatIndex });
      setTimeout(() => {
        chrome.action.setBadgeText({ text: "" });
      }, 1000);

      console.log("done!");
    });
  });
});
