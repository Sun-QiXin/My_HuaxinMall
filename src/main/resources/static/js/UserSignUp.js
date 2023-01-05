$(function () {
    //触发onfocus事件，给所有input元素添加focus类名
    $(".input input").focus(function () {
        $(this)
            .parent()
            .addClass("focus");
    });
    // 触发onblur事件，当元素失去焦点时发生 blur 事件。
    // val() 方法返回或设置被选元素的值。
    $(".input input").blur(function () {
        if ($(this).val() === "")
            $(this)
                .parent()
                .removeClass("focus");
    });

    //bootstrap的提示框初始设置
    let myToast = $('#myToast');
    // 动画初始设置
    myToast.toast({
        autohide: true,
        delay: 1000
    });

    //扩展一个JQuery全局方法
    $.extend({
        check: function () {
            let password = $("#pwd").val();
            let repeat = $("#req").val();
            let userName = $("#name").val();
            let email = $("#ema").val();
            //2.获取用户名长度
            let nameLength = userName.length;

            if (password == "" || repeat == "" || userName == "" || email == "") {
                $("#tipsMsg").html("所有字段不允许有空值！")
                myToast.toast("show");
                return false;
            } else {
                if (nameLength >= 2 && nameLength <= 11) {

                }else {
                    $("#tipsMsg").html("用户名长度2~11位！")
                    myToast.toast("show");
                    return false;
                }
                if (password == repeat) {
                    //符合就会提交
                } else {
                    $("#tipsMsg").html("您两次输入的密码不一致！")
                    myToast.toast("show");
                    return false;
                }
            }
        }
    });


    //获取服务器返回的数据,需要单独引js包
    $("#signUpForm").ajaxForm(function (data) {
        data = data.replace(/"|'/g,"");
        if (data === "true") {
            $("#tipsMsg").html("恭喜您注册成功！")
            //显示提示框
            myToast.toast("show");
            setTimeout(function () {
                location.href = "UserLogin.html";
            }, 1000)
        } else {
            $("#tipsMsg").html("注册失败,用户名/邮箱已存在！");
            myToast.toast("show");
        }
    })
});
