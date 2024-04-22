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

	@Autowired
	private ELSService elsService;

	@Autowired
	private UserELSRepository userELSRepository;

	@Autowired
	private ServiceELSRepository serviceELSRepository;

	@Autowired
	private PostELSRepository postELSRepository;

	@Autowired
	private IFriendshipRepository friendshipRepository;
	public static void main(String[] args) {
		SpringApplication.run(MainServiceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		userELSRepository.deleteAll();
		serviceELSRepository.deleteAll();
		List<String> listsRoles = List.of("Nhà cung cấp","người dùng");
		List<String> listsRoles2 = List.of("người dùng");
		UserELS userELS = UserELS.builder()
				.id("4c7bd754-f5bc-11ee-ba6a-02325a62a505")
				.fullName("Trần Thụ Huy")
				.email("huy@gmail.com")
				.avatar("https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg")
				.roles(listsRoles)
				.build();
		UserELS userELS1 = UserELS.builder()
				.id("4c7be02b-f5bc-11ee-ba6a-02325a62a505")
				.fullName("Lê Viết Đông")
				.email("dong@gmail.com")
				.avatar("https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg")
				.roles(listsRoles2)
				.build();
		UserELS userELS2 = UserELS.builder()
				.id("d3cc9af4-9d38-44ee-8127-6efa4436fd70")
				.fullName("Cao Tến Nam")
				.email("test1@gmail.com")
				.avatar("https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg")
				.roles(listsRoles)
				.build();
		UserELS userELS3 = UserELS.builder()
				.id("d3cc9af4-9d38-44ee-8127-6efa4436fd72")
				.fullName("Cao Tến Nam")
				.email("test1@gmail.com")
				.avatar("https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg")
				.roles(listsRoles)
				.build();
		UserELS userELS4 = UserELS.builder()
				.id("d3cc9af4-9d38-44ee-8127-6efa4436fd73")
				.fullName("Lê Hoàng Huy")
				.email("test1@gmail.com")
				.avatar("https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg")
				.roles(listsRoles)
				.build();
		UserELS userELS5 = UserELS.builder()
				.id("d3cc9af4-9d38-44ee-8127-6efa4436fd71")
				.fullName("Lê Huy")
				.email("test1@gmail.com")
				.avatar("https://cdn.wallpapersafari.com/43/42/IwWBH3.jpg")
				.roles(listsRoles)
				.build();
		elsService.saveUserELS(userELS);
		elsService.saveUserELS(userELS1);
		elsService.saveUserELS(userELS2);
		elsService.saveUserELS(userELS3);
		elsService.saveUserELS(userELS4);
		elsService.saveUserELS(userELS5);
		ServiceELS serviceELS = ServiceELS.builder()
				.id(1L)
				.name("Combo Chụp Hình mùa hè")
				.description("Đây là bộ ảnh chụp hình mùa hè. Ai cần liên hệ 09033344433")
				.build();
		ServiceELS serviceELS2 = ServiceELS.builder()
				.id(2L)
				.name("Chụp hình cưới trọn gói")
				.description("Đây là bộ ảnh chụp hình cưới. Ai cần liên hệ 09033344433")
				.build();
		ServiceELS serviceELS3 = ServiceELS.builder()
				.id(3L)
				.name("Chụp lẻ")
				.description("Đây là bộ ảnh chụp lẻ. Ai cần liên hệ 0903443211")
				.build();

		serviceELSRepository.save(serviceELS);
		serviceELSRepository.save(serviceELS2);
		serviceELSRepository.save(serviceELS3);

		PostELS postELS = PostELS.builder().id("d3cc9af4-9d38-44ee-8127-6efa4436fd7a")
				.content("cần tìm studio giá rẻ")
				.fullName("Huy Trần")
				.build();
		PostELS postELS1 = PostELS.builder().id("d3cc9af4-9d38-44ee-8127-6efa4436fdna")
				.content("cần thuê nhiếp ảnh")
				.fullName("Hải Yến")
				.build();
		elsService.savePostELS(postELS1);
		elsService.savePostELS(postELS);

	}
}
