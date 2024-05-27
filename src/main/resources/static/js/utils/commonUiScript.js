$(function (){
	headerDropdown();
	accordion();
	accordionInit();
	subExpand();

	initSbdnYearAndSetEvt();
	searchOption();
	initSearchOptionFieldCtrl();
	searchOptionFieldReset();
	searchFieldReset();
	setKeywordSelEvt();
	setCompTypeChangeEvt();
	setCompSelPopupWndEvt();
	setDepUsrSelPopupWndEvt();
});

/**
 * @desc: debug function
 * @history:
 */
var debug = function() {
	return true;
}

var headerDropdown = function (){
	var headerDropdown = $('.header-wrap .dropdown');
	var dropdownTrigger = headerDropdown.find('.dropdown-toggle');
	dropdownTrigger.on('click', function (){
		if (!headerDropdown.hasClass('show')) {
			headerDropdown.addClass('show');
		} else {
			headerDropdown.removeClass('show');
		}
	});
}

var accordion = function () {
	var accTrigger = $('.rowAccTit').find('button');
	$(document).on('click','.rowAccTit button', function () {
		var par = $(this).closest('.rowAccTit');
		var accTarget = par.next('.rowAccCont');

		var isOpen;
		if (!par.hasClass('active')) {
			par.addClass('active');
			accTarget.addClass('active');
			accTarget.slideDown(380);
			isOpen=true;
		} else {
			par.removeClass('active');
			accTarget.removeClass('active');
			accTarget.slideUp(380);
			isOpen=false;
		}

		if (typeof window.onAccProcEnd == 'function') {
			window.onAccProcEnd(this, isOpen, $(accTarget).attr('id'));
		}
	});
}

var accordionInit = function () {
	var accordion = $('.accCont');
	accordion.each(function () {
		//상세정보 노출영역에 대한 설정이 있는경우
		if ($(this).find('.rowAccTit').hasClass("active")) {
			$(this).find('.rowAccCont.active').slideDown();
		}/*
		else {
			$(this).find('.rowAccTit').first().addClass('active');
			$(this).find('.rowAccCont').first().addClass('active').slideDown();
		}*/
	})
}

// @desc: sub-확장/숨김
var subExpand = function () {
	$(document).on('click','.rowExpandTit button', function (){
		var par = $(this).closest('.rowExpandTit');
		var accTarget = par.next('.rowExpandCont');

		if (!par.hasClass('active')) {
			par.addClass('active');
			accTarget.addClass('active');
			accTarget.slideDown(380);
		} else {
			par.removeClass('active');
			accTarget.removeClass('active');
			accTarget.slideUp(380);
		}
	})
}

/**
 * @desc: 회계년도 처리.
 * @history:
 */
var initSbdnYearAndSetEvt = function() {
	if ($("#sbdnYear").length) {
		$("#sbdnYear").datepicker({ minViewMode: 'years', viewMode: "years", format: 'yyyy' });
		$("#calendarBtn").off("click").on("click", function() {
			 $("#sbdnYear").datepicker("show");
		});
		$("#sbdnYear").change(function() { $("#sbdnYear").datepicker("hide"); });
	}
}

/**
 * @desc: 전체 체크박스 change event
 * @history:
 */
var onEvtChangeAllCheck=function(inst) {
	if (inst == null || typeof(inst) != 'object') { return; }
	inst.attachEvent("onChange", function(name, value, state) {
		$("#ckbAllYearEx").val(state);
		if ("ckbAllYear" == name) {
			if (state == true) {
				$("#sbdnYear").attr('disabled', true);
				$("#calendar").attr('disabled', true);
				$("#sbdnYear").val('');
			} else {
				$("#sbdnYear").attr('disabled', false);
				$("#calendar").attr('disabled', false);
				$("#sbdnYear").val($("#sbdnYear").datepicker('getFormattedDate', 'yyyy'));
			}
		}
	});
}

/**
 * @desc: 조회옵션 화면 show/hide
 * @history:
 */
var searchOption = function(id) {
	if (typeof(id) == 'undefined') {
		id = '';
	} else { id = '#'+id+' '; }

	$(id+"#searchDtlBtn.btn_search_option").off("click").on("click", function() {
		var par = $(this).closest('.srh_tb_date');
		var optionTarget = $('.search_box.dropdown_srh');

		if (!par.hasClass('viewOption')) {
			$(id+"#searchDtlBtn.btn_option_reset").show("slide", { direction: "left" }, 300);
			par.addClass('viewOption');
			optionTarget.addClass('show');
			optionTarget.slideDown();

			if (typeof(window.XGFunc.onSearchOptEvent) == 'function') {
				window.XGFunc.onSearchOptEvent(true);
			} else if (typeof(onSearchOptView) == 'function') {
				onSearchOptView(true);
			}
		} else {
			resetSearchOptions();
			$(id+"#searchDtlBtn.btn_option_reset").hide("slide", { direction: "left" }, 300);
			par.removeClass('viewOption');
			optionTarget.removeClass('show');
			optionTarget.slideUp();

			if (typeof(window.XGFunc.onSearchOptEvent) == 'function') {
				window.XGFunc.onSearchOptEvent(false);
			} else if (typeof(onSearchOptView) == 'function') {
				onSearchOptView(false);
			}
		}
	});
}

/**
 * @desc: 죄회옵션 영역 show
 * @history:
 */
var visibeOptionArea = function(id) {
	if (typeof(id) == 'undefined') {
		id = '';
	} else { id = '#'+id+' '; }

	$(id+"#sendFrm #searchDtlArea").toggle();
	$(id+'#searchDtlBtn').trigger('click');
}

//
//	DESC.
//		상세조회 옵션 화면 visible 상태 체트.
//
//	HISTORY.
//
var isVisibleSrchOption = function() {
	return $('.srh_tb_date').hasClass('viewOption');
}

//
//	DESC.
//		이전 설정된 옵션으로 설정.
//
//	HISTORY.
//
var initSearchOptions = function(restore) {
	$.each(restore, function(key, val) {
		if (key.length) {
			$("#"+key).val(val);
			$("input[name="+key+"]").val(val);
		}
	});
}

/**
 * @desc: 상세조회 옵션 fields 초기화.
 * @history:
 */
var resetSearchOptions = function(id) {
	if (typeof(id) == 'undefined') {
		id = '';
	} else { id = '#'+id+' '; }

	$(id+"#sendFrm #searchDtlArea input").val("");
	$(id+"#sendFrm #searchDtlArea select").val("");

	if (typeof(window.XGFunc.onSearchDetailAreaReset) == 'function') {
		window.XGFunc.onSearchDetailAreaReset();
	} else if (typeof(OnSearchDtlAreaReset) == 'function') { // 향후에 제거해야함.
		OnSearchDtlAreaReset();
	}
}

//
//	DESC.
//		조회옵션 클릭 이벤트.
//
//	HISTORY.
//

var initSearchOptionFieldCtrl = function() {
	//$("#searchDtlBtn.btn_search_option").off("click").on("click", function() {
	//	resetSearchOptions();
	//});
}

//
//	DESC.
//		조회옵션 초기화 버튼 클릭 이벤트.
//
//	HISTORY.
//
var searchOptionFieldReset = function(id) {
	if (typeof(id) == 'undefined') {
		id = '';
	} else { id = '#'+id+' '; }

	$(id+"#searchDtlBtn.btn_option_reset").off("click").on("click", function(){
		resetSearchOptions();
	});
}

//
//	DESC.
//		조회옵션 초기화(시스템 메뉴) 버튼 이벤트.
//
//	HISTORY.
//
var searchFieldReset = function() {
	$("#searchDtlBtn.btn_reset").off("click").on("click", function(){
		$("#sendFrm .search_inner input").val("");
		$("#sendFrm .search_inner select").val("");
	});
}

//
//	DESC.
//		특정 페이지로 이동.
//
//	HISTORY.
//
var callbackGridLoadData = function(initPageNo) {
	mstGrid.getRawObject().changePage(initPageNo);
}


//
//	DESC.
//		키워드 매핑정보 출력.
//
//	HISTORY.
//
var keySelected = function(keyList) {
	var keyword = new Array();
	var keywordIds = new Array();

	$.each(keyList, function(idx) {
		keyword.push(keyList[idx].keywrd);
		keywordIds.push(keyList[idx].keywrdId);
	});

	$("#srchKeyword").val(keyword.toString());
	$("#srchKeywordIds").val(keywordIds.toString());
}

//
//
//	DESC.
//		연관키워드 추가 이벤트.
//
//	HISTORY.
//
var setKeywordSelEvt = function() {
	$("#keyworkBtn").off("click").on("click", function() {
		param = [{id: "selectKyeWrdPop", width: 600, height: 500, text: "연관키워드 선택", resize: false, park: false, center: true, move: false}];
		dhxWins = new DHTMLX.Window("s_main", param);

		param = { fnCallback : "keySelected", srchKeywordIds : $("#srchKeywordIds").val() };
		dhxWins.loadUrl("selectKyeWrdPop", "/cmm/selectKyeWrdPop.do", true, param);
		var win = dhxWins.getRawObject("selectKyeWrdPop");

		dhxWins.setModal("selectKyeWrdPop");
	});
}

/**
 * @desc: 업무주기 코드 설정.
 * @history:
 */
var setWorkCycleOpt = function() {
	workCycleData = $.commCodeSingle("JB000000","JB001000");
	dtlData = workCycleData.cdDtlList;
	$.each(dtlData, function(idx) {
		if ($("#srchEcrCycle").length) {
			$("#srchEcrCycle").append("<option value=\"" + dtlData[idx].codeDetailCd + "\">" + dtlData[idx].codeDetailNm + "</option>");
		}
		if ($("#srchWorkCycle").length) {
			$("#srchWorkCycle").append("<option value=\"" + dtlData[idx].codeDetailCd + "\">" + dtlData[idx].codeDetailNm + "</option>");
		}
	});
}

//
var setEvidFileType = function(element) {
	var data = $.commCodeSingle("ET000000");
	var codeList = data.cdList;
	$.each(codeList, function(idx) {
		var option = $("<option value=\""+codeList[idx].codeCd+"\">"+codeList[idx].codeNm+"</option>");
		element.append(option);
	});
}

//
//	DESC.
//		진행상태 코드 설정.
//
//	HISTORY.
//
var setWorkStatusOpt = function() {
	workStatusData = $.commCodeSingle("JB000000","JB002000");
	workStatusData = workStatusData.cdDtlList;
	$.each(workStatusData, function(idx) {
		//진행상태 콤보 생성
		var option = $("<option value=\""+workStatusData[idx].codeDetailCd+"\">"+workStatusData[idx].codeDetailNm+"</option>");
		$("#srchWorkStatus").append(option);
	});
}

//
//	DESC.
//		법령및보안규정 검색구분 변경 이벤트.
//
//	HISTORY.
//
var setCompTypeChangeEvt = function(comboObj) {
	if (comboObj == null) { return null; }
	return comboObj.attachEvent("onChange", function(value, text) {
		$("#srchComp").val("");
		$("#srchCompCode").val("");
		$("#srchCompCla").val("");
		$("#srchMaVer").val("");
		$("#srchMiVer").val("");
	});
}

/**
 * @desc: 컴플라이언스 검색 버튼 이벤트.
 * @history:
 */
var setCompSelPopupWndEvt = function() {
	$("#btnSrchComp, input[name='srchComp']").off("click").on("click", function() {
		const srchType = $('input[name=selectSrchCompType]').val();
		const wndId = "selectCompPop";
		const popupUrl = "/cmm/popup/selectCompPop.do";
		var wndParam = [{
			popupId: "popupNth",
			id: wndId,
			text: "법규 및 보안규정 선택"
		}];

		if (srchType == "srchComp") {
			wndParam[0].width = 700;
			wndParam[0].height = 600;
		} else if (srchType == "srchCompCla") {
			wndParam[0].width = 900;
			wndParam[0].height = 710;
		} else {
			window.msg.alert("법규 및 보안규정 검색 구분을 선택 하십시오.", "알림");
			return;
		}
		window.dhtmlxWnd = new DHTMLX.Window("s_main", wndParam);
		window.dhtmlxWnd.callbackFunc = onSetSelCompItem;
		window.dhtmlxWnd.loadUrl(wndId, popupUrl, true, {parentType: "acti", srchType: srchType});
		window.dhtmlxWnd.setModal(wndId);
	});

	this.onSetSelCompItem=function(compInfo) {
		$("#srchComp").val(compInfo.text);
		$("#srchCompCode").val(compInfo.compCode);
		$("#srchCompCla").val(compInfo.compCla);
		$("#srchMaVer").val(compInfo.maVer);
		$("#srchMiVer").val(compInfo.miVer);
	};
}

/**
 * @desc: 부서 또는 담당자 검색 이벤트.
 * @history:
 */
var setDepUsrSelPopupWndEvt = function(id) {
	if (typeof(id) == 'undefined') {
		id = '';
	} else { id = '#'+id+' '; }


	$(id+"#srchType, input[name='srchTypeNm']").off("click").on("click", function() {
		// dhtmlx combo 적용 여부에 따라 다름
		var trgtId = $('input[name=selectSrchType]').val();
		if (trgtId == null) { trgtId = $("#selectSrchType").val(); }

		// 부서 혹은 담당자인 경우, 혹 그렇지 않은 경우...
		if (trgtId == "srchDptNm") {
			$.dptPopup({fnCallback: callbackDpt, btnId: trgtId});
		} else if (trgtId == "srchWorkUsrNm" || trgtId == "srchUsrNm" || trgtId == "srchRegistNm") {
			$.usrSinglePopup({fnCallback: callbackUser, btnId: trgtId});
		} else {
			window.msg.alert("부서/담당자 검색 구분을 선택하세요.", "알림");
		}
	});

	// 부서 callback function
	this.callbackDpt=function(dptInfo, btnId) {
		$(id+"input[name=srchTypeNm]").val(dptInfo.dptNm);
		$(id+"input[name=" + btnId.replace("Nm", "Id")+"]").val(dptInfo.dptId);
	};

	// 담당자 callback function
	this.callbackUser=function(usrList, btnId) {
		$.each(usrList, function(i){
			$(id+"input[name=srchTypeNm]").val(usrList[i].usrNm);
			$(id+"input[name=" + btnId.replace("Nm", "Id")+"]").val(usrList[i].usrId);
		});
	};
}

/**
 * @desc: popup modaless window
 * @history:
 */
function openPopupWindow(url, windowName, features) {
	if (typeof windowName == 'undefined' || windowName.length == 0) {
		var timeStamp = String(new Date().getTime());
		windowName = '팝업윈도우'+timeStamp;
	}
	const leftX = (window.screen.width/2)-(1200/2);
	const topY = (window.screen.height/2)-(780/2);
	const windowFeatures = (typeof features == 'undefined' ? '' : features) +
				"width=1200,height=780,left="+leftX+",top="+topY;
	var wndHandle = window.open('', windowName, windowFeatures);

	$("body").append("<form name=\"openPopupForm\" id=\"openPopupForm\"></form>");
	$("#openPopupForm").attr("target", windowName);
	$("#openPopupForm").attr("method", "POST");
	$("#openPopupForm").attr("action", url);
	$("#openPopupForm").submit().remove();

	return wndHandle;
}

/**
 * @desc: popup modaless window
 * @history:
 */
function openPopupWindowEx(url, params, windowName, features) {
	if (typeof windowName == 'undefined' || windowName.length == 0) {
		var timeStamp = String(new Date().getTime());
		windowName = '팝업윈도우'+timeStamp;
	}
	const leftX = (window.screen.width/2)-(1200/2);
	const topY = (window.screen.height/2)-(780/2);
	const windowFeatures = (typeof features == 'undefined' ? '' : features) +
				"width=1200,height=780,location=no,left="+leftX+",top="+topY;
	var wndHandle = window.open('', windowName, windowFeatures);

	$("body").append("<form name=\"openPopupForm\" id=\"openPopupForm\"></form>");
	$("#openPopupForm").attr("target", windowName);
	$("#openPopupForm").attr("method", "POST");
	$("#openPopupForm").attr("action", url);
	for (const [key, value] of Object.entries(params)) {
		$("#openPopupForm").append("<input type='hidden' name='"+ key + "' value='" + value +"'/>");
	}
	$("#openPopupForm").submit().remove();

	return wndHandle;
}

function onlyNumInput(event) {
	event = event || window.event;
    const keyID = (event.which) ? event.which : event.keyCode;
	if ((keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) ||
			keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) {
        return;
    } else {
        return false;
    }
}

function removeChar(event) {
    event = event || window.event;
    var keyID = (event.which) ? event.which : event.keyCode;

    if (keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39)
        return;
    else
        event.target.value = event.target.value.replace(/[^0-9|]/g, "");
}

