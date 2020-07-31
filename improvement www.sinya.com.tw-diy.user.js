// ==UserScript==
// @name         improvement https://www.sinya.com.tw/diy
// @namespace    improvement https://www.sinya.com.tw/diy
// @version      0.1
// @description  improvement https://www.sinya.com.tw/diy!
// @author       zero0evolution
// @include      /^https\:\/\/www\.sinya\.com\.tw\/diy/
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
	const targetElems = document.querySelectorAll(
		`.swiper-wrapper,.js-marquee-wrapper`)
	for(const elem of targetElems){
		elem.remove()
	}
}