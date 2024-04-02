package com.mytech.realtimeservice;

import com.mytech.realtimeservice.models.Notification;
import com.mytech.realtimeservice.models.Post;
import com.mytech.realtimeservice.enums.NotificationType;
import com.mytech.realtimeservice.models.users.User;
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
		postService.deleteAll();
		notificationService.deleteAll();
		User userTo1 = User.builder().userId("4dc47d13-ef4e-11ee-a0e1-00155d973fd0").userName("Phước Huỳnh").build();
		User userFrom1 = User.builder().userId("a125b897-1012-4e8c-ac64-60e3263f7252").userName("Huy").build();

		User userTo2 = User.builder().userId("4dc52467-ef4e-11ee-a0e1-00155d973fd0").userName("Lê Viết Đông").build();


		User userTo3 = User.builder().userId("734399e4-9568-4a0b-8f98-194afce6e0f7").userName("Nam Trần").build();
		notificationService.saveNotification(Notification.builder()
				.status(false)
				.userTo(userTo1)
						.delivered(false)
				.userFrom(userFrom1)
				.notificationType(NotificationType.COMMENT)
				.createdDate(LocalDateTime.now())
				.build());

		notificationService.saveNotification(Notification.builder()
				.status(false)
				.userTo(userTo2)
				.userFrom(userFrom1)
				.notificationType(NotificationType.FRIEND)
				.createdDate(LocalDateTime.now())
				.delivered(false)
				.build());
		notificationService.saveNotification(Notification.builder()
				.status(false)
						.message("Bộ ảnh mới về studio!!!")
				.userTo(userTo3)
				.userFrom(userFrom1)
				.notificationType(NotificationType.NORMAL)
				.createdDate(LocalDateTime.now())
				.delivered(false)
				.build());
		notificationService.saveNotification(Notification.builder()
				.status(true)
				.message("Đang tìm 1 studio về abc")
				.userTo(userTo1)
				.userFrom(userFrom1)
				.notificationType(NotificationType.COMMENT)
				.createdDate(LocalDateTime.now())
				.delivered(false)
				.build());
		notificationService.saveNotification(Notification.builder()
				.status(false)
				.userTo(userTo2)
				.userFrom(userFrom1)
				.notificationType(NotificationType.LIKE)
				.createdDate(LocalDateTime.now())
				.delivered(false)
				.build());

	}

}
