// ==UserScript==
// @name            Trnt.lgbt game script
// @name:zh-tw      不明小站遊戲腳本
// @namespace       com.sherryyue.trntLgbtScript
// @version         0.3
// @description     	Auto finish daily sign-in mission： 每日搖搖樂、兔兔採蘑菇、城市PK
// @description:zh-tw	自動簽到：每日搖搖樂、兔兔採蘑菇、城市PK
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://trnt.lgbt/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           GM_setValue
// @grant           GM_getValue
// ==/UserScript==

(async function () {
  /** await element appear
   * @param {string} elmSelector - query selector
   * @param {number} [waitUntil=5] - seconds
   */
  let waitElmAppear = async (elmSelector: string, waitUntil = 5) => {
    return new Promise(resolve => {
      // tracking every 250ms
      let countDown = waitUntil * 20;
      var tracker = setInterval(() => {
        countDown--;
        if (countDown <= 0 || !!document.querySelector(elmSelector) === true) {
          clearInterval(tracker);
          resolve(0);
        }
      }, 50);
    });
  }

  let getDate = () => {
    let dt = new Date();
    return `${dt.getMonth()}/${dt.getDate()}`
  }

  /**
   * 兔兔採蘑菇 - 採蘑菇
   * @param {number} times
   */
  let collectMushroom = (times: number) => {
    let cnt = times;
    setInterval(() => {
      if (cnt >= 0) {
        (window as any).getMushRoom();
        cnt--;
      }
    }, 50);
  }

  /** 每日搖搖樂 */
  let game_dailyDraw = async () => {
    await waitElmAppear("#yyl-random-box");
    if (!!document.querySelector("#yyl-random-box")) {
      (document.getElementById('zzza_fw1') as HTMLInputElement).value = '999';
      (document.getElementById('yinxingfei_zzza_form') as HTMLFormElement).submit();
      GM_setValue('game_dailyDraw', getDate());
      console.log("done");
    }
  }

  /** 兔兔採蘑菇 */
  let game_mushroom = () => {
    let timesLeft = parseInt(document.querySelector("#playnum").innerHTML) || 0;
    if (timesLeft !== 0) collectMushroom(timesLeft);
    console.log("done");
  }

  /** 城市PK */
  let game_cityPK = async () => {
    (window as any).showWindow('hux_city', 'plugin.php?id=hux_city:hux_city&mod=sign', 'get', 0);
    await waitElmAppear("#hcwindow form");
    document.querySelector<HTMLElement>('#hcwindow').style.opacity = '0';
    if (document.querySelector('#hcwindow form').innerHTML.indexOf("未簽到") != -1) {
      (document.querySelector('#hcwindow form .submit') as HTMLButtonElement).click();
      GM_setValue('game_cityPK', getDate());
      console.log("done");
    } else (window as any).hideWindow('hux_city');
  }

  // main
  const urlParams = new URLSearchParams(window.location.search);
  const pageId = urlParams.get('id');
  if (pageId === "yinxingfei_zzza:yinxingfei_zzza_hall") {
    if (GM_getValue('game_dailyDraw') != getDate()) game_dailyDraw();
  } else if (pageId === "genee_everydaymushroom:genee_mushroom") {
    game_mushroom();
  } else if (pageId === "hux_city:hux_city") {
    if (GM_getValue('game_cityPK') != getDate()) game_cityPK();
  }
})();