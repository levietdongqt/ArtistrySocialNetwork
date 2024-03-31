package com.mytech.realtimeservice;

import com.mytech.realtimeservice.models.Notification;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.enums.NotificationType;
import com.mytech.realtimeservice.services.NotificationService;
import com.mytech.realtimeservice.services.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
@EnableDiscoveryClient
@Slf4j
public class RealtimeServiceApplication implements CommandLineRunner {

	@Autowired
	private PostService postService;
	@Autowired
	private NotificationService notificationService;

	public static void main(String[] args) {
		SpringApplication.run(RealtimeServiceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		Post post = postService.create(Post.builder().content("Hello").build());
		notificationService.saveNotification(Notification.builder()
				.status(false)
				.userFrom(post.getUser())
				.notificationType(NotificationType.COMMENT)
				.createdDate(LocalDateTime.now())
				.build());
		Post post1 = postService.create(Post.builder().content("Hello").build());
		notificationService.saveNotification(Notification.builder()
				.status(false)
				.userFrom(post.getUser())
				.notificationType(NotificationType.COMMENT)
				.createdDate(LocalDateTime.now())
				.build());
		Post post2 = postService.create(Post.builder().content("Hello").build());
		notificationService.saveNotification(Notification.builder()
				.status(false)
				.userFrom(post.getUser())
				.notificationType(NotificationType.COMMENT)
				.createdDate(LocalDateTime.now())
				.build());
		Post post3 = postService.create(Post.builder().content("Hello").build());
		notificationService.saveNotification(Notification.builder()
				.status(false)
				.userFrom(post.getUser())
				.notificationType(NotificationType.COMMENT)
				.createdDate(LocalDateTime.now())
				.build());
		notificationService.saveNotification(Notification.builder()
				.status(false)
				.userFrom(post.getUser())
				.notificationType(NotificationType.COMMENT)
				.createdDate(LocalDateTime.now())
				.build());
		List<Notification> notificationList = notificationService.getNotificationsByUserFromUserIdOrderByCreatedDateDesc(post.getUser());
		System.out.println(notificationList);
	}

}
