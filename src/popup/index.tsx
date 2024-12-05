import React from "react";
import ReactDOM from "react-dom/client";
import { Popup } from "./Popup";
import { escapeBrackets, copyToClipboard } from "../util";
import { DEFAULT_FORMAT } from "../constant";

const queryInfo = {
  active: true,
  currentWindow: true,
};

chrome.tabs.query(queryInfo, function (tabs) {
  chrome.storage.local.get({ format: DEFAULT_FORMAT }, function (options) {
    const tab = tabs[0];
    const title = tab.title?.replace(/[\u200B-\u200D\uFEFF\u2060\u2061\u2062\u2063\u2064\u206A-\u206F\u2028\u2029\u202A-\u202E\u00AD]/g, '') || "";
    const url = tab.url || "";
    copyToClipboard(options.format, title, escapeBrackets(url));

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <Popup title={title} url={escapeBrackets(url)} />
      </React.StrictMode>
    );
  });
});
