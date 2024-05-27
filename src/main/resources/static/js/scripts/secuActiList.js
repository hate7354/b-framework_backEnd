/**
 *	@desc: FuncSecuActiList constructor
 *	@param: none
 *	@return: pageWindow object
 *	@type: public
 */
function FuncSecuActiList() {
	var self = this;
	
	this.mapGridObj=new Map();
	this.mapGridData=new Map();
	this.activeTab='ALL';

	window.initSbdnYearAndSetEvt();
	
	// 전체년도 체크 박스 생성.
	const checkFrmData = [
		{type: "settings",position: "label-right"},
		{type: "checkbox",name: "ckbAllYear", value: "", label: "전체", checked: $("#ckbAllYearEx").val(), offsetTop: 2}
	];
	this.ckbAllYear = new dhtmlXForm("ckbAllYear", checkFrmData);
	window.onEvtChangeAllCheck(this.ckbAllYear);
	
	// 업무주기 설정
	$.commCodeSingle("JB000000", "JB001000", "srchEcrCycle", "dtl")
	this.cbWorkCycle = dhtmlXComboFromSelect("srchEcrCycle");
	this.cbWorkCycle.readonly(true);
	this.cbWorkCycle.setPlaceholder("업무주기 선택");
	this.cbWorkCycle.unSelectOption();
	this.cbWorkCycle.attachEvent("onFocus", function() {
		if ($('#workCycleWrap').width() != $('#srchEcrCycle').width()) {
			self.cbWorkCycle.setSize($('#workCycleWrap').width());
		}
	});

	// 배정현황 선택
	this.cbAssignYn = dhtmlXComboFromSelect("srchAssignYn");
	this.cbAssignYn.readonly(true);
	this.cbAssignYn.setPlaceholder("배정현황 선택");
	this.cbAssignYn.unSelectOption();
	this.cbAssignYn.attachEvent("onFocus", function() {
		if($('#assignYnWrap').width() != $('#srchAssignYn').width()) {
			self.cbAssignYn.setSize($('#assignYnWrap').width());
		}
	});

	// 법령,규정 검색구분
	this.cbCompType = dhtmlXComboFromSelect("selectSrchCompType");
	this.cbCompType.readonly(true);
	this.cbCompType.setPlaceholder("검색구분");
	this.cbCompType.unSelectOption();
	this.cbCompType.setSize(160); // 예외처리, 160px fixed.
	this.cbCompType.attachEvent("onFocus", function() {
		if($('#compTypeWrap').width() != $('#selectSrchCompType').width()) {
			self.cbCompType.setSize($('#compTypeWrap').width());
		}
	});

	this.cbCompType.attachEvent("onChange", function(value, text) {
		$('#srchCompInfo').children('input').val('');
	});

	// create grid control.
	this.mstGrid = new DHTMLX.Grid(
			"GridSecuWork", "N", (new Date()).valueOf(), null, null, null, 
			[{gridId:"activityList",menuId:"activityList",trnfType:1}], 
			[{clmId:'checkbox',clmNm:'#master_checkbox',clmType:'CHECKBOX',clmAlgn:'CENTER',clmWidth:'30'},
			 {clmId:'actiNm',clmNm:'보안업무명',clmType:'TEXT',clmAlgn:'LEFT',clmWidth:"*",clmOrder:'Y',sortSeq:1,clmClick:'Y'},
			 {clmId:'mappingCnt',clmNm:'법규 및 보안규정',clmType:'BUTTON',clmAlgn:'CENTER',clmWidth:'130'}, 
			 {clmId:'workCnt',clmNm:'진행현황상세',clmType:'BUTTON',clmAlgn:'CENTER',clmWidth:'150'}, 
			 {clmId:'workCycleNm',clmNm:'업무주기',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:'100'}, 
			 {clmId:'usrNms',clmNm:'담당자',clmType:'TEXT',clmAlgn:'LEFT',clmWidth:'150'}, 
			 {clmId:'assignBtn',clmNm:'배정처리',clmType:'BUTTON',clmAlgn:'CENTER',clmWidth:'80'}, 
			 {clmId:'modifyBtn',clmNm:'수정',clmType:'BUTTON',clmAlgn:'CENTER',clmWidth:'80'}, 
			 {clmId:'frstRegistNm',clmNm:'등록자',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:'100'}, 
			 {clmId:'actiId',clmNm:'보안업무아이디',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:'10',clmVisibl:'N'}, 
			 {clmId:'assignYn',clmNm:'배정여부',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:'10',clmVisibl:'N'}, 
			 {clmId:'assignBtnShow',clmNm:'배정버튼SHOW여부',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:'10',clmVisibl:'N'}, 
			 {clmId:'sbdnYear',clmNm:'적용년도',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:'10',clmVisibl:'N'}, 
			 {clmId:'ecrCycleNm',clmNm:'권장주기',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:'10',clmVisibl:'N'}, 
			 {clmId:'checkBoxDisable',clmNm:'체크박스비활성화',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:'10',clmVisibl:'N'}]
		);
			
	this.mstGrid.setLinkCallback(this.onEvtClickDetail);
	this.mstGrid.setPaging(15, 15);

	return this;	
	
};

/**
 *	@desc: pageWindow prototype
 *	@type: public
 */
FuncSecuActiList.prototype = {
	// @desc: initialize window
	onInitWindow: function() {
		secuActiList.onEvtClickBtnAssignAllProc();
		secuActiList.onEvtClickBtnCreate();
		secuActiList.onEvtClickBtnDeleteProc();
		secuActiList.onEvtClickBtnSearchProc();
		secuActiList.onEvtClickBtnExcelProc();
	
		// 초기 데이터 조회
		secuActiList._dataSearchAndLoad();
	},
	// @desc: 조회옵션 초기화 callback
	onSearchOptionReset: function() {
		secuActiList.cbCompType.unSelectOption();
		secuActiList.cbWorkCycle.unSelectOption();
		secuActiList.cbAssignYn.unSelectOption();
		$("#sendFrm #searchDtlArea input").val('');
		$("#selectSrchType").val('srchWorkUsrNm');
	},
	// @desc: 조회옵션 초기값 설정, 이전상태로 설정
	_initSearchOptions: function(param) {
		secuActiList.cbCompType.selectOption(
				secuActiList.cbCompType.getIndexByValue(param.selectSrchCompType)
			);
		secuActiList.cbWorkCycle.selectOption(
				secuActiList.cbWorkCycle.getIndexByValue(param.srchEcrCycle)
			);
		secuActiList.cbAssignYn.selectOption(
				secuActiList.cbAssignYn.getIndexByValue(param.srchAssignYn)
			);
	},
	// data search and load to grid
	_dataSearchAndLoad: function(param, pageNo) {
		if(typeof(param) == "undefined" || typeof(param) == "string") {
			param = $.getFormData("#sendFrm");
		}

		window.dataProc.ajaxJson("/selectActivList", param, function(query) {
			if (query.code != 0) {
				return;
			}

			secuActiList.mstGridData = query.data[0];

			const btnParam = [
				{ id: 'btnMappingView', label: '상세조회', callback: 'secuActiList.onEvtClickBtnMappingInfo', btnSwitch: true },
				{ id: 'btnActivityView', label: '업무진행현황', callback: 'secuWsecuActiListorkList.onEvtClickBtnDetailWork', btnSwitch: true },
				{ id: 'assignBtn', label: '배정', callback: 'secuActiList.onEvtClickBtnAssignProc', btnSwitch: true, colId: 'assignBtnShow', chkVal: 'Y', colId2: 'assignYn', chkVal2: 'N', text2: '배정불가' },
				{ id: 'modifyBtn', label: '수정', callback: 'secuActiList.onEvtClickBtnModify', btnSwitch: true, colId: 'delFlag', chkVal: 'Y' }
			];

			var chkBoxDisParam = [{ id: "checkBoxDisable", ind: 0, value: "Y" }];
			var disLinkParam = { compare: "assignYn", compareValue: "N", target: "workNm" };

			secuActiList.mstGrid.loadData(
					secuActiList.mstGridData, btnParam, chkBoxDisParam, null, null, disLinkParam);
			if (typeof(pageNo) == "number" || typeof(pageNo) == "string") {
				secuActiList.mstGrid._grid.changePage(pageNo);
				window.setTimeout(function() {
					secuActiList.mstGrid._grid.changePage(pageNo);
				});
			}
		});
	},
	// @desc: 연관 법규 및 규정 상세 화면 팝업
	onEvtClickBtnMappingInfo: function(obj, rowId) {
	},
	// @desc: 보안업무 연관 상세 활동 페이지로 이동
	onEvtClickBtnDetailWork: function(obj, rowId) {
	},
	// @desc: 배정 처리
	onEvtClickBtnAssignProc: function(obj, rowId) {
	},
	// @desc: 선택배정, 삭제기능 기준으로 체크박스 활성화/비활성화 처리를 하기 때문에
	//		    배정처리 모듈로 정보를 넘기기 전에 배정여부를 확인해야 한다.
	onEvtClickBtnAssignAllProc: function() {
	},
	// @desc: 보안업무 배정 처리
	_workAssignProc: function(activityIds) {
	},
	// @desc: 수정 페이지로 이동
	// 수정, 2023/06, 배정 플래그 전송
	onEvtClickBtnModify: function(obj, rowId) {
	},
	// @desc: 보안업무 상세화면 팝업
	onEvtClickDetail: function() {
		$("div#activityList .gridLink").off("click").on("click", function() {
			var rowId = $(this).attr("rId");
			var data = secuActiList.mstGrid.getData(rowId);
			const ind = secuActiList.mstGrid._grid.getRowIndex(rowId);

			const wndId = "actiDtlViewPop";
			const popupUrl = "work/popup/workDetail";
			const wndParam = [{
				popupId: "popup",
				id: wndId,
				width: 900,
				height: 800,
				text: "보안업무 상세 정보"
			}];
			window.dhtmlxWnd = new DHTMLX.Window("s_main", wndParam);
			window.dhtmlxWnd.params = { 
				actiId: data.actiId,
				actiNm: secuActiList.mstGridData[ind].actiNm,
				actiDesc: '보안업무 상세설명 부분입니다...'
			};
			window.dhtmlxWnd.loadUrl(wndId, popupUrl, true, {
				actiId: data.actiId,
				type: "history",
				initAcc: "baseInfo"
			});
			window.dhtmlxWnd.setModal(wndId, false);
			
			// javascript import
			
			window.setTimeout(function() {
				var script = document.createElement('script');
				script.src = '/js/scripts/popupWorkDetail.js';
				document.head.appendChild(script);		
			});	
		});
	},
	// @desc: 생성 페이지로 이동
	onEvtClickBtnCreate: function() {
	},
	// @desc: 삭제 버튼 이벤트 처리
	onEvtClickBtnDeleteProc: function() {
	},
	// @desc: 조회 버튼 이벤트 처리
	onEvtClickBtnSearchProc: function() {
		$("#searchBtn").off("click").on("click", function() {
			secuActiList._dataSearchAndLoad();
		});
	},
	// 조회된 데이터 엑셀 다운로드 이벤트
	onEvtClickBtnExcelProc: function() {
	},
	
};



/**
 * 보안업무 동적 처리 자바스크립트
 * 
 * @history: 2024.03, 최초작성
 */
(function() {
	window.secuActiList = new FuncSecuActiList();
	window.setTimeout(function() {
		window.secuActiList.onInitWindow();
	});
})();



