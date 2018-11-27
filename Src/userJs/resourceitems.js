layui.config({
    base: "/Src/js/"
}).use(['form','vue', 'ztree', 'layer', 'jquery', 'table','droptree','openauth', 'utils'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;
    var table = layui.table;
    var openauth = layui.openauth;
    var toplayer = (top == undefined || top.layer === undefined) ? layer : top.layer;  //顶层的LAYER
    layui.droptree("/Resources/AllResource", "#ResourceName", "#ResourceId", false);

    $("#menus").loadMenus("ResourceItem");
   
    //主列表加载，可反复调用进行刷新
    var config= {};  //table的参数，如搜索key，点击tree的id
    var mainList = function (options) {
        if (options != undefined) {
            $.extend(config, options);
        }
        table.reload('mainList', {
            url: '/ResourceItem/Load?randow=' + Math.random(),
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
    var editDlg = function() {
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
                success: function() {
                    vm.$set('$data', data);
                    $("#ResourceName").val(data.ResourceName);
                    $("#Users").val(data.Users);
                    $("#RolesName").val(data.RolesName);
                    $("#OrgsName").val(data.OrgsName);
                    $("#DataAuthoritys").val(data.Authoritys);
                },
                end: mainList
            });
            var url = "/ResourceItem/Add";
            if (update) {
                url = "/ResourceItem/Update"; 
            }
            //提交数据
            form.on('submit(formSubmit)',
                function(data) {
                    $.post(url,
                        data.field,
                        function(data) {
                            layer.msg(data.Message);
                            layer.closeAll();
                        },
                        "json");
                    return false;
                });
        }
        return {
            add: function() { //弹出添加
                update = false;
                show({
                    Id: ''
                });
            },
            update: function(data) { //弹出编辑框
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
            openauth.del("/ResourceItem/Delete",
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
        , btnRefresh: function() {
            mainList();
        }
    };

    $('.toolList .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //监听页面主按钮操作 end

})

$.tj.loadTabAutority("c9986a34-1145-4fa3-a6ab-aca916e3ec41");

function SetUser() {
    var toplayer = (top == undefined || top.layer === undefined) ? layer : top.layer;  //顶层的LAYER
    console.log(toplayer);
    var index = toplayer.open({
        title: "选择用户",
        type: 2,
        area: ['850px', '600px'],
        content: "/ResourceItem/UserIndex?id=" + $("#Users").val() + "",
        success: function (layero, index) {

        }
    });
}
function SetRole() {
    var toplayer = (top == undefined || top.layer === undefined) ? layer : top.layer;  //顶层的LAYER
    var index = toplayer.open({
        title: "选择角色",
        type: 2,
        area: ['850px', '600px'],
        content: "/ResourceItem/RoleIndex?id=" + $("#Roles").val() + "",
        success: function (layero, index) {

        }
    });
}
function SetOrg() {
    var toplayer = (top == undefined || top.layer === undefined) ? layer : top.layer;  //顶层的LAYER
    var index = toplayer.open({
        title: "选择部门",
        type: 2,
        area: ['850px', '600px'],
        content: "/ResourceItem/OrgIndex?id=" + $("#Orgs").val() + "",
        success: function (layero, index) {

        }
    });
}
function SetDataAuthority() {
    var toplayer = (top == undefined || top.layer === undefined) ? layer : top.layer;  //顶层的LAYER
    var index = toplayer.open({
        title: "选择权限",
        type: 2,
        area: ['850px', '600px'],
        content: "/ResourceItem/DataAuthorityIndex?id=" + $("#DataAuthoritys").val() + "&typeId=DataAuthorityType",
        success: function (layero, index) {

        }
    });
}