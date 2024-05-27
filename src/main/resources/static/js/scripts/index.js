/**
 * 대시보드 동적 처리 자바스크립트
 * 
 * @history: 2024.03, 최초작성
 */
(function() {
	window.bellock = {};
	window.bellock.el = document.querySelector('.chrome-tabs');
	window.bellock.chromeTabs = new ChromeTabs();
	window.bellock.chromeTabs.init(window.bellock.el);

	
	window.pageObj = new pageWindow();
	window.setTimeout(function() {
		pageObj.onInitWindow();
	});
})();



/**
 *	@desc: pageWindow constructor
 *	@param: none
 *	@return: pageWindow object
 *	@type: public
 */
function pageWindow() {
//	document.querySelector('.cont_wrap').classList.remove('cont_wrap');
	document.querySelector('.left_col').style.position = 'fixed';
};

/**
 * 페이지 초기화 함수
 * 페이지에 표시될 모든 콘텐츠를 조회 후 드로잉한다.
 * HTMX에서는 htmx:afterSwap 처리로 적용해서 비교 
 */
pageWindow.prototype.onInitWindow = function() {
	// 평가업무 영역별 챠트 드로잉 
	pageObj.apprAreaStatChart();
	// calendar 표시
	pageObj.calendar = new DHTMLX.Calendar("calendar", "ko");
	pageObj.calendar.showCalendar();
	// 검토대기(보안업무) 업무
	pageObj.mstGrid =
			new DHTMLX.Grid(
					"mstGrid", "N", (new Date()).valueOf(), false, false, false,
					[{gridId:"workList",menuId:"workList",trnfType:1}],
					[{clmId:'workNm',clmNm:'보안업무 배정명',clmType:'TEXT',clmAlgn:'LEFT',clmWidth:'*',clmClick:'Y'},{clmId:'workStdt',clmNm:'업무시작일',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:"130"},{clmId:'workEddt',clmNm:'업무종료일',clmType:'TEXT',clmAlgn:'CENTER',	clmWidth:'130'},{clmId:'workUsrNm',clmNm:'담당자',clmType:'TEXT',	clmAlgn:'CENTER',clmWidth:'100'},{clmId:'dptNm',clmNm:'부서',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:'100'}]
				);
	pageObj.queryWorkGridDataLoad();
	// 게시판
	//this.brdGrid = new DHTMLX.Grid("brdGrid", "N", (new Date()).valueOf(), false, false, false, headerData04, columnData04);
	// 평가목록
	pageObj.apprGrid = 
			new DHTMLX.Grid(
					"apprGrid", "N", (new Date()).valueOf(), false, false, false, 
					[{gridId:"apprList",menuId:"apprList",trnfType: 1}], 
					[{clmId:'appraisalNm',clmNm:'평가업무명',clmType:'TEXT',clmAlgn:'LEFT',clmWidth:'*',clmOrder:'Y',sortSeq: 1,clmClick:'Y'},{clmId:'appraisalPoint',	clmNm:'평가점수',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:"150",clmOrder:'Y',sortSeq:2},{clmId:'appraisalStdt',clmNm:'평가시작일',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:'150',clmOrder:'Y',sortSeq:3},{clmId:'appraisalEddt',	clmNm:'평가종료일',clmType:'TEXT',	clmAlgn:'CENTER',clmWidth:'150',clmOrder:'Y',sortSeq:4},{clmId:'compNm',clmNm:'평가기준',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:'10',clmVisibl:'N'},{clmId:'standardPoint',clmNm:'기준점수',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:'10',clmVisibl:'N'},{clmId:'appraisalStatus',clmNm:'평가상태',clmType:'TEXT',clmAlgn:'CENTER',clmWidth:'10',clmVisibl:'N'},{clmId:"appraisalId",clmNm:"일련번호",clmType:"TEXT",clmAlgn:"CENTER",clmWidth:"10",clmVisibl:"N"},{clmId:"appraisalClose",clmNm:"평가완료여부",clmType:"TEXT",clmAlgn:"CENTER",clmWidth:"10",clmVisibl:"N"},{clmId:"exampleYn",clmNm:"보기적용여부",clmType:"TEXT",clmAlgn:"CENTER",clmWidth:"10",clmVisibl:"N"}]
				);
	//pageObj.apprGrid.setLinkCallback(this.onClickApprDetail);
	pageObj.queryApprEvalEtcDataLoad();
	// 금일 보안업무 현황 정보
	pageObj.queryWorkListCountByStatus(pageObj.calendar.getDate(true), "ALL");
	// 윈도우 리사이즈 이벤트
	$(window).resize(pageObj.onResizeEvt);
	
	
	// view more event
	// 전사 보안업무 일정표
	$(".view_more.scheduled").off("click").on("click", function() {
		window.bellock.CreateAddTabPage(
			"workSchedule", 
			"/workScheduled.do", 
			"보안업무-일정표", 
			"/images/svg_ico/svg-009.svg"
		);
	});
	// 배정된 보안업무
	$(".view_more.workList").off("click").on("click", function() {
		const params = { sbdnYear: '2024'};
		window.bellock.CreateAddTabPagePlus(
			"workDetail", 
			"/secuWorkListDetail", 
			"보안업무-배정된 업무현황", 
			"/images/svg_ico/svg-007.svg", 
			params
		);
	});


	// WebSocket 연결을 위한 클라이언트 코드
	let sessionId;
	// HTTP 요청을 통해 세션 ID 가져오기
	fetch('/bellockSocketConnect')
		.then(response => response.text())
		.then(data => {
			sessionId = data;

		// 세션 ID를 사용하여 WebSocket 서버에 연결
//		let socket = new WebSocket("ws://localhost:8080/bellockSocketServer?sessionId=" + sessionId);
//		let socket = new WebSocket("ws://192.168.0.194:8080/bellockSocketServer?sessionId=" + sessionId);
		let socket = new WebSocket("ws://" + window.location.href.replace("http://", "") + "bellockSocketServer?sessionId=" + sessionId);
		socket.onopen = (event) => {
			console.log("WebSocket is open");
		};
		socket.onmessage = (event) => {
			console.log("Message from server:", event.data);
			if (event.data === 'socketMsg_closeSession') {
				fetch('/logOut')
					.then(response => {
						window.location.replace('/');
					})
					.catch(error => {
						console.error('There was a problem fetching the page:', error);
					});
			}
		};
		socket.onerror = (error) => {
			console.log("Error has occured:", error);
		};
		socket.onclose = () => {
			console.log("WebSocket is closed");
		}
	})
	.catch(error => console.error("Error fetching session ID:", error));
	
	
	
};

// @desc: 상태별 보안활동 count 조회
pageWindow.prototype.queryWorkListCountByStatus = function(date, mode) {
	const param = {
		pageUrl: "/index/workCnt",
		fixedDate: date ? date : pageObj.calendar.getDate(true),
		sbdnYear: (new Date()).getFullYear(),
		searchMode: mode
	};
			
	!pageObj && (pageObj = this);
	if (pageObj.calendar.getDate(true).substring(0, 4) != pageObj.statsYear) {
		statsYear = param.fixedDate.substring(0, 4);
		param.searchMode = mode = "ALL";
		param.sbdnYear = pageObj.calendar.getDate().getFullYear()
	}
	
	window.dataProc.ajaxJson("/selectDayWorkCnt", param, function(result) {
		if (result.code === 0) {
			if((mode.indexOf("ALL") != -1) || (mode.indexOf("DAY") != -1)) {
				const workStatusTxt = pageObj.calendar.getDate(true);
				$("#workStatusTxt").text(workStatusTxt + " 등록된 일정 및 보안업무 정보 입니다. 하단의 내용은 달력에서 선택된 날짜를 기준으로 집계 됩니다.");
				const dailyData = result.data[1];
				$.each(dailyData, function(key, value) { $("#" + key).text(value); });
				// 일기준 보안업무 현황
				for (const key in dailyData) {
					document.getElementById(key).textContent = dailyData[key];
				}
			}
			
			if ((mode.indexOf("ALL") != -1) || (mode.indexOf("MONTH") != -1)) {
				const workListForMonth = result.data[2];
				// 달력에 보안업무 툴팁 정보를 적용함.
				workListForMonth.forEach(function(item, idx) {
				    var strTooltip = "";
				    if (item.workStart) { strTooltip = "업무기간 시작 " + item.workStart + "건"; }
					if (item.workInproc) {
						if (strTooltip.length) { strTooltip += "<br>"; }
						strTooltip += "업무기간 진행 " + item.workInproc + "건";
					}
					if (item.workEnd) {
						if (strTooltip.length) { strTooltip += "<br>"; }
						strTooltip += "업무기간 종료 " + item.workEnd + "건";
					}
					if (strTooltip.length) {
						var mark = (item.workStart || item.workEnd) ? true : false;
						pageObj.calendar.getRawObject().setTooltip(new Date(item.workStdt), strTooltip, mark, true);
					}
				});
			}
			if (mode.indexOf("ALL") != -1) {
				const totalWorkList = result.data[3];
				for (var key in totalWorkList) {
					const value = totalWorkList[key];
					if (key == "total") {
						$(".report #" + key).text(value);
					} else {
						var val = value.split(":");
						$("#" + key).percircle({ text: val[0], percent: val[1] });
					}
				}
				var reportTitle = pageObj.calendar.getDate(true).substring(0, 5);
				reportTitle += " 배정된 전사 보안업무 진행현황";
				$("#reportTitle").text(reportTitle);
			}
			pageObj.queryMySchedule(date, mode);
		}
	});	
};

// @desc: 나의 schedule 조회
pageWindow.prototype.queryMySchedule = function(date, mode) {
	var param = {
		pageUrl: "/index/scheculed",
		fixedDate: date ? date : pageObj.calendar.getDate(true),
		searchMode: mode
	};
	window.dataProc.ajaxJson("/selectScheduled", param, function(result) {
		if (result.code === 0) {
			var scheduledData = result.data[0].scheduledListForDate;
			var monthlyScheduled = result.data[0].scheduledListForMonth;
			var scheduleCnt = 0;
			if((mode.indexOf("ALL") != -1) || (mode.indexOf("MONTH") != -1)) {
				$.each(monthlyScheduled, function(idx) {
					var dt = window.dhx4.str2date(monthlyScheduled[idx].scheduleStdt, "%Y%m%d");
					var k = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0, 0).getTime();
					if(pageObj.calendar.getRawObject()._tipData[k] != null &&
							pageObj.calendar.getRawObject()._tipData[k].refresh != null &&
							pageObj.calendar.getRawObject()._tipData[k].refresh == true) {
						pageObj.calendar.getRawObject().clearTooltip(dt);
					}
					if(pageObj.calendar.getRawObject()._tipData[k] != null) {
						pageObj.calendar.getRawObject()._tipData[k].text += "<br>나의 등록일정 " + monthlyScheduled[idx].cnt + "건";
					} else {
						pageObj.calendar.getRawObject().setTooltip(dt, "나의 등록일정 " + monthlyScheduled[idx].cnt + "건", false, true, true);
					}
				});
			}
			if ((mode.indexOf("ALL") != -1) || (mode.indexOf("DAY") != -1)) {
				$("#scheduleCnt").text(scheduledData.length);
			}
		}
	});	
};

// @desc: 검토대상 또는 나의 미완료 업무 리스트 조회
pageWindow.prototype.queryWorkGridDataLoad = function() {
	const param = {
		pageUrl: "/index/reviewWork",
		sbdnYear: (new Date()).getFullYear(),
		srchWorkStatus: 'JB002006'
	};

	window.dataProc.ajaxJsonSync("/selectWorkList", param, function(result) {
		if (result.code === 0) {
			pageObj.mstGrid.loadData(result.data[0]);
		}
	});
};

// @desc: 평가목록 조회
pageWindow.prototype.queryApprEvalEtcDataLoad = function() {
	window.dataProc.ajaxJson("/selectApprInfoEtc", null, function(query) {
		if (query.code === 0) {
			// 평가 추이
			pageObj.onDrawTransChart(query.data[1]);
			// 평가 목록
			pageObj.apprGrid.loadData(query.data[2]);
		}
	});	
};	

// @desc: 최근 평가 추이
pageWindow.prototype.onDrawTransChart = function(data) {
	var baseLine = 0;
	var stepSize = 10;
	if (data.length == 0) {
		$('#chartContain').addClass("emptyAppraisal");
		$('#chartContain').css('margin', 'unset');
		return;
	}
	for (var i = 0; i < data.length; i++) {
		const item = data[i];
		const point = Number(item.appraisalPoint);
		if (baseLine == 0) {
			baseLine = point;
		} else if (baseLine > point) {
			baseLine = point;
		}
	}
	baseLine -= baseLine % 10;
	stepSize = (100 - baseLine) / 2;
	(baseLine === 100) && ((baseLine = 90), (stepSize = 5));
	if (pageObj.apprTransChart != null) {
		pageObj.apprTransChart.clearAll();
		pageObj.apprTransChart.destructor();
	}
	var width = $('#chartContain').width() / ((data.length * 3) + (5 - data.length));
	if (50 < width) {
		width = 50;
	}
	pageObj.apprTransChart = new dhtmlXChart({
		view: "bar",
		width: width,
		container: "chartContain",
		value: "#appraisalPoint#",
		label: "#appraisalPoint#",
		color: "#17a2b8",
		tooltip: "#appraisalNm#",
		cursor: "pointer",
		yAxis: {
			start: baseLine,
			end: 100,
			step: stepSize
		},
		xAxis: {
			template: "#appraisalEddt#"
		}
	});
	pageObj.apprTransChart.addSeries({
		view: "line",
		line: {
			color: "#28a745"
		},
		value: "#appraisalPoint#",
		label: ""
	});
	pageObj.apprTransChart.parse(data, "json");
	pageObj.transChartData = data;
};

// @desc: 영역별 통제항목 환산점수 그래프 refresh
pageWindow.prototype.apprAreaStatChart = function() {
	window.dataProc.ajaxJson("/selectApprStatChart", null, function(query) {
		if (query.code === 0) {
			//$("#sortable2 #standard").append(query.data);
			$("#sortable2 #standard").replaceWith(query.data[0]);
		}
	});	

	
};

// @desc: 윈도우 리사이즈 이벤트
pageWindow.prototype.onResizeEvt = function() {
	pageWindow.prototype.onDrawTransChart(pageObj.transChartData);
};


/**
 * Head에 필요한 Javascript 파일 적용 또는 삭제
 * 
 * RSA 관련 js는 파일은 로그인 후 필요 없으므로 삭제 처리함.
 * Menu 관련 js 파일은 롤그인 add 시킴
 */
function loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
}
loadScript('/js/scripts/menuProc.js');
loadScript('/js/scripts/commProc.js');

function removeScriptBySrc(src) {
    var scripts = document.querySelectorAll('script[src="' + src + '"]');
    scripts.forEach(function(script) {
        script.parentNode.removeChild(script);
    });
}
removeScriptBySrc('/js/rsa/jsbn.js');
removeScriptBySrc('/js/rsa/rsa.js');
removeScriptBySrc('/js/rsa/prng4.js');
removeScriptBySrc('/js/rsa/rng.js');





