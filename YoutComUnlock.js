// ==UserScript==
// @name            Yout.com unlock paid features
// @name:zh-TW      Yout.com解鎖付費功能
// @namespace       com.sherryyue.youcomunlock
// @version         0.2
// @description     解鎖僅付費會員可用的720p和1080解析度
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://yout.com/video/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           none
// ==/UserScript==

(function () {
  'use strict';

  var breakRestriction = () => {
    // replace to other content
    let $keyArea = document.querySelector(".recorder-action");
    $keyArea.innerHTML = `
<button class="btn btn-primary btn-block btn-yout btn-recorder">
    <span class="record-circle"></span> 開始轉換 <b class="recorder-type"></b>
</button>
<a href="#" class="btn btn-danger btn-block btn-yout btn-reload hidden">影片似乎有毀損。</a>
<div class="text-center accept-terms">玥餅已經幫您解鎖此按鈕</div>
<div class="after-record alert alert-success hidden"><h3>您的格式转换即将开始。如果您喜欢 Yout.com，请告诉您的朋友。</h3></div>
<p class="text-center my-own hidden"><u>广告：</u>使用<a href="/go/pdf" rel="noopener noreferrer nofollow" target="_blank">PDF.to</a>转换 PDF。</p>
<p class="text-center my-own hidden"><u>广告：</u>查看<a href="/go/carros" rel="noopener noreferrer nofollow" target="_blank">Carros.com</a>购买和出售车辆。</p>
<p class="text-center my-own hidden"><u>广告</u>：对于网站托管去<a href="/go/hosting/" rel="nofollow" target="_blank">这里</a></p>
`;
  }

  let observer = new MutationObserver((mutations, obs) => {
    let $keyArea = document.querySelector(".recorder-action");
    if ($keyArea?.querySelector('.alert-warning')) breakRestriction();
  });

  observer.observe(document.querySelector(".recorder-action"), {
    childList: true,
    subtree: true
  });
})();