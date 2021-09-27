// ==UserScript==
// @name            Dcard guest popup dismiss
// @name:ZH-TW      Dcard 訪客瀏覽腳本
// @namespace       com.sherryyue.dcardguestmode
// @version         0.3
// @description     Dismiss the annoying login request pop-up and unlock scrolling restriction while not logging in.
// @author          SherryYue
// @match           *://*.dcard.tw/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @grant           none
// ==/UserScript==

(function () {
  'use strict';
  /** login reqquest popup
   * @type HTMLElement */
  var $loginRequestPopup;

  /** if popup exsist, dismiss it. */
  var loginPopupTraker = () => {
    $loginRequestPopup = document.querySelector(".__portal>*");
    if ($loginRequestPopup) {
      breakRestriction();
    }
  }

  /** dismiss the popup and break the scrolling restriction */
  var breakRestriction = () => {
    // hide login reqquest popup
    $loginRequestPopup.style.display = "none";
    // unlock scrolling restriction
    document.body.style.overflow = "auto";
  }

  // detect every 0.5 seconds
  setInterval(loginPopupTraker, 500);
})();