$("#AddUserOpear").hide();
$("#AddUserCount").hide();
    layui.use('form', function () {
        var form = layui.form;
        form.render();

        form.on('radio', function (data) {
            if (data.value == 1) {
                $(".ShareResource").attr("disabled", true);
                $(".ResourceCharac").attr("disabled", false);
            } else if (data.value == 2) {
                $(".ResourceCharac").attr("disabled", true);
                $(".ShareResource").attr("disabled", false);
            }
        });

    });
    
    _init_area();
    GetUsersList();
    GetResourceList();
    var strName = /^[\u4E00-\u9FA5]{1,6}$/,
        strTelPhone = /^[1][3,4,5,7,8][0-9]{9}$/,
        regemail = /\w+[@@]{1}\w+[.]\w+/,
        regPWD = /^[0-9a-zA-Z_]{6,15}$/;

    $("#AddUserSchool>.modal-body-footer>button.btn-success").on("click", function () {
        if ($("#UnitName").val().replace(/(^\s*)|(\s*$)/g, "") == "") {
            $("#UnitName").siblings(".text-danger").html("必选字段")
        } else if ($("#s_province").val() == "") {
            $("#s_province").siblings(".text-danger").html("必选字段")
        } else if ($("#CustomName").val() == "") {
            $("#CustomName").last().siblings(".text-danger").html("必选字段")
        } else if ($("#CustomPhone").val() == "") {
            $("#CustomPhone").siblings(".text-danger").html("必选字段")
        } else if (!$("#UnitName").siblings(".text-danger").html() && !$("#s_province").siblings(".text-danger").html() && !$("#CustomName").siblings(".text-danger").html() && !$("#CustomPhone").siblings(".text-danger").html()) {
            $("#AddUserSchool").hide();
            $("#AddUserOpear").show();
        }
    })
    $("#AddUserOpear>.modal-body-footer>button.btn-success").on("click", function () {
        if ($("#TechnicalPerson").val() == null) {
            $("#TechnicalPerson").siblings(".text-danger").html("必选字段")
        } else if ($("#TechnicalEmail").val() == "") {
            $("#TechnicalEmail").siblings(".text-danger").html("必选字段")
        } else if ($("#TechnicalPhone").val() == "") {
            $("#TechnicalPhone").last().siblings(".text-danger").html("必选字段")
        } else if (!$("#TechnicalPerson").siblings(".text-danger").html() && !$("#TechnicalEmail").siblings(".text-danger").html() && !$("#TechnicalPhone").siblings(".text-danger").html() &&
            !$("#Email_From").siblings(".text-danger").html() && !$("#Email_Pwd").siblings(".text-danger").html() && !($("#Email_Tos").siblings(".text-danger").html() == "请输入正确的邮箱地址")) {
            $("#Email_Pwd").siblings(".text-danger").html("")
            $("#AddUserOpear").hide();
            $("#AddUserCount").show();
        }
    })
    $("#AddUserOpear>.modal-body-footer>button.btn-default").on("click", function () {
        $("#AddUserOpear").hide();
        $("#AddUserSchool").show();
    })
    $("#AddUserCount>.modal-body-footer>button.btn-default").on("click", function () {
        $("#AddUserCount").hide();
        $("#AddUserOpear").show();
    })

    blurInput("UnitName");
    blurInput("s_province");
    blurInputName("CustomName");
    blurInputTelPhone("CustomPhone");
    blurInputNum("ConcurrencyNum");

    blurInput("TechnicalPerson");
    blurInputEmail("TechnicalEmail");
    blurInputTelPhone("TechnicalPhone"); 
    blurInputPWD("Email_Pwd");
    blurEmail("Email_From");

    blurInput("LoginUser");
    blurInputPWD("LoginPass");
    blurInput("ReLoginPass");
    function blurInput(ele) {
        $("#" + ele).on("blur", function () {
            if ($(this).val().replace(/(^\s*)|(\s*$)/g, "") == "") {
                $(this).siblings(".text-danger").html("必选字段")
                return false;
            } else {
                $(this).siblings(".text-danger").html("")
            }
        })
    }
    function blurInputName(ele) {
        $("#" + ele).on("blur", function () {
            if ($(this).val() == "") {
                $(this).siblings(".text-danger").html("必选字段")
                return false;
            } else if (!strName.test($(this).val())) {
                $(this).siblings(".text-danger").html("请输入正确的姓名")
                return false;
            } else {
                $(this).siblings(".text-danger").html("")
            }
        })
    }
    function blurInputTelPhone(ele) {
        $("#" + ele).on("blur", function () {
            if ($(this).val() == "") {
                $(this).siblings(".text-danger").html("必选字段")
                return false;
            } else if (!strTelPhone.test($(this).val())) {
                $(this).siblings(".text-danger").html("请输入正确的手机号码")
                return false;
            } else {
                $(this).siblings(".text-danger").html("")
            }
        })
    }
    function blurInputEmail(ele) {
        $("#" + ele).on("blur", function () {
            if ($(this).val() == "") {
                $(this).siblings(".text-danger").html("必选字段")
                return false;
            } else if (!regemail.test($(this).val())) {
                $(this).siblings(".text-danger").html("请输入正确的邮箱地址")
                return false;
            } else {
                $(this).siblings(".text-danger").html("")
            }
        })
    }
    function blurEmail(ele) {
        $("#" + ele).on("blur", function () {
            if ($(this).val() == "") {
                $(this).siblings(".text-danger").html("")
                return false;
            } else if (!regemail.test($(this).val())) {
                $(this).siblings(".text-danger").html("请输入正确的邮箱地址")
                return false;
            } else {
                $(this).siblings(".text-danger").html("")
            }
        })
    }
    function blurInputPWD(ele) {
        $("#" + ele).on("blur", function () {
            if ($(this).val() == "") {
                $(this).siblings(".text-danger").html("必选字段")
                return false;
            } else if (/.*[\u4E00-\u9FA5].*/.test($(this).val()) || $(this).val().length < 6 || $(this).val().length > 15) {
                $(this).siblings(".text-danger").html("请输入正确的密码")
                return false;
            } else {
                $(this).siblings(".text-danger").html("")
            }
        })
    }
    function blurPWD(ele) {
        $("#" + ele).on("blur", function () {
            if ($(this).val() == "") {
                $(this).siblings(".text-danger").html("")
                return false;
            } else if (!regPWD.test($(this).val())) {
                $(this).siblings(".text-danger").html("请输入正确的密码")
                return false;
            } else {
                $(this).siblings(".text-danger").html("")
            }
        })
    }
    function blurInputNum(ele) {
        $("#" + ele).on("blur", function () {
            if ($(this).val() < 0) {
                $(this).val("0")
                return false;
            }
        })
    }

    $("#UnitName").on("blur", function () {
        var that = $(this);
        $.ajax({
            type: "post",
            url: "/Customer/SelectList",
            async: false,
            dataType: "json",
            success: function (data) {                
                data.data.forEach(function (val) {
                    console.log(val.UnitName)
                    if ($("#UnitName").val() == val.UnitName) {
                        that.siblings(".text-danger").html("单位名称和已有的不能重复!")
                    } else {
                        that.siblings(".text-danger").html("")
                    }
                })
            }
        });
    })

    $(".ShareResource").on("focus", function () {
        $("#Email_From").val(""); 
        $("#Email_Pwd").val("");
        var toplayer = (top == undefined || top.layer === undefined) ? layer : top.layer;  //顶层的LAYER
        var index = toplayer.open({
            title: "选择分享范围",
            type: 2,
            area: ['850px', '500px'],
            content: "/customer/Share",
            success: function (layero, index) {

            }
        });
    })

    $("#Email_Tos").on("blur", function () {
        $("#Email_Tos").val().split(",").forEach(function (val) {
            if (!regemail.test(val)) {
                $("#Email_Tos").siblings(".help-block").html("请输入正确的邮箱地址")
            } else {
                $("#Email_Tos").siblings(".help-block").html("多个邮箱用逗号（,）隔开")
            }
        })
    })



    var rules = {
        UnitName: {
            required: true
        },
        ConcurrencyNum: {
            required: true,
            digits: true
        },
        TechnicalEmail: {
            email: true
        },
        LoginUser: {
            required: true
        },
        LoginPass: {
            required: true,
            rangelength: [6, 20]
        },
        ReLoginPass: {
            equalTo: "#LoginPass"
        },
        Email_From: {
            email: true
        }
    };
    $("#form").initValidate(rules);


function submitUser() {
    if ($("#LoginUser").val() == "") {
        $("#LoginUser").siblings(".text-danger").html("必选字段")
    } else if ($("#LoginPass").val() == "") {
        $("#LoginPass").siblings(".text-danger").html("必选字段")
    } else if ($("#ReLoginPass").val() == "") {
        $("#ReLoginPass").siblings(".text-danger").html("必选字段")
    } else if ($("#ReLoginPass").val() != $("#LoginPass").val()) {
        $("#LoginPass").siblings(".text-danger").html("两次密码不一致")
    } else if (!$("#LoginUser").siblings(".text-danger").html() && !$("#LoginPass").siblings(".text-danger").html() && !$("#ReLoginPass").siblings(".text-danger").html()) {
        var datas = "", singleData = "";
        $('#formAddUser').serialize().split("&").forEach(function (val) {
            if (!$(".layui-form-radio").hasClass("layui-form-radioed") && val.indexOf("ResourceId") == 0) {
                val = ""
            }
            if (!$(".layui-form-radio").hasClass("layui-form-radioed") && val.indexOf("ShareResource") == 0) {
                val = ""
            }
            if (val == "Actived=on") {
                val = "Actived=False"
            }
            if (val.indexOf("Actived") < 0) {
                singleData = "Actived=True&"
            } else {
                singleData = "";
            }
            if (val == "shareR=1" || val == "shareR=2") {
                val = "";
            } else {
                datas = datas + val + "&";
            }                 
        })
        datas = "TechnicalPersonId=" + $("#TechnicalPerson").find("option:selected").attr("valId") + "&" + datas + singleData;
        datas = datas.substring(0, datas.length - 1)
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/Customer/AddUser",//url
            data: datas,
            success: function (result) {                
                if (result.status == "y") {
                    artAlert(result.info);
                    $(".modal-header>.close").click();
                    showList(1);
                }
                if (result.status == "n") {
                    alertClose(result.info);
                }
            },
            error: function () {
                artAlert("请重新操作");
            }
        });
    }
}

function GetUsersList() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/Home/GetUsersList",
        success: function (data) {
            console.log(data);
            var str,strs="";
            data.forEach(function (val) {
                str = "<option valId=" + val.id + ">" + val.name + "</option>";
                strs += str;
            })
            $("#TechnicalPerson").html(strs);
            $("#TechnicalPerson").val("");
        },
        error: function () {
            console.log("技术负责人error");
        }
    });
}

function GetResourceList() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/Home/GetResourceList",
        success: function (data) {
            var str, strs = "";
            data.forEach(function (val) {
                str = "<option>" + val.Id + "</option>";
                strs += str;
            })
            $(".ResourceCharac").html(strs);
        },
        error: function () {
            console.log("技术负责人error");
        }
    });
}

