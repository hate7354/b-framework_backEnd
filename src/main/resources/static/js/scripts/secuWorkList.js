/**
 *	@desc: FuncSecuWorkList constructor
 *	@param: none
 *	@return: pageWindow object
 *	@type: public
 */
function FuncSecuWorkList() {
	let self=this;
	this.selfClear=function() {
		for (let c in self) {
			self[c] = null
	    } self=null;
	    window.secuWorkList=null;
		window.FuncSecuWorkList=null;
	};
	
	this.mstGridData=null; // search data stored

	// 전체년도 체크 박스 생성.
	const checkFrmData = [
		{type: "settings", position: "label-right"},
		{type: "checkbox", name: "ckbAllYear2", value: "", label: "전체", checked: $("#ckbAllYearEx").val(), offsetTop: 2 }
	];
	this.ckbAllYear = new dhtmlXForm("ckbAllYear2", checkFrmData);
	window.onEvtChangeAllCheck(this.ckbAllYear);
	
	// 법규,규정 검색구분
	this.cbCompType = dhtmlXComboFromSelect("selectSrchCompType");
	this.cbCompType.readonly(true);
	this.cbCompType.setPlaceholder("검색구분");
	this.cbCompType.unSelectOption();
	this.cbCompType.setSize(160); // 예외처리, 160px fixed.
	this.cbCompType.attachEvent("onFocus", function() {
		if ($('#compTypeWrap').width() != $('#selectSrchCompType').width()) {
			self.cbCompType.setSize($('#compTypeWrap').width());
		}
	});
	this.cbCompType.attachEvent("onChange", function(value, text) {
		$('#srchCompInfo').children('input').val('');
	});
	
	// 부서,담당자 검색구분
	this.cbHumanType = dhtmlXComboFromSelect("selectSrchType");
	this.cbHumanType.readonly(true);
	this.cbHumanType.setPlaceholder("부서/담당자 선택");
	this.cbHumanType.unSelectOption();
	this.cbHumanType.setSize(160); // 예외처리, 160px fixed.
	this.cbHumanType.attachEvent("onFocus", function() {
		if ($('#humanTypeWrap').width() != $('#selectSrchType').width()) {
			self.cbHumanType.setSize($('#humanTypeWrap').width());
		}
	});
	this.cbHumanType.attachEvent("onChange", function(value, text) {
		$('#srchHumanInfo').children('input').val('');
	});	
	
	// 그리드 컨트롤 생성
	this.mstGrid = 
			new DHTMLX.Grid("workWorkList_mstGrid", "N", (new Date()).valueOf(), null, null, null,
					[{gridId: "workList", menuId: "workList", trnfType: 1}],
					[{clmId: 'checkbox', clmNm: '#master_checkbox', clmType: 'CHECKBOX', clmAlgn: 'CENTER', clmWidth: '30'},
					 {clmId: 'workNm', clmNm: '보안업무 배정명', clmType: 'TEXT', clmAlgn: 'LEFT', clmWidth: "*", clmOrder: 'Y', sortSeq: 1, clmClick: 'Y'},
					 {clmId: 'workStdt', clmNm: '업무시작일', clmType: 'TEXT', clmAlgn: 'CENTER', clmWidth: '120', clmOrder: 'Y', sortSeq: 2},
					 {clmId: 'workEddt', clmNm: '업무종료일', clmType: 'TEXT', clmAlgn: 'CENTER', clmWidth: '120', clmOrder: 'Y', sortSeq: 3},
					 {clmId: 'workCycleNm', clmNm: '업무주기', clmType: 'TEXT', clmAlgn: 'CENTER', clmWidth: '100', clmOrder: 'Y', sortSeq: 4},
					 {clmId: 'workUsrNm', clmNm: '담당자', clmType: 'TEXT', clmAlgn: 'CENTER', clmWidth: '120', clmOrder: 'Y', sortSeq: 5},
					 {clmId: 'dptNm', clmNm: '부서', clmType: 'TEXT', clmAlgn: 'CENTER', clmWidth: '120', clmOrder: 'Y', sortSeq: 6},
					 {clmId: 'approvalUsrNm', clmNm: '결재자', clmType: 'TEXT', clmAlgn: 'CENTER', clmWidth: '120' },
					 {clmId: 'workStatusNm', clmNm: '진행상태', clmType: 'TEXT', clmAlgn: 'CENTER', clmWidth: '100', clmOrder: 'Y', sortSeq: 7},
					 {clmId: 'modifyBtn', clmNm: '수정', clmType: 'BUTTON', clmAlgn: 'CENTER', clmWidth: '100' },
					 {clmId: 'workId', clmNm: '보안활동아이디', clmType: 'TEXT', clmAlgn: 'CENTER', clmWidth: '10', clmVisibl: 'N'},
					 {clmId: 'actiId', clmNm: '보안업무아이디', clmType: 'TEXT', clmAlgn: 'CENTER', clmWidth: '10', clmVisibl: 'N'},
					 {clmId: 'workCycle', clmNm: '업무주기코드', clmType: 'TEXT',	clmAlgn: 'CENTER', clmWidth: '10', clmVisibl: 'N'},
					 {clmId: 'workUsrId', clmNm: '담당자ID', clmType: 'TEXT',	clmAlgn: 'CENTER', clmWidth: '10', clmVisibl: 'N'},
					 {clmId: 'workStatus', clmNm: '상태코드', clmType: 'TEXT', clmAlgn: 'CENTER', clmWidth: '10', clmVisibl: 'N' }]
				);
	this.mstGrid.setLinkCallback(this.onEvtClickDetail);
	this.mstGrid.setPaging(15, 15);
	this.mstGrid.setFildTxtColor([{id: "workStatus", ind: 8, value: "JB002004", color: "#f1536e"}]);
	
	console.log('FuncSecuWorkList function load completed');
};

/**
 *	@desc: FuncSecuWorkList prototype
 *	@type: public
 */
FuncSecuWorkList.prototype = {
	// @desc: initialize window
	onInitWindow: function() {
		const buttonOption = [{id: 'modifyBtn', label:'수정', callback: 'secuWorkList.onEvtClickBtnModify', btnSwitch: true, colId: 'modifyBtn', chkVal:'JB002006,JB002007,JB002008' }];
		const chkboxDisOption = [{ id: 'workStatus', ind: 0, value: 'JB002006,JB002007,JB002008' }];
		secuWorkList.mstGrid.loadData(window.bellock.data, buttonOption, chkboxDisOption);
		
		console.log('FuncSecuWorkList onInitWindow function load completed');
	},
	
	// @desc: 수정 페이지로 이동
	onEvtClickBtnModify: function(obj, rowId) {
	},
	
};

	


/**
 * 보안업무 동적 처리 자바스크립트
 * 
 * @history: 2024.03, 최초작성
 */
(function() {
	window.secuWorkList = new FuncSecuWorkList();
	window.setTimeout(function() {
		window.secuWorkList.onInitWindow();
	});
})();
	

