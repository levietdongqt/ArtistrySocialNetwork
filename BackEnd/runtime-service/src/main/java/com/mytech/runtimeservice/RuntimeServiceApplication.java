package com.mytech.runtimeservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class RuntimeServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RuntimeServiceApplication.class, args);
	}

}
