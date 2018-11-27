layui.config({
    base: "/Src/js/"
}).use(['form','vue', 'ztree', 'layer', 'jquery', 'table','droptree','openauth','utils'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery;
    var table = layui.table;
    var openauth = layui.openauth;
    layui.droptree("/Categories/AllTypes", "#TypeName", "#TypeId", false);
    var typeId = $.getUrlParam("typeId");
    var id = $.getUrlParam("id");
    $("#menus").loadMenus("Category");
   
    //主列表加载，可反复调用进行刷新
    var config= {};  //table的参数，如搜索key，点击tree的id
    var mainList = function (options) {
        if (options != undefined) {
            $.extend(config, options);
        }
        table.reload('mainList', {
            url: '/Categories/All?page=1&limit=10&typeId=' + typeId,
            where: config
    , done: function (res, curr, count) {
        roles = id.split(",");
        for (var i = 0; i < res.data.length; i++) {
            for (var j = 0; j < roles.length; j++) {
                if (res.data[i].Id != roles[j]) continue;
                res.data[i]["LAY_CHECKED"] = true;
                var index = res.data[i]['LAY_TABLE_INDEX'];
                $('.layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                $('.layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
            }

        }
        //如果构成全选
        var checkStatus = table.checkStatus('mainList');
        if (checkStatus.isAll) {
            $('.layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', true);
            $('.layui-table-header th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');
        }
    }
        });
        var explorer = navigator.userAgent;
        if (explorer.indexOf("Firefox") >= 0) {
            $.tj.autoTableBody();
            $("#tree").height($("div.layui-table-view").height());
        }
    }
    //左边树状机构列表
    var ztree = function () {
        var url = '/Categories/AllTypes';
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
                    mainList({ typeId: treeNode.Id });
                }
            }
        };
        var load = function () {
            $.getJSON(url, function (json) {
                zTreeObj = $.fn.zTree.init($("#tree"), setting);
                zTreeObj.addNodes(null, json);
                mainList({ typeId: "" });
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
                },
                end: mainList
            });
            var url = "/Categories/Add";
            if (update) {
                url = "/Categories/Update"; //暂时和添加一个地址
            }
            //提交数据
            form.on('submit(formSubmit)',
                function(data) {
                    $.post(url,
                        data.field,
                        function(data) {
                            layer.msg(data.Message);
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
            openauth.del("/Categories/Delete",
                data.map(function (e) { return e.Id; }),
                mainList);
        },
        btnDelStock:function(){
        alert(1);
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
        , btnoks: function () {
            var checkStatus = table.checkStatus('mainList')
               , data = checkStatus.data;
            if (data.length == 0) {
                toplayer.msg("请选择权限");
                return;
            }
            var str = ""; 
            for (var i = 0; i < data.length; i++) {
                str += data[i].Id + ",";
            }
            window.parent.document.getElementById("DataAuthoritys").value = str;
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
    };

    $('.toolList .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //监听页面主按钮操作 end
})