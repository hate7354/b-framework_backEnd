/**
 * 그리드 공통모듈
 * modified by inseok.ra: 메모리회수 불능 및 다발성 오류로 전체적으로 수정.
 * 				기존 및 신규 javascript code들이 문제 없이 참조될 수 있도록 수정.
 * 				초기 모듈이 너무 문제가 많지만 다른 곳에 영향도가 많아 완전 수정 불능.
 * 				향후 재설계 후 전면 수정이 필요함.
 */
'use strict';
(function($) {
	$.extend(true, window, {
		DHTMLX : {
			Grid : dhtmlx
		}
	});

	/**
	 * @param container grid container
	 * @param menuId page의 메뉴아이디
	 * @param gridId grid를 출력할 div id
	 * @param fixSize grid사이즈 고정여부
	 * @param multiLine 셀 맞춤
	 * @param autoHeight 그리드 높이 가변 허용 여부 - 기분값은 허용.
	 */
	function dhtmlx(container, menuId, gridId, fixSize, multiLine, autoHeight, headerData, columnData) {
		multiLine = multiLine ? multiLine : false;
		autoHeight = autoHeight == null ? true : autoHeight;

		var self=this;
		this.selfCrear=function() {
			for (var c in self) {
				self[c] = null;
			} self = null;
		};

		this._DATA_COLUMNS;
		this._grid = null;
		this._colorFildTxt;
		this.evIdMouseOver=null;
		this.evIdRowSelect=null;
		this.evIdAfterSorting=null;
		this.evIdEditCell=null;
		this.evIdPageChanged=null;
		this.fnLinkCallback=null;
		this.fnEndOfLoadData=null;
		this.rowsNum=0;
		this.containerId=container;

		this._grid = new dhtmlXGridObject(container);
		this.inst=this._grid;

		// 그리드 생성
		this.setGrid=function() {
			if (menuId == "") { return; }

			var dataColumnsGrpInfo = null;		// 그리드의 헤더그룹 정보
			var dataColumnsInfo = null;			// 그리드의 컬럼 정보

			if (!gridId) {
				gridId = container;
			}

			// 그리드 정보를 조회하기 위한 파라메터
			var param = { menuId : menuId, gridId : gridId, trnfType : "1" };

			if (columnData) {
				for (var i in columnData) {
					if (columnData[i].clmOrder == null) {
						columnData[i].clmOrder = 'N';
						columnData[i].sortSeq = 0;
					}
					if (columnData[i].clmVisibl == null) {
						columnData[i].clmVisibl = 'Y';
					}
					if (columnData[i].clmEdit == null) {
						columnData[i].clmEdit = 'N';
					}
					if (columnData[i].trnfType == null) {
						columnData[i].trnfType = 1;
					}
					if (columnData[i].useYn == null) {
						columnData[i].useYn = 'Y';
					}
				}
			}

			// 그리드의 헤더그룹 및 컬럼 정보 조회
			if (headerData && columnData) {
				dataColumnsGrpInfo = headerData;
				dataColumnsInfo = columnData;
			} else {
				window.dataProc.ajaxJsonSync( "/cmm/gridHeaderInfo.do", param, function(result) {
					dataColumnsGrpInfo = result.data.gridGroupInfo;
					dataColumnsInfo = result.data.gridInfo;
				});
			}

			// Grid 헤더 그룹 정보 초기화
			var hedrGrpCnt = dataColumnsGrpInfo.length;
			var aHedrGrpInfo = new Array(hedrGrpCnt);

			// Grid 헤더 정보 초기화
			var hedrCnt = dataColumnsInfo.length / hedrGrpCnt;
			var aHedrInfo = null

			// Grid 헤더 row 별 분류 작업
			for (var grpInx=0; grpInx<dataColumnsGrpInfo.length; grpInx++) {
				// array 초기화
				aHedrInfo = new Array(hedrCnt);
				var hedrInx = 0;

				// ROW별 정보를 나눠서 Array에 담는다.
				for (var itemInx=0; itemInx<dataColumnsInfo.length; itemInx++) {
					if (dataColumnsGrpInfo[grpInx].trnfType == dataColumnsInfo[itemInx].trnfType) {
						aHedrInfo[hedrInx++] = dataColumnsInfo[itemInx];
					}
				}
				aHedrGrpInfo[grpInx] = aHedrInfo;
			}

			// Grid 그룹 헤더 정보 Set
			var aHedrGrpString = new Array(hedrGrpCnt - 1);
			var headerGrpString = "";

			if (hedrGrpCnt > 1) {
				for (var grpInx = 0; grpInx < (hedrGrpCnt-1); grpInx++) {
					aHedrInfo = aHedrGrpInfo[grpInx];
					headerGrpString = "";
					for (var itemInx=0; itemInx<aHedrInfo.length; itemInx++) {
						headerGrpString = common.addCommaString(
								headerGrpString, aHedrInfo[itemInx].clmNm);
					}
					aHedrGrpString[grpInx] = headerGrpString;
				}
			}

			self._DATA_COLUMNS = aHedrGrpInfo[aHedrGrpInfo.length - 1];
			//data처리를 위한 컬럼을 추가한다.
			var tmp = {
					clmAlgn: "CENTER",
					clmClick: "",
					clmColor: "",
					clmDesc: "",
					clmEdit: "N",
					clmFmt: "",
					clmId: "dataFlag",
					clmNm: "DATAFLAG",
					clmType: "TEXT",
					clmVisibl: "N",
					clmWidth: "50",
					gridId: gridId,
					menuId: menuId,
					rowId: "0",
					sortSeq: self._DATA_COLUMNS.length,
					trnfType: 1,
					useYn: "Y"
				};
			self._DATA_COLUMNS.push(tmp);

			var headerString = "";
			var headerAlign = new Array(self._DATA_COLUMNS.length);
			var columnIDs = "";
			var columnWidth = "";
			var columnAlign = "";
			var columnType = "";
			var columnSort = "";
			var columnVisible = "";
			var columnColor = "";
			var columnFormat = "";
			var columnOrder = "";
			var columnTooltip = "";

			for (var idx=0; idx<self._DATA_COLUMNS.length; idx++) {
				columnIDs = common.addCommaString(columnIDs, self._DATA_COLUMNS[idx].clmId);
				headerString = common.addCommaString(headerString, self._DATA_COLUMNS[idx].clmNm);
				columnAlign = common.addCommaString(columnAlign, self._DATA_COLUMNS[idx].clmAlgn ? self._DATA_COLUMNS[idx].clmAlgn : "left");
				columnVisible = common.addCommaString(columnVisible, self._DATA_COLUMNS[idx].clmVisibl == "N" ? "true" : "false");
				columnColor += (idx == 0 ? "" : ",")
						    + (common.isEmpty(self._DATA_COLUMNS[idx].clmColor) ? "" : self._DATA_COLUMNS[idx].clmColor);

				headerAlign[idx] = "text-align:center; vertical-align: middle;" + (self._DATA_COLUMNS[idx].clmVsbl == "N" ? " display: none;" : "");

				columnWidth = common.addCommaString(
						columnWidth,
						!self._DATA_COLUMNS[idx].clmWidth || self._DATA_COLUMNS[idx].clmWidth == "0" ?
								100 : self._DATA_COLUMNS[idx].clmWidth);

				if (self._DATA_COLUMNS[idx].clmOrder == "Y" &&
						self._DATA_COLUMNS[idx].clmType != "BUTTON" &&
						self._DATA_COLUMNS[idx].clmType != "CHECKBOX"&&
						self._DATA_COLUMNS[idx].clmType != "RADIO") {

					if (self._DATA_COLUMNS[idx].clmType == "NUMBER") {
						columnSort = common.addCommaString(columnSort, "int");
					} else {
						columnSort = common.addCommaString(columnSort, "str");
					}
				} else{
					columnSort = common.addCommaString(columnSort, "na");
				}

				var cellType = "";

				// set tooltip option string
				if (columnTooltip.length > 0) {
					columnTooltip += ',';
				}

				if (self._DATA_COLUMNS[idx].clmTooltip == null) {
					columnTooltip += 'false';
				} else if (self._DATA_COLUMNS[idx].clmTooltip == 'Y') {
					columnTooltip += 'true';
				}

				if (self._DATA_COLUMNS[idx].clmType == "NUMBER") {
					if (self._DATA_COLUMNS[idx].clmEdit == "Y") {
						cellType = "edn";
					} else {
						cellType = "ron";
					}
				} else if (self._DATA_COLUMNS[idx].clmType == "TEXT") {
					if (self._DATA_COLUMNS[idx].clmEdit == "Y") {
						cellType = "ed";
					}else if (self._DATA_COLUMNS[idx].clmClick == "Y") {
						cellType = "click";
					} else {
						cellType = "rotxt";
					}
				} else if (self._DATA_COLUMNS[idx].clmType == "TEXTAREA") {
					if (self._DATA_COLUMNS[idx].clmEdit == "Y") {
						cellType = "txttxt";				// modified by inseok.ra 2019.08.16
					}else if (self._DATA_COLUMNS[idx].clmClick == "Y") {
						cellType = "click";
					} else {
						cellType = "rotxt";
					}
				} else if (self._DATA_COLUMNS[idx].clmType == "STATEIMG") {
					cellType = "stateImg";
				} else if (self._DATA_COLUMNS[idx].clmType == "BUTTON") {
					cellType = "button";
				} else if (self._DATA_COLUMNS[idx].clmType == "STATEIMG") {
					cellType = "stateImg";
				} else if (self._DATA_COLUMNS[idx].clmType == "COMBO") {
					cellType = "coro";
				} else if (self._DATA_COLUMNS[idx].clmType == "CHECKBOX") {
					cellType = "ch";
				} else if (self._DATA_COLUMNS[idx].clmType == "LINK") {
					cellType = "link";
				} else if (self._DATA_COLUMNS[idx].clmType == "IMAGE" || self._DATA_COLUMNS[idx].clmType == "VIEW" || self._DATA_COLUMNS[idx].clmType == "SEARCH") {
					cellType = "img";
				} else if (self._DATA_COLUMNS[idx].clmType == "RADIO") {
					cellType = "ra";
				} else if (self._DATA_COLUMNS[idx].clmType == "CALENDAR") {
					cellType = "dhxCalendarA";
				} else if (self._DATA_COLUMNS[idx].clmType == "COLOR") {
//					cellType = "cp";
					cellType = "ed";
				} else {
					cellType = "rotxt";
				}

				columnType = common.addCommaString(columnType, cellType);
			}

			self._grid.setImagePath("/js/dhtmlxSuite/codebase/imgs/");
			self._grid.setColumnIds(columnIDs);

			if (aHedrGrpInfo.length > 1) {
				for (var inx=0; inx < aHedrGrpString.length; inx++) {
					if (inx == 0) {
						self._grid.setHeader(aHedrGrpString[inx], null, headerAlign);
					} else {
						self._grid.attachHeader(aHedrGrpString[inx], headerAlign);
					}
				}
			}

			if (aHedrGrpInfo.length <= 1) {
				self._grid.setHeader(headerString.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">"), null, headerAlign);
			} else {
				self._grid.attachHeader(headerString.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">"), headerAlign);
			}

			self._grid.setInitWidths(columnWidth);
			self._grid.setColAlign(columnAlign);
			self._grid.setColTypes(columnType);
			self._grid.setColSorting(columnSort);
			self._grid.setColumnColor(columnColor);
			self._grid.setColumnColor(columnColor);
			self._grid.setColumnsVisibility(columnVisible);
			self._grid.enableBlockSelection(false);
			self._grid.setDateFormat("%Y/%m/%d");
			self._grid.enableEditEvents(false,true,true);
			self._grid.enableEditTabOnly(true);
			self._grid.enableAutoWidth(true);
			self._grid.enableAutoHeigth(autoHeight);
			self._grid.enableMultiline(multiLine);
			self._grid.enableRowsHover(true, "grid_hover");
			self._grid.enableTooltips(columnTooltip);

			for (var idx=0; idx<self._DATA_COLUMNS.length; idx++) {
				if (self._DATA_COLUMNS[idx].COMBO_DATA) {
					var combo = self._grid.getCombo(idx);// takes the column

					var comboData = JSON.parse(self._DATA_COLUMNS[idx].COMBO_DATA);
					for (var index=0; index<comboData.length; index++) {
						combo.put(comboData[index].CODE, comboData[index].CODE_DESC);
					}
				} else if (self._DATA_COLUMNS[idx].clmType == "NUMBER") {
					// 숫자 형식일때 포맷 추가
					columnFormat = self._DATA_COLUMNS[idx].clmFmt;
					if (columnFormat && columnFormat != "") {
						self._grid.setNumberFormat(columnFormat, idx, ".", ",");
					}
				}
			}

			try {
				self._grid.init();
				//self._grid.enableAccessKeyMap();

				if(!fixSize && container !== null){
					$('#' + container).css({'width': '100%', 'overflow' : 'hidden' });
					self._grid.setSizes();
				}

			} catch (e) {
				alert("그리드 생성 오류 : " + e);
			} finally {
				dataColumnsGrpInfo=null, dataColumnsInfo=null, param=null,
				hedrGrpCnt=null, aHedrGrpInfo=null, tmp=null,
				headerString=null, headerAlign=null, columnIDs=null, columnWidth=null,
				columnAlign=null, columnType=null, columnSort=null, columnVisible=null,
				columnColor=null, columnFormat=null, columnOrder=null;
			}

			// fires when the mouse pointer is moved over a cell
			self.evIdMouseOver = self._grid.attachEvent("onMouseOver", function(id, ind) {
				self && self._grid.setSizes(); // 엣지 라인 오류(???)
				return true;
			});

			// @desc: row 클릭시 check박스가 0열에 있을 경우 check되도록 처리.
			self.evIdRowSelect = self._grid.attachEvent("onRowSelect", function(id, ind) {
				var type = self._grid.getCellExcellType(id, 0);
				if (type == 'ch' || type == 'ra') {
					var disabled = self._grid.cells(id, 0).isDisabled();
					if (type == 'ch' && (typeof(disabled) == "undefined" || disabled == false)) {
						var check = self._grid.cells(id, 0).isChecked();
						self._grid.cells(id, 0).setValue((check == false) ? true : false);
						self._grid.callEvent("onCheckbox", [id, ind, !check]);
					}
					else if (type == 'ra' && (typeof(disabled) == "undefined" || disabled == false)) {
						self._grid.cells(id, 0).setValue(true);
						self._grid.callEvent("onCheck", [id, ind, !check]);
					}
				}
			});

			// onMouseOver 이벤트발생시 그리드 size 잡히는 현상 보정
			window.setTimeout(function() { self._grid.setSizes(); }, 10);
			window.setTimeout(function() {
				if (self._DATA_COLUMNS[0].clmType == 'CHECKBOX') {
					$('.xhdr').find('td')[0].style.borderLeft = 'none';
					$('.xhdr').find('td')[0].style.borderRight = 'none';
					$('.xhdr').find('td')[1].style.borderLeft = 'none';
				}
			});
		};

		// @desc: set link callback function
		this.setLinkCallback=function(fnCallback) {
			self.fnLinkCallback=fnCallback;
		};

		// @desc: set end of load data function
		this.setEndOfLoadData=function(fnEndOfLoadData) {
			self.fnEndOfLoadData=fnEndOfLoadData;
		};

		// 업무지연의 색상 변경
		this.setFildTxtColor = function(colorFildTxt) {
			self._colorFildTxt = colorFildTxt;
		};

		// @desc: toggle menu click event
		this.onMenuToggle=function() {
			self && self._grid.setSizes();
		}; document.getElementById('menu_toggle').addEventListener("click", this.onMenuToggle, false);

		// @desc: resize callback
		$(".right_col .box").on("resize", function() {
			self && self._grid.setSizes();
		});

		// @desc: window resize
		this.onResizeWindow=function() {
			self && self._grid.setSizes();
		}; $(window).resize(this.onResizeWindow);

		/**
		 * 그리드 데이터 세팅
		 * @param resultData 그리드 출력 데이터 셋
		 * @param btnParam 버튼 구성 데이터
		 * @param chkBoxDisParam 체크박스 비활성 조건
		 * @param rSpanColId 행병합 아이디
		 * @param newLine 개행처리여부
		 * @param disLinkParam 컬럼링크
		 * @param chkBoxParam checkBox param
		 * @param reverseNum 번호표시를 1부터 할 경우 true
		 * @param radioDisParam radio button param
		 * @param backgroundColor background color
		 * @param extraStyle 추가적인 style
		 */
		this.loadData = function(resultData, btnParam, chkBoxDisParam, rSpanColId, newLine,
				disLinkParam, chkBoxParam, reverseNum, radioDisParam, backgroundColor, extraStyle) {
			$.progressShow();

			// 그리드의 이전 데이터를 클리어한다.
			self._grid.clearAll();
			//$(".num em").text(resultData.length);

			// 데이터가 없으면 종료
			if (!resultData || resultData.length < 1){
				$.progressRemove("ALL");

				var rowID = (new Date()).valueOf();
				self._grid.addRow(rowID, "");
				self._grid.setCellExcellType(rowID, 0, "txt");
				self._grid.cells2(0,0).setValue("조회된 데이터가 없습니다.");
				self._grid.enableColSpan(true);
				self._grid.setColspan(rowID, 0, self._grid.getColumnsNum());
				self._grid.cells2(0,0).setHorAlign('c');

				var master = self._grid.hdr.rows[1].cells[0].firstChild.firstChild;
				if (typeof(master) === 'object' && master.outerHTML === "<input type=\"checkbox\">") {
					master.checked=false;
				}
				(typeof(self.fnEndOfLoadData) === 'function') && self.fnEndOfLoadData();

				self.rowsNum = 0;

				return;
			}

			var jsonData = [];
			var oldData = [];
			var rSpanStartRowId="", rSpanStartValue="";
			var rSpanCnt=1;

			for (var rowIdx=0; rowIdx<resultData.length; rowIdx++) {
				var rowID = resultData[rowIdx].rowId ? resultData[rowIdx].rowId : (new Date()).valueOf() + (rowIdx * 100000);
				var rowData = [];
				var btnIdx=0;

				for (var idx=0; idx<self._DATA_COLUMNS.length; idx++) {
					var columnId = self._DATA_COLUMNS[idx].clmId;
					var columnLink = self._DATA_COLUMNS[idx].clmClick;
					var columnData = resultData[rowIdx][self._DATA_COLUMNS[idx].clmId];
					var columnType = self._DATA_COLUMNS[idx].clmType;

					if (columnId.toUpperCase() == "ROWNUM") {
						if (reverseNum) {
							rowData.push(parseInt(rowIdx)+1);
						} else {
							rowData.push(resultData.length - rowIdx);
						}
					} else {
						if (!common.isEmpty(columnData)) {
							if (btnParam && columnType == "BUTTON") {
								btnParam[btnIdx].value = columnData;
								if (btnParam[btnIdx].colId) {
									btnParam[btnIdx].value = resultData[rowIdx][btnParam[btnIdx].colId];

									if (btnParam[btnIdx].colId2) {
										btnParam[btnIdx].value += ','+resultData[rowIdx][btnParam[btnIdx].colId2];
									}
								}
								rowData.push(JSON.parse(JSON.stringify(btnParam[btnIdx])));
								btnIdx++;
							} else if (columnType == "STATEIMG") {
								rowData.push(columnData);
							} else if (columnType == "LINK") {
								rowData.push(columnData+"^javascript:gridSelect("+rowID+", "+idx+")^_self");
							} else {
								if (columnLink == "Y") {
									var linkParam = {};
									if (disLinkParam) {
										if (columnId == disLinkParam.target &&
												resultData[rowIdx][disLinkParam.compare] == disLinkParam.compareValue) {
											linkParam.linkFlag = false;
										} else {
											linkParam.linkFlag = true;
											linkParam.rowID = rowID;
											linkParam.cInd = idx;
										}
										linkParam.value = columnData;

									} else {
										linkParam.linkFlag = true;
										linkParam.rowID = rowID;
										linkParam.cInd = idx;
										linkParam.value = columnData;
									}
									rowData.push(JSON.parse(JSON.stringify(linkParam)));
								} else {
									rowData.push(columnData);
								}
							}
						} else {
							if (btnParam && columnType == "BUTTON") {
								btnParam[btnIdx].value = columnData;
								if(btnParam[btnIdx].colId){
									btnParam[btnIdx].value = resultData[rowIdx][btnParam[btnIdx].colId];
									if(btnParam[btnIdx].colId2){
										btnParam[btnIdx].value += ','+resultData[rowIdx][btnParam[btnIdx].colId2];
									}
								}
								rowData.push(JSON.parse(JSON.stringify(btnParam[btnIdx])));
								eXcell_button.prototype = new eXcell;
								btnIdx++;
							}
							else {
								rowData.push("");
							}
						}
					}
				}

				jsonData.push({ id : rowID, data : rowData });
			}

			try {
				self._grid.parse({ rows : jsonData }, "json");
			}
			catch (ex) {
				$.progressRemove("ALL");
				alert("데이터 로딩 오류:" + ex);
			}

			//그리드 생성 후처리 시작 - userdata, checkbox처리등
			for (var rowIdx=0; rowIdx<resultData.length; rowIdx++) {
				var rowID = jsonData[rowIdx].id;

				// 모든 컬럼의 속성이 rotxt이면 스타일을 추가한다.
				for (var i=0; i<self._grid.getColumnsNum(); i++) {
					if (self._grid.getCellExcellType(rowID, i) == 'rotxt') {
						self._grid.setCellTextStyle(rowID, i, "text-overflow: ellipsis;" );
					}
				}

				// extra style
				$.each(extraStyle, function(i) {
					const condition = extraStyle[i];
					const compId = condition.compId;
					const ind = condition.ind;
					const chkVal = condition.value;
					const style = condition.style;


					$.each(resultData[rowIdx], function(key, value) {
						if (key == compId && chkVal.split(",").indexOf(value.toString()) > -1) {
							self._grid.setCellTextStyle(rowID, ind, style);
						}
					});
				});

				// background color 설정이 있는 경우.
				$.each(backgroundColor, function(idx) {
					var condition = backgroundColor[idx];
					var _id = condition.id;
					var _ind = condition.ind;
					var _value = condition.value;
					var _bgcolor = condition.bgcolor;

					$.each(resultData[rowIdx], function(key, value){
						if (key == _id && _value.split(",").indexOf(value.toString()) > -1) {
							self._grid.setRowColor(rowID, _bgcolor);
						}
					});
				});

				//조회한 원천데이터를 userData로 등록한다.
				$.each(resultData[rowIdx], function(key, value) {
					//개행처리 값이 있는경우
					if (newLine && newLine.replace(/ /gi,'').indexOf(key) > -1) {
						self._grid.setCellTextStyle(rowID,self._grid.getColIndexById(key), "white-space:pre-wrap" );
					}
					self._grid.setUserData(rowID, key, value);
				});

				//체크박스 비활성 조건이 있는경우 처리
				$.each(chkBoxDisParam, function(idx) {
					var condition = chkBoxDisParam[idx];
					var _id = condition.id;
					var _ind = condition.ind;
					var _value = condition.value;
					var _reverse = false;

					if (typeof(condition.reverse) != 'undefined')
						_reverse = condition.reverse;

					$.each(resultData[rowIdx], function(key, value) {
						if (key == _id && _reverse) {
							self._grid.cells(rowID, _ind).setDisabled(true);
						}

						if (key == _id && _value.split(",").indexOf(value.toString()) > -1) {
							if (_reverse)
								self._grid.cells(rowID, _ind).setDisabled(false);
							else
								self._grid.cells(rowID, _ind).setDisabled(true);
						}
					});
				});


				// radio 비활성 조건이 있는경우 처리
				$.each(radioDisParam, function(idx) {
					var condition = radioDisParam[idx];
					var _id = condition.id;
					var _ind = condition.ind;
					var _value = condition.value;
					var _checkid = condition.checkid;

					var isNull=true;
					$.each(resultData[rowIdx], function(key, value){
						if (key == _id) { isNull=false; }
						if (key == _id && _value && _value.split(",").indexOf(value.toString()) > -1) {
							self._grid.cells(rowID, _ind).setDisabled(true);
						}
						if (_checkid != null && key == _checkid) {
							if ("Y".indexOf(value.toString()) == 0)
								self._grid.cells(rowID, _ind).setValue(true);
						}
					});
					(isNull && !_value) && self._grid.cells(rowID, _ind).setDisabled(true);
				});

				//체크박스 체크 조건이 있는경우 처리
				$.each(chkBoxParam, function(idx) {
					var condition = chkBoxParam[idx];
					var _id = condition.id;
					var _ind = condition.ind;
					var _value = condition.value;

					$.each(resultData[rowIdx], function(key, value) {
						if (key == _id && _value.split(",").indexOf(value.toString()) > -1) {
							self._grid.cells(rowID, _ind).setValue(true);
						}
					});
				});

				if (self._colorFildTxt && self._colorFildTxt.length) {
					$.each(self._colorFildTxt, function(idx) {
						var condition = self._colorFildTxt[idx];
						var _id = condition.id;
						var _ind = condition.ind;
						var _value = condition.value;
						var _color = condition.color;

						$.each(resultData[rowIdx], function(key, value) {
							if (key == _id && _value.split(",").indexOf(value.toString()) > -1) {
								self._grid.setCellTextStyle(rowID, _ind, "color:" + _color);
							}
						});
					});
				}
			}

			if (typeof self.fnLinkCallback === 'function') {
				self.fnLinkCallback();
			} else {
				typeof(linkActive) === 'function' && linkActive();
			}

			self.evIdAfterSorting = self._grid.attachEvent("onAfterSorting", function(ind,fInd,lInd) {
				if (typeof self.fnLinkCallback === 'function') {
					self.fnLinkCallback();
				} else {
					typeof(linkActive) === 'function' && linkActive();
				}
			});

			jsonData=null, oldData=null, rSpanStartRowId=null, rSpanStartValue=null, rSpanCnt=null;

			var master = self._grid.hdr.rows[1].cells[0].firstChild.firstChild;
			if (typeof(master) === 'object') {
				if (master.outerHTML === "<input type=\"checkbox\">") {
					master.checked=false;
				}
			}
			(typeof(self.fnEndOfLoadData) === 'function') && self.fnEndOfLoadData();

			self.rowsNum = self._grid.getRowsNum();

			self._grid.setSizes();
			$.progressRemove("ALL");
		};

		/**
		 * 그리드 행 추가
		 */
		this.addRow = function(param) {
			var defaultData = "";
			var rowId;

			if (param != undefined) { // 전달된 파라메터가 있으면 초기값 설정을 위한 처리
				$.each(param, function(key, value){
					defaultData += value+",";
				});
				rowId = param.rowId;
			}
			else { // 전달된 파라메터가 없으면 rowid만 세팅
				rowId = (new Date()).valueOf();
			}

			// 생성된 아이디로 행 추가.
			self._grid.addRow(rowId, defaultData);
			self._grid.cells(rowId, self._grid.getColIndexById("dataFlag")).setValue("I");
			self.rowsNum = self._grid.getRowsNum();
		}

		/**
		 * 그리드 행 삭제 - 단건 삭제
		 */
		this.delRow = function(rowId) {
			if (self._grid.cells(rowId, self._grid.getColIndexById("dataFlag")).getValue() == "I") {
				// 행 아이디로 행 삭제.
				self._grid.deleteRow(rowId);
			} else{
				self._grid.cells(rowId, self._grid.getColIndexById("dataFlag")).setValue("D");
				self._grid.setRowHidden(rowId, true);
			}
			self.rowsNum = self._grid.getRowsNum();
		}

		/**
		 * 그리드 행 삭제 - 체크된 행 일괄 삭제
		 */
		this.deleteCheckedRows = function(cInd) {
			//체크된 rowId 가져오기
			var sRowIds = self._grid.getCheckedRows(cInd);

			//체크된 row가 없으면
			if(!sRowIds){
				alert("선택된 Row가 없습니다.");
				return false;
			}

			var rowId = sRowIds.split(",");

			for (var idx=0; idx<rowId.length; idx++) {
				if (self._grid.cells(rowId[idx], self._grid.getColIndexById("dataFlag")).getValue() == "I") {
					// 행 아이디로 행 삭제.
					self._grid.deleteRow(rowId[idx]);
				} else {
					self._grid.cells(rowId[idx], self._grid.getColIndexById("dataFlag")).setValue("D");
					self._grid.setRowHidden(rowId[idx], true);
				}
			}
			self.rowsNum = self._grid.getRowsNum();
		}

		/**
		 * 그리드 행 삭제 - 선택된 행 일괄 삭제
		 */
		this.deleteSelectedRows = function(cInd) {
			//체크된 rowId 가져오기
			var sRowIds = self._grid.getSelectedRowId();

			//체크된 row가 없으면
			if(!sRowIds){
				alert("선택된 Row가 없습니다.");
				return false;
			}

			var rowId = sRowIds.split(",");

			for (var idx=0; idx<rowId.length; idx++) {
				if (self._grid.cells(rowId[idx], self._grid.getColIndexById("dataFlag")).getValue() == "I"){
					self._grid.deleteRow(rowId[idx]);
				}else{
					self._grid.cells(rowId[idx], self._grid.getColIndexById("dataFlag")).setValue("D");
					self._grid.setRowHidden(rowId[idx], true);
				}
			}
			self.rowsNum = self._grid.getRowsNum();
		}

		/**
		 * 그리드 셀 수정 - TEXT 타입 데이터 수정
		 */
		this.onEditCell = function(_callback){
			self.evIdEditCell = self._grid.attachEvent("onEditCell", function(stage, rowId, colIdx, newValue, oldValue){
				if(stage == 2 && newValue != oldValue){
					var columnId = self._grid.getColumnId(colIdx);

					//신규 추가된 행이 아닌경우 dataFlag를 "U"로 업데이트 한다.
					if(self._grid.cells(rowId, self._grid.getColIndexById("dataFlag")).getValue() != "I"){
						self._grid.cells(rowId, self._grid.getColIndexById("dataFlag")).setValue("U");
					}
					if(_callback){
						_callback(rowId, columnId, newValue);
					}
				}
				return true;
			});
		}

		/**
		 * 그리드 선택시 해당 row의 데이터 반환
		 */
		this.onSelect = function(_callback) {
		}

		/**
		 * 그리드 객체 반환
		 */
		this.getRawObject = function() {
			return self._grid;
		}

		/**
		 * 지정한 행의 Data를 반환한다.
		 */
		this.getData = function(rowId) {
			return self._grid.getRowData(rowId);
		}

		/**
		 * 지정한 행의 userData를 반환한다.
		 */
		this.getUserData = function(rowId, key) {
			return self._grid.getUserData(rowId, key);
		}

		/**
		 * 그리드의 총 Row를 반환한다.
		 */
		this.getRowsNum = function(){
			 return self._grid.getRowsNum();
		 }

		/**
		 * 해당 row의 해당 컬럼 값을 반환한다.
		 */
		this.getColumValueForRowInd = function(rowInd, cId){
			 if(self.getRowsNum() > 0){
				 return self._grid.cells(self._grid.getRowId(rowInd), self._grid.getColIndexById(cId)).getValue();
			 }else{
				 return "";
			 }
		 }

		/**
		 * 해당 row의 해당 컬럼 값을 반환한다.
		 */
		this.getColumValueForRowId = function(rowId, cId){
			if(self.getRowsNum() > 0){
				return self._grid.cells(rowId, self._grid.getColIndexById(cId)).getValue();
			}else{
				return "";
			}
		 }

		/**
		 * 체크된 행의 데이터를 반환한다.
		 */
		this.getCheckedRows = function(cInd){
			//체크된 rowId 가져오기
			var sRowIds = self._grid.getCheckedRows(cInd);

			//체크된 row가 없으면
			if(!sRowIds || self.rowsNum == 0) {
				return null;
			}

			var rowId = sRowIds.split(",");
			var returnData = new Array();
			var tmp;
			for (var idx=0; idx<rowId.length; idx++) {
				tmp = self._grid.getRowData(rowId[idx]);
				tmp.workUsrId = self._grid.getUserData(rowId[idx], "workUsrId");
				returnData.push(tmp);
			}
			return returnData;
		}

		/**
		 * 셀 타입 조회
		 */
		this.getCellType = function(rowId, colId) {
			return self._grid.getCellExcellType(rowId, self._grid.getColIndexById(colId));
		}

		/**
		 * 컬럼 콤보박스 추가
		 */
		this.setColCommCombo = function(comboData, colId, _callback) {
			var combobox = self._grid.getCombo(self._grid.getColIndexById(colId));

			$.each(comboData, function(key, value){
				combobox.put(key, value);
			})
		}

		/**
		 * 컬럼 노출처리
		 */
		this.setColVisible = function(hiddenColId, showColId) {
			if(hiddenColId){
				self._grid.setColumnHidden(self._grid.getColIndexById(hiddenColId), true);
			}
			if(showColId){
				self._grid.setColumnHidden(self._grid.getColIndexById(showColId), false);
			}
		}

		/**
		 * 컬럼 노출 순번 변경 처리
		 */
		this.setChangeInd = function(colId, ind) {
			self._grid.moveColumn(self._grid.getColIndexById(colId), ind);
		}

		/**
		 * 그리드 초기화
		 */
		this.setClear = function() {
			self._grid.clearAll();
		}

		/**
		 * 그리드 데이터 없음 행 출력
		 */
		this.setNoData = function() {
			self._grid.clearAll();

			var rowID = (new Date()).valueOf();
			self._grid.addRow(rowID, "");
			self._grid.setCellExcellType(rowID, 0, "txt");
			self._grid.cells2(0,0).setValue("조회된 데이터가 없습니다.");
			self._grid.enableColSpan(true);
			self._grid.setColspan(rowID, 0, self._grid.getColumnsNum());
			self._grid.cells2(0,0).setHorAlign('c');

			self.rowsNum = 0;
		}

		/**
		 * 행병합
		 */
		this.setRowspan = function(rowID, colId, len) {
			self._grid.setRowspan(rowID, self._grid.getColIndexById(colId), len);
		}

		/**
		 * 셀 값 변경
		 */
		this.setValue = function(rowId, colId, value) {
			self._grid.cells(rowId, self._grid.getColIndexById(colId)).setValue(value);
		}

		/**
		 * 셀 타입 변경
		 */
		this.setCellType = function(rowId, colId, type) {
			self._grid.setCellExcellType(rowId, self._grid.getColIndexById(colId), type);
		}

		/**
		 * 페이징 처리
		 */
		this.setPaging = function ( pageSize , grpSize) {
			  try {
				  /* modified by inseok.ra 2019.07.13 */
				  self._grid.i18n.paging={
					      results:"Results",
					      records:"레코드 범위 : ",
					      to:" ~ ",
					      page:"페이지  #",
					      perpage:"개씩 보기",
					      /*notfound:"조회된 데이터가 없습니다."*/
					      notfound:"레코드 범위 : 0"
					};
				  /* modified by inseok.ra 2019.07.13 */
				  self._grid.setPagingWTMode(true,true,true,[10,15,20,30,40,50]);

				  if ( !grpSize ) grpSize = 10;

				  self._grid.enablePaging(true, pageSize, grpSize , "pagingArea_" + container, true, "infoArea_" + container);
				  self._grid.setPagingSkin("toolbar");
				  self._grid.changePage(1);

				  self.setPageChange();
			  } catch (e) {
				  alert("그리드 페이지 컨트롤 생성 오류 :" + e);
			  }
		}

		/**
		 * 페이징 갱신
		 */
		this.setPageChange = function() {
			self.evIdPageChanged = self._grid.attachEvent("onPageChanged", function(ind,fInd,lInd){
				if (typeof self.fnLinkCallback === 'function') {
					self.fnLinkCallback();
				} else {
					typeof(linkActive) === 'function' && linkActive();
				}
				self._grid.setSizes();
			});
		}

		self.setGrid();


		/**
		 * 그리드 변경데이터 설정
		 */
		this.sendData = function(_param, _url, _callback) {
		}

		/**
		 * destructor
		 */
		this.destructor = function() {
			// delete toggle event
			document.getElementById('menu_toggle')
					.removeEventListener("click", this.onMenuToggle, false);

			self.evIdMouseOver != null && self._grid.detachEvent(self.evIdMouseOver);
			self.evIdRowSelect != null && self._grid.detachEvent(self.evIdRowSelect);
			self.evIdAfterSorting != null && self._grid.detachEvent(self.evIdAfterSorting);
			self.evIdEditCell != null && self._grid.detachEvent(self.evIdEditCell);
			self.evIdPageChanged != null && self._grid.detachEvent(self.evIdPageChanged);

			(self._grid.aToolBar != 'undefined' && self._grid.aToolBar != null) &&
			(self._grid.aToolBar.detachAllEvents(), self._grid.aToolBar.clearAll());

			self._grid.destructor();
			self.selfCrear();
		}

		$.extend(dhtmlx, {
			loadData: "loadData",
			setFildTxtColor: "setFildTxtColor",
			addRow: "addRow",
			delRow: "delRow",
			deleteCheckedRows: "deleteCheckedRows",
			deleteSelectedRows: "deleteSelectedRows",
			onEditCell: "onEditCell",
			onSelect: "onSelect",
			getRawObject: "getRawObject",
			getRowsNum:	"getRowsNum",
			getColumValueForRowInd: "getColumValueForRowInd",
			getColumValueForRowId: "getColumValueForRowId",
			getCheckedRows: "getCheckedRows",
			getUserData: "getUserData",
			getData: "getData",
			getCellType: "getCellType",
			setColCommCombo: "setColCommCombo",
			setPaging: "setPaging",
			setColVisible: "setColVisible",
			setChangeInd: "setChangeInd",
			setRowspan: "setRowspan",
			setClear: "setClear",
			setNoData: "setNoData",
			setValue: "setValue",
			setCellType: "setCellType",
			sendData: "sendData",
			setLinkCallback: "setLinkCallback",
			setEndOfLoadData: "setEndOfLoadData",
			destructor: "destructor"
		});
	}
})(jQuery);

/**
 * 그리드에 버튼 생성 및 이벤트 처리
 *
 * @param cell
 * @history inseok.ra 2019/11, 버튼 클릭시 event bubbling 처리
 */
function eXcell_button(cell) {
	if (cell) {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	var btns = this.cell._attrs;
	var rowId = this.cell.parentNode.idd;
	// the cell is read-only, so it's always in the disabled state
	this.isDisabled = function() { return true; }

	this.setValue = function(val) {
		var dis = '';
		var isShow = true;
		var isText = false;

		if (false) { // 버튼을 노출하고 비활성화 처리를 할 경우 아래 코드 사용
			if (btns.btnSwitch) {
				if (!val || btns.colId && btns.chkVal.split(",").indexOf(val) > -1)
					dis = 'disabled'
			}
		} else { // 버튼을 노출하지 않을 경우 아래 코드 사용
			if (btns.btnSwitch) {
				if (!val || btns.colId) {
					// 버튼이 보이지 않는 경우 조건에 맞는 텍스트 출력 (보안업무조회 참고)
					var val2='';
					if (btns.colId2) {
						var arrVal = val.split(',');
						val = arrVal[0];
						val2 = arrVal[1];
					}

					if (!val || btns.colId && btns.chkVal.split(",").indexOf(val) > -1) {
						isShow = false;

						if (btns.colId2 && btns.chkVal2.split(",").indexOf(val2) > -1) {
							isText = true;
						}
					}
				}
			}
		}

		var innerHtml="";
		var label="";
		var imgElem="";
		var classElem="btn_default";

		btns.label&&(label=btns.label);
		if (btns.imageStr) {
			imgElem=btns.imageStr;
			label.length!==0&&(label="<span>"+label+"</span>");
		}

		btns.imageStr && (imgElem=btns.imageStr);
		btns.classStr && (classElem+=(" "+btns.classStr));
		isShow && (innerHtml = ("<button type=\"button\" id=\"" + btns.id +
					  			"\" value=\"" + btns.value + "\" onClick=\"" + btns.callback +
					  			"(this, " + rowId + "); (_isIE?event:arguments[0]).cancelBubble = true;\" " + dis +
					  			" class=\""+classElem+"\">" + imgElem + label + "</button>"));

		(isText && (innerHtml = ("<span style='color:#dc3545;'>"+btns.text2+"</span>")));

		this.setCValue(innerHtml, val);
	}
}; eXcell_button.prototype = new eXcell;

/**
 * 그리드에 링크 생성 및 클릭 이벤트 처리
 *
 * @param cell
 * @history inseok.ra 2019/11, 링크 클릭시 event bubbling 처리
 */
function eXcell_click(cell) {
    if (cell) { // the default pattern, just copy it
        this.cell = cell;
        this.grid = this.cell.parentNode.grid;
    }

    var compare = this.cell._attrs;

    this.edit = function() {} // read-only cell doesn't have edit method
    // the cell is read-only, so it's always in the disabled state
    this.isDisabled = function() { return true; }

    this.setValue=function(val) {
    	val = val.replace(/ /gi, "&nbsp;");
    	if (compare.linkFlag) {
    		this.setCValue(
    				"<span style=\"color:#1289c4;font-weight:bold;cursor:pointer\" class=\"gridLink\" " +
    				"onclick=\"(_isIE?event:arguments[0]).cancelBubble = true;\" rid=\"" +
    				compare.rowID + "\" cInd=\"" + compare.cInd + "\">" + val + "</span>", val);
    	}
    	else {
    		if (typeof this.setCValue == "function")
    			this.setCValue(val);
    	}
    }
}; eXcell_click.prototype = new eXcell;

/**
 * 평가항목 작성 상태 이미지 처리
 */
function eXcell_stateImg(cell) {
	if (cell) {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	this.edit = function(){}
	this.isDisabled = function() { return true; }

	this.setValue=function(val) {
		if (val == 'Y') {
			this.setCValue( "<input type='image' src='../images/state_Y.png' WIDTH='18' HEIGHT='18' style='cursor:default'>", val );
		} else if (val == 'P') {
			this.setCValue( "<input type='image' src='../images/state_P.png' WIDTH='18' HEIGHT='18' style='cursor:default'>", val );
		} else if (val == 'N') {
			this.setCValue( "<input type='image' src='../images/state_N.png' WIDTH='18' HEIGHT='18' style='cursor:default'>", val );
		} else {
			this.setCValue( "<input type='image' src='" + val+ "' WIDTH='18' HEIGHT='18'>", val );
		}
	}
} eXcell_stateImg.prototype = new eXcell;

// toolbar 오작동으로인해 적용
function dhtmlXToolbarObject(t,e){var i=this;for(this.conf={skin:e||window.dhx4.skin||("undefined"!=typeof dhtmlx?dhtmlx.skin:null)||window.dhx4.skinDetect("dhxtoolbar")||"material",align:"left",align_autostart:"left",icons_path:"",icons_css:!1,iconSize:18,sel_ofs_x:0,sel_ofs_y:0,xml_autoload:null,items_autoload:null,cssShadow:dhx4.isIE6||dhx4.isIE7||dhx4.isIE8?"":" dhx_toolbar_shadow"},"object"==typeof t&&null!=t&&"undefined"==typeof t.tagName&&((null!=t.icons_path||null!=t.icon_path)&&(this.conf.icons_path=t.icons_path||t.icon_path),null!=t.icons_size&&(this.conf.icons_size_autoload=t.icons_size),null!=t.iconset&&(this.conf.icons_css="awesome"==t.iconset),null!=t.json&&(this.conf.json_autoload=t.json),null!=t.xml&&(this.conf.xml_autoload=t.xml),null!=t.onload&&(this.conf.onload_autoload=t.onload),(null!=t.onclick||null!=t.onClick)&&(this.conf.auto_onclick=t.onclick||t.onClick),null!=t.items&&(this.conf.items_autoload=t.items),null!=t.skin&&(this.conf.skin=t.skin),null!=t.align&&(this.conf.align_autostart=t.align),t=t.parent),this.cont="object"!=typeof t?document.getElementById(t):t;this.cont.childNodes.length>0;)this.cont.removeChild(this.cont.childNodes[0]);return t=null,this.cont.dir="ltr",this.base=document.createElement("DIV"),this.base.className="dhxtoolbar_float_left",this.cont.appendChild(this.base),this.cont.ontouchstart=function(t){return t=t||event,"input"==String(t.target.tagName||"").toLowerCase()?!0:(t.preventDefault?t.preventDefault():t.returnValue=!1,t.cancelBubble=!0,!1)},this.setSkin(this.conf.skin),this.objPull={},this.anyUsed=null,this._genStr=function(t){for(var e="dhxId_",i="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",o=0;t>o;o++)e+=i.charAt(Math.round(Math.random()*(i.length-1)));return e},this.rootTypes=new Array("button","buttonSelect","buttonTwoState","separator","label","slider","text","buttonInput"),this.idPrefix=this._genStr(12),window.dhx4._enableDataLoading(this,"_initObj","_xmlToJson","toolbar",{struct:!0}),window.dhx4._eventable(this),this._getObj=function(t,e){for(var i=null,o=0;o<t.childNodes.length;o++)null!=t.childNodes[o].tagName&&String(t.childNodes[o].tagName).toLowerCase()==String(e).toLowerCase()&&(i=t.childNodes[o]);return i},this._addImgObj=function(t){var e=document.createElement(1==this.conf.icons_css?"I":"IMG");return t.childNodes.length>0?t.insertBefore(e,t.childNodes[0]):t.appendChild(e),e},this._setItemImage=function(t,e,i){if(1==i?t.imgEn=e:t.imgDis=e,!(!t.state&&1==i||t.state&&0==i))if(1==this.conf.icons_css){var o=this._getObj(t.obj,"i");null==o&&(o=this._addImgObj(t.obj)),o.className=this.conf.icons_path+e}else{var o=this._getObj(t.obj,"img");null==o&&(o=this._addImgObj(t.obj)),o.src=this.conf.icons_path+e}},this._clearItemImage=function(t,e){if(1==e?t.imgEn="":t.imgDis="",!(!t.state&&1==e||t.state&&0==e)){var i=this._getObj(t.obj,this.conf.icons_css?"i":"img");null!=i&&i.parentNode.removeChild(i)}},this._setItemText=function(t,e){var i=this._getObj(t.obj,"div");return null==e||0==e.length?void(null!=i&&i.parentNode.removeChild(i)):(null==i&&(i=document.createElement("DIV"),i.className="dhxtoolbar_text",t.obj.appendChild(i)),void(i.innerHTML=e))},this._getItemText=function(t){var e=this._getObj(t.obj,"div");return null!=e?e.innerHTML:""},this._enableItem=function(t){if(!t.state){t.state=!0,"buttonTwoState"==this.objPull[t.id].type&&1==this.objPull[t.id].obj.pressed?(t.obj.className="dhx_toolbar_btn dhxtoolbar_btn_pres",t.obj.renderAs="dhx_toolbar_btn dhxtoolbar_btn_over"):(t.obj.className="dhx_toolbar_btn dhxtoolbar_btn_def",t.obj.renderAs=t.obj.className),t.arw&&(t.arw.className=String(t.obj.className).replace("btn","arw"));var e=this._getObj(t.obj,this.conf.icons_css?"i":"img");""!=t.imgEn?(null==e&&(e=this._addImgObj(t.obj)),e[this.conf.icons_css?"className":"src"]=this.conf.icons_path+t.imgEn):null!=e&&e.parentNode.removeChild(e)}},this._disableItem=function(t){if(t.state){t.state=!1,t.obj.className="dhx_toolbar_btn dhxtoolbar_btn_"+("buttonTwoState"==this.objPull[t.id].type&&t.obj.pressed?"pres_":"")+"dis",t.obj.renderAs="dhx_toolbar_btn dhxtoolbar_btn_def",t.arw&&(t.arw.className=String(t.obj.className).replace("btn","arw"));var e=this._getObj(t.obj,this.conf.icons_css?"i":"img");""!=t.imgDis?(null==e&&(e=this._addImgObj(t.obj)),e[this.conf.icons_css?"className":"src"]=this.conf.icons_path+t.imgDis):null!=e&&e.parentNode.removeChild(e),null!=t.polygon&&"none"!=t.polygon.style.display&&(window.dhx4.zim.clear(t.polygon._idd),t.polygon.style.display="none",t.polygon._ie6cover&&(t.polygon._ie6cover.style.display="none"),"dhx_terrace"==this.conf.skin&&this._improveTerraceButtonSelect(t.id,!0),this.callEvent("onButtonSelectHide",[t.obj.idd])),this.anyUsed=null}},this.clearAll=function(){for(var t in this.objPull)this._removeItem(String(t).replace(this.idPrefix,""));this._spacer=null},this._doOnClick=function(t){i&&i.forEachItem&&i.forEachItem(function(t){if("buttonSelect"==i.objPull[i.idPrefix+t].type){var e=i.objPull[i.idPrefix+t];e.arw._skip===!0?e.arw._skip=!1:"none"!=e.polygon.style.display&&(e.obj.renderAs="dhx_toolbar_btn dhxtoolbar_btn_def",e.obj.className=e.obj.renderAs,e.arw.className=String(e.obj.renderAs).replace("btn","arw"),i.anyUsed=null,i.conf.touch_id=null,window.dhx4.zim.clear(e.polygon._idd),e.polygon.style.display="none",e.polygon._ie6cover&&(e.polygon._ie6cover.style.display="none"),"dhx_terrace"==i.conf.skin&&i._improveTerraceButtonSelect(e.id,!0),i.callEvent("onButtonSelectHide",[e.obj.idd]))}})},"undefined"!=typeof window.addEventListener?(window.addEventListener("mousedown",this._doOnClick,!1),window.addEventListener("touchstart",this._doOnClick,!1)):document.body.attachEvent("onmousedown",this._doOnClick),null!=this.conf.icons_size_autoload&&(this.setIconSize(this.conf.icons_size_autoload),this.conf.icons_size_autoload=null),null!=this.conf.items_autoload?(this.loadStruct(this.conf.items_autoload,this.conf.onload_autoload),this.conf.items_autoload=null):null!=this.conf.json_autoload?(this.loadStruct(this.conf.json_autoload,this.conf.onload_autoload),this.conf.json_autoload=null):null!=this.conf.xml_autoload&&(this.loadStruct(this.conf.xml_autoload,this.conf.onload_autoload),this.conf.xml_autoload=null),this.conf.align_autostart!=this.conf.align&&(this.setAlign(this.conf.align_autostart),this.conf.align_autostart=null),"function"==typeof this.conf.auto_onclick?this.attachEvent("onClick",this.conf.auto_onclick):"string"==typeof this.conf.auto_onclick&&"function"==typeof window[this.conf.auto_onclick]&&this.attachEvent("onClick",window[this.conf.auto_onclick]),this}dhtmlXToolbarObject.prototype.addSpacer=function(t){var e=this.idPrefix+t;if(null!=this._spacer){if(this._spacer.idd==t)return;if(this._spacer==this.objPull[e].obj.parentNode){for(var i=!0;i;){var o=this._spacer.childNodes[0].idd;this.base.appendChild(this._spacer.childNodes[0]),(o==t||0==this._spacer.childNodes.length)&&(null!=this.objPull[e].arw&&this.base.appendChild(this.objPull[e].arw),i=!1)}return this._spacer.idd=t,void this._fixSpacer()}if(this.base==this.objPull[e].obj.parentNode){for(var i=!0,s=null!=this.objPull[e].arw;i;){var n=this.base.childNodes.length-1;1==s&&this.base.childNodes[n]==this.objPull[e].arw&&(i=!1),this.base.childNodes[n].idd==t&&(i=!1),i&&(this._spacer.childNodes.length>0?this._spacer.insertBefore(this.base.childNodes[n],this._spacer.childNodes[0]):this._spacer.appendChild(this.base.childNodes[n]))}return this._spacer.idd=t,void this._fixSpacer()}}else{for(var l=null,n=0;n<this.base.childNodes.length;n++)this.base.childNodes[n]==this.objPull[this.idPrefix+t].obj&&(l=n,null!=this.objPull[this.idPrefix+t].arw&&(l=n+1));if(null!=l){for(this._spacer=document.createElement("DIV"),this._spacer.className="right"==this.conf.align?" dhxtoolbar_float_left":" dhxtoolbar_float_right",this._spacer.dir="ltr",this._spacer.idd=t;this.base.childNodes.length>l+1;)this._spacer.appendChild(this.base.childNodes[l+1]);this.cont.appendChild(this._spacer),this._fixSpacer()}}"dhx_terrace"==this.conf.skin&&this._improveTerraceSkin()},dhtmlXToolbarObject.prototype.removeSpacer=function(){if(this._spacer){for(;this._spacer.childNodes.length>0;)this.base.appendChild(this._spacer.childNodes[0]);this._spacer.parentNode.removeChild(this._spacer),this._spacer=null,"dhx_terrace"==this.conf.skin&&this._improveTerraceSkin()}},dhtmlXToolbarObject.prototype._fixSpacer=function(){if("undefined"==typeof window.addEventListener&&null!=this._spacer){this._spacer.style.borderLeft="1px solid #a4bed4";var t=this._spacer;window.setTimeout(function(){t.style.borderLeft="0px solid #a4bed4",t=null},1)}},dhtmlXToolbarObject.prototype.getType=function(t){var e=this.getParentId(t);if(null!=e){var i=null,o=this.objPull[this.idPrefix+e]._listOptions[t];return null!=o&&(i=null!=o.sep?"buttonSelectSeparator":"buttonSelectButton"),i}return null==this.objPull[this.idPrefix+t]?null:this.objPull[this.idPrefix+t].type},dhtmlXToolbarObject.prototype.getTypeExt=function(t){var e=this.getType(t);return"buttonSelectButton"==e||"buttonSelectSeparator"==e?e="buttonSelectButton"==e?"button":"separator":null},dhtmlXToolbarObject.prototype.inArray=function(t,e){for(var i=0;i<t.length;i++)if(t[i]==e)return!0;return!1},dhtmlXToolbarObject.prototype.getParentId=function(t){var e=null;for(var i in this.objPull)if(this.objPull[i]._listOptions)for(var o in this.objPull[i]._listOptions)o==t&&(e=String(i).replace(this.idPrefix,""));return e},dhtmlXToolbarObject.prototype._addItem=function(t,e){"string"==typeof t.text&&(t.text=window.dhx4.trim(t.text),0==t.text.length&&(t.text=null)),this._addItemToStorage(t,e),"dhx_terrace"==this.conf.skin&&this._improveTerraceSkin()},dhtmlXToolbarObject.prototype.addButton=function(t,e,i,o,s){this._addItem({id:t,type:"button",text:i,img:o,imgdis:s},e)},dhtmlXToolbarObject.prototype.addText=function(t,e,i){this._addItem({id:t,type:"text",text:i},e)},dhtmlXToolbarObject.prototype.addButtonSelect=function(t,e,i,o,s,n,l,a,h,d){for(var r=[],u=0;u<o.length;u++){var c={};o[u]instanceof Array?(c.id=o[u][0],c.type="obj"==o[u][1]?"button":"separator",c.text=o[u][2]||null,c.img=o[u][3]||null):o[u]instanceof Object&&null!=o[u]&&"undefined"!=typeof o[u].id&&"undefined"!=typeof o[u].type&&(c.id=o[u].id,c.type="obj"==o[u].type?"button":"separator",c.text=o[u].text,c.img=o[u].img),r.push(c)}this._addItem({id:t,type:"buttonSelect",text:i,img:s,imgdis:n,renderSelect:l,openAll:a,options:r,maxOpen:h,mode:d},e)},dhtmlXToolbarObject.prototype.addButtonTwoState=function(t,e,i,o,s){this._addItem({id:t,type:"buttonTwoState",img:o,imgdis:s,text:i},e)},dhtmlXToolbarObject.prototype.addSeparator=function(t,e){this._addItem({id:t,type:"separator"},e)},dhtmlXToolbarObject.prototype.addSlider=function(t,e,i,o,s,n,l,a,h){this._addItem({id:t,type:"slider",length:i,valueMin:o,valueMax:s,valueNow:n,textMin:l,textMax:a,toolTip:h},e)},dhtmlXToolbarObject.prototype.addInput=function(t,e,i,o){this._addItem({id:t,type:"buttonInput",value:i,width:o},e)},dhtmlXToolbarObject.prototype.forEachItem=function(t){for(var e in this.objPull)this.inArray(this.rootTypes,this.objPull[e].type)&&t(this.objPull[e].id.replace(this.idPrefix,""))},function(){for(var t="isVisible,enableItem,disableItem,isEnabled,setItemText,getItemText,setItemToolTip,getItemToolTip,getInput,setItemImage,setItemImageDis,clearItemImage,clearItemImageDis,setItemState,getItemState,setItemToolTipTemplate,getItemToolTipTemplate,setValue,getValue,setMinValue,getMinValue,setMaxValue,getMaxValue,setWidth,getWidth,setMaxOpen".split(","),e=[!1,"","",!1,"","","","","","","","","",!1,"","","",null,"",[null,null],"",[null,null],"",null],i=function(t,e){return function(i,o,s){return i=this.idPrefix+i,null!=this.objPull[i][t]?this.objPull[i][t].call(this.objPull[i],o,s):e}},o=0;o<t.length;o++){var s=t[o],n=e[o];dhtmlXToolbarObject.prototype[s]=i(s,n)}}(),dhtmlXToolbarObject.prototype.showItem=function(t){t=this.idPrefix+t,null!=this.objPull[t]&&null!=this.objPull[t].showItem&&(this.objPull[t].showItem(),"dhx_terrace"==this.conf.skin&&this._improveTerraceSkin())},dhtmlXToolbarObject.prototype.hideItem=function(t){t=this.idPrefix+t,null!=this.objPull[t]&&null!=this.objPull[t].hideItem&&(this.objPull[t].hideItem(),"dhx_terrace"==this.conf.skin&&this._improveTerraceSkin())},dhtmlXToolbarObject.prototype.getPosition=function(t){return this._getPosition(t)},dhtmlXToolbarObject.prototype._getPosition=function(t,e){if(null==this.objPull[this.idPrefix+t])return null;for(var i=null,o=0,s=0;s<this.base.childNodes.length;s++)null!=this.base.childNodes[s].idd&&(this.base.childNodes[s].idd==t&&(i=o),o++);if(!i&&null!=this._spacer)for(var s=0;s<this._spacer.childNodes.length;s++)null!=this._spacer.childNodes[s].idd&&(this._spacer.childNodes[s].idd==t&&(i=o),o++);return i},dhtmlXToolbarObject.prototype.setPosition=function(t,e){this._setPosition(t,e)},dhtmlXToolbarObject.prototype._setPosition=function(t,e){if(null!=this.objPull[this.idPrefix+t]){var i=null;this._spacer&&(i=this._spacer.idd,this.removeSpacer()),isNaN(e)&&(e=this.base.childNodes.length),0>e&&(e=0);var o=this.objPull[this.idPrefix+t];this.base.removeChild(o.obj),o.arw&&this.base.removeChild(o.arw);var s=this._getIdByPosition(e,!0);null==s[0]?(this.base.appendChild(o.obj),o.arw&&this.base.appendChild(o.arw)):(this.base.insertBefore(o.obj,this.base.childNodes[s[1]]),o.arw&&this.base.insertBefore(o.arw,this.base.childNodes[s[1]+1])),null!=i&&this.addSpacer(i)}},dhtmlXToolbarObject.prototype._getIdByPosition=function(t,e){for(var i=null,o=0,s=0,n=0;n<this.base.childNodes.length;n++)null!=this.base.childNodes[n].idd&&null==i&&o++==t&&(i=this.base.childNodes[n].idd),null==i&&s++;return s=null==i?null:s,1==e?new Array(i,s):i},dhtmlXToolbarObject.prototype.removeItem=function(t){this._removeItem(t),"dhx_terrace"==this.conf.skin&&this._improveTerraceSkin()},dhtmlXToolbarObject.prototype._removeItem=function(t){var e=this.getType(t);t=this.idPrefix+t;var i=this.objPull[t];if(1=={button:1,buttonTwoState:1}[e]){window.dhx4.isIE&&(i.obj.onselectstart=null),this._evs.clear.apply(i,[i.obj.evs,i.obj]);for(var o in i.obj)"function"==typeof i.obj[o]&&(i.obj[o]=null);i.obj.parentNode.removeChild(i.obj),i.obj=null;for(var o in i)i[o]=null}if("buttonSelect"==e){for(var o in i._listOptions)this.removeListOption(t,o);i._listOptions=null,i.polygon._ie6cover&&(document.body.removeChild(i.polygon._ie6cover),i.polygon._ie6cover=null),i.p_tbl.removeChild(i.p_tbody),i.polygon.removeChild(i.p_tbl),i.polygon.onselectstart=null,document.body.removeChild(i.polygon),window.dhx4.isIE&&(i.obj.onselectstart=null,i.arw.onselectstart=null),this._evs.clear.apply(i,[i.obj.evs,i.obj]),this._evs.clear.apply(i,[i.arw.evs,i.arw]);for(var o in i.obj)"function"==typeof i.obj[o]&&(i.obj[o]=null);i.obj.parentNode.removeChild(i.obj),i.obj=null;for(var o in i.arw)"function"==typeof i.arw[o]&&(i.arw[o]=null);i.arw.parentNode.removeChild(i.arw),i.arw=null;for(var o in i)i[o]=null}if("buttonInput"==e&&(i.obj.childNodes[0].onkeydown=null,i.obj.removeChild(i.obj.childNodes[0]),i.obj.w=null,i.obj.idd=null,i.obj.parentNode.removeChild(i.obj),i.obj=null,i.id=null,i.type=null,i.enableItem=null,i.disableItem=null,i.isEnabled=null,i.showItem=null,i.hideItem=null,i.isVisible=null,i.setItemToolTip=null,i.getItemToolTip=null,i.setWidth=null,i.getWidth=null,i.setValue=null,i.getValue=null,i.setItemText=null,i.getItemText=null),"slider"==e){for(window.dhx4.isIPad?(document.removeEventListener("touchmove",pen._doOnMouseMoveStart,!1),document.removeEventListener("touchend",pen._doOnMouseMoveEnd,!1)):"function"==typeof window.addEventListener?(window.removeEventListener("mousemove",i.pen._doOnMouseMoveStart,!1),window.removeEventListener("mouseup",i.pen._doOnMouseMoveEnd,!1)):(document.body.detachEvent("onmousemove",i.pen._doOnMouseMoveStart),document.body.detachEvent("onmouseup",i.pen._doOnMouseMoveEnd)),i.pen.allowMove=null,i.pen.initXY=null,i.pen.maxX=null,i.pen.minX=null,i.pen.nowX=null,i.pen.newNowX=null,i.pen.valueMax=null,i.pen.valueMin=null,i.pen.valueNow=null,i.pen._definePos=null,i.pen._detectLimits=null,i.pen._doOnMouseMoveStart=null,i.pen._doOnMouseMoveEnd=null,i.pen.onmousedown=null,i.obj.removeChild(i.pen),i.pen=null,i.label.tip=null,document.body.removeChild(i.label),i.label=null,i.obj.onselectstart=null,i.obj.idd=null;i.obj.childNodes.length>0;)i.obj.removeChild(i.obj.childNodes[0]);i.obj.parentNode.removeChild(i.obj),i.obj=null,i.id=null,i.type=null,i.state=null,i.enableItem=null,i.disableItem=null,i.isEnabled=null,i.setItemToolTipTemplate=null,i.getItemToolTipTemplate=null,i.setMaxValue=null,i.setMinValue=null,i.getMaxValue=null,i.getMinValue=null,i.setValue=null,i.getValue=null,i.showItem=null,i.hideItem=null,i.isVisible=null}"separator"==e&&(i.obj.onselectstart=null,i.obj.idd=null,i.obj.parentNode.removeChild(i.obj),i.obj=null,i.id=null,i.type=null,i.showItem=null,i.hideItem=null,i.isVisible=null),"text"==e&&(i.obj.onselectstart=null,i.obj.idd=null,i.obj.parentNode.removeChild(i.obj),i.obj=null,i.id=null,i.type=null,i.showItem=null,i.hideItem=null,i.isVisible=null,i.setWidth=null,i.setItemText=null,i.getItemText=null),e=null,i=null,this.objPull[t]=null,delete this.objPull[t]},function(){for(var t="addListOption,removeListOption,showListOption,hideListOption,isListOptionVisible,enableListOption,disableListOption,isListOptionEnabled,setListOptionPosition,getListOptionPosition,setListOptionText,getListOptionText,setListOptionToolTip,getListOptionToolTip,setListOptionImage,getListOptionImage,clearListOptionImage,forEachListOption,getAllListOptions,setListOptionSelected,getListOptionSelected".split(","),e=function(t){return function(e,i,o,s,n,l){return e=this.idPrefix+e,null!=this.objPull[e]&&"buttonSelect"==this.objPull[e].type?this.objPull[e][t].call(this.objPull[e],i,o,s,n,l):void 0}},i=0;i<t.length;i++){var o=t[i];dhtmlXToolbarObject.prototype[o]=e(o)}}(),dhtmlXToolbarObject.prototype._rtlParseBtn=function(t,e){return t+e},dhtmlXToolbarObject.prototype._separatorObject=function(t,e,i){return this.id=t.idPrefix+e,this.obj=document.createElement("DIV"),this.obj.className="dhx_toolbar_sep",this.obj.style.display=null!=i.hidden?"none":"",this.obj.idd=String(e),this.obj.title=i.title||"",this.obj.onselectstart=function(t){t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1},this.obj.ontouchstart=function(t){return t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1,t.cancelBubble=!0,!1},t.base.appendChild(this.obj),this.showItem=function(){this.obj.style.display=""},this.hideItem=function(){this.obj.style.display="none"},this.isVisible=function(){return""==this.obj.style.display},this},dhtmlXToolbarObject.prototype._textObject=function(t,e,i){return this.id=t.idPrefix+e,this.obj=document.createElement("DIV"),this.obj.className="dhx_toolbar_text",this.obj.style.display=null!=i.hidden?"none":"",this.obj.idd=String(e),this.obj.title=i.title||"",this.obj.onselectstart=function(t){t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1},this.obj.ontouchstart=function(t){return t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1,t.cancelBubble=!0,!1},this.obj.innerHTML=i.text||"",t.base.appendChild(this.obj),this.showItem=function(){this.obj.style.display=""},this.hideItem=function(){this.obj.style.display="none"},this.isVisible=function(){return""==this.obj.style.display},this.setItemText=function(t){this.obj.innerHTML=t},this.getItemText=function(){return this.obj.innerHTML},this.setWidth=function(t){this.obj.style.width=t+"px"},this.setItemToolTip=function(t){this.obj.title=t},this.getItemToolTip=function(){return this.obj.title},this},dhtmlXToolbarObject.prototype._buttonObject=function(t,e,i){this.id=t.idPrefix+e,this.state=null!=i.enabled?!1:!0,this.imgEn=i.img||"",this.imgDis=i.imgdis||"",this.img=this.state?""!=this.imgEn?this.imgEn:"":""!=this.imgDis?this.imgDis:"",this.obj=document.createElement("DIV"),this.obj.className="dhx_toolbar_btn dhxtoolbar_btn_"+(this.state?"def":"dis"),this.obj.style.display=null!=i.hidden?"none":"",this.obj.allowClick=!1,this.obj.extAction=i.action||null,this.obj.renderAs=this.obj.className,this.obj.idd=String(e),this.obj.title=i.title||"",this.obj.pressed=!1;var o=t.conf.icons_css?"<i class='"+t.conf.icons_path+this.img+"'></i>":"<img src='"+t.conf.icons_path+this.img+"'>";this.obj.innerHTML=t._rtlParseBtn(""!=this.img?o:"",null!=i.text?"<div class='dhxtoolbar_text'>"+i.text+"</div>":""),t.base.appendChild(this.obj),window.dhx4.isIE&&(this.obj.onselectstart=function(t){return t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1,!1});var s=this;return this._doOnMouseOver=function(t){t=t||event,0!=s.state&&1!=s.obj.pressed&&1!=s.obj.over&&(null==s.obj.className.match(/dhxtoolbar_btn_over/gi)&&(s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_over"),s.obj.over=!0)},this._doOnMouseOut=function(t){t=t||event,0!=s.state&&(null!=s.obj.className.match(/dhxtoolbar_btn_over/gi)&&(s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_def"),s.obj.over=s.obj.pressed=!1)},this._doOnMouseDown=function(e){if(e=e||event,"touchstart"==e.type){if(e.preventDefault&&e.preventDefault(),e.cancelBubble=!0,null!=t.conf.touch_id&&t.conf.touch_id!=s.id)return;t.conf.touch_id=s.id}0!=s.state&&(null==s.obj.className.match(/dhxtoolbar_btn_pres/gi)&&(s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_pres"),s.obj.pressed=!0)},this._doOnMouseUp=function(e){e=e||event,"touchend"==e.type&&(e.preventDefault&&e.preventDefault(),e.cancelBubble=!0,t.conf.touch_id==s.id&&(t.conf.touch_id=null)),0!=s.state&&0!=s.obj.pressed&&(null!=s.obj.className.match(/dhxtoolbar_btn_pres/gi)&&(s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_"+(s.obj.over?"over":"def")),s.obj.pressed=!1,s.obj.extAction&&window.setTimeout(function(){try{s&&s.obj&&window[s.obj.extAction](s.id)}catch(t){}},1),t.callEvent("onClick",[s.obj.idd.replace(t.idPrefix,"")]))},this.obj.evs={mouseover:"_doOnMouseOver",mouseout:"_doOnMouseOut",mousedown:"_doOnMouseDown",mouseup:"_doOnMouseUp",touchstart:"_doOnMouseDown",touchend:"_doOnMouseUp"},t._evs.add.apply(this,[this.obj.evs,this.obj]),this.enableItem=function(){t._enableItem(this)},this.disableItem=function(){t._disableItem(this)},this.isEnabled=function(){return this.state},this.showItem=function(){this.obj.style.display=""},this.hideItem=function(){this.obj.style.display="none"},this.isVisible=function(){return""==this.obj.style.display},this.setItemText=function(e){t._setItemText(this,e)},this.getItemText=function(){return t._getItemText(this)},this.setItemImage=function(e){t._setItemImage(this,e,!0)},this.clearItemImage=function(){t._clearItemImage(this,!0)},this.setItemImageDis=function(e){t._setItemImage(this,e,!1)},this.clearItemImageDis=function(){t._clearItemImage(this,!1)},this.setItemToolTip=function(t){this.obj.title=t},this.getItemToolTip=function(){return this.obj.title},this},dhtmlXToolbarObject.prototype._buttonSelectObject=function(t,e,i){this.id=t.idPrefix+e,this.state=null!=i.enabled?"true"==i.enabled?!0:!1:!0,this.imgEn=i.img||"",this.imgDis=i.imgdis||"",this.img=this.state?""!=this.imgEn?this.imgEn:"":""!=this.imgDis?this.imgDis:"",this.mode=i.mode||"button","select"==this.mode?(this.openAll=!0,this.renderSelect=!1,i.text&&0!=i.text.length||(i.text="&nbsp;")):(this.openAll=1==window.dhx4.s2b(i.openAll),this.renderSelect=null==i.renderSelect?!0:window.dhx4.s2b(i.renderSelect)),this.maxOpen=isNaN(i.maxOpen?i.maxOpen:"")?null:i.maxOpen,this._maxOpenTest=function(){if(!isNaN(this.maxOpen)&&!t._sbw){var e=document.createElement("DIV");e.className="dhxtoolbar_maxopen_test",document.body.appendChild(e);var i=document.createElement("DIV");i.className="dhxtoolbar_maxopen_test2",e.appendChild(i),t._sbw=e.offsetWidth-i.offsetWidth,e.removeChild(i),i=null,document.body.removeChild(e),e=null}},this._maxOpenTest(),this.obj=document.createElement("DIV"),this.obj.allowClick=!1,this.obj.extAction=i.action||null,this.obj.className="dhx_toolbar_btn dhxtoolbar_btn_"+(this.state?"def":"dis"),this.obj.style.display=null!=i.hidden?"none":"",this.obj.renderAs=this.obj.className,this.obj.onselectstart=function(t){t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1},this.obj.idd=String(e),this.obj.title=i.title||"",this.obj.pressed=!1,this.callEvent=!1;var o=t.conf.icons_css?"<i class='"+t.conf.icons_path+this.img+"'></i>":"<img src='"+t.conf.icons_path+this.img+"'>";this.obj.innerHTML=t._rtlParseBtn(""!=this.img?o:"",null!=i.text?"<div class='dhxtoolbar_text'>"+i.text+"</div>":""),t.base.appendChild(this.obj),this.arw=document.createElement("DIV"),this.arw.className="dhx_toolbar_arw dhxtoolbar_btn_"+(this.state?"def":"dis"),this.arw.style.display=this.obj.style.display,this.arw.innerHTML="<div class='arwimg'>&nbsp;</div>",this.arw.title=this.obj.title,this.arw.onselectstart=function(t){t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1},t.base.appendChild(this.arw);var s=this;if(window.dhx4.isIE&&(this.arw.onselectstart=this.obj.onselectstart=function(t){return t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1,!1}),this._doOnMouseOver=function(e){e=e||event,0!=s.state&&1!=s.obj.over&&t.anyUsed!=s.obj.idd&&(null==s.obj.className.match(/dhxtoolbar_btn_over/gi)&&(s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_over",s.arw.className="dhx_toolbar_arw dhxtoolbar_btn_over"),s.obj.over=!0)},this._doOnMouseOut=function(e){e=e||event,0!=s.state&&t.anyUsed!=s.obj.idd&&t.anyUsed!=s.obj.idd&&(null!=s.obj.className.match(/dhxtoolbar_btn_over/gi)&&(s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_def",s.arw.className="dhx_toolbar_arw dhxtoolbar_btn_def"),s.obj.over=s.obj.pressed=!1)},this._doOnMouseDown=function(e){if(e=e||event,"touchstart"==e.type){if(e.preventDefault&&e.preventDefault(),e.cancelBubble=!0,null!=t.conf.touch_id&&t.conf.touch_id!=s.id)return;t.conf.touch_id=s.id}if(0!=s.state)if(t.anyUsed==s.obj.idd)1==s.obj.over?(s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_over",s.arw.className="dhx_toolbar_arw dhxtoolbar_btn_over"):(s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_def",s.arw.className="dhx_toolbar_arw dhxtoolbar_btn_def"),s._hidePoly(!0),t.anyUsed=null;else{var i=e.target||e.srcElement;1==s.openAll||i==s.arw||i.parentNode==s.arw?("touchstart"==e.type&&(s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_over"),s.arw.className="dhx_toolbar_arw dhxtoolbar_btn_pres",s.arw._skip=!0,s._showPoly(!0),t.anyUsed=s.obj.idd):(null==s.obj.className.match(/dhxtoolbar_btn_pres/gi)&&(s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_pres",s.arw.className="dhx_toolbar_arw dhxtoolbar_btn_pres"),s.obj.pressed=!0)}},this._doOnMouseUp=function(i){if(i=i||event,"touchend"==i.type){if(""==s.polygon.style.display)return;i.preventDefault&&i.preventDefault(),i.cancelBubble=!0,t.conf.touch_id==s.id&&(t.conf.touch_id=null)}if(0!=s.state&&0!=s.obj.pressed){if(null!=s.obj.className.match(/dhxtoolbar_btn_pres/gi)&&(s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_"+(s.obj.over?"over":"def"),s.arw.className="dhx_toolbar_arw dhxtoolbar_btn_"+(s.obj.over?"over":"def")),this.extAction){var o=this;window.setTimeout(function(){try{window[o.extAction](e)}catch(t){}o=null},1)}t.callEvent("onClick",[s.obj.idd.replace(t.idPrefix,"")])}},this.arw.evs={mouseover:"_doOnMouseOver",mouseout:"_doOnMouseOut",mousedown:"_doOnMouseDown",touchstart:"_doOnMouseDown"},t._evs.add.apply(this,[this.arw.evs,this.arw]),this.obj.evs={mouseover:"_doOnMouseOver",mouseout:"_doOnMouseOut",mousedown:"_doOnMouseDown",mouseup:"_doOnMouseUp",touchstart:"_doOnMouseDown",touchend:"_doOnMouseUp"},t._evs.add.apply(this,[this.obj.evs,this.obj]),this._showPoly=function(e){if(null!=t.anyUsed&&"buttonSelect"==t.objPull[t.idPrefix+t.anyUsed].type){var i=t.objPull[t.idPrefix+t.anyUsed];"none"!=i.polygon.style.display&&(i.obj.className="dhx_toolbar_btn dhxtoolbar_btn_def",i.arw.className="dhx_toolbar_arw dhxtoolbar_btn_def",i.obj.over=!1,window.dhx4.zim.clear(i.polygon._idd),i.polygon.style.display="none",i.polygon._ie6cover&&(i.polygon._ie6cover.style.display="none"),"dhx_terrace"==t.conf.skin&&t._improveTerraceButtonSelect(i.id,!0),t.callEvent("onButtonSelectHide",[i.obj.idd]))}this.polygon.style.top="0px",this.polygon.style.visibility="hidden",this.polygon.style.zIndex=window.dhx4.zim.reserve(this.polygon._idd),this.polygon.style.display="","dhx_terrace"==t.conf.skin&&t._improveTerraceButtonSelect(this.id,!1),this._fixMaxOpenHeight(this.maxOpen||null),t._autoDetectVisibleArea();var o=window.dhx4.absTop(this.obj)+this.obj.offsetHeight+t.conf.sel_ofs_y,s=this.polygon.offsetHeight;if(o+s>t.tY2){var n=null!=this.maxOpen?Math.floor((t.tY2-o)/22):0;n>=1?this._fixMaxOpenHeight(n):(o=window.dhx4.absTop(this.obj)-s-t.conf.sel_ofs_y,0>o&&(o=0))}if(this.polygon.style.top=o+"px",t.rtl)this.polygon.style.left=window.dhx4.absLeft(this.obj)+this.obj.offsetWidth-this.polygon.offsetWidth+t.conf.sel_ofs_x+"px";else{var l=document.body.scrollLeft,a=l+(window.innerWidth||document.body.clientWidth),h=window.dhx4.absLeft(this.obj)+t.conf.sel_ofs_x;h+this.polygon.offsetWidth>a&&(h=window.dhx4.absLeft(this.arw)+this.arw.offsetWidth-this.polygon.offsetWidth),this.polygon.style.left=Math.max(h,5)+"px"}this.polygon.style.visibility="visible",this.polygon._ie6cover&&(this.polygon._ie6cover.style.left=this.polygon.style.left,this.polygon._ie6cover.style.top=this.polygon.style.top,this.polygon._ie6cover.style.width=this.polygon.offsetWidth+"px",this.polygon._ie6cover.style.height=this.polygon.offsetHeight+"px",this.polygon._ie6cover.style.display=""),e&&t.callEvent("onButtonSelectShow",[this.obj.idd])},this._hidePoly=function(e){window.dhx4.zim.clear(this.polygon._idd),this.polygon.style.display="none",this.polygon._ie6cover&&(this.polygon._ie6cover.style.display="none"),"dhx_terrace"==t.conf.skin&&t._improveTerraceButtonSelect(this.id,!0),e&&t.callEvent("onButtonSelectHide",[this.obj.idd]),t.conf.touch_id=null},this.obj.iddPrefix=t.idPrefix,this._listOptions={},this._fixMaxOpenHeight=function(e){var i="auto",o=!1;if(null!==e){var n=0;for(var l in this._listOptions)n++;n>e?(this._ph=22*e,i=this._ph+"px"):o=!0}this.polygon.style.width="auto",this.polygon.style.height="auto",o||null==s.maxOpen||(this.polygon.style.width=this.p_tbl.offsetWidth+t._sbw+"px",this.polygon.style.height=i)},this._separatorButtonSelectObject=function(t,e,i){return this.obj={},this.obj.tr=document.createElement("TR"),this.obj.tr.className="tr_sep",this.obj.tr.onselectstart=function(t){return t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1,!1},this.obj.td=document.createElement("TD"),this.obj.td.colSpan="2",this.obj.td.className="td_btn_sep",this.obj.td.onselectstart=function(t){return t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1,!1},isNaN(i)?i=s.p_tbody.childNodes.length+1:1>i&&(i=1),i>s.p_tbody.childNodes.length?s.p_tbody.appendChild(this.obj.tr):s.p_tbody.insertBefore(this.obj.tr,s.p_tbody.childNodes[i-1]),this.obj.tr.appendChild(this.obj.td),this.obj.sep=document.createElement("DIV"),this.obj.sep.className="btn_sep",this.obj.sep.onselectstart=function(t){return t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1,!1},this.obj.td.appendChild(this.obj.sep),s._listOptions[t]=this.obj,this},this._buttonButtonSelectObject=function(e,i,o){var n=!0;"undefined"!=typeof i.enabled?n=window.dhx4.s2b(i.enabled):"undefined"!=typeof i.disabled&&(n=window.dhx4.s2b(i.disabled)),this.obj={},this.obj.tr=document.createElement("TR"),this.obj.tr.en=n,this.obj.tr.extAction=i.action||null,this.obj.tr._selected=null!=i.selected,this.obj.tr.className="tr_btn"+(this.obj.tr.en?this.obj.tr._selected&&s.renderSelect?" tr_btn_selected":"":" tr_btn_disabled"),this.obj.tr.onselectstart=function(t){return t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1,!1},this.obj.tr.idd=String(e),isNaN(o)?o=s.p_tbody.childNodes.length+1:1>o&&(o=1),o>s.p_tbody.childNodes.length?s.p_tbody.appendChild(this.obj.tr):s.p_tbody.insertBefore(this.obj.tr,s.p_tbody.childNodes[o-1]),this.obj.td_a=document.createElement("TD"),this.obj.td_a.className="td_btn_img",this.obj.td_a.onselectstart=function(t){
return t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1,!1},this.obj.td_b=document.createElement("TD"),this.obj.td_b.className="td_btn_txt",this.obj.td_b.onselectstart=function(t){return t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1,!1},t.rtl?(this.obj.tr.appendChild(this.obj.td_b),this.obj.tr.appendChild(this.obj.td_a)):(this.obj.tr.appendChild(this.obj.td_a),this.obj.tr.appendChild(this.obj.td_b)),null!=i.img?(1==t.conf.icons_css?this.obj.td_a.innerHTML="<i class='"+t.conf.icons_path+i.img+"'></i>":this.obj.td_a.innerHTML="<img class='btn_sel_img' src='"+t.conf.icons_path+i.img+"' border='0'>",this.obj.tr._img=i.img):this.obj.td_a.innerHTML="&nbsp;";var l=null!=i.text?i.text:i.itemText||"";return this.obj.td_b.innerHTML="<div class='btn_sel_text'>"+l+"</div>",this.obj.tr.onmouseover=function(t){t=t||event,null==t.type.match(/touch/)&&(!this.en||this._selected&&s.renderSelect||(this.className="tr_btn tr_btn_over"))},this.obj.tr.onmouseout=function(t){t=t||event,null==t.type.match(/touch/)&&this.en&&(this._selected&&s.renderSelect?-1==String(this.className).search("tr_btn_selected")&&(this.className="tr_btn tr_btn_selected"):this.className="tr_btn")},this.obj.tr.ontouchstart=this.obj.tr.onmousedown=function(t){t=t||event,null==this._etype&&(this._etype=t.type)},this.obj.tr.onclick=function(e){if(e=e||event,e.cancelBubble=!0,this.en){if(s.setListOptionSelected(this.idd.replace(t.idPrefix,"")),s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_def",s.arw.className="dhx_toolbar_arw dhxtoolbar_btn_def",s.obj.over=!1,null!=this._etype&&null==this._etype.match(/touch/))window.dhx4.zim.clear(s.polygon._idd),s.polygon.style.display="none",s.polygon._ie6cover&&(s.polygon._ie6cover.style.display="none");else{var i=s.polygon;window.setTimeout(function(){window.dhx4.zim.clear(i._idd),i.style.display="none",i=null},500)}this._etype=null,"dhx_terrace"==t.conf.skin&&t._improveTerraceButtonSelect(s.id,!0),t.anyUsed=null,t.conf.touch_id=null,t.callEvent("onButtonSelectHide",[s.obj.idd]);var o=this.idd.replace(t.idPrefix,"");if(this.extAction)try{window[this.extAction](o)}catch(e){}t.callEvent("onClick",[o])}},s._listOptions[e]=this.obj,this},this.polygon=document.createElement("DIV"),this.polygon.dir="ltr",this.polygon.style.display="none",this.polygon.className="dhx_toolbar_poly_"+t.conf.skin+" dhxtoolbar_icons_"+t.conf.iconSize+t.conf.cssShadow,this.polygon.onselectstart=function(t){t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1},this.polygon.onmousedown=function(t){t=t||event,t.cancelBubble=!0},this.polygon.style.overflowY="auto",this.polygon._idd=window.dhx4.newId(),this.polygon.ontouchstart=function(t){t=t||event,t.cancelBubble=!0},this.polygon.ontouchend=function(t){t=t||event,t.cancelBubble=!0},this.p_tbl=document.createElement("TABLE"),this.p_tbl.className="buttons_cont",this.p_tbl.cellSpacing="0",this.p_tbl.cellPadding="0",this.p_tbl.border="0",this.polygon.appendChild(this.p_tbl),this.p_tbody=document.createElement("TBODY"),this.p_tbl.appendChild(this.p_tbody),null!=i.options)for(var n=0;n<i.options.length;n++){var l="_"+(i.options[n].type||"")+"ButtonSelectObject";null==i.options[n].id&&(i.options[n].id=t._genStr(24)),"function"==typeof this[l]&&new this[l](i.options[n].id,i.options[n])}return document.body.appendChild(this.polygon),window.dhx4.isIE6&&(this.polygon._ie6cover=document.createElement("IFRAME"),this.polygon._ie6cover.frameBorder=0,this.polygon._ie6cover.style.position="absolute",this.polygon._ie6cover.style.border="none",this.polygon._ie6cover.style.backgroundColor="#000000",this.polygon._ie6cover.style.filter="alpha(opacity=100)",this.polygon._ie6cover.style.display="none",this.polygon._ie6cover.setAttribute("src","javascript:false;"),document.body.appendChild(this.polygon._ie6cover)),this.setWidth=function(t){this.obj.style.width=t-this.arw.offsetWidth+"px",this.polygon.style.width=this.obj.offsetWidth+this.arw.offsetWidth-2+"px",this.p_tbl.style.width=this.polygon.style.width},this.enableItem=function(){t._enableItem(this)},this.disableItem=function(){t._disableItem(this)},this.isEnabled=function(){return this.state},this.showItem=function(){this.obj.style.display="",this.arw.style.display=""},this.hideItem=function(){this.obj.style.display="none",this.arw.style.display="none"},this.isVisible=function(){return""==this.obj.style.display},this.setItemText=function(e){t._setItemText(this,e)},this.getItemText=function(){return t._getItemText(this)},this.setItemImage=function(e){t._setItemImage(this,e,!0)},this.clearItemImage=function(){t._clearItemImage(this,!0)},this.setItemImageDis=function(e){t._setItemImage(this,e,!1)},this.clearItemImageDis=function(){t._clearItemImage(this,!1)},this.setItemToolTip=function(t){this.obj.title=t,this.arw.title=t},this.getItemToolTip=function(){return this.obj.title},this.addListOption=function(t,e,i,o,s){if("button"==i||"separator"==i){var n={id:t,type:i,text:o,img:s};new this["_"+i+"ButtonSelectObject"](t,n,e)}},this.removeListOption=function(t){if(this._isListButton(t,!0)){var e=this._listOptions[t];if(null!=e.td_a&&null!=e.td_b){for(e.td_a.onselectstart=null,e.td_b.onselectstart=null;e.td_a.childNodes.length>0;)e.td_a.removeChild(e.td_a.childNodes[0]);for(;e.td_b.childNodes.length>0;)e.td_b.removeChild(e.td_b.childNodes[0]);for(e.tr.onselectstart=null,e.tr.onmouseover=null,e.tr.onmouseout=null,e.tr.onclick=null,e.tr.ontouchstart=null,e.tr.onmousedown=null;e.tr.childNodes.length>0;)e.tr.removeChild(e.tr.childNodes[0]);e.tr.parentNode.removeChild(e.tr),e.td_a=null,e.td_b=null,e.tr=null}else{for(e.sep.onselectstart=null,e.td.onselectstart=null,e.tr.onselectstart=null;e.td.childNodes.length>0;)e.td.removeChild(e.td.childNodes[0]);for(;e.tr.childNodes.length>0;)e.tr.removeChild(e.tr.childNodes[0]);e.tr.parentNode.removeChild(e.tr),e.sep=null,e.td=null,e.tr=null}e=null,this._listOptions[t]=null;try{delete this._listOptions[t]}catch(i){}}},this.showListOption=function(t){this._isListButton(t,!0)&&(this._listOptions[t].tr.style.display="")},this.hideListOption=function(t){this._isListButton(t,!0)&&(this._listOptions[t].tr.style.display="none")},this.isListOptionVisible=function(t){return this._isListButton(t,!0)?"none"!=this._listOptions[t].tr.style.display:void 0},this.enableListOption=function(e){this._isListButton(e)&&(this._listOptions[e].tr.en=!0,this._listOptions[e].tr.className="tr_btn"+(this._listOptions[e].tr._selected&&t.renderSelect?" tr_btn_selected":""))},this.disableListOption=function(t){this._isListButton(t)&&(this._listOptions[t].tr.en=!1,this._listOptions[t].tr.className="tr_btn tr_btn_disabled")},this.isListOptionEnabled=function(t){return this._isListButton(t)?this._listOptions[t].tr.en:void 0},this.setListOptionPosition=function(t,e){if(this._listOptions[t]&&this.getListOptionPosition(t)!=e&&!isNaN(e)){1>e&&(e=1);var i=this._listOptions[t].tr;this.p_tbody.removeChild(i),e>this.p_tbody.childNodes.length?this.p_tbody.appendChild(i):this.p_tbody.insertBefore(i,this.p_tbody.childNodes[e-1]),i=null}},this.getListOptionPosition=function(t){var e=-1;if(!this._listOptions[t])return e;for(var i=0;i<this.p_tbody.childNodes.length;i++)this.p_tbody.childNodes[i]==this._listOptions[t].tr&&(e=i+1);return e},this.setListOptionImage=function(e,i){if(this._isListButton(e)){var o=this._listOptions[e].tr.childNodes[t.rtl?1:0];o.innerHTML=t.conf.icons_css?"<i class='"+t.conf.icons_path+i+"'></i>":"<img src='"+t.conf.icons_path+i+"' class='btn_sel_img'>",o=null}},this.getListOptionImage=function(e){if(this._isListButton(e)){var i=this._listOptions[e].tr.childNodes[t.rtl?1:0],o=null;return i.childNodes.length>0&&(o=i.childNodes[0][t.conf.icons_css?"className":"src"]),i=null,o}},this.clearListOptionImage=function(e){if(this._isListButton(e)){for(var i=this._listOptions[e].tr.childNodes[t.rtl?1:0];i.childNodes.length>0;)i.removeChild(i.childNodes[0]);i.innerHTML="&nbsp;",i=null}},this.setListOptionText=function(e,i){this._isListButton(e)&&(this._listOptions[e].tr.childNodes[t.rtl?0:1].childNodes[0].innerHTML=i)},this.getListOptionText=function(e){return this._isListButton(e)?this._listOptions[e].tr.childNodes[t.rtl?0:1].childNodes[0].innerHTML:void 0},this.setListOptionToolTip=function(t,e){this._isListButton(t)&&(this._listOptions[t].tr.title=e)},this.getListOptionToolTip=function(t){return this._isListButton(t)?this._listOptions[t].tr.title:void 0},this.forEachListOption=function(t){for(var e in this._listOptions)t(e)},this.getAllListOptions=function(){var t=new Array;for(var e in this._listOptions)t[t.length]=e;return t},this.setListOptionSelected=function(t){for(var e in this._listOptions){var i=this._listOptions[e];null!=i.td_a&&null!=i.td_b&&i.tr.en&&(e==t?(i.tr._selected=!0,i.tr.className="tr_btn"+(this.renderSelect?" tr_btn_selected":""),"select"==this.mode&&(i.tr._img?this.setItemImage(i.tr._img):this.clearItemImage(),this.setItemText(this.getListOptionText(t)))):(i.tr._selected=!1,i.tr.className="tr_btn")),i=null}},this.getListOptionSelected=function(){var t=null;for(var e in this._listOptions)1==this._listOptions[e].tr._selected&&(t=e);return t},this._isListButton=function(t,e){return null==this._listOptions[t]?!1:e||"tr_sep"!=this._listOptions[t].tr.className?!0:!1},this.setMaxOpen=function(t){return this._ph=null,"number"==typeof t?(this.maxOpen=t,void this._maxOpenTest()):void(this.maxOpen=null)},i.width&&this.setWidth(i.width),"select"==this.mode&&"undefined"!=typeof i.selected&&this.setListOptionSelected(i.selected),this},dhtmlXToolbarObject.prototype._buttonInputObject=function(t,e,i){this.id=t.idPrefix+e,this.obj=document.createElement("DIV"),this.obj.className="dhx_toolbar_btn dhxtoolbar_btn_def",this.obj.style.display=null!=i.hidden?"none":"",this.obj.idd=String(e),this.obj.w=null!=i.width?i.width:100,this.obj.title=null!=i.title?i.title:"",this.obj.innerHTML="<input class='dhxtoolbar_input' type='text' style='width:"+this.obj.w+"px;'"+(null!=i.value?" value='"+i.value+"'":"")+">";var o=t,s=this;return this.obj.childNodes[0].onkeydown=function(t){t=t||event,13==t.keyCode&&o.callEvent("onEnter",[s.obj.idd,this.value])},t.base.appendChild(this.obj),this.enableItem=function(){this.obj.childNodes[0].disabled=!1},this.disableItem=function(){this.obj.childNodes[0].disabled=!0},this.isEnabled=function(){return!this.obj.childNodes[0].disabled},this.showItem=function(){this.obj.style.display=""},this.hideItem=function(){this.obj.style.display="none"},this.isVisible=function(){return"none"!=this.obj.style.display},this.setValue=function(t){this.obj.childNodes[0].value=t},this.getValue=function(){return this.obj.childNodes[0].value},this.setWidth=function(t){this.obj.w=t,this.obj.childNodes[0].style.width=this.obj.w+"px"},this.getWidth=function(){return this.obj.w},this.setItemToolTip=function(t){this.obj.title=t},this.getItemToolTip=function(){return this.obj.title},this.getInput=function(){return this.obj.firstChild},"undefined"!=typeof i.enabled&&0==window.dhx4.s2b(i.enabled)&&this.disableItem(),this},dhtmlXToolbarObject.prototype._buttonTwoStateObject=function(t,e,i){this.id=t.idPrefix+e,this.state=null!=i.enabled?!1:!0,this.imgEn=null!=i.img?i.img:"",this.imgDis=null!=i.imgdis?i.imgdis:"",this.img=this.state?""!=this.imgEn?this.imgEn:"":""!=this.imgDis?this.imgDis:"",this.obj=document.createElement("DIV"),this.obj.pressed=null!=i.selected,this.obj.extAction=i.action||null,this.obj.className="dhx_toolbar_btn dhxtoolbar_btn_"+(this.obj.pressed?"pres"+(this.state?"":"_dis"):this.state?"def":"dis"),this.obj.style.display=null!=i.hidden?"none":"",this.obj.renderAs=this.obj.className,this.obj.idd=String(e),this.obj.title=i.title||"",this.obj.pressed&&(this.obj.renderAs="dhx_toolbar_btn dhxtoolbar_btn_over");var o=t.conf.icons_css?"<i class='"+t.conf.icons_path+this.img+"'></i>":"<img src='"+t.conf.icons_path+this.img+"'>";this.obj.innerHTML=t._rtlParseBtn(""!=this.img?o:"",null!=i.text?"<div class='dhxtoolbar_text'>"+i.text+"</div>":""),t.base.appendChild(this.obj),window.dhx4.isIE&&(this.obj.onselectstart=function(t){return t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1,!1});var s=this;return this._doOnMouseOver=function(t){t=t||event,0!=s.state&&1!=s.obj.over&&(1!=s.obj.pressed&&null==s.obj.className.match(/dhxtoolbar_btn_over/gi)&&(s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_over"),s.obj.over=!0)},this._doOnMouseOut=function(t){t=t||event,0!=s.state&&(1!=s.obj.pressed&&null!=s.obj.className.match(/dhxtoolbar_btn_over/gi)&&(s.obj.className="dhx_toolbar_btn dhxtoolbar_btn_def"),s.obj.over=!1)},this._doOnMouseDown=function(e){if(e=e||event,"touchstart"==e.type){if(e.preventDefault&&e.preventDefault(),e.cancelBubble=!0,null!=t.conf.touch_id&&t.conf.touch_id!=s.id)return;t.conf.touch_id=s.id}if(0!=s.state&&t.callEvent("onBeforeStateChange",[s.obj.idd.replace(t.idPrefix,""),s.obj.pressed])===!0){s.obj.pressed=!s.obj.pressed,s.obj.className="dhx_toolbar_btn "+(1==s.obj.pressed?"dhxtoolbar_btn_pres":1==s.obj.over?"dhxtoolbar_btn_over":"dhxtoolbar_btn_def");var i=s.obj.idd.replace(t.idPrefix,"");if(s.obj.extAction)try{window[s.obj.extAction](idd,s.obj.pressed)}catch(e){}t.callEvent("onStateChange",[i,s.obj.pressed])}},this._doOnMouseUp=function(e){e=e||event,"touchend"==e.type&&(e.preventDefault&&e.preventDefault(),e.cancelBubble=!0,t.conf.touch_id==s.id&&(t.conf.touch_id=null))},this.obj.evs={mouseover:"_doOnMouseOver",mouseout:"_doOnMouseOut",mousedown:"_doOnMouseDown",touchstart:"_doOnMouseDown",touchend:"_doOnMouseUp"},t._evs.add.apply(this,[this.obj.evs,this.obj]),this.setItemState=function(e,i){if(this.obj.pressed!=e&&(1==e?(this.obj.pressed=!0,this.obj.className="dhx_toolbar_btn dhxtoolbar_btn_pres"+(this.state?"":"_dis")):(this.obj.pressed=!1,this.obj.className="dhx_toolbar_btn dhxtoolbar_btn_"+(this.state?"def":"dis")),1==i)){var o=this.obj.idd.replace(t.idPrefix,"");if(this.obj.extAction)try{window[this.obj.extAction](o,this.obj.pressed)}catch(s){}t.callEvent("onStateChange",[o,this.obj.pressed])}},this.getItemState=function(){return this.obj.pressed},this.enableItem=function(){t._enableItem(this)},this.disableItem=function(){t._disableItem(this)},this.isEnabled=function(){return this.state},this.showItem=function(){this.obj.style.display=""},this.hideItem=function(){this.obj.style.display="none"},this.isVisible=function(){return""==this.obj.style.display},this.setItemText=function(e){t._setItemText(this,e)},this.getItemText=function(){return t._getItemText(this)},this.setItemImage=function(e){t._setItemImage(this,e,!0)},this.clearItemImage=function(){t._clearItemImage(this,!0)},this.setItemImageDis=function(e){t._setItemImage(this,e,!1)},this.clearItemImageDis=function(){t._clearItemImage(this,!1)},this.setItemToolTip=function(t){this.obj.title=t},this.getItemToolTip=function(){return this.obj.title},this},dhtmlXToolbarObject.prototype._sliderObject=function(t,e,i){this.id=t.idPrefix+e,this.state=null!=i.enabled?"true"==i.enabled?!0:!1:!0,this.obj=document.createElement("DIV"),this.obj.className="dhx_toolbar_btn dhxtoolbar_btn_"+(this.state?"def":"dis"),this.obj.style.display=null!=i.hidden?"none":"",this.obj.onselectstart=function(t){t=t||event,t.preventDefault?t.preventDefault():t.returnValue=!1},this.obj.idd=String(e),this.obj.len=null!=i.length?Number(i.length):50,this.obj.innerHTML="<div class='dhxtoolbar_text'>"+(i.textMin||"")+"</div><div class='dhxtoolbar_sl_bg_l'></div><div class='dhxtoolbar_sl_bg_m' style='width:"+this.obj.len+"px;'></div><div class='dhxtoolbar_sl_bg_r'></div><div class='dhxtoolbar_text'>"+(i.textMax||"")+"</div>",t.base.appendChild(this.obj);var o=this;this.pen=document.createElement("DIV"),this.pen.className="dhxtoolbar_sl_pen",this.obj.appendChild(this.pen);var s=this.pen;this.label=document.createElement("DIV"),this.label.dir="ltr",this.label.className="dhx_toolbar_slider_label_"+t.conf.skin+(t.rtl?"_rtl":""),this.label.style.display="none",this.label.tip=i.toolTip||"%v",this.label._zi=window.dhx4.newId(),document.body.appendChild(this.label);var n=this.label;return this.pen.valueMin=null!=i.valueMin?Number(i.valueMin):0,this.pen.valueMax=null!=i.valueMax?Number(i.valueMax):100,this.pen.valueMin>this.pen.valueMax&&(this.pen.valueMin=this.pen.valueMax),this.pen.valueNow=null!=i.valueNow?Number(i.valueNow):this.pen.valueMax,this.pen.valueNow>this.pen.valueMax&&(this.pen.valueNow=this.pen.valueMax),this.pen.valueNow<this.pen.valueMin&&(this.pen.valueNow=this.pen.valueMin),this.pen._detectLimits=function(){this.minX=o.obj.childNodes[1].offsetLeft+2,this.maxX=o.obj.childNodes[3].offsetLeft-this.offsetWidth+1},this.pen._detectLimits(),this.pen._definePos=function(){this.nowX=Math.round((this.valueNow-this.valueMin)*(this.maxX-this.minX)/(this.valueMax-this.valueMin)+this.minX),this.style.left=this.nowX+"px",this.newNowX=this.nowX},this.pen._definePos(),this.pen.initXY=0,this.pen.allowMove=!1,this.pen[window.dhx4.isIPad?"ontouchstart":"onmousedown"]=function(t){0!=o.state&&(t=t||event,this.initXY=window.dhx4.isIPad?t.touches[0].clientX:t.clientX,this.newValueNow=this.valueNow,this.allowMove=!0,this.className="dhxtoolbar_sl_pen dhxtoolbar_over",""!=n.tip&&(n.style.visibility="hidden",n.style.display="",n.innerHTML=n.tip.replace("%v",this.valueNow),n.style.left=Math.round(window.dhx4.absLeft(this)+this.offsetWidth/2-n.offsetWidth/2)+"px",n.style.top=window.dhx4.absTop(this)-n.offsetHeight-3+"px",n.style.visibility="",n.style.zIndex=window.dhx4.zim.reserve(n._zi)))},this.pen._doOnMouseMoveStart=function(t){if(t=t||event,s.allowMove){var e=window.dhx4.isIPad?t.touches[0].clientX:t.clientX,i=e-s.initXY;if(!(e<window.dhx4.absLeft(s)+Math.round(s.offsetWidth/2)&&s.nowX==s.minX||e>window.dhx4.absLeft(s)+Math.round(s.offsetWidth/2)&&s.nowX==s.maxX))return s.newNowX=s.nowX+i,s.newNowX<s.minX&&(s.newNowX=s.minX),s.newNowX>s.maxX&&(s.newNowX=s.maxX),s.nowX=s.newNowX,s.style.left=s.nowX+"px",s.initXY=e,s.newValueNow=Math.round((s.valueMax-s.valueMin)*(s.newNowX-s.minX)/(s.maxX-s.minX)+s.valueMin),""!=n.tip&&(n.innerHTML=n.tip.replace(/%v/gi,s.newValueNow),n.style.left=Math.round(window.dhx4.absLeft(s)+s.offsetWidth/2-n.offsetWidth/2)+"px",n.style.top=window.dhx4.absTop(s)-n.offsetHeight-3+"px"),t.cancelBubble=!0,t.preventDefault?t.preventDefault():t.returnValue=!1,!1}},this.pen._doOnMouseMoveEnd=function(){s.allowMove&&(s.className="dhxtoolbar_sl_pen",s.allowMove=!1,s.nowX=s.newNowX,s.valueNow=s.newValueNow,""!=n.tip&&(n.style.display="none",window.dhx4.zim.clear(n._zi)),t.callEvent("onValueChange",[o.obj.idd.replace(t.idPrefix,""),s.valueNow]))},window.dhx4.isIPad?(document.addEventListener("touchmove",s._doOnMouseMoveStart,!1),document.addEventListener("touchend",s._doOnMouseMoveEnd,!1)):"undefined"!=typeof window.addEventListener?(window.addEventListener("mousemove",s._doOnMouseMoveStart,!1),window.addEventListener("mouseup",s._doOnMouseMoveEnd,!1)):(document.body.attachEvent("onmousemove",s._doOnMouseMoveStart),document.body.attachEvent("onmouseup",s._doOnMouseMoveEnd)),this.enableItem=function(){this.state||(this.state=!0,this.obj.className="dhx_toolbar_btn dhxtoolbar_btn_def")},this.disableItem=function(){this.state&&(this.state=!1,this.obj.className="dhx_toolbar_btn dhxtoolbar_btn_dis")},this.isEnabled=function(){return this.state},this.showItem=function(){this.obj.style.display=""},this.hideItem=function(){this.obj.style.display="none"},this.isVisible=function(){return""==this.obj.style.display},this.setValue=function(e,i){e=Number(e),e<this.pen.valueMin&&(e=this.pen.valueMin),e>this.pen.valueMax&&(e=this.pen.valueMax),this.pen.valueNow=e,this.pen._definePos(),1==i&&t.callEvent("onValueChange",[this.obj.idd.replace(t.idPrefix,""),this.pen.valueNow])},this.getValue=function(){return this.pen.valueNow},this.setMinValue=function(t,e){t=Number(t),t>this.pen.valueMax||(this.obj.childNodes[0].innerHTML=e,this.obj.childNodes[0].style.display=e.length>0?"":"none",this.pen.valueMin=t,this.pen.valueNow<this.pen.valueMin&&(this.pen.valueNow=this.pen.valueMin),this.pen._detectLimits(),this.pen._definePos())},this.setMaxValue=function(t,e){t=Number(t),t<this.pen.valueMin||(this.obj.childNodes[4].innerHTML=e,this.obj.childNodes[4].style.display=e.length>0?"":"none",this.pen.valueMax=t,this.pen.valueNow>this.pen.valueMax&&(this.pen.valueNow=this.pen.valueMax),this.pen._detectLimits(),this.pen._definePos())},this.getMinValue=function(){var t=this.obj.childNodes[0].innerHTML,e=this.pen.valueMin;return new Array(e,t)},this.getMaxValue=function(){var t=this.obj.childNodes[4].innerHTML,e=this.pen.valueMax;return new Array(e,t)},this.setItemToolTipTemplate=function(t){this.label.tip=t},this.getItemToolTipTemplate=function(){return this.label.tip},this},dhtmlXToolbarObject.prototype.unload=function(){for("function"==typeof window.addEventListener?(window.removeEventListener("mousedown",this._doOnClick,!1),window.removeEventListener("touchstart",this._doOnClick,!1)):document.body.detachEvent("onmousedown",this._doOnClick),this._doOnClick=null,this.clearAll(),this.objPull=null,this._xmlLoader&&(this._xmlLoader.destructor(),this._xmlLoader=null);this.base.childNodes.length>0;)this.base.removeChild(this.base.childNodes[0]);for(this.cont.removeChild(this.base),this.base=null;this.cont.childNodes.length>0;)this.cont.removeChild(this.cont.childNodes[0]);this.cont.className="",this.cont=null,window.dhx4._enableDataLoading(this,null,null,null,"clear"),window.dhx4._eventable(this,"clear"),this.tX1=null,this.tX2=null,this.tY1=null,this.tY2=null,this.anyUsed=null,this.idPrefix=null,this.rootTypes=null,this._rtl=null,this._rtlParseBtn=null,this.setRTL=null,this._sbw=null,this._getObj=null,this._addImgObj=null,this._setItemImage=null,this._clearItemImage=null,this._setItemText=null,this._getItemText=null,this._enableItem=null,this._disableItem=null,this._xmlParser=null,this._addItemToStorage=null,this._genStr=null,this._addItem=null,this._getPosition=null,this._setPosition=null,this._getIdByPosition=null,this._separatorObject=null,this._textObject=null,this._buttonObject=null,this._buttonSelectObject=null,this._buttonInputObject=null,this._buttonTwoStateObject=null,this._sliderObject=null,this._autoDetectVisibleArea=null,this._removeItem=null,this.setAlign=null,this.setSkin=null,this.setIconsPath=null,this.setIconPath=null,this.loadXML=null,this.loadXMLString=null,this.clearAll=null,this.addSpacer=null,this.removeSpacer=null,this.getType=null,this.getTypeExt=null,this.inArray=null,this.getParentId=null,this.addButton=null,this.addText=null,this.addButtonSelect=null,this.addButtonTwoState=null,this.addSeparator=null,this.addSlider=null,this.addInput=null,this.forEachItem=null,this.showItem=null,this.hideItem=null,this.isVisible=null,this.enableItem=null,this.disableItem=null,this.isEnabled=null,this.setItemText=null,this.getItemText=null,this.setItemToolTip=null,this.getItemToolTip=null,this.setItemImage=null,this.setItemImageDis=null,this.clearItemImage=null,this.clearItemImageDis=null,this.setItemState=null,this.getItemState=null,this.setItemToolTipTemplate=null,this.getItemToolTipTemplate=null,this.setValue=null,this.getValue=null,this.setMinValue=null,this.getMinValue=null,this.setMaxValue=null,this.getMaxValue=null,this.setWidth=null,this.getWidth=null,this.getPosition=null,this.setPosition=null,this.removeItem=null,this.addListOption=null,this.removeListOption=null,this.showListOption=null,this.hideListOption=null,this.isListOptionVisible=null,this.enableListOption=null,this.disableListOption=null,this.isListOptionEnabled=null,this.setListOptionPosition=null,this.getListOptionPosition=null,this.setListOptionText=null,this.getListOptionText=null,this.setListOptionToolTip=null,this.getListOptionToolTip=null,this.setListOptionImage=null,this.getListOptionImage=null,this.clearListOptionImage=null,this.forEachListOption=null,this.getAllListOptions=null,this.setListOptionSelected=null,this.getListOptionSelected=null,this.unload=null,this.setUserData=null,this.getUserData=null,this.setMaxOpen=null,this.items=null,this.conf=null},dhtmlXToolbarObject.prototype._autoDetectVisibleArea=function(){var t=window.dhx4.screenDim();this.tX1=t.left,this.tX2=t.right,this.tY1=t.top,this.tY2=t.bottom},dhtmlXToolbarObject.prototype.setIconset=function(t){this.conf.icons_css="awesome"==t},dhtmlXToolbarObject.prototype._evs={add:function(t,e){for(var i in t)"function"==typeof window.addEventListener?e.addEventListener(i,this[t[i]],!1):null==i.match(/^touch/)&&e.attachEvent("on"+i,this[t[i]]);e=t=null},clear:function(t,e){for(var i in t)"function"==typeof window.addEventListener?e.removeEventListener(i,this[t[i]],!1):null==i.match(/^touch/)&&e.detachEvent("on"+i,this[t[i]]);e=t=null}},dhtmlXToolbarObject.prototype._initObj=function(t){for(var e=0;e<t.length;e++)this._addItemToStorage(t[e]);"dhx_terrace"==this.conf.skin&&this._improveTerraceSkin()},dhtmlXToolbarObject.prototype._xmlToJson=function(t){var e=[],i=t.getElementsByTagName("toolbar");if(null!=i&&null!=i[0]){i=i[0];for(var o=function(t){for(var e=null,i=0;i<t.childNodes.length;i++)if(null==e&&"itemText"==t.childNodes[i].tagName){e=window.dhx4._xmlNodeValue(t.childNodes[i]);break}return e},s=["id","type","hidden","title","text","enabled","img","imgdis","action","openAll","renderSelect","mode","maxOpen","width","value","selected","length","textMin","textMax","toolTip","valueMin","valueMax","valueNow"],n=["id","type","enabled","disabled","action","selected","img","text"],l=0;l<i.childNodes.length;l++)if("item"==i.childNodes[l].tagName){for(var a={},h=0;h<s.length;h++){var d=i.childNodes[l].getAttribute(s[h]);null!=d&&(a[s[h]]=d)}for(var r=0;r<i.childNodes[l].childNodes.length;r++){if("item"==i.childNodes[l].childNodes[r].tagName&&"buttonSelect"==a.type){for(var u={},h=0;h<n.length;h++){var d=i.childNodes[l].childNodes[r].getAttribute(n[h]);null!=d&&(u[n[h]]=d)}for(var c=i.childNodes[l].childNodes[r].getElementsByTagName("userdata"),h=0;h<c.length;h++){u.userdata||(u.userdata={});var b={};try{b.name=c[h].getAttribute("name")}catch(p){b.name=null}try{b.value=c[h].firstChild.nodeValue}catch(p){b.value=""}null!=b.name&&(u.userdata[b.name]=b.value)}u.text=o(i.childNodes[l].childNodes[r])||u.text,null==a.options&&(a.options=[]),a.options.push(u)}if("userdata"==i.childNodes[l].childNodes[r].tagName){null==a.userdata&&(a.userdata={});var u={};try{u.name=i.childNodes[l].childNodes[r].getAttribute("name")}catch(p){u.name=null}try{u.value=i.childNodes[l].childNodes[r].firstChild.nodeValue}catch(p){u.value=""}null!=u.name&&(a.userdata[u.name]=u.value)}}a.text=o(i.childNodes[l])||a.text,e.push(a)}o=null}return e},dhtmlXToolbarObject.prototype._addItemToStorage=function(t,e){var i=t.id||this._genStr(24),o=t.type||"";if("spacer"==o?this.addSpacer(this._lastId):this._lastId=i,""!=o&&null!=this["_"+o+"Object"]){if("buttonSelect"==o&&null!=t.options)for(var s=0;s<t.options.length;s++)"obj"==t.options[s].type&&(t.options[s].type="button"),"sep"==t.options[s].type&&(t.options[s].type="separator");if("slider"==o){var n={tip_template:"toolTip",value_min:"valueMin",value_max:"valueMax",value_now:"valueNow",text_min:"textMin",text_max:"textMax"};for(var l in n)null==t[n[l]]&&null!=t[l]&&(t[n[l]]=t[l])}"buttonInput"==o&&null==t.value&&null!=t.text&&(t.value=t.text),"buttonTwoState"==o&&"undefined"==typeof t.selected&&"undefined"!=typeof t.pressed&&window.dhx4.s2b(t.pressed)&&(t.selected=!0),"undefined"==typeof t.enabled&&"undefined"!=typeof t.disabled&&window.dhx4.s2b(t.disabled)&&(t.enabled=!1),null==t.imgDis&&null!=t.img_disabled&&(t.imgdis=t.img_disabled),"undefined"!=typeof t.openAll&&null!=t.openAll||"dhx_terrace"!=this.conf.skin||(t.openAll=!0),this.objPull[this.idPrefix+i]=new this["_"+o+"Object"](this,i,t),this.objPull[this.idPrefix+i].type=o,this.setPosition(i,e)}if(null!=t.userdata)for(var l in t.userdata)this.setUserData(i,l,t.userdata[l]);if(null!=t.options)for(var s=0;s<t.options.length;s++)if(null!=t.options[s].userdata)for(var l in t.options[s].userdata)this.setListOptionUserData(t.id,t.options[s].id,l,t.options[s].userdata[l])},dhtmlXToolbarObject.prototype.setSkin=function(t,e){e===!0?this.cont.className=this.cont.className.replace(/dhxtoolbar_icons_\d{1,}/,"dhxtoolbar_icons_"+this.conf.iconSize):(this.conf.skin=t,"dhx_skyblue"==this.conf.skin&&(this.conf.sel_ofs_y=1),"dhx_web"==this.conf.skin&&(this.conf.sel_ofs_y=1,this.conf.sel_ofs_x=1),"dhx_terrace"==this.conf.skin&&(this.conf.sel_ofs_y=-1,this.conf.sel_ofs_x=0),"material"==this.conf.skin&&(this.conf.sel_ofs_y=-1,this.conf.sel_ofs_x=0),this.cont.className="dhx_toolbar_"+this.conf.skin+" dhxtoolbar_icons_"+this.conf.iconSize+this.conf.cssShadow);for(var i in this.objPull){var o=this.objPull[i];"slider"==o.type&&(o.pen._detectLimits(),o.pen._definePos(),o.label.className="dhx_toolbar_slider_label_"+this.conf.skin),"buttonSelect"==o.type&&(o.polygon.className="dhx_toolbar_poly_"+this.conf.skin+" dhxtoolbar_icons_"+this.conf.iconSize+this.conf.cssShadow)}"dhx_terrace"==t&&this._improveTerraceSkin()},dhtmlXToolbarObject.prototype.setAlign=function(t){this.conf.align="right"==t?"right":"left",this.base.className="right"==t?"dhxtoolbar_float_right":"dhxtoolbar_float_left",this._spacer&&(this._spacer.className="right"==t?" dhxtoolbar_float_left":" dhxtoolbar_float_right")},dhtmlXToolbarObject.prototype.setIconSize=function(t){this.conf.iconSize={18:!0,24:!0,32:!0,48:!0}[t]?t:18,this.setSkin(this.conf.skin,!0),this.callEvent("_onIconSizeChange",[this.conf.iconSize])},dhtmlXToolbarObject.prototype.setIconsPath=function(t){this.conf.icons_path=t},dhtmlXToolbarObject.prototype.setUserData=function(t,e,i){t=this.idPrefix+t,null!=this.objPull[t]&&(null==this.objPull[t].userData&&(this.objPull[t].userData={}),this.objPull[t].userData[e]=i)},dhtmlXToolbarObject.prototype.getUserData=function(t,e){return t=this.idPrefix+t,null!=this.objPull[t]&&null!=this.objPull[t].userData?this.objPull[t].userData[e]||null:null},dhtmlXToolbarObject.prototype._isListOptionExists=function(t,e){if(null==this.objPull[this.idPrefix+t])return!1;var i=this.objPull[this.idPrefix+t];return"buttonSelect"!=i.type?!1:null==i._listOptions[e]?!1:!0},dhtmlXToolbarObject.prototype.setListOptionUserData=function(t,e,i,o){if(this._isListOptionExists(t,e)){var s=this.objPull[this.idPrefix+t]._listOptions[e];null==s.userData&&(s.userData={}),s.userData[i]=o}},dhtmlXToolbarObject.prototype.getListOptionUserData=function(t,e,i){if(!this._isListOptionExists(t,e))return null;var o=this.objPull[this.idPrefix+t]._listOptions[e];return o.userData&&o.userData[i]?o.userData[i]:null},dhtmlXToolbarObject.prototype._improveTerraceSkin=function(){null==this.conf.terrace_radius&&(this.conf.terrace_radius="3px");var t=[],e={separator:!0,text:!0},i=[this.base];null!=this._spacer&&i.push(this._spacer);for(var o=0;o<i.length;o++){t[o]=[];for(var s=0;s<i[o].childNodes.length;s++)if(null!=i[o].childNodes[s].idd&&"none"!=i[o].childNodes[s].style.display){var n=this.idPrefix+i[o].childNodes[s].idd;null!=this.objPull[n]&&this.objPull[n].obj==i[o].childNodes[s]&&t[o].push({a:n,type:this.objPull[n].type,node:this.objPull[n]["buttonSelect"==this.objPull[n].type?"arw":"obj"]})}i[o]=null}for(var o=0;o<t.length;o++)for(var s=0;s<t[o].length;s++){var l=t[o][s],a=!1,h=!1;e[l.type]||((s==t[o].length-1||null!=t[o][s+1]&&e[t[o][s+1].type])&&(a=!0),(0==s||s-1>=0&&null!=t[o][s-1]&&e[t[o][s-1].type])&&(h=!0)),l.node.style.borderRightWidth=a?"1px":"0px",l.node.style.borderTopRightRadius=l.node.style.borderBottomRightRadius=a?this.conf.terrace_radius:"0px","buttonSelect"==l.type?(l.node.previousSibling.style.borderTopLeftRadius=l.node.previousSibling.style.borderBottomLeftRadius=h?this.conf.terrace_radius:"0px",l.node.previousSibling._br=a,l.node.previousSibling._bl=h):l.node.style.borderTopLeftRadius=l.node.style.borderBottomLeftRadius=h?this.conf.terrace_radius:"0px",l.node._br=a,l.node._bl=h}for(var o=0;o<t.length;o++){for(var s=0;s<t[o].length;s++){for(var n in t[o][s])t[o][s][n]=null;t[o][s]=null}t[o]=null}t=i=null},dhtmlXToolbarObject.prototype._improveTerraceButtonSelect=function(t,e){
var i=this.objPull[t];1==e?(i.obj.style.borderBottomLeftRadius=i.obj._bl?this.conf.terrace_radius:"0px",i.arw.style.borderBottomRightRadius=i.obj._br?this.conf.terrace_radius:"0px"):(i.obj.style.borderBottomLeftRadius="0px",i.arw.style.borderBottomRightRadius="0px"),i=null},"undefined"!=typeof window.dhtmlXCellObject&&(dhtmlXCellObject.prototype._createNode_toolbar=function(t,e,i,o,s){return"undefined"!=typeof s?t=s:(t=document.createElement("DIV"),t.className="dhx_cell_toolbar_"+(this.conf.borders?"def":"no_borders"),t.appendChild(document.createElement("DIV")),t.firstChild.className="dhx_toolbar_base_18_dhx_skyblue"),this.cell.insertBefore(t,this.cell.childNodes[this.conf.idx.cont]),this.conf.ofs_nodes.t.toolbar=!0,this._updateIdx(),t},dhtmlXCellObject.prototype.attachToolbar=function(t){return null==this.dataNodes.ribbon&&null==this.dataNodes.toolbar?(this.callEvent("_onBeforeContentAttach",["toolbar"]),"undefined"==typeof t?t={}:"string"==typeof t&&(t={skin:t}),"undefined"==typeof t.skin&&(t.skin=this.conf.skin),t.parent=this._attachObject("toolbar").firstChild,this.dataNodes.toolbar=new dhtmlXToolbarObject(t),this._adjustCont(this._idd),this.dataNodes.toolbar._masterCell=this,this.dataNodes.toolbar.attachEvent("_onIconSizeChange",function(){this._masterCell._adjustCont()}),t.parent=null,t=null,this.callEvent("_onContentAttach",[]),this.dataNodes.toolbar):void 0},dhtmlXCellObject.prototype.detachToolbar=function(){null!=this.dataNodes.toolbar&&(this.dataNodes.toolbar._masterCell=null,"function"==typeof this.dataNodes.toolbar.unload&&this.dataNodes.toolbar.unload(),this.dataNodes.toolbar=null,delete this.dataNodes.toolbar,this._detachObject("toolbar"))},dhtmlXCellObject.prototype.showToolbar=function(){this._mtbShowHide("toolbar","")},dhtmlXCellObject.prototype.hideToolbar=function(){this._mtbShowHide("toolbar","none")},dhtmlXCellObject.prototype.getAttachedToolbar=function(){return this.dataNodes.toolbar});
