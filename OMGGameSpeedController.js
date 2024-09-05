// ==UserScript==
// @name:zh-tw      OMG遊戲速度控制器
// @name            OMG Game Speed Controller
// @namespace       com.sherryyue.omggamespeedcontroller
// @version         0.1
// @description:zh-tw   調整嵌入網頁的遊戲速度，提供一個滑動條和重置按鈕，並更新 window.forceSpeed
// @description         Adjust game speed with a slider and reset button, update window.forceSpeed
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @include         *://*:7456/*
// @match           *://*.ssgaka.com/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           none
// ==/UserScript==

(function () {
    'use strict';

    // Create the floating button
    const toggleButton = document.createElement('div');
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.width = '50px';
    toggleButton.style.height = '50px';
    toggleButton.style.background = '#f0f8ffe6';
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.color = '#fff';
    toggleButton.style.display = 'flex';
    toggleButton.style.justifyContent = 'center';
    toggleButton.style.alignItems = 'center';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '10000';
    toggleButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
    toggleButton.textContent = '⏱️';
    toggleButton.style.fontSize = '30px'; // Increase font size
    toggleButton.style.textAlign = 'center'; // Center the text
    document.body.appendChild(toggleButton);

    // Create the UI container (hidden by default)
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '70px';
    container.style.right = '10px';
    container.style.background = 'rgba(255, 255, 255, 0.9)';
    container.style.borderRadius = '12px';
    container.style.padding = '10px';
    container.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
    container.style.zIndex = '10000';
    container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    container.style.display = 'none'; // Hide initially

    // Create the label and speed display in one line
    const labelContainer = document.createElement('div');
    labelContainer.style.display = 'flex';
    labelContainer.style.justifyContent = 'space-between';
    labelContainer.style.alignItems = 'center';
    labelContainer.style.marginBottom = '5px';

    // Create the slider label
    const label = document.createElement('span');
    label.textContent = 'Game Speed:';
    label.style.fontWeight = 'bold';

    // Create the speed indicator (on the same line)
    const speedDisplay = document.createElement('span');
    speedDisplay.textContent = '1x';
    speedDisplay.style.marginLeft = '10px';
    speedDisplay.style.fontSize = '14px';

    // Append label and speed display to the same container
    labelContainer.appendChild(label);
    labelContainer.appendChild(speedDisplay);

    // Create the slider input
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0.2';
    slider.max = '20';
    slider.step = 'any';
    slider.style.width = '100%';
    slider.value = '7.176';

    // Logarithmic scale conversion
    function toLogScale(value) {
        return Math.pow(10, (value - 0.2) / 20 * (Math.log10(20) - Math.log10(0.2)) + Math.log10(0.2));
    }

    // Format speed display (integer for 1x and above, one decimal below 1x)
    function formatSpeedDisplay(speed) {
        return speed >= 1 ? speed.toFixed(0) + 'x' : '' + (+speed.toFixed(1)) + 'x';
    }

    // Create the reset button
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

    // Adjust game speed and set window.forceSpeed
    function adjustGameSpeed(speed) {
        // Set window.forceSpeed to the selected value
        window.forceSpeed = speed;

        document.querySelectorAll('video, audio').forEach((media) => {
            media.playbackRate = speed;
        });

        speedDisplay.textContent = formatSpeedDisplay(speed);
    }

    // Slider change event
    slider.addEventListener('input', function () {
        const logValue = toLogScale(parseFloat(slider.value));
        adjustGameSpeed(logValue);
    });

    // Reset button click event
    resetButton.addEventListener('click', function () {
        slider.value = '7.176';
        adjustGameSpeed(1);
    });

    // Append elements to the container
    container.appendChild(labelContainer);
    container.appendChild(slider);
    container.appendChild(resetButton);

    // Append the container to the body
    document.body.appendChild(container);

    // Toggle the visibility of the UI container on button click
    toggleButton.addEventListener('click', function () {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    });

    // Make the floating button draggable
    toggleButton.onmousedown = function (event) {
        let shiftX = event.clientX - toggleButton.getBoundingClientRect().left;
        let shiftY = event.clientY - toggleButton.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            toggleButton.style.left = pageX - shiftX + 'px';
            toggleButton.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        toggleButton.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            toggleButton.onmouseup = null;
        };
    };

    toggleButton.ondragstart = function () {
        return false;
    };
})();
