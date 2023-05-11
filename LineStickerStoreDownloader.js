// ==UserScript==
// @name            Line Store Sticker Downloader
// @name:zh-TW      Line Store 貼圖下載器
// @namespace       com.sherryyue.linestickerstoredownloader
// @version         0.1
// @description       Line Store Sticker Downloader.
// @description:ZH-TW Line Store 貼圖下載器
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           https://store.line.me/*
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @require         https://code.jquery.com/jquery-3.6.0.js
// @require         https://code.jquery.com/ui/1.13.1/jquery-ui.js
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           GM_addStyle
// ==/UserScript==

(function () {
  let downloadImage = (url) => {
    var a = document.createElement('a');
    a.href = url;
    a.download = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  let main = () => {
    $('.FnStickerPreviewItem').click(function(){
      let data = JSON.parse($(this).attr('data-preview'));
      let clearImageUrl = data.fallbackStaticUrl;
      downloadImage(clearImageUrl);
    })
  }

  let observer = new MutationObserver((mutations, obs) => {
    if (!document.querySelector(".FnStickerPreviewItem")) return;
    main();
    observer.disconnect();
  });

  observer.observe(document.querySelector("body"), {
    childList: true,
    subtree: true
  });

  document.getElementsByTagName('head')[0].append(
    '<link '
    + 'href="//code.jquery.com/ui/1.13.1/themes/base/jquery-ui.css" '
    + ' type="text/css">'
  );
})();