// ==UserScript==
// @name            Dcard guest popup dismiss
// @name:zh-TW      Dcard 訪客瀏覽腳本
// @namespace       com.sherryyue.dcardguestmode
// @version         0.6
// @description     Dismiss the annoying login request pop-up and unlock scrolling restriction while not logging in.
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://*.dcard.tw/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           none
// ==/UserScript==

(function () {
  'use strict';
  /** login reqquest popup
   * @type HTMLElement */
  var $loginRequestPopup;

  /** dismiss the popup and break the scrolling restriction */
  var breakRestriction = () => {
    // hide login reqquest popup
    $loginRequestPopup.style.display = "none";
    // unlock scrolling restriction
    document.body.style.overflow = "auto";
  }

  let observer = new MutationObserver((mutations, obs) => {
    $loginRequestPopup = document.querySelector(".__portal>*");
    if ($loginRequestPopup) breakRestriction();
  });

  observer.observe(document.querySelector(".__portal"), {
    childList: true,
    subtree: true
  });
})();