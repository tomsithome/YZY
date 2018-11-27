$(function () {
    Interval();
    rsizeM();
    $(window).resize(function () {
        rsizeM();
    })

    //schoolList($.tj.getUrlParam("province"), true);
    GetfirstDataByProvince($.tj.getUrlParam("province"));

    var timer, limitCount = 10;
    function Interval() {
        clearInterval(timer);
        timer = setInterval(function () {
            //每分钟时事加载更新数据
        }, 3000)
    };

    function syrvey() {
        unusually($(".table>tbody>tr>td:nth-child(5)"), "打开");
        unusually($(".table>tbody>tr>td:nth-child(6)"), "关闭");
        unusually($(".table>tbody>tr>td:nth-child(7)"), "未注册");
    }
    function unusually(nature, keywords) {
        for (var i = 0; i < nature.length; i++) {
            if (nature[i].innerHTML == keywords) {
                nature[i].style.color = "red";
            }
        }
    }
    function rsizeM() {
        var dw = $("#pageTo").width() / 2;
        dw = -dw;
        $("#pageTo").css({
            "margin-left": dw
        })
        $(".row").height($(document).height() - 170)
        $(".monitorAll_lb").height($(document).height() - 260)
    }
    $(document).on("click", ".monitorAll_lb>h3", function () {
        $(".monitorAll_lb>h3").removeAttr("style");
        $(".monitorAll_lb>h3>i").removeAttr("style");
        $(this).css({
            "background": "#5A4A9C",
            "color": "#C2E7A5"
        })
        $(".monitorAll_lb>h3").removeClass("monitoring");
        $(this).addClass("monitoring");
        DropDownScreen($(".monitoring").attr('val'));
        $(".allScreen>select>option:selected").val('');
        $("#searchScreen>input[type=search]").val('')
        showList();
        $("#unuallyState").hide();
        //window.location.href = "/home/Computerlist?vals=" + $(this).attr("val") + '&&province=' + $.tj.getUrlParam("province");
    })
    $(document).on("click", "#searchScreen>input[type=button]", function () {
        showList();
    })
    $(document).on("change", ".allScreen>select", function () {
        //DropDownScreen($(".monitoring").attr('val'));
        if ($(".allScreen>select>option:selected").val() == "全部") {
            $("#unuallyState").hide();
        } else {
            $("#unuallyState").show();
            ComputerListPower();
        }
        showList();       
    })
    $(document).on("click", ".monitorAll_lh input[type=checkbox]", function () {
        var flag;
        if ($(".monitorAll_lh input[type=checkbox]").is(":checked")) {
            flag = true;            
        } else {
            flag = false;
        }
        schoolList($.tj.getUrlParam("province"), flag);
    })
    $(document).on("click", ".icon-back", function () {
        window.history.back();
    })

    function DropDownScreen(id) {
        $.ajax({
            type: "post",
            url: "/Home/GetDropDownBySchool",
            data: {
                userId: id
            },
            dataType: "json",
            success: function (data) {
                var str,strs = [];
                if (data.status == "n") {
                    $(".allScreen").html("<span>交互场景</span><select><option>" + data.info + "</option></select>")
                    $("#unuallyState").hide();
                } else if (data.status == "y") {                    
                    data.data.forEach(function (vals) {
                        str = "<option value='" + vals.Uid + "'>" + vals.Name.substring(0, 10) + "</option>";
                        strs += str;
                    })
                    $(".allScreen").html("<span>交互场景</span><select><option>全部</option>" + strs + "</select>");
                }
            }
        })
     }

    limitCount = Math.floor(($(document).height() - 410) / 38);
    function showList() {
        $.ajax({
            type: "post",
            url: "/Home/GetComputerListData",
            data: {
                keyword: $("#searchScreen>input[type=search]").val(),
                groupId: groupIds($(".allScreen>select>option:selected").val()),
                regState: "",
                userId: $(".monitoring").attr("val")|| null,
                orderName: "",
                orderUserName: "",
                orderConnectionUser: "",
                orderMode: "",
                orderPowerState: "",
                orderReg: "",
                pageIndex: "1",
                pageSize: "1000000"
            },
            dataType: "json",
            success: function (data) {
                //console.log(data)
                var dataList = [], dataL;
                if (data.status == "n") {
                    $("#alldata").html('<tr><td style="border: none;" colspan="7" class="text-center NoData"><img style="width: 20%;margin-top: 6%;" src="/Src/static/img/bg/Nodata_w.png" alt="Nodate"></td></tr>');
                    $("#pageTo").hide();
                } else if (data.status == "y") {
                    $("#pageTo").show();
                    data.data.forEach(function (vals) {
                        dataL = [vals.HostedMachineName, vals._CatalogName, (vals._SessionUserName?vals._SessionUserName: "无"), vals._LastConnectionUser ? (vals._LastConnectionUser + "(" + vals.LastConnectionTime + ")") : "—", (vals.InMaintenanceMode ? '<span class="text-danger">打开</span>' : '关闭'), (vals.PowerState === 4 ? "打开" : "关闭"), (vals.RegistrationState === 2 ? "已注册" : "<span class='text-danger'>未注册</span>")]
                        dataList.push(dataL);
                    })
                    layui.use(['laypage', 'layer'], function () {
                        var laypage = layui.laypage
                        , layer = layui.layer;

                        $(".monitorAll_r").hover(function () {//只要鼠标在在右边的那个div上就暂时不更新数据了
                            clearInterval(timer);
                        }, function () {
                            Interval();
                        });

                        var datas = dataList;
                        //调用分页
                        laypage.render({
                            elem: 'pageTo'
                          , count: datas.length
                           , limit: limitCount
                           , curr: 1
                           , prev: "▲"
                           , next: "▲"
                          , jump: function (obj, first) {
                              if (!first) {
                                  // load_page(obj.curr);
                              }
                              var arr = [],
                              thisData = datas.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);
                              for (var b in thisData) {
                                  arr.push('<tr><td>' + thisData[b][0] + '</td><td>' + thisData[b][1] + '</td><td>' + thisData[b][2] + '</td><td>' + thisData[b][3] + '</td><td>' + thisData[b][4] + '</td><td>' + thisData[b][5] + '</td><td>' + thisData[b][6] + '</td><tr>');
                              }
                              $("#alldata").html(arr);
                              syrvey();
                              rsizeM();
                          }
                        });

                    });
                }                
            }
        });
    }

    function GetfirstDataByProvince(id) {//有异常的学校就默认钩上反之就不钩上
        $.ajax({
            type: "post",
            url: "/Home/GetAllDataByProvince",
            data: {
                province: id
            },
            dataType: "json",
            success: function (data) {
                var f = false;
                data.forEach(function (vals) {
                    if (vals.IsException == 1) {
                        f = true;
                    }
                })
                schoolList($.tj.getUrlParam("province"), f);
            }
        })
    }
    function schoolList(id, flag) {
        var ic;
        if (id == "湖南省") {
            ic = "icon-hunan"
        } else if (id == "湖北省") {
            ic = "icon-hubei";
        } else if (id == "安徽省") {
            ic = "icon-anhui";
        } else {
            ic = "icon-china";
        }
        $.ajax({
            type: "post",
            url: "/Home/GetAllDataByProvince",
            data: {
                province: id
            },
            dataType: "json",
            success: function (data) {
                //console.log(data, flag);
                var str, strs = "";
                if (data == "") {//当没有数据过来的时候，没有学校
                    $(".monitorAll_lb").html(strs);
                } else {
                    data.forEach(function (vals) {
                        var cl = "";
                        if (vals.value == $.tj.getUrlParam("vals")) {
                            cl = "monitoring";
                        } else {
                            cl = "";
                        }
                        if (vals.IsException == 1 && flag == true) {//如果有异常，默认画勾checked
                            str = "<h3 val=" + vals.value + " class=" + cl + "><i class='layui-icon " + ic + "'></i><span>" + vals.name + "</span></h3>";
                        } else if (vals.IsException == 0 && flag == true) {
                            str = "";                           
                        } else if(flag == false){
                            str = "<h3 val=" + vals.value + " class=" + cl + "><i class='layui-icon " + ic + "'></i><span>" + vals.name + "</span></h3>";
                        }
                        strs += str;
                    })
                    $(".monitorAll_lh input").prop("checked", flag);
                    $(".monitorAll_lb").html(strs);
                    //$(".monitorAll_lb>h3:first-child").click();
                    $(".monitoring").click();
                }

            }
        })
    }

    function ComputerListPower() {
        $.ajax({
            type: "post",
            url: "/Home/GetComputerListPowerData",
            data: {
                keyword: $("#searchScreen>input[type=search]").val(),
                groupId: $(".allScreen>select>option:selected").val(),
                regState: "",
                userId: $(".monitoring").attr("val") || null,
                orderName: "",
                orderUserName: "",
                orderConnectionUser: "",
                orderMode: "",
                orderPowerState: "",
                orderReg: "",
            },
            dataType: "json",
            success: function (data) {
                //console.log($("#searchScreen>input[type=search]").val(), $(".allScreen>select>option:selected").val(), $(".monitoring").attr("val") || null, data)
                $("#unuallyState").html("<span>"+data.text+"</span> " + " 维护中:" + data.MainTainNumber + " 电源关闭:" + data.powerDownNumber + " 未注册:" + data.notRetisterNumber + "");
            }
        })
     }

    function groupIds(data) {
        if (data == "所有") {
            return ''
        } else {
            return data;
        }
    }
})