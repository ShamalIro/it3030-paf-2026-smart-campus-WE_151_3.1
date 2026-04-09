package com.smartcampus.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${ticket.upload.dir:uploads/tickets}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded ticket images at /api/uploads/tickets/**
        registry.addResourceHandler("/api/uploads/tickets/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
