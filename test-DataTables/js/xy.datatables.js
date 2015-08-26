/* =========================================================
 * xy.datatables.js (v15.0826.1755)
 * ========================================================= */

/**
 * jquery.datatables.js 扩展
 *
 * - 构造函数 -
 * @description: 各种参数设置
 *
 * @param {string} option.tableId：表的domID（必填）
 * @param {string} option.btnAddId："新增"按钮的domID（必填）
 * @param {string} option.btnDelId："删除"按钮的domID
 * @param {string} option.modalId："新增/编辑modal"的domID（必填）
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
 * @param -- {boolean} option.cols[x].add：本列在modal方式新增时是否可见（缺省可见）
 * @param -- {boolean} option.cols[x].edit：本列在modal方式编辑时是否可见（缺省可见）
 * @param -- {string} option.cols[x].CustomHtml: 自定义DOM
 * @param {string} option.pageLength：初始显示条数（缺省15）
 * @param {string} option.order：初始排序列号（datatables-option-order）（eg：[[3, "desc"]] 第三列降序）
 * @param {string} option.optionDom：datatables的布局样式（datatables-option-dom）
 * @param {callback} option.fnModalInit：数据写到modal前的callback
 * @param {callback} option.fnModalShowing：数据写到modal后执行的callback，时间在modal显示之前
 * @param {callback} option.fnModalSubmitting：modal提交前的callback，如果返回false会中止提交动作
 * @param {callback} option.fnDataLoaded：获取数据之后和写到table之前的callback
 * @param {callback} option.fnDrawn：写到table之后的callback，显示之后的修改都写在这里
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
    if (option.ajax)
        this.ajax = option.ajax; // 可以直接调用initBody时更新ajax
    this.order = option.order;
    this.optionDom = option.optionDom ? option.optionDom : "flt<'row DTTTFooter'<'col-sm-6'i><'col-sm-6'p>>";//"lfrtip";
    this.fnModalInit = option.fnModalInit;
    this.fnModalShowing = option.fnModalShowing;
    this.fnModalSubmitting = option.fnModalSubmitting;
    this.CustomHtml = option.CustomHtml;
    this.pageLength = option.pageLength == undefined ? 15 : option.pageLength;
    this.fnDataLoaded = option.fnDataLoaded;
    this.fnDrawn = option.fnDrawn;
    this.i18n = option.i18n;

    this.$table = $("#" + this.tableId);
    this.$btnAdd = $("#" + this.btnAddId);
    this.$btnDel = $("#" + this.btnDelId);
    this.$modal = $("#" + this.modalId);

    this.btnEditDeleteHtml = '<a href="#" class="btn btn-primary btn-xs edit"><i class="fa fa-edit"></i> ' + (this.i18n ? this.i18n.t("xydatetable.mod") : "编辑") + '</a> <a href="#" class="btn btn-danger btn-xs delete"><i class="fa fa-trash-o"></i> ' + (this.i18n ? this.i18n.t("xydatetable.del") : "删除") + '</a>';
    this.CheckBoxHtml = '<label><input type="checkbox" /><span class="text"></span></label>';

}
xy.datatables.prototype = (function () {
    return {
        constructor: xy.datatables,
        // init all
        init: function () {
            this.initHead();
            this.initBody(this.ajax);
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
        },
        // init tbody
        initBody: function (ajax, data) {
            var this_ = this;

            this_.ajax = ajax;
            this_.data = data; // new
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
                if (this_.cols[i].action == "custom") // new
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
                    [10, 20, 100, (this.i18n ? i18n.t("xydatetable.all") : "全部")] // 显示
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
                }
            };
            if (this_.ajax) {
                dataTable_option.ajax = this_.ajax.show + "&date=" + new Date().getTime();
            }
            if (this_.data) { // new
                dataTable_option.data = this_.data;
            }

            //Datatable Initiating
            this_.oTable = this_.$table
                .on('xhr.dt', function (e, settings, json) { // new
                    if (this_.fnDataLoaded)
                        this_.fnDataLoaded(settings, json);
                })
                .on('draw.dt', function (settings) { // new
                    if (this_.fnDrawn)
                        this_.fnDrawn(settings);
                })
                .DataTable(dataTable_option);
        },
        // add/edit
        edit: function (tr_dom) {
            var this_ = this;
            var row_data;

            // 取消
            this_.$modal.find(".cancel").unbind("click").click(function () {
                this_.$modal.modal("hide");
            });

            // 保存
            this_.$modal.find(".save").unbind("click").click(function () {

                // 准备数据
                for (var i = 0; i < this_.cols.length; i++) {

                    var fieldName = this_.cols[i].fieldName;
                    //var $input_dom = this_.$modal.find("#" + fieldName);
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

                // 提交前的callback
                if (this_.fnModalSubmitting) {
                    var ret = this_.fnModalSubmitting(row_data);
                    if (!ret)
                        return;
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
                                    this_.oTable.row(tr_dom).data(data.item_data).draw(); // 保存到界面 
                                    this_.$modal.modal("hide"); // 关闭弹出窗 
                                } else { // 新增 
                                    this_.oTable.row.add(data.item_data).draw(); // 新增到界面 
                                    this_.$modal.modal("hide"); // 关闭弹出窗 
                                }
                            }
                            else {
                                alert(i18n ? i18n.t(data.message) : data.message);
                                return;
                            }
                        }
                    }
                });
            });

            if (tr_dom) // 编辑
                row_data = this_.oTable.row(tr_dom).data();
            else // 新增
                row_data = {};

            // 数据写到界面前执行的callback
            if (this_.fnModalInit) {
                var ret = this_.fnModalInit(row_data);
                if (!ret)
                    return;
            }

            // 加载数据
            for (var index=0; index<this_.cols.length; index++) {
                var item = this_.cols[index];

                var fieldName = this_.cols[index].fieldName;
                var $input_dom = this_.$modal.find("[name=" + fieldName + "]"); // 改成读name
                if (fieldName && $input_dom.length > 0) {

                    // 输入框可见性
                    if (tr_dom) { // 编辑 
                        if (this_.cols[index].edit == false || $input_dom.data("edit-disabled") == "1")
                            $input_dom.closest(".form-group").hide();
                        else
                            $input_dom.closest(".form-group").show();
                    } else { // 新增 
                        if (this_.cols[index].add == false || $input_dom.data("add-disabled") == "1")
                            $input_dom.closest(".form-group").hide();
                        else
                            $input_dom.closest(".form-group").show();
                    }

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
                var ret = this_.fnModalShowing(row_data);
            }

            this_.$modal.modal();
        },
        // delete
        delete: function (tr_dom) {
            var this_ = this;
            if (confirm(this.i18n ? i18n.t("xydatetable.querydel") : "确定删除？") == false) {
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
                                this_.oTable.rows('.selected').remove().draw();
                            else // 单行删除
                                this_.oTable.row(tr_dom).remove().draw();
                                                        
                            alert(this.i18n ? i18n.t("xydatetable.delsucc") : "删除成功");
                        } else {
                            alert(this.i18n ? i18n.t(data.message) : data.message);
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