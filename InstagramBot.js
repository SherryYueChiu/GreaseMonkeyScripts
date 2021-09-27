// ==UserScript==
// @name            Instagram bot
// @name:zh-TW      Instgram機器人
// @namespace       com.sherryyue.instagramBot
// @version         0.1
// @description     	Auto reply
// @description:zh-TW	自動回覆
// @author          SherryYue
// @match           https://www.instagram.com/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @grant           GM_setValue
// @grant           GM_getValue
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

(function () {
  let $chatList = document.querySelector(".N9abW");
  let $eachChat = document.querySelectorAll(".-qQT3.rOtsg");
  let $replyArea = document.querySelector(".X3a-9");

  /** await element appear
   * @param {string} elmSelector - query selector
   * @param {number} [waitUntil=5] - seconds
   */
  let waitElmAppear = async (elmSelector, waitUntil = 5) => {
    return new Promise(resolve => {
      // tracking every 250ms
      let countDown = waitUntil * 20;
      var tracker = setInterval(() => {
        countDown--;
        if (countDown <= 0 || !!document.querySelector(elmSelector) === true) {
          clearInterval(tracker);
          resolve(0);
        }
      }, 50);
    });
  }

  /** 是否在訊息頁面 */
  let isInInboxPage = () => {
    return location.href.indexOf("https://www.instagram.com/direct/") != -1;
  }

  /**是否已經點開私聊 */
  let isInPMMode = () => {
    return location.href.indexOf("https://www.instagram.com/direct/t/") != -1;
  }

  /** 進入訊息頁面 */
  let gotoInbox = () => {
    location.href = "https://www.instagram.com/direct/inbox/";
  }

  /** 離開私聊模式 */
  let leavePMMode = () => {
    location.href = "https://www.instagram.com/direct/inbox/";
  }

  /** 進入訊息頁面 */
  let clickSendMsg = () => {
    let $replyArea = document.querySelector(".X3a-9");
    $replyArea.children[2].children[0].click();
  }

  /** 執行下一動 */
  let doNextTask = async () => {
    let nextTask = GM_getValue("nextTask");
    if (!!nextTask) {
      let $replyArea = document.querySelector(".X3a-9");
      if (nextTask === "replyMsg") {
        console.log(`Send a sticker: ✔`);
        $replyArea.children[0].children[0].click();
        console.log($replyArea.children[0].children[0])
        let stickers = document.querySelectorAll(".uo5MA._2ciX.WNrPq button");
        stickers.forEach(sticker => {
          if (sticker.textContent == "✔")
            sticker.click();
        });
        $replyArea.children[2].children[0].click();

        // setTimeout(leavePMMode, 4200);
      }
      else if (nextTask === "sendLike") {
        console.log("Send a like");
        $replyArea.children[4].click();
        leavePMMode();
      }
    }
  }

  /** 進入訊息頁面 */
  let startDetect = () => {
    let $unreadDot = document.querySelector(".Sapc9");
    if ($unreadDot) {
      console.log("Found unread dot");
      GM_setValue("nextTask", "replyMsg");
      $unreadDot.click();
      timer = clearInterval();
      doNextTask();
    }
  }

  let timer = null;
  /** 程式人口 */
  let main = () => {
    if (isInInboxPage()) {
      if (isInPMMode()) {
        console.log("Now in PM mode");
        doNextTask();
      } else {
        console.log("Now in inbox page");
        console.log("Start detect");
        timer = setInterval(startDetect, 500);
      }
    }
    else gotoInbox();
  }

  main();
})();