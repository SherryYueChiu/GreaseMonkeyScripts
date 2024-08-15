// ==UserScript==
// @name            Awabest sign-in mission
// @name:zh-tw      Awabest 自動簽到
// @namespace       com.sherryyue.awabestAutoDailySignin
// @version         0.2
// @description     	Auto finish daily sign-in mission at awabest.com.
// @description:zh-tw	自動完成Awabest.com每日簽到
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://awabest.com/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL 			"https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage 				"https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           none
// ==/UserScript==

(async function () {
	'use strict';
	/** await element appear
	 * @param {string} elmSelector - query selector
	 * @return {boolean} is found
	 */
	let waitElmAppear = async (elmSelector) => {
		return new Promise(resolve => {
			// tracking every 250ms
			var tracker = setInterval(() => {
				if (!!document.querySelector(elmSelector) === true) {
					clearInterval(tracker);
					resolve(0);
				}
			}, 250);
		});
	}

	let runSignInMission = async () => {
		let res = await waitElmAppear('#fwin_sign .layer_dcsignin li');
		let emojis = document.querySelectorAll('#fwin_sign .layer_dcsignin li');
		emojis[2].click();
		res = await waitElmAppear('#fwin_sign button[type="submit"]');
		let submitBtn = document.querySelector('#fwin_sign button[type="submit"]');
		submitBtn.click();
		console.log("Awabest sign-in mission finished.")
	}

	// main
	let signInBtn = document.querySelector('#dcsignin_tips');
	let isSigned = signInBtn.getAttribute("style").indexOf("signin_yes") != -1;

	if (!isSigned) {
		showWindow('sign', 'plugin.php?id=awa_signin:sign');
		// hide module window
		let res = await waitElmAppear('#fwin_sign');
		document.querySelector('#fwin_sign').style.opacity = 0;
		runSignInMission();
	}
})();