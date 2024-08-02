// ==UserScript==
// @name         Baidu FLAC Player
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A script to play FLAC audio files on www.baidu.com
// @author       Now，See My Name & say its too late to pologize
// @match        https://www.baidu.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    var style = document.createElement('style');
    style.innerHTML = `
        #playerDiv {
            position: fixed;
            right: 10px;
            top: 10px;
            width: 320px;
            height: 450px;
            background-color: rgba(255, 255, 255, 0.9);
            border: 1px solid #ccc;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            padding: 10px;
            overflow-y: auto;
            font-family: Arial, sans-serif;
        }
        #playerDiv button, #playerDiv select {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
            cursor: pointer;
            font-size: 16px;
        }
        #playerDiv button:hover, #playerDiv select:hover {
            background-color: #e9e9e9;
        }
        #playerDiv ul {
            list-style: none;
            padding: 0;
        }
        #playerDiv ul li {
            padding: 10px;
            margin-bottom: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
            cursor: pointer;
        }
        #playerDiv ul li:hover {
            background-color: #e9e9e9;
        }
        #playerDiv audio {
            width: 100%;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);

    // 创建playerDiv并添加到页面
    var playerDiv = document.createElement('div');
    playerDiv.id = 'playerDiv';
    document.body.appendChild(playerDiv);

    // 创建按钮并添加到playerDiv
    var fileInputButton = document.createElement('button');
    fileInputButton.textContent = '选择FLAC文件';
    playerDiv.appendChild(fileInputButton);

    // 创建文件输入并隐藏
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.flac';
    fileInput.style.display = 'none';
    fileInput.multiple = true;
    playerDiv.appendChild(fileInput);

    // 创建音乐列表
    var musicList = document.createElement('ul');
    playerDiv.appendChild(musicList);

    // 播放模式选择
    var modeSelect = document.createElement('select');
    var modes = ['顺序播放', '随机播放', '单曲循环'];
    modes.forEach(function(mode) {
        var option = document.createElement('option');
        option.value = mode;
        option.text = mode;
        modeSelect.appendChild(option);
    });
    playerDiv.appendChild(modeSelect);

    // 创建audio元素
    var audioPlayer = document.createElement('audio');
    audioPlayer.controls = true;
    playerDiv.appendChild(audioPlayer);

    // 文件选择事件
    fileInputButton.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(event) {
        var files = event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var listItem = document.createElement('li');
            listItem.textContent = file.name;
            listItem.dataset.file = URL.createObjectURL(file);
            musicList.appendChild(listItem);
        }
    });

    // 音乐列表点击事件
    musicList.addEventListener('click', function(event) {
        if (event.target.tagName.toLowerCase() === 'li') {
            audioPlayer.src = event.target.dataset.file;
            audioPlayer.play();
        }
    });

    // 播放模式控制
    audioPlayer.addEventListener('ended', function() {
        var currentMode = modeSelect.value;
        var currentIndex = -1;
        for (var i = 0; i < musicList.children.length; i++) {
            if (musicList.children[i].dataset.file === audioPlayer.src) {
                currentIndex = i;
                break;
            }
        }

        if (currentMode === '顺序播放') {
            currentIndex = (currentIndex + 1) % musicList.children.length;
        } else if (currentMode === '随机播放') {
            currentIndex = Math.floor(Math.random() * musicList.children.length);
        }

        audioPlayer.src = musicList.children[currentIndex].dataset.file;
        audioPlayer.play();
    });

    // 单曲循环模式
    modeSelect.addEventListener('change', function() {
        if (modeSelect.value === '单曲循环') {
            audioPlayer.loop = true;
        } else {
            audioPlayer.loop = false;
        }
    });
})();

