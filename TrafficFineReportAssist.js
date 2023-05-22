// ==UserScript==
// @name            TrafficFineReportAssist
// @name:zh-TW      交通違規檢舉輸入助手
// @namespace       com.sherryyue.TrafficFineReportAssist
// @version         0.6
// @description     交通違規檢舉輸入助手
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://suggest.police.taichung.gov.tw/*
// @match           *://jiaowei.ncpb.gov.tw/sc11/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           none
// ==/UserScript==

(function () {
  'use strict';

  const GENDER = {
    MALE: 1,
    FEMALE: 2,
  }
  const profile = {
    /** 全名 */
    fullName: '',
    /** 性別 GENDER.MALE 或 GENDER.FEMALE */
    gender: GENDER.FEMALE,
    /** 身分證字號 */
    id: '',
    /** 你的聯絡地址 */
    addr: '',
    /** 家用電話或手機號碼 */
    tel: '',
    /** 電子信箱 */
    mail: '',
  }

  function taichung() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/traffic/' || urlPathName === '/traffic/index.jsp') {
      field.disclaimerRead = document.querySelector('#OK');

      field.disclaimerRead.click();
      field.disclaimerRead.click();
      field.disclaimerRead.checked = true;
      window.scrollTo(0, document.body.scrollHeight);
    } else if (urlPathName === '/traffic/traffic_write.jsp') {
      field.fullName = document.querySelector('#name');
      field.genderMale = document.querySelector('#male');
      field.genderFemale = document.querySelector('#female');
      field.nation = document.querySelector('#taiwan');
      field.id = document.querySelector('#sub');
      field.addr = document.querySelector('#address');
      field.tel = document.querySelector('#liaisontel');
      field.mail = document.querySelector('#email');
      field.actSelect = document.querySelector('#qclass');
      field.dateTime = document.querySelector('#violationdatetime');
      field.detail = document.querySelector('#detailcontent');

      field.fullName.value = profile.fullName;
      if (profile.gender === GENDER.FEMALE) field.genderFemale.click();
      else if (profile.gender === GENDER.MALE) field.genderMale.click();
      field.nation.click();
      field.id.value = profile.id;
      field.addr.value = profile.addr;
      field.tel.value = profile.tel;
      field.mail.value = profile.mail;
      field.dateTime.removeAttribute('readonly');
      // 依下拉選單自動填入描述
      field.actSelect.onchange = () => {
        field.detail.value = field.actSelect.value.replace(/^道交[\d-、之第項]+/gi, '');
      }
      // 客製化車牌輸入，可以直接輸入整串
      document.querySelectorAll('#license1>*').forEach(elm => elm.style?.setProperty('display', 'none'));
      const customLicenseInput = document.createElement('input');
      customLicenseInput.setAttribute('placeholder', '完整車牌，包含-');
      customLicenseInput.style.setProperty('display', 'block');
      customLicenseInput.style.setProperty('width', 'calc(80% - 7px)');
      document.querySelector('#license1').insertBefore(customLicenseInput, document.querySelector('#license1 label'));
      customLicenseInput.oninput = (() => {
        const licenseInputL = document.querySelector('#licensenumber2');
        const licenseInputR = document.querySelector('#licensenumber3');
        const [licenseNumL, licenseNumR] = customLicenseInput.value.split('-');
        licenseInputL.value = licenseNumL || '';
        licenseInputR.value = licenseNumR || '';
      });
    }
  }

  function nanTou() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/sc11/rwd/rincase1.aspx') {
      field.nextBtn = document.querySelector('#Button1');
      field.nextBtn.click();
    } else if (urlPathName === '/sc11/rwd/rincase2.aspx') {
      window.scrollTo(0, document.body.scrollHeight);
    } else if (urlPathName === '/sc11/rwd/rincase3.aspx') {
      field.fullName = document.querySelector('#mname');
      field.id = document.querySelector('#mpid');
      field.tel = document.querySelector('#mtel');
      field.addr = document.querySelector('#maddr');
      field.mail = document.querySelector('#memail');
      field.actSelect = document.querySelector('#rlid');
      field.detail = document.querySelector('#mcarblack');

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
      // 依下拉選單自動填入描述
      field.actSelect.onchange = () => {
        // 連續的option可能是同一條
        const option = field.actSelect.querySelectorAll(`option[value='${field.actSelect.value}']`);
        const content = [...option].map(elm => elm.textContent).join('');
        field.detail.value = content.replace(/^[\d-、之第條項款]+/gi, '').replace(/\([\d-、之第條項款]+\)$/gi, '');
      }
    }
  }

  if (location.host === 'suggest.police.taichung.gov.tw') {
    taichung();
  } else if (location.host === 'jiaowei.ncpb.gov.tw') {
    nanTou();
  }
})();