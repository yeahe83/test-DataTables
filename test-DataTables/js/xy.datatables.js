/* =========================================================
 * xy.datatables.js (v16.0126.1548)
 * ========================================================= */

/**
 * jquery.datatables.js 扩展
 *
 * - 构造函数 -
 * @description: 各种参数设置
 *
 * @param {string} option.tableId：表的domID（必填）

 * @param {object} option.ajax：ajax操作的url（和data二选一）
 * @param -- {string} option.show：查询的url（常用）
 * @param -- {string} option.add：新增的url（若有key则无需加查询条件）
 * @param -- {string} option.edit：编辑的url（若有key则无需加查询条件）
 * @param -- {string} option.delete：删除的url（若有key则无需加查询条件）

 * @param {array} option.data：数据（常用于简单查询）（和ajax二选一）

 * @param {array} option.cols：列属性（必填）
 * @param -- {string} option.cols[x].display：字段th显示的文字（常用）
 * @param -- {string} option.cols[x].fieldName：字段fieldname（常用）
 * @param -- {string} option.cols[x].defaultContent：缺省值，及找不到数据时填充
 * @param -- {string} option.cols[x].action：特殊用途的列（"Edit"-[编辑][删除]的操作列。"custom"-自定义列，配合col[x].CustomHtml。）
 * @param -- {boolean} option.cols[x].filterCol：暂时取消了，原来是显示列的过滤框
 * @param -- {boolean} option.cols[x].key：本列的fieldname是否删除用主键
 * @param -- {boolean} option.cols[x].visible：本列是否可见（缺省可见）
 * @param -- {boolean} option.cols[x].orderable：本列是否可以顶部点击排序（我主要是禁止checkbox列排序）
 * @param -- {callback} option.cols[x].render：对表的数据进行重画（仅用于显示，不影响绑定值）（eg：参考 Role_UserInfo.js）
 * @param -- {string} option.cols[x].add_value：新增时缺省值（比如某些非编辑字段）
 * @param -- {string} option.cols[x].edit_value：编辑时缺省值（比如某些非编辑字段）
 * @param -- {boolean} option.cols[x].add_visible：本列在modal方式新增时是否可见（缺省可见）
 * @param -- {boolean} option.cols[x].edit_visible：本列在modal方式编辑时是否可见（缺省可见）
 * @param -- {string} option.cols[x].CustomHtml: 自定义DOM

 * @param {string} option.btnAddId："新增"按钮的domID（常用）
 * @param {string} option.btnDelId："删除"按钮的domID
 * @param {string} option.modalId："新增/编辑modal"的domID（常用）
 * @param {boolean} option.modalAutoCreated： 是否自动创建modal
 * @param {boolean} option.formId： 自动创建modal的formId

 * @param {string} option.pageLength：初始显示条数（缺省15）
 * @param {string} option.order：初始排序列号（datatables-option-order）（eg：[[3, "desc"]] 第三列降序）
 * @param {string} option.optionDom：datatables的布局样式（datatables-option-dom）

 * @param {callback} option.fnModalAutoCreated：自动创建modal后的callback，此时可以对编辑框进行初始化
 * @param {callback} option.fnModalInit：数据写到modal前的callback
 * @param {callback} option.fnModalShowing：数据写到modal后执行的callback，时间在modal显示之前
 * @param {callback} option.fnModalSubmitting：modal提交前的callback，如果返回false会中止提交动作
 * @param {callback} option.fnDataLoaded：获取数据之后和写到table之前的callback
 * @param {callback} option.fnDrawn：写到table之后的callback，显示之后的修改都写在这里
 * @param {callback} option.fnfooterCallback：http://datatables.net/reference/option/footerCallback
 *
 * @return null
 *
 * - init -
 * @description: 具体实现功能 
 *
 * 或者分别调用 initHead, initBody
 *
 * - 备注 -
 * fnDrawn内部或其他需要后续修改table时，可使用 var oTable = $('#table').DataTable(); 随时获取oTable对象，继续对table操作
 */

var xy;
if (!xy)
    xy = {};
if (!xy.datatables)
    xy.datatables = {};

xy.datatables = function (option) {
    this.tableId = option.tableId;
    this.btnAddId = option.btnAddId;
    this.btnDelId = option.btnDelId;
    this.modalId = option.modalId;
    this.cols = option.cols;
    if (option.data)
        this.data = option.data;
    else if (option.ajax)
        this.ajax = option.ajax; // 可以直接调用initBody时更新ajax
    this.order = option.order;
    this.optionDom = option.optionDom ? option.optionDom : "flt<'row DTTTFooter'<'col-sm-6'i><'col-sm-6'p>>";//"lfrtip";
    this.fnModalAutoCreated = option.fnModalAutoCreated;
    this.fnModalInit = option.fnModalInit;
    this.fnModalShowing = option.fnModalShowing;
    this.fnModalSubmitting = option.fnModalSubmitting;
    this.CustomHtml = option.CustomHtml;
    this.pageLength = option.pageLength == undefined ? 15 : option.pageLength;
    this.fnDataLoaded = option.fnDataLoaded;
    this.fnDrawn = option.fnDrawn;
    this.fnfooterCallback = option.fnfooterCallback;
    this.i18n = option.i18n;
    this.modalAutoCreated = option.modalAutoCreated;
    this.formId = option.formId == undefined ? "form1" : option.formId;

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

            if ($("#" + modalId).length > 0) // modal不重复创建
                return this;

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

            // thead 清空和从 this_.cols[i].display 中读取
            this_.$thead.children().remove();
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
            this_.$thead.append(thead_html);

            // tfoot 清空
            this_.$foot.children().remove();

            // tbody 清空
            this_.$tbody.children().remove();

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

            return this;
        },
        // init tbody
        initBody: function (ajax, data) {
            var this_ = this;

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
                this_.$table.DataTable().destroy(); // 销毁以便重新载入data
                this_.$table.find("tbody").empty(); // 不清空依然会报 http://datatables.net/manual/tech-notes/3
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
                "autoWidth": false, // 按当页的记录调宽就行了
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

            //Datatable Initiating
            this_.oTable = this_.$table
                .on('xhr.dt', function (e, settings, json) {
                    if (this_.fnDataLoaded)
                        this_.fnDataLoaded(settings, json);
                })
                .on('draw.dt', function (settings) {
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
            this_.$modal.draggable({ cursor: "move" });  // 可拖动（需要jqueryui）

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
                    data: { "data": JSON.stringify(row_data) }, // 数据
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
                        $input_dom.text(value ? value : "").change();
                    }
                    else if ($input_dom.is(":text") || $input_dom.is("input[type=hidden]") || $input_dom.is("textarea") || $input_dom.is("select")) {
                        $input_dom.val(value ? value : "").change();
                    } else if ($input_dom.is(":checkbox")) {
                        $input_dom.prop('checked', (value) ? true : false);
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
            if (confirm(this.i18n ? this.i18n.t("xydatetable.querydel") : "确定删除？") == false) {
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

            // get delete rows
            var rows_data = [];
            if (tr_dom == "selected") // 多选删除
                rows_data = this_.oTable.rows(".selected").data();
            else // 单行删除
                rows_data.push(this_.oTable.row(tr_dom).data());

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
                }
            });
        },
    }
})();