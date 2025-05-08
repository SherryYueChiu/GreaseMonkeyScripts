// ==UserScript==
// @name:zh-tw   健保快易通荷爾蒙標準更正器 - 跨女版
// @name         HealthBank Hormone Corrector - for MtF
// @namespace    com.sherryyue.healthbankmtfhormonebeautifier
// @version      0.2
// @description:zh-tw 此腳本更正健保快易通應用程式中荷爾蒙檢驗結果（如雄性激素和雌激素）的顏色顯示，無論證件上的性別為何，一律使用女性標準。這確保尚未更改證件性別的跨性別女性能看到準確且公平的荷爾蒙數值顯示。
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

  function extractNumbers(input: string) {
    const matches = input.match(/-?\d+(\.\d+)?/g);
    return matches ? matches.map(Number)[0] : 0;
  }

  function rejudgeItemColor(tableQuery: string, labelIndex: number, valueIndex: number) {
    const table = document.querySelector(tableQuery);
    if (!table) return;
    const rows = table.querySelectorAll('tr');
    rows.forEach((row) => {
      const labelCell = row.querySelectorAll('td')?.[labelIndex];
      const valueCell = row.querySelectorAll('td')?.[valueIndex];
      if (!labelCell || !valueCell) return;
      const labelText = labelCell.textContent.trim();
      const valueText = valueCell.textContent.trim();
      const value = extractNumbers(valueText);
      if (!labelText || !valueText) return;

      switch (labelText) {
        case 'Testosterone':
          const femaleMin = 0.14, femaleMax = 0.53;
          if (value < femaleMin || value > femaleMax) {
            console.warn('Testosterone value out of range:', value);
            valueCell.classList.add('sign-red');
          } else {
            console.warn('Testosterone value in range:', value);
            valueCell.classList.remove('sign-red');
          }
          break;
        case 'Estradiol(E2)':
          const e2Min = 21, e2Max = 649;
          if (value < e2Min || value > e2Max) {
            console.warn('Estradiol value out of range:', value);
            valueCell.classList.add('sign-red');
          } else {
            console.warn('Estradiol value in range:', value);
            valueCell.classList.remove('sign-red');
          }
          break;
      }
    });
  }

  function main() {
    const table4mobile = ".tab-content.d-lg-long-none table";
    const table4Desktop = ".d-none.d-lg-long-block.custom-table table";
    rejudgeItemColor(table4mobile, 1, 2);
    rejudgeItemColor(table4Desktop, 3, 4);
  }

  let observer = new MutationObserver((mutations, obs) => {
    main();
  });

  observer.observe(document.querySelector("body"), {
    childList: true,
    subtree: true
  });
})();
