//(function ($) {//监控页面的Table间断滚动
//    var status = false,
//        tableScrollTime = $.tj.GetTimeSet("tableScrollTime");
//    $.fn.scrollQ = function (options) {
//        var defaults = {
//            line: 4,
//            scrollNum: 4,
//            scrollTime: tableScrollTime
//        }
//        var options = jQuery.extend(defaults, options);
//        var _self = this;
//        return this.each(function () {
//            function scroll() {
//                for (i = 0; i < options.scrollNum; i++) {
//                    //console.log(_self)
//                    var start = $("tr:first", _self);
//                    start.appendTo(_self);
//                }
//            }
//            var timer;
//            timer = setInterval(scroll, options.scrollTime);
//            _self.bind("mouseover", function () {
//                clearInterval(timer);
//            });
//            _self.bind("mouseout", function () {
//                timer = setInterval(scroll, options.scrollTime);
//            });

//        });
//    }
//})(jQuery);


(function ($) {//监控页面的Table无隙滚动
    var tblTop = 0, anifun;
    $.fn.extend({
        "scrollQ": function (value) {
            clearInterval(anifun);
            var docthis = this, tableScrollTime = $.tj.GetTimeSet("tableScrollTime");
            //默认参数
            value = $.extend({
                "time": tableScrollTime
            }, value)
            //向上滑动动画            
            var _self = this;
            var tbodyHeight = $(".mc_c .layui-table>tbody").height() + 39;
            $(".mc_c .layui-table>tbody").attr("id", "table1");
            $(".mc_c .layui-table>tbody").html($(".mc_c .layui-table>tbody").html() + $(".mc_c .layui-table>tbody").html());
            anifun = setInterval(autoani, value.time);            
            function autoani() {                
                var start = $("tr:first", _self);                
                if (tblTop <= -tbodyHeight) {
                    tblTop = 0;
                } else {
                    tblTop -= 1;                
                }
                $("#table1").css({ "top": tblTop })
            }
            //自动间隔时间向上滑动
        }
    })
})(jQuery)



