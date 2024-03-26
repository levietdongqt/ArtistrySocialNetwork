package com.mytech.realtimeservice;

import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.services.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
@Slf4j
public class RealtimeServiceApplication implements CommandLineRunner {

	@Autowired
	private PostService postService;

	public static void main(String[] args) {
		SpringApplication.run(RealtimeServiceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		postService.create(Post.builder().content("Hello").build());
	}

}
