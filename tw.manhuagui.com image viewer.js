// ==UserScript==
// @name         tw.manhuagui.com image viewer
// @namespace    tw.manhuagui.com image viewer
// @version      0.5
// @description  try to take over the world!
// @author       zero0evolution
// @include        /^https\:\/\/tw\.manhuagui\.com\/comic\/\d+\/\d+\.html/
// @grant        none
// @require      https://zero0evolution.github.io/commonly_used_codes/checkScrollToBottom.js
// @require      https://zero0evolution.github.io/commonly_used_codes/activeFuncWhenScroll.js
// @require      https://zero0evolution.github.io/commonly_used_codes/sleep.js
// @require      https://zero0evolution.github.io/commonly_used_codes/imgWaitToLoaded.js
// ==/UserScript==

"use strict"



if(document.readyState === "loading"){
	window.addEventListener("load", ()=>{
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

	if(!matchJsCodeObj){
		return(null)
	}

	// 處理連結
	const keyString = eval(matchJsCodeObj[1])
	// console.log(keyString)
	
	const bid = Number(keyString.match(/\"bid\"\:(.*?)(?:\,|\})/)[1])
	const bname = eval(keyString.match(/\"bname\"\:(.*?)(?:\,|\})/)[1])
	const cid = Number(keyString.match(/\"cid\"\:(.*?)(?:\,|\})/)[1])
	const cname = eval(keyString.match(/\"cname\"\:(.*?)(?:\,|\})/)[1])
	const files = eval(keyString.match(/\"files\"\:(\[.*?\])/)[1])

	const path = decodeURI(
		eval(keyString.match(/\"path\"\:(.*?)(?:\,|\})/)[1])
	)

	const e = eval(keyString.match(/\"e\"\:(.*?)(?:\,|\})/)[1])

	const m = eval(keyString.match(/\"m\"\:(.*?)(?:\,|\})/)[1])

	const downloadInfo = {}
	downloadInfo.name = (bname+"-"+cname)
	downloadInfo.fileInfos = []

	for(const fileName of files){
		const newFileName = decodeURI(
			fileName.replace(/\.webp$/i,"")
		)

		// console.log(fileName,"=>",newFileName)

		let link = "https://us.hamreus.com"+
			path+newFileName+
			"?e="+String(e)+"&m="+m

		link = encodeURI(link)
		link = link.replace(/\%25/mg,"%")
		// console.log(newFileName,link)

		downloadInfo.fileInfos.push(
			{
				"link":link,
				"name":newFileName,
			}
		)
	}

	// console.log(downloadInfo)

	const tbBox = document.querySelector('#tbBox')
	const appendElem = tbBox.parentElement
	appendElem.align = "center"
	appendElem.innerHTML = ""

	// console.log("downloadInfo.fileInfos.length",downloadInfo.fileInfos.length)
	

	let i = 0
	async function pasteImg(distance = window.innerHeight){

		// console.log(checkScrollToBottom(distance),downloadInfo.fileInfos.length)

		while(checkScrollToBottom(distance) && downloadInfo.fileInfos.length>0){

			const fileInfo = downloadInfo.fileInfos.shift()
			console.log(fileInfo)

			i+=1
			const pageElem = document.createElement("div")
			pageElem.textContent = ("00"+String(i)).slice(-3)
			appendElem.appendChild(pageElem)

			const imgElem = document.createElement("img")
			imgElem.dataset.name = fileInfo.name
			imgElem.dataset.src = fileInfo.link
			appendElem.appendChild(imgElem)
			
			setTimeout(function(){
				imgElem.style.setProperty("height","auto")
				imgElem.style.setProperty("width","auto")
			},50)

			await imgWaitToLoaded(imgElem,fileInfo.link)
				.catch(error => console.log(error))

			await sleep(500)
		}
	}

	pasteImg()

	activeFuncWhenScrollToBottom(
		pasteImg,window.innerHeight
	)


	async function loadErrorImgAgain(){
		const failedImgs = document.querySelectorAll("img.failed")
		for(const failedImg of failedImgs){
			const src = failedImg.dataset.src
			failedImg.src = ''
			failedImg.alt = "loading again..."

			await imgWaitToLoaded(failedImg,src)
				.catch(error => console.log(error))
			
			await sleep(500)
		}
		await sleep(3000)
	}

	activeFuncWhenScroll(loadErrorImgAgain)
	
}