
/**
 * 메뉴 처리 동적 자바스크립트
 * 
 * @history: 2024.03, 최초작성
 */
(function() {
    // 마지막 선택 했던 메뉴에 active class 추가.
    var subMenuClicked = false;
    let activeMenuId = sessionStorage.getItem("activeMenu");
    let selectMenuId = sessionStorage.getItem("selectMenu");
    let activeMenuElement = document.querySelector(".sidebar #" + activeMenuId);
    let selectMenuElement = document.querySelector(".sidebar #" + selectMenuId);
    let activeMenuArrowElement = document.querySelector(".sidebar #" + activeMenuId + " .menu-arrow");

    if (activeMenuElement) activeMenuElement.classList.add("active");
    if (selectMenuElement) selectMenuElement.classList.add("active");
    if (activeMenuArrowElement) activeMenuArrowElement.classList.add("active");

    // lnb노출여부 설정
    let lnbToggle = sessionStorage.getItem("lnbToggle");
    if (lnbToggle === "show") {
        let lnbToggleElement = document.querySelector(".sidebar #" + activeMenuId + " div");
        if (lnbToggleElement) lnbToggleElement.classList.add("show");
    }

    // menu_toggle 클릭 이벤트 설정 - 컴플라이언스와 시스템 메뉴 토글
    let menuToggle = document.getElementById("menu_toggle");
    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            let setVal = "hide";
            let leftCol = document.querySelector(".left_col");

            if (!leftCol.classList.contains('fold')) {
                leftCol.classList.add("fold");
                document.querySelectorAll(".left_col li .collapse").forEach(function (el) {
                    el.classList.remove('show');
                });
            } else {
                leftCol.classList.remove("fold");
                let activeNav = document.querySelector('.left_col nav>ul>li.active');
                if (activeNav) activeNav.querySelector('.collapse').classList.add('show');
                setVal = "show";
            }
        });
    }

    // sidebar ul li 클릭 이벤트 설정
    document.querySelectorAll(".sidebar>ul>li").forEach(function (item) {
        item.addEventListener("click", function () {
			if (!subMenuClicked) {
	            let menuArrow = this.querySelector(".menu-arrow");
	            let depth2 = this.querySelector("#depth2");
	
	            if (menuArrow) menuArrow.classList.toggle("active");
	            if (depth2) depth2.classList.toggle("show");
	
	            this.classList.add("active");
	            this.querySelectorAll(".menu-arrow").forEach(function (el) {
	                if (el !== menuArrow) el.classList.remove("active");
	            });
	
	            this.parentNode.querySelectorAll("li").forEach(function (el) {
	                if (el !== item) {
	                    el.classList.remove("active");
	                    let depth2 = el.querySelector("#depth2");
	                    if (depth2) depth2.classList.remove("show");
	                }
	            });
	
	            (this.querySelector("sub_title") && 
	            	(this.querySelector("sub_title").style.display = "block"));
	            	
			} else {
	            subMenuClicked = false;
			}
        });

        item.addEventListener("mouseenter", function () {
            if (this.closest('.left_col').classList.contains('fold')) {
                let menuArrow = this.querySelector(".menu-arrow");
                let depth2 = this.querySelector("#depth2");

                if (menuArrow) menuArrow.classList.toggle("active");
                if (depth2) depth2.classList.toggle("show");

                this.classList.add("active");

                this.parentNode.querySelectorAll("li").forEach(function (el) {
                    if (el !== item) {
                        el.classList.remove("active");
                        let depth2 = el.querySelector("#depth2");
                        if (depth2) depth2.classList.remove("show");
                    }
                });

				(this.querySelector("sub_title") &&
					(this.querySelector("sub_title").style.display = "block"));
            }
        });

        item.addEventListener("mouseleave", function () {
            if (this.closest('.left_col').classList.contains('fold')) {
                let depth2 = this.querySelector("#depth2");
                if (depth2) depth2.classList.remove("show");
            }
        });
    });

    // sidebar a 클릭 이벤트 설정
    document.querySelectorAll(".sidebar a").forEach(function (item) {
        item.addEventListener("click", async function () {
            const menuUrl = this.getAttribute("link");
            const uniqId = this.getAttribute("uniqId");
            const tabTitle = this.getAttribute("title");
            const tabIcon = this.getAttribute("icon");

            if (menuUrl) {
                // 등록된 주소가 get방식인경우 주소와 파라메터 분리
                if (menuUrl.indexOf("do?") >= 0) {
                    // 전달할 파라메터값
                    let param = menuUrl.split("?")[1];
                    // 주소 재정의
                    menuUrl = menuUrl.split("?")[0];
                    // 파라메터가 복수인경우 분리 처리
                    if (param.indexOf("&") >= 0) {
                        param = param.split("&");
                        // 파라메터의 갯수만큼 input 생성
                        param.forEach(function (p) {
                            let key = p.split("=")[0];
                            let value = p.split("=")[1];
                            let input = document.createElement("input");
                            input.type = "hidden";
                            input.name = key;
                            input.value = value;
                            document.getElementById("menuFrm").appendChild(input);
                        });
                    } else {
                        let input = document.createElement("input");
                        input.type = "hidden";
                        input.name = param.split("=")[0];
                        input.value = param.split("=")[1];
                        document.getElementById("menuFrm").appendChild(input);
                    }
                }

				// global 변수로 2nd 메뉴가 실행 되었는지 파악
                subMenuClicked = true;

				// 선택된 메뉴 페이지가 있는지 확인, 있으면 active
				// 선택된 메뉴 페이지가 active 상태면 아무 작업없이 return
                const newEl = document.querySelector('#'+uniqId);
                if (newEl !== null) {
					const activeEl = document.querySelector('.cont_wrap[active]');
					if (activeEl.getAttribute("id") === uniqId) {
						return;
					}
					window.bellock.chromeTabs.setActiveTabEl(uniqId+'Tab');
					activeEl.removeAttribute('active');
	    			newEl.setAttribute('active', '');
					return;
				}
                
                window.bellock.tabUniqId = uniqId;

                $(".right_col").append("<div class='cont_wrap' id='"+uniqId+"'></div>");
                window.bellock.chromeTabs.addTab({
					title: tabTitle,
					favicon: tabIcon,
					id: uniqId+'Tab'
				});

				// HTMX method를 사용해 엔드포인트로 POST 한 후 원하는 위치에 templates를 impor 시킨다
/*				htmx.ajax('POST', menuUrl, {
					target: '#'+uniqId,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded' // 필요에 따라 Content-Type 설정
					},
					values: {
						// POST 요청에 필요한 데이터가 있다면 여기에 추가
					}
				});*/
            
            	
//            	htmx.ajax('GET', menuUrl, '#'+uniqId);
				htmx.ajax('GET', menuUrl, {
					target: '#'+uniqId,
					handler: onAfterRequest
				});
				
/*
	            fetch(menuUrl)
	            	.then(response => {
						if (!response.ok) {
							throw new Error('Network response was not ok');
						}
						return response.text();
					})
					.then(data => {
						document.getElementById(uniqId).innerHTML = data;
						htmx.loadScripts(document.getElementById(uniqId));
					})
					.catch(error => {
						console.error('Error:', error);
					});
*/					
             }
        });
    });
    
    // 응답을 처리할 콜백 함수를 지정
    function onAfterRequest(elt, responseInfo) {
//	    const newEl = document.querySelector('#'+window.bellock.tabUniqId);
//	    const activeEl = document.querySelector('.cont_wrap[active]');
//	    activeEl.removeAttribute('active');
//	    newEl.setAttribute('active', '');

		htmx.interResponse(elt, responseInfo);
	    
	    // 요청이 완료된 후에 실행할 작업 수행
	    console.log('onAfterRequest, HTMX request completed');
	}
    
    // 메뉴 명령 실행 된 후 호출될 callback 이벤트a
    document.body.addEventListener('htmx:afterRequest', function(event) {
	    // 이벤트가 발생한 요소(element)
	    // 새로운 DIV가 injection 되면 TAB을 생성한 후 이전 TAB의 콘텐츠는 hide 새로운 것은 show한다
	    const newEl = document.querySelector('#'+window.bellock.tabUniqId);
	    const activeEl = document.querySelector('.cont_wrap[active]');
	    activeEl.removeAttribute('active');
	    newEl.setAttribute('active', '');
	    
	    window.bellock.event = event;
	    
	    // 요청이 완료된 후에 실행할 작업 수행
	    console.log('HTMX request completed');
	});
	
	// 
	document.body.addEventListener('htmx:afterSwap', function(event) {
		console.log('HTMX afterSwap completed');
	});

	// 탭 활성화 이벤트 - 해당 페이지 display
	window.bellock.el.addEventListener('activeTabChange', function(event) {
		const tabEl = event.detail.tabEl;
		const pageId = tabEl.getAttribute("id").replace('Tab', '');
		
		const activeEl = document.querySelector('.cont_wrap[active]');
		if (activeEl.getAttribute("id") === pageId) {
			return;
		}
		const targetEl = document.querySelector('#'+pageId);
		activeEl.removeAttribute('active');
		targetEl.setAttribute('active', '');
	});
	
	// 탭 삭제 이벤트 - 해당 페이지 삭제
	window.bellock.el.addEventListener('tabRemove', function(event) {
		const delTabEl = event.detail.tabEl;
		const delPageId = delTabEl.getAttribute("id").replace('Tab', '');
		const delPageEl = document.querySelector('#'+delPageId);
		delPageEl.remove();
	});
	
    // 새로고침 이벤트를 가로채기 위한 함수
    function disableRefresh(e) {
        // 새로고침 기본 동작 막기
        e.preventDefault();
        // 새로고침의 기본 동작은 여기서 차단됩니다.
        return false;
    }

    // 키보드 단축키를 사용한 새로고침 막기
    document.addEventListener('keydown', function(e) {
        // 키보드 단축키: F5(116), Ctrl+R(82), Command+R(82)
        if ((e.which || e.keyCode) === 116 || (e.ctrlKey && (e.which || e.keyCode) === 82) || (e.metaKey && (e.which || e.keyCode) === 82)) {
            // 새로고침 이벤트 막기
            return disableRefresh(e);
        }
    });

    // 마우스 우클릭 메뉴를 사용한 새로고침 막기
//    window.addEventListener('contextmenu', disableRefresh);
//    window.addEventListener('beforeunload', disableRefresh);
		
	
})();



// 왼쪽사이드바가 아닌 다른 링크에서 페이지를 호출하게되는 경우
window.bellock.CreateAddTabPage = function(tabUid, menuUrl, tabTitle, iconPath) {
	// 선택된 메뉴 페이지가 있는지 확인, 있으면 active
	// 선택된 메뉴 페이지가 active 상태면 아무 작업없이 return
    const newEl = document.querySelector('#'+tabUid);
    if (newEl !== null) {
		const activeEl = document.querySelector('.cont_wrap[active]');
		if (activeEl.getAttribute("id") === tabUid) {
			return;
		}
		window.bellock.chromeTabs.setActiveTabEl(tabUid+'Tab');
		activeEl.removeAttribute('active');
		newEl.setAttribute('active', '');
		return;
	}
    
    window.bellock.tabUniqId = tabUid;
    
    $(".right_col").append("<div class='cont_wrap' id='"+tabUid+"'></div>");
    window.bellock.chromeTabs.addTab({
		title: tabTitle,
		favicon: iconPath == null ? '/images/svg_ico/svg-029.svg' : iconPath,
		id: tabUid+'Tab'
	});
    
    // HTMX method를 사용해 엔드포인트로 POST 한 후 원하는 위치에 templates를 import 시킨다
	htmx.ajax('POST', menuUrl, {
		target: '#'+tabUid,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded' // 필요에 따라 Content-Type 설정
		},
		params: {
			// POST 요청에 필요한 데이터가 있다면 여기에 추가
		},
		on: 'htmx:afterRequest', // 요청이 완료된 후 실행할 동작을 설정
		evalScripts: 'once' // 스크립트를 한 번만 실행할지 여부 설정
	});	
}

// 서버에서 template와 조회된 데이터가 함께 내려오는 경우
window.bellock.CreateAddTabPagePlus = async function(tabUid, menuUrl, tabTitle, iconPath, params) {
	// create tab
    window.bellock.tabUniqId = tabUid;
    $(".right_col").append("<div class='cont_wrap' id='"+tabUid+"'></div>");
    window.bellock.chromeTabs.addTab({
		title: tabTitle,
		favicon: iconPath == null ? '/images/svg_ico/svg-029.svg' : iconPath,
		id: tabUid+'Tab'
	});
	
	function onRequest(elt, responseInfo) {
		// manual swap 
		const jsonObject = JSON.parse(responseInfo.xhr.response);
		responseInfo.target.innerHTML = jsonObject.data[0].html;
		window.bellock.data = jsonObject.data[1];
		htmx.loadScripts(responseInfo.target);
	}
	
	htmx.ajax('POST', menuUrl, {
		headers: {
			'Content-Type': 'application/json'
		},
		target: '#'+tabUid,
		handler: onRequest
	});
	
/*	
	const response = await fetch(menuUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(params)
	});

	const result = await response.json();
	if (result.code === 0) {
		
		// 선택된 메뉴 페이지가 있는지 확인, 있으면 active
		// 선택된 메뉴 페이지가 active 상태면 아무 작업없이 return
	    const newEl = document.querySelector('#'+tabUid);
	    if (newEl !== null) {
			const activeEl = document.querySelector('.cont_wrap[active]');
			if (activeEl.getAttribute("id") === tabUid) {
				return;
			}
			window.bellock.chromeTabs.setActiveTabEl(tabUid+'Tab');
			activeEl.removeAttribute('active');
			newEl.setAttribute('active', '');
			return;
		}
	    
	    window.bellock.tabUniqId = tabUid;
	    
	    $(".right_col").append("<div class='cont_wrap' id='"+tabUid+"'></div>");
	    window.bellock.chromeTabs.addTab({
			title: tabTitle,
			favicon: iconPath == null ? '/images/svg_ico/svg-029.svg' : iconPath,
			id: tabUid+'Tab'
		});
		
		// swap target div
		let contentDiv = document.getElementById(tabUid);
		contentDiv.innerHTML = result.data[0].html; // html string
		
		// scrip load
		htmx.loadScripts(contentDiv);
		
//		const scriptElement = document.createElement('script');
//    	scriptElement.src = result.data[0].script;
//		document.body.appendChild(scriptElement);
		
		window.bellock.data = result.data[1];

		console.log('CreateAddTabPagePlus succeed!!!');
	} else {
		console.log('CreateAddTabPagePlus failed!!!');
	}
*/
	
	
}


