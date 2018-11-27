layui.config({
    base: "/Src/js/"
}).use(['form','vue', 'ztree', 'layer', 'jquery', 'table','droptree','openauth','utils'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;
    var table = layui.table;
    var openauth = layui.openauth;
    var toplayer = (top == undefined || top.layer === undefined) ? layer : top.layer;  //顶层的LAYER
    layui.droptree("/UserSession/GetOrgs", "#Organizations", "#OrganizationIds");

    $("#Organizations").focus(function () {
        $("#formEdit>.layui-form-item:last-child").addClass("layui-form-i-morelast");
        $("#formEdit>.layui-form-item:last-child").removeClass("layui-form-i-last");
    })
    $("#Organizations").blur(function () {
        $("#subsdiv>.layui-form-item:last-child").removeClass("layui-form-i-morelast");
        $("#formEdit>.layui-form-item:last-child").addClass("layui-form-i-last");
    })
   
    $("#menus").loadMenus("Role");

    //主列表加载，可反复调用进行刷新
    var config= {};  //table的参数，如搜索key，点击tree的id
    var mainList = function (options) {
        if (options != undefined) {
            $.extend(config, options);
        }
        table.reload('mainList', {
            url: '/RoleManager/Load?randow=' + Math.random(),
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
                    rootPId: ""
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
                var newNode = { Name: "根节点", Id: null,ParentId:"" };
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
    $("#tree").height($("div.layui-table-view").height());

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
                    $("#RolesName").val(data.Name);
                    $("#Organizations").val(data.Organizations);
                    $("input:checkbox[name='Status']").prop("checked", data.Status == 1);
                    form.render();
                },
                end: mainList
            });
            var url = "/RoleManager/Add";
            if (update) {
                url = "/RoleManager/Update"; 
            }
            //提交数据
            var RolesNameName = data.Name;
            form.on('submit(formSubmit)',
                function (data) {
                    var fieldName = data.field.Name,
                        flag = true,
                        dataField = data.field;
                    $.ajax({
                        type: "post",
                        url: "/RoleManager/Load",
                        dataType: "json",
                        success: function (data) {
                            data.data.forEach(function (val) {
                                if (title == "添加") {
                                    if (fieldName == val.Name) {
                                        flag = false;
                                        layer.msg("部门名称不能有重复!");
                                    }
                                } else if (title == "编辑信息") {
                                    if (fieldName == val.Name) {
                                        if (RolesNameName != $("#RolesName").val()) {
                                            layer.msg("部门名称不能有重复!");
                                        }
                                        flag = false;
                                    } 
                                    if (RolesNameName == $("#RolesName").val()) {
                                        flag = true;
                                    }
                                }
                            })
                            if (flag) {
                                $.post(url,
                                dataField,
                                function (data) {
                                    layer.msg(data.Message);
                                    layer.closeAll();
                                },
                                "json");
                            }
                        }
                    })                                   
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
            openauth.del("/RoleManager/Delete",
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
        , btnAccessModule: function () {
            var checkStatus = table.checkStatus('mainList')
               , data = checkStatus.data;
            if (data.length != 1) {
                layer.msg("请选择要分配的角色");
                return;
            }

            var index = layer.open({
                title: "为角色【" + data[0].Name + "】分配模块",
                type: 2,
                area: ['750px', '600px'],
                content: "/ModuleManager/Assign?type=RoleModule&menuType=RoleElement&id=" + data[0].Id,
                success: function (layero, index) {

                }
            });
        }
        , btnAssignReource: function () {
            var checkStatus = table.checkStatus('mainList')
                , data = checkStatus.data;
            if (data.length != 1) {
                toplayer.msg("请选择要分配的角色");
                return;
            }

            var index = toplayer.open({
                title: "为角色【" + data[0].Name + "】分配资源",
                type: 2,
                area: ['750px', '600px'],
                content: "/Resources/Assign?type=RoleResource&id=" + data[0].Id,
                success: function (layero, index) {

                }
            });
        }
    };

    $('.toolList .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //监听页面主按钮操作 end
    
})

//头部导航栏
//$.tj.loadTab("/RoleManager/Index");
$.tj.loadTabAutority("bedb41a2-f310-4775-af99-01be08adda93");

