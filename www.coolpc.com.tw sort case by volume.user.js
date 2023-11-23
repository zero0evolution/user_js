// ==UserScript==
// @name         www.coolpc.com.tw sort case by volume
// @namespace    www.coolpc.com.tw sort case by volume
// @version      0.2
// @description  www.coolpc.com.tw sort case by volume
// @author       zero0evolution
// @match      https://www.coolpc.com.tw/eachview.php?IGrp=14
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coolpc.com.tw
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
		

	function init(){
		// record volume to itemElem.dataset.volume
		// record max surface
		// record max Diagonal 對角線

		const itemElems = document.querySelectorAll("span[onclick='Show(this)']")
		const topElem = itemElems[0].parentElement

		const sortItemElems = {"ITX":[],"mATX":[],"other":[]}

		for(const itemElem of itemElems){

			itemElem.dataset.volume = '0'
			itemElem.dataset.maxSurface = '0'
			itemElem.dataset.maxDiagonal = '0'

			const nameElem = itemElem.querySelector("div.t")
			if(nameElem instanceof Element){
				const name = nameElem.textContent
				itemElem.dataset.name = name
				if(name.match(/ITX/i)){
					sortItemElems["ITX"].push(itemElem)
				}
				else if(name.match(/m\-?ATX/i)){
					sortItemElems["mATX"].push(itemElem)
				}
				else{
					sortItemElems["other"].push(itemElem)
				}
			}


			itemElem.dataset.price = "0"
			const priceElem = itemElem.querySelector("div.x")
			if(priceElem instanceof Element){
				const priceMatchObj = priceElem.textContent.match(/NT(\d+)/i)
				if(priceMatchObj){
					itemElem.dataset.price = priceMatchObj[1]
				}
			}

			for (const speciElem of itemElem.querySelectorAll("div")){
				const matchSizeObj = speciElem.textContent.match(/^尺寸：(\d+(?:\.\d+)?)(?:\*|\/|\-)(\d+(?:\.\d+)?)(?:\*|\/|\-)(\d+(?:\.\d+)?)/)
				if(matchSizeObj && matchSizeObj.length === 4){
					
					const size = [
						Number(matchSizeObj[1]),
						Number(matchSizeObj[2]),
						Number(matchSizeObj[3])
					]
					size.sort(function(a,b){return(a-b)})
					// console.log(size)

					itemElem.dataset.size = String(size)

					itemElem.dataset.volume = String(size[0]*size[1]*size[2])

					itemElem.dataset.maxSurface = String(size[1]*size[2])

					itemElem.dataset.maxDiagonal = String(
						Math.pow(
							Math.pow(size[0],2)+
							Math.pow(size[1],2)+
							Math.pow(size[2],2)
							,0.5
						)
					)

					break
				}
			}
		}
		// sort itemElems
		const compareFactor = "volume"
		function sortFunc(e1,e2){

			const n1 = Number(e1.dataset[compareFactor])
			const n2 = Number(e2.dataset[compareFactor])
			if(n1 !== n2){
				return(n1-n2)
			}
			const p1 = Number(e1.dataset.price)
			const p2 = Number(e2.dataset.price)
			if(p1 !== p2){
				return(p1-p2)
			}
			if(e1.dataset.name.match("白")){
				return(-1)
			}
			return(1)
		}
		sortItemElems["ITX"].sort(sortFunc)
		sortItemElems["mATX"].sort(sortFunc)
		sortItemElems["other"].sort(sortFunc)

		function createElemByHtml(html){
			const tempElem = document.createElement("div")
			tempElem.innerHTML = html
			return(tempElem.firstElementChild)
		}

		// ITX
		topElem.appendChild(createElemByHtml(`
			<div style="font-size:36px;">
				---------------------ITX---------------------
			</div>
		`))
		for(const itemElem of sortItemElems["ITX"]){
			topElem.appendChild(itemElem)
			showInfo(itemElem)
		}

		// mATX
		topElem.appendChild(createElemByHtml(`
			<div style="font-size:36px;">
				---------------------mATX---------------------
			</div>
		`))
		for(const itemElem of sortItemElems["mATX"]){
			topElem.appendChild(itemElem)
			showInfo(itemElem)
		}

		// other
		topElem.appendChild(createElemByHtml(`
			<div style="font-size:36px;">
				---------------------other---------------------
			</div>
		`))
		for(const itemElem of sortItemElems["other"]){
			topElem.appendChild(itemElem)
			showInfo(itemElem)
		}

		function showInfo(itemElem){
			const insertBeforeElem = itemElem.querySelector("div:nth-of-type(3)")
			if(insertBeforeElem instanceof Element){
				// if(itemElem.dataset.hasOwnProperty("size")){
				// 	insertBeforeElem.dataset.size
				// }
				if(itemElem.dataset.hasOwnProperty("volume")){
					let volume = Number(itemElem.dataset.volume)/1000
					const addElem = document.createElement("div")
					addElem.textContent = `體積：${volume.toFixed(2)}公升`
					itemElem.insertBefore(addElem,insertBeforeElem)
				}
				if(itemElem.dataset.hasOwnProperty("maxSurface")){
					const maxSurface = Number(itemElem.dataset.maxSurface)
					const addElem = document.createElement("div")
					addElem.textContent = `最大面：${maxSurface.toFixed(2)}平方公分`
					itemElem.insertBefore(addElem,insertBeforeElem)
				}
				if(itemElem.dataset.hasOwnProperty("maxDiagonal")){
					const maxDiagonal = Number(itemElem.dataset.maxDiagonal)
					const addElem = document.createElement("div")
					addElem.textContent = `斜對角線：${maxDiagonal.toFixed(2)}公分`
					itemElem.insertBefore(addElem,insertBeforeElem)
				}
			}
		}
	}

})();