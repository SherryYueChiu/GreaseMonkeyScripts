// ==UserScript==
// @name:zh-tw      臺灣交通違規檢舉自動輸入助手
// @name            Taiwan Traffic Violation Auto-Filler
// @namespace       com.sherryyue.TrafficFineReportAssist
// @version         0.18
// @description:zh-tw     此腳本能自動填寫臺灣各交通違規檢舉網站上的檢舉人個資。下載後，只需在腳本內的 profile 部分填齊資料，每次訪問網站時，它都會自動幫你填入個資。
// @description     This script automatically fills in the reporter's personal information on various traffic violation reporting websites in Taiwan. After downloading, simply complete the data in the profile section of the script, and it will auto-fill your information on each website you visit.
// @run-at document-end
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://wos.hpb.gov.tw/*
// @match           *://www.thb.gov.tw/*
// @match           *://polcar.moenv.gov.tw/*
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

  enum GENDER {
    MALE = 1,
    FEMALE = 2,
  }

  interface Profile {
    fullName: string;
    gender: GENDER;
    id: string;
    addr: string;
    tel: string;
    mail: string;
  }

  const profile: Profile = {
    fullName: 'XXX',
    gender: GENDER.FEMALE,
    id: 'Y123456789',
    addr: 'XXX市XXX區XXX路XXX號',
    tel: '0912345678',
    mail: 'your-email@mail.com',
  };

  const menuOptions: { [key: string]: string[] } = {
    '燈光': ['闖紅燈', '轉彎不打燈', '變換車道不打燈', '靠邊停車不打燈', '起步不打燈', '紅燈迴轉', '不依規定使用燈光'],
    '違停': ['逆向臨停', '併排臨停', '路口停車', '網狀線臨停'],
    '逆向': ['逆向', '逆向臨停'],
    '標線': ['跨越雙黃、白線', '超出停止線', '在左右轉專用道直行', '在直行專用道轉彎', '轉彎不先駛入內外車道', '行駛槽化線', '網狀線臨停'],
    '其他': ['玩手機', '不停讓行人', '不依規定佩戴安全帽', '行駛人行道'],
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const scrollToBottom = async (scrollTarget?: HTMLElement | Window) => {
    // @ts-ignore
    (scrollTarget || window).scrollTo(0, (scrollTarget || document.body).scrollHeight);
    await sleep(200);
    // @ts-ignore
    (scrollTarget || window).scrollTo(0, (scrollTarget || document.body).scrollHeight);
  };

  async function guoDao() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/RV') {
      field.disclaimerRead = document.querySelector('#chkAgree');
      await sleep(200);
      if (field.disclaimerRead) field.disclaimerRead.checked = true;
    } else if (urlPathName === '/RV/Create') {
      field.fullName = document.querySelector('input[name="ApplicantName"]');
      field.id = document.querySelector('input[name="ApplicantIDNo"]');
      field.tel = document.querySelector('input[name="ApplicantTel"]');
      field.addr = document.querySelector('input[name="ApplicantAddress"]');
      field.mail = document.querySelector('input[name="ApplicantEMail"]');

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
    }
  }

  function gongluZongJu() {
    try {
      let field: { [key: string]: HTMLInputElement | null } = {};

      const urlPathName = location.pathname;
      if (urlPathName === '/Message_CarViolation.aspx') {
        field.mail = document.querySelector('#ContentPlaceHolder1_emailVerificationCode_txtMail');
        field.fullName = document.querySelector('#ContentPlaceHolder1_c_29');
        field.id = document.querySelector('#ContentPlaceHolder1_c_30');
        field.tel = document.querySelector('#ContentPlaceHolder1_c_31');
        const verifyCodeInput = document.querySelector('#ContentPlaceHolder1_emailVerificationCode_txtVerCode') as HTMLInputElement;

        const violationType = document.querySelector('#ContentPlaceHolder1_c_33') as HTMLInputElement;
        if (violationType) violationType.value = '車牌刷白';
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
    } catch (err) {
      console.warn(err);
    }
  }

  function wuZeChe() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/case/Step0.aspx') {
      field.disclaimerRead = document.querySelector('#ctl00_cphBody_rblIsAgree_0');
      if (field.disclaimerRead) field.disclaimerRead.click();
      scrollToBottom();
    } else if (urlPathName === '/case/Step1.aspx') {
      field.fullName = document.querySelector('input#ctl00_cphBody_tbxAppName');
      field.id = document.querySelector('input#ctl00_cphBody_tbxAppID');
      field.tel = document.querySelector('input#ctl00_cphBody_tbxAppTel3');
      field.addr = document.querySelector('input#ctl00_cphBody_tbxAppAdd');
      field.mail = document.querySelector('input#ctl00_cphBody_tbxAppEmail');

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
    }
  }

  function jiLong() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/reportcase/index.aspx') {
      field.disclaimerRead = document.querySelector('#CheckBox1');
      if (field.disclaimerRead) {
        field.disclaimerRead.click();
        field.disclaimerRead.click();
        field.disclaimerRead.checked = true;
      }
      scrollToBottom();
    } else if (urlPathName === '/reportcase/ReportIndex.aspx') {
      field.fullName = document.querySelector('#ReportName');
      field.id = document.querySelector('#ReportCreditID');
      field.tel = document.querySelector('#ReportMobile');
      field.addr = document.querySelector('#ReportAddress');
      field.mail = document.querySelector('#ReportEmail');

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
    }
  }

  async function xinBei() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/Home/Report') {
      field.disclaimerRead = document.querySelector('#ck');
      if (field.disclaimerRead) {
        field.disclaimerRead.click();
        field.disclaimerRead.click();
        field.disclaimerRead.checked = true;
      }
      scrollToBottom();
    } else if (urlPathName === '/Home/Report_Add') {
      field.fullName = document.querySelector('#informerData_informer_name');
      field.id = document.querySelector('#informerData_identity');
      field.tel = document.querySelector('#informerData_Phone');
      field.addr = document.querySelector('#informerData_contact_address');
      field.mail = document.querySelector('#informerData_Email');

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
    }
  }

  function taiBei() {
    window.addEventListener('load', async function () {
      let field: { [key: string]: HTMLInputElement | null } = {};

      const urlPathName = location.hash;
      if (['#', '#/'].some(_ => _ === urlPathName)) {
        scrollToBottom();
      } else if (urlPathName === '#/New') {
        field.fullName = document.querySelector('input[name="sPub_nm"]');
        field.id = document.querySelector('input[name="sPub_id"]');
        field.tel = document.querySelector('input[name="sPubtel"]');
        field.addr = document.querySelector('input[name="sPubadd"]');
        field.mail = document.querySelector('input[name="email"]');

        if (field.fullName) field.fullName.value = profile.fullName;
        if (field.id) field.id.value = profile.id;
        if (field.tel) field.tel.value = profile.tel;
        if (field.addr) field.addr.value = profile.addr;
        if (field.mail) field.mail.value = profile.mail;
      }
    }, false);
  }

  function taoYuan() {
    window.addEventListener('load', function () {
      let field: { [key: string]: HTMLInputElement | null } = {};

      const urlPathName = location.pathname;
      if (urlPathName == '/') {
        field.disclaimerRead = document.querySelector('#cbox1');
        if (field.disclaimerRead) field.disclaimerRead.checked = true;
        scrollToBottom(document.querySelector('.main-page') as HTMLElement);
      } else if (urlPathName === '/TTPB/D0101') {
        field.fullName = document.querySelector('input[name="txtName"]');
        field.id = document.querySelector('input[name="txtId"]');
        field.tel = document.querySelector('input[name="txtNum"]');
        field.addr = document.querySelector('input[name="txtAdd"]');
        field.mail = document.querySelector('input[name="txtEmaill"]');

        if (field.fullName) field.fullName.value = profile.fullName;
        if (field.id) field.id.value = profile.id;
        if (field.tel) field.tel.value = profile.tel;
        if (field.addr) field.addr.value = profile.addr;
        if (field.mail) field.mail.value = profile.mail;
      }
    }, false);
  }

  function xinZhuXian() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/10/13') {
      field.disclaimerRead = document.querySelector('.agree>input');
      if (field.disclaimerRead) {
        field.disclaimerRead.click();
        field.disclaimerRead.click();
        field.disclaimerRead.checked = true;
      }
      scrollToBottom();
    } else if (urlPathName === '/report') {
      field.fullName = document.querySelector('#name');
      field.id = document.querySelector('#idcard');
      field.tel = document.querySelector('#tel');
      field.addr = document.querySelector('#address2');
      field.mail = document.querySelector('#email');

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
    }
  }

  function xinZhuShi() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/hsin/cases/statement') {
      field.disclaimerRead = document.querySelector('#has_read');
      if (field.disclaimerRead) {
        field.disclaimerRead.click();
        field.disclaimerRead.click();
        field.disclaimerRead.checked = true;
      }
      scrollToBottom();
    } else if (urlPathName === '/hsin/cases/new') {
      field.fullName = document.querySelector('#case_name');
      field.id = document.querySelector('#case_id_number');
      field.tel = document.querySelector('#case_phone');
      field.addr = document.querySelector('#case_contact_address');
      field.mail = document.querySelector('#case_email');

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;

      // @ts-ignore
      waitForKeyElements("[aria-labelledby=select2-case_violated_at_date-container]", () => {
        field.dateTime = document.querySelector('[aria-labelledby=select2-case_violated_at_date-container]');
        if (field.dateTime) (field.dateTime.parentNode?.parentNode as HTMLElement)?.style.setProperty('width', '10em');
        field.dateTime = document.querySelector('[aria-labelledby=select2-case_violated_at_hour-container]');
        if (field.dateTime) (field.dateTime.parentNode?.parentNode as HTMLElement)?.style.setProperty('width', '6em');
        field.dateTime = document.querySelector('[aria-labelledby=select2-case_violated_at_min-container]');
        if (field.dateTime) (field.dateTime.parentNode?.parentNode as HTMLElement)?.style.setProperty('width', '6em');
      });

      // 客製化車牌輸入，可以直接輸入整串
      (document.querySelector('#case_first_car_number')?.parentNode as HTMLElement)?.style.setProperty('display', 'none');
      (document.querySelector('#case_last_car_number')?.parentNode as HTMLElement)?.style.setProperty('display', 'none');
      const customLicenseInput = document.createElement('input');
      customLicenseInput.setAttribute('placeholder', '完整車牌，包含-');
      customLicenseInput.style.setProperty('display', 'block');
      customLicenseInput.style.setProperty('width', 'calc(80%)');
      document.querySelector('#case_first_car_number')?.parentNode?.parentNode?.insertBefore(customLicenseInput, document.querySelector('#case_first_car_number')?.parentNode);
      customLicenseInput.oninput = (() => {
        const licenseInputL = document.querySelector('#case_first_car_number') as HTMLInputElement;
        const licenseInputR = document.querySelector('#case_last_car_number') as HTMLInputElement;
        const [licenseNumL, licenseNumR] = customLicenseInput.value.split('-');
        if (licenseInputL) licenseInputL.value = licenseNumL || '';
        if (licenseInputR) licenseInputR.value = licenseNumR || '';
      });
    }
  }

  function miaoLi() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/Home/Report') {
      field.fullName = document.querySelector('#Name');
      field.id = document.querySelector('#IdentityNumber');
      field.tel = document.querySelector('#Telphone');
      field.addr = document.querySelector('#Address');
      field.mail = document.querySelector('#Email');

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
    }
  }

  function taichung() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/traffic/' || urlPathName === '/traffic/index.jsp') {
      field.disclaimerRead = document.querySelector('#OK');

      if (field.disclaimerRead) {
        field.disclaimerRead.click();
        field.disclaimerRead.click();
        field.disclaimerRead.checked = true;
        scrollToBottom();
      }
    } else if (urlPathName === '/traffic/traffic_write.jsp') {
      const timepickerUnlock = () => {
        field.timepicker = document.querySelector('.ui_tpicker_time_input');
        if (field.timepicker) field.timepicker.removeAttribute('disabled');
      }
      // @ts-ignore
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

      if (field.fullName) field.fullName.value = profile.fullName;
      if (profile.gender === GENDER.FEMALE && field.genderFemale) field.genderFemale.click();
      else if (profile.gender === GENDER.MALE && field.genderMale) field.genderMale.click();
      if (field.nation) field.nation.click();
      if (field.id) field.id.value = profile.id;
      if (field.addr) field.addr.value = profile.addr;
      if (field.tel) field.tel.value = profile.tel;
      if (field.mail) field.mail.value = profile.mail;
      if (field.dateTime) field.dateTime.removeAttribute('readonly');
      if (field.actSelect) {
        field.actSelect.onchange = () => {
          if (field.detail) field.detail.value = field.actSelect.value.replace(/^道交[\d-、之第項]+/gi, '');
        }
      }
      document.querySelectorAll<HTMLElement>('#license1>*').forEach(elm => elm.style?.setProperty('display', 'none'));
      const customLicenseInput = document.createElement('input');
      customLicenseInput.setAttribute('placeholder', '完整車牌，包含-');
      customLicenseInput.style.setProperty('display', 'block');
      customLicenseInput.style.setProperty('width', 'calc(80% - 7px)');
      document.querySelector('#license1')?.insertBefore(customLicenseInput, document.querySelector('#license1 label'));
      customLicenseInput.oninput = (() => {
        const licenseInputL = document.querySelector('#licensenumber2') as HTMLInputElement;
        const licenseInputR = document.querySelector('#licensenumber3') as HTMLInputElement;
        const [licenseNumL, licenseNumR] = customLicenseInput.value.split('-');
        if (licenseInputL) licenseInputL.value = licenseNumL || '';
        if (licenseInputR) licenseInputR.value = licenseNumR || '';
      });

      if (field.detail) {
        field.detail.addEventListener('contextmenu', function (event) {
          event.preventDefault();
          createContextMenu(event.pageX, event.pageY, menuOptions);
        });
      }
    }
  }

  function nanTou() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/sc11/rwd/rincase1.aspx') {
      field.nextBtn = document.querySelector('#Button1');
      if (field.nextBtn) field.nextBtn.click();
    } else if (urlPathName === '/sc11/rwd/rincase2.aspx') {
      scrollToBottom();
    } else if (urlPathName === '/sc11/rwd/rincase3.aspx') {
      field.fullName = document.querySelector('#mname');
      field.id = document.querySelector('#mpid');
      field.tel = document.querySelector('#mtel');
      field.addr = document.querySelector('#maddr');
      field.mail = document.querySelector('#memail');
      field.actSelect = document.querySelector('#rlid');
      field.detail = document.querySelector('#mcarblack');

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
      if (field.actSelect) {
        field.actSelect.onchange = () => {
          const option = Array.from(field.actSelect?.querySelectorAll<HTMLElement>(`option[value='${field.actSelect.value}']`));
          const content = [...option].map(elm => elm.textContent).join('');
          if (field.detail) field.detail.value = content.replace(/^[\d-、之第條項款]+/gi, '').replace(/\([\d-、之第條項款]+\)$/gi, '');
        }
      }
    }
  }

  function zhanghua() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/ViolatePetition/C005400') {
      scrollToBottom();
    } else if (urlPathName === '/ViolatePetition/C005400/Form') {
      field.fullName = document.querySelector('#Name');
      field.id = document.querySelector('#IdentityCard');
      field.tel = document.querySelector('#OfficeTel');
      field.addr = document.querySelector('#Address');
      field.mail = document.querySelector('#Mail');
      field.date = document.querySelector('#ViolationDate');
      field.time = document.querySelector('#ViolationTime');

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
      if (field.date) {
        field.date.setAttribute('type', 'text');
        field.date.setAttribute('placeholder', 'YYYY-mm-dd');
      }
      if (field.time) {
        field.time.setAttribute('type', 'text');
        field.time.setAttribute('placeholder', 'HH:mm');
      }
    }
  }

  function yunLin() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/Home/Report') {
      field.fullName = document.querySelector('#Name');
      field.id = document.querySelector('#IdentityNumber');
      field.tel = document.querySelector('#Telphone');
      field.addr = document.querySelector('#Address');
      field.mail = document.querySelector('#Email');
      field.date = document.querySelector('[name=SetDateOfOccurrence]');
      field.time = document.querySelector('[name=SetTimeOfOccurrence]');

      field.disclaimerRead = document.querySelector('#che_agree');
      if (field.disclaimerRead) {
        field.disclaimerRead.click();
        field.disclaimerRead.click();
        field.disclaimerRead.checked = true;
      }

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
      if (field.date) {
        field.date.setAttribute('type', 'text');
        field.date.setAttribute('placeholder', 'YYYY-mm-dd');
      }
      if (field.time) {
        field.time.setAttribute('type', 'text');
        field.time.setAttribute('placeholder', 'HH:mm');
      }
    }
  }

  function jiaYiXian() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName.startsWith('TrafficMailbox/Index')) {
      field.disclaimerRead = document.querySelector('#checkRead');
      if (field.disclaimerRead) {
        field.disclaimerRead.click();
        field.disclaimerRead.click();
        field.disclaimerRead.checked = true;
        scrollToBottom();
      }
    } else if (urlPathName.startsWith('/TrafficMailbox/Create')) {
      field.fullName = document.querySelector('#FromName');
      field.id = document.querySelector('#FromID');
      field.tel = document.querySelector('#ContactPhone');
      field.addr = document.querySelector('#ContactAddress');
      field.mail = document.querySelector('#FromMail');

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
    }
  }

  function jiaYiShi() {
    // TODO
  }

  function taiNan() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName.startsWith('TrafficMailbox/Index')) {
      field.disclaimerRead = document.querySelector('#checkRead');
      if (field.disclaimerRead) {
        field.disclaimerRead.click();
        field.disclaimerRead.click();
        field.disclaimerRead.checked = true;
        scrollToBottom();
      }
    } else if (urlPathName.startsWith('/TrafficMailbox/Create')) {
      field.fullName = document.querySelector('#Name');
      field.id = document.querySelector('#Pid');
      field.tel = document.querySelector('#TEL');
      field.addr = document.querySelector('#Address');
      field.mail = document.querySelector('#Email');

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
    }
  }

  function pingDong() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName === '/') {
      field.disclaimerRead = document.querySelector('#OK');
      if (field.disclaimerRead) {
        field.disclaimerRead.click();
        field.disclaimerRead.click();
        field.disclaimerRead.checked = true;
        scrollToBottom();
      }
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

      if (field.disclaimerRead) {
        field.disclaimerRead.click();
        field.disclaimerRead.click();
        field.disclaimerRead.checked = true;
      }
      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
      if (field.dateTime) field.dateTime.removeAttribute('readonly');
      if (field.actSelect) {
        field.actSelect.onchange = () => {
          if (field.detail) field.detail.value = field.actSelect.value;
        }
      }
      document.querySelector<HTMLElement>('#licensenumber1')?.style.setProperty('display', 'none');
      document.querySelector<HTMLElement>('#licensenumber2')?.style.setProperty('display', 'none');
      document.querySelector<HTMLElement>('.carnum span')?.style.setProperty('display', 'none');
      const customLicenseInput = document.createElement('input');
      customLicenseInput.setAttribute('placeholder', '完整車牌，包含-');
      customLicenseInput.style.setProperty('display', 'block');
      customLicenseInput.style.setProperty('width', 'calc(80% - 7px)');
      document.querySelector('.carnum')?.insertBefore(customLicenseInput, document.querySelector('#licensenumber1 label'));
      customLicenseInput.oninput = (() => {
        const licenseInputL = document.querySelector('#licensenumber1') as HTMLInputElement;
        const licenseInputR = document.querySelector('#licensenumber2') as HTMLInputElement;
        const [licenseNumL, licenseNumR] = customLicenseInput.value.split('-');
        if (licenseInputL) licenseInputL.value = licenseNumL || '';
        if (licenseInputR) licenseInputR.value = licenseNumR || '';
      });
    }
  }

  function yiLan() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName.startsWith('/index.php')) {
      field.fullName = document.querySelector('#name');
      field.id = document.querySelector('#idcard');
      field.tel = document.querySelector('#tel');
      field.addr = document.querySelector('#address2');
      field.mail = document.querySelector('#email');

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
    }
  }

  function huaLian() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName.startsWith('/order/iframviolation_list.php')) {
      field.fullName = document.querySelector('[name=name]');
      field.id = document.querySelectorAll('#mform>.input-group>input')[1] as HTMLInputElement;
      field.tel = document.querySelector('[name=mobile]');
      field.addr = document.querySelector('[name=address]');
      field.mail = document.querySelector('[name=email]');

      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
    }
  }

  function taiDong() {
    let field: { [key: string]: HTMLInputElement | null } = {};

    const urlPathName = location.pathname;
    if (urlPathName.startsWith('/chinese/home.jsp')) {
      field.fullName = document.querySelector('#name');
      field.id = document.querySelector('#pid');
      field.tel = document.querySelector('#tel');
      field.addr = document.querySelector('#address');
      field.mail = document.querySelector('#email');
      field.genderMale = document.querySelector('#sex1');
      field.genderFemale = document.querySelector('#sex2');

      if (profile.gender === GENDER.FEMALE && field.genderFemale) field.genderFemale.click();
      else if (profile.gender === GENDER.MALE && field.genderMale) field.genderMale.click();
      if (field.fullName) field.fullName.value = profile.fullName;
      if (field.id) field.id.value = profile.id;
      if (field.tel) field.tel.value = profile.tel;
      if (field.addr) field.addr.value = profile.addr;
      if (field.mail) field.mail.value = profile.mail;
    }
  }
  function createContextMenu(x: number, y: number, options: { [key: string]: any }) {
    removeExistingMenu();

    const menu = document.createElement('div');
    menu.id = 'custom-context-menu';
    menu.style.position = 'absolute';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid black';
    menu.style.padding = '10px';
    menu.style.zIndex = '1000';

    for (const key in options) {
      const item = document.createElement('div');
      item.textContent = key;
      item.style.padding = '5px';
      item.style.cursor = 'pointer';

      item.addEventListener('click', function (event) {
        event.stopPropagation();
        createSubmenu(
          +getComputedStyle(menu).getPropertyValue('width').replace('px', '') + x,
          y,
          options[key]);
      });
      menu.appendChild(item);
    }

    document.body.appendChild(menu);
  }

  function createSubmenu(x: number, y: number, options: string[]) {
    removeExistingMenu('submenu');

    const submenu = document.createElement('div');
    submenu.id = 'custom-context-submenu';
    submenu.style.position = 'absolute';
    submenu.style.left = `${x}px`;
    submenu.style.top = `${y}px`;
    submenu.style.backgroundColor = 'white';
    submenu.style.border = '1px solid black';
    submenu.style.padding = '10px';
    submenu.style.zIndex = '1000';

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

  function fillTextArea(text: string) {
    const textArea = document.querySelector<HTMLTextAreaElement>('#detailcontent');
    if (textArea) {
      textArea.value = text;
    }
  }

  window.addEventListener('click', function () {
    removeExistingMenu();
  });

  if (location.host === 'wos.hpb.gov.tw') {
    guoDao();
  } else if (location.host === 'www.thb.gov.tw') {
    gongluZongJu();
  } else if (location.host === 'polcar.moenv.gov.tw') {
    wuZeChe();
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