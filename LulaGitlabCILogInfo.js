// ==UserScript==
// @name            Lula Gitlab CI log tool
// @name:ZH-TW      Lula Gitlab CI log 小工具
// @namespace       com.sherryyue.lulagitlabciloginfo
// @version         0.3
// @description       Lula Gitlab CI log info
// @description:ZH-TW Lula Gitlab CI log 基本資訊顯示
// @author          SherryYue
// @match           http://gitlab.lulainno.com/RedRuby/AngPao/*
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @require         https://code.jquery.com/jquery-3.6.0.js
// @require         https://code.jquery.com/ui/1.13.1/jquery-ui.js
// @grant           GM_addStyle
// ==/UserScript==

(function () {
  var variableStartLine = 0, variableEndLine = 0;
  var CI_variables = {};

  function translateCIVariable(key) {
    if (key === 'DEPLOY') {
      return ['環境', CI_variables[key]];
    } else if (key === 'NAMESPACE') {
      let country = '';
      if (CI_variables[key] === 'thb') country = '泰國';
      else if (CI_variables[key] === 'default') country = '緬甸';
      else if (CI_variables[key] === 'php') country = '菲律賓';
      else country = CI_variables[key];
      return ['市場', country];
    } else if (key === 'NO_HOTUPDATE') {
      let icon = '';
      if (CI_variables[key] === 'true') icon = '❌'
      else icon = '✅'
      return ['熱更新', icon];
    } else if (key === 'COMMIT BRANCH') {
      let isLongString = CI_variables[key].length > 11;
      let marquee = `<marquee scrolldelay="90" scrollamount="2">${CI_variables[key]}</marquee>`;
      return ['分支', isLongString ? marquee : CI_variables[key]];
    } else if (key === 'COMMIT SHORT SHA') {
      return ['COMMIT SHA', CI_variables[key]];
    } else if (key === 'BUILD_FAILED') {
      let icon = '';
      if (CI_variables[key] === true) icon = '❌'
      else icon = '✅'
      return ['任務完成', icon];
    } else {
      return [null, null];
    }
  }

  function injectPanel(el) {
    if (document.querySelector('#yue_console')) {
      document.querySelector('#yue_console').innerHTML = '';
    }

    let html = `
<div id="yue_console"></div>
<style>
#yue_console {
  position: fixed;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  left: calc(100% - 17em);
  margin: .3rem;
  background-color: rgba(255, 255, 255, 0.6);
  font-size: .8rem;
  border: 3px solid aliceblue;
  border-radius: .5rem;
  opacity: 0;
  z-index: 999;
  transition: opacity 0.3s 0s;
}

#yue_console .line {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin: .2rem;
  border-bottom: 2px solid gray;
}
#yue_console .line .key {
  width: 8em;
  padding: 0 0 0 .5rem;
  overflow-x: hidden;
  white-space: nowrap;
}
#yue_console .line .val {
  width: 6em;
  padding: 0 .5rem 0 .5rem;
  overflow-x: hidden;
  white-space: nowrap;
}
</style>
`;
    if (el.insertAdjacentHTML) {
      el.insertAdjacentHTML("beforebegin", html);
    } else {
      let range = document.createRange();
      let frag = range.createContextualFragment(html);
      el.parentNode.insertBefore(frag, el);
    }
    let panel = document.querySelector('#yue_console');
    for (let key in CI_variables) {
      let $line = document.createElement("div");
      $line.className = 'line';

      let [_key, _val] = translateCIVariable(key);
      if (_key === null) continue;
      let $key = document.createElement("div");
      $key.className = 'key';
      $key.innerText = _key;
      let $val = document.createElement("div");
      $val.className = 'val';
      $val.innerHTML = _val;
      $line.appendChild($key);
      $line.appendChild($val);
      panel.appendChild($line);
      setTimeout(() => {
        panel.style.opacity = 1;
        panel.style.top = `calc(100% - ${2 * Object.keys(CI_variables).length + 1}em)`;
      }, 10);
    }
  }

  function main() {
    if (!document.querySelector('.build-trace-container>code')) return;
    // find whoami and variables below
    let fullLog = document.querySelectorAll('.build-trace-container>code .js-line.log-line');
    for (let i = 0; i < fullLog.length; i++) {
      let lineTxt = fullLog[i].querySelector('span').innerText;
      if (lineTxt.indexOf('$ whoami') === 0) {
        variableStartLine = i + 2;
        break;
      }
    }
    // parse
    for (let i = variableStartLine; i < fullLog.length; i++) {
      let lineTxt = fullLog[i].querySelector('span').innerText;
      let lineAnaylze = lineTxt.match(/(.+)\: (.*)/);
      if (lineAnaylze != null) {
        let key = lineAnaylze[1];
        let val = lineAnaylze[2];
        CI_variables[key] = val;
      } else {
        variableEndLine = i;
        break;
      }
    }
    // succeeded or failed
    let lastLine = fullLog[fullLog.length - 1].querySelector('span').innerText;
    if (lastLine.indexOf('Job failed') != -1) {
      CI_variables.BUILD_FAILED = true;
    } else if (lastLine.indexOf('Job succeeded') != -1) {
      CI_variables.BUILD_FAILED = false;
    }

    injectPanel(document.body);
    $("#yue_console").draggable();
  }

  setTimeout(main, 500);

  document.getElementsByTagName('head')[0].append(
    '<link '
    + 'href="//code.jquery.com/ui/1.13.1/themes/base/jquery-ui.css" '
    + ' type="text/css">'
  );

})();