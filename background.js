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

function setUserAgent() {
  userAgent = bot;
  browser.tabs.reload({
    bypassCache: true,
  });
}

function cleanTabCookies(tabs) {
  const getAllCookies = browser.cookies.getAll({
    url: tabs[0].url,
  });
  getAllCookies.then((cookies) => {
    cookies.forEach((cookie) => {
      browser.cookies.remove({
        url: tabs[0].url,
        name: cookie.name,
      });
    });
  });
  setUserAgent();
}

function getActiveTab() {
  const activeTab = browser.tabs.query({
    currentWindow: true,
    active: true,
  });
  activeTab.then(cleanTabCookies);
}

browser.browserAction.onClicked.addListener(getActiveTab);
browser.tabs.onActivated.addListener(resetUserAgent);
