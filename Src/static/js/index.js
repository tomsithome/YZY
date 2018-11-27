var cacheds = ['cache0', 'cache1', 'cache2', 'cache3', 'cache4', 'cache5', 'cache6', 'cache7', 'cache8', 'cache9'],
    data3 = [],
    GetAllColorAndTimeSet = $.tj.GetAllColorAndTimeSet();
    exceptionScrollTime = GetAllColorAndTimeSet.exceptionScrollTime;
    mapExceptionColor = GetAllColorAndTimeSet.mapExceptionColor;
    mapNormalColor = GetAllColorAndTimeSet.mapNormalColor;
    projectExcepit = GetAllColorAndTimeSet.projectExcepitonLevelRefreshTime;
    serousTime = GetAllColorAndTimeSet.serousTime;
$(function () {
    //mapecharts();
    exceptionData();
    abnormal();
    cachedatacharts("cache0");
    proviceMover("全国"); 
    Interval(0);
    Intervalm();

    $(".mcl_more>h3").on("click", function () {
        window.parent.location.href = "/home/provinceMonitor?id=";
    })

    $(document).on("click", "#ExceptionPro", function () {
        var vals = $(this).attr("value"),pro = $(this).attr("province");
        window.parent.location.href = "/home/Computerlist?vals=" + vals + '&&province=' + pro;
    })
    
    var timer, miner;
    function Interval() {
        clearInterval(timer);
        timer = setInterval(function () {
            abnormal();//每秒钟时事加载异常数据
        }, projectExcepit)
    };

    function Intervalm() {
    	var j = 1, miners;
    	clearInterval(miners)
    	miners = setInterval(function () {
    		if (j == 10) {
    			j = 0;
    		}
    		cachedatacharts(cacheds[j]);
    		j++;
    	}, 60 * 1000);
    };    
})

function caches(cache, count) {//缓存serousTime * 10分钟数据
	$.cookie(cache, count);
	var cookietime = new Date();
	cookietime.setTime(cookietime.getTime() + (serousTime * 10 * 60 * 1000));
	$.cookie(cache, count, { expires: cookietime });
	$.cookie(cache, count, { path: "/newmain" });
	//清除10分钟之前的缓存,可以设置十分钟自动过期
	//console.log(cache, $.cookie(cache));
	return $.cookie(cache);
}

//地图echarts旁边的查看具体省份
function proviceMover(names){
    $(".mcl_more .mcl_area").html(names + "：");
    $.ajax({
        type: "get",
        url: "/Home/GetStaticsByArea",
        data: {
            area: names
        },
        dataType: "json",
        success: function (data) {
            $(".mcl_more>div:last-child>p:first-child>span:first-child").html("学校【" + data.SchoolNumber + "】");
            $(".mcl_more>div:last-child>p:first-child>span:last-child").html("主机【" + data.HostNumber + "】");
            $(".mcl_more>div:last-child>p:last-child>span:first-child").html("场景【" + data.SceneNumber + "】");
            $(".mcl_more>div:last-child>p:last-child>span:last-child").html("终端【" + data.TerminalNumber + "】");
        }
    });
}

//加载异常数
function abnormal() {
    $.ajax({
        type: "get",
        url: "/Home/GetProjectTotalByLevel",
        data: {
            area: "全国"
        },
        dataType: "json",
        success: function (data) {
        	if ($(".mcrhc1>p:nth-child(1)").html() != data.SlightNumber || $(".mcrhc2>p:nth-child(1)").html() != data.MediumNumber || $(".mcrhc3>p:nth-child(1)").html() != data.BADNumber) {
        		mapecharts();//每秒钟时事加载更新地图数据
        		exceptionData();//只要有异常数据更新，那么就肯定会有异常动态
        	}
            $(".mcrhc4>h5:first-child").html("总数 " + data.ProjectTotalNumber);
            $(".mcrhc4>h5:nth-child(2)").html("轻微异常 " + data.SlightNumber);
            $(".mcrhc4>h5:nth-child(3)").html("中等异常 " + data.MediumNumber);
            $(".mcrhc4>h5:nth-child(4)").html("严重异常 " + data.BADNumber);
            $(".mcrhc1>p:nth-child(1)").html(data.SlightNumber);
            $(".mcrhc1>p:nth-child(2)").html(data.ProjectTotalNumber);
            $(".mcrhc2>p:nth-child(1)").html(data.MediumNumber);
            $(".mcrhc2>p:nth-child(2)").html(data.ProjectTotalNumber);
            $(".mcrhc3>p:nth-child(1)").html(data.BADNumber);
            $(".mcrhc3>p:nth-child(2)").html(data.ProjectTotalNumber);
        }
    })
}

//异常动态
function exceptionData() {
    $.ajax({
        type: "get",
        url: "/Home/GetExceptionData",
        data: {
            area: "全国"
        },
        dataType: "json",
        success: function (data) {
        	var vals;
        	data = eval("(" + data + ")");
        	$(".mcrcl_c").html("");
        	if (data.length == 0) {
        	    $(".mcrcl_c").append("<ul><li><a href='javascript:void(0)'>无数据</a></li></ul>");
        	} else {
        	    $(".mcrcl_c").append("<ul></ul>")
        	    data.forEach(function (vals, index) {
        	        index = index + 1;
        	        $(".mcrcl_c>ul").append("<li><a id='ExceptionPro' value='" + vals.value + "' province='" + vals.province + "' href='javascript:void(0)'>" + index + '、' + vals.name + "</a></li>");
        	    })
        	    //$(".mcrcl_c>div").scrollQ();
        	    //数据进行滚动
        	    var $this = $('.mcrcl_c');
        	    var scrollTimer = setInterval(function () {        	        
        	        scrollNews($this);
        	    }, 1000);
        	    $this.hover(function () {
        	        clearInterval(scrollTimer);
        	    }, function () {
        	        scrollTimer = setInterval(function () {
        	            scrollNews($this);
        	        },1000);
        	    });        	  
        	}        	
        }
    })
}

function scrollNews(obj) {
    var $self = obj.find('ul:first');
    var lineHeight = $self.find('li:first').height();
    $self.animate({
        'marginTop': -lineHeight + 'px'
    }, exceptionScrollTime / 6, function () {
        $self.css({ marginTop: 0 }).find('li:first').appendTo($self);
    });
}


// 地图echarts
function mapecharts() {
    $.ajax({
        type: "get",
        url: "/Home/GetExceptionDataAll",
        data: {
            area: "全国"
        },
        dataType: "json",
        success: function (data) {
            data = eval("(" + data + ")");
            var vals = [], data2 = [];
            data.forEach(function (vals, index) {
                if (vals.value[2] >= 1 && vals.value[2] != vals.value[3]) {
                    vals.value[0] *= 1.5;
                    data2 = data2.concat(data2, vals);
                }
                
                return data2;
            })
            //坐标
            var geoCoordMap = {
                '北京市': [116.46, 39.92],
                '天津市': [117.2, 39.13],
                '上海市': [121.48, 31.22],
                '重庆市': [106.54, 29.59],
                '河北省': [114.48, 38.03],
                '山西省': [112.53, 37.87],
                '辽宁省': [123.38, 41.8],
                '吉林省': [125.35, 43.88],
                '黑龙江省': [126.63, 45.75],
                '江苏省': [120.78, 32.04],
                '浙江省': [120.19, 30.26],
                '安徽省': [117.27, 32.86],
                '福建省': [119.3, 26.08],
                '江西省': [115.89, 28.68],
                '山东省': [118, 36.65],
                '河南省': [113.65, 33.76],
                '湖北省': [112.31, 30.52],
                '湖南省': [112, 28.21],
                '江西省': [115, 28],
                '广东省': [113.23, 23.16],
                '海南省': [110.35, 20.02],
                '四川省': [104.06, 30.67],
                '贵州省': [106.71, 26.57],
                '云南省': [102.73, 25.04],
                '陕西省': [108.95, 34.27],
                '甘肃省': [103.73, 36.03],
                '青海省': [101.74, 36.56],
                '西藏': [91.11, 29.97],
                '广西': [108.33, 22.84],
                '内蒙古': [111.65, 40.82],
                '宁夏': [106.27, 38.47],
                '新疆': [87.68, 43.77],
                '山西省': [111.95, 36.87]
            };
            function randomValue() {
                return Math.round(Math.random() * 1000);
            }
            var convertData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }
                return res;
            };

            option1 = {
                tooltip: {
                    trigger: 'item',
                    padding: 10,
                    backgroundColor: '#222',
                    borderColor: '#777',
                    borderWidth: 1,
                    formatter: function (obj) {
                        var value = obj.value;
                        return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                            + obj.seriesName
                            + '</div>'
                            + '总数：' + value[3] + '<br>'
                            + '异常数：' + value[4] + '<br>';
                    }
                },
                geo: {
                    map: 'china',
                    roam: true,
                    label: {
                        normal: {
                            show: false,
                            textStyle: {
                                color: 'rgba(0,0,0,0.4)'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#f2f2f2',
                            borderColor: '#999999'
                        },
                        emphasis: {
                            areaColor: '#999999'
                        }
                    }
                },
                series: [
                    {
                        name: '正常',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: convertData(data),
                        symbolSize: function (val) {
                            return val[2] / 10;
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{c}',
                                position: 'right',
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: mapNormalColor
                            }
                        }
                    },
                    {
                        name: '异常',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: convertData(data2),
                        symbolSize: function (val) {
                            return val[2] / 10;
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: mapExceptionColor,
                                shadowBlur: 10,
                                shadowColor: '#ffffff'
                            }
                        },
                        zlevel: 1
                    }

                ]
            };
            var myChart1 = echarts.init(document.getElementById('container'));
            myChart1.on('click', function (param) {
                console.log(param.name)
                var selected = param.name;
                if (selected) {
                	switch (selected) {
                		case '北京市':
                			window.parent.location.href = "/home/provinceMonitor?id=北京市";
                			break;			 
						case '天津市':		 
							window.parent.location.href = "/home/provinceMonitor?id=天津市";
							break;			
						case '上海市':		  
							window.parent.location.href = "/home/provinceMonitor?id=上海市";
							break;			
						case '重庆市':		  
							window.parent.location.href = "/home/provinceMonitor?id=重庆市";
							break;			
						case '河北省':		 
							window.parent.location.href = "/home/provinceMonitor?id=河北省";
							break;			 
						case '山西省':		
							window.parent.location.href = "/home/provinceMonitor?id=山西省";
							break;			 
						case '内蒙古':		 
							window.parent.location.href = "/home/provinceMonitor?id=内蒙古";
							break;			 
						case '辽宁省':		  
							window.parent.location.href = "/home/provinceMonitor?id=辽宁省";
							break;			 
						case '吉林省':		 
							window.parent.location.href = "/home/provinceMonitor?id=吉林省";
							break;			 
						case '黑龙江省':	 
							window.parent.location.href = "/home/provinceMonitor?id=黑龙江省";
							break;			 
						case '江苏省':		 
							window.parent.location.href = "/home/provinceMonitor?id=江苏省";
							break;			 
						case '浙江省':		 
							window.parent.location.href = "/home/provinceMonitor?id=浙江省";
							break;			 
						case '安徽省':		 
							window.parent.location.href = "/home/provinceMonitor?id=安徽省";
							break;			
						case '福建省':		  
							window.parent.location.href = "/home/provinceMonitor?id=福建省";
							break;		
						case '广东省':		 
							window.parent.location.href = "/home/provinceMonitor?id=广东省";
							break;			
						case '江西省':		 
							window.parent.location.href = "/home/provinceMonitor?id=江西省";
							break;			
						case '山东省':		 
							window.parent.location.href = "/home/provinceMonitor?id=山东省";
							break;			
						case '广东省':		 
							window.parent.location.href = "/home/provinceMonitor?id=广东省";
							break;			
						case '河南省':		 
							window.parent.location.href = "/home/provinceMonitor?id=河南省";
							break;			 
						case '湖北省':		 
							window.parent.location.href = "/home/provinceMonitor?id=湖北省";
							break;			
						case '湖南省':		
							window.parent.location.href = "/home/provinceMonitor?id=湖南省";
							break;			
						case '广东省':		 
							window.parent.location.href = "/home/provinceMonitor?id=广东省";
							break;			
						case '广西':		  
							window.parent.location.href = "/home/provinceMonitor?id=广西";
							break;			
						case '海南省':		  
							window.parent.location.href = "/home/provinceMonitor?id=海南省";
							break;			
						case '四川省':		 
							window.parent.location.href = "/home/provinceMonitor?id=四川省";
							break;			
						case '贵州省':		
							window.parent.location.href = "/home/provinceMonitor?id=贵州省";
							break;			 
						case '云南省':		  
							window.parent.location.href = "/home/provinceMonitor?id=云南省";
							break;			
						case '西藏':		 
							window.parent.location.href = "/home/provinceMonitor?id=西藏";
							break;			
						case '陕西省':		  
							window.parent.location.href = "/home/provinceMonitor?id=陕西省";
							break;			
						case '甘肃省':		 
							window.parent.location.href = "/home/provinceMonitor?id=甘肃省";
							break;			
						case '青海省':		 
							window.parent.location.href = "/home/provinceMonitor?id=青海省";
							break;			
						case '宁夏':		 
							window.parent.location.href = "/home/provinceMonitor?id=宁夏";
							break;			
						case '新疆':		  
							window.parent.location.href = "/home/provinceMonitor?id=新疆";
							break;			
						case '香港':		 
							window.parent.location.href = "/home/provinceMonitor?id=香港";
							break;			
						case '澳门':		  
							window.parent.location.href = "/home/provinceMonitor?id=澳门";
							break;			
						case '台湾省':		
							window.parent.location.href = "/home/provinceMonitor?id=台湾省";
							break;
                	    case '北京':
                	        window.parent.location.href = "/home/provinceMonitor?id=北京市";
                	        break;
                	    case '天津':
                	        window.parent.location.href = "/home/provinceMonitor?id=天津市";
                	        break;
                	    case '上海':
                	        window.parent.location.href = "/home/provinceMonitor?id=上海市";
                	        break;
                	    case '重庆':
                	        window.parent.location.href = "/home/provinceMonitor?id=重庆市";
                	        break;
                	    case '河北':
                	        window.parent.location.href = "/home/provinceMonitor?id=河北省";
                	        break;
                	    case '山西':
                	        window.parent.location.href = "/home/provinceMonitor?id=山西省";
                	        break;
                	    case '内蒙':
                	        window.parent.location.href = "/home/provinceMonitor?id=内蒙古";
                	        break;
                	    case '辽宁':
                	        window.parent.location.href = "/home/provinceMonitor?id=辽宁省";
                	        break;
                	    case '吉林':
                	        window.parent.location.href = "/home/provinceMonitor?id=吉林省";
                	        break;
                	    case '黑龙江':
                	        window.parent.location.href = "/home/provinceMonitor?id=黑龙江省";
                	        break;
                	    case '江苏':
                	        window.parent.location.href = "/home/provinceMonitor?id=江苏省";
                	        break;
                	    case '浙江':
                	        window.parent.location.href = "/home/provinceMonitor?id=浙江省";
                	        break;
                	    case '安徽':
                	        window.parent.location.href = "/home/provinceMonitor?id=安徽省";
                	        break;
                	    case '福建':
                	        window.parent.location.href = "/home/provinceMonitor?id=福建省";
                	        break;
                	    case '广东':
                	        window.parent.location.href = "/home/provinceMonitor?id=广东省";
                	        break;
                	    case '江西':
                	        window.parent.location.href = "/home/provinceMonitor?id=江西省";
                	        break;
                	    case '山东':
                	        window.parent.location.href = "/home/provinceMonitor?id=山东省";
                	        break;
                	    case '广东':
                	        window.parent.location.href = "/home/provinceMonitor?id=广东省";
                	        break;
                	    case '河南':
                	        window.parent.location.href = "/home/provinceMonitor?id=河南省";
                	        break;
                	    case '湖北':
                	        window.parent.location.href = "/home/provinceMonitor?id=湖北省";
                	        break;
                	    case '湖南':
                	        window.parent.location.href = "/home/provinceMonitor?id=湖南省";
                	        break;
                	    case '广东':
                	        window.parent.location.href = "/home/provinceMonitor?id=广东省";
                	        break;
                	    case '海南':
                	        window.parent.location.href = "/home/provinceMonitor?id=海南省";
                	        break;
                	    case '四川':
                	        window.parent.location.href = "/home/provinceMonitor?id=四川省";
                	        break;
                	    case '贵州':
                	        window.parent.location.href = "/home/provinceMonitor?id=贵州省";
                	        break;
                	    case '云南':
                	        window.parent.location.href = "/home/provinceMonitor?id=云南省";
                	        break;
                	    case '陕西':
                	        window.parent.location.href = "/home/provinceMonitor?id=陕西省";
                	        break;
                	    case '甘肃':
                	        window.parent.location.href = "/home/provinceMonitor?id=甘肃省";
                	        break;
                	    case '青海':
                	        window.parent.location.href = "/home/provinceMonitor?id=青海省";
                	        break;
                	    case '台湾':
                	        window.parent.location.href = "/home/provinceMonitor?id=台湾省";
                	        break;
                        default:
                            break;
                    }

                }
            });
            myChart1.on('mouseover', function (param) {
                //console.log(param, param.name)
                var selected = param.name;
                if (selected) {
                    switch (selected) {
                        case '北京市':
                            proviceMover("北京市");
                            break;
                        case '天津市':
                            proviceMover("天津市");
                            break;
                        case '上海市':
                            proviceMover("上海市");
                            break;
                        case '重庆市':
                            proviceMover("重庆市");
                            break;
                        case '河北省':
                            proviceMover("河北省");
                            break;
                        case '山西省':
                            proviceMover("山西省");
                            break;
                        case '内蒙古':
                            proviceMover("内蒙古");
                            break;
                        case '辽宁省':
                            proviceMover("辽宁省");
                            break;
                        case '吉林省':
                            proviceMover("吉林省");
                            break;
                        case '黑龙江省':
                            proviceMover("黑龙江省");
                            break;
                        case '江苏省':
                            proviceMover("江苏省");
                            break;
                        case '浙江省':
                            proviceMover("浙江省");
                            break;
                        case '安徽省':
                            proviceMover("安徽省");
                            break;
                        case '福建省':
                            proviceMover("福建省");
                            break;
                        case '广东省':
                            proviceMover("广东省");
                            break;
                        case '江西省':
                            proviceMover("江西省");
                            break;
                        case '山东省':
                            proviceMover("山东省");
                            break;
                        case '广东省':
                            proviceMover("广东省");
                            break;
                        case '河南省':
                            proviceMover("河南省");
                            break;
                        case '湖北省':
                            proviceMover("湖北省");
                            break;
                        case '湖南省':
                            proviceMover("湖南省");
                            break;
                        case '广东省':
                            proviceMover("广东省");
                            break;
                        case '广西':
                            proviceMover("广西");
                            break;
                        case '海南省':
                            proviceMover("海南省");
                            break;
                        case '四川省':
                            proviceMover("四川省");
                            break;
                        case '贵州省':
                            proviceMover("贵州省");
                            break;
                        case '云南省':
                            proviceMover("云南省");
                            break;
                        case '西藏':
                            proviceMover("西藏");
                            break;
                        case '陕西省':
                            proviceMover("陕西省");
                            break;
                        case '甘肃省':
                            proviceMover("甘肃省");
                            break;
                        case '青海省':
                            proviceMover("青海省");
                            break;
                        case '宁夏':
                            proviceMover("宁夏");
                            break;
                        case '新疆':
                            proviceMover("新疆");
                            break;
                        case '香港':
                            proviceMover("香港");
                            break;
                        case '澳门':
                            proviceMover("澳门");
                            break;
                        case '台湾省':
                            proviceMover("台湾省");
                            break;
                        case '北京':
                            proviceMover("北京市");
                            break;
                        case '天津':
                            proviceMover("天津市");
                            break;
                        case '上海':
                            proviceMover("上海市");
                            break;
                        case '重庆':
                            proviceMover("重庆市");
                            break;
                        case '河北':
                            proviceMover("河北省");
                            break;
                        case '山西':
                            proviceMover("山西省");
                            break;
                        case '内蒙':
                            proviceMover("内蒙古");
                            break;
                        case '辽宁':
                            proviceMover("辽宁省");
                            break;
                        case '吉林':
                            proviceMover("吉林省");
                            break;
                        case '黑龙江':
                            proviceMover("黑龙江省");
                            break;
                        case '江苏':
                            proviceMover("江苏省");
                            break;
                        case '浙江':
                            proviceMover("浙江省");
                            break;
                        case '安徽':
                            proviceMover("安徽省");
                            break;
                        case '福建':
                            proviceMover("福建省");
                            break;
                        case '广东':
                            proviceMover("广东省");
                            break;
                        case '江西':
                            proviceMover("江西省");
                            break;
                        case '山东':
                            proviceMover("山东省");
                            break;
                        case '广东':
                            proviceMover("广东省");
                            break;
                        case '河南':
                            proviceMover("河南省");
                            break;
                        case '湖北':
                            proviceMover("湖北省");
                            break;
                        case '湖南':
                            proviceMover("湖南省");
                            break;
                        case '广东':
                            proviceMover("广东省");
                            break;
                            break;
                        case '海南':
                            proviceMover("海南省");
                            break;
                        case '四川':
                            proviceMover("四川省");
                            break;
                        case '贵州':
                            proviceMover("贵州省");
                            break;
                        case '云南':
                            proviceMover("云南省");
                            break;
                        case '西藏':
                            proviceMover("西藏");
                            break;
                        case '陕西':
                            proviceMover("陕西省");
                            break;
                        case '甘肃':
                            proviceMover("甘肃省");
                            break;
                        case '青海':
                            proviceMover("青海省");
                            break;
                        case '台湾':
                            proviceMover("台湾省");
                            break;
                        default:
                            break;
                    }

                }
            });
            myChart1.setOption(option1);
        }
    });
}

// 树桩图echarts
function cachedatacharts(cache) {
	$.ajax({
		type: "get",
		url: "/Home/GetProjectTotalByLevel",
		data: {
			area: "全国"
		},
		dataType: "json",
		success: function (data) {
		    var count = data.SlightNumber + data.MediumNumber + data.BADNumber;
		    var data4 = [serousTime + "min", serousTime * 2 +"min", serousTime * 3 + "min", serousTime * 4 + "min", serousTime * 5 + "min", serousTime * 6 + "min", serousTime * 7 + "min", serousTime * 8 + "min", serousTime * 9 + "min", serousTime * 10 + "min"];

		    if (data3.length < 10) {//缓存十分钟内的数据
		        data3.push(caches(cache, count));
			} else {
		        data3.shift();
		        data3.push(caches(cache, count));
			}
			//console.log(data3, cache);

			var yMax = 20, dataShadow = [];
			for (var i = 0; i < data3.length; i++) {
				dataShadow.push(yMax);
			}
			option2 = {
				color: ['#FF715D'],
				tooltip: {},
				xAxis: {
					axisLabel: {
						textStyle: {
							color: '#fff'
						}
					},
					data: data4
				},
				yAxis: {
					axisLabel: {
						textStyle: {
							color: '#fff'
						}
					}
				},
				series: [
					 { // For shadow
					 	type: 'bar',
					 	itemStyle: {
					 		normal: { color: 'rgba(255,239,57,0.8)' }
					 	},
					 	barGap: '-100%',
					 	barCategoryGap: '40%',
					 	data: dataShadow,
					 	//data: data.ProjectTotalNumber,
					 	animation: false
					 },
					{
						name: '异常',
						type: 'bar',
						data: data3
					}
				]
			};
			var myChart2 = echarts.init(document.getElementById('echarts_con'));
			myChart2.setOption(option2);

		}
	})
}


