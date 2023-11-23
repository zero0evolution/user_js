// ==UserScript==
// @name         resize images in twitter.com
// @namespace    resize images in twitter.com
// @version      0.1
// @description  try to take over the world!
// @author       zero0evolution
// @match        https://twitter.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	if(document.readyState === "loading"){
		window.addEventListener("load",function(){
			init();
		})	
	}
	else{
		init();
	}

	const filter = `html>body>div#react-root>div.css-1dbjc4n.r-13awgt0.r-12vffkv>div.css-1dbjc4n.r-13awgt0.r-12vffkv>div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010>main.css-1dbjc4n.r-1habvwh.r-16y2uox.r-1wbh5a2>div.css-1dbjc4n.r-150rngu.r-16y2uox.r-1wbh5a2.r-rthrr5>div.css-1dbjc4n.r-aqfbo4.r-16y2uox>div.css-1dbjc4n.r-1oszu61.r-1niwhzg.r-18u37iz.r-16y2uox.r-1wtj0ep.r-2llsf.r-13qz1uu>div.css-1dbjc4n.r-yfoy6g.r-18bvks7.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c>div.css-1dbjc4n>section.css-1dbjc4n>div.css-1dbjc4n>div>div>div.css-1dbjc4n.r-1ila09b.r-qklmqi.r-1adg3ll.r-1ny4l3l>div.css-1dbjc4n>div.css-1dbjc4n>article.css-1dbjc4n.r-18u37iz.r-1ny4l3l.r-1udh08x.r-1oknz3f.r-7skiz8>div.css-1dbjc4n.r-eqz5dr.r-16y2uox.r-1wbh5a2>div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1ny4l3l>div.css-1dbjc4n>div.css-1dbjc4n>div.css-1dbjc4n>div[id^="id__"].css-1dbjc4n.r-1i71y14.r-l71dzp,
	html>body>div#react-root>div.css-1dbjc4n.r-13awgt0.r-12vffkv>div.css-1dbjc4n.r-13awgt0.r-12vffkv>div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010>main.css-1dbjc4n.r-1habvwh.r-16y2uox.r-1wbh5a2>div.css-1dbjc4n.r-150rngu.r-16y2uox.r-1wbh5a2.r-rthrr5>div.css-1dbjc4n.r-aqfbo4.r-16y2uox>div.css-1dbjc4n.r-1oszu61.r-1niwhzg.r-18u37iz.r-16y2uox.r-1wtj0ep.r-2llsf.r-13qz1uu>div.css-1dbjc4n.r-yfoy6g.r-18bvks7.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c>div.css-1dbjc4n>section.css-1dbjc4n>div.css-1dbjc4n>div>div>div.css-1dbjc4n.r-1ila09b.r-qklmqi.r-1adg3ll.r-1ny4l3l>div.css-1dbjc4n>div.css-1dbjc4n>article.css-1dbjc4n.r-1loqt21.r-18u37iz.r-1ny4l3l.r-1udh08x.r-1oknz3f.r-7skiz8.r-o7ynqc.r-6416eg>div.css-1dbjc4n.r-eqz5dr.r-16y2uox.r-1wbh5a2>div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1ny4l3l>div.css-1dbjc4n>div.css-1dbjc4n.r-18u37iz>div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-i03k3n>div.css-1dbjc4n>div[id^="id__"].css-1dbjc4n.r-1i71y14.r-l71dzp,
	html>body>div#react-root>div.css-1dbjc4n.r-13awgt0.r-12vffkv>div.css-1dbjc4n.r-13awgt0.r-12vffkv>div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010>main.css-1dbjc4n.r-1habvwh.r-16y2uox.r-1wbh5a2>div.css-1dbjc4n.r-150rngu.r-16y2uox.r-1wbh5a2.r-rthrr5>div.css-1dbjc4n.r-aqfbo4.r-16y2uox>div.css-1dbjc4n.r-1oszu61.r-1niwhzg.r-18u37iz.r-16y2uox.r-1wtj0ep.r-2llsf.r-13qz1uu>div.css-1dbjc4n.r-yfoy6g.r-18bvks7.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c>div.css-1dbjc4n>section.css-1dbjc4n>div.css-1dbjc4n>div>div>div.css-1dbjc4n.r-1adg3ll.r-1ny4l3l>div.css-1dbjc4n>div.css-1dbjc4n>article.css-1dbjc4n.r-1loqt21.r-18u37iz.r-1ut4w64.r-1ny4l3l.r-1udh08x.r-1oknz3f.r-7skiz8.r-o7ynqc.r-6416eg>div.css-1dbjc4n.r-eqz5dr.r-16y2uox.r-1wbh5a2>div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1ny4l3l>div.css-1dbjc4n>div.css-1dbjc4n.r-18u37iz>div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-i03k3n>div.css-1dbjc4n>div[id^="id__"].css-1dbjc4n.r-1i71y14.r-l71dzp,
	html>body>div#react-root>div.css-1dbjc4n.r-13awgt0.r-12vffkv>div.css-1dbjc4n.r-13awgt0.r-12vffkv>div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010>main.css-1dbjc4n.r-1habvwh.r-16y2uox.r-1wbh5a2>div.css-1dbjc4n.r-150rngu.r-16y2uox.r-1wbh5a2.r-rthrr5>div.css-1dbjc4n.r-aqfbo4.r-16y2uox>div.css-1dbjc4n.r-1oszu61.r-1niwhzg.r-18u37iz.r-16y2uox.r-1wtj0ep.r-2llsf.r-13qz1uu>div.css-1dbjc4n.r-yfoy6g.r-18bvks7.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c>div.css-1dbjc4n>div.css-1dbjc4n.r-1jgb5lz.r-1ye8kvj.r-13qz1uu>section.css-1dbjc4n>div.css-1dbjc4n>div>div>div.css-1dbjc4n.r-1ila09b.r-qklmqi.r-1adg3ll.r-1ny4l3l>div.css-1dbjc4n>div.css-1dbjc4n>article.css-1dbjc4n.r-1loqt21.r-18u37iz.r-1ny4l3l.r-1udh08x.r-1oknz3f.r-7skiz8.r-o7ynqc.r-6416eg>div.css-1dbjc4n.r-eqz5dr.r-16y2uox.r-1wbh5a2>div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1ny4l3l>div.css-1dbjc4n>div.css-1dbjc4n.r-18u37iz>div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-i03k3n>div.css-1dbjc4n>div[id^="id__"].css-1dbjc4n.r-1i71y14.r-l71dzp`

	function createMutationObserver(){
		//建立新的觀察物件
		const observerObj = new MutationObserver(
			(mutationObjs)=>{
				for(const eachMutationObj of mutationObjs){
					for(const addNode of eachMutationObj.addedNodes){
						if(addNode.nodeType === 1){
							setTimeout(()=>{
								fetchImgTop(addNode)
							},500)
						}
					}
				}
			}
		).observe(
			document.body,{
				"childList":true,
				"subtree":true,
			}
		)
	}

	function fetchImg(elem){
		const imgElems = elem.querySelectorAll("img")
		for(const imgElem of imgElems){
			const newImgElem = document.createElement("img")
			newImgElem.src = imgElem.src
			elem.parentElement.insertBefore(newImgElem,elem.nextElementSibling)
			// imgElem.style.opacity = "1"
			// imgElem.style.position = "relative"
			// imgElem.src = imgElem.src.replace(/\&name\=\d+x\d+/,"")
			// console.log(imgElem.src)
		}
	}

	function fetchImgTop(topElem){
		if(topElem.matches(filter)){
			fetchImg(topElem)
		}
		else{
			const elems = topElem.querySelectorAll(filter)
			for(const elem of elems){
				fetchImg(elem)
			}
		}
	}

	function init(){
		setTimeout(()=>{
			fetchImgTop(document.body)
		},500)
		createMutationObserver()
	}

})();

