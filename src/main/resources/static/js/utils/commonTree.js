(function($) {
	$.extend(true, window, {
		DHTMLX: {
			Tree: dhtmlx
		}
	});

	/**
	 * 트리 초기화
	 *
	 * container	: 트리 구성 영역 아이디(필수)
	 * skin			: 트리뷰 스킨(선택 : default-dhx_skyblue)
	 * iconset		: 아이콘(선택)
	 * multiselect	: 다중 선택(선택 : true, false)
	 * checkboxes	: 체크박스 적용(선택 : true, false)
	 * dnd			: 드래그앤드롭(선택 : true, false)
	 * context_menu	: 컨텍스트 메뉴(선택 : true, false)
	 */
	function dhtmlx(container) {
		var self = this;
		this.selfCrear = function() {
			for(var c in self) {
				self[c] = null;
			}
			self = null;
		};

		this.evIdClick = null;
		//초기값 설정
		this._tree = new dhtmlXTreeObject(container, "100%", "100%", 0);

		// @desc: 트리 데이터 세팅
		this.loadData = function(treeData) {
			$.each(treeData, function(idx) {
				if(treeData[idx].hasOwnProperty("treeYn") && treeData[idx].treeYn != "Y") {
					return;
				}
				self._tree.insertNewChild(treeData[idx].parentId, treeData[idx].id, treeData[idx].text);
				$.each(treeData[idx], function(key, value) {
					if(["id", "text", "parentId", "ind"].indexOf(key) < 0) {
						self._tree.setUserData(treeData[idx].id, key, value);
					}
				});
			});
		};

		// 시간이 없어 우선 그대로 사용.
		// 위 함수는 데이터를 넘겨 받을때 sort가 되어 있어야 함. 즉, hierarchy 구조로 parent가
		// child 보다 array에서 먼저 위치해 있어야 문제가 없음.
		// 그래서 서버에서 sorting 알고리즘을 구현 했으나 혹시 클라이언트에서 필요할 경우 사용할 수 있도록
		// 함수를 만들어 놓음.
		this.getSortedList = function(treeData) {
			var sortData = new Array();
			for(var i = 0; i < treeData.length; i++) {
				if(typeof treeData[i].upperDptId != 'undefined') {
					sortData.push(treeData[i]);
					self.itemSort(sortData, treeData, treeData[i]);
				}
			}
		};

		this.itemSort = function(arrSort, arrList, parent) {
			for(var i = 0; i < arrList.length; i++) {
				if(typeof arrList[i].upperDptId == 'undefined' || typeof arrList[i].add != 'undefined') {
					continue;
				}
				if(parent.dptId == arrList[i].upperDptId) {
					arrSort.push(arrList[i]);
					arrList[i].add = 'Y';
					self.itemSort(arrSort, arrList, arrList[i]);
				}
			}
		};

		// @desc: 트리 아이템 삭제
		this.delItem = function(id) {
			self._tree.deleteItem(id);
		};

		// @desc: 선택된 아이템 정보 반환
		this.onClick = function(callback, mode) {
			self.evIdClick = self._tree.attachEvent("onClick", function(id) {
				self._tree.openItem(id); // 선택된 트리 항목 오픈
				callback(id);
			});
		};

		// @desc: 사용자 데이터 조회
		this.getUserData = function(id, name) {
			return self._tree.getUserData(id, name);
		};

		// @desc: 상위 그룹 정보 조회
		this.getParentId = function(id) {
			return self._tree.getParentId(id);
		};

		// @desc: 트리 객체 반환
		this.getRawObject = function() {
			return self._tree;
		};

		// @desc: 선택된 트리의 텍스트 반환
		this.getSelectText = function(_itemId) {
			return self._tree.getSelectedItemText(_itemId);
		};

		// @desc: 선택된 트리의 ID 반환
		this.getSelectId = function() {
			return self._tree.getSelectedItemId();
		};

		// @desc: 트리의 특정 아이템 선택 처리
		this.setSelect = function(_itemId) {
			self._tree.selectItem(_itemId);
			var lvl = self._tree.getLevel(_itemId);
			for(var i = lvl; i > 0; i--) {
				const pId = self._tree.getParentId(_itemId);
				self._tree.openItem(pId);
			}
		};

		// @desc: unload
		this.unload = function() {
			self.evIdClick && self._tree.detachEvent(self.evIdClick);
			self._tree.unload();
			self.selfCrear();
		};

		// function list
		$.extend(dhtmlx, {
			loadData: "loadData",
			delItem: "delItem",
			onClick: "onClick",
			getUserData: "getUserData",
			getParentId: "getParentId",
			getRawObject: "getRawObject",
			getSelectText: "getSelectText",
			getSelectId: "getSelectId",
			setSelect: "setSelect",
			unload: "unload"
		});
	}
})(jQuery);