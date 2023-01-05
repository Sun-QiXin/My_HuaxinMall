$(function () {
    // 购物车js代码
    $(".Shopping").hover(function () {
        $(".Shopping").css({
            background: "white",
            "text-decoration": "none",
            "color": "#ff6700",
            "opacity": 1
        });
        $(".Shopping-text").stop().slideDown(500);
    }, function () {
        $(".Shopping").css({
            background: "#333",
            color: "#fff",
            "opacity": 0.5
        });
        $(".Shopping-text").stop().slideUp(500);
    })

    $(".Shopping-text").hover(function () {
        $(".Shopping").css({
            background: "white",
            "text-decoration": "none",
            "color": "#ff6700",
            "opacity": 1
        });
        $(".Shopping-text").stop().slideDown();
    }, function () {
        $(".Shopping").css({
            background: "#333",
            color: "#fff",
            "opacity": 0.5
        });
        $(".Shopping-text").stop().slideUp(500);
    })

    // 搜索框获得焦点清空内容
    $("#search-input").focus(function () {
        $(this).get(0).placeholder = "";
    })
    $("#search-input").blur(function () {
        $(this).get(0).placeholder = "输入要搜索的内容";
    })

    // 导航栏角标旋转
    let lis = $("#nav-center>li");
    $.each(lis, function (index, value) {
        $(value).hover(function () {
            $("#nav-center li a span").get(index).innerHTML = "&#xe6b1;";
        }, function () {
            $("#nav-center li a span").get(index).innerHTML = "&#xe6b2;";
        })
    });

    //监听点击汉堡图标
    let count = 1;
    $(".shrink>span").click(function () {
        $(".shrink .shrink-panel").stop().fadeToggle(500);
        if (count == 1) {
            $(".shrink>span").get(0).innerHTML = "&#xe7b4;";
        }
        $(".shrink .shrink-panel").toggleClass("shrink-panel2");
        if (count == 2) {
            $(".shrink>span").get(0).innerHTML = "&#xe643;";
            count = 0;
        }
        count++;
    });

    // 监听导航栏鼠标移入移出事件
    let liElt = $("#nav-center li");
    let ulElt = $(".drop-down");
    $.each(liElt, function (index, value) {
        $(value).hover(function () {
            $(ulElt[index]).stop().slideDown(500);
            $(ulElt[index]).addClass("drop-down2");
        }, function () {
            $(ulElt[index]).stop().slideUp(500, function () {
                $(ulElt[index]).removeClass("drop-down2");
            });
        })
    });

    $.each(ulElt, function (index2, value2) {
        let liElt = $("#nav-center li a");
        let liElt_span = $("#nav-center li a span");
        $(value2).hover(function () {
            $(ulElt[index2]).stop();
            $(liElt_span[index2]).get(0).innerHTML = "&#xe6b1;"
            $(liElt[index2]).css({
                color: "#ff6700",
                "text-decoration": "none"
            })
        }, function () {
            $(ulElt[index2]).stop().slideUp(500, function () {
                $(ulElt[index2]).removeClass("drop-down2");
                $(liElt[index2]).css({
                    color: "#000000"
                })
                $(liElt_span[index2]).get(0).innerHTML = "&#xe6b2;"
            });
        })
    })

    // 监听右侧下载APP事件
    $(".service div:first-child").hover(function () {
        $(".my-Wei-Xin").stop().fadeIn(300);
        $(".my-Wei-Xin").css("display", "block");
    }, function () {
        $(".my-Wei-Xin").stop().fadeOut(300), function () {
            $(".my-Wei-Xin").css("display", "none");
        };
    });

    //监听页面滑动显示回到顶部图标
    $(window).scroll(function () {
        // 1.1获取网页滚动的偏移位
        let offset = $("html,body").scrollTop();
        // 1.2判断网页是否滚动到了指定的位置
        if (offset >= 550) {
            // 1.3显示
            $(".service div:last-child").show(1000);
        } else {
            // 1.4隐藏
            $(".service div:last-child").hide(1000);
        }
    });

    //监听点击回到顶部图标
    $(".service div:last-child").click(function () {
        // 1.1获取网页滚动的偏移位
        let offset = $("html,body").scrollTop();
        let timer = setInterval(function () {
            offset -= 10;
            $("html,body").scrollTop(offset);
            if (offset <= 0) {
                clearInterval(timer);
            }
        }, 1);
    });
    //商品选购页选择颜色按钮点击
    let span5Elt1 = $(".Commodity-details .p6 .span5")
    let span5Elt2 = $(".Commodity-details .p6 .span6")
    let span5Elt3 = $(".Commodity-details .span7")
    let span5Elt4 = $(".Commodity-details .span8")
    let span5Elt5 = $(".Commodity-details .p8")
    span5Elt1.click(function () {
        $(this).css({
            border: "1px solid #ff6700"
        });
        span5Elt2.css({
            border: "0px solid #ff6700",
            border: "1px solid #BBB"
        })
        span5Elt3.text("白色");
        span5Elt4.text("6999元");
        span5Elt5.text("总计：6999元");
    });
   span5Elt2.click(function () {
        $(this).css({
            border: "1px solid #ff6700"
        });
        span5Elt1.css({
            border: "0px solid #ff6700",
            border: "1px solid #BBB"
        })
       span5Elt3.text("黑色");
       span5Elt4.text("7199元");
       span5Elt5.text("总计：7199元");
    });

   //监听喜欢按钮点击事件
    $(".Commodity-details-3 .button2").click(function () {
        $(".Commodity-details-3 .button2 span:first-child").toggleClass("span_cor");
    })

    //Logo1点击事件
    let logo = $(".myNav .Logo1");
    logo.click(function () {
        window.open("index","_self");
    })

    //退出按钮
    $("#loginLi").hover(function () {
        $("#exit").stop().slideDown(500,function () {
            $("#exit").css({
                display:"block"
            })
        })
    },function () {
        $("#exit").stop().slideUp(500,function () {
            $("#exit").css({
                display:"none",
            })
        });
    })


    //获取Session里面存储的登录信息
    $.extend({
        LoginMsg: function () {
            $.post("user/loginMsg", function (data) {
                if (data != undefined && data != null && data != "") {
                    //只有当用户登录了才显示退出按钮
                    $("#phoneExit").css("display","block");

                    // 设置登录时的用户名
                    $("#loginMsg").html("&#xe60f;" + data.username);
                    $("#loginMsg").css({
                        color: "#ff6700",
                        opacity: 0.8
                    });
                }else {
                    $("#phoneExit").css("display","none");
                }
            })
        }
    });
    $.LoginMsg();
});