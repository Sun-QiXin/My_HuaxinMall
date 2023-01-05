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

    /*// 验证输入的账号密码是否是我们指定的
    let myToast1 = $('#myToast');
    let myToast2 = $('#myToast2');
    // 动画初始设置
    myToast1.toast({
        autohide: true,
        delay: 1000
    })
    myToast2.toast({
        autohide: true,
        delay: 1000
    })
    // 阻止表单的默认提交事件
    $("form").submit(function () {
        return false;
    })

    $("#btn").click(function () {
        let username = $("#userName .userName").val();
        // trim：去除前后空白
        username = username.trim();
        let password = $("#pwd").val();
        if (username != "" && password != "") {
            if (username == 15153869872 && password == 123456) {
                // open:打开一个页面
                myToast1.toast('show');
                setTimeout(function () {
                    window.open("index.html", "_self");
                }, 1000)
            } else {
                myToast2.toast('show');
            }
        }
    });*/

    //bootstrap的提示框初始设置
    let myToast = $('#myToast');
    // 动画初始设置
    myToast.toast({
        autohide: true,
        delay: 1000
    });

    //获取验证码按钮的监听
    $("#getEmailCode").click(function () {
        if ($("#emailText").val() !== undefined && $("#emailText").val() !== "") {
            let reg = "^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$";
            if ($("#emailText").val().match(reg)) {
                $("#tipsMsg").html("邮件已发送！")
                //显示提示框
                myToast.toast("show");

                //按钮不可点击
                $("#getEmailCode").css("pointer-events", "none");
                //定义个计时器
                let times = 30;
                let time = setInterval(function () {
                    $("#getEmailCode").css({
                        "font-size": "12px"
                    });
                    $("#getEmailCode").html(times-- + "秒后可再次发送");
                    if (times <= 0) {
                        window.clearInterval(time);
                        $("#getEmailCode").html("点击再次获取验证码");
                        $("#getEmailCode").css("pointer-events", "all");
                    }
                }, 1000);

                $.post("user/generateEmailCode", {email: $("#emailText").val()}, function () {
                    //发送邮件
                })
            } else {
                $("#tipsMsg").html("邮箱格式不正确！")
                //显示提示框
                myToast.toast("show");
            }

        } else {
            $("#tipsMsg").html("邮箱不可以为空！")
            //显示提示框
            myToast.toast("show");
        }

        //点击获取验证码按钮时，不触发提交表单事件
        return false;
    });

    //表单提交事件
    //使用submit提交表单时，页面会刷新，由于发送的是异步请求，所以获取不到服务器返回的数据，所以提交时不刷新页面就好
    $("#userRetrieveFrom").submit(function () {
        let newPassword = $("#newPassword").val();
        let confirmPassword = $("#confirmPassword").val();
        if (newPassword === confirmPassword && newPassword !== "" && confirmPassword !== "") {
            $.post("user/userRetrieve", $(this).serialize(), function (msg) {
                switch (msg) {
                    case "1":
                        $("#tipsMsg").html("密码修改成功！，请使用新密码登录！")
                        //显示提示框
                        myToast.toast("show");

                        let msg = setTimeout(function () {
                            window.open("UserLogin.html", "_self");
                            window.clearTimeout(msg);
                        }, 1200);
                        break;
                    case "2":
                        $("#tipsMsg").html("密码修改失败！，该邮箱下没有用户存在！")
                        //显示提示框
                        myToast.toast("show");
                        break;
                    case "3":
                        $("#tipsMsg").html("输入的验证码不正确！")
                        //显示提示框
                        myToast.toast("show");
                        break;
                }
            })
        } else if (newPassword === "" || confirmPassword === "") {
            $("#tipsMsg").html("密码不能为空！")
            //显示提示框
            myToast.toast("show");
            return false;
        } else {
            $("#tipsMsg").html("两次密码输入不一致！")
            //显示提示框
            myToast.toast("show");
            return false;
        }
    });
});
