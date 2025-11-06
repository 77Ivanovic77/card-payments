package com.payments.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Todas las rutas desconocidas del frontend regresan index.html
        registry.addViewController("/{x:[\\w\\-]+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/{x:[\\w\\-]+}/{y:[\\w\\-]+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/{x:[\\w\\-]+}/{y:[\\w\\-]+}/{z:[\\w\\-]+}")
                .setViewName("forward:/index.html");
    }
}