// ==UserScript==
// @name            View all visitor on CakeResume insight page
// @name:zh-tw      CakeResume誰造訪了我的個人檔案
// @namespace       com.sherryyue.cakeresumeinsight
// @version         0.1
// @description     view all vistors without paid function on https://www.cakeresume.com/dashboard/insights
// @description:zh-tw 在誰造訪了我的個人檔案的頁面中，不需付費就能看見所有的訪客
// @author          SherryYue
// @match           *://*.cakeresume.com/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @grant           none
// ==/UserScript==

(function () {
  'use strict';

  const class1 = 'c-viewer-card-blur';
  const class2 = 'l-viewer-card-mask';

  const removeBlursAndMasks = () => {
    document.querySelectorAll('.' + class1).forEach(elm => {
      elm.classList.remove(class1);
    });
    document.querySelectorAll('.' + class2).forEach(elm => {
      elm.classList.remove(class2);
    });
  }
  // main
  setTimeout(() => {
    if (document.querySelector('.' + class1)) {
      removeBlursAndMasks();
    }
  }, 1500);
})();