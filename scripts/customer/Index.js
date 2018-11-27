var explorer = navigator.userAgent;
showList();
TaskStrangeload();
function search() {
    //location.href = "/Customer/?pageSize=" + $("#txtPage").val() + "&keyword=" + $("#keyword").val();
    showList(1);
}

function checkedAll(obj) {
    var checked = $(obj).prop("checked");
    $(obj).parent().parent().find("input[type='checkbox']").prop("checked", checked);
}

function delCustomer() {
    if ($("#InsertUserManager .chk:checked").length === 0) {
        artAlert("请先选择一个单位");
        return;
    }
    var callback = function () {
        var ids = "";
        $("#InsertUserManager .chk:checked").each(function () {
            ids += $(this).val() + ",";
        });
        var url = "/Customer/Delete/";
        $.ajax({
            url: url,
            type: "post",
            data: { ids: ids },
            dataType: "json",
            success: function (data) {
                if (data.status == "y") {
                    alertClose("删除成功");
                    showList(1);
                } else {
                    artAlert(data.info);
                }
            }
        });
    };
    artCallback("是否删除选中用户？", callback);
}

function delRelation(id) {
    var callback = function () {
        var url = "/Customer/DeleteRelation";
        $.ajax({
            url: url,
            type: "post",
            data: { id: id },
            dataType: "json",
            success: function (data) {
                if (data.status === "y") {
                    alertClose("清空上报数据成功!");
                    showList(1);
                } else {
                    artAlert(data.info);
                }
            }
        });
    };
    artCallback("是否删除用户下所有监控数据？", callback);
}

function emptyAlldata() {
    if ($("#InsertUserManager .chk:checked").length === 0) {
        artAlert("请先选择一个单位");
        return;
    }
    var callback = function () {
        var ids = "";
        $("#InsertUserManager .chk:checked").each(function () {
            ids += "'" + $(this).val() + "'" + ",";
        });
        ids = ids.substring(0, ids.length-1)
        var url = "/Customer/BatchDeleteRelation";
        $.ajax({
            url: url,
            type: "post",
            data: { ids: ids },
            dataType: "json",
            success: function (data) {
                if (data.status == "y") {
                    alertClose("批量清空所有上报数据成功!");
                    showList(1);                    
                } else {
                    artAlert(data.info);
                }
            }
        });
    };
    artCallback("是否批量清空用户下所有上报数据？", callback);
}

function showTaskList(tasks, callback) {//对任务策略设置进行表格数据添加
    $.ajax({
        url: "/Customer/SelectTaskListDetail",
        data: { tasks: tasks },
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data.status === "y") {
                var strs = "", str;
                if (data.data.length == 0) {
                    strs = '<tr><td colspan="8" class="text-center">没有记录</td></tr>';
                }
                for (var i = 0; i < data.data.length; i++) {
                    str = '<tr><td style="width: 30px"><input name="tasks" type="checkbox" class="chk" value="' + data.data[i].Id + '" ' + (data.data[i].Checked ? "checked" : "") + '></td>' +
                                    '<td style="width: 200px">' + data.data[i].taskname + '</td><td style="width: 240px">' + data.data[i].taskdo + '</td><td style="width: 100px">' + data.data[i].tasktype + '</td><td style="width: 150px">' + data.data[i].tasktime + '</td><td style="width: 19%;max-width: 400px;" class="excuteTime">' + data.data[i].taskweek.replace(/0/ig, '7') + '&nbsp;' + data.data[i].taskday + data.data[i].tasktimes + '</td><td style="width: 100px;">' + data.data[i].taskwarn + '</td>';
                    if (data.username == "System") {
                        str += '<td style="text-align: center;width: 300px;"><a class="SettingDataDet"><i class="icon_editD layui-icon"></i>详情</a>';
                        str += '<a class="SettingDataMob"><i class="icon_edit layui-icon"></i>修改</a>';
                        str += '<a class="SettingDataDel"><i class="icon_deleteData layui-icon"></i>删除</a>';
                        str += '</td></tr>';
                    }
                    else {
                        var arr = data.module;
                        $.each(arr, function (i, val) {
                            if (val.DomId == "detailview") {
                                str += '<td style="text-align: center;width: 300px;"><a class="SettingDataDet"><i class="icon_editD layui-icon"></i>详情</a>';
                            }
                            else if (val.DomId == "detailedit") {
                                str += '<a class="SettingDataMob"><i class="icon_edit layui-icon"></i>修改</a>';
                            }
                            else if (val.DomId == "detaildel") {
                                str += '<a class="SettingDataDel"><i class="icon_deleteData layui-icon"></i>删除</a>';
                            }
                        });
                        str += '</td></tr>';
                    }
                    strs += str;
                    $(".list-task > .list-group-item-info").after('<li class="list-group-item">' + data.data[i].taskname + '（' + data.data[i].taskdo + data.data[i].tasktype + data.data[i].tasktime + data.data[i].taskweek + data.data[i].taskday + data.data[i].taskwarn + '）<input name="tasks" type="checkbox" class="pull-right"  value="' + data.data[i].Id + '" ' + (data.data[i].Checked ? "checked" : "") + '></li>');
                }
                $("#SettingData").html(strs);
                if (callback) callback();
                $("#SettingData").css("max-height", $(window).height() - 220)
            }

        }
    });
}

function showRuleList(rules, callback) {
    $.ajax({
        url: "/Customer/SelectRuleList",
        data: { rules: rules },
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data.status === "y") {
                for (var i = 0; i < data.data.length; i++) {
                    $(".list-rule > .list-group-item-info").after('<li class="list-group-item">' + data.data[i].Info + '<input name="rules" type="checkbox" class="pull-right"  value="' + data.data[i].Id + '" ' + (data.data[i].Checked ? "checked" : "") + '></li>');
                }
                if (callback) callback();
            }
        }
    });
}

function openAssignModal(url, width) {
    if ($("#InsertUserManager .chk:checked").length === 0) {
        artAlert("请选择需要操作的单位");
        return;
    }

    if (url === "/Customer/AssignRule") {
        var id = $("#InsertUserManager .chk:checked").eq(0).val();
        url += "?id=" + id;
    }
    openModal(url, width);
}

function TaskStrangeload() {//对任务策略管理项做权限管理
    var data = $.tj.loadTabAutority();
    data.forEach(function (vals) {
        vals.Children.forEach(function (val) {
            if (val.Item.Name == "任务策略设置") {
                $(".TaskStrange").show();
                return false;
            }
        })
    })
}

function checkedNone() {
    $("#InsertUserManager thead>tr>th:first-child>input").attr("checked", false);
}
$(function () {    
    if ($.tj.getUrlParam('id') == 2) {
        $(".layui-tab .layui-tab-title li:first-child").removeClass("layui-this");
        $(".layui-tab .layui-tab-title li:last-child").addClass("layui-this");
        $(".layui-tab .layui-tab-content > div:first-child").removeClass("layui-show");
        $(".layui-tab .layui-tab-content > div:last-child").addClass("layui-show");
        $(".search").hide();
    }
    $(".layui-tab .layui-tab-title li:first-child").on("click", function () {
        $(".search").show();
    })
    $(".layui-tab .layui-tab-title li:last-child").on("click", function () {
        $(".search").hide();
    })
    $("#InsertUserManager").css("min-height", $(window).height() - 135);
    autoUpdatePageSize();
    $(".TaskStrange").on("click", function () {
        setTimeout(function () {
            $(".excute").css("min-width", $(".excuteTime")[0].clientWidth);
        }, 10)
    })
    $(window).resize(function () {
        setTimeout(function () {
            explorer.indexOf("MSIE") >= 0 ? $("#InsertUserManager .table thead tr").width($("#InsertUserManager .table tbody").width() - 18) : $("#InsertUserManager .table thead tr").width($("#InsertUserManager .table tbody").width() - 10);
            $("#InsertUserManager .table tbody").css("max-height", $(window).height() - 240)
            $("#SettingData").css("max-height", $(window).height() - 220)
            $(".operate").width($("#InsertUserManager .table tbody").width());
        }, 100);
    })
    
})
$(function () {
    var obj = $.tj.LoadAuthorizedMenus("Accessuser"), cons = "";
    obj.forEach(function (val) {
        var con = "", Icon = "";
        if (val.DomId == "btnAdd") { Icon = "icon_add" } else
            if (val.DomId == "btnDistributionTask") { Icon = "icon_deliverD" } else
                if (val.DomId == "btnUpdateversion") { Icon = "icon_upgrade" } else
                    if (val.DomId == "btnRuleSet") { Icon = "icon_warning" } else
                        if (val.DomId == "btnDistributionRule") { Icon = "icon_deliver" } else
                            if (val.DomId == "btnDel") { Icon = "icon_delete" } else
                                if (val.DomId == "btnRefresh") { Icon = "icon_updata" } else
                                    if (val.DomId == "emptyAlldata") { Icon = "icon_emptyAlldata" }
        con = '<div class="btn-group">' +
                    '<button class="btn btn-danger" id="' + val.DomId + '">' +
                    '<i class="layui-icon ' + Icon + '"></i>&nbsp;' + val.Name + '</button>' +
                '</div>';
        if (val.Attr == "0") {
            con = "";
        }
        cons += con;
    })
    $("#AccessuserMenu").html(cons);    
})
$(function () {
    var obj = $.tj.LoadAuthorizedMenus("ruleset"), cons = "";
    obj.forEach(function (val) {
        var Icon = "";
        if (val.DomId == "rulebtnAdd") { Icon = "icon_add" } else
            if (val.DomId == "ruleBtndel") { Icon = "icon_delete" }
        var con = "";
        con = '<div class="btn-group">' +
                    '<button class="btn btn-danger" id="' + val.DomId + '">' +
                    '<i class="layui-icon ' + Icon + '"></i>&nbsp;' + val.Name + '</button>' +
                '</div>';
        if (val.Attr == "0") {
            con = "";
        }
        cons += con;
    })
    $("#rulesetMenu").html(cons);
})

$(document).on("click", "#btnAdd", function () {
    openModal('/Customer/AddUser');
    explorer.indexOf("Trident") >= 0 ? '' : flex();
})
$(document).on("click", "#btnDistributionTask", function () {
    openAssignModal('/Customer/AssignTask', '60%');
    explorer.indexOf("Trident") >= 0 ? '' : flex();
})
$(document).on("click", "#btnUpdateversion", function () {
    openAssignModal('/Customer/UpdateVersion');
    explorer.indexOf("Trident") >= 0 ? '' : flex();
})
$(document).on("click", "#btnRuleSet", function () {
    openModal('/Customer/WarningRule', '770px');
    explorer.indexOf("Trident") >= 0 ? '' : block();
})

$(document).on("click", "#btnDistributionRule", function () {
    openAssignModal('/Customer/AssignRule', '60%');
    explorer.indexOf("Trident") >= 0 ? '' : flex();
})
$(document).on("click", "#btnDel", function () {
    delCustomer('/Customer/Delete/');
})
$(document).on("click", "#emptyAlldata", function () {
    emptyAlldata();
})
$(document).on("click", "#btnRefresh", function () {
    showList(1);
})
$(document).on("click", "#rulebtnAdd", function () {
    openModal('/Customer/SettingM', '700px');
})
$(document).on("click", "#ruleBtndel", function () {
    if ($(".TaskSeeting #SettingData .chk:checked").length === 0) {
        artAlert("请先选择一个单位");
        return;
    }
    delTasks();
})

var objRow = $.tj.LoadAuthorizedByRow("AccessuserList");
objRow.forEach(function (val) {//纵向的权限配置
    //console.log(val);
    $("#InsertUserManager #chkAccessUserID").each(function () {
        if (val.dataId == $(this).attr("value")) {
            var that = $(this).parent().siblings().last().children();
            val.SecondIdlist.forEach(function (vals) {
                that.each(function () {
                    if (vals == "edit" && $(this).text() != "编辑") {
                        that.after(" <a onclick=block();openModal('/Customer/Edit/" + val.dataId + "')> <i class='icon_edit layui-icon'></i> 编辑</a>")
                    }
                    if (vals == "distributeTask" && $(this).text() != "修改分配任务") {
                        that.after(" <a onclick=openModal('/Customer/EditAssignTask/" + val.dataId + "')> <i class='icon_editD layui-icon'></i> 修改分配任务</a>")
                    }
                    if (vals == "cleanData" && $(this).text() != "清空上报数据") {
                        that.after(" <a onclick=delRelation('" + val.dataId + "')> <i class='icon_deleteData layui-icon'></i> 清空上报数据</a>")
                    }
                })

            })

        }
    })
})

$(document).on("click", ".ui-dialog-autofocus", function () {
    $(".modal-content").removeAttr("style");
    $("#responsive").removeAttr("style");
})
$(document).on("click", ".ui-dialog-close", function () {
    $(".modal-content").removeAttr("style");
    $("#responsive").removeAttr("style");
})
$(parent.document).on("click", ".close", function () {
    $(".modal-content").removeAttr("style");
    $("#responsive").removeAttr("style");
})

$(function () {
    var _move = false;
    var _x, _y;

    $(document).ready(function () {//对所有弹出框进行可移动化处理
        $(document).on("click", ".modal-header", function () {
            //console.log($(".modal-content").contents().find(".modal-header"), $(".modal-header"))
        }).on("mousedown", ".modal-header", function (e) {
            _move = true;
            _x = e.pageX - parseInt($(".modal-content").css("left"))
            _y = e.pageY - parseInt($(".modal-content").css("top"));
            $(".modal-content").fadeTo(20, 1);
        })
        $(document).on("mousemove", ".modal-header", function (e) {
            if (_move) {
                var x = e.pageX - _x;
                var y = e.pageY - _y;
                $(".modal-content").css({ top: y, left: x });
            }
        }).on("mouseup", ".modal-header", function () {
            _move = false;
            $(".modal-content").fadeTo("fast", 1);
        })
    });
})

//加排序
function orderHandle(currentObj) {
    var $currentObj = $(currentObj);
    var order = $currentObj.data("order");
    $currentObj.parent().find("th").data("order", "");
    $currentObj.parent().find(".glyphicon").remove();
    if (order === "asc") {
        order = "desc";
        $currentObj.append('<span class="glyphicon glyphicon-arrow-down" style="font-size:12px;"></span>');
    } else {
        order = "asc";
        $currentObj.append('<span class="glyphicon glyphicon-arrow-up" style="font-size:12px;"></span>');
    }
    $currentObj.data("order", order);
    showList(1);
}
var currentNum = 1, pageCount = 0, pageSize = 50;
function updatePageSize() {
    pageSize = parseInt($("#txtPage").val()) || 50;
    $("#txtPage").val(pageSize);
    showList(1);
}
function autoUpdatePageSize() {
    pageSize = parseInt($("#txtPage").val()) || 50;
    pageSize = parseInt(($(window).height() - 120 - 200) / 34);
    $("#txtPage").val(pageSize);
    showList(1);
}
function showList(resetPage) {    
    var $active_a = $(".pagination .active a");
    if ($active_a.text()) {
        currentNum = parseInt($active_a.text());
    }
    selectRecordCount();
    var currentPage = 0;
    if (!resetPage) {
        var pageTotal = parseInt(pageCount / pageSize);
        if (pageCount % pageSize > 0) pageTotal++;
        if (currentNum > 1)
            currentPage = currentNum - 1;
        if (currentNum > pageTotal)
            currentPage = pageTotal - 1;
    }

    $(".pagination").pagination(pageCount, {
        num_edge_entries: 1,
        num_display_entries: 6,
        current_page: currentPage,
        items_per_page: pageSize,
        callback: pageselectCallback
    });
}

function selectRecordCount() {
    $.ajax({
        type: "post",
        url: "/Customer/SelectList",
        async: false,
        data: { keyword: $("#keyword").val() },
        dataType: "json",
        success: function (data) {
            if (data.status === "y") {
                pageCount = data.count;
            }
        }
    });
}

function nulltransfrom(val) {
    var data;
    if (val == null) {
        data = "";
    } else {
        data = val;
    }
    return data;
}

function pageselectCallback(pageIndex, jq) {//对介入用户管理进行表格数据添加
    $.ajax({
        type: "post",
        url: "/Customer/SelectList",
        data: {
            keyword: $("#keyword").val(),
            orderUnitName: $("#InsertUserManager .table th:eq(1)").data("order"),
            orderAddress: $("#InsertUserManager .table th:eq(3)").data("order"),
            orderVersion: $("#InsertUserManager .table th:eq(4)").data("order"),
            orderCustomName: $("#InsertUserManager .table th:eq(5)").data("order"),
            orderTechnicalPerson: $("#InsertUserManager .table th:eq(7)").data("order"),
            pageIndex: pageIndex + 1, pageSize: pageSize
        },
        dataType: "json",
        beforeSend: function () {            
            parent.$(".AllLoading").show();
        },
        success: function (data) {
            $(".btn-refresh").prop("disabled", false);
            var html = [];
            if (data.status === "y") {
                $(".pagination").show();
                var obj = $.tj.LoadAuthorizedByField("AccessuserList"), ColNum = 0, Colwidth = 0;
                var AccessUserID = '', UnitName = '', LoginUser = '', Province = '', Address = '', VersionDes = '', CustomName = '',
                    CustomPhone = '', TechnicalPerson = '', TechnicalPhone = '', TechnicalEmail = '';
                if (obj.Code == 200) {//横向的权限配置
                    obj.Result.forEach(function (val) {
                        if (val.indexOf("AccessUserID") == "0") {
                            $("#InsertUserManager .table-responsive thead tr>th:nth-child(1)").hide(); AccessUserID = "hide";; ColNum++;
                        }
                        if (val.indexOf("UnitName") == "0") {
                            $("#InsertUserManager .table-responsive thead tr>th:nth-child(2)").hide(); UnitName = "hide"; ColNum++;
                        }
                        if (val.indexOf("LoginUser") == "0") {
                            $("#InsertUserManager .table-responsive thead tr>th:nth-child(3)").hide(); LoginUser = "hide"; ColNum++;
                        }
                        if (val.indexOf("Province") == "0" && val.indexOf("Address") == "0") {
                            $("#InsertUserManager .table-responsive thead tr>th:nth-child(4)").hide(); Province = "hide"; Address = "hide"; ColNum++;
                        }
                        if (val.indexOf("VersionDes") == "0") {
                            $("#InsertUserManager .table-responsive thead tr>th:nth-child(5)").hide(); VersionDes = "hide"; ColNum++;
                        }
                        if (val.indexOf("CustomName") == "0") {
                            $("#InsertUserManager .table-responsive thead tr>th:nth-child(6)").hide(); CustomName = "hide"; ColNum++;
                        }
                        if (val.indexOf("CustomPhone") == "0") {
                            $("#InsertUserManager .table-responsive thead tr>th:nth-child(7)").hide(); CustomPhone = "hide"; ColNum++;
                        }
                        if (val.indexOf("TechnicalPerson") == "0") {
                            $("#InsertUserManager .table-responsive thead tr>th:nth-child(8)").hide(); TechnicalPerson = "hide"; ColNum++;
                        }
                        if (val.indexOf("TechnicalPhone") == "0") {
                            $("#InsertUserManager .table-responsive thead tr>th:nth-child(9)").hide(); TechnicalPhone = "hide"; ColNum++;
                        }
                        if (val.indexOf("TechnicalEmail") == "0") {
                            $("#InsertUserManager .table-responsive thead tr>th:nth-child(10)").hide(); TechnicalEmail = "hide"; ColNum++;
                        }
                    })
                    $("#UserManagerColspan").attr("colspan", 11 - ColNum);
                }
                for (var i = 0; i < data.data.length; i++) {
                    html.push('<tr>');
                    AccessUserID != "hide" ? html.push('<td class="' + AccessUserID + '" style="width: 2%;;min-width: 40px;max-width: 40px;"><input type="checkbox" e class="chk" id="chkAccessUserID" value="' + data.data[i].AccessUserID + '" onclick="stopEventBubble(event);checkedNone();"></td>') : '';
                    UnitName != "hide" ? html.push('<td class="' + UnitName + '" style="width: 11%;min-width: 240px;max-width: 240px;">' + data.data[i].UnitName + '</td>') : '';
                    LoginUser != "hide" ? html.push('<td class="' + LoginUser + '" style="width: 8%">' + data.data[i].LoginUser + '</td>') : '';
                    Province != "hide" && Address != "hide" ? html.push('<td class="' + Province + Address + '" style="width: 11%;min-width: 300px;max-width: 300px;">' + nulltransfrom(data.data[i].Province) + nulltransfrom(data.data[i].Address) + '</td>') : '';
                    VersionDes != "hide" ? html.push('<td class="' + VersionDes + '" style="width: 8%">' + nulltransfrom(data.data[i].VersionDes) + '</td>') : '';
                    CustomName != "hide" ? html.push('<td class="' + CustomName + '" style="width: 8%">' + (data.data[i].CustomName == null ? ' ' : data.data[i].CustomName) + '</td>') : '';
                    CustomPhone != "hide" ? html.push('<td class="' + CustomPhone + '" style="width: 8%">' + (data.data[i].CustomPhone == null ? ' ' : data.data[i].CustomPhone) + '</td>') : '';
                    TechnicalPerson != "hide" ? html.push('<td class="' + TechnicalPerson + '" style="width: 8%">' + (data.data[i].TechnicalPerson == null ? ' ' : data.data[i].TechnicalPerson) + '</td>') : '';
                    TechnicalPhone != "hide" ? html.push('<td class="' + TechnicalPhone + '" style="width: 9%">' + (data.data[i].TechnicalPhone == null ? ' ' : data.data[i].TechnicalPhone) + '</td>') : '';
                    TechnicalEmail != "hide" ? html.push('<td class="' + TechnicalEmail + '" style="width: 10%">' + (data.data[i].TechnicalEmail == null ? ' ' : data.data[i].TechnicalEmail) + '</td>') : '';
                    if (data.Account == "System") {
                        html.push('<td class="operate" style="width: 17%;text-align: center">');
                        html.push('<a onclick="openModal(\'/Customer/Edit/' + data.data[i].AccessUserID + '\');block();"><i class="icon_edit layui-icon"></i>编辑</a>');
                        html.push('<a onclick="openModal(\'/Customer/EditAssignTask/' + data.data[i].AccessUserID + '\',\'60%\')"><i class="icon_editD layui-icon"></i>修改分配任务</a>');
                        html.push('<a onclick="delRelation(\'' + data.data[i].AccessUserID + '\')"><i class="icon_deleteData layui-icon"></i>清空上报数据</a>');
                        html.push('</td>');
                    } else {
                        html.push('<td class="operate" style="width: 17%;text-align: center">');
                        var EditAssignTask = '/Customer/EditAssignTask/',
                            Edit = '/Customer/Edit/';
                        data.moduleElementdata.forEach(function (val) {
                            if (val.Attr == "0") {
                                if (val.DomId == "detailedit") {
                                    html.push('<a onclick="openModal(\'/Customer/Edit/' + data.data[i].AccessUserID + '\');block();" sort="' + data.data[i].Sort + '"><i class="icon_edit layui-icon"></i>编辑</a>');
                                } else if (val.DomId == "detailtask") {
                                    html.push('<a onclick="openModal(\'/Customer/EditAssignTask/' + data.data[i].AccessUserID + '\',\'60%\')" sort="' + data.data[i].Sort + '"><i class="icon_editD layui-icon"></i>修改分配任务</a>');
                                } else if (val.DomId == "detailClean") {
                                    html.push('<a onclick="delRelation(\'' + data.data[i].AccessUserID + '\')" sort="' + data.data[i].Sort + '"><i class="icon_deleteData layui-icon"></i>清空上报数据</a>');
                                }
                            }
                        })
                        html.push('</td>');
                    }
                    html.push('</tr>');
                }
                $("#InsertUserManager .table tbody").html(html.join(""));
                $("#InsertUserManager .table").css("border", "1px solid #e7ecf1");
                $("#InsertUserManager .table tbody").css("overflow-y", "scroll");
            } else {
                $(".pagination").hide();
                if (data.url) {
                    artAlert(data.info, data.url);
                    return;
                }
                LoadAuthorizedByField()
                html.push('<tr><td style="border: none;background: #fff;" colspan="' + (11 - $.tj.LoadAuthorizedByField("AccessuserList").Result.length) + '" class="text-center operate"><img style="width: 11%;margin-top: 6%;" src="/Src/static/img/bg/Nodate.png" alt="Nodate"></td></tr>');
                $("#InsertUserManager .table tbody").html(html.join(""));
                $("#InsertUserManager .table").css({ "border-left": "none", "border-bottom": "none", "border-right": "none" });
                $("#InsertUserManager .table tbody").css("overflow-y", "hidden");
                $(".operate").width($("#InsertUserManager .table tbody").width())
            }
            //$("#InsertUserManager .table thead tr").width($("#InsertUserManager .table tbody").width() - 10)            
            explorer.indexOf("MSIE") >= 0 ? $("#InsertUserManager .table thead tr").width($("#InsertUserManager .table tbody").width() - 18) : $("#InsertUserManager .table thead tr").width($("#InsertUserManager .table tbody").width() - 10);
            $("#InsertUserManager .table tbody").css("max-height", $(window).height() - 240)
        },
        complete: function () {
            parent.$(".AllLoading").hide();
        },
        error: function () {
            var html = [];
            LoadAuthorizedByField()
            html.push('<tr><td colspan="' + (11 - $.tj.LoadAuthorizedByField("AccessuserList").Result.length) + '" class="text-center operate">信息错误</td></tr>');
            $(".operate").width($("#InsertUserManager .table tbody").width())
            $("#InsertUserManager .table tbody").html(html.join(""));
            $("#InsertUserManager .table tbody").css("overflow-y", "hidden");
            explorer.indexOf("MSIE") >= 0 ? $("#InsertUserManager .table thead tr").width($("#InsertUserManager .table tbody").width() - 18) : $("#InsertUserManager .table thead tr").width($("#InsertUserManager .table tbody").width() - 10);
        }
    });
}

function LoadAuthorizedByField() {
    var obj = $.tj.LoadAuthorizedByField("AccessuserList")
    if (obj.Code == 200) {//横向的权限配置
        obj.Result.forEach(function (val) {
            if (val.indexOf("AccessUserID") == "0") {
                $("#InsertUserManager .table-responsive thead tr>th:nth-child(1)").hide();
            }
            if (val.indexOf("UnitName") == "0") {
                $("#InsertUserManager .table-responsive thead tr>th:nth-child(2)").hide();
            }
            if (val.indexOf("LoginUser") == "0") {
                $("#InsertUserManager .table-responsive thead tr>th:nth-child(3)").hide();
            }
            if (val.indexOf("Province") >= "0" && val.indexOf("Address") >= "0") {
                $("#InsertUserManager .table-responsive thead tr>th:nth-child(4)").hide();
            }
            if (val.indexOf("VersionDes") == "0") {
                $("#InsertUserManager .table-responsive thead tr>th:nth-child(5)").hide();
            }
            if (val.indexOf("CustomName") == "0") {
                $("#InsertUserManager .table-responsive thead tr>th:nth-child(6)").hide();
            }
            if (val.indexOf("CustomPhone") == "0") {
                $("#InsertUserManager .table-responsive thead tr>th:nth-child(7)").hide();
            }
            if (val.indexOf("TechnicalPerson") == "0") {
                $("#InsertUserManager .table-responsive thead tr>th:nth-child(8)").hide();
            }
            if (val.indexOf("TechnicalPhone") == "0") {
                $("#InsertUserManager .table-responsive thead tr>th:nth-child(9)").hide();
            }
            if (val.indexOf("TechnicalEmail") == "0") {
                $("#InsertUserManager .table-responsive thead tr>th:nth-child(10)").hide();
            }
        })
    }
}
