// ==UserScript==
// @name         http://www.coolpc.com.tw/evaluate.php
// @namespace    http://www.coolpc.com.tw/evaluate.php
// @version      0.1
// @description  http://www.coolpc.com.tw/evaluate.php
// @author       zero0evolution
// @include      /^https?\:\/\/www\.coolpc\.com\.tw\/evaluate\.php/
// @run-at       document-start
// @require      none
// @grant        none
// ==/UserScript==

'use strict';
if(document.readyState === "loading"){
	window.addEventListener("load",function(){
		init()
	})
}
else{
	init()
}

function init(){
	for(const optionElem of document.querySelectorAll('select option')){
		if(optionElem.textContent.match(/玻璃/)){
			optionElem.style.setProperty("color","#808080")
		}
	}
}