(function($) {
	$.extend(true, window, {
		DHTMLX : {
			Chart : dhtmlx
		}
	});

	/**
	 * 차트 초기화
	 *
	 * 각 항목의 설명을 참고하되 각 항목 설정값에 대한 부분은 dhtmlx에서 제공하는 API를 참고하세요.
	 *
	 * container	: 차트 구성 영역 아이디(필수)
	 * chartType	: 차트 타입(필수 : bar, barH, stackedBar, stackedBarH, line, spline, area, stackedArea, pie, pie3D, donut, radar, scatter)
	 * valueId		: 데이터 필드 아이디
	 * label		: 그래프에 보여줄 필드 아이디(선택 : 데이터 값 또는 구분 값 등)
	 * tooltip		: 그래프에 마우스 오버시 툴팁 적용(선택 : true, false)
	 * xParam		: x축의 타이틀, 척도 등을 구성하는 데이터 ex) {title:"Sales per year", template:"#year#", lines:true }
	 * yParam		: y축의 타이틀, 척도 등을 구성하는 데이터 ex) {title : "scale", start : 0, step : 10, end:100, template : function(obj){return (obj%20?"":obj)}}
	 * legendParam	: 범례 구성 데이터 ex) {align: "right", valign: "top", template: "#year#"}
	 */
	function dhtmlx(container, chartType, valueId, label, tooltip, xParam, yParam, legendParam) {
		var self=this;
		this.selfCrear=function() {
			for (var c in self) {
				self[c] = null;
			} self = null;
			//for (var c in this) { this[c] = null; }
		};

		this.evIdItemClick=null;

		this._chart = new dhtmlXChart({
				  container	: container
				, view		: chartType
				, value		: valueId
				, label		: label ? value : null
				, tooltip	: { template : tooltip ? value : null }
				, xAxis		: xParam
				, yAxis		: yParam
				, legend	: legendParam
		});

		/**
		 * 차트 데이터 세팅
		 *
		 * chartData	: 차트를 구성할 데이터 셋(필수 ex : [{"data":"value},...])
		 * values		: 차트 구성 컬럼
		 * dataType		: 데이터 셋의 자료구조(선택 기본값 :  json)
		 */
		this.loadData = function(chartData, values, dataType){
			self._chart.clearAll();
			dataType = dataType ? dataType : "json";
			$.each(values, function(idx){
				self._chart.addSeries(values[idx]);
			});
			self._chart.parse(chartData, dataType);
		};

		// @desc: 선택한 그래프의 데이터 조회
		this.getData = function(id) {
			return self._chart.get(id);
		};

		// @desc:
		this.onClick = function(callback){
			self.evIdItemClick = self._chart.attachEvent("onItemClick", function(id, evt, target) {
				callback(id, evt, target);
			});
		};

		// @desc:
		this.getRawObject = function(){
			return self._chart;
		};

		// @desc: unload instance
		// @history:
		this.unload=function() {
			self.evIdItemClick && self._chart.detachEvent(self.evIdItemClick);
			self._chart.clearCanvas();
			self._chart.destructor();
			self.selfCrear();
		};

		$.extend(dhtmlx, {
			  loadData: "loadData",
			  onClick: "onClick",
			  getData: "getData",
			  getRawObject: "getRawObject",
			  unload: "unload"
		});
	}
})(jQuery);
