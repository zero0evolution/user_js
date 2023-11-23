// ==UserScript==
// @name         24h.m.pchome.com.tw filter
// @namespace    24h.m.pchome.com.tw filter
// @version      0.1
// @description  try to take over the world!
// @author       zero0evolution
// @match        https://24h.m.pchome.com.tw/store/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pchome.com.tw
// @grant        none
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
		// li._prodLi:has(.ui-btn.soldOut)
		// li._prodLi:has(.ui-btn.orderReplenish)
		elemDoFunc("li._prodLi", elemFunc)
	}
})();

function elemFunc(elem){
	var btn = elem.querySelector(".ui-btn.soldOut")
	if(btn instanceof Element){
		elem.style.setProperty("opacity","0.3")
	}
	btn = elem.querySelector(".ui-btn.orderReplenish")
	if(btn instanceof Element){
		elem.style.setProperty("opacity","0.5")
	}
	const tempElem = document.createElement("div")
	tempElem.innerHTML = `
		<div style="
			float:right;
			height:28px;
			width:28px;
			font-size:20px;
			text-align: center;
			border:1px solid gray;
			"
		>
			✕
		</div>
	`
	const xBtn = tempElem.firstElementChild
	elem.appendChild(xBtn)
	xBtn.addEventListener("click",function(event){
		const xBtn = event.currentTarget
		xBtn.parentElement.remove()
	})
}

function elemDoFunc(css, func, topElem = document.body){
	if(topElem.matches(css)){
		func(topElem)
	}

	const elems = topElem.querySelectorAll(css)
	for(const elem of elems){
		func(elem)
	}

	const observerObj = new MutationObserver(
		(mutationObjs)=>{
			for(const eachMutationObj of mutationObjs){
				for(const addNode of eachMutationObj.addedNodes){
					if(addNode.nodeType === 1){

						setTimeout(function(){
							if(addNode.matches(css)){
								func(addNode)
							}
							const elems = addNode.querySelectorAll(css)
							for(const elem of elems){
								func(elem)
							}
						},1000)
					}
				}
			}
		}
	).observe(
		topElem,
		{
			"childList":true,
			"subtree":true,
		}
	)
}