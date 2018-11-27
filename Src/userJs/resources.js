layui.config({
    base: "/Src/js/"
}).use(['form', 'vue', 'ztree', 'layer', 'jquery', 'table', 'droptree', 'openauth', 'utils'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;
    var table = layui.table;
    var openauth = layui.openauth;
    var toplayer = (top == undefined || top.layer === undefined) ? layer : top.layer;  //顶层的LAYER

    $("#menus").loadMenus("Resource");


    layui.droptree("/Applications/GetList", "#AppName", "#AppId", false);

    $(".resetAll").on("click", function () {
        $("#IsEdit").val("");
        $("#resourceName").val("");
        $("#resourceDes").val("");
        $("#AppName").val("");
    })

    //主列表加载，可反复调用进行刷新
    var config = {};  //table的参数，如搜索key，点击tree的id
    var mainList = function(options) {
        if (options != undefined) {
            $.extend(config, options);
        }
        table.reload('mainList',
            {
                url: '/Resources/Load?randow=' + Math.random(),
                where: config
            });
        var explorer = navigator.userAgent;
        if (explorer.indexOf("Firefox") >= 0) {
            $.tj.autoTableBody();
            $("#tree").height($("div.layui-table-view").height());
        }
    };
    mainList();
 
    //添加（编辑）对话框
    var editDlg = function () {
        var vm = new Vue({
            el: "#formEdit"
        });
        var update = false;  //是否为更新
        var show = function (data) {
            var title = update ? "编辑信息" : "添加";
            layer.open({
                title: title,
                area: ["500px", "400px"],
                type: 1,
                content: $('#divEdit'),
                success: function () {
                    vm.$set('$data', data);
                    $("#IsEdit").val(data.Id);
                    $("#resourceName").val(data.Name);
                    $("#resourceDes").val(data.Description);
                    $("#AppName").val(data.AppName);
                },
                end: mainList
            });
            var url = "/Resources/Add";
            if (update) {
                url = "/Resources/Update";
            }
            //提交数据
            form.on('submit(formSubmit)',
                function (data) {
                    $.post(url,
                        data.field,
                        function (data) {                
                            if (data.Code == 500) {
                                layer.msg("编辑失败", { time: 5000 });
                            } else {
                                layer.msg(data.Message);
                                layer.closeAll();
                            }
                        },
                        "json");
                    return false;
                });
        }
        return {
            add: function () { //弹出添加
                update = false;
                show({
                    Id: ''
                });
            },
            update: function (data) { //弹出编辑框
                update = true;
                show(data);
            }
        };
    }();

    //监听表格内部按钮
    table.on('tool(list)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {      //查看
            layer.msg('ID：' + data.Id + ' 的查看操作');
        }
    });


    //监听页面主按钮操作
    var active = {
        btnDel: function () {      //批量删除
            var checkStatus = table.checkStatus('mainList')
                , data = checkStatus.data;
            openauth.del("/Resources/Delete",
                data.map(function (e) { return e.Id; }),
                mainList);
        }
        , btnAdd: function () {  //添加
            editDlg.add();
            $("#IsEdit").attr("disabled", false);
            $("#IsEdit").css("cursor", "text");
        }
        , btnEdit: function () {  //编辑
            var checkStatus = table.checkStatus('mainList')
                , data = checkStatus.data;
            if (data.length != 1) {
                layer.msg("请选择编辑的行，且同时只能编辑一行");
                return;
            }
            editDlg.update(data[0]);
            $("#IsEdit").attr("disabled", true);
            $("#IsEdit").css("cursor", "not-allowed");
        }

        , search: function () {   //搜索
            mainList({ key: $('#key').val() });
        }
        , btnRefresh: function () {
            mainList();
        }
    };

    $('.toolList .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //监听页面主按钮操作 end

    $(document).on("click", "#searchs", function () {
        table.reload('mainList',
            {
                url: "/Resources/Load?page=" + $(".layui-laypage-skip>.layui-input").val() + "&limit=20&key=" + $("#keyword").val(),
                where: config
            });
    })

})

//头部导航栏
$.tj.loadTabAutority("e8dc5db6-4fc4-4795-a1cc-681cbcceec91");