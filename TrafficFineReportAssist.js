// ==UserScript==
// @name            TrafficFineReportAssist
// @name:zh-TW      交通違規檢舉輸入助手
// @namespace       com.sherryyue.TrafficFineReportAssist
// @version         0.1
// @description     交通違規檢舉輸入助手
// @author          SherryYue
// @match           *://suggest.police.taichung.gov.tw/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @grant           none
// ==/UserScript==

(function () {
  'use strict';

  const GENDER = {
    MALE: 1,
    FEMALE: 2,
  }

  const profile = {
    fullName: '',
    gender: GENDER.FEMALE,
    id: '',
    addr: '',
    tel: '',
    mail: '',
  }

  let feild = {};
  feild.disclaimerRead = document.querySelector('#OK');
  feild.fullName = document.querySelector('#name');
  feild.genderMale = document.querySelector('#male');
  feild.genderFemale = document.querySelector('#female');
  feild.nation = document.querySelector('#taiwan');
  feild.id = document.querySelector('#sub');
  feild.addr = document.querySelector('#address');
  feild.tel = document.querySelector('#liaisontel');
  feild.mail = document.querySelector('#email');
  feild.dateTime = document.querySelector('#violationdatetime');

  const urlPathName = location.pathname;
  if (urlPathName === '/traffic/' || urlPathName === '/traffic/index.jsp') {
    feild.disclaimerRead.click();
    feild.disclaimerRead.click();
    feild.disclaimerRead.checked = true;
  } else if (urlPathName === '/traffic/traffic_write.jsp') {
    feild.fullName.value = profile.fullName;
    if (profile.gender === GENDER.FEMALE) feild.genderFemale.click();
    else if (profile.gender === GENDER.MALE) feild.genderMale.click();
    feild.nation.click();
    feild.id.value = profile.id;
    feild.addr.value = profile.addr;
    feild.tel.value = profile.tel;
    feild.mail.value = profile.mail;
    feild.dateTime.removeAttribute('readonly');
  }

})();