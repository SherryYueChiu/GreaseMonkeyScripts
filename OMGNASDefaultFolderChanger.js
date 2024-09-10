// ==UserScript==
// @name:zh-tw      OMG NAS 自訂預設資料夾
// @name            OMG NAS Default Folder Changer
// @namespace       com.sherryyue.omgnasdefaultfolderchanger
// @version         0.1
// @description:zh-tw   開啟NAS後自動點開對內共用區
// @description         Automatically open the folder "對內共用區" after opening the NAS
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://schat.wpkgg.com:5001/*
// @run-at          document-end
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @require         http://code.jquery.com/jquery-3.4.1.min.js
// @require         https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant           none
// ==/UserScript==

(function () {
    'use strict';

    const query = '[ext\\:tree-node-id="remote\\/對內共用區"]';
    waitForKeyElements(query, () => {
        document.querySelector(query).click();
        console.log('對內共用區已幫您自動點開');
    });
})();
