
// @desc: 콤보박스 공통모듈
// @history:
//		정귀재 2019년도 최초작성
//		2020~2021/04 modified by inseok.ra 메모리회수 불능 및 다발성 오류로 전체적으로 수정.
//			기존 및 신규 javascript code들이 문제 없이 참조할 수 있도록 수정.

(function($) {

	$.extend(true, window, {
		DHTMLX : {
			Combo : dhtmlx
		}
	});

	/**
	 * dhtmlxCombo 생성
	 *
	 * container	: 콤보박스를 설정할 div 아이디(필수)
	 * name			: 콤보박스 이름(필수)
	 * width		: 콤보박스 가로사이즈(선택)
	 * initData		: 초기 설정 데이터(선택)
	 */
	function dhtmlx(container, name, width, initData) {
		let self=this;
		// @desc: clear
		// @type: private
		this.selfCrear=function() {
			for (let c in self) {
				self[c] = null;
			} self = null;
		}

		this.dhxCombo = new dhtmlXCombo(container, name, width);

		if (initData != null && initData != undefined){
			this.dhxCombo.addOption(initData);
		}

		// @desc: 데이터 로드
		// @type: public
		this.loadData = function(comboData, callback){
			$.each(comboData, function(idx){
				self.dhxCombo.addOption(comboData[idx].cdDtId, comboData[idx].codeDetailNm);
			});
		}

		// @desc: get dhtmlx combo object
		// @type: public
		this.getRawObject = function(){
			return self.dhxCombo;
		}

		// @desc: combo destructor
		// @type: public
		this.destructor=function() {
			self.dhxCombo.unload();
			self.selfCrear();
		}

		$.extend(this, {
			loadData: "loadData",
			getRawObject: "getRawObject",
			destructor: "destructor"
		});
	}
})(jQuery);
