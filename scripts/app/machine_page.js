$(function () {
    showList();
});

function showList() {
    $.ajax({
        type: "post",
        url: "/Group/SelectList",
        data: {
            keyword: $("#txtName").val(), groupId: $("#hdGroupId").val(), regState: $("#hdRegState").val(),
            userId: $("#hdUserId").val(),
            orderName: $(".tb-machines th:eq(0)").data("order"),
            orderUserName: $(".tb-machines th:eq(2)").data("order"),
            orderConnectionUser: $(".tb-machines th:eq(3)").data("order"),
            orderMode: $(".tb-machines th:eq(4)").data("order"),
            orderPowerState: $(".tb-machines th:eq(5)").data("order"),
            orderReg: $(".tb-machines th:eq(6)").data("order")
        },
        dataType: "json",
        success: function (data) {
            var html = [];
            if (data.status === "y") {
                $(".modal-title").html(data.data[0].Name + " - 计算机列表");
                for (var i = 0; i < data.data.length; i++) {
                    html.push('<tr>');
                    html.push('<td class="td-long">' + (data.data[i].HostedMachineName || "无") + '</td>');
                    html.push('<td class="td-long">' + data.data[i]._CatalogName + '</td>');
                    html.push('<td class="td-long">' + (data.data[i]._SessionUserName || "无") + '</td>');
                    html.push('<td class="td-long">' + (data.data[i]._LastConnectionUser.length === 0 ? "无" : data.data[i]._LastConnectionUser + '(' + data.data[i].LastConnectionTime + ')') + '</td>');
                    html.push('<td>' + (data.data[i].InMaintenanceMode ? '<span class="text-danger">打开</span>' : '关闭') + '</td>');
                    html.push('<td>' + (data.data[i].PowerState === 4 ? "打开" : "<span class='text-danger'>关闭<span>") + '</td>');
                    html.push('<td>' + (data.data[i].RegistrationState === 2 ? "已注册" : "<span class='text-danger'>未注册</span>") + '</td>');
                    html.push('</tr>');
                }
            } else {
                if (data.url) {
                    artAlert(data.info, data.url);
                    return;
                }
                html.push('<tr style="background: #fff;"><td colspan="7" class="text-center NoData"><img style="width: 16%;margin-top: 6%;" src="/Src/static/img/bg/Nodate.png" alt="Nodate"></td></tr>');
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