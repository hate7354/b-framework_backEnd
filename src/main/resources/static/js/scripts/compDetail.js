/**
 *	@desc: pageWindow constructor
 *	@param: none
 *	@return: pageWindow object
 *	@type: public
 */
function compDetailPage() {
	let self = this;
	this.selfClear = function() {
		for(let c in self) {
			self[c] = null;
		}
		self = null;
		window.compDetail = null;
		window.compDetailPage = null;
	};
	// @desc: beforeunload event
	this.onBeforeUnload = function() {
		if (self.historyWnd) {
			self.historyWnd.close();
		}
		if (self.compareWnd) {
			self.compareWnd.close();
		}
		self.selfClear();
	};
	
	this.historyWnd 		= null;
	this.compareWnd 		= null;
	this.mapCompDetailData 	= new Map();
	this.mapSrchData 		= new Map();
	this.activeCompCode 	= '';
	const nTitleHeight 		= 42;
	this.mapIndex 			= 0;
	this.selectedCompName 	= '';

	// create 아코디언 object
	this.mstAcc = new dhtmlXAccordion({
		parent: "treeArea",
		iconset: "awesome"
	});

	// @desc: 컴플라이언스 트리 목록 정보 조회.
	window.dataProc.ajaxJson("/compTreeList", null, function(result) {
		if (result.code !== 0) return;
		
		var mapFirstCompList = new Map();
		$.each(result.data[0], function(key, val) {
			mapFirstCompList.set(key.toUpperCase(), val);
		});
		// 최상위 Accordion 생성.
		var arrCompType = mapFirstCompList.get("COMPTYPE");
		$.each(arrCompType, function(idx) {
			const accId = arrCompType[idx].codeCd; // get accordion ID
			self.mstAcc.addItem(accId, arrCompType[idx].codeNm, false);
			self.mstAcc.cells(accId).setIcon("fas fa-layer-group");

			// get treeView Obj of accordion
			const treeView = self.mstAcc.cells(accId).attachTreeView();

			// load compliance tree list
			const arrCompItmes = mapFirstCompList.get(accId);
			treeView.loadStruct(arrCompItmes);

			// @desc: 트리View click 이벤트.
			self.evIdClick = treeView.attachEvent("onClick", function(id) {
				var param = {};
				// get compliance code of selected tree-item.
				param.compCode = id.split("_")[0];
				self.mstAcc.setOffset(0);
				self.mstAcc.setSizes();

				// 법령/내규/표준 항목이 클릭된 경우.
				var IsSetTree = self.mapCompDetailData.has(param.compCode);
				if(self.activeCompCode != param.compCode) {
					$("#clause").empty();

					// 저장된 경우와 그렇지 않은 경우
					if(IsSetTree) {
						$("#clause").removeClass('emptyCompDetail');
						self.getCompData(
								treeView, id, self.mapCompDetailData.get(param.compCode));
					} else {
						$("#clause").addClass('emptyCompDetail');

						param.detailData = 'Y';
						window.dataProc.ajaxJson("/compItemDetail", param, function(result) {
							$.each(result.data[0].treeItems, function(idx) {
								self.RecursiveAddItem(treeView, result.data[0].treeItems[idx]);
							});
							self.mapCompDetailData.set(param.compCode, result.data[1]);
							treeView.selectItem(id);
							treeView.openItem(id);
							$("#clause").removeClass('emptyCompDetail');
							self.getCompData(treeView, id, result.data[1]);
						});
					}
					self.DrawTitleArea(treeView, id);
					self.activeCompCode = param.compCode;
				}
				self.setBg(id);

				if($("#" + id).position() && !$("#" + id).isVisible("#dataArea .inner")) {
					const scrollPoistion = $("#dataArea .inner").scrollTop();
					const trgtPosition = $("#" + id).position().top;
					$("#dataArea .inner").stop().animate({
						scrollTop: scrollPoistion + (trgtPosition) - nTitleHeight
					}, 100);
				}

				// 원문 다운로드 이벤트 처리
				$(".fileDown").click(function() {
					$.fileDownLoad($(this).attr("atchfileid"), $(this).attr("filesn"), "COMP");
				});

				// 본문검색 이벤트 처리
				self.onSearchEvent();
			});
		});

		$("#treeArea div").not(".dhx_cell_hdr_arrow").css({"width": "100%"});
	});	

	// @desc: 검색 이벤트 처리.
	this.onSearchEvent = function() {
		// 검색버튼 이벤트
		$("#srchKeywordBtn").off("click").on("click", function() {
			self.mapSrchData.clear();
			self.mapIndex = 0;
			$('#clause').removeHighlight();
			$('#clause').highlight($('#srchKeyword').val(), self.mapSrchData);

			if(self.mapSrchData.size > 0) {
				$('#srchLeftBtn').show();
				$('#srchRightBtn').show();
				$('#resetBtn').show();
				$('#srchLeftBtn').attr("disabled", true);
				if(self.mapSrchData.size == 1) {
					$('#srchRightBtn').attr("disabled", true);
				} else {
					$('#srchRightBtn').attr("disabled", false);
				}
				self.mapIndex = 0;

				if ($("#" + self.mapIndex + ".highlight").position() &&
						!$("#" + self.mapIndex + ".highlight").isVisible("#dataArea .inner")) {

					const scrollPoistion = $("#dataArea .inner").scrollTop();
					const trgtPosition = $("#" + self.mapIndex + ".highlight").position().top;
					$("#dataArea .inner").stop().animate({
						scrollTop: scrollPoistion + (trgtPosition) - nTitleHeight
					}, 100);
				}
				$('span#0.highlight').addClass('highlight_bk');
			} else {
				$('#srchLeftBtn').hide();
				$('#srchRightBtn').hide();
				$('#resetBtn').hide();
			}
		});

		// @desc: 키워드 입력 이벤트 처리.
		$("#srchKeyword").keydown(function(event) {
			event.stopImmediatePropagation();
			const keyCode = (event.keyCode ? event.keyCode : event.which);
			if(keyCode == 13) {
				$("#srchKeywordBtn").trigger('click');
				return false;
			}

			if(self.mapSrchData.size > 0) {
				if(keyCode == 38 && self.mapIndex > 0) {
					$("#srchLeftBtn").trigger('click');
					return false;
				} else if(keyCode == 40 && self.mapSrchData.size > self.mapIndex + 1) {
					$("#srchRightBtn").trigger('click');
					return false;
				}
			}
		});

		// @desc: 검색 리셋 이벤트 처리.
		$('#resetBtn').off("click").on("click", function() {
			$('#srchKeyword').val('');
			self.mapSrchData.clear();
			self.mapIndex = 0;
			$('#clause').removeHighlight();
			window.setTimeout(function() {
				$('#srchLeftBtn').hide();
				$('#srchRightBtn').hide();
				$('#resetBtn').hide();
			}, 500);
		});

		// @desc: 검색 키워드 이동 (상단) 처리.
		$("#srchLeftBtn").off("click").on("click", function() {
			self.mapIndex -= 1;
			if(self.mapIndex <= 0) {
				$('#srchLeftBtn').attr("disabled", true);
			}
			$('#srchRightBtn').attr("disabled", false);

			if ($("#" + self.mapIndex + ".highlight").position() &&
					!$("#" + self.mapIndex + ".highlight").isVisible("#dataArea .inner")) {
				const scrollPoistion = $("#dataArea .inner").scrollTop();
				const trgtPosition = $('span#' + self.mapIndex + ".highlight").position().top;
				$("#dataArea .inner").stop().animate({
					scrollTop: scrollPoistion + (trgtPosition) - nTitleHeight
				}, 100);
			}
			$('span#' + self.mapIndex + ".highlight").addClass('highlight_bk');

			if(self.mapIndex + 1 < self.mapSrchData.size) {
				$('span#' + (self.mapIndex + 1) + ".highlight").removeClass('highlight_bk');
			}
		});

		// @desc: 검색 키워드 이동 (하단) 처리.
		$("#srchRightBtn").off("click").on("click", function() {
			self.mapIndex += 1;
			if(self.mapIndex + 1 >= self.mapSrchData.size) {
				$('#srchRightBtn').attr("disabled", true);
			}

			$('#srchLeftBtn').attr("disabled", false);
			if ($("#" + self.mapIndex + ".highlight").position() &&
					!$("#" + self.mapIndex + ".highlight").isVisible("#dataArea .inner")) {
				const scrollPoistion = $("#dataArea .inner").scrollTop();
				const trgtPosition = $('span#' + self.mapIndex + ".highlight").position().top;
				$("#dataArea .inner").stop().animate({
					scrollTop: scrollPoistion + (trgtPosition) - nTitleHeight
				}, 100);
			}

			$('span#' + self.mapIndex + ".highlight").addClass('highlight_bk');
			if(self.mapIndex - 1 >= 0) {
				$('span#' + (self.mapIndex - 1) + ".highlight").removeClass('highlight_bk');
			}
		});

		// list show/hide event
		$('#listBtn').off("click").on("click", function() {
			if($('.com_container .col#treeArea').css('display') == 'none') {
				$('.com_container .col#treeArea').show();
				$('.com_container .col#dataArea').css('flex-basis', '75%');
				$('.com_container .col#dataArea').css('max-width', '75%');
				self.onResizeContents();
			} else {
				$('.com_container .col#treeArea').hide();
				$('.com_container .col#dataArea').css('flex-basis', '100%');
				$('.com_container .col#dataArea').css('max-width', '100%');
				self.onResizeContents();
			}
		});

		if(self.historyWnd) {
			self.historyWnd.close();
			self.historyWnd = null;
		}

		// list show/hide event
		$('#histBtn').off("click").on("click", function() {
			/*
			if(self.historyWnd == null) {
				self.historyWnd =
					openPopupWindow("/popup/historyCompView.do?compCode=" + $(this).attr('compCode'));
				setInterval = function() {
					window.setTimeout(function() {
						if(self.historyWnd.pageObj) {
							self.historyWnd.pageObj.setParent(pageWndObj);
						} else {
							setInterval();
						}
					}, 100);
				}
				setInterval();
			} else {
				self.historyWnd.focus();
			}
			*/
		});
		if(self.compareWnd) {
			self.compareWnd.close();
			self.compareWnd = null;
		}

		// compare button click event
		$('#compBtn').off("click").on("click", function() {
			/*
			if(self.compareWnd != null) {
				self.compareWnd.focus();
				return;
			}
			var compCode = $(this).attr('compCode');

			const param = {
				compCode: compCode,
				onlyRecentVer: 'Y',
				excludeCurr: 'Y'
			};
			window.dataProc.ajaxJson("/popup/selectCompHistoryList.do", param, function(query) {
				if(query.result == '0') {
					if(query.data.length != 0) {
						self.compareWnd =
							openPopupWindow("/popup/compareCompView.do?compCode=" + compCode);
						setInterval = function() {
							window.setTimeout(function() {
								if(self.compareWnd.pageObj) {
									self.compareWnd.pageObj.setParent(pageWndObj);
								} else {
									setInterval();
								}
							}, 100);
						}
						setInterval();
					} else {
						window.msg.alert("비교할 이전 개정버전이 없습니다.", "확인");
					}
				}
			});
			*/
		});

		// 서식관리 button click event
		$('#formBtn').off("click").on("click", function() {
			/*
			const wndId = "compFormMngProc";
			const popupUrl = "/comp/popup/compFormMngProc.do";
			const param = [{
				id: wndId,
				width: 1000,
				height: 600,
				text: self.selectedCompName + " 서식 관리"
			}];
			window.dhtmlxWnd = new DHTMLX.Window("s_main", param);
			window.dhtmlxWnd.loadUrl(wndId, popupUrl, true, {
				compCode: $(this).attr('compCode')
			});
			window.dhtmlxWnd.setModal(wndId);
			*/
		});
	};

	// @desc: 컴플라이언스 트리구조 로드.
	this.RecursiveAddItem = function(treeView, treeItem) {
		const id = treeItem.id;
		if(treeItem.userdata.treeYn == 'Y') {
			treeView.addItem(id, treeItem.text, treeItem.userdata.parentId);
		}
		$.each(treeItem.userdata, function(key, value) {
			treeView.setUserData(id, key, value);
		});
		$.each(treeItem.items, function(idx) {
			self.RecursiveAddItem(treeView, treeItem.items[idx]);
		});
	};

	// @desc: 컴플라이언스 상세영역 타이틀 설정.
	this.DrawTitleArea = function(treeView, id) {
		const enforceDt = treeView.getUserData(id.split("_")[0] + "_0", "enforceDt");
		const codeNm = treeView.getUserData(id.split("_")[0] + "_0", "codeNm");
		const compCode = id.split("_")[0];
		self.selectedCompName = treeView.getItemText(id.substring(0, id.lastIndexOf("_") + 1) + "0");
		// 선택된 컴플라이언스 타이틀 세팅
		var downBtn = "";
		if(treeView.getUserData(id.split("_")[0] + "_0", "atchFileId")) {
			downBtn =
				"<button type=\"button\" atchfileid=\"" +
				treeView.getUserData(id.split("_")[0] + "_0", "atchFileId") +
				"\" filesn=\"1\" class=\"btn btn_comp_color btn-primary " +
				"fileDown\"><i class=\"fas fa-file-download\"></i></button>";
		}
		const listBtn =
			"<button type='button' class='leftBtn' name='listBtn' " +
			"id='listBtn'><i class='fas fa-bars'></i></button>";
		const histBtn =
			"<button type='button' class='normalBtn' name='histBtn' " +
			"compCode='" + compCode + "' title='연혁조회' id='histBtn'>연혁</button>";
		const compBtn =
			"<button type='button' class='normalBtn' name='compBtn' " +
			"compCode='" + compCode + "' title='비교' id='compBtn'>비교</button>";
		const formBtn =
			"<button type='button' class='normalBtn' name='formBtn' compCode='" +
			compCode + "' title='서식' id='formBtn'>서식</button>";
		const leftBtn =
			"<button type='button' class='btn btn-primary' name='srchLeftBtn' " +
			"title='이전' id='srchLeftBtn'><i class='fas fa-chevron-circle-left'></i></button>";
		const rightBtn =
			"<button type='button' class='btn btn-primary' name='srchRightBtn' " +
			"title='다음' id='srchRightBtn'><i class='fas fa-chevron-circle-right'></i></button>";
		const resetBtn =
			"<button type='button' class='btn btn-primary' name='resetBtn' " +
			"title='초기화' id='resetBtn'><i class='fas fa-undo-alt'></i></button>";
		const srchBtn =
			"<button type='button' class='btn btn-primary' name='srchKeywordBtn' " +
			"title='검색' id='srchKeywordBtn'><i class='fas fa-search'></i></button>";
		const comTitle =
			"<input type='com_title' style='padding-left:10px;' value='" +
			self.selectedCompName + " (시행 " + enforceDt + ", " + codeNm + ")' readonly>";
		const srchKeyword =
			"<input type='com_search' name='srchKeyword' id='srchKeyword' " +
			"value='' class='srh_input' placeholder='검색할 키워드를 입력하세요.'>";

		$("#dataArea div#title").html(
				listBtn + histBtn + compBtn + formBtn + downBtn +
				rightBtn + leftBtn + resetBtn + srchBtn + comTitle + srchKeyword);
		$('#srchLeftBtn').hide();
		$('#srchRightBtn').hide();
		$('#resetBtn').hide();
		self.mapSrchData.clear();
		self.mapIndex = 0;
	};

	// @desc: 상세영역 클릭시 관련 tree 항목 선택 처리.
	this.selectTreeItem = function(treeView, itemId) {
		while($('#' + itemId).children().attr("treeYn") == "N") {
			const pre = itemId.split('_')[0];
			const tail = itemId.split('_')[1] - 1;
			if(tail < 0) {
				return;
			}
			itemId = pre + '_' + tail;
		}

		var parentId = treeView.getParentId(itemId);
		var parentList = parentId;
		while(parentId) {
			parentId = treeView.getParentId(parentId);
			if(parentId) {
				parentList = parentId + "," + parentList;
			}
		}
		$.each(parentList.split(','), function(key, value) {
			treeView.openItem(value);
		});
		window.setTimeout(function() {
			treeView.selectItem(itemId);
			treeView.showItem(itemId);
		}, 400);
	};

	// @desc: 상세영역 D/P.
	this.getCompData = function(treeView, treeId, compData) {
		$("#clause").empty();

		var cdf = document.createDocumentFragment();
		$.each(compData, function(idx) {
			var tmpChild = document.createElement("dl");

			tmpChild.id = compData[idx].id;
			tmpChild.setAttribute("class", "p_" + tmpChild.id);
			cdf.appendChild(tmpChild);

			var tmpTrg = cdf.querySelector("dl.p_" + tmpChild.id);

			if(compData[idx].treeYn == "Y") {
				tmpChild = document.createElement("dt");
				tmpChild.innerHTML = compData[idx].text.replace(/(\n|\r\n)/g, '<br>');
			} else {
				tmpChild = document.createElement("dd");
				if(compData[idx].imgApplyYn == "Y") {
					tmpChild.innerHTML =
						"<img src=\"" + compData[idx].imgPath + "\"" +
						"style=\"max-width:100%;height:auto;\"></dd>";
				} else {
					tmpChild.innerHTML = compData[idx].text.replace(/(\n|\r\n)/g, '<br>');
				}
			}

			tmpChild.classList.add('com_data');
			tmpChild.id = "cla_" + compData[idx].claCode;
			tmpChild.setAttribute("quote", compData[idx].quote);
			tmpChild.setAttribute("treeYn", compData[idx].treeYn);
			tmpChild.setAttribute("baseBg", compData[idx].bgColor);
			tmpChild.setAttribute("mapYn", compData[idx].mapYn);
			tmpChild.setAttribute("maVer", compData[idx].maVer);
			tmpChild.setAttribute("miVer", compData[idx].miVer);
			tmpChild.style.paddingLeft = (compData[idx].indent * 20 + 20) + "px";
			tmpChild.style.paddingRight = "10px";
			tmpChild.style.backgroundColor = compData[idx].bgColor;
			tmpChild.style.color = compData[idx].fontColor;
			tmpChild.style.fontWeight = compData[idx].fontBold == "Y" ? "bold" : "normal";

			if(compData[idx].claDesc) {
				/* modified 2021/03/04 */
				tmpChild.innerHTML +=
					"<br><span class=\"com_data\" style=\"font-weight:normal;\">" +
					compData[idx].claDesc.replace(/(\n|\r\n)/g, '<br>') + "</span>";
			}

			// 텍스트 색상과 배경 색상이 같으면 display:none으로 처리.
			const clrText = $.convert6HexClr(compData[idx].fontColor.toLowerCase());
			const clrBack = $.convert6HexClr(compData[idx].bgColor.toLowerCase());
			if(clrText == clrBack) {
				tmpChild.style.display = "none";
			}
			tmpTrg.appendChild(tmpChild);
		});
		$("#clause").append(cdf);

		// @desc: 상세 조회 화면에서 항목을 선택.
		$("#clause dt, #clause dd").off("click").on("click", function() {
			const itemId = $(this).parent().attr("id");
			self.selectTreeItem(treeView, itemId);
			self.setBg(itemId);
		});

		// @desc: 상세영역 double click
		$("#clause dt, #clause dd").off("dblclick").on("dblclick", function() {
			window.getSelection().removeAllRanges();
			const itemId = $(this).parent().attr("id");
			self.selectTreeItem(treeView, itemId);
			self.setBg(itemId);
			self.mstAcc.setOffset(0); // dhtmlx bug
			self.mstAcc.setSizes();
		});
	};

	// @desc: 배경 색상.
	this.setBg = function(id) {
		if(document.getElementById(id)) {
			$("#clause dl.on").children()
							  .css("background-color", $("dl.on").children().attr("baseBg"));
			$("#clause dl.on").next()
							  .children()
							  .css("background-color", $("#clause dl.on").next().children().attr("baseBg"));
			$("#clause dl").removeClass("on");

			if($("#clause #" + id).children().attr("treeyn") == "Y" ||
					$("#clause #" + id).children().attr("mapYn") == "Y") {
				$("#clause #" + id).addClass("on");
			}
		}
	};

	// @desc: 확장모드시 Callback.
	this.onExpandEvt = function(bIsExpandMode) {
		if(bIsExpandMode) {
			$('#treeArea').height(window.innerHeight - 89);
			$('#clause').height(window.innerHeight - 131);
		} else {
			$('#treeArea').height(window.innerHeight - 199);
			$('#clause').height(window.innerHeight - 241);
		}
		self.onResizeContents();
	}; //window.XGFunc.onExpandEvent = this.onExpandEvt;

	// @desc: menu toggle Callback.
	this.onMenuSpanEvt = function(bIsShow) {
		self.onResizeContents();
	}; //window.XGFunc.onMenuSpanEvent = this.onMenuSpanEvt;

	// @desc: 윈도우 사이즈 변경시 Callback.
	this.onResizeContents = function() {
		self.mstAcc.setOffset(0); // dhtmlx bug
		self.mstAcc.setSizes();
	}; //window.XGFunc.onResizeContents = this.onResizeContents;

	// full screen mode
	if ($('.box').hasClass('fullscreen')) {
		self.onExpandEvt(true);
	}
	
	$(window).resize(this.onResizeContents);	

};	


/**
 *	@desc: pageWindow prototype
 *	@type: public
 */
compDetailPage.prototype = {
	onInitWindow: function() {
	},
	// close child popup window event
	onCloseChildPopup: function(inst) {
		if (inst == compDetail.historyWnd) {
			compDetail.historyWnd = null;
		}
		if (inst == compDetail.compareWnd) {
			compDetail.compareWnd = null;
		}
	},
};


/**
 * 보안업무 동적 처리 자바스크립트
 * 
 * @history: 2024.03, 최초작성
 */
(function() {
	window.compDetail = new compDetailPage();
	window.setTimeout(function() {
		window.compDetail.onInitWindow();
	});
})();
