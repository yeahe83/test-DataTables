/* =========================================================
 * xy.ztree.js (v18.0704.1758)
 * ========================================================= */

var xy;
if (!xy)
    xy = {};
if (!xy.ztree)
    xy.ztree = {};

/**
 * jquery.ztree.js 扩展
 */

//例1：IndustryProduct.js
//var zTreeObj = new xy.ztree({
//    domId: "ztree",
//    checkEnable: true,
//    url: "IndustryProduct.aspx?Func=GetProductDic",
//    idKey: "id",
//    pIdKey: "pId",
//    rootPId: -1,
//    keyName: "name",
//    selectedMulti: false,
//    showIcon: true,
//    nodeSkin: "icon08",
//    pNodeSkin: "pIcon01",
//    fnBeforeBindData: function (data) {
//        // 自定义
//        if (data.length > 0) {
//            data.push({
//                id: 0, pId: -1, name: "全选"
//            });
//        }
//    },
//}).init();

//例2：Sys_MenuMgr.js

//var ztreeObj = new xy.ztree({
//    domId: "ztree",
//    idKey: "Menu_ID",
//    pIdKey: "Menu_Parent_ID",
//    rootPId: -1,
//    keyName: "Menu_Name",
//    fnOnClick: function (e, treeId, treeNode) {
//        if (treeNode.Menu_Parent_ID == -1) {
//            $("#btn_edt").hide();
//            $("#btn_del").hide();
//            $("#btn_move").hide();
//        } else {
//            $("#btn_edt").show();
//            $("#btn_del").show();
//            $("#btn_move").show();
//        }
//    },
//    // modal 相关
//    btnAddId: "btn_add",
//    btnEditId: "btn_edt",
//    btnDeleteId: "btn_del",
//    modalId: "modal",
//    modalAutoCreated: true,
//    formId: "form_o",
//    cols: [
//        { display: "菜单编号", fieldName: "Menu_ID", key: true },
//        { display: "所属菜单模块编号", fieldName: "Program_Module_ID" },
//        { display: "菜单父级编号", fieldName: "Menu_Parent_ID" },
//        { display: "菜单名称", fieldName: "Menu_Name", modalType: "text" },
//        { display: "菜单地址", fieldName: "Menu_Url", modalType: "text" },
//        { display: "菜单排序", fieldName: "Menu_isSort", modalType: "text" },
//        { display: "菜单图标", fieldName: "Menu_Pic", modalType: "text" },
//        { display: "是否有效", fieldName: "Menu_isValid", modalType: "checkbox", render: function (data, type, row) { return (data == 1) ? "是" : "否"; } },
//    ],
//    ajax: {
//        show: "Sys_MenuMgr.aspx?Func=GetMenus&moduleId=" + $("#module").val(),
//        add: "Sys_MenuMgr.aspx?Func=AddMenu",
//        edit: "Sys_MenuMgr.aspx?Func=ModMenu",
//        delete: "Sys_MenuMgr.aspx?Func=DelMenu",
//    },
//    fnModalAutoCreated: function () {
//        this.fnModalSetValidator(); // 设置验证器
//    },
//    fnModalInit: function () {
//        var ztreeObj = $.fn.zTree.getZTreeObj(this.$ztree[0].id);
//        var nodeObj = ztreeObj.getSelectedNodes()[0];
//        if (this.modalState == 1 && nodeObj.Menu_Parent_ID == -1) // 根节点不可编辑
//            return false;

//        $('#' + this.modalId + ' .input-date').datepicker('remove');
//        $('#' + this.modalId + ' .input-daterange').datepicker('remove');
//        return true;
//    },
//    fnModalShowing: function () {
//        $('#' + this.modalId + ' .input-date').datepicker({
//            format: "yyyy-mm-dd",
//            clearBtn: true,
//            language: "zh-CN"
//        });
//        $('#' + this.modalId + ' .input-daterange').datepicker({
//            format: "yyyy-mm-dd",
//            clearBtn: true,
//            language: "zh-CN"
//        });

//        // 清空验证标签
//        var bootstrapValidator = $('#' + this.formId).data('bootstrapValidator');
//        bootstrapValidator.resetForm(false);
//    },
//    fnModalSubmitting: function (row_data) {
//        var ztreeObj = $.fn.zTree.getZTreeObj(this.$ztree[0].id);
//        var nodeObj = ztreeObj.getSelectedNodes()[0];
//        row_data.Program_Module_ID = nodeObj.Program_Module_ID; // 模块ID

//        var bootstrapValidator = $('#' + this.formId).data('bootstrapValidator')
//        return bootstrapValidator.validate().isValid();
//    },
//    fnModalSaveAllDone: function () {
//        var ztreeObj = $.fn.zTree.getZTreeObj(this.$ztree[0].id);
//        var nodes = ztreeObj.transformToArray(ztreeObj.getNodes());
//        ztreeObj.selectNode(nodes[0]);
//        ztreeObj.expandNode(nodes[0]);
//    },
//    fnBeforeDelete: function (row_data) {
//        var ztreeObj = $.fn.zTree.getZTreeObj(this.$ztree[0].id);
//        var nodeObj = ztreeObj.getSelectedNodes()[0];
//        if (nodeObj.Menu_Parent_ID == -1) { // 根节点
//            return false;
//        }
//        if (nodeObj.children && nodeObj.children.length > 0) {
//            alert("请先删除子节点");
//            return false;
//        }
//        if (confirm("确定删除？") == false) {
//            return false;
//        }
//        return true;
//    },
//    fnModalSetValidator: function () {
//        $('#' + this.formId).data('bootstrapValidator', null);
//        $('#' + this.formId + ' [name], #' + this.formId + ' [data-bv-field]').each(function () {
//            $(this).closest(".has-feedback").find("small, .form-control-feedback").remove();
//        });
//        var fields = {
//            Menu_Name: {
//                validators: {
//                    notEmpty: {
//                        message: "请输入名称"
//                    }
//                }
//            }
//        };

//        $('#' + this.formId).bootstrapValidator({
//            submitHandler: function (validator, form, submitButton) {
//                // Do nothing
//            },
//            fields: fields,
//            excluded: [],
//        });
//    },
//}).init();

xy.ztree = function (option) {
    /* 树
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
     */
    this.domId = option.domId;
    this.url = option.url;
    this.zNodes = option.zNodes;
    this.idKey = option.idKey != undefined ? option.idKey : "id";
    this.pIdKey = option.pIdKey != undefined ? option.pIdKey : "pId";
    this.rootPId = option.rootPId != undefined ? option.rootPId : null;
    this.keyName = option.keyName != undefined ? option.keyName : "name";
    this.checkEnable = option.checkEnable != undefined ? option.checkEnable : false
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

    /* 编辑框 */
    this.btnAddId = option.btnAddId;
    this.btnEditId = option.btnEditId;
    this.btnDeleteId = option.btnDeleteId;
    this.cols = option.cols;
    this.modalId = option.modalId;
    this.formId = option.formId == undefined ? "form1" : option.formId;
    this.modalAutoCreated = option.modalAutoCreated;
    this.modalState = -1; // 0 新增 1 编辑
    this.fnModalInit = option.fnModalInit;
    this.fnModalShowing = option.fnModalShowing;
    this.fnModalSubmitting = option.fnModalSubmitting;
    this.fnModalSaveAllDone = option.fnModalSaveAllDone;
    this.fnBeforeDelete = option.fnBeforeDelete;
    this.fnModalSetValidator = option.fnModalSetValidator;
    this.fnModalAutoCreated = option.fnModalAutoCreated;
    this.ajax = option.ajax; // 可以替代 url

    this.$ztree = $("#" + this.domId);
    this.$btnAdd = $("#" + this.btnAddId);
    this.$btnEdit = $("#" + this.btnEditId);
    this.$btnDel = $("#" + this.btnDeleteId);
    this.$modal = $("#" + this.modalId);
}
xy.ztree.prototype = (function () {
    return {
        constructor: xy.ztree.dropdown,
        init: function () {
            var this_ = this;

            if (this_.modalAutoCreated) // 是否自动创建modal
                this_.initModal();

            // add
            if (this_.$btnAdd) {
                this_.$btnAdd.off("click").click(function (e) {
                    e.preventDefault();
                    var ztreeObj = $.fn.zTree.getZTreeObj(this_.$ztree[0].id);
                    var nodeObj = ztreeObj.getSelectedNodes()[0]; // 父节点
                    this_.modalState = 0; // 新增
                    this_.edit(nodeObj);
                });
            }

            // edit
            if (this_.$btnEdit) {
                this_.$btnEdit.off("click").click(function (e) {
                    e.preventDefault();
                    var ztreeObj = $.fn.zTree.getZTreeObj(this_.$ztree[0].id);
                    var nodeObj = ztreeObj.getSelectedNodes()[0]; // 自身节点
                    this_.modalState = 1; // 编辑
                    this_.edit(nodeObj);
                });
            }

            // delete
            if (this_.$btnDel) {
                this_.$btnDel.off("click").click(function (e) {
                    e.preventDefault();
                    var ztreeObj = $.fn.zTree.getZTreeObj(this_.$ztree[0].id);
                    var nodeObj = ztreeObj.getSelectedNodes()[0]; // 自身节点
                    this_.modalState = -1;
                    this_.delete(nodeObj);
                });
            }

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
            if (this_.url == undefined && this_.ajax.show)
                this_.url = this_.ajax.show;
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
        },
        // 以下 v17.0525.1425
        // init modal
        initModal: function () {
            var this_ = this;
            var modalId = this.modalId;
            var formId = this.formId;

            if ($("#" + modalId).length > 0) {
                if (this_.modalDestroy)
                    $("#" + modalId).remove();
                else  // modal不重复创建
                    return this;
            }

            // modal-rows
            var modal_rows = "";
            for (var i = 0; i < this_.cols.length; i++) {
                var col = this_.cols[i];
                switch (col.modalType) { // 有modalType属性的才创建编辑框
                    case "text":
                        modal_rows += String()
                            + '<div class="col-sm-6">'
                            + '<div class="form-group">'
                            + '<label class="control-label">' + col.display + '</label>'
                            + '<input class="form-control input-sm" name="' + col.fieldName + '" data-field="' + col.fieldName + '" type="text" placeholder="" ' + (col.domId ? ' id=' + col.domId : "") + ' />'
                            + '</div>'
                            + '</div>';
                        break;
                    case "memo":
                        modal_rows += String()
                            + '<div class="col-sm-12">'
                            + '<div class="form-group">'
                            + '<label class="control-label">' + col.display + '</label>'
                            + '<textarea class="form-control input-sm" name="' + col.fieldName + '" data-field="' + col.fieldName + '" placeholder="" rows="3"' + (col.domId ? ' id=' + col.domId : "") + '></textarea>'
                            + '</div>'
                            + '</div>';
                        break;
                    case "select":
                        modal_rows += String()
                            + '<div class="col-sm-6">'
                            + '<div class="form-group">'
                            + '<label class="control-label">' + col.display + '</label>'
                            + '<select class="form-control input-sm" name="' + col.fieldName + '" data-field="' + col.fieldName + '"' + (col.domId ? ' id=' + col.domId : "") + '></select>'
                            + '</div>'
                            + '</div>';
                        break;
                    case "checkbox":
                        modal_rows += String()
                            + '<div class="col-sm-12">'
                            + '<div class="checkbox">'
                            + '<label>'
                            + '<input type="checkbox" name="' + col.fieldName + '" data-field="' + col.fieldName + '"' + (col.domId ? ' id=' + col.domId : "") + '> ' + col.display
                            + '</label>'
                            + '</div>'
                            + '</div>';
                        break;
                    case "ztree_dropdown":
                        modal_rows += String()
                            + '<div class="col-sm-6">'
                            + '<div class="form-group">'
                            + '<label class="control-label">' + col.display + '</label>'
                            + '<div class="form-group">'
                            + '<div class="ztree_dropdown"' + (col.domId ? ' id=' + col.domId : "") + '></div>'
                            + '</div>'
                            + '</div>'
                            + '</div>';
                        break;
                    case "editor":
                        modal_rows += String()
                            + '<div class="col-sm-12">'
                            + '<div class="form-group">'
                            + '<label class="control-label">' + col.display + '</label>'
                            + '<input type="text" class="hidden editor_hidden" name="' + col.fieldName + '" data-field="' + col.fieldName + '" value="" style="display:none;" /> '
                            + '<div class="editor" ' + (col.domId ? ' id=' + col.domId : "") + '></div>'
                            + '</div>'
                            + '</div>';
                        break;
                    case "datepicker":
                        modal_rows += String()
                            + '<div class="col-sm-6">'
                            + '<div class="form-group">'
                            + '<label class="control-label">' + col.display + '</label>'
                            + '<input class="form-control input-sm input-date" name="' + col.fieldName + '" data-field="' + col.fieldName + '" type="text" placeholder=""' + (col.domId ? ' id=' + col.domId : "") + ' />'
                            + '</div>'
                            + '</div>';
                        break;
                    case "datepicker-range":
                        if (col.modalArgs.role == "begin") {
                            // 找结束
                            var end_row = "";
                            for (var j = 0; j < this_.cols.length; j++) {
                                var col2 = this_.cols[j];
                                if (col2.modalType == "datepicker-range") { // 有modalType属性的才创建编辑框
                                    if (col2.modalArgs.group == col.modalArgs.group && col2.modalArgs.role == "end") { // 是同一group的end
                                        end_row += String()
                                            + '<div class="col-sm-6">'
                                            + '<div class="form-group">'
                                            + '<label class="control-label">' + col2.display + '</label>'
                                            + '<input class="form-control input-sm" name="' + col2.fieldName + '" data-field="' + col2.fieldName + '" type="text" placeholder="" ' + (col2.domId ? ' id=' + col2.domId : "") + '/>'
                                            + '</div>'
                                            + '</div>';
                                        break;
                                    }

                                }
                            }

                            // 拼到开始
                            modal_rows += String()
                                + '<div class="input-daterange">'
                                + '<div class="col-sm-6">'
                                + '<div class="form-group">'
                                + '<label class="control-label">' + col.display + '</label>'
                                + '<input class="form-control input-sm" name="' + col.fieldName + '" data-field="' + col.fieldName + '" type="text" placeholder=""' + (col.domId ? ' id=' + col.domId : "") + ' />'
                                + '</div>'
                                + '</div>'
                                + end_row
                                + '</div>';
                        }
                        break;
                }
            }

            $("body").append(String()
                + '<div id="' + modalId + '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">'
                + ' <div class="modal-dialog">'
                + '     <div class="modal-content">'
                + '         <div class="modal-header">'
                + '             <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '             <h5 class="modal-title">编辑</h5>'
                + '         </div>'
                + '         <div class="modal-body">'
                + '             <form id="' + formId + '" method="post" class="form-horizontal"'
                + '                                                     data-bv-message="This value is not valid"'
                + '                                                     data-bv-feedbackicons-valid="glyphicon glyphicon-ok"'
                + '                                                     data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"'
                + '                                                     data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">'
                + '                 <div class="container-fluid modal-rows">'
                + '                     <div class="row">'
                + modal_rows
                + '                     </div>'
                + '                 </div>'
                + '             </form>'
                + '         </div>'
                + '         <div class="modal-footer">'
                + '             <button type="button" class="btn btn-default btn-sm cancel" data-dismiss="modal"><i class="fa fa-times"></i> 关闭</button>'
                + '             <button type="submit" class="btn btn-primary btn-sm save"><i class="fa fa-save"></i> 保存</button>'
                + '         </div>'
                + '     </div>'
                + ' </div>'
                + '</div>');

            this_.$modal = $("#" + this.modalId);
            this_.modalState = -1; // 重置新增/编辑的标记

            // modal自动创建后的callback
            if (this_.fnModalAutoCreated) {
                this_.fnModalAutoCreated();
            }

            return this_;
        },
        // add/edit
        edit: function (params) {
            var this_ = this;

            // 可拖动
            try {
                this_.$modal.draggable({ cursor: "move" });  // 可拖动（需要jqueryui）
            } catch (e) { }

            // 取消
            this_.$modal.find(".cancel").off("click").click(function () {
                this_.$modal.modal("hide");
            });

            // 保存
            this_.$modal.find(".save").off("click").click(function () {

                // 从传入节点获取数据
                var row_data = {};
                if (this_.modalState == 0) { // 新增
                    row_data[this_.pIdKey] = params[this_.idKey];
                } else { // 编辑
                    //row_data[this_.idKey] = params[this_.idKey];
                    //row_data[this_.pIdKey] = params[this_.pIdKey];
                    for (var i = 0; i < this_.cols.length; i++) {
                        if (params[this_.cols[i].fieldName] != null)
                            row_data[this_.cols[i].fieldName] = params[this_.cols[i].fieldName];
                    }
                }

                // editor的数据写入hidden（如果有）
                for (var i = 0; i < this_.cols.length; i++) {
                    var fieldName = this_.cols[i].fieldName;
                    var $input_dom = this_.$modal.find("[name=" + fieldName + "]"); // 改成读name

                    if ($input_dom.hasClass("editor_hidden")) {
                        try {
                            var markupStr = $input_dom.siblings(".editor").summernote('code');
                            $input_dom.val(markupStr);
                        } catch (e) { }
                    }
                }

                // 提交前的callback
                if (this_.fnModalSubmitting) {
                    var ret = this_.fnModalSubmitting(row_data, params);
                    if (!ret)
                        return;
                }

                // 准备数据
                for (var i = 0; i < this_.cols.length; i++) {

                    var fieldName = this_.cols[i].fieldName;
                    var $input_dom = this_.$modal.find("[name=" + fieldName + "]"); // 改成读name
                    if (fieldName) {

                        // 有缺省值的
                        if (this_.$modal.find(".modal-title").text() == "编辑") {// 编辑
                            if (this_.cols[i].edit_value)
                                row_data[fieldName] = this_.cols[i].edit_value;
                        } else { // 新增
                            if (this_.cols[i].add_value)
                                row_data[fieldName] = this_.cols[i].add_value;
                        }

                        if ($input_dom.length > 0 && $input_dom.parent().is(":visible")) { // 界面上有编辑框的（用parent来判断是因为有本身是<hidden>元素的）

                            //// editor的数据写入hidden（如果有）
                            //if ($input_dom.hasClass("editor_hidden")) {
                            //    try {
                            //        var markupStr = $input_dom.siblings(".editor").summernote('code');
                            //        $input_dom.val(markupStr);
                            //    } catch (e) { }
                            //}

                            var value = null;
                            if ($input_dom.is("label") || $input_dom.is("span")) {
                                continue; // label不需要赋值，还是处理一下，否则变成null
                            } else if ($input_dom.is(":text") || $input_dom.is("input[type=hidden]") || $input_dom.is("textarea")) {
                                value = $input_dom.val();
                            } else if ($input_dom.is(":checkbox")) {
                                value = ($input_dom.prop('checked') == true ? 1 : 0);
                            } else if ($input_dom.is("select")) {
                                value = $input_dom.find("option:selected").val();
                            }

                            row_data[fieldName] = value;
                        }
                    }
                }

                // 保存到数据库
                $.ajax({
                    type: "POST",
                    url: (this_.$modal.find(".modal-title").text() == "编辑") ? this_.ajax.edit : this_.ajax.add, // url
                    data: {
                        data: (this_.postEncode ? encodeURIComponent(JSON.stringify(row_data)) : JSON.stringify(row_data)),
                        postEncode: this_.postEncode
                    }, // 数据
                    dataType: "json",
                    async: false, // 同步
                    success: function (data) {
                        if (data) {
                            if (data.result == true)  // 成功
                            {
                                this_.init();
                                this_.$modal.modal("hide"); // 关闭弹出窗 
                            }
                            else {
                                alert(this.i18n ? this.i18n.t(data.message) : data.message);
                                return;
                            }
                        }

                        // 保存后执行的callback
                        if (this_.fnModalSaveAllDone) {
                            var ret = this_.fnModalSaveAllDone();
                            if (!ret)
                                return;
                        }
                    }
                });
            });

            // 从节点读取数据
            var row_data = {};
            if (this_.modalState == 1) {// 编辑
                for (var i = 0; i < this_.cols.length; i++) {
                    if (params[this_.cols[i].fieldName] != null)
                        row_data[this_.cols[i].fieldName] = params[this_.cols[i].fieldName];
                }
                this_.$modal.find(".modal-title").text("编辑");
            } else {// 新增
                this_.$modal.find(".modal-title").text("新增");
            }

            // 输入框可见性
            for (var index = 0; index < this_.cols.length; index++) {
                var fieldName = this_.cols[index].fieldName;
                var $input_dom = this_.$modal.find("[name=" + fieldName + "]"); // 改成读name
                if (this_.modalState == 1) { // 编辑 
                    if (this_.cols[index].edit_visible == false || this_.cols[index].edit == false || $input_dom.data("edit_visible") == "0")
                        $input_dom.closest(".form-group").parent().hide();
                    else
                        $input_dom.closest(".form-group").parent().show();
                } else { // 新增 
                    if (this_.cols[index].add_visible == false || this_.cols[index].add == false || $input_dom.data("add_visible") == "0")
                        $input_dom.closest(".form-group").parent().hide();
                    else
                        $input_dom.closest(".form-group").parent().show();
                }
            }

            // editor初始化（如果有）
            try {
                $('.editor').summernote({
                    height: 300,                 // set editor height
                    minHeight: null,             // set minimum height of editor
                    maxHeight: null,             // set maximum height of editor
                    focus: true,                 // set focus to editable area after initializing summernote
                    lang: 'zh-CN'                // default: 'en-US'
                });
            } catch (e) { }

            // 数据写到界面前执行的callback
            if (this_.fnModalInit) {
                var ret = this_.fnModalInit(row_data, params);
                if (!ret)
                    return;
            }

            // 加载数据
            for (var index = 0; index < this_.cols.length; index++) {
                var fieldName = this_.cols[index].fieldName;
                var $input_dom = this_.$modal.find("[name=" + fieldName + "]"); // 改成读name
                if (fieldName && $input_dom.length > 0) {

                    var value = row_data[fieldName];
                    if ($input_dom.is("label") || $input_dom.is("span")) {
                        $input_dom.text(value == null ? "" : value).change();
                    }
                    else if ($input_dom.is(":text") || $input_dom.is("input[type=hidden]") || $input_dom.is("textarea") || $input_dom.is("select")) {
                        $input_dom.val(value == null ? "" : value).change();
                    } else if ($input_dom.is(":checkbox")) {
                        $input_dom.prop('checked', (value) ? true : false);
                    }

                    // editor从hidden读入数据（如果有）
                    if ($input_dom.hasClass("editor_hidden")) {
                        var markupStr = $input_dom.val();
                        try {
                            $input_dom.siblings(".editor").summernote('code', markupStr);
                        } catch (e) { }
                    }
                }
            }

            // 数据写到界面后执行的callback
            if (this_.fnModalShowing) {
                var ret = this_.fnModalShowing(row_data, params);
            }

            this_.$modal.modal();
        },
        // delete
        delete: function (params) {
            var this_ = this;
            //if (confirm(this.i18n ? this.i18n.t("xydatetable.querydel") : "确定删除？") == false) {
            //    return;
            //}

            // 删除前的callback
            if (this_.fnBeforeDelete) {
                var ret = this_.fnBeforeDelete(params);
                if (!ret)
                    return;
            }

            // only for single key
            var key_fieldName = "";
            for (var i = 0; i < this_.cols.length; i++) {
                if (this_.cols[i].key == true) {
                    key_fieldName = this_.cols[i].fieldName;
                    break;
                }
            }

            // get delete ids
            var ids = [params[key_fieldName]];

            if (this_.$btnDel.length > 0)
                this_.$btnDel[0].disabled = true;

            // 保存到数据库
            $.ajax({
                type: "POST",
                url: this_.ajax.delete, // url
                data: { "data": JSON.stringify(ids) }, // 数据
                dataType: "json",
                async: false, // 同步
                success: function (data) {
                    if (data) {
                        if (data.result == true) { // 成功
                            alert(this.i18n ? this.i18n.t("xydatetable.delsucc") : "删除成功");
                            this_.init();
                        } else {
                            alert(this.i18n ? this.i18n.t(data.message) : data.message);
                            return;
                        }
                    }
                    if (this_.$btnDel.length > 0)
                        this_.$btnDel[0].disabled = false;

                    // 保存后执行的callback
                    if (this_.fnModalSaveAllDone) {
                        var ret = this_.fnModalSaveAllDone();
                        if (!ret)
                            return;
                    }
                }
            });
        },
    }

    return this;
})();


/**
 * jquery.ztree.js 扩展
 *
 * - 构造函数 -
 * @description: 初始化 xy.ztree.dropdown
 * @param {string} option.domId：tree所在容器的domID（必填）
 * @param {string} option.fieldname：用于设置内部元件的名称，value存放于:hidden[name={fieldname}]（缺省使用domId）
 * @param {string} option.url：从ajax获取数据，url（和zNodes二者必填一项）
 * @param {string} option.zNodes：从zNodes直接获取数据（和url二者必填一项）
 * @param {boolean} option.ignoreHalf： 是否半勾节点不列入统计（缺省true）
 * @param {boolean} option.mergeChildren：如果子节点全部勾选，将只显示父节点（缺省false） v18.0704.1758
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
 * @param {callback} option.fnOnClick：点击节点的callback（不要在option.fnModifySetting中直接覆盖callback.onClick）
 * @param {callback} option.fnOnCheck：勾选节点的callback（不要在option.fnModifySetting中直接覆盖callback.onCheck）
 * @returns {object} this对象，可以调用init / getCheckedIds（需要已调用init）。
 *
 * - init -
 * @description: 载入数据
 * @returns {object} ztree的treeObj对象，可以继续调用 api。
 *
 * - getCheckedIds -
 * @description: 获取当前选中（或勾选）的Id列表，也可以直接用 treeObj 调用 ztree 的函数获取
 * @returns {string} 列表，eg: "1,2,3"
 *
 * - 备注 -
 * 后续可使用  var treeObj = $.fn.zTree.getZTreeObj("ztree_{fieldname}"); 获取treeObj对象，继续进行api操作
 *
 * - 例子 -
 * // html
 * <div class="ztree_dropdown" id="sel"></div>
 * 
 * // json
 * [{"id":"06","name":"洗精煤","value":"100840.22"},{"id":"09","name":"焦炭","value":"95384.96"},{"id":"12","name":"高炉煤气","value":"40503.59"},{"id":"01","name":"原煤","value":"33565.05"},{"id":"11","name":"焦炉煤气","value":"17063.82"},{"id":"13","name":"转炉煤气","value":"5764.98"},{"id":"33","name":"电力","value":"4582.40"},{"id":"32","name":"热力","value":"612.50"},{"id":"39","name":"其它燃料（空着）","value":"458.57"},{"id":"21","name":"柴油","value":"214.49"},{"id":"19","name":"汽油","value":"3.16"},{"id":"37","name":"余热余压","value":"2.29"}]
 * 
 * // js
 * var treeObj = new xy.ztree.dropdown({
 *      domId: "sel",
 *      zNodes: data,
 *      idKey: "id",
 *      pIdKey: "pId",
 *      keyName: "name",
 *      rootPId: -1,
 *      //
 *      checkEnable: true, // 显示勾选框
 *      fnCheck: function (event, treeId, treeNode) { // 勾选事件
 *          alert($('#sel [name="sel"]').val());
 *      }
 *  }).init();
 *
 *  // 初始选中前5个节点
 *  var array = [];
 *  var nodes = treeObj.transformToArray(treeObj.getNodes());
 *  $.each(nodes, function (index, element) {
 *      array.push(element.name);
 *      return index < 4; // false跳出
 *  });
 *  $('#sel [name="sel"]').val(array.join(",")).change();
 * 
 * 
 */
xy.ztree.dropdown = function (option) {
    this.domId = option.domId;
    this.checkEnable = option.checkEnable != undefined ? option.checkEnable : false;
    this.fieldname = option.fieldname != undefined ? option.fieldname : this.domId;
    this.url = option.url;
    this.zNodes = option.zNodes;
    this.ignoreHalf = option.ignoreHalf != undefined ? option.ignoreHalf : true;
    this.mergeChildren = option.mergeChildren != undefined ? option.mergeChildren : false; // v18.0704.1758
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
    this.fnOnClick = option.fnOnClick;
    this.fnOnCheck = option.fnOnCheck;
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
                    var nodes = treeObj.transformToArray(treeObj.getNodes());
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
                this_.$hidden.val(ids).triggerHandler("input");
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
                    this_.$text.change();
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

                if (this_.fnOnClick)
                    return this_.fnOnClick(e, treeId, treeNode);
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
                    if (this_.ignoreHalf) {
                        if (nodes[i].getCheckStatus().half) // 半勾的不列入统计
                            continue;
                    }
                    if (this_.mergeChildren) { // v18.0704.1758 如果子节点全部勾选，将只显示父节点
                        if (nodes[i].getParentNode() && nodes[i].getParentNode().check_Child_State == "2")
                            continue;
                    }
                    names += nodes[i][this_.keyName] + ",";
                    ids += nodes[i][this_.idKey] + ",";
                }
                if (names.length > 0) names = names.substring(0, names.length - 1);
                if (ids.length > 0) ids = ids.substring(0, ids.length - 1);
                //this_.$hidden.val(ids); //.change();
                this_.$hidden.val(ids).triggerHandler("input");
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
                    this_.$text.change();
                } else if (this_.style == "modal") {
                    if (names != "") {
                        this_.$button.text(names);
                    } else {
                        this_.$button.text(this_.emptyText);
                    }
                    this_.val(names); // bootstrapvalidator.js 判断的是value
                    this_.change().triggerHandler("input"); // bootstrapvalidator.js 要input事件触发验证
                }

                if (this_.fnOnCheck)
                    return this_.fnOnCheck(e, treeId, treeNode);
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
