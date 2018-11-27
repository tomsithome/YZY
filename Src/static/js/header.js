loadConfig();

function loadConfig() {
    var data = $.tj.loadTabAutority();
    var string = "", str, uls, aUls = "";
    data.forEach(function (vals) {
        if (vals.Item.Name == "业务管理") {
            str = "";
        } else {
            str = '<dd><a href= "javascript:void(0)">' + vals.Item.Name + ' ></a>';
        }
        string += str;
        aUls = "";
        vals.Children.forEach(function (val) {
            if (val.Item.Name == "监控中心数据列表" || val.Item.Name == "接入用户管理列表" || val.Item.Name == "任务策略设置") {
                uls = '';
            } else {
                uls = '<li><a href="javascript:void(0)" id="' + val.Item.Id + '"><i class="layui-icon">' + val.Item.IconName + '</i>' + val.Item.Name + '</a></li>';
            }
            aUls += uls;
            goToFrame(val.Item.Id, val.Item.Url)
        })
        aUls = '<ul>' + aUls + '</ul>';
        string = string + aUls + '</dd>';
    })
    $("#navSysConfig").html(string);
    $(".layui-nav .layui-nav-child dd ul").css({
        "left": ($(".layui-nav .layui-nav-child").width() + 1)
    })
}

layui.use('element', function () {
    var element = layui.element, //导航的hover效果、二级菜单等功能，需要依赖element模块
           form = layui.form;
    //监听导航点击
    element.on('nav(demo)', function (elem) {
        layer.msg(elem.text());
    });
    $(document).on("click", ".header>div:first-child>img", function () {
        $("#mainframe").attr("src", "/home/Newmain");
    })
    goToFrame("homeMain", "/home/Main")
    goToFrame("CustomerIndex", "/Customer/Index")
    goToFrame("homeNewmain", "/home/Newmain")
    goToFrame("HomeLogout", "/home/Logout")
   
    $(document).on("click", "#navSysConfig a", function () {
        $(".layui-nav > li").removeClass("layui-this");
        $(".layui-nav > li:nth-child(3)").addClass("layui-this");
    })
    $("#HomeLogout").mouseover(function () {
        $(".icon_exit").css({
            "background": "url(../Src/static/img/icon/icon_exit_hover.png) no-repeat",
            "background-size": "100% 100%",
            "width": "0.25rem",
            "height": "0.25rem"
        })
    }).mouseout(function () {
        $(".icon_exit").css({
            "background": "url(../Src/static/img/icon/icon_exit.png) no-repeat",
            "background-size": "100% 100%",
            "width": "0.25rem",
            "height": "0.25rem"
        })
    })
    $("#ResetPassword").mouseover(function () {
        $(".icon_ResetP").css({
            "background": "url(../Src/static/img/icon/icon_exit_hover.png) no-repeat",
            "background-size": "100% 100%",
            "width": "0.25rem",
            "height": "0.25rem"
        })
    }).mouseout(function () {
        $(".icon_ResetP").css({
            "background": "url(../Src/static/img/icon/icon_exit.png) no-repeat",
            "background-size": "100% 100%",
            "width": "0.25rem",
            "height": "0.25rem"
        })
    })
});

function goToFrame(ele, url) {
    $(document).on("click", "#" + ele, function () {
        $("#mainframe").attr("src", url)
    })
}

$(document).on("click", "#ResetPassword", function () {
    $("#mainframe").attr("src", "/UserManager/ResetPassword");
})


