var pageIndex = 1;
var pageSize = 12, pageSizes = 12;
var pageCount = 0;
var shcoolstatu = "", concurrency = "", nodesktop = "", shutdown = "", norigster = "", havesession = "", haveException = "";

$(function () {
    selectRecordCount1();
    $(document).scroll(function () {
        if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
            if (!$(".pricing-content-1").next(".loading").is(":visible")) {
                //selectRecordCount1();
            }
        }
    });
    $(document).on("click", "#GroupListDetail1", function () {
        $(".Monitoe_home_search").hide();
        $(".Monitor_detail_search").show();
        $(this).parent().parent().parent().parent().parent().parent().after('<iframe src="' + $(this).attr("value") + '" frameborder="0" class="UnitList1"></iframe>');
        $(this).parent().parent().parent().parent().parent().parent().hide();        
        $(".UnitList1").load(function () {
            $(".UnitList1").height($(".UnitList1").contents().find(".GroupList").height() + 6);
            $(".UnitList1").css("min-height", $(window).height() - 120);
            $(".UnitList1").contents().find(".GroupList>.portlet").css("min-height", $(window).height() - 120)
        });
        $("#hdUserId").val($(this).attr("value").split("=")[1])
    })
    $("#filterData>dd").on("click", function () {
        showList1(1);
    })
    $("#States>span").on("click", function () {
        showList1(1);
    })
});

function selectRecordCount1() {
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
        data: {
            shcoolstatus: shcoolstatu,
            concurrency: concurrency, nodesktop: nodesktop, shutdown: shutdown, norigster: norigster, havesession: havesession, haveException: haveException,
            keyword: $("#keyword").val(), province: $("#s_province").val()
        },
        dataType: "json",
        success: function (data) {
            if (data.status === "y") {
                pageCount = data.data;                
                showList1();
            }
        }
    });
}

function showList1(resetPage) {
    pageSize < 18 ? pageSizes = 18 : pageSizes;
    if (resetPage === 1) {
        pageIndex = 1;
        $(".pricing-content-1 >.row").html("");
    };
    var pageTotal = parseInt(pageCount / pageSize);    
    if (pageCount % pageSizes > 0) pageTotal++;   
    if (pageTotal === 0) {
        $(".pricing-content-1 >.row").html('<div class="alert alert-info text-center h5"  style="background-color: #fff;border: none;"><img style="width: 11%;margin-top: 6%;" src="/Src/static/img/bg/NoCon.png" alt="NoCon"></div>');
        $("#HomeUnitList>div.portlet").css("height", $(window).height() - 80)
        return;
    }
    if (pageIndex > pageTotal) { return; }
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
        url: "/Home/SelectList",
        data: {
            shcoolstatus: shcoolstatu,
            concurrency: concurrency, nodesktop: nodesktop, shutdown: shutdown, norigster: norigster, havesession: havesession, haveException: haveException,
            keyword: $("#keyword").val(),
            province: $("#s_province").val(),
            pageIndex: pageIndex, pageSize: '1000000'
        },
        dataType: "json",
        beforeSend: function () {
            //$(".pricing-content-1").next(".loading").show();
            parent.$(".AllLoading").show();
        },
        success: function (data) {
            var html = [];
            if (data.status === "y") {
                var OnlineState = '', UnitName = '', ConcurrencyNum = '', DesktopNum = '', DesktopNum = '', CloseNum = '', OpenNum = '',
                    RegisterNum = '', NotRegisterNum = '', SessionNum = '', IsException = '', LastActivityTime = '';
                var obj = $.tj.LoadAuthorizedByField("MonitorCenterList");
                
                if (obj.Code == 200) {
                    obj.Result.forEach(function (val) {
                        
                        if (val.indexOf("OnlineState") == "0") { $("#Monitor_table thead tr>th:nth-child(1)").hide(); OnlineState = "disapper"; }
                        if (val.indexOf("UnitName") == "0") { $("#Monitor_table thead tr>th:nth-child(2)").hide(); UnitName = "disapper"; }
                        if (val.indexOf("ConcurrencyNum") == "0") { $("#Monitor_table thead tr>th:nth-child(3)").hide(); ConcurrencyNum = "disapper"; }
                        if (val.indexOf("DesktopNum") == "0") { $("#Monitor_table thead tr>th:nth-child(4)").hide(); DesktopNum = "disapper"; }
                        if (val.indexOf("CloseNum") == "0") { $("#Monitor_table thead tr>th:nth-child(5)").hide(); CloseNum = "disapper"; }
                        if (val.indexOf("OpenNum") == "0") { $("#Monitor_table thead tr>th:nth-child(6)").hide(); OpenNum = "disapper"; }
                        if (val.indexOf("RegisterNum") == "0") { $("#Monitor_table thead tr>th:nth-child(7)").hide(); RegisterNum = "disapper"; }
                        if (val.indexOf("NotRegisterNum") == "0") { $("#Monitor_table thead tr>th:nth-child(8)").hide(); NotRegisterNum = "disapper"; }
                        if (val.indexOf("SessionNum") == "0") { $("#Monitor_table thead tr>th:nth-child(9)").hide(); SessionNum = "disapper"; }
                        if (val.indexOf("IsException") == "0") { $("#Monitor_table thead tr>th:nth-child(10)").hide(); IsException = "disapper"; }
                        if (val.indexOf("LastActivityTime") == "0") { $("#Monitor_table thead tr>th:nth-child(11)").hide(); LastActivityTime = "disapper"; }
                    })
                }
                $(".pricing-content-1 > .alert").remove();
                for (var i = 0; i < data.data.length; i++) {
                    html.push('<div class="col-md-3 col-sm-4">');
                    html.push('<div class="price-column-container border-active" style="margin-top:5px;">');
                    html.push('<div class="price-table-head bg-blue">');
                    html.push('<h2 class="no-margin" id="' + UnitName + '">' + data.data[i].UnitName + '</h2>');
                    html.push('</div>');
                    html.push('<div class="arrow-down border-top-blue"></div>');
                    html.push('<div class="price-table-pricing">');
                    html.push('<h3 class="test-info"  id="' + RegisterNum + '"><span class="price-sign">已注册</span>' + data.data[i].RegisterNum + '</h3>');
                    html.push(data.data[i].IsException === 1 ? '<div class="price-ribbon" id="' + IsException + '">异常</div>' : '');
                    html.push('</div>');
                    html.push('<div class="price-table-content">');
                    html.push('<div class="row mobile-padding">');
                    html.push('<div class="col-xs-12 text-center mobile-padding"><span id="' + DesktopNum + '">' + data.data[i].DesktopNum + ' 桌面数 /</span> <span id="' + NotRegisterNum + '">' + (data.data[i].NotRegisterNum) + ' 未注册数 /</span> <span id="' + OpenNum + '">' + data.data[i].OpenNum + ' 开机数</span></div>');
                    html.push('</div>');
                    html.push('</div>');
                    html.push('<div class="arrow-down arrow-grey"></div>');
                    html.push('<div class="price-table-footer">');
                    html.push('<button id="GroupListDetail1" value="/Home/GroupList/?userId=' + data.data[i].AccessUserID + '" type="button" class="btn grey-salsa btn-outline sbold">查看</button>');
                    html.push('</div>');
                    html.push('</div>');
                    html.push('</div>');
                }
                $(".pricing-content-1 >.row").append(html.join(""));
                $("#UnitList").contents().find(".pricing-content-1 >.row").append(html.join(""));
                pageIndex++;
            } else {
                if (data.url) {
                    artAlert(data.info, data.url);
                    return;
                }
                $(".pricing-content-1 >.row").html("");
            }
            $("#HomeUnitList>div.portlet").css("height", $(window).height() - 80)
            $(".pricing-content-1").next(".loading").hide();
        },
        complete: function () {
            parent.$(".AllLoading").hide();
        },
    });
}