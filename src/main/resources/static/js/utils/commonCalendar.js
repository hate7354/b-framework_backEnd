// @desc: 달력 공통모듈
// @history:
//		정귀재 2020년도 최초작성
//		modified by inseok.ra 메모리회수 불능 및 다발성 오류로 일부 수정.
//			기존 및 신규 javascript code들이 문제 없이 참조할 수 있도록 수정.
(function($) {
	$.extend(true, window, {
		DHTMLX : {
			Calendar : dhtmlx
		}
	});

	/************************************************************************************************************************************************
	 * Calendar 초기화
	 * 정귀재
	 *
	 * _type	: input 또는 img 타입으로 지정 가능하며 배열 형태로 설정한다..
	 *        input에 이벤트를 줄 경우 input의 아이디값을 설정한다. 다중 설정 가능 ex) ["input_id1","input_id2",....]
	 *        img icon 사용시 선택값을 표시할 input과 img icon의 아이디값을 설정한다. ex) [{input:"stdt", button: "ico1"},{input:"eddt", button: "ico2"},....]
	 * lan : 달력 언어타입 기본값은 ko이며 영문으로 하고자 할 경우 "en"으로 설정.
	 ************************************************************************************************************************************************/
	function dhtmlx(_type, _lan) {
		dhtmlXCalendarObject.prototype.lang = "ko";
		dhtmlXCalendarObject.prototype.langData = {
			"ko": {
				dateformat: "%Y년 %m월 %d일",
				hdrformat: "%Y / %m",
				monthesFNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
				monthesSNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
				daysFNames: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
				daysSNames: ["일","월","화","수","목","금","토"],
				weekstart: 7,
				weekname: "주",
				today: "오늘",
				clear: ""
			}
		};

		var self=this;
		this.selfCrear=function() {
			for (let c in self) {
				self[c] = null;
			} self = null;
			//for (let c in this) { this[c] = null; }
		};


		//초기값 설정
		this.inst = new dhtmlXCalendarObject(_type);

		if (_lan) {
			this.inst.loadUserLanguage(_lan);
		}
		//달력하단에 시간이 나오므로 시간을 숨김.
		this.inst.hideTime();

		this.evIdOnShow=null;
		this.evIdOnChange=null;
		this.evIdOnBeforeChange=null;

		// @desc: 달력 헤드에 년도 이동 elements 적용.
		// @history: added by inseok.ra 2020/04/29. 벅선장 요구사항. DHTMLX JS 변경함.(DHTMLX 내부적으로 onclick evt 처리됨.)
		this.evIdOnShow = this.inst.attachEvent("onShow", function() {
			if ($('div').hasClass('dhtmlxcalendar_material') == true) {
				let elemYearArrow = "<div class=\"dhtmlxcalendar_year_arrow dhtmlxcalendar_year_arrow_left\" onmouseover=\"this.className=&quot;";
				elemYearArrow += "dhtmlxcalendar_year_arrow dhtmlxcalendar_year_arrow_left_hover&quot;;\" onmouseout=\"this.className=&quot;";
				elemYearArrow += "dhtmlxcalendar_year_arrow dhtmlxcalendar_year_arrow_left&quot;;\"></div>";
				elemYearArrow += "<div class=\"dhtmlxcalendar_year_arrow dhtmlxcalendar_year_arrow_right\" onmouseover=\"this.className=&quot;";
				elemYearArrow += "dhtmlxcalendar_year_arrow dhtmlxcalendar_year_arrow_right_hover&quot;;\" onmouseout=\"this.className=&quot;";
				elemYearArrow += "dhtmlxcalendar_year_arrow dhtmlxcalendar_year_arrow_right&quot;;\"></div>";

				let elem = $('.dhtmlxcalendar_in_input').find('.dhtmlxcalendar_month_hdr');
				if (elem.children('.dhtmlxcalendar_year_arrow').length == 0) {
					elem.append(elemYearArrow);
				}
			}
		});


		/************************************************************************************************************************************************
		 * calendar object return
		 ************************************************************************************************************************************************/
		this.getRawObject = function(){
			return self.inst;
		};

		/************************************************************************************************************************************************
		 * 선택된 날자 리턴
		 * param
		 * flag	:  true 이면 지정된 날짜 포멧으로 리턴 false이면 기본 날짜 형식으로 리턴
		 ************************************************************************************************************************************************/
		this.getDate = function(flag){
			return self.inst.getDate(flag);
		};

		/************************************************************************************************************************************************
		 * 날자 설정
		 ************************************************************************************************************************************************/
		this.setDate = function(_date){
//			inst.setDateFormat("%Y-%m-%d");
			self.inst.setDate(_date);
		};

		/************************************************************************************************************************************************
		 * 달력 노출 처리
		 ************************************************************************************************************************************************/
		this.showCalendar = function(){
			self.inst.show();
		};

		/************************************************************************************************************************************************
		 * 달력 하단 오늘 버튼 노출
		 ************************************************************************************************************************************************/
		this.showToday = function(){
			self.inst.showToday();
		};

		/************************************************************************************************************************************************
		 * 선택한 날짜 반환
		 ************************************************************************************************************************************************/
		this.onChangeEvt = function(callback){
			self.evIdOnChange = self.inst.attachEvent("onChange", function(date, state){
				callback(self.inst.getDate(true));
			});
		};

		// @desc: 시작일과 종료일 비교.
		// @history: modified by inseok.ra 2019/11. 비교 로직 개선.
		this.compareTo = function(compareS, compareT) {
			let startDate=null;
			let endDate=null;

			self.evIdOnBeforeChange = self.inst.attachEvent("onBeforeChange", function(date) {
				startDate = $("#"+compareS).val();
				endDate = $("#"+compareT).val();
				return true;
			});

			self.evIdOnChange = self.inst.attachEvent("onChange", function(date, state){
				if ($("#"+compareS).val() && $("#"+compareT).val() && $("#"+compareS).val() > $("#"+compareT).val()) {
					window.msg.alert("시작일은 종료일보다 클 수 없습니다.", "알림", null, null, function(){
						$("#"+compareS).val(startDate);
						$("#"+compareT).val(endDate);
					});
				}
			});
		};

		// @desc: unload instance
		// @history:
		this.unload=function() {
			self.inst.detachEvent(self.evIdOnShow);
			self.inst.detachEvent(self.evIdOnChange);
			self.inst.detachEvent(self.evIdOnBeforeChange);
			self.inst.unload();

			self.selfCrear();
		};


		$.extend(dhtmlx, {
			getRawObject: "getRawObject",
			getDate: "getDate",
			setDate: "setDate",
			showCalendar: "showCalendar",
			showToday: "showToday",
			onChangeEvt: "onChangeEvt",
			compareTo: "compareTo",
			unload: "unload"
		});
	}
})(jQuery);