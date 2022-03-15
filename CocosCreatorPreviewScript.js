// ==UserScript==
// @name            Cocos Creator preview tool
// @name:ZH-TW      Cocos Creator 預覽小工具
// @namespace       com.sherryyue.cocoscreatorpreviewtool
// @version         0.3
// @description       Cocos Creator preview tool.
// @description:ZH-TW Cocos Creator 預覽小工具。
// @author          SherryYue
// @match           http://localhost:7456/
// @match           http://192.168.31.15:7456/*
// @match           https://*.rrbgaming66.com/
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @grant           none
// ==/UserScript==

(function () {

  let injectPanel = () => {
    let el = document.body,
      html = `
<div class="toolkit">
  <button class="hideError">Hide error</button>
</div>
<style>
.toolkit {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 99999;
}
.toolkit .hideError{
  display: none;
  opacity: 0.4;
  padding: .5rem;
  border: 2px aliceblue solid;
  color: aliceblue;
  background: darkgray;
  border-radius: .5rem;
}
#error {
    background: blue;
    border-radius: .5rem;
    max-height: 100vh;
    padding: 1rem;
    opacity: 0.6;
    pointer-events: none;
}
#error .error-main {
    word-break: break-word;
    max-height: 70vh;
}
</style>
      `;

    // Internet Explorer, Opera, Chrome, Firefox 8+ and Safari
    if (el.insertAdjacentHTML)
      el.insertAdjacentHTML("beforebegin", html);
    else {
      let range = document.createRange();
      let frag = range.createContextualFragment(html);
      el.parentNode.insertBefore(frag, el);
    }
    bindEvent();
  }

  let errorOccur = () => {
    let hideErrorBtn = document.querySelector('.hideError');
    hideErrorBtn.style.display = "block";
    hideErrorBtn.style.opacity = 1;
  }

  let hideErrorBlock = () => {
    let hideErrorBtn = document.querySelector('.hideError');
    hideErrorBtn.style.display = "block";
    hideErrorBtn.style.opacity = 0.4;
    let errorBlock = document.getElementById('error');
    errorBlock.style.display = "none";
  }

  let showErrorBlock = () => {
    let hideErrorBtn = document.querySelector('.hideError');
    hideErrorBtn.style.display = "block";
    hideErrorBtn.style.opacity = 1;
    let errorBlock = document.getElementById('error');
    errorBlock.style.display = "block";
  }

  let showErrorBtn = () => {
    let hideErrorBtn = document.querySelector('.hideError');
    hideErrorBtn.style.display = "block";
  }

  let hideErrorBtn = () => {
    let hideErrorBtn = document.querySelector('.hideError');
    hideErrorBtn.style.display = "none";
  }

  let toggleHideErrorBtn = () => {
    let hideErrorBtn = document.querySelector('.hideError');
    if (hideErrorBtn.style.display == "none") showErrorBtn();
    else hideErrorBtn();
  }

  let toggleHideErrorBlock = () => {
    let hideErrorBtn = document.querySelector('.hideError');
    if (hideErrorBtn.style.opacity == 1) hideErrorBlock();
    else showErrorBlock();
  }

  let bindEvent = () => {
    let hideErrorBtn = document.querySelector('.hideError');
    hideErrorBtn.addEventListener("click", () => {
      toggleHideErrorBlock();
    });
  }

  let errorBlockObserver = new MutationObserver((mutations, obs) => {
    const errorContent = document.querySelector('.error .error-main');
    if (errorContent && errorContent.innerHTML != "") {
      errorOccur();
      return;
    } else {
      hideErrorBtn();
      return;
    }
  });

  errorBlockObserver.observe(document.getElementById("GameDiv"), {
    childList: true,
    subtree: true
  });

  injectPanel();
})();