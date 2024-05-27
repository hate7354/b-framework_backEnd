/**
 *	@desc: FuncWorkScheduled constructor
 *	@param: none
 *	@return: pageWindow object
 *	@type: public
 */
function FuncWorkScheduled() {
	let self=this;
	this.selfClear=function() {
		for (var c in self) {
			self[c] = null;
	    } self=null;
	    window.workScheduled=null;
		window.FuncWorkScheduled=null;
	};
};

/**
 *	@desc: pageWindow prototype
 *	@type: public
 */
FuncWorkScheduled.prototype = {
	// @desc: initialize window
	onInitWindow: function() {
	},
	
};



/**
 * 보안업무 스케쥴 동적 처리 자바스크립트
 * 
 * @history: 2024.03, 최초작성
 */
(function() {
	window.workScheduled = new FuncWorkScheduled();
	window.setTimeout(function() {
		window.workScheduled.onInitWindow();
	});
})();


