// ==UserScript==
// @name         download novel in www.x23qb.com
// @namespace    download novel in www.x23qb.com
// @version      0.1
// @description  download novel in www.x23qb.com
// @author       zero0evolution
// @include        /^https\:\/\/www\.x23qb\.com\/book\/\d+\//

// @require      https://zero0evolution.github.io/commonly_used_codes/s2t.js
// @require      https://zero0evolution.github.io/commonly_used_codes/getHTML.js
// @require      https://zero0evolution.github.io/commonly_used_codes/downloadBlobFunc.js
// @require      https://zero0evolution.github.io/commonly_used_codes/replace_forbid_file_name.js

// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	if(document.readyState === "complete"){
		init()
	}
	else{
		window.addEventListener("load",function(){
			init()
		})
	}

	function init(){

		s2t_all()
		
		const linkElems = document.querySelectorAll("a[href^='/book/'][href$='.html']")
		for(const linkElem of linkElems){
			const fullHref = linkElem.href
			const href = linkElem.getAttribute("href")
			const parentElement = href.parentElement

			if(href.match(/^\/book\/\d+\/\d+\.html$/)){
				const button = document.createElement("button")
				button.textContent = "下載"
				button.dataset.link = fullHref

				parentElement.insertBefore(button,linkElem.nextElementSibling)

				button.addEventListener("click",function(event){
					const button = event.currentTarget
					const link = button.dataset.link

				})
				
			}
		}
	}
})();