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
    })

    //监听密码框获得焦点事件，回车登录
    $(".password").focus(function () {
        $(this).keyup(function (e) {
            if (e.keyCode == 13) {
                $("#btn").triggerHandler("click");
            }
        })
    });

    //获取服务器返回的数据
    $("#btn").click(function () {
        //获取提交的数据
        let userName = $(".userName").val();
        //去掉前后空格
        userName = userName.trim();
        let password = $(".password").val();
        $.post("user/login", {username: userName, password: password}, function (data) {
            if (data != null && data !== "" && data !== "null") {
                $("#tipsMsg").html("登录成功,欢迎您:" + data.username + "");
                myToast.toast("show");
                //一秒后打开主界面
                setTimeout(function () {
                    window.open("index", "_self");
                }, 1000);
            } else {
                $("#tipsMsg").html("账号/密码错误,请重新登录！");
                myToast.toast("show");
            }
        })
    });
});
