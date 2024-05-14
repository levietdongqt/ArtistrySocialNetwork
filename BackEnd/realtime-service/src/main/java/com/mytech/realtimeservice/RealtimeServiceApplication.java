package com.mytech.realtimeservice;


import com.mytech.realtimeservice.enums.NotificationType;
import com.mytech.realtimeservice.models.Notification;
import com.mytech.realtimeservice.models.users.User;
import com.mytech.realtimeservice.repositories.CommentLikeRepository;
import com.mytech.realtimeservice.repositories.CommentsRepository;
import com.mytech.realtimeservice.repositories.PostLikeRepository;
import com.mytech.realtimeservice.repositories.PostRepository;
import com.mytech.realtimeservice.services.NotificationService;
import com.mytech.realtimeservice.services.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;


import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@Slf4j
@EnableAsync(proxyTargetClass = true)
public class RealtimeServiceApplication implements CommandLineRunner {


	public static void main(String[] args) {
		SpringApplication.run(RealtimeServiceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
	}

}
