var dataList = [], timer, lastSessionN = 0;
var cacheds = [];
for (var i = 0 ; i < 60; i++) {
    cacheds.push('cacheds' + i);
}
$(function () {
    rsizeM();
    monitorDatatable(' ');
    //schoolList($.tj.getUrlParam("id"), true);
    GetfirstDataByProvince($.tj.getUrlParam("id"));
    $(window).resize(function () {
        rsizeM();
    })
    //coundDisk();    
    coundDiskCharts(0, 1);
    DiskRoomCharts(0, 1);

    var allRefreshTime = $.tj.GetTimeSet("allRefreshTime"),
        sessionScrollTime = $.tj.GetTimeSet("sessionScrollTime"),
        sesScrIntervalTime = $.tj.GetTimeSet("sessionScrollTime") * 60000;

    Intervalm();
    timeout(sesScrIntervalTime);
    Interval(allRefreshTime);

    $(document).on("click", ".monitorAll_lh input[type=checkbox]", function () {
        var flag;
        if ($(".monitorAll_lh input[type=checkbox]").is(":checked")) {
            flag = true;
        } else {
            flag = false;
        }
        schoolList($.tj.getUrlParam("id"), flag);

    })

    function monitorDatatable(tableDatas) {
        layui.use('table', function () {
            var table = layui.table;

            table.render({
                elem: '#monitorData'
                 , cols: [[ //标题栏
                   { field: 'username', title: '交付组', minWidth: 65 }
                   , { field: 'count', title: '桌面总数', width: 60 }
                   , { field: 'yes', title: '已就绪', width: 50 }
                   , { field: 'no', title: '未就绪', width: 50 }
                   , { field: 'maintained', title: '维护中', width: 65 }
                   , { field: 'talk', title: '会话数', width: 50 }
                   , { field: 'experience', title: '健康状况', minWidth: 60 }
                 ]]
                 , data: tableDatas
                 , skin: 'line' //表格风格
                 , even: true
            });
        });
    }
    function Intervalm() {
        var j = 1, miners;
        clearInterval(miners)
        sesScrIntervalTime = $.tj.GetTimeSet("sessionScrollTime") * 60000
        miners = setInterval(function () {
            if (j == 60) {
                j = 0;
            }
            SessionNum($(".monitoring").attr('val'), cacheds[j]);
            j++;
        }, sesScrIntervalTime);//每分钟更/存一条
    };
    function Interval(time) {
        clearInterval(timer);
        timer = setInterval(function () {
            if ($(".monitoring").attr('val')) {
                var valId = $(".monitoring").attr('val')
                //console.log(valId);
                coundDisk(valId);//每秒钟时事加载异常数据
            }
        }, time)
    }
    function timeout(time) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            SessionNum($(".monitoring").attr('val'), cacheds[0]);
        }, time);
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
                schoolList($.tj.getUrlParam("id"), f);
            }
        })
    }
    function schoolList(id, flag) {//对学校进行展示
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
                if (data == "") {
                    $(".monitorAll_lb").html(strs);
                    if ($(".monitorAll_lb>h3").length == 0) {
                        allComputer(0);
                        SessionNum(0, cacheds[0])
                        $("#cloudsDiskNum>h4:first-child").html("0");
                        $("#cloudsDiskNum>h4:last-child").html("0");
                    }
                } else {
                    data.forEach(function (vals) {
                        if (vals.IsException == 1 && flag == true) {//如果有异常，默认画勾checked
                            str = "<h3 val=" + vals.value + "><i class='layui-icon " + ic + "'></i><span>" + vals.name + "</span></h3>";
                        } else if (vals.IsException == 0 && flag == true) {
                            str = "";
                        } else if (flag == false) {
                            str = "<h3 val=" + vals.value + "><i class='layui-icon " + ic + "'></i><span>" + vals.name + "</span></h3>";
                        }
                        strs += str;
                    })
                    if (strs == "") {
                        allComputer(0);
                        SessionNum(0, cacheds[0])
                        $("#cloudsDiskNum>h4:first-child").html("0");
                        $("#cloudsDiskNum>h4:last-child").html("0");
                    }
                    $(".monitorAll_lh input").prop("checked", flag);
                    $(".monitorAll_lb").html(strs);                    
                    setTimeout(function () {                        
                        $(".monitorAll_lb>h3:first-child").click();
                    }, 1000)
                }
            }
        })
    }
    function coundDisk(val) {
        var allval = val;
        $.ajax({
            type: "post",
            url: "/Home/GetdesktopGroupStatics",
            data: {
                AccessUserID: allval
            },
            dataType: "json",
            success: function (data) {
                //console.log($("#cloudsDiskNum>h4:first-child").html(), data.NotRegisterNum, data)
                if ($("#cloudsDiskNum>h4:first-child").html() != data.NotRegisterNum || $("#cloudsDiskNum>h4:last-child").html() != data.DesktopNum) {//只要数据不更新，就不用一直加载数据
                    coundDiskCharts(data.NotRegisterNum, data.DesktopNum - data.NotRegisterNum);
                    DiskRoom(allval);
                    allComputer(allval);
                    //SessionNum(val)
                }
                $("#cloudsDiskNum>h4:first-child").html(data.NotRegisterNum);
                $("#cloudsDiskNum>h4:last-child").html(data.DesktopNum);
            }
        });
    }
    function DiskRoom(val) {
        $.ajax({
            type: "post",
            url: "/Home/GetXenServerStatics",
            data: {
                AccessUserID: val
            },
            dataType: "json",
            success: function (data) {
                //console.log(val, data)
                DiskRoomCharts(data.ExceptionNumber, data.NormalNumber);
            },
            error: function () {
                DiskRoomCharts(0, 0);
            },
        });
    }
    function rsizeM() {
        var dw = $("#disk_r").width() / 2 - 40;
        $(".diskr_c").css({
            "right": dw
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
        //allComputer($(".monitoring").attr('val'));
        SessionNum($(".monitoring").attr('val'), cacheds[0]);
        dataList = [];
        return dataList;
    })
    $(document).on("click", ".mcc_detail>p:last-child", function () {
        var paraid = $.tj.getUrlParam("id"), SchoolVals = $(".monitoring").attr("val");        
        if (paraid == null) {
            location.href = "/home/Computerlist";
        } else {
            location.href = "/home/Computerlist?vals=" + SchoolVals + '&&province=' + paraid;
        }
    })
    function allComputer(val) {
        $.ajax({
            type: "post",
            url: "/Home/GetdesktopGroupList",
            data: {
                AccessUserID: val
            },
            dataType: "json",
            success: function (data) {
                var tableDatas = [];
                if (data != "") {
                    data.forEach(function (vals) {
                        tableDatas.push({
                            "username": vals.Name
                           , "count": vals.DesktopNum
                           , "yes": vals.RegisterNum
                           , "maintained": vals.Maintaining
                           , "no": vals.NotRegisterNum
                           , "talk": vals.SessionNum
                           , "experience": IsExceptionData(vals.IsException)
                        })
                        return tableDatas;
                    })
                } else {
                    //没有数据
                }
                monitorDatatable(tableDatas);
            }
        });
    }
    function coundDiskCharts(NotRegisterNum, DesktopNum) {
        option1 = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [
                {
                    name: '云桌面',
                    type: 'pie',
                    radius: ['45%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        { value: NotRegisterNum, name: '异常数' },
                        { value: DesktopNum, name: '正常数' }
                    ]
                }, {
                    radius: ['70%', '80%'],
                    type: 'pie',
                    tooltip: {
                        trigger: 'none'
                    },
                    avoidLabelOverlap: false,
                    data: [
                    { value: 1, name: '' }
                    ],
                    itemStyle: {
                        normal: { color: '#FFFFFF' },
                        emphasis: {
                            show: true,
                        }
                    },
                }, {
                    radius: ['80%', '100%'],
                    type: 'pie',
                    tooltip: {
                        trigger: 'none'
                    },
                    avoidLabelOverlap: false,
                    data: [
                    { value: 1, name: '' }
                    ],
                    itemStyle: {
                        normal: { color: '#3B90E9' },
                        emphasis: {
                            show: true,
                        }
                    },
                }, {
                    radius: ['0', '45%'],
                    type: 'pie',
                    tooltip: {
                        trigger: 'none'
                    },
                    avoidLabelOverlap: false,
                    data: [
                    { value: 1, name: '' }
                    ],
                    // label: {
                    //     normal: {
                    //         show: false,
                    //         position: 'center'
                    //     },
                    //     emphasis: {
                    //         show: false,
                    //     }
                    // },
                    // labelLine: {
                    //     normal: {
                    //         show: false
                    //     }
                    // },
                    itemStyle: {
                        normal: {
                            show: false,
                            position: 'center',
                            color: '#FFFFFF',
                            label: {
                                show: false,
                            },
                            labelLine: {

                            }
                        },
                        emphasis: {
                            show: false,
                        }
                    },
                }
            ],
            color: ['#FE976E', '#7DCDF3'],
            animation: false
        };
        var myChart1 = echarts.init(document.getElementById('clouds_disk'));
        myChart1.setOption(option1);
    }
    function DiskRoomCharts(ExceptionNumber, NormalNumber) {
        $(".diskr_c>h4").html($.tj.Percentage(ExceptionNumber, NormalNumber));
        option2 = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} ({d}%)"
            },
            series: [{
                name: '磁盘使用',
                type: 'pie',
                radius: ['55%', '70%'],
                avoidLabelOverlap: true,
                startAngle: 120,
                label: {
                    normal: {
                        show: true,
                        // position: 'center'
                    },
                    emphasis: {
                        show: true
                    }
                },
                labelLine: {
                    normal: {
                        show: true
                    }
                },
                data: [
                    { value: ExceptionNumber, name: '异常数' + ExceptionNumber },
                    { value: NormalNumber, name: '正常数' + NormalNumber }
                ]
            },
                 {
                     radius: ['0', '55%'],
                     type: 'pie',
                     avoidLabelOverlap: false,
                     tooltip: {
                         trigger: 'none'
                     },
                     data: [
                     { value: 1, name: '' }
                     ],
                     itemStyle: {
                         normal: {
                             // show: false,
                             // position: 'center',
                             color: '#5C7DBE',
                             label: {
                                 show: false,
                             },
                             labelLine: {
                                 show: false
                             }
                         },
                         emphasis: {
                             show: false,
                         }
                     },
                     animation: false
                 }],
            color: ['#FE976E', '#7DCDF3']
        }
        var myChart2 = echarts.init(document.getElementById('disk_r'));
        myChart2.setOption(option2);
    }
    function SessionNum(val, cache) {
        var allval = val;
        $.ajax({
            type: "post",
            url: "/Home/GetSessionNumCount",
            data: {
                AccessUserID: allval
            },
            dataType: "json",
            success: function (data) {                
                if (lastSessionN != data.SessionNumber) {
                    allComputer(allval);
                }
                if (dataList.length < 60) {//缓存60分钟内的数据
                    dataList.unshift(caches(cache, data.SessionNumber));
                } else {
                    dataList.pop();
                    dataList.unshift(caches(cache, data.SessionNumber));
                }
                //console.log(dataList)
                var currentTs = [];
                for (var i = 0 ; i < 60; i++) {
                    currentTs.push((currentTime(sessionScrollTime * i)))
                }
                currentTs = JSON.stringify(currentTs);
                currentTs = JSON.parse(currentTs);

                option3 = {
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        inverse: true,
                        data: currentTs,
                        axisLabel: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#36C0DC'
                            }
                        }
                    },
                    yAxis: {
                        boundaryGap: false,
                        axisLine: { onZero: false },
                        axisLabel: {
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        type: 'value'
                    },
                    series: [{
                        name: '异常',
                        data: dataList,
                        type: 'line',
                        areaStyle: {}
                    }],
                    color: ['#36C0DC']
                };
                var myChart3 = echarts.init(document.getElementById('dis_c'));
                myChart3.setOption(option3);
            }
        });
    }
    function currentTime(t) {
        var date = new Date();
        date.setMinutes(date.getMinutes() - t);
        var current = date.toLocaleString();
        current = current.substring(current.length - 8);
        var currentT = current.split(":");
        if (currentT[0].indexOf("午") == 0) {
            currentT[0] = currentT[0].substring(1);
        }
        return currentT[0] + ':' + currentT[1];
    }
    function caches(cache, count) {//缓存10分钟数据
        $.cookie(cache, count);
        var cookietime = new Date();
        cookietime.setTime(cookietime.getTime() + (60 * sesScrIntervalTime));
        $.cookie(cache, count, { expires: cookietime });
        $.cookie(cache, count, { path: "/newmain" });
        return $.cookie(cache);
    }
    function IsExceptionData(data) {
        if (data == "离线") {
            return "<span style='color: #e50012'>"+data+"</span>"
        } else if (data == "维护") {
            return "<span style='color: #ecda3b'>" + data + "</span>"
        } else if (data == "严重异常") {
            return "<span style='color: #e50012'>"+data+"</span>"
        } else if (data == "轻微异常") {
            return "<span style='color: #e50012'>"+data+"</span>"
        } else {
            return data;
        }
    }
})

