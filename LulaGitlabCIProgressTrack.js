// ==UserScript==
// @name            Lula Gitlab CI progress track tool
// @name:zh-TW      Lula Gitlab CI 進度追蹤工具
// @namespace       com.sherryyue.lulagitlabciprogresstrack
// @version         0.1
// @description       Lula Gitlab CI progress track
// @description:ZH-TW Lula Gitlab CI 進度追蹤
// @author          SherryYue
// @match           http://gitlab.lulainno.com/*
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @require         https://code.jquery.com/jquery-3.6.0.js
// @require         https://code.jquery.com/ui/1.13.1/jquery-ui.js
// @grant           GM_addStyle
// ==/UserScript==

(function () {
  const TGToken = '6029836287:AAGtY81VFypCB976DwfRG7hZ033oEHzBT1Y';
  const chatId = 901947307;
  let pipelineState = [];

  PIPELINE_STATE = {
    PENDING: 'pending',
    RUNNING: 'running',
    SUCCESS: 'success',
    FAILED: 'failed',
    PARTIAL_SUCCESS: 'success-with-warnings',
    PARTIAL_FAILED: 'failed-with-warnings',
    WAITING_RESOURCES: 'waiting-for-resource',
  }

  function judgeState(elm) {
    const classList = elm.classList;
    if (classList.contains('ci-pending')) return PIPELINE_STATE.PENDING;
    if (classList.contains('ci-running')) return PIPELINE_STATE.RUNNING;
    if (classList.contains('ci-success')) return PIPELINE_STATE.SUCCESS;
    if (classList.contains('ci-failed')) return PIPELINE_STATE.FAILED;
    if (classList.contains('ci-success-with-warnings')) return PIPELINE_STATE.PARTIAL_SUCCESS;
    if (classList.contains('ci-failed-with-warnings')) return PIPELINE_STATE.PARTIAL_FAILED;
    if (classList.contains('ci-waiting-for-resource')) return PIPELINE_STATE.WAITING_RESOURCES;
  }

  function sendNotification(msg) {
    const searchParams = new URLSearchParams({
      chat_id: chatId,
      parse_mode: 'MarkdownV2',
      text: msg,
    });
    const requestUrl = new URL(`https://api.telegram.org/bot${TGToken}/sendMessage`);
    requestUrl.search = searchParams.toString().replace(/%25/g, '%');
    fetch(requestUrl);
  }

  function isHTMLElement(obj) {
    if (obj.nodeType) {
      return obj.nodeType == 1;
    }
  }

  function main() {
    const pipelines = document.querySelectorAll('.commit[data-testid=pipeline-table-row]');
    if (pipelineState.length === 0) {
      pipelines.forEach((pipeline, i) => {
        const statusTd = pipeline.querySelector('[data-label=Status] [data-qa-selector=pipeline_commit_status]');
        pipelineState[i] = judgeState(statusTd);
      });
      return;
    }

    let diffPipelines = [];
    for (let i = 0; i < pipelines.length; i++) {
      if (!isHTMLElement(pipelines[i])) continue;
      const statusTd = pipelines[i].querySelector('[data-label=Status] [data-qa-selector=pipeline_commit_status]');
      if (statusTd) {
        if (pipelineState[i] === judgeState(statusTd)) continue;
        diffPipelines.push(pipelines[i]);
      }
    }
    if (diffPipelines.length === 0) return;

    let successAmount = 0;
    let failedAmount = 0;
    let undoneAmount = 0;
    for (let i = 0; i < diffPipelines.length; i++) {
      const pipeline = diffPipelines[i];
      const statusTd = pipeline.querySelector('[data-label=Status] [data-qa-selector=pipeline_commit_status]');
      if (statusTd) {
        state = judgeState(statusTd);
        if (state === PIPELINE_STATE.SUCCESS || state === PIPELINE_STATE.PARTIAL_SUCCESS) successAmount++;
        else if (state === PIPELINE_STATE.FAILED || state === PIPELINE_STATE.PARTIAL_FAILED) failedAmount++;
        else undoneAmount++;
      }
    }

    const LINE_BREAK = '\%0A';
    const projectName = document.head.querySelector('title').text.split(' · ')?.[1];
    let message = `CICD狀態更新：${projectName}`;
    if (successAmount > 0) message += LINE_BREAK + `${successAmount}項成功`;
    if (failedAmount > 0) message += LINE_BREAK + `${failedAmount}項失敗`;
    if (undoneAmount > 0) message += LINE_BREAK + `還有${undoneAmount}項未完成`;
    console.warn('message', message)
    sendNotification(message);

    // 更新狀態記錄
    pipelines.forEach((pipeline, i) => {
      statusTd = pipeline.querySelector('[data-label=Status] [data-qa-selector=pipeline_commit_status]');
      pipelineState[i] = judgeState(statusTd);
    });
    console.log('state of pipelines', pipelineState);
  }

  let observer = new MutationObserver((mutations, obs) => {
    main();
  });

  observer.observe(document.querySelector("body"), {
    childList: true,
    subtree: true
  });

  if (window.location.href.endsWith('/pipelines')) {
    main();
  }

  document.getElementsByTagName('head')[0].append(
    '<link '
    + 'href="//code.jquery.com/ui/1.13.1/themes/base/jquery-ui.css" '
    + ' type="text/css">'
  );
})();