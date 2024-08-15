// ==UserScript==
// @name:zh-TW   健保快易通荷爾蒙標準更正器 - 跨女版
// @name         HealthBank Hormone Corrector - for MtF
// @namespace    com.sherryyue.healthbankmtfhormonebeautifier
// @version      0.1
// @description:zh-TW 此腳本更正健保快易通應用程式中荷爾蒙檢驗結果（如雄性激素和雌激素）的顏色顯示，無論證件上的性別為何，一律使用女性標準。這確保尚未更改證件性別的跨性別女性能看到準確且公平的荷爾蒙數值顯示。
// @description  This script corrects the display of hormone test results (such as androgens and estrogens) in the HealthBank app to use female standards for color coding, regardless of the gender on the ID. This ensures that transgender women who have not updated their ID gender see accurate and fair representation of their hormone levels.
// @author          SherryYue
// @copyright       SherryYue
// @match        *://myhealthbank.nhi.gov.tw/*
// @license         MIT
// @supportURL   sherryyue.c@protonmail.com
// @icon         https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL   "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage     "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function extractNumbers(input) {
    const matches = input.match(/-?\d+(\.\d+)?/g);
    return matches ? matches.map(Number)[0] : 0;
  }

  function main() {
    document.querySelectorAll('tr.pointer').forEach((tr) => {
      const columnTitle = tr.querySelectorAll('td')?.[3];
      const columnValue = tr.querySelectorAll('td')?.[4];
      if (!columnTitle || !columnValue) return;

      const isColumnTestosterone = columnTitle.textContent.trim() === 'Testosterone';
      if (isColumnTestosterone) {
        const value = extractNumbers(columnValue.textContent);
        const femaleMin = 0.14, femaleMax = 0.53;
        if (value < femaleMin || value > femaleMax) {
          console.warn('Testosterone value out of range:', value);
          columnValue.classList.add('sign-red');
        } else {
          console.warn('Testosterone value in range:', value);
          columnValue.classList.remove('sign-red');
        }
      }

      const isColumnE2 = columnTitle.textContent.trim() === 'Estradiol(E2)';
      if (isColumnE2) {
        const value = extractNumbers(columnValue.textContent);
        const femaleMin = 21, femaleMax = 649;
        if (value < femaleMin || value > femaleMax) {
          console.warn('Estradiol value out of range:', value);
          columnValue.classList.add('sign-red');
        } else {
          console.warn('Estradiol value in range:', value);
          columnValue.classList.remove('sign-red');
        }
      }
    });
  }

  let observer = new MutationObserver((mutations, obs) => {
    main();
  });

  observer.observe(document.querySelector("body"), {
    childList: true,
    subtree: true
  });
})();
