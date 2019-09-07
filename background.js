"use strict";

const browserUserAgent = navigator.userAgent;
const bot = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
let userAgent = browserUserAgent;

function setUserAgentHeader(details) {
  details.requestHeaders.forEach((header) => {
    if (header.name.toLowerCase() === "user-agent") {
      header.value = userAgent;
    }
  });
  return {
    requestHeaders: details.requestHeaders,
  };
}

browser.webRequest.onBeforeSendHeaders.addListener(setUserAgentHeader, {
    urls: ["<all_urls>"]
  },
  ["blocking", "requestHeaders"]);

function resetUserAgent() {
  userAgent = browserUserAgent;
}

function setUserAgentString() {
  userAgent = bot;
  browser.tabs.reload({
    bypassCache: true,
  });
}

browser.browserAction.onClicked.addListener(setUserAgentString);
browser.tabs.onActivated.addListener(resetUserAgent);
