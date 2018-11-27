layui.config({
    base: "/Src/js/"
}).use(['form','vue', 'ztree', 'layer', 'jquery', 'table','utils'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;
    var table = layui.table;

    var type = $.getUrlParam("type");
    var tablename = $.getUrlParam("tablename");
    var dataId = $.getUrlParam("dataId");
    var userId = $.getUrlParam("userId");

    //主列表加载，可反复调用进行刷新
    var config= {};  //table的参数，如搜索key，点击tree的id
    var mainList = function(options) {
        if (options != undefined) {
            $.extend(config, options);
        }
        table.reload('mainList',
            {
                url: '/DataAuthority/Load?page=1&limit=20&typeId=DataAuthorityType',
                where: config,
                done: function(res, curr, count) {
                    //如果是异步请求数据方式，res即为你接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    var url = "/DataAuthority/LoadForUser";
                    if (type.indexOf("Role") != -1) {
                        url = "/DataAuthority/LoadForRole";
                    }
                    if (type.indexOf("Org") != -1) {
                        url = "/DataAuthority/LoadForOrg";
                    }
                    $.ajax(url,
                        {
                            async: false
                            , data: {
                                firstId: userId,
                                tablename: tablename,
                                dataId: dataId
                            }
                            , dataType: 'json'
                            ,success: function(json) {
                                if (json.Code == 500) return;
                                var roles = json.Result;
                                //循环所有数据，找出对应关系，设置checkbox选中状态
                                for (var i = 0; i < res.data.length; i++) {
                                    for (var j = 0; j < roles.length; j++) {
                                        if (res.data[i].Id != roles[j]) continue;

                                        //这里才是真正的有效勾选
                                        res.data[i]["LAY_CHECKED"] = true;
                                        //找到对应数据改变勾选样式，呈现出选中效果
                                        var index = res.data[i]['LAY_TABLE_INDEX'];
                                        $('.layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]')
                                            .prop('checked', true);
                                        $('.layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]')
                                            .next().addClass('layui-form-checked');
                                    }

                                }

                                //如果构成全选
                                var checkStatus = table.checkStatus('mainList');
                                if (checkStatus.isAll) {
                                    $('.layui-table-header th[data-DataAuthority="0"] input[type="checkbox"]')
                                        .prop('checked', true);
                                    $('.layui-table-header th[data-DataAuthority="0"] input[type="checkbox"]').next()
                                        .addClass('layui-form-checked');
                                }
                            }
                        });


                }
            });
        var explorer = navigator.userAgent;
        if (explorer.indexOf("Firefox") >= 0) {
            $.tj.autoTableBody();
            $("#tree").height($("div.layui-table-view").height());
        }
    };

    mainList();

    //分配及取消分配
    table.on('checkbox(list)', function (obj) {
        var url = "/RelevanceManager/AssignDataAuthority";
        if (!obj.checked) {
            url = "/RelevanceManager/UnAssignDataAuthority";
        }
        $.post(url, { type: type, firstId: userId, secIds: [obj.data.Id], tablename: tablename, dataId: dataId }
                       , function (data) {
                           layer.msg(data.Message);
                       }
                      , "json");
    });
    //监听页面主按钮操作 end
})