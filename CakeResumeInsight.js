// ==UserScript==
// @name            View all visitor on CakeResume insight page
// @name:zh-tw      CakeResume誰造訪了我的個人檔案
// @namespace       com.sherryyue.cakeresumeunlock
// @version         0.3
// @description     Unlock part of premium functions on https://www.cakeresume.com/. Including view all visitors and messages form them
// @description:zh-tw 解鎖部分高級功能：看見所有的訪客、查看未建立聯繫的公司傳來的完整訊息
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://*.cakeresume.com/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           none
// ==/UserScript==

(function () {
  'use strict';
  // insight page
  const class1 = 'c-viewer-card-blur';
  const class2 = 'l-viewer-card-mask';
  const class4 = "[class*='MessageChannelViewer_acceptance_']";
  // messages page & message popup
  const class3 = 'chat-connect-container';

  let errorBlockObserver = new MutationObserver((mutations, obs) => {
    const elm1 = document.querySelector(`.${class1}`);
    if (elm1) {
      document.querySelectorAll('.' + class1).forEach(elm => {
        elm.classList.remove(class1);
      });
    }
    const elm2 = document.querySelector(`.${class2}`);
    if (elm2) {
      document.querySelectorAll('.' + class2).forEach(elm => {
        elm.classList.remove(class2);
      });
    }
    const elm3 = document.querySelector(`.${class3}`);
    if (elm3) {
      document.querySelectorAll('.' + class3).forEach(elm => {
        elm.classList.remove(class3);
      });
    }
    const elm4 = document.querySelector(class4);
    if (elm4) {
      elm4.style.setProperty('background','none','important');
    }
  });

  errorBlockObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
})();