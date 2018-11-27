var datas;
(function ($) {
    var timer;
    $.tj = {
        getUrlParam: function (name) {//获取参数
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return decodeURI(r[2]); return null; //返回参数值
        },
        setT: function (funtions, time) {
            clearInterval(timer);
            timer = setInterval(function () {
                funtions;//每秒钟时事加载异常数据
                //console.log("timer")
            }, time)
        },
        Percentage: function (number1, number2) {
            if (number1 == 0 && number2 == 0) {
                return "0%";
            } else {
                return (Math.round(parseInt(number1) / (parseInt(number2) + parseInt(number1)) * 10000) / 100.00 + "%");// 小数点后两位百分比
            }
        },
        LoadAuthorizedMenus: function (modulecode) {
            var obj;
            $.ajax("/ModuleManager/LoadAuthorizedMenus?modulecode=" + modulecode,
              {
                  async: false,
                  success: function (data) {
                      obj = JSON.parse(data);
                  }
              });
            return obj;
        },
        refreshTable: function () {
            window.location.reload();
        },        
        LoadAuthorizedByField: function (tablename) {
            var obj;
            $.ajax({
                type: "post",
                url: "/Home/LoadAuthorizedByField",
                async: false,
                data: {
                    tablename: tablename
                },
                dataType: "json",
                success: function (data) {
                    obj = data;
                }
            });
            return obj;            
        },
        LoadAuthorizedByRow: function (tablename) {
            var obj;
            $.ajax({
                type: "post",
                url: "/Home/LoadAuthorizedByRow",
                async: false,
                data: {
                    tablename: tablename
                },
                dataType: "json",
                success: function (data) {
                    obj = data;
                }
            });
            return obj;
        },
        loadTabAutority: function (ele) {//加载系统页面菜单栏
            $.ajax({
                type: "post",
                url: "/Home/GetMenuData",
                dataType: "json",
                async: false,
                success: function (data) {
                    datas = data;
                    var string = "", str = "";
                    for (var i = 0; i < data.length; i++)
                    {
                        var parent = GetParentId(data,ele);
                        if (data[i].Item.Id == parent)
                        data[i].Children.forEach(function (vals) {

                            if (vals.Item.Id == ele) {
                                str = '<li class="layui-this"><a href="javascript:void(0)">' + vals.Item.Name + '</a></li>';
                            } else {
                                str = '<li><a href="' + vals.Item.Url + '">' + vals.Item.Name + '</a></li>';
                            }
                            string += str;
                        })
                    }

                    $("#layuiTab>.layui-tab-title").html(string);
                }
            })
            return datas;
        },
        GetTimeSet: function (kind) {//返回监控页面的各项时间配置
            var objs;
            $.ajax({
                type: "post",
                url: "/Monitor/GetTimeSet",
                dataType: "json",
                async: false,
                success: function (data) {
                    if (kind == "allRefreshTime") {
                        objs = data.allRefreshTime;
                    } else if (kind == "listScrollTime") {
                        objs = data.listScrollTime;
                    } else if (kind == "sessionScrollTime") {
                        objs = data.sessionScrollTime;
                    } else if (kind == "tableScrollTime") {
                        objs = data.tableScrollTime;
                    }
                }
            });
            return objs;
        },
        GetColorAndTimeSet: function (kind) {//返回首页地图颜色 以及滚动时间配置
            var objs;
            $.ajax({
                type: "post",
                url: "/Home/GetColorAndTimeSet",
                dataType: "json",
                async: false,
                success: function (data) {
                    if (kind == "exceptionScrollTime") {
                        objs = data.exceptionScrollTime;
                    } else if (kind == "mapExceptionColor") {
                        objs = data.mapExceptionColor;
                    } else if (kind == "mapNormalColor") {
                        objs = data.mapNormalColor;
                    } else if (kind == "serousTime") {
                        objs = data.serousTime;
                    } else if (kind == "projectExcepitonLevelRefreshTime") {
                        objs = data.projectExcepitonLevelRefreshTime;
                    }
                }
            });
            return objs;
        },
        GetAllColorAndTimeSet: function () {//返回全部的首页地图颜色 以及滚动时间配置
            var objs;
            $.ajax({
                type: "post",
                url: "/Home/GetColorAndTimeSet",
                dataType: "json",
                async: false,
                success: function (data) {
                    objs = data;
                }
            });
            return objs;
        },
        autoTableBody: function () {     //自动调整火狐浏览器下系统的菜单内容
            var h = $(document).height() - 245;
            $(".layui-table-body").css("height", h + "px");
            $("div.layui-table-view").height(h+131)
        },
        showList: function (resetPage) { //接入用户管理页面数据的自刷新
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
    }
    //$.fn.xxx = function(){}
})(jQuery);
var explorer = navigator.userAgent;

function GetParentId(data, ele) {
    var str="";
    for (var i = 0; i < data.length; i++)
    {
        for (var j = 0; j < data[i].Children.length; j++) {
            if (ele == data[i].Children[j].Item.Id) {
                str = data[i].Children[j].Item.ParentId;
            }
        }
    }
    return str;
}
var timer;
function updateTime() {
    if (timer != null) {
        clearTimeout(timer);
        timer = null;
    }
    timer = setTimeout(function () { showList();  }, timeout);
    $(".NoData").width($("#Monitor_table .table tbody").width() - 10)
    $("#Monitor_table .table thead tr").width($("#Monitor_table .table tbody").width() - 10)
    $("#Monitor_table .table tbody tr").width($("#Monitor_table .table tbody").width() - 10)
}

function pageselectCallback(pageIndex, jq) {
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
            } else {
                $(".pagination").hide();
                if (data.url) {
                    artAlert(data.info, data.url);
                    return;
                }
                LoadAuthorizedByField()
                html.push('<tr><td colspan="' + (11 - $.tj.LoadAuthorizedByField("AccessuserList").Result.length) + '" class="text-center operate">没有记录</td></tr>');
                $("#InsertUserManager .table tbody").html(html.join(""));
                $(".operate").width($("#InsertUserManager .table tbody").width())
            }
            //$("#InsertUserManager .table thead tr").width($("#InsertUserManager .table tbody").width() - 10)            
            explorer.indexOf("MSIE") >= 0 ? $("#InsertUserManager .table thead tr").width($("#InsertUserManager .table tbody").width() - 18) : $("#InsertUserManager .table thead tr").width($("#InsertUserManager .table tbody").width() - 10);
            $("#InsertUserManager .table tbody").css("max-height", $(window).height() - 240)
        },
        error: function () {
            var html = [];
            LoadAuthorizedByField()
            html.push('<tr><td colspan="' + (11 - $.tj.LoadAuthorizedByField("AccessuserList").Result.length) + '" class="text-center operate">信息错误</td></tr>');
            $(".operate").width($("#InsertUserManager .table tbody").width())
            $("#InsertUserManager .table tbody").html(html.join(""));
            explorer.indexOf("MSIE") >= 0 ? $("#InsertUserManager .table thead tr").width($("#InsertUserManager .table tbody").width() - 18) : $("#InsertUserManager .table thead tr").width($("#InsertUserManager .table tbody").width() - 10);
        }
    });
}