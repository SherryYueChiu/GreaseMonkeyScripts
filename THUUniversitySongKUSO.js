// ==UserScript==
// @name            TungHai university song KUSO
// @name:zh-TW      東海大學校歌歌詞惡搞
// @namespace       com.sherryyue.THUUniversitySongKUSO
// @version         0.1
// @description     	Change the TungHai university song lyrics for fun.
// @description:zh-TW	惡搞東海大學校歌前兩句
// @author          SherryYue
// @match           *://*.thu.edu.tw/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @grant           none
// ==/UserScript==

(async function () {
	'use strict';
	let label1 = Array.from(document.querySelectorAll('p'))
		.find(el => el.innerText.search(/美哉[\d ]*吾校/) != -1);
	let label2 = Array.from(document.querySelectorAll('p'))
		.find(el => el.innerText.search(/東海[\d ]*之東/) != -1);
	label1.foreach(label => {
		label.innerHTML = label.innerHTML.replaceAll(/美哉.*吾校/g, "美哉吾師");
	});
	label2.foreach(label => {
		label.innerHTML = label.innerHTML.replaceAll(/東海.*之東/g, "滙儀的滙");
	});
})();