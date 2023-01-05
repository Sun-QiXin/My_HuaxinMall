$(function () {
    // 0.自定义滚动条
    $(".content_list").mCustomScrollbar();

    let $audio = $("audio");
    let player = new Player($audio);
    let progress;
    let voiceProgress;
    let lyric;

    // 1.加载歌曲列表
    getPlayerList();

    function getPlayerList() {
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function (data) {
                player.musicList = data;
                // 3.1遍历获取到的数据, 创建每一条音乐
                let $musicList = $(".content_list ul");
                $.each(data, function (index, ele) {
                    let $item = crateMusicItem(index, ele);
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
            },
            error: function (e) {
                console.log(e);
            }
        });
    }

    // 2.初始化歌曲信息
    function initMusicInfo(music) {
        // 获取对应的元素
        let $musicImage = $(".song_info_pic img");
        let $musicName = $(".song_info_name a");
        let $musicSinger = $(".song_info_singer a");
        let $musicAblum = $(".song_info_ablum a");
        let $musicProgressName = $(".music_progress_name");
        let $musicProgressTime = $(".music_progress_time");
        let $musicBg = $(".mask_bg");
        let $musicBg2 = $(".mask");

        // 给获取到的元素赋值
        $musicImage.attr("src", music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProgressName.text(music.name + " / " + music.singer);
        $musicProgressTime.text("00:00 / " + music.time);
        $musicBg.css({
            background: "url(" + music.cover + ") no-repeat 0 0",
            "background-size": "cover",
            "z-index": -2,
            opacity: 0.5
        });
        $musicBg2.css({
            position: "absolute",
            left: 0,
            top: 0,
            "z-index": -1,
            background: "rgba(0, 0, 0,0.5)"
        });
    }

    // 3.初始化歌词信息
    function initMusicLyric(music) {
        lyric = new Lyric(music.link_lrc);
        let $lryicContainer = $(".song_lyric");
        // 清空上一首音乐的歌词
        $lryicContainer.html("");
        lyric.loadLyric(function () {
            // 创建歌词列表
            $.each(lyric.lyrics, function (index, ele) {
                let $item = $("<li>" + ele + "</li>");
                $lryicContainer.append($item);
            });
        });
    }

    // 4.初始化进度条
    initProgress();

    function initProgress() {
        let progressBar = $(".music_progress_bar");
        let progressLine = $(".music_progress_line");
        let progressDot = $(".music_progress_dot");
        progress = new Progress(progressBar, progressLine, progressDot);
        progress.progressClick(function (value) {
            player.musicSeekTo(value);
        });
        progress.progressMove(function (value) {
            player.musicSeekTo(value);
        });

        let voiceBar = $(".music_voice_bar");
        let voiceLine = $(".music_voice_line");
        let voiceDot = $(".music_voice_dot");
        voiceProgress = Progress(voiceBar, voiceLine, voiceDot);
        voiceProgress.progressClick(function (value) {
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressMove(function (value) {
            player.musicVoiceSeekTo(value);
        });
    }

    // 5.初始化事件监听
    initEvents();

    function initEvents() {
        // 1.监听歌曲的移入移出事件
        $(".content_list").delegate(".list_music", "mouseenter", function () {
            // 显示子菜单
            $(this)
                .find(".list_menu")
                .stop()
                .fadeIn(100);
            $(this)
                .find(".list_time a")
                .stop()
                .fadeIn(100);
            // 隐藏时长
            $(this)
                .find(".list_time span")
                .stop()
                .fadeOut(100);
        });
        $(".content_list").delegate(".list_music", "mouseleave", function () {
            // 隐藏子菜单
            $(this)
                .find(".list_menu")
                .stop()
                .fadeOut(100);
            $(this)
                .find(".list_time a")
                .stop()
                .fadeOut(100);
            // 显示时长
            $(this)
                .find(".list_time span")
                .stop()
                .fadeIn(100);
        });

        // 3.添加子菜单播放按钮的监听
        let $musicPlay = $(".music_play");
        $(".content_list").delegate(".list_menu_play", "click", function () {
            let $item = $(this).parents(".list_music");

            // get(0):取得一个实际的DOM 元素并且对他直接操作
            // console.log($item.get(0).index);
            // console.log($item.get(0).music);

            // 3.1切换播放图标
            $(this).toggleClass("list_menu_play2");
            // 3.2复原其它的播放图标
            $item
                .siblings()
                .find(".list_menu_play")
                .removeClass("list_menu_play2");
            // 3.3同步底部播放按钮
            if ($(this).hasClass("list_menu_play2")) {
                // 当前子菜单的播放按钮是播放状态
                $musicPlay.addClass("music_play2");
                // 让文字高亮
                $item.find("div").css("color", "#fff");
                $item
                    .siblings()
                    .find("div")
                    .css("color", "rgba(255,255,255,0.5)");
            } else {
                // 当前子菜单的播放按钮不是播放状态
                $musicPlay.removeClass("music_play2");
                // 让文字不高亮
                $item.find("div").css("color", "rgba(255,255,255,0.5)");
            }
            // 3.4切换序号的状态
            $item.find(".list_number").toggleClass("list_number2");
            $item
                .siblings()
                .find(".list_number")
                .removeClass("list_number2");

            // 3.5播放音乐
            player.playMusic($item.get(0).index, $item.get(0).music);

            // 3.6切换歌曲信息
            initMusicInfo($item.get(0).music);
            // 3.7切换歌词信息
            initMusicLyric($item.get(0).music);
        });

        // 4.监听底部控制区域播放按钮的点击
        $musicPlay.click(function () {
            // 判断有没有播放过音乐
            if (player.currentIndex == -1) {
                // 没有播放过音乐

                $(".list_music")
                    .eq(0)
                    .find(".list_menu_play")
                    .trigger("click");
            } else {
                // 已经播放过音乐
                $(".list_music")
                    .eq(player.currentIndex)
                    .find(".list_menu_play")
                    .trigger("click");
            }
        });

        // 5.监听底部控制区域上一首按钮的点击
        $(".music_pre").click(function () {
            $(".list_music")
                .eq(player.preIndex())
                .find(".list_menu_play")
                .trigger("click");
        });

        // 6.监听底部控制区域下一首按钮的点击
        $(".music_next").click(function () {
            $(".list_music")
                .eq(player.nextIndex())
                .find(".list_menu_play")
                .trigger("click");
        });

        // 7.监听删除按钮的点击
        $(".content_list").delegate(".list_menu_del", "click", function () {
            // 找到被点击的音乐
            let $item = $(this).parents(".list_music");

            // 判断当前删除的是否是正在播放的
            if ($item.get(0).index == player.currentIndex) {
                $(".music_next").trigger("click");
            }

            $item.remove();
            player.changeMusic($item.get(0).index);

            // 重新排序
            $(".list_music").each(function (index, ele) {
                ele.index = index;
                $(ele)
                    .find(".list_number")
                    .text(index + 1);
            });
        });

        // 8.监听播放的进度
        player.musicTimeUpdate(function (currentTime, duration, timeStr) {
            // 同步时间
            $(".music_progress_time").text(timeStr);
            // 同步进度条
            // 计算播放比例
            let value = (currentTime / duration) * 100;
            //播放完成后播放下一首
            if (value == 100) {
                $(".music_next").trigger("click");
            }
            progress.setProgress(value);
            // 实现歌词同步
            let index = lyric.currentIndex(currentTime);
            let $item = $(".song_lyric li").eq(index);
            $item.addClass("cur");
            $item.siblings().removeClass("cur");

            // 实现歌词滚动
            if (index <= 2) return;
            $(".song_lyric").css({
                marginTop: (-index + 2) * 30
            });
        });

        // 9.监听声音按钮的点击
        $(".music_voice_icon").click(function () {
            // 图标切换
            $(this).toggleClass("music_voice_icon2");
            // 声音切换
            if ($(this).hasClass("music_voice_icon2")) {
                // 变为没有声音
                player.musicVoiceSeekTo(0);
            } else {
                // 变为有声音
                player.musicVoiceSeekTo(1);
            }
        });
    }

    // 10、监听上部分删除按钮的点击
    $(".content_toolbar_del").click(function () {
        // 找到被选中的音乐
        let item1 = $(".list_music .list_checked");
        //找到他的父类删除
        let item2 = item1.parents(".list_music");

        // 判断当前删除的是否是正在播放的
        if (item2.get(0).index == player.currentIndex) {
            $(".music_next").trigger("click");
        }

        item2.remove();
        // 更改数组的下标
        player.changeMusic(item2.get(0).index);

        // 重新排序
        $(".list_music").each(function (index, ele) {
            ele.index = index;
            $(ele)
                .find(".list_number")
                .text(index + 1);
        });
    });

    // 11、监听上部分清空列表按钮的点击
    $(".content_toolbar_close").click(function () {
        // 找到所有的音乐
        let $item = $(".content_list").find(".list_music");
        $item.remove();
        // 点击清空列表就暂停音乐
        $audio.get(0).pause();
        $(".music_play").removeClass("music_play2");
    });

    // 12、收藏按钮的点击
    $(".music_fav").click(function () {
        $(this).toggleClass("music_fav2");
    });

    // 13、切换播放顺序
    let count = 2;
    $(".music_mode1").click(function () {
        if (count > 4) {
            count = 1;
            $(this).removeClass("music_mode1");
            $(this).removeClass("music_mode2");
            $(this).removeClass("music_mode3");
            $(this).removeClass("music_mode4");
        }
        $(this).addClass("music_mode" + count + "");
        count++;
    });

    // 14、切换播放模式
    $(".music_only").click(function () {
        $(this).toggleClass("music_only2");
        $(".content_left").toggleClass("content_pure");
        $(".content_right").toggleClass("content_pure2");
    });

    //监控浏览器大小变化回调函数
    $(window).resize(function () {
        let width = document.body.clientWidth;
        //当浏览器宽度在指定范围时删除添加的类
        if (width > 669 && width <= 1200) {
            $(".music_only").removeClass("music_only2");
            $(".content_left").removeClass("content_pure");
            $(".content_right").removeClass("content_pure2");
        }
    });

    // 15.监听音乐列表复选框的点击事件

    $(".content_list").delegate(".list_music .list_check", "click", function () {
        $(this).toggleClass("list_checked");
        let counts1 = $(".list_music .list_check").get().length;
        let counts2 = $(".list_music .list_checked").get().length;
        if (counts2 < counts1) {
            $("#list_checkone").removeClass("list_checked");
        } else if (counts1 == counts2) {
            $("#list_checkone").addClass("list_checked");
        }
    });

    // 16、全选复选框监听事件
    $("#list_checkone").click(function () {
        $(this).toggleClass("list_checked");
        let itemone = $(this).hasClass("list_checked");
        if (itemone) {
            $(".list_music .list_check").addClass("list_checked");
        } else {
            $(".list_music .list_check").removeClass("list_checked");
        }
    });

    // 定义一个方法创建一条音乐
    function crateMusicItem(index, music) {
        let $item = $(
            "" +
            '<li class="list_music">\n' +
            '<div class="list_check"><i></i></div>\n' +
            '<div class="list_number">' +
            (index + 1) +
            "</div>\n" +
            '<div class="list_name">' +
            music.name +
            "" +
            '     <div class="list_menu">\n' +
            '          <a href="javascript:;" title="播放" class=\'list_menu_play\'></a>\n' +
            '          <a href="javascript:;" title="添加"></a>\n' +
            '          <a href="javascript:;" title="下载"></a>\n' +
            '          <a href="javascript:;" title="分享"></a>\n' +
            "     </div>\n" +
            "</div>\n" +
            '<div class="list_singer">' +
            music.singer +
            "</div>\n" +
            '<div class="list_time">\n' +
            "     <span>" +
            music.time +
            "</span>\n" +
            '     <a href="javascript:;" title="删除" class=\'list_menu_del\'></a>\n' +
            "</div>\n" +
            "</li>"
        );

        $item.get(0).index = index;
        $item.get(0).music = music;

        return $item;
    }

    //页面加载完毕后获取用户登录信息
    $.post("user/loginMsg", function (data) {
        // 设置登录时的用户名
        if (data != undefined && data != null && data != "") {
            $("#loginMsg").html(data.username);
            $("#loginMsg").css({
                color: "#ff6700",
                opacity: 0.8
            });
        }
    })
});
