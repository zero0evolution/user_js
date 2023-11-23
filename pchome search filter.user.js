// ==UserScript==
// @name         pchome search filter
// @namespace    pchome search filter
// @version      0.1
// @description  pchome search filter
// @author       zero0evolution
// @include      /^https\:\/\/ecshweb\.pchome\.com\.tw\/search\//
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?domain=pchome.com.tw
// @require      https://zero0evolution.github.io/commonly_used_codes/sleep.js
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	if(document.readyState === "loading"){
		window.addEventListener("load",function(){
			setTimeout(()=>{
				init()
			},1000)
		})
	}
	else{
		setTimeout(()=>{
			init()
		},3000)
	}

	function init(){
		// input area
		const hideInputContainer = document.createElement("div")
		hideInputContainer.innerHTML = `
			<div style="position:fixed;right:0px;top:0px;font-size:20px;">
				hide keyword:<input id="hide_keyword">
			</div>
		`
		document.body.appendChild(hideInputContainer)

		const inputElem = hideInputContainer.querySelector("#hide_keyword")

		const elemSelector = "#ItemContainer > dl"

		function getKeyWords(){
			const keyword = inputElem.value
			// keyword = keyword.replace(/\s+/img,"")
			const keywords = keyword.split(/\|+|\,+|\s+/img)
			if(keywords.length > 0 && keywords[0]){
				return(keywords)
			}
			return([])
		}

		inputElem.addEventListener("input",async function(event){
			// if(event.code.match(/Enter/i)){
				const itemElems = document.querySelectorAll(elemSelector)
				for(const itemElem of itemElems){
					await hideDlElem(itemElem)
				}
			// }
		})

		const addDlElemObserv = new MutationObserver(
			async function(mutationObjs){
				for(const eachMutationObj of mutationObjs){
					for(const addNode of eachMutationObj.addedNodes){
						if(addNode.matches(elemSelector)){
							// console.log(addNode)
							await hideDlElem(addNode)

							setTimeout(()=>{
								hideDlElem(addNode)
							},1000)
							// addNode.addEventListener("load",function(event){
							// 	hideDlElem(event.currentTarget)
							// })
						}
					}
				}
			}
		).observe(
			document.querySelector("#ItemContainer"),{
				"childList":true,
			}
		)


		async function hideDlElem(elem){
			const keywords = getKeyWords()
			if(keywords.length > 0){
				// console.log(keywords)
				for(const keyword of keywords){
					let findFlag = false
					if(elem.textContent.match(keyword)){
						await dlhide(elem)
						findFlag = true
						break
					}
					if(!findFlag){
						await dlshow(elem)
					}
				}
			}
			else{
				await dlshow(elem)
			}
		}

		const styleElem = document.createElement("style")
		styleElem.innerHTML = `
			${elemSelector}.hide{
				transition:opacity 0.25s;
				opacity:0.2;
			}
			${elemSelector}.hide:hover{
				opacity:0.7;
			}
		`
		document.head.appendChild(styleElem)

		async function dlshow(dlElem){
			// dlElem.style.removeProperty("display")
			// dlElem.style.removeProperty("height")

			// await sleep(250)
			// dlElem.style.removeProperty("opacity")
			dlElem.classList.remove("hide")
		}
		async function dlhide(dlElem){
			// addDlTransitionStyle(dlElem)
			// dlElem.style.setProperty("opacity","0")
			// await sleep(1)
			// dlElem.style.setProperty("height","0px")
			// await sleep(250)
			// dlElem.style.setProperty("display","none")
			dlElem.classList.add("hide")
		}
	}

})();