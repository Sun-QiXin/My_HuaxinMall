package com.example.my_huaxinmall.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * @author 孙启新
 * @Description 跳转静态界面
 * @FileName ForWardController
 * @Date 2022/11/14 17:36:11
 */
@Controller
@CrossOrigin
public class ForWardController {
    /**
     * 跳转商品详情页面
     * @return 页面
     */
    @RequestMapping("/Details_page")
    public String detailsPage() {
        return "Details_page";
    }

    /**
     * 跳转主页面
     * @return 页面
     */
    @RequestMapping("/index")
    public String indexPage() {
        return "index";
    }

    /**
     * 跳转登录页面
     * @return 页面
     */
    @RequestMapping("/UserLogin.html")
    public String userLoginPage() {
        return "UserLogin";
    }

    /**
     * 跳转注册页面
     * @return 页面
     */
    @RequestMapping("/UserSignUp.html")
    public String userSignUpPage() {
        return "UserSignUp";
    }

    /**
     * 跳转忘记密码页面
     * @return 页面
     */
    @RequestMapping("/UserRetrieve.html")
    public String userRetrievePage() {
        return "UserRetrieve";
    }

    /**
     * 跳转播放器页面
     * @return 页面
     */
    @RequestMapping("/music_Index.html")
    public String musicIndexPage() {
        return "music_Index";
    }
}
