var dataList = [], timer, lastSessionN = 0;
var cacheds = [];
for (var i = 0 ; i < 60; i++) {
    cacheds.push('cacheds' + i);
}
$(function(){
    rsizeM();
    //coundDiskCharts(0, 1);
    //DiskRoomCharts(0, 1);    
    //console.log($.tj.getUrlParam("vals"));
    //改变以下不同学校的val值
    Intervalm($.tj.getUrlParam("vals"));
    Interval($.tj.getUrlParam("vals"));
    GetSchoolInfo($.tj.getUrlParam("vals"));
    allComputer($.tj.getUrlParam("vals"));
    SessionNum($.tj.getUrlParam("vals"), cacheds[0]);
    coundDisk($.tj.getUrlParam("vals"));
    //console.log($.tj.GetTimeSet("allRefreshTime"))
    
    var allRefreshTime = $.tj.GetTimeSet("allRefreshTime"),
        sessionScrollTime = $.tj.GetTimeSet("sessionScrollTime"),
        sesScrIntervalTime = $.tj.GetTimeSet("sessionScrollTime") * 60000;
    
	$(window).resize(function(){
		rsizeM();
	})
	function rsizeM(){
		var dw = $("#disk_r").width() / 2 - 40;
		$(".diskr_c").css({
		    "right": dw
		})
		$(".row").height($(document).height() - 170)
		
	}
	function Interval(val) {
	    allRefreshTime = $.tj.GetTimeSet("allRefreshTime")
	    clearInterval(timer);
	    timer = setInterval(function () {
	        coundDisk(val);
	    }, allRefreshTime)
	}
	function Intervalm(val) {
	    var j = 1, miners;
	    sesScrIntervalTime = $.tj.GetTimeSet("sessionScrollTime") * 60000
	    clearInterval(miners)
	    miners = setInterval(function () {
	        if (j == 60) {
	            j = 0;
	        }	        
	        SessionNum(val, cacheds[j]);
	        j++;
	    }, sesScrIntervalTime);//每分钟更/存一条
	};
	function coundDisk(val) {//云桌面异常比例数
	    var allval = val;
	    $.ajax({
	        type: "post",
	        url: "/Monitor/GetdesktopGroupStatics",
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
	        url: "/Monitor/GetXenServerStatics",
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
	        }
	    });
	}
	function allComputer(val) {
	    $.ajax({
	        type: "post",
	        url: "/Monitor/GetdesktopGroupList",
	        data: {
	            AccessUserID: val
	        },
	        dataType: "json",
	        success: function (data) {
                //console.log(data.length)
	            var tableDatas = [];
	            if (data != "") {
	                data.forEach(function (vals, index) {
	                    tableDatas.push({
	                        "sort": (index+1)
	                       , "username": vals.Name
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
	            //console.log(tableDatas);
	            layui.use('table', function () {
	                var table = layui.table;

	                table.render({
	                    elem: '#monitorData'
                         , cols: [[ //标题栏
                           { field: 'sort', title: '序号', width: 50 }
                           , { field: 'username', title: '交付组', minWidth: 75 }
                           , { field: 'count', title: '桌面总数', width: 65 } 
                           , { field: 'yes', title: '已就绪', width: 65 }
                           , { field: 'maintained', title: '维护中', width: 65 }
                           , { field: 'no', title: '未就绪', width: 65 }
                           , { field: 'talk', title: '会话数', width: 65 }
                           , { field: 'experience', title: '健康状况', minWidth: 65, align: 'center' }
                         ]]
                         , data: tableDatas
                         , skin: 'line' //表格风格
                         , even: true
	                    //,page: true //是否显示分页
	                    //,limits: [5, 7, 10]
	                    // ,limit: 5 //每页默认显示的数量
	                });
	                if (data.length > 6) {
	                    $(".mc_c .layui-table>tbody").scrollQ();
	                }
	            });
	            
	            
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
	    $(".diskr_c>h4").html($.tj.Percentage(ExceptionNumber, parseInt(NormalNumber) + parseInt(ExceptionNumber)));
	    option2 = {
	        tooltip: {
	            trigger: 'item',
	            formatter: "{a} <br/>{b} ({d}%)"
	        },
	        series: [{
	            name: '磁盘空间',
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
	function GetSchoolInfo(UserID) {
	    $.ajax({
	        type: "post",
	        dataType: 'json',
	        data: { AccessUserID: UserID },
	        url: "/Monitor/GetSchoolInfo",
	        success: function (data) {
	            if (data.status == "y") {
	                $(".mc_l>h2").html('<i class="layui-icon icon-home"></i>' + data.data.UnitName);
	            }
	        },
	    });
	}
	function SessionNum(val, cache) {
	    var allval = val;
	    $.ajax({
	        type: "post",
	        url: "/Monitor/GetSessionNumCount",
	        data: {
	            AccessUserID: allval
	        },
	        dataType: "json",
	        success: function (data) {
	            if (lastSessionN != data.SessionNumber) {
	                allComputer(allval);
	            }
	            if (dataList.length <= 60) {//缓存60分钟内的数据
	                dataList.unshift(caches(cache, data.SessionNumber));
	            } else {
	                dataList.pop();
	                dataList.unshift(caches(cache, data.SessionNumber));
	            }
	            lastSessionN = data.SessionNumber;	       
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
	                    //min: 5,
                        //minInterval: 1,
	                    axisLine: { onZero: false },
	                    axisLabel: {
	                        textStyle: {
	                            color: '#fff'
	                        }
	                    },
	                    type: 'value'
	                },
	                series: [{
	                    name: '会话数',
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
	function caches(cache, count) {//缓存60*配置的时间分钟数据
	    $.cookie(cache, count);
	    var cookietime = new Date();
	    cookietime.setTime(cookietime.getTime() + (60 * sesScrIntervalTime));
	    $.cookie(cache, count, { expires: cookietime });
	    $.cookie(cache, count, { path: "/newmain" });
	    return $.cookie(cache);
	}
	function IsExceptionData(data) {
	    if (data == "离线") {
	        return "<span style='color: #e50012'>" + data + "</span>"
	    } else if (data == "维护") {
	        return "<span style='color: #ecda3b'>" + data + "</span>"
	    } else if (data == "严重异常") {
	        return "<span style='color: #e50012'>" + data + "</span>"
	    } else if (data == "轻微异常") {
	        return "<span style='color: #e50012'>" + data + "</span>"
	    } else {
	        return data;
	    }
	}
})

