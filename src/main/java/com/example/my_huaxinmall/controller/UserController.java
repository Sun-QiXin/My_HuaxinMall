package com.example.my_huaxinmall.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.example.my_huaxinmall.entity.User;
import com.example.my_huaxinmall.mapper.UserMapper;
import com.example.my_huaxinmall.util.MailUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.CollationKey;

/**
 * @author 孙启新
 * @Description 用户处理类
 * CrossOrigin 若前端使用Ajax，涉及跨域请求需要携带session或cookies，则使用CrossOrigin注解即可解决。
 * @FileName UserController
 * @Date 2022/11/14 16:59:15
 */
@Controller
@CrossOrigin
public class UserController {
    @Resource(type = UserMapper.class)
    private UserMapper userMapper;

    @Autowired
    private MailUtils mailUtils;
    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * 登录请求处理
     *
     * @param username 用户名
     * @param password 密码
     * @param response 响应
     */
    @RequestMapping("/user/login")
    public void login(@NonNull String username, @NonNull String password, HttpServletResponse response) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        //去数据库查询是否有该用户
        User user1 = userMapper.selectOne(new QueryWrapper<>(user));
        if (user1 != null) {
            try {
                //将java对象封装为json对象返回给客户端
                response.setContentType("application/json;charset=utf-8");
                Cookie cookie = new Cookie("user", user1.getUsername());
                cookie.setMaxAge(60 * 60);
                response.addCookie(cookie);
                //序列化为json
                mapper.writeValue(response.getOutputStream(), user1);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            try {
                mapper.writeValue(response.getOutputStream(), null);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    /**
     * 用户注册功能
     *
     * @param username 用户名
     * @param email    邮箱
     * @param password 密码
     * @param response 响应
     */
    @RequestMapping("user/userSignUp")
    public void register(@NonNull String username, @NonNull String email, @NonNull String password, HttpServletResponse response) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);
        try {
            int insert = userMapper.insert(user);
            if (insert == 1) {
                mapper.writeValue(response.getOutputStream(), "true");
            } else {
                mapper.writeValue(response.getOutputStream(), "false");
            }
        } catch (Exception e) {
            try {
                mapper.writeValue(response.getOutputStream(), "false");
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        }
    }

    /**
     * 发送邮件
     *
     * @param email 邮件名
     */
    @RequestMapping("/user/generateEmailCode")
    public void sendMail(@NonNull String email, HttpServletResponse response) {
        try {
            //1、生成一个6位数验证码
            String random = (int) ((Math.random() * 9 + 1) * 100000) + "";
            //2、将验证吗存入cookie，cookie失效时间为30分钟
            Cookie cookie = new Cookie("emailCode", random);
            cookie.setMaxAge(30 * 60);
            response.addCookie(cookie);
            //3、将验证码发送到用户邮箱
            try {
                String emailMsg = "【华新科技】您的验证码为：" + random + "，此验证码30分钟内有效，为保障账户安全，请勿将验证码泄露给他人！\n";
                mailUtils.sendMail(email, "华新科技——您的验证码为......）", emailMsg);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 忘记密码
     * @param email 邮箱
     * @param userEmailCode 验证码
     * @param confirmPassword 要修改的密码
     * @param request 请求
     * @param response 响应
     * @throws IOException 异常
     */
    @RequestMapping("/user/userRetrieve")
    public void userRetrieve(@NonNull String email,@NonNull String userEmailCode, @NonNull String confirmPassword, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("emailCode".equals(cookie.getName())) {
                    //验证码相同
                    if (cookie.getValue().equals(userEmailCode)) {
                        UpdateWrapper<User> updateWrapper = new UpdateWrapper<>();
                        updateWrapper.eq("email", email);
                        updateWrapper.set("password", confirmPassword);
                        int flag = userMapper.update(null, updateWrapper);
                        response.setContentType("text/html;charset=utf-8");
                        if (flag == 1) {
                            response.getWriter().write("1");
                        } else {
                            response.getWriter().write("2");
                        }
                    } else {
                        response.getWriter().write("3");
                    }
                }
            }
        }
    }

    /**
     * 返回当前cookie中保存的登录用户姓名
     *
     * @param request  请求
     * @param response 响应
     */
    @RequestMapping("/user/loginMsg")
    public void getLoginMsg(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("user".equals(cookie.getName())) {
                    try {
                        mapper.writeValue(response.getOutputStream(), cookie.getValue());
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
    }

    /**
     * 删除保存用户登录信息的cookie
     *
     * @param response 响应
     */
    @RequestMapping("/user/exit")
    public String exit(HttpServletResponse response) {
        Cookie cookie = new Cookie("user", "");
        cookie.setMaxAge(0);
        cookie.setPath("/user");
        response.addCookie(cookie);
        return "index";
    }
}
