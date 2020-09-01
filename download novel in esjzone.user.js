// ==UserScript==
// @name         download novel in esjzone
// @namespace    download novel in esjzone
// @version      0.3
// @description  download novel in esjzone
// @author       zero0evolution
// @include      /^https\:\/\/www\.esjzone\.cc\//
// @run-at       document-start
// @require      https://zero0evolution.github.io/commonly_used_codes/s2t.js
// @require      https://zero0evolution.github.io/commonly_used_codes/getHTML.js
// @require      https://zero0evolution.github.io/commonly_used_codes/downloadBlobFunc.js
// @require      https://zero0evolution.github.io/commonly_used_codes/replace_forbid_file_name.js
// @grant        none
// ==/UserScript==

'use strict';

if(document.readyState === "loading"){
	window.addEventListener("load",function(){
		init()
	})
}
else{
	init()
}

function init(){
	console.log("run 'download novel in esjzone.user.js'")
	s2t_all()
	addDownloadButton()
	fixImg()
}


function fixImg(){
	const imgElems = document.querySelectorAll(".main-img>.lazyload[data-src]")
	for(const imgElem of imgElems){
		if(imgElem.style.getPropertyValue("background-image")){
			continue
		}
		const imgLink = imgElem.dataset.src
		const appendElem = imgElem.parentElement
		imgElem.remove()

		const newImgElem = document.createElement("img")
		newImgElem.src = imgLink
		appendElem.appendChild(newImgElem)
	}
}

function s2t_all(){
	document.title = s2t(document.title)

	const treeWalker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT)
	let textNode = treeWalker.nextNode()

	while(textNode){
		if(textNode.data){
			textNode.data = s2t(textNode.data)
		}
		textNode = treeWalker.nextNode()
	}
}

function addDownloadButton(){

	const chapterElems = document.querySelectorAll(`
		#chapterList>a[href^="https://esjzone.cc/forum/"],
		#chapterList>a[href^="https://www.esjzone.cc/forum/"]
	`)
	for(const chapterElem of chapterElems){
		chapterElem.href = chapterElem.href.replace(
			"https://esjzone.cc/forum/",
			"https://www.esjzone.cc/forum/"
		)
		const link = chapterElem.href

		// chapterElem.textContent = s2t(chapterElem.textContent)
		const name = replace_forbid_file_name(chapterElem.textContent)

		const downloadButton = document.createElement("button")
		downloadButton.textContent = "下載"
		if(chapterElem.firstElementChild instanceof Element){
			chapterElem.firstElementChild.append(downloadButton)
		}
		else{
			chapterElem.append(downloadButton)
		}
		downloadButton.style.setProperty("float","right")
		downloadButton.dataset.link = link
		downloadButton.dataset.name = name
		downloadButton.addEventListener("click",async function(event){
			event.stopPropagation()
			event.preventDefault()

			const elem = event.currentTarget
			
			try{
				const content = await get_esjzone_forum_content(elem.dataset.link)

				const filename = elem.dataset.name+".txt"

				downloadTextFunc(filename,content)

				elem.remove()
			}
			catch(err){
				console.error(err)
			}
		})
	}
}

async function get_esjzone_forum_content(link){
	const html = await getHTML(link)
	const tempElem = document.createElement("div")
	tempElem.innerHTML = html

	let content = ""
	const h2 = tempElem.querySelector("h2")
	if(h2 instanceof Element){
		content+=s2t(h2.textContent)+"\r\n"
	}
	else{
		console.error("can't find tag(h2) element")
	}
	
	const contentElem = tempElem.querySelector(".forum-content")
	if(contentElem instanceof Element){
		content+=s2t(contentElem.textContent)
	}
	else{
		console.error("can't find class(forum-content) element")
	}

	return(content)
}