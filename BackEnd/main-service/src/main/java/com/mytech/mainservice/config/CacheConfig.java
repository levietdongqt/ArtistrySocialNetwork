package com.mytech.mainservice.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

//    @Bean
//    public EhCacheCacheManager cacheManager(CacheManager cm) {
//        return new EhCacheCacheManager(cm);
//    }
//
//    @Bean
//    public EhCacheManagerFactoryBean ehCacheManagerFactoryBean() {
//        EhCacheManagerFactoryBean cmfb = new EhCacheManagerFactoryBean();
//        cmfb.setConfigLocation(new ClassPathResource("ehcache.xml"));
//        cmfb.setShared(true);
//        return cmfb;
//    }
}
