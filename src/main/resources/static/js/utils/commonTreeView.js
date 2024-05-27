(function($) {
	$.extend(true, window, {
		DHTMLX: {
			TreeView: dhtmlx
		}
	});

	// 트리 초기화
	function dhtmlx(container, skin, multiselect, checkboxes, dnd, context_menu) {
		var self = this;
		this.selfCrear = function() {
			for(var c in self) {
				self[c] = null;
			}
			self = null;
		};

		//초기값 설정
		this._tree = new dhtmlXTreeView({
			parent: container, // id/object, container for treeview
			//  skin:           skin ? skin : "dhx_skyblue",  // string, optional, treeview's skin
			//  iconset:        "font_awesome", // string, optional, sets the font-awesome icons
			multiselect: multiselect ? multiselect : false, // boolean, optional, enables multiselect
			checkboxes: checkboxes ? checkboxes : false, // boolean, optional, enables checkboxes
			dnd: dnd ? dnd : false, // boolean, optional, enables drag-and-drop
			context_menu: context_menu ? context_menu : false, // boolean, optional, enables context menu
		});

		// 트리 데이터 세팅
		this.loadData = function(treeData1, disabledChkBox) {
			var treeData = self.getSortedList(treeData1);
			$.each(treeData, function(idx) {
				if(treeData[idx].hasOwnProperty("treeYn") && treeData[idx].treeYn != "Y") {
					return;
				}
				self._tree.addItem(treeData[idx].id, treeData[idx].text, treeData[idx].parentId, treeData[idx].ind);
				$(".dhxtreeview_item_label").filter(":contains('" + treeData[idx].text + "')").attr("title", treeData[idx].text);
				self._tree.setUserData(treeData[idx].id, "group", treeData[0].id);
				$.each(treeData[idx], function(key, value) {
					if(["id", "text", "parentId", "ind"].indexOf(key) < 0) {
						self._tree.setUserData(treeData[idx].id, key, value);
					}
				});
				if(disabledChkBox) {
					self._tree.disableCheckbox(treeData[idx].id);
				}
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
				if(typeof treeData[i].parentId == 'undefined' || treeData[i].parentId == '') {
					sortData.push(treeData[i]);
					self.itemSort(sortData, treeData, treeData[i]);
				}
			}
			return sortData;
		};

		this.itemSort = function(arrSort, arrList, parent) {
			for(var i = 0; i < arrList.length; i++) {
				if(typeof arrList[i].parentId == 'undefined' || arrList[i].parentId == '' || typeof arrList[i].add != 'undefined') {
					continue;
				}
				if(parent.id == arrList[i].parentId) {
					arrSort.push(arrList[i]);
					arrList[i].add = 'Y';
					self.itemSort(arrSort, arrList, arrList[i]);
				}
			}
		};

		// 트리 아이템 삭제
		this.delItem = function(id) {
			self._tree.deleteItem(id);
		};

		// 선택된 아이템 정보 반환
		this.evIdSelect = null;
		this.onClick = function(callback, param) {
			self.evIdSelect = self._tree.attachEvent("onSelect", function(id, mode) {
				if(mode) {
					// callback이 있으면 not open
					if(typeof callback == 'function') {
						callback(id, param);
					} else {
						self._tree.openItem(id);
					}
				}
			});
		};

		// 사용자 데이터 조회
		this.getUserData = function(id, name) {
			return self._tree.getUserData(id, name);
		};

	 	// 상위 그룹 정보 조회
		this.getParentId = function(id) {
			return self._tree.getParentId(id);
		};

		// 트리 객체 반환
		this.getRawObject = function() {
			return self._tree;
		};

		// 선택된 트리의 텍스트 반환
		this.getSelectText = function(_itemId) {
			return self._tree.getItemText(_itemId);
		};

		// 선택된 트리의 ID 반환
		this.getSelectId = function(_itemId) {
			return self._tree.getSelectedId();
		};

		// 트리의 특정 아이템 선택 처리
		this.setSelect = function(_itemId) {
			//부모노드를 열기위해 선택된 아이템의 레벨을 조회한다.
			var lvl = self._tree.getLevel(_itemId);
			//현재 선택된 아이템아이디
			var pId = _itemId;
			//부모노드를 담기위한 변수
			var order = new Array();
			//부모노드 검색
			for(var i = lvl; i > 1; i--) {
				pId = self._tree.getParentId(pId);
				order.push(pId);
			}
			//최상위 부모노드부터 열어야 하므로 역순으로 정렬한다.
			order.reverse();
			//부모노드 열기
			$.each(order, function(idx) {
				self._tree.openItem(order[idx]);
			});
			self._tree.selectItem(_itemId);
		};

		this.unload = function() {
			self.evIdSelect && self._tree.detachEvent(self.evIdSelect);
			self._tree.unload();
			self.selfCrear();
		};

		// 트리 기능 목록
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