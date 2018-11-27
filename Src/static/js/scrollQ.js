(function ($) {//首页的Table自滚动
    var status = false,
        exceptionScrollTime = $.tj.GetColorAndTimeSet("exceptionScrollTime");
    $.fn.scrollQ = function (options) {
        var defaults = {
            line: 4,
            scrollNum: 4,
            scrollTime: exceptionScrollTime /15
        }
        var options = jQuery.extend(defaults, options);
        var _self = this;

        var tbodyHeight = $(".mcrcl_c>div").height(), tblTop = 0;
        //$(".mcrcl_c>div").html($(".mcrcl_c>div").html() + $(".mcrcl_c>div").html())
        console.log(_self, tbodyHeight)
        return this.each(function () {
            function scroll() {
                //for (i = 0; i < options.scrollNum; i++) {
                //    var start = $("h5:first", _self);
                //    start.appendTo(_self);
                //}
                if (tblTop <= -tbodyHeight) {
                    tblTop = 0;
                } else {
                    tblTop -= 1;
                }
                $(".mcrcl_c>div").css({ "margin-top": tblTop })
            }
            var timer;
            timer = setInterval(scroll, options.scrollTime);
            _self.bind("mouseover", function () {
                clearInterval(timer);
            });
            _self.bind("mouseout", function () {
                timer = setInterval(scroll, options.scrollTime);
            });

        });
    }
})(jQuery);