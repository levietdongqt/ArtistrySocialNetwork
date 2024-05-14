package com.mytech.mainservice;

import com.mytech.mainservice.model.elasticsearch.PostELS;
import com.mytech.mainservice.model.elasticsearch.ServiceELS;
import com.mytech.mainservice.model.elasticsearch.UserELS;
import com.mytech.mainservice.repository.IFriendshipRepository;
import com.mytech.mainservice.repository.PostELSRepository;
import com.mytech.mainservice.repository.ServiceELSRepository;
import com.mytech.mainservice.repository.UserELSRepository;
import com.mytech.mainservice.service.implement.ELSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.List;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EnableCaching
@EnableAsync
public class MainServiceApplication implements CommandLineRunner {


	public static void main(String[] args) {
		SpringApplication.run(MainServiceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

	}
}
