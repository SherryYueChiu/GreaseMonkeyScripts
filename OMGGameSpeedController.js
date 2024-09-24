// ==UserScript==
// @name:zh-tw      OMG遊戲速度控制器
// @name            OMG Game Speed Controller
// @namespace       com.sherryyue.omggamespeedcontroller
// @version         0.4
// @description:zh-tw   調整嵌入網頁的遊戲速度，提供一個滑動條和重置按鈕，並更新 window.forceSpeed
// @description         Adjust game speed with a slider and reset button, update window.forceSpeed
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @include         *://*:7456/*
// @match           *://*.ssgaka.com/*
// @exclude         *://*.ssgaka.com/history/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           none
// ==/UserScript==

(function () {
    'use strict';

    // Create the draggable UI container (collapsed by default)
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50px'; // Initial position (can be adjusted)
    container.style.right = '-200px'; // Fully hidden when collapsed
    container.style.width = '200px';
    container.style.height = 'auto';
    container.style.background = 'rgba(255, 255, 255, 0.9)';
    container.style.padding = '10px';
    container.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
    container.style.zIndex = '10000';
    container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    container.style.transition = 'right 0.3s ease';
    container.style.cursor = 'pointer';

    // Create the toggle button (clickable area to expand/collapse)
    const toggleButton = document.createElement('div');
    toggleButton.style.position = 'absolute';
    toggleButton.style.top = '0';
    toggleButton.style.left = '-20px';
    toggleButton.style.width = '20px';
    toggleButton.style.height = '100%';
    toggleButton.style.background = '#007AFF';
    toggleButton.style.borderRadius = '12px 0 0 12px'; // Only left side of the button with rounded corners
    toggleButton.style.display = 'flex';
    toggleButton.style.alignItems = 'center';
    toggleButton.style.justifyContent = 'center';
    toggleButton.style.color = '#fff';
    toggleButton.textContent = '◀'; // Initial arrow direction
    toggleButton.style.fontSize = '16px';
    toggleButton.style.cursor = 'pointer';
    container.appendChild(toggleButton);

    // Create the label and speed display in one line
    const labelContainer = document.createElement('div');
    labelContainer.style.display = 'flex';
    labelContainer.style.justifyContent = 'space-between';
    labelContainer.style.alignItems = 'center';
    labelContainer.style.marginBottom = '5px';

    const label = document.createElement('span');
    label.textContent = 'Game Speed:';
    label.style.fontWeight = 'bold';

    const speedDisplay = document.createElement('span');
    speedDisplay.textContent = '1x';
    speedDisplay.style.marginLeft = '10px';
    speedDisplay.style.fontSize = '14px';
    labelContainer.appendChild(label);
    labelContainer.appendChild(speedDisplay);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0.2';
    slider.max = '20';
    slider.step = 'any';
    slider.style.width = '100%';
    slider.value = '7.176';

    function toLogScale(value) {
        return Math.pow(10, (value - 0.2) / 20 * (Math.log10(20) - Math.log10(0.2)) + Math.log10(0.2));
    }

    function formatSpeedDisplay(speed) {
        return speed >= 1 ? speed.toFixed(0) + 'x' : '' + (+speed.toFixed(1)) + 'x';
    }

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset to 1x';
    resetButton.style.backgroundColor = '#007AFF';
    resetButton.style.color = '#fff';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '8px';
    resetButton.style.padding = '5px 10px';
    resetButton.style.cursor = 'pointer';
    resetButton.style.fontSize = '14px';
    resetButton.style.width = '100%';
    resetButton.style.marginTop = '10px';

    function adjustGameSpeed(speed) {
        window.forceSpeed = speed;
        document.querySelectorAll('video, audio').forEach((media) => {
            media.playbackRate = speed;
        });
        speedDisplay.textContent = formatSpeedDisplay(speed);
    }

    slider.addEventListener('input', function () {
        const logValue = toLogScale(parseFloat(slider.value));
        adjustGameSpeed(logValue);
    });

    resetButton.addEventListener('click', function () {
        slider.value = '7.176';
        adjustGameSpeed(1);
    });

    container.appendChild(labelContainer);
    container.appendChild(slider);
    container.appendChild(resetButton);
    document.body.appendChild(container);

    // Toggle button click event for expanding/collapsing
    toggleButton.addEventListener('click', function () {
        if (container.style.right === '0px') {
            container.style.right = '-200px'; // Fully hidden when collapsed
            toggleButton.textContent = '◀'; // Collapse
        } else {
            container.style.right = '0px'; // Fully expanded
            toggleButton.textContent = '▶'; // Expand
        }
    });

    // Make the container draggable vertically only
    let isDragging = false;
    let offsetY = 0;

    toggleButton.addEventListener('mousedown', function (event) {
        isDragging = true;
        offsetY = event.clientY - container.getBoundingClientRect().top;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function (event) {
        if (isDragging) {
            let newTop = event.clientY - offsetY;
            if (newTop < 0) newTop = 0; // Prevent dragging above the window
            if (newTop + container.offsetHeight > window.innerHeight) {
                newTop = window.innerHeight - container.offsetHeight; // Prevent dragging below the window
            }
            container.style.top = `${newTop}px`;
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
        document.body.style.userSelect = '';
    });
})();
