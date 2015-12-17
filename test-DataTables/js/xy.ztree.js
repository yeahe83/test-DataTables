/* =========================================================
 * xy.ztree.js (v15.1216.1722)
 * ========================================================= */

var xy;
if (!xy)
    xy = {};
if (!xy.ztree)
    xy.ztree = {};

/**
 * jquery.ztree.js 扩展
 *
 * - 构造函数 -
 * @description: 初始化 xy.ztree
 *
 * @param {string} option.domId：tree所在div的domID（必填）
 * @param {string} option.url：从ajax获取数据，url（和zNodes二者必填一项）
 * @param {string} option.zNodes：从zNodes直接获取数据（和url二者必填一项）
 * @param {string} option.idKey：ztree的simpleData.idKey
 * @param {string} option.pIdKey：ztree的simpleData.pIdKey
 * @param {string} option.rootPId：ztree的simpleData.rootPId
 * @param {string} option.keyName：ztree的data.keyName
 * @param {boolean} option.checkEnable：ztree的check.enable，是否显示checkbox（缺省false）
 * @param {boolean} option.selectedMulti ztree的view.selectedMulti，是否可以多选
 * @param {boolean} option.showLine：ztree的view.showLine，是否显示连接线
 * @param {boolean} option.showIcon：ztree的view.showIcon，是否显示图标
 * @param {boolean} option.nodeSkin: 叶节点的图标
 * @param {boolean} option.pNodeSkin: 非叶节点的图标,
 * @param {callback} option.fnBeforeBindData：数据绑定前的callback，用于数据最后的处理
 * @param {callback} option.fnBeforeClick：数据点击前的callback，用于判断是否可以点击
 * @param {callback} option.fnModifySetting：对setting进行自定义的callback
 * @param {callback} option.fnOnClick：点击节点的callback
 * @param {callback} option.fnOnCheck：勾选节点的callback
 *
 * @returns {object} this对象。
 *
 *
 * - init -
 * @description: 载入数据
 *
 * @returns {object} ztree的treeObj对象，可以继续调用 api。
 *
 *
 * 例子参见：IndustryProduct.js
 *
 *          var zTreeObj = new xy.ztree({
 *               domId: "ztree",
 *               checkEnable: true,
 *               url: "IndustryProduct.aspx?Func=GetProductDic",
 *               idKey: "id",
 *               pIdKey: "pId",
 *               rootPId: -1,
 *               keyName: "name",
 *               selectedMulti: false,
 *               showIcon: true,
 *               nodeSkin: "icon08",
 *               pNodeSkin: "pIcon01",
 *               fnBeforeBindData: function (data) {
 *                   // 自定义
 *                   if (data.length > 0) {
 *                       data.push({
 *                           id: 0, pId: -1, name: "全选"
 *                       });
 *                   }
 *               },
 *           }).init();
 *
 */
xy.ztree = function (option) {
    this.domId = option.domId;
    this.checkEnable = option.checkEnable != undefined ? option.checkEnable : false
    this.url = option.url;
    this.zNodes = option.zNodes;
    this.idKey = option.idKey != undefined ? option.idKey : "id";
    this.pIdKey = option.pIdKey != undefined ? option.pIdKey : "pId";
    this.rootPId = option.rootPId != undefined ? option.rootPId : null;
    this.keyName = option.keyName != undefined ? option.keyName : "name";
    this.selectedMulti = option.selectedMulti;
    this.showLine = option.showLine != undefined ? option.showLine : true,
    this.showIcon = option.showIcon != undefined ? option.showIcon : true,
    this.nodeSkin = option.nodeSkin;
    this.pNodeSkin = option.pNodeSkin;
    this.fnBeforeBindData = option.fnBeforeBindData;
    this.fnBeforeClick = option.fnBeforeClick;
    this.fnOnClick = option.fnOnClick;
    this.fnOnCheck = option.fnOnCheck;
    this.fnModifySetting = option.fnModifySetting;

    this.$ztree = $("#" + this.domId);
}
xy.ztree.prototype = (function () {
    return {
        constructor: xy.ztree.dropdown,
        init: function () {
            var this_ = this;

            var beforeClick = function (treeId, treeNode) {
                if (this_.fnBeforeClick)
                    return this_.fnBeforeClick(treeId, treeNode);
            };

            var onClick = function (e, treeId, treeNode) {
                if (this_.fnOnClick)
                    return this_.fnOnClick(e, treeId, treeNode);
            };

            var onCheck = function (e, treeId, treeNode) {
                if (this_.fnOnCheck)
                    return this_.fnOnCheck(e, treeId, treeNode);
            };

            var setting = {
                check: {
                    enable: this_.checkEnable
                },
                view: {
                    dblClickExpand: false,
                    selectedMulti: this_.selectedMulti,
                    showLine: this_.showLine,
                    showIcon: this_.showIcon,
                },
                data: {
                    key: {
                        name: this_.keyName
                    },
                    simpleData: {
                        enable: true,
                        idKey: this_.idKey,
                        pIdKey: this_.pIdKey,
                        rootPId: this_.rootPId
                    }
                },
                callback: {
                    beforeClick: beforeClick,
                    onClick: onClick,
                    onCheck: onCheck
                }
            };

            // 对setting进行编辑
            if (this_.fnModifySetting) {
                this_.fnModifySetting(setting);
            }

            //var zNodes = [
            //	{ id: 1, pId: 0, name: "北京" },
            //	{ id: 2, pId: 0, name: "天津" },
            //	{ id: 3, pId: 0, name: "上海" },
            //	{ id: 6, pId: 0, name: "重庆" },
            //	{ id: 4, pId: 0, name: "河北省", open: true },
            //	{ id: 41, pId: 4, name: "石家庄" },
            //	{ id: 42, pId: 4, name: "保定" },
            //	{ id: 43, pId: 4, name: "邯郸" },
            //	{ id: 44, pId: 4, name: "承德" },
            //	{ id: 5, pId: 0, name: "广东省", open: true },
            //	{ id: 51, pId: 5, name: "广州" },
            //	{ id: 52, pId: 5, name: "深圳" },
            //	{ id: 53, pId: 5, name: "东莞" },
            //	{ id: 54, pId: 5, name: "佛山" },
            //	{ id: 6, pId: 0, name: "福建省", open: true },
            //	{ id: 61, pId: 6, name: "福州" },
            //	{ id: 62, pId: 6, name: "厦门" },
            //	{ id: 63, pId: 6, name: "泉州" },
            //	{ id: 64, pId: 6, name: "三明" }
            //];

            var treeObj = null;
            if (this_.url) {
                $.ajax({
                    url: this_.url + "&date=" + new Date().getTime(),
                    //data: args,
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (data) {
                            var datas = data.data;
                            if (this_.fnBeforeBindData)
                                this_.fnBeforeBindData(datas);
                            this_.zNodes = datas;
                            treeObj = $.fn.zTree.init(this_.$ztree, setting, this_.zNodes);

                            // 更新图标
                            if (this_.pNodeSkin != undefined && this_.nodeSkin != undefined) {
                                var nodes = treeObj.transformToArray(treeObj.getNodes());
                                for (var i in nodes) {
                                    nodes[i].iconSkin = nodes[i].isParent ? this_.pNodeSkin : this_.nodeSkin;
                                    treeObj.updateNode(nodes[i]);
                                }
                            }
                        }
                    }
                });
            } else if (this_.zNodes) {
                treeObj = $.fn.zTree.init(this_.$ztree, setting, this_.zNodes);
            }
            return treeObj;
        }
    }

    return this;
})();


/**
 * jquery.ztree.js 扩展
 *
 * - 构造函数 -
 * @description: 初始化 xy.ztree.dropdown
 *
 * @param {string} option.domId：tree所在容器的domID（必填）
 * @param {string} option.fieldname：用于设置内部元件的名称，value存放于:hidden[name={fieldname}]（缺省使用domId）
 * @param {string} option.url：从ajax获取数据，url（和zNodes二者必填一项）
 * @param {string} option.zNodes：从zNodes直接获取数据（和url二者必填一项）
 * @param {boolean} option.ignoreHalf： 是否半勾节点不列入统计（缺省true）
 * @param {string} option.idKey：ztree的simpleData.idKey
 * @param {string} option.pIdKey：ztree的simpleData.pIdKey
 * @param {string} option.rootPId：ztree的simpleData.rootPId
 * @param {string} option.keyName：ztree的data.keyName
 * @param {boolean} option.checkEnable：ztree的check.enable，是否显示checkbox（缺省false）
 * @param {boolean} option.selectedMulti ztree的view.selectedMulti，是否可以多选（非check的情况）（缺省false）
 * @param {boolean} option.showLine：ztree的view.showLine，是否显示连接线（缺省显示）
 * @param {boolean} option.showIcon：ztree的view.showIcon，是否显示图标（缺省显示）
 * @param {boolean} option.nodeSkin: 叶节点的图标
 * @param {boolean} option.pNodeSkin: 非叶节点的图标,
 * @param {string} option.mainWidth：输入框的宽度，缺省"160",
 * @param {string} option.style：样式（text/button），缺省是用button做下拉框
 * @param {string} option.emptyText：空白时显示的文字（缺省：请选择...）
 * @param {callback} option.fnBeforeBindData：数据绑定前的callback，用于数据最后的处理
 * @param {callback} option.fnBeforeClick：数据点击前的callback，用于判断是否可以点击
 * @param {callback} option.fnModifySetting：对setting进行自定义的callback
 *
 * @returns {object} this对象，可以调用init / getCheckedIds（需要已调用init）。
 *
 * - init -
 * @description: 载入数据
 *
 * @returns {object} ztree的treeObj对象，可以继续调用 api。
 *
 * - getCheckedIds -
 * @description: 获取当前选中（或勾选）的Id列表，也可以直接用 treeObj 调用 ztree 的函数获取
 *
 * @returns {string} 列表，eg: "1,2,3"
 *
 * - 备注 -
 * 后续可使用  var treeObj = $.fn.zTree.getZTreeObj("ztree_{fieldname}"); 获取treeObj对象，继续进行api操作
 *
 */
xy.ztree.dropdown = function (option) {
    this.domId = option.domId;
    this.checkEnable = option.checkEnable != undefined ? option.checkEnable : false;
    this.fieldname = option.fieldname != undefined ? option.fieldname : this.domId;
    this.url = option.url;
    this.zNodes = option.zNodes;
    this.ignoreHalf = option.ignoreHalf != undefined ? option.ignoreHalf : true; // new

    this.idKey = option.idKey != undefined ? option.idKey : "id";
    this.pIdKey = option.pIdKey != undefined ? option.pIdKey : "pId";
    this.rootPId = option.rootPId != undefined ? option.rootPId : null;
    this.keyName = option.keyName != undefined ? option.keyName : "name";
    this.selectedMulti = option.selectedMulti != undefined ? option.selectedMulti : false;
    this.showLine = option.showLine != undefined ? option.showLine : true,
    this.showIcon = option.showIcon != undefined ? option.showIcon : true,
    this.nodeSkin = option.nodeSkin;
    this.pNodeSkin = option.pNodeSkin;
    this.mainWidth = option.mainWidth != undefined ? option.mainWidth : "160",
    this.style = option.style != undefined ? option.style : "button", // 缺省是用:text做下拉框，可选为button做下拉框
    this.emptyText = option.emptyText != undefined ? option.emptyText : "请选择...";
    this.modalId = option.modalId;
    this.fnBeforeBindData = option.fnBeforeBindData;
    this.fnBeforeClick = option.fnBeforeClick;
    this.fnModifySetting = option.fnModifySetting;

    this.$container = $("#" + this.domId);
    this.$container.children().remove();
    if (this.style == "text") {
        this.$container.html(String()
            + '<span class="input-icon icon-right">'
                + '<input type="text" class="form-control input-sm text" name="text_' + this.fieldname + '" value="" readonly="readonly" />'
                + '<i class="fa fa-caret-down"></i>'
            + '</span>'
            + '<input type="hidden" class="hidden" id="' + this.fieldname + '" name="' + this.fieldname + '" value="" />'
            + '<div class="menuContent" style="display:none; position: absolute; z-index:1500">'
                + '<ul class="ztree" id="ztree_' + this.fieldname + '" style="margin-top:0; width:250px;" ></ul>'
            + '</div> '
        );
    } else if (this.style == "button") {
        this.$container.html(String()
            + ' <div class="btn-group" style="width:100%"> '
                + '<div>'
                    + ' <button type="button" class="btn btn-default btn-sm" style="width:100%"> '
                        + ' <span class="text darkgray pull-left" name="text_' + this.fieldname + '" style="width:90%;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span> '
                        + ' <span class="caret pull-right" style="margin-top:6px;margin-bottom:7px;"></span> '
                    + ' </button> '
                    + ' <input type="text" class="hidden" name="' + this.fieldname + '" data-field="' + this.fieldname + '" value="" style="display:none;" /> '
                    + ' <div class="menuContent" style="display:none;position:absolute;z-index:1500;width:100%;"> '
                        + ' <ul class="ztree" id="ztree_' + this.fieldname + '" style="margin-top:0;width:100%;height:360px;border:1px solid #617775;background:#ffffff;overflow-y:scroll;overflow-x:auto;" ></ul> '
                    + ' </div> '
                 + ' </div> '
            + ' </div> '
        );
    } else if (this.style == "modal") {
        this.$container.html(String()
            + ' <div class="btn-group"> '
                + ' <div> '
                    + ' <button type="button" class="btn btn-default btn-md" data-toggle="modal" data-target="#' + this.modalId + '" style="width:' + this.mainWidth + 'px !important;text-overflow:ellipsis;overflow:hidden;white-space: nowrap;"> '
                    + ' </button> '
                    + ' <input type="hidden" class="hidden" id="' + this.fieldname + '" name="' + this.fieldname + '" value="" /> '
                + ' </div> '
            + ' </div> '
        );
    }

    this.$button = $("#" + this.domId + " .btn");
    this.$text = $("#" + this.domId + " .text");
    this.$hidden = $("#" + this.domId + " .hidden");
    this.$content = $("#" + this.domId + " .menuContent");
    this.$ztree = this.style == "modal" ? $("#" + this.modalId + " .ztree") : $("#" + this.domId + " .ztree");
    this.$modal = $("#" + this.modalId);

}
xy.ztree.dropdown.prototype = (function () {
    return {
        constructor: xy.ztree.dropdown,
        init: function () {

            // 初始化树（一次） ---> 同步写入hidden和text
            // 点击/勾选树节点  ---> 同步写入hidden和text
            // 写入text         ---> 同步写入hidden和勾选/选择节点

            var this_ = this;

            if (this_.emptyText) {
                if (this_.style == "modal")
                    this_.$button.text(this_.emptyText);
                else
                    this_.$text.text(this_.emptyText);
            }

            // 外部写入text，则写入text，并勾选/选择节点
            this_.$hidden.off("change").change(function () {

                // 先都清空，否则节点选择可能会叠加
                if (this_.style == "text") {
                    this_.$text.val(""); // 清空
                } else if (this_.style == "button") {
                    this_.$text.text(this_.emptyText); // 清空
                }
                var treeObj = $.fn.zTree.getZTreeObj(this_.$ztree[0].id);
                if (this_.checkEnable) // 取消全部勾选或选中
                    treeObj.checkAllNodes(false);
                else
                    treeObj.cancelSelectedNode();

                var value = $(this).val();
                if (value) {
                    var array = value.split(",");
                    var names = "";
                    var treeObj = $.fn.zTree.getZTreeObj(this_.$ztree[0].id);
                    //var nodes = treeObj.getNodes();
                    var nodes = treeObj.transformToArray(treeObj.getNodes()); // new
                    for (var j = 0; j < array.length; j++) {
                        var id = array[j];
                        for (var i = 0, l = nodes.length; i < l; i++) {
                            var node = nodes[i];
                            if (node[this_.idKey] == id) {
                                names += node[this_.keyName] + ","; // 用于写入text
                                if (this_.checkEnable) // 勾选或选中节点
                                    treeObj.checkNode(node, true, true);
                                else
                                    treeObj.selectNode(node);
                                break;
                            }
                        }
                    }
                    if (names.length > 0) names = names.substring(0, names.length - 1);
                    if (this_.style == "text") {
                        this_.$text.val(names).click().change().triggerHandler("input"); // bootstrapvalidator.js 要input事件触发验证;
                    } else if (this_.style == "button") {
                        this_.$text.text(names).change().triggerHandler("input"); // 清空
                    }
                    hideMenu();
                }
            });

            var beforeClick = function (treeId, treeNode) {
                //var check = (treeNode && !treeNode.isParent);
                //if (!check) alert("只能选择城市...");
                //return check;
                if (this_.fnBeforeClick)
                    return this_.fnBeforeClick(treeId, treeNode);

            };

            // onclick事件，写入hidden和text
            var onClick = function (e, treeId, treeNode) {
                if (this_.checkEnable)
                    return;
                var zTree = $.fn.zTree.getZTreeObj(this_.$ztree[0].id),
				nodes = zTree.getSelectedNodes(),
			    names = "";
                ids = "";
                nodes.sort(function compare(a, b) { return a[this_.idKey] - b[this_.idKey]; });
                for (var i = 0, l = nodes.length; i < l; i++) {
                    names += nodes[i][this_.keyName] + ",";
                    ids += nodes[i][this_.idKey] + ",";
                }
                if (names.length > 0) names = names.substring(0, names.length - 1);
                if (ids.length > 0) ids = ids.substring(0, ids.length - 1);
                //this_.$hidden.val(ids); //.change(); // 再change就又触发事件了
                this_.$hidden.val(ids).triggerHandler("input"); // new
                if (this_.style == "text") {
                    this_.$text.val(names).click().change().triggerHandler("input"); // bootstrapvalidator.js 要input事件触发验证
                } else if (this_.style == "button") {
                    if (names != "") {
                        this_.$text.text(names);
                    } else {
                        this_.$text.text(this_.emptyText);
                    }
                    this_.$text.val(names); // bootstrapvalidator.js 判断的是value
                    //this_.$text.change().triggerHandler("input"); // bootstrapvalidator.js 要input事件触发验证
                    this_.$text.change(); // new
                } else if (this_.style == "modal") {
                    if (names != "") {
                        this_.$button.text(names);
                    } else {
                        this_.$button.text(this_.emptyText);
                    }
                    this_.$button.val(names); // bootstrapvalidator.js 判断的是value
                    this_.$button.change().triggerHandler("input"); // bootstrapvalidator.js 要input事件触发验证
                }

                hideMenu();
            };

            // oncheck事件，写入hidden和text
            var onCheck = function (e, treeId, treeNode) {
                if (!this_.checkEnable)
                    return;
                var zTree = $.fn.zTree.getZTreeObj(this_.$ztree[0].id),
                nodes = zTree.getCheckedNodes(true),
                names = "";
                ids = "";
                for (var i = 0, l = nodes.length; i < l; i++) {
                    if (this_.ignoreHalf) { // new
                        if (nodes[i].getCheckStatus().half) // 半勾的不列入统计
                            continue;
                    }
                    names += nodes[i][this_.keyName] + ",";
                    ids += nodes[i][this_.idKey] + ",";
                }
                if (names.length > 0) names = names.substring(0, names.length - 1);
                if (ids.length > 0) ids = ids.substring(0, ids.length - 1);
                //this_.$hidden.val(ids); //.change();
                this_.$hidden.val(ids).triggerHandler("input"); // new
                if (this_.style == "text") {
                    this_.$text.val(names).click().change().triggerHandler("input"); // bootstrapvalidator.js 要input事件触发验证
                }
                else if (this_.style == "button") {
                    if (names != "") {
                        this_.$text.text(names);
                    } else {
                        this_.$text.text(this_.emptyText);
                    }
                    this_.$text.val(names);
                    //this_.$text.change().triggerHandler("input"); // bootstrapvalidator.js 要input事件触发验证
                    this_.$text.change(); // new
                } else if (this_.style == "modal") {
                    if (names != "") {
                        this_.$button.text(names);
                    } else {
                        this_.$button.text(this_.emptyText);
                    }
                    this_.val(names); // bootstrapvalidator.js 判断的是value
                    this_.change().triggerHandler("input"); // bootstrapvalidator.js 要input事件触发验证
                }

            }

            var showMenu = function () {
                this_.$content.slideDown("fast");
                $("body").bind("mousedown", onBodyDown);
            };

            var onBodyDown = function (event) { // 除了点在content区域，都隐藏
                if (!(event.target.id == this_.$container[0].id || $(event.target).parents(".menuContent").length > 0)) {
                    hideMenu();
                }
            };

            var hideMenu = function () {
                if (this_.style == "modal") {
                    this_.$modal.modal("hide");
                } else {
                    this_.$content.fadeOut("fast");
                    $("body").unbind("mousedown", onBodyDown);
                }
            };

            if (this_.style == "text") {
                this_.$text.off("click").click(function () {
                    showMenu();
                    return false;
                });
            } else if (this_.style == "button") {
                this_.$button.off("click").click(function () {
                    showMenu();
                    return false;
                });
            } else if (this_.style == "modal") {
                // 直接写在button上
            }

            var setting = {
                check: {
                    enable: this_.checkEnable
                },
                view: {
                    dblClickExpand: false,
                    selectedMulti: this_.selectedMulti,
                    showLine: this_.showLine,
                    showIcon: this_.showIcon,
                },
                data: {
                    key: {
                        name: this_.keyName
                    },
                    simpleData: {
                        enable: true,
                        idKey: this_.idKey,
                        pIdKey: this_.pIdKey,
                        rootPId: this_.rootPId
                    }
                },
                callback: {
                    beforeClick: beforeClick,
                    onClick: onClick,
                    onCheck: onCheck
                }
            };

            // 对setting进行编辑
            if (this_.fnModifySetting) {
                this_.fnModifySetting(setting);
            }

            //var zNodes = [
            //	{ id: 1, pId: 0, name: "北京" },
            //	{ id: 2, pId: 0, name: "天津" },
            //	{ id: 3, pId: 0, name: "上海" },
            //	{ id: 6, pId: 0, name: "重庆" },
            //	{ id: 4, pId: 0, name: "河北省", open: true },
            //	{ id: 41, pId: 4, name: "石家庄" },
            //	{ id: 42, pId: 4, name: "保定" },
            //	{ id: 43, pId: 4, name: "邯郸" },
            //	{ id: 44, pId: 4, name: "承德" },
            //	{ id: 5, pId: 0, name: "广东省", open: true },
            //	{ id: 51, pId: 5, name: "广州" },
            //	{ id: 52, pId: 5, name: "深圳" },
            //	{ id: 53, pId: 5, name: "东莞" },
            //	{ id: 54, pId: 5, name: "佛山" },
            //	{ id: 6, pId: 0, name: "福建省", open: true },
            //	{ id: 61, pId: 6, name: "福州" },
            //	{ id: 62, pId: 6, name: "厦门" },
            //	{ id: 63, pId: 6, name: "泉州" },
            //	{ id: 64, pId: 6, name: "三明" }
            //];

            // 初始化tree后，会调用onclick/oncheck，写入hidden和text
            var treeObj = null;
            if (this_.url) {
                $.ajax({
                    url: this_.url + "&date=" + new Date().getTime(),
                    //data: args,
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (data) {
                            var datas = data.data;
                            if (this_.fnBeforeBindData)
                                this_.fnBeforeBindData(datas);
                            this_.zNodes = datas;
                            treeObj = $.fn.zTree.init(this_.$ztree, setting, this_.zNodes);

                            // 更新图标
                            if (this_.pNodeSkin != undefined && this_.nodeSkin != undefined) {
                                var nodes = treeObj.transformToArray(treeObj.getNodes());
                                for (var i in nodes) {
                                    nodes[i].iconSkin = nodes[i].isParent ? this_.pNodeSkin : this_.nodeSkin;
                                    treeObj.updateNode(nodes[i]);
                                }
                            }

                            // 初始化hidden和:text
                            if (this_.checkEnable)
                                onCheck();
                            else
                                onClick();
                        }
                    }
                });
            } else if (this_.zNodes) {
                var treeObj = $.fn.zTree.init(this_.$ztree, setting, this_.zNodes);

                // 初始化hidden和:text
                if (this_.checkEnable)
                    onCheck();
                else
                    onClick();
            }

            return treeObj;
        },
        getCheckedIds: function () {
            return this.$hidden.val();
        }
    }
})();
