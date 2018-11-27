$(function () {
    showList();
});

var pageCount = 0;
var pageSize = 10;

function selectRecordCount() {
    $.ajax({
        type: "post",
        url: "/Group/SelectCount",
        async: false,
        data: { keyword: $("#txtName").val(), groupId: $("#hdGroupId").val(), regState: $("#hdRegState").val() },
        dataType: "json",
        success: function (data) {
            if (data.status === "y") {
                pageCount = data.data;
            }
        }
    });
}

var currentNum = 1;
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

function pageselectCallback(pageIndex, jq) {
    $.ajax({
        type: "post",
        url: "/Group/SelectList",
        data: {
            keyword: $("#txtName").val(), groupId: $("#hdGroupId").val(), regState: $("#hdRegState").val(),
            orderName: $(".tb-machines th:eq(0)").data("order"),
            orderMode: $(".tb-machines th:eq(5)").data("order"),
            orderPowerState: $(".tb-machines th:eq(6)").data("order"),
            orderReg: $(".tb-machines th:eq(7)").data("order"),
            pageIndex: pageIndex + 1, pageSize: pageSize
        },
        dataType: "json",
        success: function (data) {
            var html = [];
            if (data.status === "y") {
                for (var i = 0; i < data.data.length; i++) {
                    html.push('<tr>');
                    html.push('<td>' + (data.data[i].HostedMachineName || "无") + '</td>');
                    html.push('<td class="td-long">' + data.data[i]._CatalogName + '</td>');
                    html.push('<td class="td-long">' + data.data[i].Name + '</td>');
                    html.push('<td>' + (data.data[i]._SessionUserName || "无") + '</td>');
                    html.push('<td class="td-long">' + (data.data[i]._LastConnectionUser.length === 0 ? "无" : data.data[i]._LastConnectionUser + '(' + data.data[i].LastConnectionTime + ')') + '</td>');
                    html.push('<td>' + (data.data[i].InMaintenanceMode ? "打开" : "关闭") + '</td>');
                    html.push('<td>' + (data.data[i].InMaintenanceMode === 4 ? "打开" : "关闭") + '</td>');
                    html.push('<td>' + (data.data[i].RegistrationState === 2 ? "已注册" : "<span class='text-danger'>未注册</span>") + '</td>');
                    html.push('</tr>');
                }
            } else {
                if (data.url) {
                    artAlert(data.info, data.url);
                    return;
                }
                html.push('<tr><td colspan="8" class="text-center">没有记录</td></tr>');
            }
            $(".tb-machines tbody").html(html.join(""));
        }
    });
}

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