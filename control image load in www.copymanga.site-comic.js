// ==UserScript==
// @name         control image load in www.copymanga.site/comic
// @namespace    control image load in www.copymanga.site/comic
// @version      0.1
// @description  auto reload broke image, load image 1 by 1
// @author       zero0evolution
// @match        https://copymanga.site/comic/*/chapter/*
// @run-at       document-start
// @grant        none
// @icon         none
// ==/UserScript==

(function() {
	'use strict';

	window.addEventListener("DOMContentLoaded",function(){
		init();
	})

	function init(){
		
		const topElem = document.querySelector(".comicContent>.container>.comicContent-list")

		const cssElem = document.createElement("style")
		cssElem.innerHTML = `
			div{
				color:white;
			}
			img{
				border:white 1px solid;
			}
		`
		document.body.appendChild(cssElem)

		document.body.addEventListener("mouseup",function(event){
			event.stopImmediatePropagation()
			event.stopPropagation()
		})
		
		// check image elem create
		const imgCreatObserverObj = new MutationObserver(function(mutationObjs){

			for(const eachMutationObj of mutationObjs){

				for(const eachNode of eachMutationObj.addedNodes){

					if(eachNode instanceof Element && eachNode.matches("li")){

						const li = eachNode

						const topElem = li.parentElement

						const imgElem = li.querySelector("img")

						// img elem stop propergation
						/*imgElem.addEventListener("mouseup",function(event){
							event.stopImmediatePropagation()
							event.stopPropagation()
						})*/

						// show page num
						function writeLiIndex(li){
							let prevLi = li.previousElementSibling
							while(true){
								if(prevLi === null){
									li.dataset.index = "0"
									return(0)
								}
								else if(!prevLi.matches("li")){
									prevLi = prevLi.previousElementSibling
									continue
								}
								else{
									if(!prevLi.dataset.hasOwnProperty("index")){
										writeLiIndex(prevLi)
									}
									let index = Number(prevLi.dataset.index) + 1
									li.dataset.index = index
									return(index)
								}
							}
						}
						let index = writeLiIndex(li)
						const pageNumElem = document.createElement("div")
						pageNumElem.classList.add("page-num")
						pageNumElem.textContent = ("00" + String(index + 1)).slice(-3)
						li.insertBefore(pageNumElem,imgElem)

						// double click to reload img
						imgElem.addEventListener("dblclick",function(event){
							const imgElem = event.currentTarget
							imgElem.src = imgElem.dataset.src
						})

						
						// temp delete src
						// imgElem.src = ""
						// imgElem.dataset.loadedFlag = ""
						// imgElem.dataset.loadingFlag = ""
						// imgElem.dataset.waitFlag = ""

						/*imgElem.addEventListener("load",function(event){
							const imgElem = event.currentTarget
							imgElem.dataset.loadedFlag = "1"
							imgElem.dataset.loadingFlag = ""
							// loadFirstImg()
						})*/

						imgElem.addEventListener("error",function(event){
							const imgElem = event.currentTarget
							if(!imgElem.dataset.waitFlag){

								// imgElem.src = ""
								// imgElem.dataset.loadingFlag = ""
								// imgElem.dataset.loadedFlag = ""

								// // wait flag
								// imgElem.dataset.waitFlag = "1"

								// reload count
								if(imgElem.dataset.hasOwnProperty("errorCount")){
									imgElem.dataset.errorCount = parseInt(imgElem.dataset.errorCount) + 1
								}
								else{
									imgElem.dataset.errorCount = "1"
								}
								
								imgElem.alt = "error count:" + imgElem.dataset.errorCount

								// load next
								// loadNextImg(imgElem)

								// load when mouse enter
								/*function mouseEnterFunc(event){
									const imgElem = event.currentTarget
									imgElem.dataset.waitFlag = ""
									imgElem.removeEventListener("mouseenter",mouseEnterFunc)

									if(!(getNowLoadingImg() instanceof Element)){
										loadFirstImg()
									}
								}
								const waitMs = 3000
								setTimeout(function(){
									imgElem.addEventListener("mouseenter",mouseEnterFunc)
								},waitMs)*/
							}
						})

						/*function loadImg(imgElem){
							// imgElem.src = imgElem.dataset.src
							imgElem.dataset.loadingFlag = "1"
						}*/

						/*function loadFirstImg(){
							const firstImgElem = topElem.querySelector("img[data-loading-flag=''][data-loaded-flag=''][data-wait-flag='']")
							if(firstImgElem instanceof Element){
								loadImg(firstImgElem)
							}
							return(firstImgElem)
						}*/

						/*function loadNextImg(prevImg){
							let li = prevImg.parentElement.nextElementSibling
							while(li instanceof Element){
								let img = li.querySelector("img")
								if(img.matches("img[data-loading-flag='1']")){
									return(img)
								}
								else if(img.matches("img[data-loading-flag=''][data-loaded-flag=''][data-wait-flag='']")){
									loadImg(img)
									return(img)
								}
								else{
									li = li.nextElementSibling
									continue
								}
							}
						}*/

						/*function getNowLoadingImg(){
							const loadingImgElem = topElem.querySelector("img[data-loading-flag='1']")
							return(loadingImgElem)
						}*/

						// if no loading img elem, pick first unload img to load
						/*if(!(getNowLoadingImg() instanceof Element)){
							loadFirstImg()
						}*/
					}
				}
			}
		}).observe(
			//監視目標
			topElem,{
				//監視目標節點的子元素的新增和移除
				"childList":true,
				//監視對於所有目標節點子系
				// "subtree":true,
			}
		)
	}
})();