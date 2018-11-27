layui.config({
    base: "/Src/js/"
}).use(['form','vue', 'ztree', 'layer', 'jquery', 'table','droptree','openauth','utils'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;
    var table = layui.table;
    var openauth = layui.openauth;
    layui.droptree("/UserSession/GetOrgs", "#ParentName", "#ParentId", false);
    $("#menus").loadMenus("Org");

    $("#Department").blur(function () {
        var RegAccount = /^[\u4E00-\u9FA5]{0,1000}$/;
        if (!RegAccount.test($("#Department").val())) {
            //layer.msg("部门名称只能有中文字符", { time: 3000, icon: 6 });
            $(".text-danger").removeClass("hide");
            $(".text-danger").html("部门名称只能是中文字符");
            $("#Department").val("")
        } else {
            $(".text-danger").addClass("hide");
        }
    })

    $("#SortNo").blur(function () {
        if ($(this).val() < 0) {
            $(this).val("1")
            return false;
        }
    })
    
    //主列表加载，可反复调用进行刷新
    var config= {};  //table的参数，如搜索key，点击tree的id
    var mainList = function (options) {
        if (options != undefined) {
            $.extend(config, options);            
        }
        table.reload('mainList', {
            url: '/UserSession/GetSubOrgs?randow=' + Math.random(),
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
        var url = '/UserSession/GetOrgs?randow=' + Math.random();
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
    $("#tree").height($("div.layui-table-view").height());

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
                success: function() {
                    vm.$set('$data', data);
                    $("#Department").val(data.Name);
                    $("#SortNo").val(data.SortNo);
                    $("#ParentName").val(data.ParentName);
                },
                end: mainList
            });
            var url = "/OrgManager/Add";
            if (update) {
                url = "/OrgManager/Update"; //暂时和添加一个地址
            }
            var DepartmentName = data.Name;
            //提交数据
            form.on('submit(formSubmit)',
                function (data) {
                    var fieldName = data.field.Name,
                        flag = true, 
                        dataField = data.field;
                    $.ajax({
                        type: "post",
                        url: "/UserSession/GetSubOrgs",
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
                                        if (DepartmentName != $("#Department").val()) {
                                            layer.msg("部门名称不能有重复!");
                                        }                                        
                                        flag = false;
                                    }
                                    if (DepartmentName == $("#Department").val()) {
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
                                    ztree.reload();
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
                    Id: '',
                    SortNo:1
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
            openauth.del("/OrgManager/Delete",
                data.map(function (e) { return e.Id; }),
                mainList);
        }
        , btnAdd: function () {  //添加
            editDlg.add();
            $(".text-danger").addClass("hide");
        }
         , btnEdit: function () {  //编辑
             var checkStatus = table.checkStatus('mainList')
               , data = checkStatus.data;
             if (data.length != 1) {
                 layer.msg("请选择编辑的行，且同时只能编辑一行");
                 return;
             }
             editDlg.update(data[0]);
             $(".text-danger").addClass("hide");
         }

        , search: function () {   //搜索
            mainList({ key: $('#key').val() });
        }
        , btnRefresh: function() {
            //mainList();
            ztree.reload();
        }
        , btnAccessModule: function () {
            var index = layer.open({
                title: "为用户分配模块",
                type: 2,
                content: "newsAdd.html",
                success: function(layero, index) {
                    
                }
            });
        }
    };

    $('.toolList .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    
    $(document).on('click', ".layui-layer-btn0", function () {
        setTimeout(function () { ztree.reload(); }, 100);        
    });

    //监听页面主按钮操作 end

})

//头部导航栏
$.tj.loadTabAutority("6a9e1346-0c01-44d2-8eb1-f929fdab542a");
