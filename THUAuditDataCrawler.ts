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
  const crawler = (): void => {
    const classBlock = document.querySelectorAll<HTMLTableRowElement>("#no-more-tables>tbody>tr");
    const classCnt = classBlock.length;
    let json = '';

    for (let i = 0; i < classCnt; i++) {
      let ccode = '',
        cname = '',
        croom: string[] = [],
        ctime: string[] = [];

      // 選課代碼
      ccode = classBlock[i].querySelector<HTMLElement>('[data-title=選課代碼]')?.textContent?.trim() || '';

      // 課程名稱
      const courseNameElement = classBlock[i].querySelector<HTMLElement>('[data-title=課程名稱]');
      if (courseNameElement?.innerHTML.includes("strike")) continue;
      else {
        cname = courseNameElement?.textContent?.trim() || '';
      }

      // 地點
      const roomText = classBlock[i].querySelector<HTMLElement>("[data-title=時間地點]")?.textContent
        ?.replace('無資料', '')
        .trim()
        .match(/\[([^\[\]]*)\]/g);
      if (roomText) {
        // 去除[ ]
        croom = roomText.map(str => str.slice(1, -1));
      } else {
        console.warn(`${ccode}地點格式異常 ${roomText}`);
      }

      // 時間
      let timeRaw = classBlock[i].querySelector<HTMLElement>("[data-title=時間地點]")?.textContent
        ?.replace('無資料', '')
        .trim() || '';
      // 從原始資料去除地點資訊
      roomText?.forEach(r => {
        timeRaw = timeRaw.replace(r, '');
      });
      timeRaw = timeRaw.replaceAll('星期', '');
      ctime = timeRaw.split(/[\s,\/]/);

      if (!ctime) {
        console.warn('時間格式異常', ctime);
      }
      // 時間目標格式： ["三", "6", "7", "五", "6", "7"]

      json += `{
          "code": "${ccode || ''}",
          "name": "${cname || ''}",
          "room": ["${croom.join("\",\"") || ''}"],
          "time": ["${ctime.join("\",\"") || ''}"]
  },`;
    }
    console.log(json);
  }

  const observer = new MutationObserver((mutations, obs) => {
    if (document.querySelector("#no-more-tables>tbody>tr")) {
      crawler();
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();