
$(function () {
            rsizeM();
            var limitCount = 10, roll1, roll2, timer, listScrollTime;
		    updataDatas($.tj.getUrlParam("vals"));
		    GetSchoolInfo($.tj.getUrlParam("vals"));
		    $(window).resize(function(){
		        rsizeM();
		    })

		    function syrvey(){//字处理
		        unusually($(".table>tbody>tr>td:nth-child(5)"), "打开");
		        unusually($(".table>tbody>tr>td:nth-child(6)"), "关闭");
		        unusually($(".table>tbody>tr>td:nth-child(7)"), "未注册");
		    }
		    function unusually(nature, keywords){
		        for (var i = 0; i < nature.length; i++) {
		            if(nature[i].innerHTML == keywords){
		                nature[i].style.color = "red";
		            }
		        }
		    }
		    function rsizeM(){
		        var dw = $("#pageTo").width() / 2;
		        dw = -dw;
		        $("#pageTo").css({
		            "margin-left": dw
		        })
		        $(".row").height($(document).height() - 170);
		        //$("#alldata").css("min-height", $(document).height() - 400)		        
		    }
		    limitCount = Math.floor(($(document).height() - 410) / 38);
		    listScrollTime = $.tj.GetTimeSet("listScrollTime");
		    function rolls(){
		        clearTimeout(roll1);		       
		        roll1 = setTimeout(function(){
		            //$(".layui-box>a:first-child")[0].click();
		            updataDatas($.tj.getUrlParam("vals"));
		        }, listScrollTime)
		    }
		    function rolls2(){
		        clearTimeout(roll2);                
		        roll2 = setTimeout(function(){
		            $(".layui-box>.layui-laypage-curr").next()[0].click();
		        }, listScrollTime)
		    }
		    function DatasinterV() {
		        clearInterval(timer);
		        timer = setInterval(function () {
		            updataDatas($.tj.getUrlParam("vals"));
		        }, listScrollTime);
		    }
		    $(document).on("click", "#searchScreen>input[type=button]", function () {
		        updataDatas($.tj.getUrlParam("vals"));
		    })            
		    function updataDatas(userId) {//页面数据加载
		        $.ajax({
		            type: "post",
		            url: "/Monitor/GetComputerListData",
		            data: {
		                keyword: $("#searchScreen>input[type=search]").val(),
		                groupId: "",
		                regState: "",
		                userId: userId, //这个值有具体学校id的
		                orderName: "",
		                orderUserName: "",
		                orderConnectionUser: "",
		                orderMode: "",
		                orderPowerState: "",
		                orderReg: "",
		                pageIndex: "1",
		                pageSize:"1000000"
		            },
		            dataType: "json",
		            success: function (data) {
		                var dataList = [], dataL;
		                if (data.status == "n") {
		                    $("#alldata").html("<tr><td colspan='7'>" + data.info + "</td></tr>");
		                    DatasinterV();
		                } else if (data.status == "y") {
		                    data.data.forEach(function (vals) {
		                        dataL = [vals.HostedMachineName, vals._CatalogName, nodedata(vals._SessionUserName), vals._LastConnectionUser ? (vals._LastConnectionUser + "(" + vals.LastConnectionTime + ")") : "—", (vals.InMaintenanceMode ? '<span class="text-danger">打开</span>' : '关闭'), (vals.PowerState === 4 ? '打开' : '<span class="text-danger">关闭</span>'), (vals.RegistrationState === 2 ? "已注册" : "<span class='text-danger'>未注册</span>")]
		                        dataList.push(dataL);
		                    })
		                    layui.use(['laypage', 'layer'], function () {
		                        var laypage = layui.laypage
                                , layer = layui.layer;

		                        //测试数据
		                        var datas = dataList;

		                        //调用分页
		                        laypage.render({
		                            elem: 'pageTo',
		                            count: datas.length,
                                    limit: limitCount,
                                    curr: 1,
                                    prev: '',
                                    next: '',
                                    jump: function (obj, first) {
                                      var arr = [],
                                      thisData = datas.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);
                                      for (var b in thisData) {
                                          arr.push('<tr><td><h5>' + thisData[b][0] + '</h5></td><td><h5>' + thisData[b][1] + '</h5></td><td><h5>' + thisData[b][2] + '</h5></td><td><h5>' + thisData[b][3] + '</h5></td><td><h5>' + thisData[b][4] + '</h5></td><td><h5>' + thisData[b][5] + '</h5></td><td><h5>' + thisData[b][6] + '</h5></td></tr>');
                                      }
                                      $("#alldata").html(arr);
                                      syrvey();
                                      rsizeM();
                                      if (datas.length > limitCount) {
                                          if (obj.curr == 1) {
                                              rolls2();
                                          } else if (obj.curr == Math.ceil(datas.length / limitCount)) {
                                              rolls();
                                          } else {
                                              rolls2();
                                          }
                                      } else {
                                          DatasinterV();
                                      }
                                  }
		                        });
		                    });
		                }
		            },
		            error: function () {
		                console.log("error");
		            }
		        })
		    }
		    function GetSchoolInfo(UserID) {//搜索
		        $.ajax({
		            type: "post",
		            dataType: 'json',
		            data: { AccessUserID: UserID },
		            url: "/Monitor/GetSchoolInfo",
		            success: function (data) {
		                if (data.status == "y") {
		                    $(".monitorAllr_h>h2").html('<i class="layui-icon icon-home"></i>' + data.data.UnitName);
		                }
		            },
		        });
		    }
		    function nodedata(data) {//没有数据时字处理
		        if (data == "") {
                    return "无"
		        } else {
		            return data;
		        }
		    }
})