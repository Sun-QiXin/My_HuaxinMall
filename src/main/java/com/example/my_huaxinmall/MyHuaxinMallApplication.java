package com.example.my_huaxinmall;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.my_huaxinmall.mapper")
public class MyHuaxinMallApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyHuaxinMallApplication.class, args);
    }

}
