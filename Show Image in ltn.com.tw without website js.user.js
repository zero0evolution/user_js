// ==UserScript==
// @name         Show Image in ltn.com.tw without website js
// @namespace    Show Image in ltn.com.tw without website js
// @version      0.1
// @description  Show Image in ltn.com.tw without website js
// @author       zero0evolution
// @match        https://*.ltn.com.tw/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ltn.com.tw
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	console.log("document.readyState:", document.readyState)

	if(document.readyState === "loading"){
		window.addEventListener("load",function(){
			init();
		})
	}
	else{
		init();
	}
		

	function init(){
		// get target image element
		console.log("尋找目標圖片")

		const imgElems = document.querySelectorAll("img")
		for(const imgElem of imgElems){
			fixSrc(imgElem)
		}
	}

	function fixSrc(imgElem){
		if(imgElem.hasAttribute("src") && imgElem.dataset.hasOwnProperty("src")){
			if(imgElem.src !== imgElem.dataset.src){
				console.log("變更圖片連結：\n", imgElem.src, "\n==>", "\n", imgElem.dataset.src)
				imgElem.src = imgElem.dataset.src
			}
		}
	}
})();