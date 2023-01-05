package com.example.my_huaxinmall.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @author 孙启新
 * @Description 发送邮件
 * @FileName MailUtils
 * @Date 2022/11/15 21:46:50
 */
@Component
public class MailUtils {
    @Resource(type = JavaMailSenderImpl.class)
    private JavaMailSenderImpl javaMailSender;

    /**
     * 邮件发送
     * @param setToMail 接收者邮箱
     * @param title 标题
     * @param message 发送内容
     */
    public void sendMail(String setToMail, String title, String message) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        //邮件标题
        simpleMailMessage.setSubject(title);
        //邮件内容
        simpleMailMessage.setText(message);
        //发送者邮箱
        simpleMailMessage.setFrom("826552197@qq.com");
        //接收者邮箱
        simpleMailMessage.setTo(setToMail);
        javaMailSender.send(simpleMailMessage);
    }
}
