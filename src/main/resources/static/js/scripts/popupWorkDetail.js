/**
 *	@desc: popupWindow prototype
 *	@type: public
 */
popupWorkDetail.prototype = {
	// initial window
	onInitWindow: function() {
		let activeId = null;
		if (popupWorkDetail.params != null && popupWorkDetail.params.activeId != null) {
			activeId = popupWorkDetail.params.activeId;
		}
		// 이력 데이터 로드.
		window.dataProc.ajaxJson("/selectWorkHisList", {
			activeId
		}, function(query) {
			if(query.code == 0) {
				popupWorkDetail.gridObj.loadData(query.data[0]);
			}
		});
		
		const popupWorkNm = popupWorkDetail.params.actiNm;
		if (popupWorkNm != null) {
			$('#popupWorkNm').text(popupWorkNm);
		}
		
		popupWorkDetail.onEvtClickBtnEvidForm();
		popupWorkDetail.onEvtClickBtnMappedCompInfo();
	},
	// 증적양식 다운로드 버튼 이벤트
	onEvtClickBtnEvidForm: function() {
		$(".fileDown").off("click").on("click", function() {
			$.fileDownLoad($(this).attr("atchfileid"), $(this).attr("filesn"));
		});
	},
	// 컴플라이언스 매핑정보 버튼 이벤트 처리
	onEvtClickBtnMappedCompInfo: function() {
		$("#compDetail").click(function() {
		});
	},
};

/**
 *	@desc: popupWindow constructor
 *	@param: none
 *	@return: popupWindow object
 *	@type: public
 */
function popupWorkDetail() {
	window.dhtmlxWnd.params && (this.params = window.dhtmlxWnd.params);
	window.secuActiList && (this.prevPopupObj = window.secuActiList);
	this.dhtmlxWnd = window.dhtmlxWnd, window.dhtmlxWnd = null;
	this.dhtmlxWnd && this.dhtmlxWnd.setInstance(this);
	this.dhtmlxWnd.setPopupId('actiActivityDtlViewPopWnd');

	// calback 함수 설정
	this.callbackFunc = null;
	if(this.dhtmlxWnd && typeof(this.dhtmlxWnd.callbackFunc) === 'function') {
		this.callbackFunc = this.dhtmlxWnd.callbackFunc;
		delete this.dhtmlxWnd.callbackFunc;
	}

	var self = this;
	this.selfClear = function() {
		self.prevPopupObj && (window.secuActiList = self.prevPopupObj);
		for(var c in self) {
			self[c] = null
		}
		self = null;
		window.popupWindow = null;
		delete window.popupWindow;
	};

	// @desc: popup window onClose
	this.onDhxWndExClose = function() {
		self.gridObj.destructor();
		self.selfClear();
	};

	// create grid control
	this.gridObj = new DHTMLX.Grid("historyGrid", "N", (new Date()).valueOf(), true, null, null,
			[{ gridId: "activityDetailView", menuId: "activityDetailView", trnfType: 1 }],
			[{ clmId: 'hisDate', clmNm: '이력일자', clmType: 'TEXT', clmAlgn: 'CENTER', clmWidth: "120" }, { clmId: 'codeDetailNm', clmNm: '이력구분', clmType: 'TEXT', clmAlgn: 'CENTER', clmWidth: '150' }, { clmId: 'hisDtl', clmNm: '상세내용', clmType: 'TEXT', clmAlgn: 'LEFT', clmWidth: '*' }, { clmId: 'usrNm', clmNm: '처리자', clmType: 'TEXT', clmAlgn: 'CENTER', clmWidth: '100' }]
		);

	// 아코디언 초기화.
	window.accordionInit();
	return this;
};


/**
 * 보안업무 상세팝업 동적 처리 자바스크립트
 * 
 * @history: 2024.03, 최초작성
 */
(function() {
	window.popupWorkDetail = new popupWorkDetail();
	window.setTimeout(function() {
		popupWorkDetail.onInitWindow();
	});
})();




