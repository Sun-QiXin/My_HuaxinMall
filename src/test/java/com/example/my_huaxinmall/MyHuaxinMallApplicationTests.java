package com.example.my_huaxinmall;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@SpringBootTest
class MyHuaxinMallApplicationTests {
    @Autowired
    private JavaMailSenderImpl javaMailSender;

    @Test
    public void sendMessage(){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject("这是一个标题");
        message.setText("这是邮箱正文的内容");
        message.setFrom("826552197@qq.com");
        message.setTo("15153869872@163.com"); //接收者的邮箱地址
        javaMailSender.send(message);
    }

}
