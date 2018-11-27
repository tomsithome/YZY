var timer,t;
var timeout = 3000;
var isStop = 0;
var pageCount = 0;
var pageSize = 50;
var shcoolstatu = "", concurrency = "", nodesktop = "", shutdown = "", norigster = "", havesession = "", haveException = "";

$(function () {
    pageSize = parseInt(($(window).height() - 120 - 100) / 34);
    showList();
    stateNum();
    $(document).on("click", "#listTab", function () {
        $(".Monitoe_home_search").show();
        $(".Monitor_detail_search").hide(); 
        $("#Monitor_table").show();
        $(".UnitList1").remove();
    })
    $(document).on("click", "#listTab1", function () {
        $(".Monitoe_home_search").show();
        $(".Monitor_detail_search").hide();
        $(".HomeUnitList .portlet").show();
        $(".HomeUnitList .UnitList1").remove();
    })
    $(".pagination,#s_province,#keyword,btn-refresh").hover(function () {
        isStop = 1;
    }, function () {
        isStop = 0;
    });
    $(".btn-refresh").on("click", function () {
        $(this).prop("disabled", true);
        setTimeout(function () { showList(); }, 1000);
    });
    $(document).on("click", "#GroupListDetail", function () {
        $(".Monitoe_home_search").hide();
        $(".Monitor_detail_search").show();
        $(this).parent().parent().parent().parent().parent().parent().after('<iframe src="' + $(this).attr("value") + '" frameborder="0" class="UnitList1"></iframe>');
        $(this).parent().parent().parent().parent().parent().parent().hide();
        $(".UnitList1").load(function () {
            $(".UnitList1").height($(".UnitList1").contents().find(".GroupList").height() + 6);
            $(".UnitList1").css("min-height", $(window).height() - 120);
            $(".UnitList1").contents().find(".GroupList>.portlet").css("min-height", $(window).height() - 120)
        });
        $("#hdUserId").val($(this).attr("value").split("=")[1]);
    })
    $(".filters").on("click", function () {
        $("#filterData").toggleClass("show");
    }).on("mouseover", function () {
        $("#filterData").addClass("show");
    })
    $("#filterData").on("mouseleave", function () {
        $("#filterData").removeClass("show");
    })
    $("#filterData>dd").on("click", function () {
        $(this).children("span").toggleClass("show");
        showList(1);
    })
    $("#Monitor_table").css("min-height", $(window).height() - 125);
    $("#listTab").on("click", function () {
        setTimeout(function () {
            $("#Monitor_table .table tbody").css("max-height", $(window).height() - 230)
            $(".NoData").width($("#Monitor_table .table tbody").width() - 10)
            $("#Monitor_table .table thead tr").width($("#Monitor_table .table tbody").width() - 10)
            $("#Monitor_table .table tbody tr").width($("#Monitor_table .table tbody").width() - 10)
        }, 10)
    })
    $(window).resize(function () {
        setTimeout(function () {
            $("#Monitor_table .table tbody").css("max-height", $(window).height() - 230)
            $(".NoData").width($("#Monitor_table .table tbody").width() - 10)
            $("#Monitor_table .table thead tr").width($("#Monitor_table .table tbody").width() - 10)
            $("#Monitor_table .table tbody tr").width($("#Monitor_table .table tbody").width() - 10)
        }, 10)
    })
});

function search() {    
    $(".UnitList1").attr("src", "/Home/GroupList/?pageSize=" + $(".UnitList1").contents().find("#txtPage").val() + "&keyword=" + $("#keyword.MDSkeyword").val() + "&userId=" + $("#hdUserId").val());
}

function updateTime() {
    if (timer != null) {
        clearTimeout(timer);
        timer = null;
    }
    timer = setTimeout(function () { showDateList(); stateNum(); }, timeout);
    $(".NoData").width($("#Monitor_table .table tbody").width() - 10)
    $("#Monitor_table .table thead tr").width($("#Monitor_table .table tbody").width() - 10)
    $("#Monitor_table .table tbody tr").width($("#Monitor_table .table tbody").width() - 10)
}

function selectRecordCount() {
    shcoolstatu = '';
    $("#filterData>dd:nth-child(1)>#filterDataOk").hasClass("show") ? (concurrency = 1) : (concurrency = '');
    $("#filterData>dd:nth-child(2)>#filterDataOk").hasClass("show") ? (nodesktop = 1) : (nodesktop = '');
    $("#filterData>dd:nth-child(3)>#filterDataOk").hasClass("show") ? (shutdown = 1) : (shutdown = '');
    $("#filterData>dd:nth-child(4)>#filterDataOk").hasClass("show") ? (norigster = 1) : (norigster = '');
    $("#filterData>dd:nth-child(5)>#filterDataOk").hasClass("show") ? (havesession = 1) : (havesession = '');
    $("#filterData>dd:nth-child(6)>#filterDataOk").hasClass("show") ? (haveException = 1) : (haveException = '');
    if ($("#filterData>dd:nth-child(7)>#filterDataOk").hasClass("show")) {
        shcoolstatu = shcoolstatu + '1,';
    }
    if ($("#filterData>dd:nth-child(8)>#filterDataOk").hasClass("show")) {
        shcoolstatu = shcoolstatu + '2,';
    }
    if ($("#filterData>dd:nth-child(9)>#filterDataOk").hasClass("show")) {
        shcoolstatu = shcoolstatu + '3,';
    }
    if ($("#filterData>dd:nth-child(7)>#filterDataOk").hasClass("show") && $("#filterData>dd:nth-child(8)>#filterDataOk").hasClass("show") && $("#filterData>dd:nth-child(9)>#filterDataOk").hasClass("show")) {
        shcoolstatu = '';
    } else if (!$("#filterData>dd:nth-child(7)>#filterDataOk").hasClass("show") && !$("#filterData>dd:nth-child(8)>#filterDataOk").hasClass("show") && !$("#filterData>dd:nth-child(9)>#filterDataOk").hasClass("show")) {
        shcoolstatu = '';
    }
    shcoolstatu = shcoolstatu.substring(0, shcoolstatu.lastIndexOf(","));
    $.ajax({
        type: "post",
        url: "/Home/SelectCount",
        async: false,
        data: {
            shcoolstatus: shcoolstatu,
            concurrency: concurrency, nodesktop: nodesktop, shutdown: shutdown, norigster: norigster, havesession: havesession, haveException: haveException,
            keyword: $("#keyword").val(), province: $("#s_province").val()
        },
        dataType: "json",
        success: function (data) {
            if (data.status === "y") {
                pageCount = data.data;
            }
        }
    });
}

function updatePageSize() {
    pageSize = parseInt($("#txtPage").val()) || 50;
    $("#txtPage").val(pageSize);
    showList(1);
}

var currentNum = 1;
function showList(resetPage) {
    if (isStop === 1) {
        updateTime();
        return;
    }
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
    $(".UnitList1").load(function () {
        $(".UnitList1").height($(".UnitList1").contents().find(".GroupList").height());
    });
}

function showDateList() {
    if (isStop === 1) {
        updateTime();
        return;
    }
    var $active_a = $(".pagination .active a");
    if ($active_a.text()) {
        currentNum = parseInt($active_a.text());
    }
    selectRecordCount();
    var currentPage = 0;
    $(".pagination").pagination(pageCount, {
        num_edge_entries: 1,
        num_display_entries: 6,
        current_page: currentPage,
        items_per_page: pageSize,
        callback: pageDateselectCallback
    });
    $(".UnitList1").load(function () {
        $(".UnitList1").height($(".UnitList1").contents().find(".GroupList").height());
    });
}

function stateNum() {
    $.ajax({
        type: "post",
        url: "/Home/SelectList",
        data: {
            shcoolstatus: "",
            concurrency: "", nodesktop: "", shutdown: "", norigster: "", havesession: "", haveException: "",
            keyword: '', province: '',
            orderOnlineState: '',
            orderName: '',
            orderConcurrencyNum: '',
            orderDesktopNum: '',
            orderCloseNum: '',
            orderOpenNum: '',
            orderRegisterNum: '',
            orderNotRegisterNum: '',
            orderSessionNum: '',
            orderIsException: '',
            orderLastActivityTime: '',
            pageIndex: '', pageSize: '1000000000'
        },
        dataType: "json",
        success: function (data) {            
            var html = [], OnlineState = 0, OffLine = 0, mainTain=0;
            if (data.status === "y") {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].OnlineState == 1) {
                        OnlineState++;
                    } else if (data.data[i].OnlineState == 2) {
                        OffLine++;
                    } else if (data.data[i].OnlineState == 3) {
                        mainTain++;
                    }
                }
                $("#OnlineStates").html("（" + OnlineState + "）");
                $("#OffLine").html("（" + OffLine + "）");
                $("#mainTain").html("（" + mainTain + "）");
            } 
        }
    });

}

function pageselectCallback(pageIndex, jq) {
    shcoolstatu = '';
    $("#filterData>dd:nth-child(1)>#filterDataOk").hasClass("show") ? (concurrency = 1) : (concurrency = '');
    $("#filterData>dd:nth-child(2)>#filterDataOk").hasClass("show") ? (nodesktop = 1) : (nodesktop = '');
    $("#filterData>dd:nth-child(3)>#filterDataOk").hasClass("show") ? (shutdown = 1) : (shutdown = '');
    $("#filterData>dd:nth-child(4)>#filterDataOk").hasClass("show") ? (norigster = 1) : (norigster = '');
    $("#filterData>dd:nth-child(5)>#filterDataOk").hasClass("show") ? (havesession = 1) : (havesession = '');
    $("#filterData>dd:nth-child(6)>#filterDataOk").hasClass("show") ? (haveException = 1) : (haveException = '');
    if ($("#filterData>dd:nth-child(7)>#filterDataOk").hasClass("show")) {
        shcoolstatu = shcoolstatu + '1,';
    }
    if ($("#filterData>dd:nth-child(8)>#filterDataOk").hasClass("show")) {
        shcoolstatu = shcoolstatu + '2,';
    }
    if ($("#filterData>dd:nth-child(9)>#filterDataOk").hasClass("show")) {
        shcoolstatu = shcoolstatu + '3,';
    }
    if ($("#filterData>dd:nth-child(7)>#filterDataOk").hasClass("show") && $("#filterData>dd:nth-child(8)>#filterDataOk").hasClass("show") && $("#filterData>dd:nth-child(9)>#filterDataOk").hasClass("show")) {
        shcoolstatu = '';
    } else if (!$("#filterData>dd:nth-child(7)>#filterDataOk").hasClass("show") && !$("#filterData>dd:nth-child(8)>#filterDataOk").hasClass("show") && !$("#filterData>dd:nth-child(9)>#filterDataOk").hasClass("show")) {
        shcoolstatu = '';
    }
    shcoolstatu = shcoolstatu.substring(0, shcoolstatu.lastIndexOf(","));
    $("#filterData>dd:nth-child(1)>#filterDataOk").hasClass("show") ? (concurrency = 1) : (concurrency = '');
    $("#filterData>dd:nth-child(2)>#filterDataOk").hasClass("show") ? (nodesktop = 1) : (nodesktop = '');
    $("#filterData>dd:nth-child(3)>#filterDataOk").hasClass("show") ? (shutdown = 1) : (shutdown = '');
    $("#filterData>dd:nth-child(4)>#filterDataOk").hasClass("show") ? (norigster = 1) : (norigster = '');
    $("#filterData>dd:nth-child(5)>#filterDataOk").hasClass("show") ? (havesession = 1) : (havesession = '');
    $("#filterData>dd:nth-child(6)>#filterDataOk").hasClass("show") ? (haveException = 1) : (haveException = '');
    $.ajax({
        type: "post",
        url: "/Home/SelectList",
        data: {
            shcoolstatus: shcoolstatu,
            concurrency: concurrency, nodesktop: nodesktop, shutdown: shutdown, norigster: norigster, havesession: havesession, haveException: haveException,
            keyword: $("#keyword").val(), province: $("#s_province").val(),
            orderOnlineState: $(".table th:eq(0)").data("order"),
            orderName: $(".table th:eq(1)").data("order"),
            orderConcurrencyNum: $(".table th:eq(2)").data("order"),
            orderDesktopNum: $(".table th:eq(3)").data("order"),
            orderCloseNum: $(".table th:eq(4)").data("order"),
            orderOpenNum: $(".table th:eq(5)").data("order"),
            orderRegisterNum: $(".table th:eq(6)").data("order"),
            orderNotRegisterNum: $(".table th:eq(7)").data("order"),
            orderSessionNum: $(".table th:eq(8)").data("order"),
            orderIsException: $(".table th:eq(9)").data("order"),
            orderLastActivityTime: $(".table th:eq(10)").data("order"),
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
                var OnlineState = '', UnitName = '', ConcurrencyNum = '', DesktopNum = '', DesktopNum = '', CloseNum = '', OpenNum = '',
                    RegisterNum = '', NotRegisterNum = '', SessionNum = '', IsException = '', LastActivityTime = '';
                var obj = $.tj.LoadAuthorizedByField("MonitorCenterList");
                if (obj.Code == 200) {
                    obj.Result.forEach(function (val) {
                        if (val.indexOf("OnlineState") == "0") { $("#Monitor_table thead tr>th:nth-child(1)").hide(); OnlineState = "hide"; }
                        if (val.indexOf("UnitName") == "0") { $("#Monitor_table thead tr>th:nth-child(2)").hide(); UnitName = "hide"; }
                        if (val.indexOf("ConcurrencyNum") == "0") { $("#Monitor_table thead tr>th:nth-child(3)").hide(); ConcurrencyNum = "hide"; }
                        if (val.indexOf("DesktopNum") == "0") { $("#Monitor_table thead tr>th:nth-child(4)").hide(); DesktopNum = "hide"; }
                        if (val.indexOf("CloseNum") == "0") { $("#Monitor_table thead tr>th:nth-child(5)").hide(); CloseNum = "hide"; }
                        if (val.indexOf("OpenNum") == "0") { $("#Monitor_table thead tr>th:nth-child(6)").hide(); OpenNum = "hide"; }
                        if (val.indexOf("RegisterNum") == "0") { $("#Monitor_table thead tr>th:nth-child(7)").hide(); RegisterNum = "hide"; }
                        if (val.indexOf("NotRegisterNum") == "0") { $("#Monitor_table thead tr>th:nth-child(8)").hide(); NotRegisterNum = "hide"; }
                        if (val.indexOf("SessionNum") == "0") { $("#Monitor_table thead tr>th:nth-child(9)").hide(); SessionNum = "hide"; }
                        if (val.indexOf("IsException") == "0") { $("#Monitor_table thead tr>th:nth-child(10)").hide(); IsException = "hide"; }
                        if (val.indexOf("LastActivityTime") == "0") { $("#Monitor_table thead tr>th:nth-child(11)").hide(); LastActivityTime = "hide"; }
                    })       
                }
                for (var i = 0; i < data.data.length; i++) {
                    html.push('<tr style="display:table;">');
                    html.push('<td class="' + OnlineState + '" style="width: 4%;">' + onlineImg(data.data[i].OnlineState) + '</td>');
                    html.push('<td class="td-long ' + UnitName + '" style="width: 16%;max-width: 300px;">' + (data.data[i].UnitName || "无") + '</td>');
                    html.push('<td class="' + ConcurrencyNum + '" style="width: 8%;">' + data.data[i].ConcurrencyNum + '</td>');
                    html.push('<td class="' + DesktopNum + '" style="width: 8%;">' + data.data[i].DesktopNum + '</td>');
                    html.push('<td class="' + CloseNum + '" style="width: 8%;">' + data.data[i].CloseNum + '</td>');
                    html.push('<td class="' + OpenNum + '" style="width: 8%;">' + data.data[i].OpenNum + '</td>');
                    html.push('<td class="' + RegisterNum + '" style="width: 8%;">' + data.data[i].RegisterNum + '</td>');
                    html.push('<td class="' + NotRegisterNum + '" + ' + (data.data[i].NotRegisterNum > 0 ? "class=\"text-danger\"" : "") + ' style="width: 8%;">' + data.data[i].NotRegisterNum + '</td>');
                    html.push('<td class="' + SessionNum + '" style="width: 8%;">' + data.data[i].SessionNum + '</td>');
                    html.push('<td class="' + IsException + '" ' + (data.data[i].IsException === 1 ? "class=\"text-danger\"" : "") + ' style="width: 8%;">' + (data.data[i].IsException === 1 ? "<span style='color: red;'>是</span>" : "否") + '</td>');
                    html.push('<td class="' + LastActivityTime + '" style="width: 12%;">' + (data.data[i].LastActivityTime || "无") + '</td>');
                    html.push('<td style="width: 4%;"><a id="GroupListDetail" value="/Home/GroupList/?userId=' + data.data[i].AccessUserID + '">查看</a></td>');
                    html.push('</tr>');
                }
                $("#Monitor_table .table").css("border", "1px solid #e7ecf1");
                $("#Monitor_table .table tbody").css("overflow-y", "scroll");
            } else {
                if (data.url) {
                    artAlert(data.info, data.url);
                    return;
                }
                html.push('<tr style="background-color: #fff;"><td style="border: none;" colspan="12" class="text-center NoData"><img style="width: 11%;margin-top: 6%;" src="/Src/static/img/bg/Nodate.png" alt="Nodate"></td></tr>');
                $("#Monitor_table .table").css({ "border-left": "none", "border-bottom": "none", "border-right": "none" });
                $("#Monitor_table .table tbody").css("overflow-y", "hidden");
            }
            $(".table tbody").html(html.join(""));
            //$(".NoData").width($("#Monitor_table .table tbody").width() - 10)
            $("#Monitor_table .table tbody").css("max-height", $(window).height() - 230)
            updateTime();            
        },
        complete: function () {
            parent.$(".AllLoading").hide();
        }
    });
    
}

function pageDateselectCallback(pageIndex, jq) {
    shcoolstatu = '';
    $("#filterData>dd:nth-child(1)>#filterDataOk").hasClass("show") ? (concurrency = 1) : (concurrency = '');
    $("#filterData>dd:nth-child(2)>#filterDataOk").hasClass("show") ? (nodesktop = 1) : (nodesktop = '');
    $("#filterData>dd:nth-child(3)>#filterDataOk").hasClass("show") ? (shutdown = 1) : (shutdown = '');
    $("#filterData>dd:nth-child(4)>#filterDataOk").hasClass("show") ? (norigster = 1) : (norigster = '');
    $("#filterData>dd:nth-child(5)>#filterDataOk").hasClass("show") ? (havesession = 1) : (havesession = '');
    $("#filterData>dd:nth-child(6)>#filterDataOk").hasClass("show") ? (haveException = 1) : (haveException = '');
    if ($("#filterData>dd:nth-child(7)>#filterDataOk").hasClass("show")) {
        shcoolstatu = shcoolstatu + '1,';
    }
    if ($("#filterData>dd:nth-child(8)>#filterDataOk").hasClass("show")) {
        shcoolstatu = shcoolstatu + '2,';
    }
    if ($("#filterData>dd:nth-child(9)>#filterDataOk").hasClass("show")) {
        shcoolstatu = shcoolstatu + '3,';
    }
    if ($("#filterData>dd:nth-child(7)>#filterDataOk").hasClass("show") && $("#filterData>dd:nth-child(8)>#filterDataOk").hasClass("show") && $("#filterData>dd:nth-child(9)>#filterDataOk").hasClass("show")) {
        shcoolstatu = '';
    } else if (!$("#filterData>dd:nth-child(7)>#filterDataOk").hasClass("show") && !$("#filterData>dd:nth-child(8)>#filterDataOk").hasClass("show") && !$("#filterData>dd:nth-child(9)>#filterDataOk").hasClass("show")) {
        shcoolstatu = '';
    }
    shcoolstatu = shcoolstatu.substring(0, shcoolstatu.lastIndexOf(","));
    $("#filterData>dd:nth-child(1)>#filterDataOk").hasClass("show") ? (concurrency = 1) : (concurrency = '');
    $("#filterData>dd:nth-child(2)>#filterDataOk").hasClass("show") ? (nodesktop = 1) : (nodesktop = '');
    $("#filterData>dd:nth-child(3)>#filterDataOk").hasClass("show") ? (shutdown = 1) : (shutdown = '');
    $("#filterData>dd:nth-child(4)>#filterDataOk").hasClass("show") ? (norigster = 1) : (norigster = '');
    $("#filterData>dd:nth-child(5)>#filterDataOk").hasClass("show") ? (havesession = 1) : (havesession = '');
    $("#filterData>dd:nth-child(6)>#filterDataOk").hasClass("show") ? (haveException = 1) : (haveException = '');
    $.ajax({
        type: "post",
        url: "/Home/SelectList",
        data: {
            shcoolstatus: shcoolstatu,
            concurrency: concurrency, nodesktop: nodesktop, shutdown: shutdown, norigster: norigster, havesession: havesession, haveException: haveException,
            keyword: $("#keyword").val(), province: $("#s_province").val(),
            orderOnlineState: $(".table th:eq(0)").data("order"),
            orderName: $(".table th:eq(1)").data("order"),
            orderConcurrencyNum: $(".table th:eq(2)").data("order"),
            orderDesktopNum: $(".table th:eq(3)").data("order"),
            orderCloseNum: $(".table th:eq(4)").data("order"),
            orderOpenNum: $(".table th:eq(5)").data("order"),
            orderRegisterNum: $(".table th:eq(6)").data("order"),
            orderNotRegisterNum: $(".table th:eq(7)").data("order"),
            orderSessionNum: $(".table th:eq(8)").data("order"),
            orderIsException: $(".table th:eq(9)").data("order"),
            orderLastActivityTime: $(".table th:eq(10)").data("order"),
            pageIndex: pageIndex + 1, pageSize: pageSize
        },
        dataType: "json",
        success: function (data) {
            $(".btn-refresh").prop("disabled", false);
            var html = [];
            if (data.status === "y") {
                var OnlineState = '', UnitName = '', ConcurrencyNum = '', DesktopNum = '', DesktopNum = '', CloseNum = '', OpenNum = '',
                    RegisterNum = '', NotRegisterNum = '', SessionNum = '', IsException = '', LastActivityTime = '';
                var obj = $.tj.LoadAuthorizedByField("MonitorCenterList");
                if (obj.Code == 200) {
                    obj.Result.forEach(function (val) {
                        if (val.indexOf("OnlineState") == "0") { $("#Monitor_table thead tr>th:nth-child(1)").hide(); OnlineState = "hide"; }
                        if (val.indexOf("UnitName") == "0") { $("#Monitor_table thead tr>th:nth-child(2)").hide(); UnitName = "hide"; }
                        if (val.indexOf("ConcurrencyNum") == "0") { $("#Monitor_table thead tr>th:nth-child(3)").hide(); ConcurrencyNum = "hide"; }
                        if (val.indexOf("DesktopNum") == "0") { $("#Monitor_table thead tr>th:nth-child(4)").hide(); DesktopNum = "hide"; }
                        if (val.indexOf("CloseNum") == "0") { $("#Monitor_table thead tr>th:nth-child(5)").hide(); CloseNum = "hide"; }
                        if (val.indexOf("OpenNum") == "0") { $("#Monitor_table thead tr>th:nth-child(6)").hide(); OpenNum = "hide"; }
                        if (val.indexOf("RegisterNum") == "0") { $("#Monitor_table thead tr>th:nth-child(7)").hide(); RegisterNum = "hide"; }
                        if (val.indexOf("NotRegisterNum") == "0") { $("#Monitor_table thead tr>th:nth-child(8)").hide(); NotRegisterNum = "hide"; }
                        if (val.indexOf("SessionNum") == "0") { $("#Monitor_table thead tr>th:nth-child(9)").hide(); SessionNum = "hide"; }
                        if (val.indexOf("IsException") == "0") { $("#Monitor_table thead tr>th:nth-child(10)").hide(); IsException = "hide"; }
                        if (val.indexOf("LastActivityTime") == "0") { $("#Monitor_table thead tr>th:nth-child(11)").hide(); LastActivityTime = "hide"; }
                    })
                }
                for (var i = 0; i < data.data.length; i++) {
                    html.push('<tr style="display:table;">');
                    html.push('<td class="' + OnlineState + '" style="width: 4%;">' + onlineImg(data.data[i].OnlineState) + '</td>');
                    html.push('<td class="td-long ' + UnitName + '" style="width: 16%;max-width: 300px;">' + (data.data[i].UnitName || "无") + '</td>');
                    html.push('<td class="' + ConcurrencyNum + '" style="width: 8%;">' + data.data[i].ConcurrencyNum + '</td>');
                    html.push('<td class="' + DesktopNum + '" style="width: 8%;">' + data.data[i].DesktopNum + '</td>');
                    html.push('<td class="' + CloseNum + '" style="width: 8%;">' + data.data[i].CloseNum + '</td>');
                    html.push('<td class="' + OpenNum + '" style="width: 8%;">' + data.data[i].OpenNum + '</td>');
                    html.push('<td class="' + RegisterNum + '" style="width: 8%;">' + data.data[i].RegisterNum + '</td>');
                    html.push('<td class="' + NotRegisterNum + '" + ' + (data.data[i].NotRegisterNum > 0 ? "class=\"text-danger\"" : "") + ' style="width: 8%;">' + data.data[i].NotRegisterNum + '</td>');
                    html.push('<td class="' + SessionNum + '" style="width: 8%;">' + data.data[i].SessionNum + '</td>');
                    html.push('<td class="' + IsException + '" ' + (data.data[i].IsException === 1 ? "class=\"text-danger\"" : "") + ' style="width: 8%;">' + (data.data[i].IsException === 1 ? "<span style='color: red;'>是</span>" : "否") + '</td>');
                    html.push('<td class="' + LastActivityTime + '" style="width: 12%;">' + (data.data[i].LastActivityTime || "无") + '</td>');
                    html.push('<td style="width: 4%;"><a id="GroupListDetail" value="/Home/GroupList/?userId=' + data.data[i].AccessUserID + '">查看</a></td>');
                    html.push('</tr>');
                }
                $("#Monitor_table .table").css("border", "1px solid #e7ecf1");

            } else {
                if (data.url) {
                    artAlert(data.info, data.url);
                    return;
                }
                html.push('<tr style="background-color: #fff;"><td style="border: none;" colspan="12" class="text-center NoData"><img style="width: 11%;margin-top: 6%;" src="/Src/static/img/bg/Nodate.png" alt="Nodate"></td></tr>');
                $("#Monitor_table .table").css({ "border-left": "none", "border-bottom": "none" });
            }
            $(".table tbody").html(html.join(""));
            $("#Monitor_table .table tbody").css("max-height", $(window).height() - 230)
            updateTime();
        }
    });

}

function onlineImg(state) {
    if (state == 3) {
        return '<img src="/Content/Images/online_' + state + '.png?v=1.02" style="width: 16px;height: 16px;" />';
    } else {
        return '<img src="/Content/Images/online_' + state + '.png?v=1.02" />';
    }    
}

function orderHandle(currentObj) {
    var $currentObj = $(currentObj);    
    var order = $currentObj.data("order");
    $currentObj.parent().find("th").data("order", "");
    $currentObj.parent().find(".glyphicon").remove();
    if (order === "desc") {        
        order = "asc";
        $currentObj.append('<span class="glyphicon glyphicon-arrow-up" style="font-size:12px;"></span>');
    } else {
        order = "desc";
        $currentObj.append('<span class="glyphicon glyphicon-arrow-down" style="font-size:12px;"></span>');
    }
    $currentObj.data("order", order);
    showList(1);
}

