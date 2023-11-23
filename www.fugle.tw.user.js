// ==UserScript==
// @name         resize svg in www.fugle.tw
// @namespace    resize svg in www.fugle.tw
// @version      0.1
// @description  resize svg in www.fugle.tw
// @author       zero0evolution
// @match      https://www.fugle.tw/ai/*?p=*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fugle.tw

// @require      https://zero0evolution.github.io/commonly_used_codes/downloadBlobFunc.js

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
		setTimeout(()=>{
			resize_all_grid(document.body)
		},1000)
		

		const observerObj = new MutationObserver(
			(mutationObjs)=>{
				for(const eachMutationObj of mutationObjs){
					for(const addNode of eachMutationObj.addedNodes){
						if(addNode.nodeType === 1){
							setTimeout(()=>{
								resize_all_grid(addNode)
							},1000)
						}
					}
				}
			}
		).observe(
			document.body,
			{
				"childList":true,
				"subtree":true,
			}
		)
	}

	function resize_all_grid(topElem){
		const griditems = get_grid_items(topElem)
		for(const griditem of griditems){
			if(grid_filter(griditem)){
				resize_grid(griditem)
			}
		}
	}

	function get_grid_items(topElem){
		if(topElem.matches(".grid-item")){
			return([topElem])
		}

		const griditems = topElem.querySelectorAll(".grid-item")
		return(griditems)
	}

	function grid_filter(griditem){
		const nameelem = griditem.querySelector(".card-name")
		if(!(nameelem instanceof Element)){
			return(false)
		}
		// console.log(nameelem.textContent)
		if(!nameelem.textContent.match("本益比河流圖")){
			return(false)
		}
		return(true)
	}

	function resize_grid(griditem){


		function check_height(griditem){
			if(!griditem.dataset.hasOwnProperty("originHeight")){
				return(false)
			}
			const height = griditem.style.getPropertyValue("height")

			return(griditem.dataset.originHeight === height)
		}

		function write_height(griditem){
			const height = griditem.style.getPropertyValue("height")
			griditem.dataset.originHeight = height
			const newHeight = px_multi_scale(height)
			griditem.dataset.newHeight = newHeight
		}

		function check_child_height(child){
			
		}
		
		function write_child_height(child){
			const height = child.getAttribute("height")
			child.dataset.originHeight = height
			const newHeight = String(parseInt(height)*scale)
			child.dataset.newHeight = newHeight
			child.setAttribute("height",newHeight)
		}

		griditem.addEventListener("mouseenter",function(event){
			const griditem = event.currentTarget
			griditem.style.setProperty("height",griditem.dataset.newHeight)

			for(const child of griditem.querySelectorAll("[height]")){
				child.setAttribute("height",child.dataset.newHeight)
			}
		})

		griditem.addEventListener("mouseleave",function(event){
			const griditem = event.currentTarget
			griditem.style.setProperty("height",griditem.dataset.originHeight)

			for(const child of griditem.querySelectorAll("[height]")){
				child.setAttribute("height",child.dataset.originHeight)
			}
		})
	}

	const scale = 2

	function str_multi_scale(input_str){
		return(String(parseInt(Number(input_str)*scale)))
	}
	function px_multi_scale(input_str){
		input_str = input_str.match(/^(\d+)px$/)[1]
		input_str = str_multi_scale(input_str)
		return(input_str+"px")
	}
})();