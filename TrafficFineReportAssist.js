// ==UserScript==
// @name:zh-tw      臺灣交通違規檢舉自動輸入助手
// @name            Taiwan Traffic Violation Auto-Filler
// @namespace       com.sherryyue.TrafficFineReportAssist
// @version         0.16
// @description:zh-tw     此腳本能自動填寫臺灣各交通違規檢舉網站上的檢舉人個資。下載後，只需在腳本內的 profile 部分填齊資料，每次訪問網站時，它都會自動幫你填入個資。
// @description     This script automatically fills in the reporter's personal information on various traffic violation reporting websites in Taiwan. After downloading, simply complete the data in the profile section of the script, and it will auto-fill your information on each website you visit.
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://www.thb.gov.tw/*
// @match           *://tvrs.ntpd.gov.tw/*
// @match           *://prsweb.tcpd.gov.tw/*
// @match           *://tvrweb.typd.gov.tw:3444/*
// @match           *://traffic.hchpb.gov.tw/*
// @match           *://tra.hccp.gov.tw/*
// @match           *://trv.mpb.gov.tw/*
// @match           *://suggest.police.taichung.gov.tw/*
// @match           *://jiaowei.ncpb.gov.tw/sc11/*
// @match           *://traffic.chpb.gov.tw/*
// @match           *://trv.ylhpb.gov.tw/*
// @match           *://tptv.klg.gov.tw/*
// @match           *://www.cypd.gov.tw/*
// @match           *://www.ccpb.gov.tw/*
// @match           *://www.tnpd.gov.tw/*
// @match           *://trafficmailbox.ptpolice.gov.tw/*
// @match           *://ppl.report.ilcpb.gov.tw/*
// @match           *://hlpb.twgov.mobi/*
// @match           *://www.ttcpb.gov.tw/*

// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues
// @homepage        https://github.com/sherryyuechiu/GreasyMonkeyScripts
// @require         https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
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

  // 主菜單選項和對應的子菜單選項
  const menuOptions = {
    '燈光': ['闖紅燈', '轉彎不打燈', '變換車道不打燈', '靠邊停車不打燈', '起步不打燈', '紅燈迴轉', '不依規定使用燈光'],
    '違停': ['逆向臨停', '併排臨停', '路口停車', '網狀線臨停'],
    '逆向': ['逆向', '逆向臨停'],
    '標線': ['跨越雙黃、白線', '超出停止線', '在左右轉專用道直行', '在直行專用道轉彎', '轉彎不先駛入內外車道', '行駛槽化線', '網狀線臨停'],
    '其他': ['玩手機', '不停讓行人', '不依規定佩戴安全帽', '行駛人行道'],
  };

  function gongluZongJu() {
    try {
      let field = {};

      const urlPathName = location.pathname;
      if (urlPathName === '/Message_CarViolation.aspx') {
        field.mail = document.querySelector('#ContentPlaceHolder1_emailVerificationCode_txtMail');
        field.fullName = document.querySelector('#ContentPlaceHolder1_c_29');
        field.id = document.querySelector('#ContentPlaceHolder1_c_30');
        field.tel = document.querySelector('#ContentPlaceHolder1_c_31');
        const verifyCodeInput = document.querySelector('#ContentPlaceHolder1_emailVerificationCode_txtVerCode');

        document.querySelector('#ContentPlaceHolder1_c_33').value = '車牌刷白';
        if (field.mail) field.mail.value = profile.mail;
        if (field.fullName) field.fullName.value = profile.fullName;
        if (field.id) field.id.value = profile.id;
        if (field.tel) field.tel.value = profile.tel;

        const verifyCode = localStorage.getItem('verifyCode');
        if (verifyCode && verifyCodeInput) verifyCodeInput.value = verifyCode;
        verifyCodeInput?.addEventListener('change', () => {
          localStorage.setItem('verifyCode', verifyCodeInput.value);
        });
      }
    } catch (err) { console.warn(err) }
  }

  function jiLong() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/reportcase/index.aspx') {
      field.disclaimerRead = document.querySelector('#CheckBox1');
      field.disclaimerRead.click();
      field.disclaimerRead.click();
      field.disclaimerRead.checked = true;
      window.scrollTo(0, document.body.scrollHeight);
    } else if (urlPathName === '/reportcase/ReportIndex.aspx') {
      field.fullName = document.querySelector('#ReportName');
      field.id = document.querySelector('#ReportCreditID');
      field.tel = document.querySelector('#ReportMobile');
      field.addr = document.querySelector('#ReportAddress');
      field.mail = document.querySelector('#ReportEmail');

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
    }
  }

  function xinBei() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/Home/Report') {
      field.disclaimerRead = document.querySelector('#ck');
      field.disclaimerRead.click();
      field.disclaimerRead.click();
      field.disclaimerRead.checked = true;
      window.scrollTo(0, document.body.scrollHeight);
    } else if (urlPathName === '/Home/Report_Add') {
      field.fullName = document.querySelector('#informerData_informer_name');
      field.id = document.querySelector('#informerData_identity');
      field.tel = document.querySelector('#informerData_Phone');
      field.addr = document.querySelector('#informerData_contact_address');
      field.mail = document.querySelector('#informerData_Email');

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
    }
  }

  function taiBei() {
    let field = {};

    const urlPathName = location.hash;
    if (urlPathName === '#/') {
      window.scrollTo(0, document.body.scrollHeight);
    } else if (urlPathName === '#/New') {
      field.fullName = document.querySelector('#sPub_nm');
      field.id = document.querySelector('#sPub_id');
      field.tel = document.querySelector('#sPubtel');
      field.addr = document.querySelector('#sPubadd');
      field.mail = document.querySelector('#email');

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
    }
  }

  function taoYuan() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/report') {
      field.fullName = document.querySelector('#txtName');
      field.id = document.querySelector('#txtId');
      field.tel = document.querySelector('#txtNum');
      field.addr = document.querySelector('#txtAdd');
      field.mail = document.querySelector('#txtEmaill');

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
    }
  }

  function xinZhuXian() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/10/13') {
      field.disclaimerRead = document.querySelector('.agree>input');
      field.disclaimerRead.click();
      field.disclaimerRead.click();
      field.disclaimerRead.checked = true;
      window.scrollTo(0, document.body.scrollHeight);
    } else if (urlPathName === '/report') {
      field.fullName = document.querySelector('#name');
      field.id = document.querySelector('#idcard');
      field.tel = document.querySelector('#tel');
      field.addr = document.querySelector('#address2');
      field.mail = document.querySelector('#email');

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
    }
  }

  function xinZhuShi() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/hsin/cases/statement') {
      field.disclaimerRead = document.querySelector('#has_read');
      field.disclaimerRead.click();
      field.disclaimerRead.click();
      field.disclaimerRead.checked = true;
      window.scrollTo(0, document.body.scrollHeight);
    } else if (urlPathName === '/hsin/cases/new') {
      field.fullName = document.querySelector('#case_name');
      field.id = document.querySelector('#case_id_number');
      field.tel = document.querySelector('#case_phone');
      field.addr = document.querySelector('#case_contact_address');
      field.mail = document.querySelector('#case_email');

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;

      waitForKeyElements("[aria-labelledby=select2-case_violated_at_date-container]", () => {
        field.dateTime = document.querySelector('[aria-labelledby=select2-case_violated_at_date-container]');
        field.dateTime.parentNode.parentNode.style.width = '10em';
        field.dateTime = document.querySelector('[aria-labelledby=select2-case_violated_at_hour-container]');
        field.dateTime.parentNode.parentNode.style.width = '6em';
        field.dateTime = document.querySelector('[aria-labelledby=select2-case_violated_at_min-container]');
        field.dateTime.parentNode.parentNode.style.width = '6em';
      });

      // 客製化車牌輸入，可以直接輸入整串
      document.querySelector('#case_first_car_number').parentNode.style?.setProperty('display', 'none');
      document.querySelector('#case_last_car_number').parentNode.style?.setProperty('display', 'none');
      const customLicenseInput = document.createElement('input');
      customLicenseInput.setAttribute('placeholder', '完整車牌，包含-');
      customLicenseInput.style.setProperty('display', 'block');
      customLicenseInput.style.setProperty('width', 'calc(80%)');
      document.querySelector('#case_first_car_number')
        .parentNode.parentNode
        .insertBefore(customLicenseInput, document.querySelector('#case_first_car_number').parentNode);
      customLicenseInput.oninput = (() => {
        const licenseInputL = document.querySelector('#case_first_car_number');
        const licenseInputR = document.querySelector('#case_last_car_number');
        const [licenseNumL, licenseNumR] = customLicenseInput.value.split('-');
        licenseInputL.value = licenseNumL || '';
        licenseInputR.value = licenseNumR || '';
      });
    }
  }

  function miaoLi() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/Home/Report') {
      field.fullName = document.querySelector('#Name');
      field.id = document.querySelector('#IdentityNumber');
      field.tel = document.querySelector('#Telphone');
      field.addr = document.querySelector('#Address');
      field.mail = document.querySelector('#Email');

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
    }
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
      const timepickerUnlock = () => {
        field.timepicker = document.querySelector('.ui_tpicker_time_input');
        field.timepicker.removeAttribute('disabled');
      }
      waitForKeyElements(".ui_tpicker_time_input", timepickerUnlock);

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

      // 防止右鍵菜單的預設行為
      field.detail.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        createContextMenu(event.pageX, event.pageY, menuOptions, null);
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

  function zhanghua() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/ViolatePetition/C005400') {
      window.scrollTo(0, document.body.scrollHeight);
    } else if (urlPathName === '/ViolatePetition/C005400/Form') {
      field.fullName = document.querySelector('#Name');
      field.id = document.querySelector('#IdentityCard');
      field.tel = document.querySelector('#OfficeTel');
      field.addr = document.querySelector('#Address');
      field.mail = document.querySelector('#Mail');
      field.date = document.querySelector('#ViolationDate');
      field.time = document.querySelector('#ViolationTime');

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
      field.date.setAttribute('type', 'text');
      field.date.setAttribute('placeholder', 'YYYY-mm-dd');
      field.time.setAttribute('type', 'text');
      field.time.setAttribute('placeholder', 'HH:mm');
    }
  }

  function yunLin() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/Home/Report') {
      field.fullName = document.querySelector('#Name');
      field.id = document.querySelector('#IdentityNumber');
      field.tel = document.querySelector('#Telphone');
      field.addr = document.querySelector('#Address');
      field.mail = document.querySelector('#Email');
      field.date = document.querySelector('[name=SetDateOfOccurrence]');
      field.time = document.querySelector('[name=SetTimeOfOccurrence');

      field.disclaimerRead = document.querySelector('#che_agree');
      field.disclaimerRead.click();
      field.disclaimerRead.click();
      field.disclaimerRead.checked = true;

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
      field.date.setAttribute('type', 'text');
      field.date.setAttribute('placeholder', 'YYYY-mm-dd');
      field.time.setAttribute('type', 'text');
      field.time.setAttribute('placeholder', 'HH:mm');
    }
  }

  function jiaYiXian() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName.startsWith('TrafficMailbox/Index')) {
      field.disclaimerRead = document.querySelector('#checkRead');
      field.disclaimerRead.click();
      field.disclaimerRead.click();
      field.disclaimerRead.checked = true;
      window.scrollTo(0, document.body.scrollHeight);
    } else if (urlPathName.startsWith('/TrafficMailbox/Create')) {
      field.fullName = document.querySelector('#FromName');
      field.id = document.querySelector('#FromID');
      field.tel = document.querySelector('#ContactPhone');
      field.addr = document.querySelector('#ContactAddress');
      field.mail = document.querySelector('#FromMail');

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
    }
  }

  function jiaYiShi() {
    // TODO
  }

  function taiNan() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName.startsWith('TrafficMailbox/Index')) {
      field.disclaimerRead = document.querySelector('#checkRead');
      field.disclaimerRead.click();
      field.disclaimerRead.click();
      field.disclaimerRead.checked = true;
      window.scrollTo(0, document.body.scrollHeight);
    } else if (urlPathName.startsWith('/TrafficMailbox/Create')) {
      field.fullName = document.querySelector('#Name');
      field.id = document.querySelector('#Pid');
      field.tel = document.querySelector('#TEL');
      field.addr = document.querySelector('#Address');
      field.mail = document.querySelector('#Email');

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
    }
  }

  function pingDong() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/') {
      field.disclaimerRead = document.querySelector('#OK');
      field.disclaimerRead.click();
      field.disclaimerRead.click();
      field.disclaimerRead.checked = true;
      window.scrollTo(0, document.body.scrollHeight);
    } else if (urlPathName === '/traffic_write.jsp') {
      field.fullName = document.querySelector('#name');
      field.id = document.querySelector('#sub');
      field.tel = document.querySelector('#liaisontel');
      field.addr = document.querySelector('#address');
      field.mail = document.querySelector('#email');
      field.actSelect = document.querySelector('#qclass');
      field.dateTime = document.querySelector('#violationdatetime');
      field.detail = document.querySelector('#detailcontent');
      field.disclaimerRead = document.querySelector('#isagree');

      field.disclaimerRead.click();
      field.disclaimerRead.click();
      field.disclaimerRead.checked = true;
      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
      field.dateTime.removeAttribute('readonly');
      // 依下拉選單自動填入描述
      field.actSelect.onchange = () => {
        field.detail.value = field.actSelect.value;
      }
      // 客製化車牌輸入，可以直接輸入整串
      document.querySelector('#licensenumber1').style.setProperty('display', 'none');
      document.querySelector('#licensenumber2').style.setProperty('display', 'none');
      document.querySelector('.carnum span').style.setProperty('display', 'none');
      const customLicenseInput = document.createElement('input');
      customLicenseInput.setAttribute('placeholder', '完整車牌，包含-');
      customLicenseInput.style.setProperty('display', 'block');
      customLicenseInput.style.setProperty('width', 'calc(80% - 7px)');
      document.querySelector('.carnum').insertBefore(customLicenseInput, document.querySelector('#licensenumber1 label'));
      customLicenseInput.oninput = (() => {
        const licenseInputL = document.querySelector('#licensenumber1');
        const licenseInputR = document.querySelector('#licensenumber2');
        const [licenseNumL, licenseNumR] = customLicenseInput.value.split('-');
        licenseInputL.value = licenseNumL || '';
        licenseInputR.value = licenseNumR || '';
      });
    }
  }

  function yiLan() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName.startsWith('/index.php')) {
      field.fullName = document.querySelector('#name');
      field.id = document.querySelector('#idcard');
      field.tel = document.querySelector('#tel');
      field.addr = document.querySelector('#address2');
      field.mail = document.querySelector('#email');

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
    }
  }

  function huaLian() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName.startsWith('/order/iframviolation_list.php')) {
      field.fullName = document.querySelector('[name=name]');
      field.id = document.querySelectorAll('#mform>.input-group>input')[1];
      field.tel = document.querySelector('[name=mobile]');
      field.addr = document.querySelector('[name=address]');
      field.mail = document.querySelector('[name=email]');

      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
    }
  }

  function taiDong() {
    let field = {};

    const urlPathName = location.pathname;
    if (urlPathName.startsWith('/chinese/home.jsp')) {
      field.fullName = document.querySelector('#name');
      field.id = document.querySelector('#pid');
      field.tel = document.querySelector('#tel');
      field.addr = document.querySelector('#address');
      field.mail = document.querySelector('#email');
      field.genderMale = document.querySelector('#sex1');
      field.genderFemale = document.querySelector('#sex2');

      if (profile.gender === GENDER.FEMALE) field.genderFemale.click();
      else if (profile.gender === GENDER.MALE) field.genderMale.click();
      field.fullName.value = profile.fullName;
      field.id.value = profile.id;
      field.tel.value = profile.tel;
      field.addr.value = profile.addr;
      field.mail.value = profile.mail;
    }
  }

  function createContextMenu(x, y, options) {
    removeExistingMenu();

    const menu = document.createElement('div');
    menu.id = 'custom-context-menu';
    menu.style.position = 'absolute';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid black';
    menu.style.padding = '10px';
    menu.style.zIndex = 1000; // 確保菜單顯示在最上層

    for (const key in options) {
      const item = document.createElement('div');
      item.textContent = key;
      item.style.padding = '5px';
      item.style.cursor = 'pointer';

      item.addEventListener('click', function (event) {
        event.stopPropagation(); // 防止触发外层的点击事件
        createSubmenu(
          +getComputedStyle(menu).getPropertyValue('width').replace('px', '') + x,
          y,
          options[key]);
      });
      menu.appendChild(item);
    }

    document.body.appendChild(menu);
  }

  function createSubmenu(x, y, options) {
    removeExistingMenu('submenu');

    const submenu = document.createElement('div');
    submenu.id = 'custom-context-submenu';
    submenu.style.position = 'absolute';
    submenu.style.left = `${x}px`;
    submenu.style.top = `${y}px`;
    submenu.style.backgroundColor = 'white';
    submenu.style.border = '1px solid black';
    submenu.style.padding = '10px';
    submenu.style.zIndex = 1000;

    options.forEach(option => {
      const item = document.createElement('div');
      item.textContent = option;
      item.style.padding = '5px';
      item.style.cursor = 'pointer';
      item.addEventListener('click', function () {
        fillTextArea(option);
        removeExistingMenu();
      });
      submenu.appendChild(item);
    });

    document.body.appendChild(submenu);
  }

  function removeExistingMenu(type = 'all') {
    if (type === 'all' || type === 'menu') {
      const existingMenu = document.getElementById('custom-context-menu');
      if (existingMenu) {
        existingMenu.remove();
      }
    }
    if (type === 'all' || type === 'submenu') {
      const existingSubmenu = document.getElementById('custom-context-submenu');
      if (existingSubmenu) {
        existingSubmenu.remove();
      }
    }
  }

  function fillTextArea(text) {
    const textArea = document.getElementById('detailcontent');
    if (textArea) {
      textArea.value = text;
    }
  }

  window.addEventListener('click', function () {
    removeExistingMenu();
  });

  if (location.host === 'www.thb.gov.tw') {
    gongluZongJu();
  } else if (location.host === 'tptv.klg.gov.tw') {
    jiLong();
  } else if (location.host === 'tvrs.ntpd.gov.tw') {
    xinBei();
  } else if (location.host === 'prsweb.tcpd.gov.tw') {
    taiBei();
  } else if (location.host === 'tvrweb.typd.gov.tw:3444') {
    taoYuan();
  } else if (location.host === 'traffic.hchpb.gov.tw') {
    xinZhuXian();
  } else if (location.host === 'tra.hccp.gov.tw') {
    xinZhuShi();
  } else if (location.host === 'trv.mpb.gov.tw') {
    miaoLi();
  } else if (location.host === 'suggest.police.taichung.gov.tw') {
    taichung();
  } else if (location.host === 'jiaowei.ncpb.gov.tw') {
    nanTou();
  } else if (location.host === 'traffic.chpb.gov.tw') {
    zhanghua();
  } else if (location.host === 'trv.ylhpb.gov.tw') {
    yunLin();
  } else if (location.host === 'www.cypd.gov.tw') {
    jiaYiXian();
  } else if (location.host === 'www.ccpb.gov.tw') {
    jiaYiShi();
  } else if (location.host === 'www.tnpd.gov.tw') {
    taiNan();
  } else if (location.host === 'trafficmailbox.ptpolice.gov.tw') {
    pingDong();
  } else if (location.host === 'ppl.report.ilcpb.gov.tw') {
    yiLan();
  } else if (location.host === 'hlpb.twgov.mobi') {
    huaLian();
  } else if (location.host === 'www.ttcpb.gov.tw') {
    taiDong();
  }
})();