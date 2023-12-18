// ==UserScript==
// @name         tw.manhuagui.com image viewer
// @namespace    tw.manhuagui.com image viewer
// @version      1.0
// @description  try to take over the world!
// @author       zero0evolution
// @match        https://tw.manhuagui.com/comic/*/*.html
// @run-at       document-start

// @grant        none

// @require      https://zero0evolution.github.io/commonly_used_codes/checkScrollToBottom.js
// @require      https://zero0evolution.github.io/commonly_used_codes/activeFuncWhenScroll.js
// @require      https://zero0evolution.github.io/commonly_used_codes/sleep.js
// @require      https://zero0evolution.github.io/commonly_used_codes/imgWaitToLoaded.js
// ==/UserScript==

"use strict"



if(document.readyState === "loading"){
	window.addEventListener("DOMContentLoaded", ()=>{
		init()
	})
}
else{
	init()
}

function init(){
	console.log("run tw.manhuagui.com image viewer.js")

	const targetCode = document.querySelector("body > script:nth-child(8)").innerHTML

	const matchJsCodeObj = targetCode.match(
		/window\[\"\\x65\\x76\\x61\\x6c\"\](.+)/im)
	if(!matchJsCodeObj){return(null)}

	let codeStr = eval(matchJsCodeObj[1])
	codeStr = codeStr.match("\((\{.*\})\)")[1]
	window.imgData = JSON.parse(codeStr)

	imgData.path = decodeURI(imgData.path)

	window.downloadInfo = {}
	downloadInfo.name = (imgData.bname+"-"+imgData.cname)
	downloadInfo.fileInfos = []

	for(const fileName of imgData.files){
		let newFileName = decodeURI(fileName)

		// console.log(fileName,"=>",newFileName)

		let link = "https://eu.hamreus.com"+
			imgData.path+newFileName+
			"?e="+String(imgData.sl.e)+"&m="+imgData.sl.m

		link = encodeURI(link)
		link = link.replace(/\%25/mg,"%")
		// console.log(newFileName,link)

		downloadInfo.fileInfos.push(
			{
				"link":link,
				"name":newFileName.replace(/\.webp$/i,""),
			}
		)
	}
	// console.log(downloadInfo)

	const tbBox = document.querySelector('#tbBox')
	const appendElem = tbBox.parentElement
	appendElem.align = "center"
	appendElem.innerHTML = ""

	for(let i = 0;i<downloadInfo.fileInfos.length;i++){
		const pageElem = document.createElement("div")
		pageElem.innerHTML = `<a href="${downloadInfo.fileInfos[i].link}">${downloadInfo.fileInfos[i].name}</a>`
		appendElem.appendChild(pageElem)
	}


	const btnElem = document.querySelector(".main-btn")
	const prevBtnElem = btnElem.querySelector("a.prevC")
	const newPrevBtnElem = prevBtnElem.cloneNode(true)
	prevBtnElem.remove()
	newPrevBtnElem.href = document.URL.replace(imgData.cid,imgData.prevId)

	const nextBtnElem = btnElem.querySelector("a.nextC")
	const newNextBtnElem = nextBtnElem.cloneNode(true)
	nextBtnElem.remove()
	newNextBtnElem.href = document.URL.replace(imgData.cid,imgData.nextId)

	btnElem.innerHTML = ""
	btnElem.appendChild(newPrevBtnElem)
	btnElem.appendChild(newNextBtnElem)
	
}