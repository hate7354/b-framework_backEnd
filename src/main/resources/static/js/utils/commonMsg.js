/*
 *
 *	DESC.
 *		메세지박스 처리 (wrap).
 *
 *	HISTORY.
 *
 */
var msg = new function() {};

//
//	DESC.
//		alert message box.
//
//	HISTORY.
//
msg.alert = function(_msg, _title, _btnOk, _type, _callback) {
	if(!_btnOk) {
		_btnOk = "확인";
	}
	$.progressRemove("ALL");
	dhtmlx.alert({
		type: _type,
		title: _title,
		text: _msg,
		ok: _btnOk,
		width: "auto",
		height: "auto",
		callback: function(result) {
			if(_callback) {
				_callback(result);
			}
		}
	});
	//	$(".dhtmlx_modal_box").css("display", "none");
	//	$(".dhtmlx_modal_box").fadeIn().css("display", "inline-block");
};
/**
 * dhtmlx message component - confirm
 *
 * _msg :  출력할 메시지 텍스트 (필수)
 * _btnOk : 버튼 출력 텍스트 (선택)
 * _btnNo : 버튼 출력 텍스트 (선택)
 * _type : confrim 타입 (선택)
 * _title : 타이틀을 출력할 경우(선택)
 **/
msg.confirm = function(_msg, _btnOk, _btnNo, _type, _title, _callback) {
	if(!_btnOk) {
		_btnOk = "OK";
	}
	if(!_btnNo) {
		_btnNo = "OK";
	}
	if(!_type) {
		_type = "OK";
	}
	$.progressRemove("ALL");
	dhtmlx.confirm({
		text: _msg,
		title: _title,
		type: _type,
		ok: _btnOk,
		cancel: _btnNo,
		width: "auto",
		height: "auto",
		callback: function(result) {
			if(_callback) {
				_callback(result);
			}
		}
	});
	//	$(".dhtmlx_modal_box").css("display", "none");
	//	$(".dhtmlx_modal_box").fadeIn().css("display", "inline-block");
}