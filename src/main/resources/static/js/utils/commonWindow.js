// @desc: 팝업 윈도우 공통모듈
// @history:
//		정귀재 2020년도 최초작성
//		modified by inseok.ra 메모리회수 불능 및 다발성 오류로 전체적으로 수정.
//			기존 및 신규 javascript code들이 문제 없이 참조할 수 있도록 수정.
'use strict';
(function($) {
	$.extend(true, window, { DHTMLX : { Window : dhtmlx } });

	function dhtmlx(_target, _param) {
		var self=this;
		this.selfCrear=function() {
			for (var c in self) {
				self[c] = null;
			} self = null;
		}

		this.callback = null;
		this.callbackArg = null;
		this.wndId = null;
		this.scrollTop = 0;
		this.winInst = null;
		this.arrParma = [];
		this.popupId = null;
		this.evId=null;
		this.instance=null;


		_param instanceof Array ? self.arrParma = _param : self.arrParma[0] = _param;

		self.wndId = self.arrParma[0].id;
		var height = self.arrParma[0].height;
		height != null && (document.documentElement.clientHeight < (height + 100)) &&
		(self.arrParma[0].height = document.documentElement.clientHeight - 100);

		self.winInst = new dhtmlXWindows();
		self.winInst.createWindow(
				self.wndId,
				(window.innerWidth-self.arrParma[0].width)/2,
				(window.innerHeight-self.arrParma[0].height)/2,
				self.arrParma[0].width,
				self.arrParma[0].height
		);
		self.winInst.window(self.wndId).setText(self.arrParma[0].text);
		self.winInst.window(self.wndId).denyResize();

		self.arrParma[0].callback && (self.callback = self.arrParma[0].callback);
		self.arrParma[0].callbackArg && (self.callbackArg = self.arrParma[0].callbackArg);
		self.arrParma[0].popupId && (self.popupId = self.arrParma[0].popupId);

		// @desc: set instance
		// @history: 20021/04
		this.setInstance=function(inst) {
			self.instance=inst;
		}

		//	@desc: url로 팝업 호출
		//	@history:
		this.loadUrl = function(_winId, _url, _type, _param) {
			$.progressShow();
			if (_param == null) { _param = {}; }

			self.winInst.window(self.wndId).attachURL(_url, _type, _param);
			self.winInst.window(self.wndId).button("stick").hide();
			self.winInst.window(self.wndId).button("park").hide();
			self.winInst.window(self.wndId).button("minmax").hide();
			self.winInst.window(self.wndId).button("help").hide();
		}

		//	@desc: html로 팝업 호출
		//	@history:
		this.loadHtml = function(_winId, _html) {
			self.winInst.window(self.wndId).attachHTMLString(_html);
		}

		//	@desc: return windows instance.
		//	@history :
		this.getRawObject = function() {
			return self.winInst;
		}

		// @desc: get dhtmlx window id
		this.getWndId=function() {
			return self.wndId;
		}

		/**
		 * @desc: set popup ID
		 * @history:
		 */
		this.setPopupId=function(popupId) {
			self.popupId = popupId;
		}

		//	@desc: 팝업 (modal)
		//	@history:
		this.setModal = function(_winId, fadeIn) {
			self.winInst.window(self.wndId).setModal(true);

			if ($(".dhxwin_active").length == 1) {
				if ($(document).height() > $(window).height()) {
					window.scrollDefend=true;
					var width = document.body.clientWidth;
					self.scrollTop = $(document).scrollTop();
					document.getElementsByTagName('body')[0].style.overflowY = 'scroll';
					document.getElementsByTagName('body')[0].style.width = width+"px";
					document.getElementsByTagName('body')[0].style.top = "-"+self.scrollTop+"px";
					document.getElementsByTagName('body')[0].style.position = 'fixed';
				} else {
					window.scrollDefend=false;
				}
			}

			// modified 2021/03/11
			if ($(".dhxwin_active").length > 1) {
				window.scrollDefend && jQuery('.dhxwins_vp_material').css("position", "relative");
			}
			self.evIdContentLoaded = self.winInst.attachEvent("onContentLoaded", function(win) {
				self.winInst.detachEvent(self.evIdContentLoaded);
				window.scrollDefend && jQuery('.dhxwins_vp_material').css("position", "fixed");

				$.progressRemove();
			});
		}

		//	@desc: 팝업 닫기
		//	@history:
		this.setClose = function(_winId) {
			self.winInst.window(self.wndId).close();

			if ($(".dhxwin_active").length<1) {
				$("body").removeClass("dhxwins_vp_dhx_skyblue");
				$("body").removeClass("dhxwins_vp_material");
				$("body").css("position","");
			}
			return true;
		}

		// @desc: 팝업 닫기 최종 이벤트
		// @history:
		self.evId = self.winInst.attachEvent("onClose", function(win) {
			self.winInst.detachEvent(self.evId);

			self.callback && self.callback(self.callbackArg);

			jQuery('#'+self.popupId).find('*').unbind();

			self.winInst.window(self.wndId).unloadView("def");
			self.winInst.window(self.wndId).detachObject(true);

			self.instance && self.instance.onDhxWndExClose &&
			self.instance.onDhxWndExClose() && (self.instance.onDhxWndExClose=null);

			var popupElem = document.getElementById(self.popupId);
			popupElem && $.allDomNodeDelete(popupElem) &&
			popupElem.parentNode.removeChild(popupElem) && (popupElem=null);

			// modified 2021/03/11
			if ($(".dhxwin_active").length == 1) {
				$("body").removeClass("dhxwins_vp_dhx_skyblue");
				$("body").removeClass("dhxwins_vp_material");
				$("body").css("position","");

				if (window.scrollDefend) {
					document.getElementsByTagName('body')[0].style = '';
					document.getElementsByTagName('body')[0].style.top = '';
					document.getElementsByTagName('body')[0].style.width = '';
					document.getElementsByTagName('body')[0].style.overflowY = '';
					document.getElementsByTagName('body')[0].style.position = '';
					$(document).scrollTop(self.scrollTop);
				}
				window.scrollDefend=null;
			}

			self.selfCrear();
			dhtmlDragAndDropObject=null;
			return true;
		});

		$.extend(dhtmlx, {
			  loadUrl: "loadUrl",
			  loadHtml: "loadHtml",
			  getRawObject: "getRawObject",
			  getWndId: "getWndId",
			  setPopupId: "setPopupId",
			  setModal: "setModal",
			  setClose: "setClose",
			  setInstance: "setInstance"
		});
	}
})(jQuery);

