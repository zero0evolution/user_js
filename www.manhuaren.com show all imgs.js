// ==UserScript==
// @name         add imgs in https://www.manhuaren.com/m
// @namespace    add imgs in https://www.manhuaren.com/m
// @version      0.1
// @description  try to take over the world!
// @author       zero0evolution
// @include      /https\:\/\/www\.manhuaren\.com\/m\d+\/?/
// @run-at       document-start
// @require      none
// @grant        none
// ==/UserScript==

'use strict';


window.addEventListener("load",function(){
	var topBlock = document.createElement("div")
	topBlock.id = "topBlock"
	topBlock.align = "center"
	document.body.append(topBlock)

	var i = 0

	function addNewImg(){
		if(i >= newImgs.length){
			return(null)
		}
		let imgBlock = document.createElement("div")

		imgBlock.innerHTML = `
			<div>${String(i+1)}</div>
			<div><img src="${newImgs[i]}"></div>
		`
		let imgElem = imgBlock.querySelector("img")
		topBlock.append(imgBlock)
		i++

		imgElem.addEventListener("load",imgLoadFunc)
		function imgLoadFunc(event){
			let imgElem = event.currentTarget
			imgElem.dataset.load = "1"
			imgElem.removeEventListener("load",imgLoadFunc)
		}

		imgBlock.addEventListener("mouseenter",mouseEnterFunc)

		function mouseEnterFunc(event){
			let imgBlock = event.currentTarget
			let imgElem = imgBlock.querySelector("img")
			if(imgElem.dataset.hasOwnProperty("load")){
				addNewImg()
				imgBlock.removeEventListener("mouseenter",mouseEnterFunc)
			}
		}
	}

	// console.log(newImgs)
	addNewImg()
})