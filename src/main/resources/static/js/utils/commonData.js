var dataProc = new function() {};

/*
 * parameter를 JSON형식으로도 받을 수 있는 Ajax 함수 (비동기 방식)
 * @param url @param param @param callBack
 */
dataProc.ajaxJson = function(_url, _param, _callBack, _dataType, _progShow) {
	if (_progShow == null || _progShow == true) {
		//if ($.getRefCnt() < 1) { $.progressShow(); }
		$.progressShow();
	}

	//_dataType = _dataType ? _dataType : "json";
	_dataType = "json";
	if (_progShow == null || _progShow == true) {
		g_lLastAccess = (new Date()).getTime(); // login expire time
	}

	$.ajax({url: _url, type: "POST", dataType: _dataType, data: _param, async: true,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("AJAX", "true");
		},
		success: function(result) {
			if (result.result != '99') {
				if (typeof(_callBack) == "function") {
					_callBack(result);
				}
			} else {
				if (result.data && result.data.cause && result.data.cause.message && result.data.cause.message != '') {
					msg.alert(result.data.cause.message, "오류", "확인", "alert");
				} else  if (result.data && result.data.message && result.data.message != '') {
					msg.alert(result.data.message, "오류", "확인", "alert");
				} else {
					msg.alert(result.msg, "오류", "확인", "alert");
				}
			}
			if (_progShow == null || _progShow == true) {
				$.progressRemove("ALL");
			}
		},
		error: function(err) {
			$.progressRemove("ALL");
			if (err.status == '1008' || err.status == '0') {
				$("body").append("<form name=\"logOutForm\" id=\"logOutForm\"></form>");
				$("#logOutForm").attr("method", "POST");
				$("#logOutForm").attr("action", "/logOut.do");
				$("#logOutForm").submit().remove();
			} else {
				if (err.status == '200' && err.statusText == 'parsererror') {
					$("body").append("<form name=\"logOutForm\" id=\"logOutForm\"></form>");
					$("#logOutForm").attr("method", "POST");
					$("#logOutForm").attr("action", "/logOut.do");
					$("#logOutForm").submit().remove();
				} else {
					msg.alert("처리중 예상하지 못한 오류가 발생하였습니다.", "오류", "확인", "alert");
				}
			}
		},
		complete: function() {
			if (_progShow == null || _progShow == true) {
				$.progressRemove("ALL");
			}
		}
	});
};

/*
 * parameter를 JSON형식으로도 받을 수 있는 Ajax 함수 (동기 방식)
 * @param url @param param @param callBack
 */
dataProc.ajaxJsonSync = function(_url, _param, _callBack, _target, _dataType) {
	//if ($.getRefCnt() < 1) { $.progressShow(); }

	_dataType = _dataType ? _dataType : "json";
	g_lLastAccess = (new Date()).getTime(); // login expire time

	$.ajax({url: _url, type: "POST", dataType: _dataType, data: _param, async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("AJAX", "true");
		},
		success: function(result) {
			if (result.result != '99') {
				if (typeof(_callBack) == "function") {
					_callBack(result);
				}
			} else {
				if (result.data && result.data.message && result.data.message != '') {
					msg.alert(result.data.message, "오류", "확인", "alert");
				} else {
					msg.alert(result.msg, "오류", "확인", "alert");
				}
			}
			//$.progressRemove("ALL");
		},
		error: function(err) {
			//$.progressRemove("ALL");
			if (err.status == '1008' || err.status == '0') {
				$("body").append("<form name=\"logOutForm\" id=\"logOutForm\"></form>");
				$("#logOutForm").attr("method", "POST");
				$("#logOutForm").attr("action", "/logOut.do");
				$("#logOutForm").submit().remove();
			} else {
				msg.alert("처리중 예상하지 못한 오류가 발생하였습니다.", "오류", "확인", "alert");
			}
		},
		complete: function() { /*$.progressRemove("ALL");*/ }
	});

};

/*
 * JSON Data를 URL parameter 열로 변환 @param JSONdata
 */
dataProc.getJSONtoRequestParam = function(JSONdata) {
	var paramUrl = new StringBuilder("");
	for (id in JSONdata) {
		if (id == "" || !id) {
			continue;
		}
		paramUrl.append("&" + id + "=" + JSONdata[id]);
	}
	return paramUrl.toString();
};

dataProc.ajaxFromSend = function(url, formName,  callBack) {
	if ($.getRefCnt() < 1) {
		$.progressShow();
	}

	g_lLastAccess = (new Date()).getTime(); // login expire time

	$("#"+formName).attr("enctype", "multipart/form-data");
	$("#"+formName).ajaxForm({url : url, type : "POST",
		beforeSubmit: function (data) {
			return true;
		},
		headers: { "AJAX": "true" },
		success:  function(result) {
			if (result.result != '99') {
				if (typeof(callBack) == "function") {
					callBack(result);
				}
			} else {
				if (result.data && result.data.message && result.data.message != '') {
					msg.alert(result.data.message, "오류", "확인", "alert");
				} else {
					msg.alert(result.msg, "오류", "확인", "alert");
				}
			}
			$.progressRemove("ALL");
		},
		error: function(err) {
			$.progressRemove("ALL");
			if (err.status == '1008') {
				$("body").append("<form name=\"logOutForm\" id=\"logOutForm\"></form>");
				$("#logOutForm").attr("method", "POST");
				$("#logOutForm").attr("action", "/logOut.do");
				$("#logOutForm").submit().remove();
			} else {
				msg.alert("처리중 예상하지 못한 오류가 발생하였습니다.", "오류", "확인", "alert");
			}
		},
		complite: function() {
			$.progressRemove("ALL");
		}
	}).submit();

};





