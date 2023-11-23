// ==UserScript==
// @name         add i.imgur.com image on www.ptt.cc and www.disp.cc
// @namespace    add i.imgur.com image on www.ptt.cc and www.disp.cc
// @version      0.4
// @description  add i.imgur.com image on www.ptt.cc and www.disp.cc
// @author       zero0evolution
// @include     /^https?\:\/\/((?:www\.ptt(web)?|disp).cc)/
// @grant        none
// ==/UserScript==




const addImgElem = (searchElem)=>{


	const insertImgElem = (elem,link)=>{

		if(elem.parentElement.querySelector(`[data-link="${link}"]`) instanceof Element){

			return(null)
		}
		console.log(link)

		const topElem = document.createElement("div")
		topElem.dataset.link = link
		topElem.innerHTML = `
			<div align="center">
				<img 
					src="${link}"
					style="
						max-width:100%;
						max-height:100vh;
						width:auto;
						height:auto;
					"
				>
			</div>
		`

		// 換行
		elem.parentElement.insertBefore(
			document.createElement("br"),
			elem.nextSibling
		)

		elem.parentElement.insertBefore(
			topElem,
			elem.nextSibling
		)

		// 換行
		elem.parentElement.insertBefore(
			document.createElement("br"),
			elem.nextSibling
		)

		return(topElem.querySelector("img"))
	}

	const linkElemFilter = (elem)=>{
		let link = elem.textContent

		const imgurLinkPattern = /^https?\:\/\/imgur\.com\/[\w\-]*$/i
		if(link.match(imgurLinkPattern)){
			link = link.replace(/imgur\.com/im,"i.imgur.com")+".jpg"
		}

		const imgurImgPattern = /^https?\:\/\/i\.imgur\.com\/[\w\-]*\.(?:jpg|png|gif)$/i
		if(link.match(imgurImgPattern)){
			const imgElem = insertImgElem(elem,link)

			// 若圖片載入錯誤，將https換成http
			imgElem.addEventListener(
				"error",(event)=>{
					const imgElem = event.currentTarget
					imgElem.src = imgElem.src.replace(/^https/,"http")
				}
			)
		}
	}


	if(searchElem.matches("a[href]")){
		linkElemFilter(searchElem)
	}

	for(const elem of searchElem.querySelectorAll("a[href]")){
		linkElemFilter(elem)
	}
}


const init = ()=>{

	console.log("run add i.imgur.com image in",document.URL)

	addImgElem(document.documentElement)

	//建立新的觀察物件
	const observerObj = new MutationObserver(
		async function (mutationObjs){
			for(const eachMutationObj of mutationObjs){
				for(const eachNode of eachMutationObj.addedNodes){
					if(eachNode.nodeType === 1){
						addImgElem(eachNode)
					}
				}
			}
		}
	).observe(
		//監視目標
		document.documentElement,{
			"childList":true,
			"subtree":true,
		}
	)
}


if(document.readyState === "loading"){
	document.addEventListener(
		"DOMContentLoaded",()=>{
			init()
		}
	)
}
else{
	init()
}
