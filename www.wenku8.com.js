// ==UserScript==
// @name			 http://www.wenku8.net/novel
// @namespace	 http://www.wenku8.net/novel
// @author       zero0evolution
// @include		 /^https?\:\/\/www\.wenku8\.(?:com|net)\/novel\/\d+\/\d+/
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?domain=wenku8.net
// @version		 1.2

// @require      https://zero0evolution.github.io/commonly_used_codes/s2t.js
// @require      https://zero0evolution.github.io/commonly_used_codes/getHTML.js
// @require      https://zero0evolution.github.io/commonly_used_codes/sleep.js
// @require      https://zero0evolution.github.io/commonly_used_codes/downloadBlobFunc.js
// @require      https://zero0evolution.github.io/commonly_used_codes/replace_forbid_file_name.js
// @require      https://raw.githubusercontent.com/Stuk/jszip/master/dist/jszip.min.js

// @grant			 none
// ==/UserScript==

const init = ()=>{
	document.title = s2t(document.title)

	let titleElem = document.querySelector("#title")
	if(titleElem instanceof Element){
		titleElem.textContent = s2t(titleElem.textContent)
	}
	let infoElem = document.querySelector("#info")
	if(infoElem instanceof Element){
		infoElem.textContent = s2t(infoElem.textContent)
	}

	for(let tdElem of document.querySelectorAll(".vcss")){

		let trElem = tdElem.parentElement
		// 章節添加index
		let chapterIndex = 1

		var nextTrElem = trElem.nextElementSibling
		var newVolFlag = false

		var chapterInfos = []
		while(nextTrElem instanceof Element){
			for(let i=0;i<nextTrElem.children.length;i++){
				let subTdElem = nextTrElem.children[i]
				
				// 若是章節
				if(subTdElem.classList.contains("ccss")){

					let linkElem = subTdElem.firstElementChild
					if(!(linkElem instanceof Element)){continue}
					if(!linkElem.hasAttribute("href")){continue}
					if(!linkElem.textContent){continue}
					// 章節前加index
					linkElem.textContent = 
						("0"+String(chapterIndex)).slice(-2)+
						"-"+s2t(linkElem.textContent)

					chapterIndex++

					let link = linkElem.href
					let fileName = replace_forbid_file_name(linkElem.textContent)+".txt"
					// 建立單章下載按鈕
					let downloadButton = createChapterDownloadButton(fileName,link)
					subTdElem.appendChild(downloadButton)

					// 儲存章節名稱 章節連結
					chapterInfos.push({"fileName":fileName,"link":link})
				}
				// 若是下一本就跳出
				if(subTdElem.classList.contains("vcss")){
					newVolFlag = true
					break
				}
			}
			// 若是下一本就跳出
			if(newVolFlag){break}


			nextTrElem = nextTrElem.nextElementSibling
		}

		
		
		// 建立整本下載按鈕
		const downloadButton = document.createElement("button")
		downloadButton.textContent = "下載"
		trElem.appendChild(downloadButton)

		// 卷名稱
		tdElem.textContent = s2t(tdElem.textContent)
		let zipName = replace_forbid_file_name(tdElem.textContent)+".zip"

		// 將章節資訊儲存
		downloadButton.dataset.chapterInfos = JSON.stringify(chapterInfos)
		downloadButton.dataset.zipName = zipName

		downloadButton.onclick = async(event)=>{
			event.target.disabled = true

			let chapterInfos = JSON.parse(
				event.target.dataset.chapterInfos)

			let zipName = event.target.dataset.zipName

			var zipObj = new JSZip()

			for(let i=0;i<chapterInfos.length;i++){

				let fileName = chapterInfos[i].fileName
				let link = chapterInfos[i].link

				var content = await getChapterContent(link)

				await zipObj.file(fileName, content)

				event.target.textContent = String(i+1)+"/"+String(chapterInfos.length)

				await sleep(5000)
			}

			var zipData = await zipObj.generateAsync(
				{
					"type": "blob",
					"compression": "DEFLATE",
					"compressionOptions": {"level": 6}
				}
			).then(
				(zipData)=>{return(zipData)}
			)

			downloadBlobFunc(zipName,zipData)

			
		}
	}
}

//////////////////////////////////////////////////////

function createChapterDownloadButton(fileName,link){
	var downloadButton = document.createElement("button")
	downloadButton.textContent = "下載"
	downloadButton.dataset.link = link
	downloadButton.dataset.fileName = fileName
	
	downloadButton.onclick = async(event)=>{

		event.target.style.visibility = "hidden"

		console.log("下載:"+event.target.dataset.fileName,event.target.dataset.link)

		let content = await getChapterContent(
			event.target.dataset.link
		)

		downloadTextFunc(event.target.dataset.fileName,content)
	}
	return(downloadButton)
}

async function getChapterContent(link){

	while(true){
		let response = await fetch(link).then(
			(response)=>{return(response)}
		)
		let arrayBuffer = await response.arrayBuffer().then((arrayBuffer)=>{return(arrayBuffer)})

		// console.log("response:",response)

		let htmlCode = new TextDecoder(document.charset).decode(arrayBuffer)

		// return(htmlCode)

		let tempElem = document.createElement("div")
		tempElem.innerHTML = htmlCode

		let contentElem = tempElem.querySelector("#contentmain")
		
		if(contentElem instanceof Element){
			let content = s2t(contentElem.textContent)

			for(let imgElem of contentElem.querySelectorAll("img[src]")){
				content += "\n"+imgElem.src
			}

			return(content)
		}
		else{
			// console.log(htmlCode)
			await sleep(30000)
		}
	}
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