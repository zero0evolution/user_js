// ==UserScript==
// @name         tw.manhuagui.com image viewer
// @namespace    tw.manhuagui.com image viewer
// @version      0.4
// @description  try to take over the world!
// @author       zero0evolution
// @include        /^https\:\/\/tw\.manhuagui\.com\/comic\/\d+\/\d+\.html/
// @grant        none
// @require      https://zero0evolution.github.io/commonly_used_codes/checkScrollToBottom.js
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

	window.downloadInfo = {}
	downloadInfo.name = (bname+"-"+cname)
	downloadInfo.fileInfos = []

	for(const fileName of files){
		const newFileName = decodeURI(
			fileName.replace(/\.webp$/i,"")
		)
		downloadInfo.fileInfos.push(
			{
				"link":encodeURI(
					"https://us.hamreus.com"+
					path+newFileName+
					"?e="+String(e)+"&m="+m
				),
				"name":newFileName,
			}
		)
	}

	// console.log(downloadInfo)

	const tbBox = document.querySelector('#tbBox')
	const appendElem = tbBox.parentElement
	appendElem.align = "center"
	appendElem.innerHTML = ""

	let imgCoung = 0

	async function pasteImg(distance = window.innerHeight){
		while(checkScrollToBottom(distance)){
			const fileInfo = downloadInfo.fileInfos.shift()
			if(fileInfo){

				imgCoung+=1
				const pageElem = document.createElement("div")
				pageElem.textContent = ("00"+String(imgCoung)).slice(-3)
				appendElem.appendChild(pageElem)

				const imgElem = document.createElement("img")
				imgElem.dataset.name = fileInfo.name
				imgElem.dataset.src = fileInfo.link
				appendElem.appendChild(imgElem)
				
				await imgWaitToLoaded(imgElem,imgElem.dataset.src)
					.catch(error => console.log(error))

				continue
			}
			
			const failedImgs = document.querySelector("img.failed")
			if(failedImgs.length>0){
				for(const failedImg of failedImgs){

					failedImg.src = ''
					failedImg.alt = "loading again..."
					await sleep(3000)

					await imgWaitToLoaded(failedImg,failedImg.dataset.src)
						.catch(error => console.log(error))
				}
				continue
			}

			await sleep(500)
			break
		}
	}

	pasteImg()

	activeFuncWhenScrollToBottom(
		pasteImg,window.innerHeight
	)
}