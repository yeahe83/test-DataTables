/* =========================================================
 * xy.datatables.js (v18.0529.1657)
 * ========================================================= */

/**
 * jquery.datatables.js 扩展
 */

var xy;
if (!xy)
    xy = {};
if (!xy.datatables)
    xy.datatables = {};

xy.datatables = function (option) {
    this.tableId = option.tableId; // 表格的domID
    /* 数据来源
     * @param {string} option.ajax.show：查询的url，返回json格式规范 { data: [] }
     * @param {string} option.ajax.add：新增的url
     * @param {string} option.ajax.edit：编辑的url
     * @param {string} option.ajax.delete：删除的url
     * @param {boolean} option.destroy：是否每次查询都重新构建（缺省为true），建议为false
     * @param {array} option.data：数据（常用于简单查询）（忽略ajax）
     */
    if (option.data) {
        this.data = option.data;
    } else if (option.ajax) {
        this.ajax = option.ajax; // 可以直接调用initBody时更新ajax
    }
    this.destroy = option.destroy == undefined ? true : option.destroy; // 是否每次查询都重新构建（缺省为true），建议为false
    /* 列
     * -- 表格显示相关
     * @param {string} option.cols[x].display：字段th显示的文字
     * @param {string} option.cols[x].fieldName：字段fieldname
     * @param {boolean} option.cols[x].visible：本列是否可见
     * @param {boolean} option.cols[x].key：本列的fieldname是否删除用主键
     * @param {callback} option.cols[x].render：数据重画，仅用于显示
     * @param {string} option.cols[x].action：特殊用途的列（"Edit"-[编辑][删除]的操作列。"custom"-自定义列，配合col[x].CustomHtml）
     * @param {string} option.cols[x].CustomHtml: 自定义DOM
     * @param {boolean} option.cols[x].orderable：本列是否可以顶部点击排序（我主要是禁止checkbox列排序）
     * @param {string} option.cols[x].defaultContent：缺省值，及找不到数据时填充
     * @param {string} option.cols[x].add_value：新增时缺省值（比如某些非编辑字段）
     * @param {string} option.cols[x].edit_value：编辑时缺省值（比如某些非编辑字段）
     * -- 编辑框相关
     * @param {string} option.cols[x].modalType：自动创建modal时，生成的控件类型，目前支持hidden/text/memo/select/ztree_dropdown/editor/datepicker/datepicker-range ★
     * @param {boolean} option.cols[x].add_visible：本列在modal方式新增时是否可见（缺省可见），注：不可见无法赋值
     * @param {boolean} option.cols[x].edit_visible：本列在modal方式编辑时是否可见（缺省可见），注：不可见无法赋值
     */
    this.cols = option.cols;
    /* 其他表格显示
     * @param {string} option.optionDom：datatables的布局样式（对应datatables-option-dom）
     * @param {string} option.pageLength：初始显示条数（缺省15）
     * @param {string} option.order：初始排序列号（datatables-option-order）（eg：[[3, "desc"]] 第三列降序）
     * @param {string} option.i18n：i18n相关
     * @param {string} option.options：其他option
     * @param {callback} option.fnDataLoaded：获取数据之后和写到table之前的callback
     * @param {callback} option.fnDrawn：写到table之后的callback，显示之后的修改都写在这里（后续修改可使用 var oTable = $('#table').DataTable()）
     * @param {callback} option.fnfooterCallback：http://datatables.net/reference/option/footerCallback
     */
    this.optionDom = option.optionDom ? option.optionDom : "<'row'<'col-sm-6'l><'col-sm-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>" //"flt<'row DTTTFooter'<'col-sm-6'i><'col-sm-6'p>>";//"lfrtip";
    this.pageLength = option.pageLength == undefined ? 15 : option.pageLength;
    this.order = option.order;
    this.i18n = option.i18n;
    this.options_plus = option.options == undefined ? {} : option.options;
    this.fnDataLoaded = option.fnDataLoaded;
    this.fnDrawn = option.fnDrawn;
    this.fnfooterCallback = option.fnfooterCallback;
    /* 其他编辑框 
     * @param {string} option.btnAddId："新增"按钮的domID
     * @param {string} option.btnDelId："删除"按钮的domID
     * @param {string} option.modalId："新增/编辑modal"的domID
     * @param {boolean} option.modalAutoCreated： 是否自动创建modal
     * @param {boolean} option.modalDestroy： 是否每次都重新创建（缺省false）
     * @param {boolean} option.formId： 自动创建modal的formId
     * @param {boolean} option.postEncode: 是否在modal提交时编码（缺省为false），若为true则后台需要解码
     * @param {callback} option.fnModalSetValidator：设置验证器
     * @param {callback} option.fnModalAutoCreated：自动创建modal后的callback，此时可以对编辑框进行初始化
     * @param {callback} option.fnModalInit：数据写到modal前的callback
     * @param {callback} option.fnModalShowing：数据写到modal后，显示之前的callback
     * @param {callback} option.fnModalSubmitting：提交前的callback，如果返回false会中止提交动作
     * @param {callback} option.fnModalSaveAllDone：保存（含删除）后的动作
     */
    this.btnAddId = option.btnAddId; // 新增按钮
    this.btnDelId = option.btnDelId; // 删除按钮（如果需要多选删除）
    this.modalId = option.modalId;   // 新增编辑框的domID
    this.modalAutoCreated = option.modalAutoCreated;  // 是否自动创建modal
    this.modalDestroy = option.modalDestroy ? option.modalDestroy : false; // 是否每次都重新创建（缺省false）
    this.formId = option.formId == undefined ? "form1" : option.formId;    // 自动创建modal的formId
    this.postEncode = option.postEncode == undefined ? false : option.postEncode; // 是否在modal提交时编码（缺省为false），若为true则后台需要解码
    this.fnModalSetValidator = option.fnModalSetValidator;
    this.fnModalAutoCreated = option.fnModalAutoCreated;
    this.fnModalInit = option.fnModalInit;
    this.fnModalShowing = option.fnModalShowing;
    this.fnModalSubmitting = option.fnModalSubmitting;
    this.fnModalSaveAllDone = option.fnModalSaveAllDone; // v18.0508.1749

    this.$table = $("#" + this.tableId);
    this.$btnAdd = $("#" + this.btnAddId);
    this.$btnDel = $("#" + this.btnDelId);
    this.$modal = $("#" + this.modalId);

    this.btnEditDeleteHtml = '<a href="#" class="btn btn-primary btn-xs edit"><i class="fa fa-edit"></i> ' + (this.i18n ? this.i18n.t("xydatetable.mod") : "编辑") + '</a> <a href="#" class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> ' + (this.i18n ? this.i18n.t("xydatetable.del") : "删除") + '</a>';
    this.CheckBoxHtml = '<div class="checkbox"><label><input type="checkbox" /><span class="text"></span></label></div>';

}
xy.datatables.prototype = (function () {
    return {
        constructor: xy.datatables,
        // init all
        init: function () {
            this.initHead();
            this.initBody();
            if (this.modalAutoCreated) // 是否自动创建modal
                this.initModal();
        },
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
                    case "hidden": // v17.0605.1053
                        modal_rows += String()
                            + '<input type="hidden" name="' + col.fieldName + '" data-field="' + col.fieldName + '" placeholder="" ' + (col.domId ? ' id=' + col.domId : "") + ' />'
                        break;
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
                + '<div class="modal-dialog">'
                + '<div class="modal-content">'
                + '<div class="modal-header">'
                + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '<h5 class="modal-title">编辑</h5>'
                + '</div>'
                + '<div class="modal-body">'
                + '<form id="' + formId + '" method="post" class="form-horizontal"'
                + 'data-bv-message="This value is not valid"'
                + 'data-bv-feedbackicons-valid="glyphicon glyphicon-ok"'
                + 'data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"'
                + 'data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">'

                + '<div class="container-fluid modal-rows">'
                + '<div class="row">'
                + modal_rows
                + '</div>'
                + '</div>'

                + '</form>'

                + '</div>'
                + '<div class="modal-footer">'
                + '<button type="button" class="btn btn-default btn-sm cancel" data-dismiss="modal"><i class="fa fa-times"></i> 关闭</button>'
                + '<button type="submit" class="btn btn-primary btn-sm save"><i class="fa fa-save"></i> 保存</button>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>');

            this_.$modal = $("#" + this.modalId);

            // modal自动创建后的callback
            if (this_.fnModalAutoCreated) {
                this_.fnModalAutoCreated();
            }

            return this;
        },
        // init thead
        initHead: function () {
            var this_ = this;
            this_.$thead = this_.$table.find('thead');
            this_.$tbody = this_.$table.find("tbody");
            this_.$foot = this_.$table.find('tfoot');

            // 不重新构建（使用 .ajax.url().load()加载数据），此时不应该改动thead
            if (!this_.destroy && this_.ajax) {
                if ($.fn.dataTable.isDataTable("#" + this_.tableId)) {  // 是否已经Database()过了
                    return this_;
                }
            }

            // thead 清空和从 this_.cols[i].display 中读取
            var thead_html = '<tr>';
            for (var i = 0; i < this_.cols.length; i++) {
                var fieldname = (this_.cols[i].fieldName) ? this_.cols[i].fieldName : "";
                var action = (this_.cols[i].action) ? this_.cols[i].action : "";

                // checkbox的处理
                if (action == "CheckBox") {
                    this_.cols[i].display = this_.CheckBoxHtml;
                }

                thead_html += ('<th data-fieldname="' + fieldname + '" data-action="' + action + '">' + this_.cols[i].display + '</th>');
            }
            thead_html += '</tr>';
            this_.$thead.html(thead_html);

            // tbody 清空
            this_.$tbody.empty();

            // checkbox的处理
            this_.$thead.find(":checkbox").click(function () {
                var $checkbox = this_.$tbody.find(":checkbox");
                if ($(this).is(":checked")) {
                    $checkbox.prop('checked', true);
                    $checkbox.closest("tr").addClass('selected');
                }
                else {
                    $checkbox.prop("checked", false);
                    $checkbox.closest("tr").removeClass('selected');
                }
            });

            return this_;
        },
        // init tbody
        initBody: function (ajax, data) {
            var this_ = this;

            // v16.1221.1449
            if (ajax)
                this_.ajax = ajax;
            else if (data)
                this_.data = data;

            this_.runDataTable(); // 执行 this_.oTable.DataTable 注意是 D，返回.api

            // add
            if (this_.$btnAdd) {
                this_.$btnAdd.off("click").click(function (e) {
                    e.preventDefault();
                    this_.edit();
                });
            }

            // edit
            this_.$table.off("click", 'a.edit').on("click", 'a.edit', function (e) {
                e.preventDefault();
                var nRow = $(this).parents('tr')[0];
                this_.edit(nRow);
            });

            // multi delete
            if (this_.$btnDel) {
                this_.$btnDel.off("click").click(function (e) {
                    e.preventDefault();
                    this_.delete("selected");
                });
            }

            // delete
            this_.$table.off("click", "a.delete").on("click", 'a.delete', function (e) {
                e.preventDefault();
                var nRow = $(this).parents('tr')[0];
                this_.delete(nRow);
            });

            return this;
        },
        // core function
        runDataTable: function () {
            var this_ = this;

            if ($.fn.dataTable.isDataTable("#" + this_.tableId)) {  // 是否已经Database()过了
                if (!this_.destroy && this_.ajax) { // 不重新构建
                    this_.oTable = this_.$table.DataTable();
                    this_.oTable.ajax.url(this_.ajax.show).load();
                    return;
                }
                else {
                    this_.$table.DataTable().destroy(); // 销毁以便重新载入data
                    this_.$table.find("tbody").empty(); // 不清空依然会报 http://datatables.net/manual/tech-notes/3
                }
            }

            var columns = new Array;	// 绑定列
            var columnDefs = new Array; // 非绑定列
            for (var i = 0; i < this_.cols.length; i++) {
                var columnDef = { "targets": i };
                if (this_.cols[i].visible != null)
                    columnDef.visible = this_.cols[i].visible;
                if (this_.cols[i].orderable != null)
                    columnDef.orderable = this_.cols[i].orderable;
                if (this_.cols[i].defaultContent != null)
                    columnDef.defaultContent = this_.cols[i].defaultContent;
                if (this_.cols[i].action == "Edit")
                    columnDef.defaultContent = this_.btnEditDeleteHtml;
                if (this_.cols[i].action == "CheckBox")
                    columnDef.defaultContent = this_.CheckBoxHtml;
                if (this_.cols[i].action == "custom")
                    columnDef.defaultContent = this_.cols[i].CustomHtml;
                if (this_.cols[i].render != null)
                    columnDef.render = this_.cols[i].render;

                columnDefs.push(columnDef);

                // columns
                columns.push({
                    "data": this_.cols[i].fieldName
                });
            }

            var dataTable_option =
                {
                    "lengthMenu": [ // 每页显示条数
                        [10, 20, 100, -1], // 值
                        [10, 20, 100, (this.i18n ? this.i18n.t("xydatetable.all") : "全部")] // 显示
                    ],
                    "pageLength": this_.pageLength, // 默认显示条数
                    "dom": this_.optionDom,
                    "language": { // 标签和提示
                        "search": "",
                        "sLengthMenu": "_MENU_",
                        "oPaginate": {
                            "sPrevious": this.i18n ? this.i18n.t("xydatetable.sPrevious") : "前一页",
                            "sNext": this.i18n ? this.i18n.t("xydatetable.sNext") : "后一页",
                        },
                        "info": this.i18n ? this.i18n.t("xydatetable.info") : "当前显示第 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
                        "infoEmpty": "",
                        "infoFiltered": "", // (搜索到 _MAX_ 条)
                        "loadingRecords": this.i18n ? this.i18n.t("xydatetable.loadingRecords") : "请稍候...",
                        "zeroRecords": this.i18n ? this.i18n.t("xydatetable.zeroRecords") : "没有数据",
                    },
                    "columnDefs": columnDefs,
                    "columns": columns,
                    //"scrollX": true,
                    "order": this_.order,
                    "rowCallback": function (row, data) {

                        // 第1列有checkbox的情况
                        $(row).find("td:nth-child(1) :checkbox").off("click").on("click", function () {

                            var $checkbox_thead = this_.$thead.find("tr th:nth-child(1) :checkbox");

                            if ($(this).is(":checked")) {
                                $(this).closest("tr").addClass('selected');

                                // 判断是否需要勾选thead
                                if ($checkbox_thead.is(":checked") == false && this_.$tbody.find("tr td:nth-child(1) :checkbox:checked").length == this_.$tbody.find("tr").length) {
                                    $checkbox_thead.prop('checked', true);
                                }

                            }
                            else {
                                $(this).closest("tr").removeClass('selected');

                                // 判断是否需要取消thead的勾选
                                if ($checkbox_thead.is(":checked")) {
                                    $checkbox_thead.prop('checked', false);
                                }
                            }
                        });
                    },
                    "footerCallback": function (tfoot, data, start, end, display) {
                        if (this_.fnfooterCallback) {
                            return this_.fnfooterCallback(tfoot, data, start, end, display);
                        }
                    }
                };

            if (this_.data) {
                dataTable_option.data = this_.data;
            }
            else if (this_.ajax) {
                dataTable_option.ajax = this_.ajax.show + "&date=" + new Date().getTime();
            }

            // other options
            // v18.0529.1657
            for (var key in this_.options_plus) {
                if (typeof this_.options_plus[key] === 'object' && this_.options_plus[key] !== null) {
                    dataTable_option[key] = Object.assign(this_.options_plus[key], dataTable_option[key]);
                } else {
                    dataTable_option[key] = this_.options_plus[key];
                }
            }

            //Datatable Initiating
            this_.oTable = this_.$table
                .off('xhr.dt').on('xhr.dt', function (e, settings, json) {
                    if (this_.fnDataLoaded)
                        this_.fnDataLoaded(settings, json);
                })
                .off('draw.dt').on('draw.dt', function (settings) {
                    if (this_.fnDrawn)
                        this_.fnDrawn(settings);
                })
                .DataTable(dataTable_option);
        },
        // add/edit
        edit: function (params) {
            var this_ = this;

            var tr_dom;
            if (params) {
                if (params.tr_dom)
                    tr_dom = params.tr_dom;
                else
                    tr_dom = params;
            }

            // 可拖动
            try {
                this_.$modal.draggable({ cursor: "move" });  // 可拖动（需要jqueryui）
            } catch (e) { }

            // 取消
            this_.$modal.find(".cancel").unbind("click").click(function () {
                this_.$modal.modal("hide");
            });

            // 保存
            this_.$modal.find(".save").unbind("click").click(function () {

                // 从表格读取数据
                var row_data;
                if (tr_dom) // 编辑
                    row_data = this_.oTable.row(tr_dom).data();
                else // 新增
                    row_data = {};

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
                        if (tr_dom) {// 编辑
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
                    url: (tr_dom) ? this_.ajax.edit : this_.ajax.add, // url
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
                                if (tr_dom) {// 编辑 
                                    this_.oTable.row(tr_dom).data(data.item_data).draw(false); // 保存到界面 
                                    this_.$modal.modal("hide"); // 关闭弹出窗 
                                } else { // 新增 
                                    this_.oTable.row.add(data.item_data).draw(false); // 新增到界面 
                                    this_.$modal.modal("hide"); // 关闭弹出窗 
                                }
                            }
                            else {
                                alert(this.i18n ? this.i18n.t(data.message) : data.message);
                                return;
                            }
                        }

                        // 保存后执行的callback
                        // v18.0529.1657
                        if (this_.fnModalSaveAllDone) { // v18.0508.1749
                            var ret = this_.fnModalSaveAllDone();
                            if (!ret)
                                return;
                        }
                    }
                });
            });

            // 从表格读取数据
            var row_data;
            if (tr_dom) {// 编辑
                row_data = this_.oTable.row(tr_dom).data();
                this_.$modal.find(".modal-title").text("编辑");
            } else {// 新增
                row_data = {};
                this_.$modal.find(".modal-title").text("新增");
            }

            // 输入框可见性
            for (var index = 0; index < this_.cols.length; index++) {
                var fieldName = this_.cols[index].fieldName;
                var $input_dom = this_.$modal.find("[name=" + fieldName + "]"); // 改成读name
                if (tr_dom) { // 编辑 
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
        delete: function (tr_dom) {
            var this_ = this;

            // only for single key
            var key_fieldName = "";
            for (var i = 0; i < this_.cols.length; i++) {
                if (this_.cols[i].key == true) {
                    key_fieldName = this_.cols[i].fieldName;
                    break;
                }
            }

            // get delete rows
            var rows_data = [];
            var msg = this.i18n ? this.i18n.t("xydatetable.querydel") : "确定删除？";
            if (tr_dom == "selected") { // 多选删除
                rows_data = this_.oTable.rows(".selected").data();
                if (rows_data.length == 0) { // v16.1221.1449
                    alert(this.i18n ? this.i18n.t("xydatetable.noselected") : "请选择要删除的项目");
                    return;
                }
                msg += "（共" + rows_data.length + "行）"; // v16.1221.1449
            }
            else // 单行删除
                rows_data.push(this_.oTable.row(tr_dom).data());

            if (confirm(msg) == false) {
                return;
            }

            // get delete ids
            var ids = new Array;
            for (var i = 0; i < rows_data.length; i++) {
                ids.push(rows_data[i][key_fieldName])
            }

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
                            if (tr_dom == "selected") // 多选删除
                                this_.oTable.rows('.selected').remove().draw(false);
                            else // 单行删除
                                this_.oTable.row(tr_dom).remove().draw(false);

                            alert(this.i18n ? this.i18n.t("xydatetable.delsucc") : "删除成功");
                        } else {
                            alert(this.i18n ? this.i18n.t(data.message) : data.message);
                            return;
                        }
                    }
                    if (this_.$btnDel.length > 0)
                        this_.$btnDel[0].disabled = false;

                    // 保存后执行的callback
                    // v18.0529.1657
                    if (this_.fnModalSaveAllDone) { // v18.0508.1749
                        var ret = this_.fnModalSaveAllDone();
                        if (!ret)
                            return;
                    }
                }
            });
        },
    }
})();