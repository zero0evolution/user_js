// ==UserScript==
// @name         sort price in pchome
// @namespace    sort price in pchome
// @version      0.5
// @description  sort price in pchome
// @author       zero0evolution
// @include      /^https\:\/\/(?:24h|shopping)\.pchome\.com\.tw\/store\/\w+/
// @run-at       document-start
// @require      https://zero0evolution.github.io/commonly_used_codes/sleep.js
// @require      https://zero0evolution.github.io/commonly_used_codes/checkScrollToBottom.js
// @grant        none
// ==/UserScript==

if(document.readyState === "loading"){
	window.addEventListener("load",()=>{
		initFunc()
	})
}
else{
	initFunc()
}

window.addEventListener("hashchange",async function(){
	await sleep(500)
	console.log("detect hashchange event, run sort price function!!!")
	await initFunc()
})
window.addEventListener("beforeunload",async function(){
	await sleep(500)
	console.log("detect beforeunload event, run sort price function!!!")
	await initFunc()
})
window.addEventListener("popstate",async function(){
	await sleep(500)
	console.log("detect popstate event, run sort price function!!!")
	await initFunc()
})


async function initFunc(){

	await clickListStyleElem()
	await setLinkNewTabFunc()
	await sortFunc()
	await hide_CCP_product()
}

titleElemMutationObserver()

async function titleElemMutationObserver(){
	const titleElem = document.querySelector("title")
	if(!(titleElem instanceof Element)){
		await sleep(200)
		titleElemMutationObserver()
		return(null)
	}
	console.log("get titleElem:",titleElem)
	const observerObj = new MutationObserver(
		async function(mutationObjs){
			await sleep(1000)
			console.log("detect titleElem changed, run sort price function!!!")
			initFunc()
		}
	).observe(
		titleElem,
		{'characterData':true,"childList":true,"subtree":true,},
	)
}

	

async function clickListStyleElem(){
	const listStyleElem = document.querySelector('.radio_box > .list > label > input[name="style"][value="2"]')
	if(listStyleElem instanceof Element){
		listStyleElem.click()
		await sleep(1000)
	}
}

function setLinkNewTabFunc(){
	const linkElems = document.querySelectorAll("a[href^='//24h.pchome.com.tw/']")
	for(const linkElem of linkElems){
		linkElem.target = "_blank"
	}
}

async function sortFunc(){
	// #ProdListContainer > dl[_id]
	// find price: .price_box > .price > .value
	// .add24hCart
	const topListElem = document.querySelector("#ProdListContainer")
	if(topListElem instanceof Element){
		const productElems = 	topListElem.querySelectorAll("dl[_id]")

		for(const elem of sortByPrice(productElems)){
			topListElem.appendChild(elem)
			// await sleep(100)
		}
	}

	// ProdGridContainer
	const topGridElem = document.querySelector("#ProdGridContainer")

	if(topGridElem instanceof Element){
		const productElems = topGridElem.querySelectorAll("dd[_id]")

		for(const elem of sortByPrice(productElems)){
			topGridElem.appendChild(elem)
			// await sleep(100)
		}
	}

	function sortByPrice(elems){
		if(!(elems instanceof Array)){
			elems = Array.prototype.slice.call(elems)
		}
		elems.sort(
			(elem1,elem2)=>{
				return(getPrice(elem1)-getPrice(elem2))
			}
		)
		return(elems)
	}

	function getPrice(elem){
		const priceElem = elem.querySelector(".price_box .price .value")
		if(priceElem instanceof Element){
			const price = Number(priceElem.textContent)
			if(Number.isInteger(price)){
				return(price)
			}
		}
		return(0)
	}
}

async function add_ccp_product_style(){
	if(!(document.head instanceof Element)){
		await sleep(250)
		add_ccp_product_style()
	}
	const ccp_product_style_elem = document.createElement("style")
	ccp_product_style_elem.innerHTML = `
		.ccp_product{
			opacity:0.3;
			// transition:opacity 0.25s;
		}
		// .ccp_product:hover{
			// opacity:0.8;
		// }
	`
	document.head.appendChild(ccp_product_style_elem)
}
add_ccp_product_style()
	
const ccp_key_pattern = /聯想|Lenovo|小米|Xiaomi|OPPO|華為|huawei/img

function hide_CCP_product(){
	// ProdGridContainer
	const topListElem = document.querySelector("#ProdListContainer")

	if(topListElem instanceof Element){
		const productElems = topListElem.querySelectorAll("dl[_id]")
		for(const productElem of productElems){
			const headerElems = productElem.querySelectorAll("h1,h2,h3,h4,h5")
			for(const headerElem of headerElems){
				if(headerElem.textContent.match(ccp_key_pattern)){
					productElem.classList.add("ccp_product")

					// const frontElem = document.createElement("div")
					// frontElem.style.setProperty("background-color","black")
					// frontElem.style.setProperty("z-index","2")
					// frontElem.style.setProperty("background-color","black")
					break
				}
			}
		}
	}
}