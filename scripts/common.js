function checkAll(obj) {
    //console.log($(obj).parent().parent().parent().parent().children("tbody"), $(obj).parent().parent().parent().parent().children("tbody .chk:not(:disabled)"), $(".chk:not(:disabled)"))
    var $chk = $(".chk:not(:disabled)");
    var checked = $(obj).prop("checked");
    $chk.prop("checked", checked);
    if (checked) {
        $chk.parent().parent().addClass("seleted");
    } else {
        $chk.parent().parent().removeClass("seleted");
    }
}

function trSeleted(obj) {
    var $checkbox = $(obj).find("input[type='checkbox']");
    $checkbox.click();
    if ($checkbox.prop("checked")) {
        $(obj).addClass("seleted");
    } else {
        $(obj).removeClass("seleted");
    }
}

function modalEdit(url) {
    $(".modal-dialog").css("width", "");
    $(".modal-content").load(url + "?r=" + Math.random(), function (data) {
        try {
            var json = JSON.parse(data);
            location.href = json.url;
        } catch (e) {
        }
    });
}

function openModal(url, width) {
    $(".modal-dialog").css("width", width || "");
    $(".modal-content").load(url + (url.indexOf('?') > 0 ? "&r=" : "?r=") + Math.random(), function (data) {
        try {
            var json = JSON.parse(data);
            artAlert(json.info, json.url);
        } catch (e) {
            $('#responsive').modal({
                keyboard: false,
                backdrop: 'static'
            });
        }
    });
}

function openLoadModal(url, content, width) {
    $(".modal-dialog").css("width", width || "");
    var d = alertLoading(content || "正在打开...");
    d.showModal();
    $(".modal-content").load(url + (url.indexOf('?') > 0 ? "&r=" : "?r=") + Math.random(), function (data) {
        d.close().remove();
        try {
            var json = JSON.parse(data);
            artAlert(json.info, json.url);
        } catch (e) {
            $('#responsive').modal({
                keyboard: false,
                backdrop: 'static'
            });
        }
    });
}

function enterConfirm(e, callback) {
    var key = window.event ? e.keyCode : e.which;
    if (key == 13) {
        callback();
    }
}

function onKeyPressBlockNumbers(e) {
    var key = window.event ? e.keyCode : e.which;
    var keychar = String.fromCharCode(key);
    reg = /\d/;
    return reg.test(keychar);
}

function stopEventBubble(event) {
    var e = event || window.event;
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
    else {
        e.cancelBubble = true;
    }
}

function del(url) {
    if ($(".chk:checked").length === 0) return;
    var ids = "";
    $(".chk:checked").each(function () {
        ids += $(this).val() + ",";
    });
    var newUrl = url + "?ids=" + ids;
    artConfirm("是否删除?", newUrl);
}

function openUrl(url, obj) {
    var $obj = $(obj);
    $(".nav-item").removeClass("active");
    $obj.parent().addClass("active").parent().parent().addClass("active");
    $("#mainframe").attr("src", url);
}

function artConfirm(content, url) {
    var d = dialog({
        zIndex: 11000,
        title: '提示',
        content: content,
        okValue: '确定',
        fixed: true,
        ok: function() {
            if (url) location.href = url;
        },
        cancelValue: '取消',
        cancel: function() {}
    });
    d.showModal();
}

function artCallback(content, callback) {
    var d = dialog({
        zIndex: 11000,
        title: '提示',
        content: content,
        okValue: '确定',
        fixed: true,
        ok: callback,
        cancelValue: '取消',
        cancel: function () { }
    });
    d.showModal();
}

function artAlert(content, url) {
    var d = dialog({
        zIndex: 11000,
        title: '提示',
        content: content,
        okValue: '确定',
        skin:'min-dialog',
        fixed: true,
        ok: function () {
            if (url) location.href = url;
        }
    });
    d.showModal();
}

function alertLoading(info) {
    if (!info) info = "正在处理中...";
    return dialog({
        zIndex: 11000,
        fixed: true,
        content: "<img src='/Content/Images/loading.gif'/ style='padding-right: 5px;position: relative;bottom: 2px;'>" + info
    });
}

function alertClose(info) {
    var d = dialog({
        zIndex: 11000,
        content: info
    });
    d.show();
    setTimeout(function () {
        d.close().remove();
    }, 1000);
}
function block() {
    $(".modal").css({
        "display": "block"
    })
}
function flex() {
    $(".modal").css({
        "display": "flex",
        "justify-content": "center",
        "align-items": "center"
    })
}

$.fn.initValidate = function (rules, callback) {
    var checkValidate = function (formObj) {
        formObj.validate({
            onfocusout: function(element){
                $(element).valid();
            },
            rules: rules,
            errorPlacement: function (error, element) {
                element.parent().find(".help-block").append(error);
            },
            ignore: "",
            submitHandler: function (form) {
                if (!formObj.valid()) return false;
                var d = alertLoading();
                $.ajax({
                    type: "post",
                    url: $(form).attr("action"),
                    data: $(form).serialize(),
                    dataType: "json",
                    timeout:1000*60,
                    beforeSend: function () {
                        formObj.find(":submit").prop("disabled", true);
                        d.showModal();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (textStatus === "timeout") {
                            artAlert("处理超时，请重试");
                        }
                        d.close().remove();
                        formObj.find(":submit").prop("disabled", false);
                    },
                    success: function (data) {
                        if (data.status === "y") {
                            if (callback) callback();
                            else location.reload();
                        } else {
                            if (data.url) location.href = data.url;
                            else artAlert(data.info);
                        }
                        d.close().remove();
                        formObj.find(":submit").prop("disabled", false);
                    }
                });
                return false;
            }
        });
    };
    return checkValidate(this);
};
