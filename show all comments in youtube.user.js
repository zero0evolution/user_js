// ==UserScript==
// @name         show all comments in youtube
// @namespace    show all comments in youtube
// @version      0.1
// @description  in youtube site, auto click show more comments button
// @author       zero0evolution
// @match        https://www.youtube.com/watch?v=*
// @run-at       document-start
// @grant        none
// @icon         none
// @require      https://zero0evolution.github.io/commonly_used_codes/sleep.js
// ==/UserScript==

(function() {
	'use strict';

	if(document.readyState === "loading"){
		window.addEventListener("load",function(){
			init();
		})	
	}
	else{
		init();
	}

	function init(){
		
		const buttons = getShowMoreBut(document.body)
		for(const button of buttons){
			clickBut(button)
		}

		// find show more comments button
		const observerObj = new MutationObserver(
			function(mutationObjs){
				for(const eachMutationObj of mutationObjs){
					for(const addNode of eachMutationObj.addedNodes){
						if(addNode.nodeType === 1){
							const buttons = getShowMoreBut(addNode)
							for(const button of buttons){
								clickBut(button)
							}
						}
					}
				}
			}
		).observe(
			//監視目標
			document.body,{
				"childList":true,
				"subtree":true,
			}
		)
	}

	function getShowMoreBut(topElem){
		const selectorStr = "#button button[aria-label='顯示更多回覆']"
		if(topElem.matches(selectorStr)){
			return([topElem])
		}
		const buttons = topElem.querySelectorAll(selectorStr)
		return(buttons)
	}

	async function clickBut(butElem){

		console.log("click:", butElem)
		await sleep(100)
		butElem.click()
	}

})();

