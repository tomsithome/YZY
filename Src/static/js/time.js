$(document).ready(function() {
    // 时实更新
    function time() {
	    var date = new Date();
	    var n = date.getFullYear();
	    var y = date.getMonth() + 1;
	    var t = date.getDate();
	    var h = date.getHours();
	    var m = date.getMinutes();
	    var s = date.getSeconds();

	    $('.sj span').eq(0).html(n);
	    $('.sj span').eq(1).html(y);
	    $('.sj span').eq(2).html(t);
	    $('.sj span').eq(3).html(h);
	    $('.sj span').eq(4).html(m);
	    $('.sj span').eq(5).html(s);
	    for (var i = 0; i < $('div.sj>span').length; i++) {
	        if ($('div.sj>span').eq(i).text().length == 1) {
	            $('div.sj>span').eq(i).html(function (index, html) {
	                return 0 + html;
	            });
	        }
	    }
	}
	time();
	setInterval(time, 1000);
            
	function currentTime(t) {
	    var date = new Date();
	    date.setMinutes(date.getMinutes() - t);
	    var current = date.toLocaleString();
	    current.substring(12, 17);
	    current = current.split("午");
	    var currentT = current[1].split(":");
	    return currentT[0] + ':' + currentT[1];
	}

	$(document).on("click", ".monitor_head_left>img", function () {
	    window.location.href = "/home/index";
	})
});