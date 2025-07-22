package com.gethired.Services;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class RedisService {
     @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public String get(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            log.error("Redis get() error for key {}: {}", key, e.getMessage());
            return null;
        }
    }
public void setLog(String key, String value, Long ttlSeconds) {
    try {
        redisTemplate.opsForValue().set(key, value, ttlSeconds, TimeUnit.SECONDS);
    } catch (Exception e) {
        log.error("Redis setLog() error for key {}: {}", key, e.getMessage());
    }
}
}
