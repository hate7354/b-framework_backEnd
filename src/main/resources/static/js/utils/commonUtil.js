$.extend({
	// 폼 필수항목 유효성 검사
	// 필수 항목에 class="required" reqName="항목명" 추가.
	// validation 호출시 검사 할 폼아이디 추가.
	// @returns {Boolean}
	validation : function(fId){
		var req = $("#"+fId+" .required");
		var chkCnt = 0;
		var idx = 0;

		if(req.length > 0){
			$(req).each(function(){
				var objType = $(req[idx]);
				var objNm = $(req[idx]).attr("reqName");
				var optVal = $(req[idx]).attr("opt");

				if (typeof(optVal) != 'undefined' && optVal == "yes") {
					idx++;
					return true;
				}

				if(!objNm){
					objNm = objType.parents("td").prev().text();
//					objNm = objType.parents("tr").children()[0].textContent;
				}
				if($(objType).is("INPUT")){
					var val = $(objType).val();
					var valLen = $.trim(val).length;

					if(valLen<1){
						msg.alert(objNm + " 입력하시기 바랍니다.", "알림", null, null, function() { $(objType).focus(); });
						chkCnt++;
						return false;
					}
				}
				if($(objType).is("SELECT")){
					var selIndx = $(objType).prop("selectedIndex");

					if(selIndx == 0){
						msg.alert(objNm + " 입력하시기 바랍니다.", "알림", null, null, function() { $(objType).focus(); });
						chkCnt++;
						return false;
					}
				}
				if($(objType).is(":checkbox")){
			        var data = $(objType).attr("checked");
			        if(!data){
			        	msg.alert(objNm + " 입력하시기 바랍니다.", "알림", null, null, function() { $(objType).focus(); });
				         chkCnt++;
				         return false;
			        }
				}
				if($(objType).is("textarea")){
					var val = $(objType).val();
					var valLen = $.trim(val).length;

					if(valLen<1 || val == "<p><br></p>"){
						msg.alert(objNm + " 입력하시기 바랍니다.", "알림", null, null, function() { $(objType).focus(); });
						chkCnt++;
						return false;
					}
				}
				idx++;
			});
		}

		if(chkCnt==0){
			return true;
		}
	},

	// JQuery의 MultiFile 플러그인을 사용하기 위한 설정값 세팅
	//
	// _inputNm : input name (필수)
	// _listId : 선택된 파일 목록을 보여줄 영역(필수)
	// _max업로드 가능 최대 개수.(선택)
	// _accept : 업로드 가능 파일 확장자. 미지정시 모든 파일 업로드 가능(선택)
	// _maxSize : 최대 업로드 사이즈(선택)
	fileInit : function(_inputNm, _listId, _max, _accept, _maxSize){
		if(!_listId){
			return;
		}
		$("input[name="+_inputNm+"]").MultiFile({
			accept: _accept?_accept:"",
			max : _max != ""?_max :"",
			maxsize : _maxSize?_maxSize:"",
			STRING: {
				remove : "삭제", //추가한 파일 제거 문구, 이미태그를 사용하면 이미지사용가능
				duplicate : "$file 은 이미 선택된 파일입니다.",
				denied : "$ext 는(은) 업로드 할수 없는 파일확장자입니다.",
				selected:'$file 을 선택했습니다.',
				toomany: "업로드할 수 있는 최대 갯수는 $max개 입니다.",
				toobig: "$file 은 크기가 매우 큽니다. (max $size)"
			},
			list:"#"+_listId
		});

	},

	//
	//	DESC.
	//		첨부파일 다운로드
	//
	//	HISTORY.
	//
	fileDownLoad : function(atchFileId, fileSn, fileType){
		$("iframe[name=hiddenFrame]").remove();
		$("#fileDwnFrm").remove();
		$("body").append("<iframe name=\"hiddenFrame\" src=\"\" width=\"0\" height=\"0\" frameborder=\"0\" scrolling=\"no\"></iframe>");
		$("body").append("<form name=\"fileDwnFrm\" id=\"fileDwnFrm\"></form>");

		$("#fileDwnFrm").append("<input type=\"hidden\" name=\"atchFileId\" value=\""+atchFileId+"\"/>");

		if (fileSn){
			$("#fileDwnFrm").append("<input type=\"hidden\" name=\"fileSn\" value=\""+fileSn+"\"/>");
		}
		if (fileType)
			$("#fileDwnFrm").append("<input type=\"hidden\" name=\"fileType\" value=\""+fileType+"\"/>");

		var url = "/cmm/fileDown.do";
		$("#fileDwnFrm").attr("method", "POST");
		$("#fileDwnFrm").attr("target", "hiddenFrame");
		$("#fileDwnFrm").attr("action", url);
		$("#fileDwnFrm").submit().remove();

		g_lLastAccess = (new Date()).getTime();
	},

	// 다중 첨부파일 다운로드
	multiFileDownLoad : function(ids){
		$("iframe[name=hiddenFrame]").remove();
		$("#fileDwnFrm").remove();
		$("body").append("<iframe name=\"hiddenFrame\" src=\"\" width=\"0\" height=\"0\" frameborder=\"0\" scrolling=\"no\"></iframe>");
		$("body").append("<form name=\"fileDwnFrm\" id=\"fileDwnFrm\"></form>");

		$.each(ids, function(idx){
			$("#fileDwnFrm").append("<input type=\"hidden\" name=\"ids\" value=\""+ids[idx].atchFileId+":"+ids[idx].fileSn+"\"/>");
		});

		var url = "/cmm/multiFileDown.do";
		$("#fileDwnFrm").attr("method", "POST");
		$("#fileDwnFrm").attr("action", url);
		$("#fileDwnFrm").attr("target", "hiddenFrame");
		$("#fileDwnFrm").submit().remove();

		g_lLastAccess = (new Date()).getTime();
	},

	//
	//	DESC.
	//		첨부파일 다운로드
	//
	//	HISTORY.
	//
	extEvidFileDownLoad : function(fileId){
		$("iframe[name=hiddenFrame]").remove();
		$("#fileDwnFrm").remove();

		$("body").append("<iframe name=\"hiddenFrame\" src=\"\" width=\"0\" height=\"0\" frameborder=\"0\" scrolling=\"no\"></iframe>");
		$("body").append("<form name=\"fileDwnFrm\" id=\"fileDwnFrm\"></form>");
		$("#fileDwnFrm").append("<input type=\"hidden\" name=\"fileId\" value=\""+fileId+"\"/>");
		$("#fileDwnFrm").attr("method", "POST");
		$("#fileDwnFrm").attr("target", "hiddenFrame");
		$("#fileDwnFrm").attr("action", "/extEvid/extEvidFileDownload.do");
		$("#fileDwnFrm").submit().remove();

		g_lLastAccess = (new Date()).getTime();
	},

	// @desc: 1개 이상의 증적파일 다운로드
	// @history:
	extEvidFilesDownLoad : function(fileIds) {
		const param = { fileId: fileIds, mode: "compress" };
		window.dataProc.ajaxJson("/extEvid/extEvidFileDownload.do", param, function(result) {
			if (result.msg != "FAIL") {
				$("iframe[name=hiddenFrame]").remove();
				$("#fileDwnFrm").remove();
				$("body").append("<iframe name=\"hiddenFrame\" src=\"\" width=\"0\" height=\"0\" frameborder=\"0\" scrolling=\"no\"></iframe>");
				$("body").append("<form name=\"fileDwnFrm\" id=\"fileDwnFrm\"></form>");
				$("#fileDwnFrm").append("<input type=\"hidden\" name=\"zipName\" value=\"" + result.msg + "\"/>");
				$("#fileDwnFrm").append("<input type=\"hidden\" name=\"mode\" value=\"download\"/>");
				$("#fileDwnFrm").attr("method", "POST");
				$("#fileDwnFrm").attr("target", "hiddenFrame");
				$("#fileDwnFrm").attr("action", "/extEvid/extEvidFileDownload.do");
				$("#fileDwnFrm").submit().remove();
			}
		});
	},


	//
	//	DESC.
	//		조회된 그리드 데이터 다운로드.
	//
	//	HISTORY.
	//
	excelDownloadForGridData : function(txtTitle, headData, columnWidth, dataId, gridData) {

		$("iframe[name=hiddenFrame]").remove();
		$("#fileDwnFrm").remove();

		$("body").append("<iframe name=\"hiddenFrame\" src=\"\" width=\"0\" height=\"0\" frameborder=\"0\" scrolling=\"no\"></iframe>");
		$("body").append("<form name=\"fileDwnFrm\" id=\"fileDwnFrm\"></form>");
		$("#fileDwnFrm").append("<input type=\"hidden\" name=\"txtTitle\" value=\"" + txtTitle + "\"/>");
		$("#fileDwnFrm").append("<input type=\"hidden\" name=\"gridData\" value=\"" + gridData + "\"/>");
		$("#fileDwnFrm").append("<input type=\"hidden\" name=\"headData\" value=\"" + headData + "\"/>");
		$("#fileDwnFrm").append("<input type=\"hidden\" name=\"columnWidth\" value=\"" + columnWidth + "\"/>");
		$("#fileDwnFrm").append("<input type=\"hidden\" name=\"dataId\" value=\"" + dataId + "\"/>");

		$("#fileDwnFrm").attr("method", "POST");
		$("#fileDwnFrm").attr("target", "hiddenFrame");
		$("#fileDwnFrm").attr("action", "/cmm/gridDataExcelDownload.do");
		$("#fileDwnFrm").submit().remove();

		g_lLastAccess = (new Date()).getTime();
	},

	//
	// 	DESC.
	// 		컴플라이언스 데이터 엑셀 다운로드.
	//
	// 	HISTORY.
	//
	excelDownloadForCompData: function(compName, compCode, maVer, miVer) {
		const param = {
			mode: 'CREATE',
			compNm: compName,
			compCode: compCode,
			maVer: maVer,
			miVer: miVer
		};
		window.dataProc.ajaxJson("/cmm/excelDownloadForCompData.do", param, function(query) {
			if (query.result == '0') {
				const filePath = query.data.filePath;
				const fileName = query.data.fileName;

				$("iframe[name=hiddenFrame]").remove();
				$("#fileDwnFrm").remove();
				$("body").append("<iframe name=\"hiddenFrame\" src=\"\" width=\"0\" height=\"0\" frameborder=\"0\" scrolling=\"no\"></iframe>");
				$("body").append("<form name=\"fileDwnFrm\" id=\"fileDwnFrm\"></form>");
				$("#fileDwnFrm").append("<input type=\"hidden\" name=\"mode\" value=\"DOWNLOAD\"/>");
				$("#fileDwnFrm").append("<input type=\"hidden\" name=\"filePath\" value=\"" + filePath + "\"/>");
				$("#fileDwnFrm").append("<input type=\"hidden\" name=\"fileName\" value=\"" + fileName + "\"/>");
				$("#fileDwnFrm").attr("method", "POST");
				$("#fileDwnFrm").attr("target", "hiddenFrame");
				$("#fileDwnFrm").attr("action", "/cmm/excelDownloadForCompData.do");
				$("#fileDwnFrm").submit().remove();

				g_lLastAccess = (new Date()).getTime();
			}
		});
	},

	//
	// 공통코드 조회
	//
	// param
	// clCdId : 대분류 아이디(필수)
	// code : 중분류 코드(선택)
	//
	// --- 아래 항목의 값이 존재하는 경우 옵션을 추가한다.
	// target : 콤보박스를 생성할 위치 아이디(선택)
	// level : 보여줄 코드 분류(sub : 중분류, dtl : 상세코드)
	// val : 검색시 코드 선택 값
	//
	commCodeSingle: function(clCodeCd, codeCd, target, level, val) {
		var codeData = "";

		dataProc.ajaxJsonSync("/cmm/selectListByCode", { "clCodeCd": clCodeCd, "codeCd": codeCd, useYn: "Y"}, function(result) {
			if (result.msg == "SUCCESS") {
				codeData = result.data;

				if (target) {
					var data = "";

					if (level == "sub") {
						data = result.data.cdList;
					}
					else if (level == "dtl") {
						data = result.data.cdDtlList;
					}

					var comboCodeHtml = "";

					// 상세코드 값이 있는 경우
					if (data != null && data != "undefined") {
						if (data.length > 0) {
							$.each(data, function(key, value) {
								if (level == "sub") {
									comboCodeHtml +="<option value=\""+value.codeCd+"\">"+value.codeNm+"</option>";
								}
								else if (level == "dtl") {
									comboCodeHtml +="<option value=\""+value.codeDetailCd+"\">"+value.codeDetailNm+"</option>";
								}
							});
						}
					}
					$("#"+target).append(comboCodeHtml);

					$("#commboArea select").bind("mouseover", function() {
						$(this).attr("title", this.selectedOptions[0].innerHTML);
					});

					$("#"+target).val(val).trigger("change");
				}
			}
		});
		return codeData;
	},

	// @desc: 담당자 팝업 호출
	// @history:
	usrSinglePopup: function(_param, _fadeIn) {
		var param = [{
			popupId: "popupNth",
			id: "userPopup",
			width: 600,
			height: 573,
			text: "사용자 검색"
		}];
		window.dhtmlxWnd = new DHTMLX.Window("s_main", param);
		window.dhtmlxWnd.fnCbOnSetUser = _param.fnCallback;
		window.dhtmlxWnd.gvarInputId = _param.btnId;
		window.dhtmlxWnd.gvarInitDefaultDpt = _param.loginDptId;
		window.dhtmlxWnd.loadUrl("userPopup", "/cmm/usrSinglePopup.do", true, _param);
		window.dhtmlxWnd.setModal("userPopup", _fadeIn);
	},

	// @desc: 담당자 팝업 호출
	// @history:
	usrMultiPopup : function(_param, _fadeIn){
		var param = [{
			popupId: "popupNth",
			id: "usrMultiPopup",
			width: 1000,
			height: 573,
			text: "사용자 검색"
		}];
		window.dhtmlxWnd = new DHTMLX.Window("s_main", param);
		window.dhtmlxWnd.fnCbOnSetMultiUser = _param.fnCallback;
		window.dhtmlxWnd.gvarInputId = _param.btnId;
		window.dhtmlxWnd.gvarInitDefaultDpt = _param.loginDptId;
		window.dhtmlxWnd.loadUrl("usrMultiPopup", "/cmm/usrMultiPopup.do", true, _param);
		window.dhtmlxWnd.setModal("usrMultiPopup", _fadeIn);
	},

	// @desc: 부서검색 팝업 호출
	// @history:
	dptPopup : function(_param, _fadeIn){
		var param = [{
			popupId: "popupNth",
			id: "dptPopup",
			width: 600,
			height: 570,
			text: "부서 검색"
		}];
		window.dhtmlxWnd = new DHTMLX.Window("s_main", param);
		window.dhtmlxWnd.fnCbOnSetDepartment = _param.fnCallback;
		window.dhtmlxWnd.gvarInputId = _param.btnId;
		window.dhtmlxWnd.loadUrl("dptPopup", "/cmm/selectDptPop.do", true, _param);
		window.dhtmlxWnd.setModal("dptPopup", _fadeIn);
	},

	//
	// 폼의 input, select, textarea object 정보를 리턴한다.
	// @param formObj - 해당 Form Object
	//
	getFormData : function (formObj){
		var param = {};

		$.each($(formObj).find("INPUT, TEXTAREA, SELECT"), function(idx, val){
			var tagName = $(this).prop("tagName").toUpperCase();
			if (!this.disabled) {
				if (tagName == "INPUT") {
					if (this.type == "text") {
						if ($(this).attr("class") != null && $(this).attr("class").indexOf( "hasDatepicker") >= 0) {
							param[this.name] = $(this).val().replace(/\//g, '');
						} else {
							param[this.name] = this.value;
						}
					} else if (this.type == "radio") {
						if (this.checked) {
							param[this.name] = this.value;
						}
					} else if (this.type == "checkbox") {
						if (this.checked) {
							var arrChkbox = new Array();
							if (!common.isEmpty(param[this.name])) {
								arrChkbox = param[this.name];
							}

							arrChkbox.push(this.value);
							param[this.name] = arrChkbox;
						}
					} else {
						if (typeof(param[this.name]) == 'undefined' || param[this.name] == '') {
							param[this.name] = this.value;
						} else {
							param[this.name] += ',' + this.value;
						}
					}
				} else {
					param[this.name] = this.value;
				}
			}
		});

		return param
	},

	//
	// 스크롤 화면에서 특정영역이 벗어났는지 체크
	// 스크롤 되어 화면에서 보이지 않으면 true 화면에 보이면 false
	//
	isScrollOver:function(elem){
//	    var $elem = $("#"+elem);
//	    var $window = $(window);
//	    if($elem.length > 0){
//		    var docViewTop = $window.scrollTop();
//		    var docViewBottom = docViewTop + $window.height();
//
//		    var elemTop = $elem.offset().top;
//		    var elemBottom = elemTop + $elem.height();
//
//		    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
//	    }else{
//	    	return true;
//	    }
	},
	// 오늘 날짜 가져오기(YYYY-MM-DD)
	getToday:function(_inTime, _date){
		var d;
		if(_date){
			d = _date;
		}else{
			d = new Date();
		}

	    year  = d.getFullYear();
	    month = d.getMonth()+ 1;
	    month = month.toString().length > 1 ? month : '0'+month;
	    day   = d.getDate();
	    day   = day.toString().length > 1 ? day : '0'+day;
	    hh	  = d.getHours();
	    mm    = d.getMinutes().length > 1 ? d.getMinutes() : '0'+d.getMinutes();

	    if(_inTime){
	    	return year+"-"+month+"-"+day+" "+hh+":"+mm;
	    }else{
	    	return year+"."+month+"."+day;
	    }
	},

	/**
	 * @desc: 로딩 화면 show
	 * @history:
	 */
	progressShow:function(text, target) {

		if (globalRef++ == 0) {
			var popHtml = "<div id=\"loadProgress\" class=\"modal\" style=\"display:block; position:absolute; \">"
					 	+ "    <div class=\"modal-backdrop\">"
					 	+ "        <div class=\"modal-loading progress\">"
					 	+ "            <img src=\"/images/loading.gif\" style=\"height:70px;\">"
					 	+ "        </div>"
					 	+ "    </div>"
					 	+ "</div>";

			var elem = document.getElementById('progress_mcover');
			if (elem == null) {
				var iDiv = document.createElement('div');
				iDiv.id = 'progress_mcover';
				iDiv.className = 'progress_mcover';
				document.getElementsByTagName('body')[0].appendChild(iDiv);
				$("#progress_mcover").append(popHtml);
			}

			window.g_wcTimeoutId = window.setTimeout($.callbackTimeout, 300000);
		}
	},

	//
	// 로딩화면 hide
	//
	progressRemove:function(clearOpt) {
		if (globalRef != 0 && --globalRef == 0) {
			$("#progress_mcover").remove();
			if (window.g_wcTimeoutId != null) {
				window.clearTimeout(window.g_wcTimeoutId);
				window.g_wcTimeoutId = null;
			}
		} else if (clearOpt == 'ALL') {
			globalRef = 0;
			$("#progress_mcover").remove();
			if (window.g_wcTimeoutId != null) {
				window.clearTimeout(window.g_wcTimeoutId);
				window.g_wcTimeoutId = null;
			}
		}
	},
	getRefCnt : function() {
		return globalRef;
	},

	/**
	 * @desc: timeout function
	 * @history:
	 */
	callbackTimeout: function() {
		window.g_wcTimeoutId = null;
		$.progressRemove('ALL');
	},

	//
	// form.serialize data change
	//
	changeSerialize:function(seializeData, key, val) {
		var found = false;

		for (i = 0; i < seializeData.length && !found; i++) {

			if (seializeData[i].name == key) {
				seializeData[i].value = val;
				found = true;
			}
		}
		if(!found) {
			seializeData.push(
				{
					name: key,
					value: val
				}
			);
		}
		return seializeData;
	},

	// created by inseok.ra
	convert6HexClr:function(hexClr) {
		var value = hexClr.replace("#", "");
		value = value.match(/[a-f\d]/gi);

		if (value == null || (value.length != 3 && value.length != 6)) {
			return "";
		}

		if (value.length == 3) {
			value = (value[0]+value[0]+value[1]+value[1]+value[2]+value[2]).toString();
		} else {
			value = value.join('');
		}
		return ('#'+value);
	},

	/**
	 * @desc: 접근권한 확인
	 * @history:
	 */
	checkAuthMenu: function(url) {
		var retVal=true;
		window.dataProc.ajaxJsonSync("/cmm/checkAuthMenu.do",
				{menuUrl: url}, function(query) {
			if (query.result != '0') { retVal = false; }
		});
		if (!retVal) { window.msg.alert("접근 권한이 없습니다.", "알림"); }
		return retVal;
	},

	/**
	 * @desc: string Sanitize
	 * @history:
	 */
	sanitize: function(data) {
		if (typeof data != 'string') {
			return data;
		}

		var text = String(data);
		var value = text.replace(/<script.*?>.*?<\/script.*?>/gi, '')
						.replace(/<.*?javascript:.*?>.*?<\/.*?>/gi, '')
						.replace(/<.*?\\s+on.*?>.*?<\/.*?>/gi, '');
		return value;
	},
});

var globalRef = 0;
var waitCursorInst = null;


//
// 스크롤 화면에서 특정영역이 벗어났는지 체크
// 스크롤 되어 화면에서 보이지 않으면 true 화면에 보이면 false
//
$.fn.isVisible = function(elem){
	try{
		 var $p = $(elem);
		    var ph = $p.height();
		    var pt = $p.offset().top;
		    var top = $(this).offset().top;
		    if(top >= pt && top < (pt + ph)){
		    	return true;
		    }
			 return false;
	}catch(e){

	}
},

$.fn.hasVerticalScrollbar = function() {
	return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
}

var common = function() {};


//
// JSON으로 된 Data를 form에 보여준다. - JQuery 방식
// @param data
// @param formID
//
common.setFormData = function (data, formID) {
	var formObj = null;

	if (common.isEmpty(formID)) {
		formObj = $(document);
	}
	else {
		formObj = $("#" + formID);
	}

	for ( id in data ) {
		try {
			if (formObj.find("#" + id).length == 0)
				continue;

			tagName = formObj.find("#" + id).prop('tagName').toUpperCase();

			if ( tagName == "SELECT" ) {
				formObj.find("#" + id).val(data[id]);
			}
			else if ( tagName == "SPAN" ){
				formObj.find("#" + id).html(data[id]);
			}
			else if ( tagName == "TEXTAREA" ){
				formObj.find("#" + id).val(data[id]);
			}
			else if ( tagName == "A" ){
				formObj.find("#" + id).prop("href", data[id]);
			}
			else if ( tagName == "INPUT" ) {
				if ( formObj.find("#" + id).prop('type') == "checkbox" || formObj.find("#" + id).prop('type') == "radio" ) {
					$("#" + id + "[value=" + data[id] + "]").prop("checked", "checked");
				}
				else {
					formObj.find("#" + id).val(data[id]);
				}
			}
			else {
				formObj.find("#" + id).val(data[id]);
			}
		}
		catch (exception) {
			if ( window.console) console.log(exception);
		}
	}
}


//
// 값이 숫자로만 되어있는지 체크
// @param chkStr - 체크할 문자열
// @returns {Boolean}
//
common.isNumberCheck = function (chkStr) {
	var num_check=/^[0-9]*$/;

	if(num_check.test(chkStr)) return true;
	return false;
};

//
// 값이 정수와 실수로만 되어있는지 체크
// @param chkStr - 체크할 문자열
// @returns {Boolean}
//
common.isFloatCheck = function (chkStr) {
	var num_check=/^[+-]?\d*(\.?\d*)$/;

	if(num_check.test(chkStr)) return true;
	return false;
};



//
// 성명 입력값 체크
// @param _value - 체크 문자열
//
common.validationName = function(_value) {
	var patternrepWri = /[^(a-zA-Z가-힝\s)]/;
    if (patternrepWri.test(_value)) {
    	return false;
    }
    return true;
};

//
// 바이트 체크 With Max Length 체크
// @param obj - 입력 Object ID
// @param maxLength - 최대 입력가능 길이 ( Byte )
// @param title - 항목이름
// @param byteFieldName - 입력된 문자열의 Byte 값을 표시할 Object ID [ 옵션 ]
//
common.checkByte = function(obj, maxLength, title, byteFieldName) {
	var val = obj.value;
	var li_str_len = val.length;
	var li_max = maxLength;

	var i = 0;
	var li_byte = 0;
	var li_len = 0;
	var ls_one_char = "";

	for(i=0; i< li_str_len; i++)
	{
  ls_one_char = val.charAt(i);
  if (escape(ls_one_char).length > 4) {
  li_byte += 2;
  }else{
  li_byte++;
  }
  if(li_byte <= li_max){
  li_len = i + 1;
  }
	}
	if(li_byte > li_max){
  popup.message(title + "는" + maxLength+" byte이상 내용을\n입력하실 수 없습니다.");
  obj.value = val.substr(0, li_len);
  obj.focus();
	} else {
  if( byteFieldName != undefined ) {
  $("#" + byteFieldName).text(li_byte);
  }
	}
};

//
// 공백인지 확인
// @param _value - 체크 문자열
//
common.isEmpty = function( _value ) {
	if(_value == undefined || typeof _value == "undefined" || _value == null){
  return true;
	}

	if(typeof _value != "object" && typeof _value != "function"){
  if(jQuery.trim(_value).replace(/\s/g,"") === "" ) {
  return true;
  }
	}

    return false;
};

//
// 공백제거
// @param _value - 체크 문자열
//
common.removeSpace = function( _value ) {
	if( _value == undefined ) {
  return "";
	}
    return _value.replace(/\s/g,"");
};


//
// 오늘날짜와 차이 계산
//
// @param _y - 년
// @param _m - 월
// @param _d - 일
//
common.CalcDate = function(_y, _m, _d){

	var today = new Date();
	var y = today.getFullYear();
	var m = today.getMonth() + 1;
	var d = today.getDate();

    var date1 = new Date(parseInt( y),parseInt( m)-1,parseInt( d));
    var date2 = new Date(parseInt(_y),parseInt(_m)-1,parseInt(_d));

    var getDiffTime = date1.getTime() - date2.getTime();
    var passDate = Math.floor(getDiffTime / (1000 * 60 * 60 * 24));

    return passDate;
};

//
// 바이트로 글자 자르기
//
// @param str - 대상 문자열
// @param limit - 허용 문자 길이
//
common.cutStr = function(str,limit){
	var tmpStr = str;
	var byte_count = 0;
	var len = str.length;
	var dot = "";

	for( var i=0; i<len; i++ ) {
  byte_count += common.chr_byte(str.charAt(i));
  if(byte_count == limit-1){
  if(common.chr_byte(str.charAt(i+1)) == 2){
  tmpStr = str.substring(0,i+1);
  dot = "....";
  } else {
  if(i+2 != len) dot = "....";
  tmpStr = str.substring(0,i+2);
  }
  break;
  } else if ( byte_count == limit) {
  if(i+1 != len) dot = "....";
  tmpStr = str.substring(0,i+1);
  break;
  }
	}

	return tmpStr+dot;
};

//
// 글자의 바이트 계산
//
// @param str - 대상 문자열
//
common.byteLength = function(str){
	if(escape(str).length > 4)
  return 2;
	else
  return 1;
};

//
// 문자열을 더할때 중간에 ,를 삽입한다.
// @param addValue - 목적 문자열
// @param strValue - 붙일 문자열
// @returns
//
common.addCommaString = function(addValue, strValue) {
	if ( addValue == "" ) {
  addValue = strValue;
	} else {
  addValue += "," + strValue;
	}

	return addValue;
}

function StringBuilder(strValue) {
	this.strings = new Array("");
	this.append(strValue);
}

StringBuilder.prototype.append = function (value) {
    if (value) {
        this.strings.push(value);
    }
};

StringBuilder.prototype.clear = function () {
    this.strings.length = 1;
};

StringBuilder.prototype.toString = function () {
    return this.strings.join("");
};


//
// 현재 년월에 대한 첫번째 날짜 구하기
//
common.getFirstDay = function(){
	var today = new Date();
	var y = today.getFullYear();
	var m = today.getMonth() + 1;
	var firstDay = new Date(y, today.getMonth(), 1);
	var d = firstDay.getDate();

	if ( m < 10  ) {
		m = "0" + m;
	}

	if ( d < 10 ) {
		d = "0" + d;
	}

	return y + "/" + m + "/" + d;
};

//
// 현재 년월에 대한 마지막 날짜 구하기
//
common.getLastDay = function(){
	var today = new Date();
	var y = today.getFullYear();
	var m = today.getMonth() + 1;
	var firstDay = new Date(y, m, 0);
	var d = firstDay.getDate();

	if ( m < 10  ) {
  m = "0" + m;
	}

	if ( d < 10 ) {
  d = "0" + d;
	}

	return y + "/" + m + "/" + d;
}

//
// 이메일 정규식 체크
//
common.regExpEmail = function(email){
	var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

	return regExp.test(email);
}

//
//	DESC.
//		검색처리 후 색상변경.
//
//	HISTORY.
//
jQuery.fn.highlight = function(pat, mapData) {
	var srchIndex = -1;

	function innerHighlight(node, pat) {
		var skip = 0;
		if (node.nodeType == 3) {
			var pos = node.data.toUpperCase().indexOf(pat);
			pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);

			if (pos >= 0) {
				srchIndex ++;

				var spannode = document.createElement('span');
				spannode.setAttribute("id", srchIndex);
				spannode.className = 'highlight';

				var middlebit = node.splitText(pos);
				var endbit = middlebit.splitText(pat.length);
				var middleclone = middlebit.cloneNode(true);

				var pId;
				if (node.parentNode.tagName == 'DL') {
					pId = node.parentNode.id;
				}
				else if (node.parentNode.parentNode.tagName == 'DL') {
					pId = node.parentNode.parentNode.id;
				}
				else if (node.parentNode.parentNode.parentNode.tagName == 'DL') {
					pId = node.parentNode.parentNode.parentNode.id;
				}

				mapData.set(srchIndex, pId);

				spannode.appendChild(middleclone);
				middlebit.parentNode.replaceChild(spannode, middlebit);
				skip = 1;
			}
		}
		else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
			for (var i = 0; i < node.childNodes.length; ++i) {
				i += innerHighlight(node.childNodes[i], pat);
			}
		}
		return skip;
	}

	return this.length && pat && pat.length ? this.each(function() {
		innerHighlight(this, pat.toUpperCase());
	}) : this;
};


//
//	DESC.
//		검색처리된 정보 삭제.
//
//	HISTORY.
//
jQuery.fn.removeHighlight = function() {
	return this.find("span.highlight").each(function() {
		this.parentNode.firstChild.nodeName;
		with (this.parentNode) {
			replaceChild(this.firstChild, this);
			normalize();
		}
	}).end();
};


