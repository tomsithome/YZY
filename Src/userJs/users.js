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
    var id = $.getUrlParam("id");
    $("#menus").loadMenus("User");

    $("#Account").blur(function () {
        var RegAccount = /^[a-zA-Z0-9_]{0,}$/;
        if (!RegAccount.test($("#Account").val())) {
            layer.msg("账号只能添加英文和数字!", { time: 3000, icon: 6 });
            $("#Account").val("")
        }
    })

    //主列表加载，可反复调用进行刷新
    var config= {};  //table的参数，如搜索key，点击tree的id
    var mainList = function (options) {
        if (options != undefined) {
            $.extend(config, options);
        }
        table.reload('mainList', {
            url: '/UserManager/Load?randow='+Math.random(),
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

    $("#tree").height( $("div.layui-table-view").height());

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
                    $("#AccountName").val(data.Name);
                    $("#Account").val(data.Account);
                    $("#Organizations").val(data.Organizations);
                    $(":radio[name='Sex'][value='" + data.Sex + "']").prop("checked", "checked");
                    $("input:checkbox[name='Status']").prop("checked", data.Status == 1);
                    //下面这种方式适合单独开页面，不然上次选中的结果会对本次有影响
                   // $('input:checkbox[name="Status"][value="' + data.Status + '"]').prop('checked', true);
                    form.render();
                },
                end: mainList
            });
            var url = "/UserManager/AddOrUpdate";
            if (update) {
                url = "/UserManager/AddOrUpdate"; //暂时和添加一个地址
            }
            //提交数据
            var RolesNameAccount = data.Account;
            form.on('submit(formSubmit)',
                function (data) {
                    var fieldAccount = data.field.Account,
                        flag = true,
                        dataField = data.field;
                    $.ajax({
                        type: "post",
                        url: "/UserManager/Load",
                        dataType: "json",
                        success: function (data) {
                            console.log(data)
                            data.data.forEach(function (val) {
                                if (title == "添加") {
                                    if (fieldAccount == val.Account) {
                                        flag = false;
                                        layer.msg("账号名称不能有重复!");
                                    }
                                } else if (title == "编辑信息") {
                                    if (fieldAccount == val.Account) {
                                        if (RolesNameAccount != $("#Account").val()) {
                                            layer.msg("账号名称不能有重复!");
                                        }
                                        flag = false;
                                    }
                                    if (RolesNameAccount == $("#Account").val()) {
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
                    //$.post(url,
                    //    data.field,
                    //    function(data) {
                    //        layer.msg(data.Message);
                    //        layer.closeAll();
                    //    },
                    //    "json");
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
        if (obj.event === 'reset') {        
            var index = toplayer.open({
                title: "为用户【" + data.Name + "】修改密码",
                type: 2,
                area: ['450px', '300px'],
                content: "/UserManager/Reset?id="+data.Id+"&account="+data.Account+"",
                success: function (layero, index) {              
                }
            });
        } 
    });

    //监听页面主按钮操作
    var active = {
        btnDel: function () {      //批量删除
            var checkStatus = table.checkStatus('mainList')
                , data = checkStatus.data;
            openauth.del("/UserManager/Delete",
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
                toplayer.msg("请选择要分配的用户");
                return;
            }

            var index = toplayer.open({
                title: "为用户【" + data[0].Name + "】分配模块",
                type: 2,
                area: ['750px', '600px'],
                content: "/ModuleManager/Assign?type=UserModule&menuType=UserElement&id=" + data[0].Id,
                success: function(layero, index) {
                    
                }
            });
        }
        , btnAccessRole: function () {
            var checkStatus = table.checkStatus('mainList')
               , data = checkStatus.data;
            if (data.length != 1) {
                toplayer.msg("请选择要分配的用户");
                return;
            }

            var index = toplayer.open({
                title: "为用户【"+ data[0].Name + "】分配角色",
                type: 2,
                area: ['750px', '600px'],
                content: "/RoleManager/Assign?type=UserRole&id=" + data[0].Id,
                success: function (layero, index) {

                }
            });
        }
        , btnAssignReource: function () {
            var checkStatus = table.checkStatus('mainList')
                , data = checkStatus.data;
            if (data.length != 1) {
                toplayer.msg("请选择要分配的用户");
                return;
            }

            var index = toplayer.open({
                title: "为用户【" + data[0].Name + "】分配资源",
                type: 2,
                area: ['750px', '600px'],
                content: "/Resources/Assign?type=UserResource&id=" + data[0].Id,
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
//$.tj.loadTab("/UserManager/Index");
$.tj.loadTabAutority("ef386d5d-cd58-43c0-a4ab-80afd0dbcd6c");