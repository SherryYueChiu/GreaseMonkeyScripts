// ==UserScript==
// @name            東海課程資訊網資料爬蟲
// @name:zh-tw      東海課程資訊網資料爬蟲
// @namespace       com.sherryyue.THUAuditDataCrawler
// @version         0.1
// @description     東海課程資訊網資料爬蟲
// @description:zh-tw 東海課程資訊網資料爬蟲
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://course.thu.edu.tw/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           none
// ==/UserScript==

(function () {
  let crawler = () => {
    const classBlock = document.querySelectorAll("#no-more-tables>tbody>tr");
    const classCnt = classBlock.length;
    let json = '';

    for (i = 0; i < classCnt; i++) {
      let ccode = '',
        cname = '',
        croom = [],
        ctime = [];

      // 選課代碼
      ccode = classBlock[i].querySelector('[data-title=選課代碼]').textContent.trim();

      // 課程名稱
      if (classBlock[i].querySelector('[data-title=課程名稱]').innerHTML.includes("strike")) continue;
      else {
        cname = classBlock[i].querySelector('[data-title=課程名稱]').textContent.trim();
      }

      // 地點
      let room = classBlock[i].querySelector("[data-title=時間地點]").textContent
        .replace('無資料', '')
        .trim()
        .match(/\[([^\[\]]*)\]/g);
      if (!!room) {
        // 去除[ ]
        croom = room.map(str => str.slice(1, -1));
      } else {
        console.warn(`${ccode}地點格式異常 ${room}`);
      }

      // 時間
      let timeRaw = classBlock[i].querySelector("[data-title=時間地點]").textContent
        .replace('無資料', '')
        .trim();
      // 從原始資料去除地點資訊
      room?.forEach(r => {
        timeRaw = timeRaw.replace(r, '');
      });
      timeRaw = timeRaw.replaceAll('星期', '');
      ctime = timeRaw.split(/[\s,\/]/);

      if (!ctime) {
        console.warn('時間格式異常', time);
      }
      // 時間目標格式： ["三", "6", "7", "五", "6", "7"]

      json += `{
          "code": "${ccode || ''}",
          "name": "${cname || ''}",
          "room": ["${croom.join("','") || ''}"],
          "time": ["${ctime.join("','") || ''}"]
  },`;
    }
    console.log(json);
  }

  let observer = new MutationObserver((mutations, obs) => {
    if(document.querySelector("#no-more-tables>tbody>tr")){
      crawler();
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();