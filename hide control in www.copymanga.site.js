// ==UserScript==
// @name         hide control in www.copymanga.site
// @namespace    hide control in www.copymanga.site
// @version      0.1
// @description  hide comic which don't want to see
// @author       zero0evolution
// @match        https://www.copymanga.site/comics*
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

		main(document.body)

		const newComicObserver = new MutationObserver(function(mutationObjs){
			for(const mutationObj of mutationObjs){
				for(const addNode of mutationObj.addedNodes){
					if(addNode instanceof Element){
						main(addNode)
					}
				}
			}
		}).observe(document.body,{"childList":true,"subtree":true})

		function main(topElem){
			function getComicItems(elem){
				if(elem.matches(".exemptComic_Item")){
					return([elem])
				}
				const comicItems = elem.querySelectorAll(".exemptComic_Item")
				return(comicItems)
			}

			const comicItems = getComicItems(topElem)

			for(const comicItem of comicItems){

				function getComicInfo(comicItem){
					const info = {}

					const hrefElem = comicItem.querySelector("a[href^='/comic/']")
					info["href"] = hrefElem.getAttribute("href")
					info["en_name"] = info["href"].substring(7)

					return(info)
				}

				const comicInfo = getComicInfo(comicItem)
				comicItem.dataset.enName = comicInfo["en_name"]

				const keyName = "hide " + comicInfo["en_name"]
				const hideFlag = Boolean(localStorage.getItem(keyName))

				if(hideFlag){
					comicItem.classList.add("hide")
				}
				else{
					comicItem.classList.remove("hide")
				}

				const but = document.createElement("button")
				but.classList.add("hide-control")

				if(hideFlag){
					but.dataset.hideFlag = "1"
					but.textContent = "show"
				}
				else{
					but.dataset.hideFlag = ""
					but.textContent = "hide"
				}
				
				but.addEventListener("click",function(event){
					const but = event.currentTarget

					but.dataset.hideFlag = (but.textContent !== "hide") ? "" : "1"
					but.textContent = (but.dataset.hideFlag) ? "show" : "hide"

					const comicItem = but.parentElement
					const enName = comicItem.dataset.enName
					const keyName = "hide " + enName
					if(but.dataset.hideFlag){
						comicItem.classList.add("hide")
						localStorage.setItem(keyName, "1")
					}
					else{
						comicItem.classList.remove("hide")
						localStorage.removeItem(keyName)
					}
				})
				comicItem.appendChild(but)
			}
		}
	}
	window.addEventListener("load",function(){
		// add hide style
		const styleElem = document.createElement("style")
		styleElem.type = "text/css"
		styleElem.innerHTML = `
			main.content-box > .container.exemptComicList   .exemptComic-box > .exemptComic_Item.hide{
				opacity:0.2;
			}
			main.content-box > .container.exemptComicList   .exemptComic-box > .exemptComic_Item.hide:hover{
				opacity:0.7;
			}
			main.content-box > .container.exemptComicList   .exemptComic-box > .exemptComic_Item button.hide-control{
				height: 20px;
				line-height: 16px;
				padding: 0px;
				width: 100%;
				border: 1px white solid;
			}
		`
		document.body.previousElementSibling.appendChild(styleElem)
	})
})()