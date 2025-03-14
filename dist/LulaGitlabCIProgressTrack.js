// ==UserScript==
// @name:zh-tw      GitLab CI/CD Telegram 進度追蹤 - Lula
// @name            GitLab CI/CD Telegram Progress Notifier - Lula
// @namespace       com.sherryyue.lulagitlabciprogresstrack
// @version         0.5
// @description:zh-tw 此腳本在 GitLab CI/CD 中發送部署成功與失敗通知到 Telegram 頻道。它會通知您流水線和工作的成功或失敗，讓您在離開時能夠在手機或其他裝置上接收更新。
// @description       This script sends notifications to a Telegram channel on GitLab CI/CD. It notifies you of the success or failure of pipelines and jobs, allowing you to receive updates on your mobile device or other devices while you are away.
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           http://gitlab.lulainno.com/*
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @require         https://code.jquery.com/jquery-3.6.0.js
// @require         https://code.jquery.com/ui/1.13.1/jquery-ui.js
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           GM_addStyle
// ==/UserScript==
(function () {
    const TGToken = '6029836287:AAGtY81VFypCB976DwfRG7hZ033oEHzBT1Y';
    const chatId = 901947307;
    let pipelineState = {};
    let pipelineEverUpdate = {};
    let prevUndoneAmount = -1, prevSuccessAmount = -1, prevFailedAmount = -1;
    const PIPELINE_STATE = {
        PENDING: 'pending',
        RUNNING: 'running',
        SUCCESS: 'success',
        FAILED: 'failed',
        PARTIAL_SUCCESS: 'success-with-warnings',
        PARTIAL_FAILED: 'failed-with-warnings',
        WAITING_RESOURCES: 'waiting-for-resource',
    };
    function judgeState(elm) {
        const classList = elm.classList;
        if (classList.contains('ci-pending'))
            return PIPELINE_STATE.PENDING;
        if (classList.contains('ci-running'))
            return PIPELINE_STATE.RUNNING;
        if (classList.contains('ci-success'))
            return PIPELINE_STATE.SUCCESS;
        if (classList.contains('ci-failed'))
            return PIPELINE_STATE.FAILED;
        if (classList.contains('ci-success-with-warnings'))
            return PIPELINE_STATE.PARTIAL_SUCCESS;
        if (classList.contains('ci-failed-with-warnings'))
            return PIPELINE_STATE.PARTIAL_FAILED;
        if (classList.contains('ci-waiting-for-resource'))
            return PIPELINE_STATE.WAITING_RESOURCES;
    }
    function getPipeLineId(elm) {
        return elm.querySelector('.pipeline-tags [data-qa-selector="pipeline_url_link"]')?.innerText.trim() || '';
    }
    function sendNotification(msg) {
        const searchParams = new URLSearchParams({
            chat_id: chatId.toString(),
            parse_mode: 'MarkdownV2',
            text: msg,
        });
        const requestUrl = new URL(`https://api.telegram.org/bot${TGToken}/sendMessage`);
        requestUrl.search = searchParams.toString().replace(/%25/g, '%');
        fetch(requestUrl.toString());
    }
    function isHTMLElement(obj) {
        return obj?.nodeType === 1;
    }
    function main() {
        const pipelines = document.querySelectorAll('.commit[data-testid=pipeline-table-row]');
        if (Object.keys(pipelineState).length === 0) {
            pipelines.forEach((pipeline) => {
                const statusTd = pipeline.querySelector('[data-label=Status] [data-qa-selector=pipeline_commit_status]');
                pipelineState[getPipeLineId(pipeline)] = judgeState(statusTd) || '';
                pipelineEverUpdate[getPipeLineId(pipeline)] = false;
            });
            return;
        }
        let diffPipelines = [];
        pipelines.forEach((pipeline) => {
            if (!isHTMLElement(pipeline))
                return;
            const statusTd = pipeline.querySelector('[data-label=Status] [data-qa-selector=pipeline_commit_status]');
            if (statusTd) {
                if (pipelineState[getPipeLineId(pipeline)] === judgeState(statusTd)) {
                    return;
                }
                console.log('changed', getPipeLineId(pipeline), pipelineState[getPipeLineId(pipeline)], judgeState(statusTd));
                diffPipelines.push(pipeline);
            }
        });
        if (diffPipelines.length === 0)
            return;
        let successAmount = 0;
        let failedAmount = 0;
        let undoneAmount = 0;
        pipelines.forEach((pipeline) => {
            const statusTd = pipeline.querySelector('[data-label=Status] [data-qa-selector=pipeline_commit_status]');
            if (statusTd) {
                const state = judgeState(statusTd);
                if ((state === PIPELINE_STATE.SUCCESS || state === PIPELINE_STATE.PARTIAL_SUCCESS) &&
                    pipelineEverUpdate[getPipeLineId(pipeline)] === true &&
                    pipelineState[getPipeLineId(pipeline)] !== judgeState(statusTd))
                    successAmount++;
                else if ((state === PIPELINE_STATE.FAILED || state === PIPELINE_STATE.PARTIAL_FAILED) &&
                    pipelineEverUpdate[getPipeLineId(pipeline)] === true &&
                    pipelineState[getPipeLineId(pipeline)] !== judgeState(statusTd))
                    failedAmount++;
                else if ((state === PIPELINE_STATE.RUNNING || state === PIPELINE_STATE.PENDING || state === PIPELINE_STATE.WAITING_RESOURCES))
                    undoneAmount++;
            }
        });
        if (prevUndoneAmount < undoneAmount ||
            prevSuccessAmount < successAmount ||
            prevFailedAmount < failedAmount) {
            const LINE_BREAK = '\%0A';
            const projectName = document.head.querySelector('title')?.text.split(' · ')?.[1] || '';
            let message = `CICD狀態更新：${projectName}`;
            if (undoneAmount > 0)
                message += LINE_BREAK + `還有${undoneAmount}項未完成`;
            else {
                if (failedAmount > 0) {
                    message += LINE_BREAK + `全數完成，但有${failedAmount}項失敗`;
                }
                else if (undoneAmount === 0) {
                    message += LINE_BREAK + `全數完成`;
                }
            }
            console.log('sent message: ', message);
            sendNotification(message);
            prevUndoneAmount = undoneAmount;
            prevSuccessAmount = successAmount;
            prevFailedAmount = failedAmount;
        }
        pipelines.forEach((pipeline) => {
            const statusTd = pipeline.querySelector('[data-label=Status] [data-qa-selector=pipeline_commit_status]');
            if (pipelineState[getPipeLineId(pipeline)] !== judgeState(statusTd)) {
                pipelineState[getPipeLineId(pipeline)] = judgeState(statusTd) || '';
                pipelineEverUpdate[getPipeLineId(pipeline)] = true;
            }
        });
        console.log('state of pipelines', pipelineState);
    }
    const observer = new MutationObserver((mutations, obs) => {
        main();
    });
    observer.observe(document.querySelector("body"), {
        childList: true,
        subtree: true
    });
    if (window.location.href.endsWith('/pipelines')) {
        main();
    }
    document.getElementsByTagName('head')[0].append('<link '
        + 'href="//code.jquery.com/ui/1.13.1/themes/base/jquery-ui.css" '
        + ' type="text/css">');
})();
