layui.config({
    base: "/Src/js/"
}).use(['form', 'vue', 'ztree', 'layer', 'jquery', 'table', 'droptree', 'openauth', 'utils'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;
    var table = layui.table;
    var openauth = layui.openauth;
    var toplayer = (top == undefined || top.layer === undefined) ? layer : top.layer;  //顶层的LAYER
    layui.droptree("/UserSession/GetOrgs", "#Organizations", "#OrganizationIds");
    var tablename = $.getUrlParam("tablename");
    $("#menus").loadMenus("DataAuthority");

    //主列表加载，可反复调用进行刷新
    var config = {};  //table的参数，如搜索key，点击tree的id
    var mainList = function (options) {
        if (options != undefined) {
            $.extend(config, options);
        }
        table.reload('mainList', {
            url: '/DataAuthority/LoadTable?tablename=' + tablename + '',
            where: config
        });
        var explorer = navigator.userAgent;
        if (explorer.indexOf("Firefox") >= 0) {
            $.tj.autoTableBody();
            $("#tree").height($("div.layui-table-view").height());
        }
    }
    //左边树状机构列表
    var ztree = function () {
        var url = '/UserSession/GetOrgs';
        var zTreeObj;
        var setting = {
            view: { selectedMulti: false },
            data: {
                key: {
                    name: 'Name',
                    title: 'Name'
                },
                simpleData: {
                    enable: true,
                    idKey: 'Id',
                    pIdKey: 'ParentId',
                    rootPId: 'null'
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    mainList({ orgId: treeNode.Id });
                }
            }
        };
        var load = function () {
            $.getJSON(url, function (json) {
                zTreeObj = $.fn.zTree.init($("#tree"), setting);
                var newNode = { Name: "根节点", Id: null, ParentId: "" };
                json.push(newNode);
                zTreeObj.addNodes(null, json);
                mainList({ orgId: "" });
                zTreeObj.expandAll(true);
            });
        };
        load();
        return {
            reload: load
        }
    }();

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
                },
                end: mainList
            });
            var url = "/DataAuthority/Add";
            if (update) {
                url = "/DataAuthority/Update";
            }
            //提交数据
            form.on('submit(formSubmit)',
                function (data) {
                    $.post(url,
                        data.DataAuthority,
                        function (data) {
                            layer.msg(data.Message);
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
            openauth.del("/DataAuthority/Delete",
                data.map(function (e) { return e.Id; }),
                mainList);
        }
        , btnAdd: function () {  //添加
            editDlg.add();
        }
         , btnEdit: function () {  //编辑
             var checkStatus = table.checkStatus('mainList')
               , data = checkStatus.data;
             if (data.length != 1) {
                 layer.msg("请选择编辑的行，且同时只能编辑一行");
                 return;
             }
             editDlg.update(data[0]);
         }

        , search: function () {   //搜索
            mainList({ key: $('#key').val() });
        }
        , btnRefresh: function () {
            mainList();
        }
        , goback: function () {
            history.back(-1);
        }
        , UserControl: function () {
            var checkStatus = table.checkStatus('mainList')
               , data = checkStatus.data;
            if (data.length != 1) {
                toplayer.msg("请选择要分配的数据行");
                return;
            }

            var index = toplayer.open({
                title: "按用户为数据【" + data[0].Id + "】分配权限",
                type: 2,
                area: ['750px', '600px'],
                content: "/DataAuthority/UserIndex?tablename="+tablename+"&dataId=" + data[0].Id,
                success: function (layero, index) {

                }
            });

        },
        RoleControl: function () {
            var checkStatus = table.checkStatus('mainList')
   , data = checkStatus.data;
            if (data.length != 1) {
                toplayer.msg("请选择要分配的数据行");
                return;
            }

            var index = toplayer.open({
                title: "按角色为数据【" + data[0].Id + "】分配权限",
                type: 2,
                area: ['750px', '600px'],
                content: "/DataAuthority/RoleIndex?tablename=" + tablename + "&dataId=" + data[0].Id,
                success: function (layero, index) {

                }
            });
        },
        OrgControl: function () {
            var checkStatus = table.checkStatus('mainList')
   , data = checkStatus.data;
            if (data.length != 1) {
                toplayer.msg("请选择要分配的数据行");
                return;
            }

            var index = toplayer.open({
                title: "按部门为数据【" + data[0].Id + "】分配权限",
                type: 2,
                area: ['750px', '600px'],
                content: "/DataAuthority/OrgIndex?tablename=" + tablename + "&dataId=" + data[0].Id,
                success: function (layero, index) {

                }
            });
        },
        ResourceControl: function () {
            var checkStatus = table.checkStatus('mainList')
   , data = checkStatus.data;
            if (data.length != 1) {
                toplayer.msg("请选择要分配的数据行");
                return;
            }
            var index = toplayer.open({
                title: "按资源标识为数据【" + data[0].Id + "】分配权限",
                type: 2,
                area: ['750px', '600px'],
                content: "/DataAuthority/ResourceIndex?type=ResourceDataAuthority&userId=" + data[0].Id + "&tablename=" + tablename + "",
                success: function (layero, index) {

                }
            });
        }
    };

    $('.toolList .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    $(document).on("click", "#searchs", function () {
        table.reload('mainList',
            {
                url: "/Customer/Load?key=" + $("#keyword").val(),
                where: config
            });
    })

    //监听页面主按钮操作 end
})