package com.mytech.mainservice;

import com.mytech.mainservice.model.elasticsearch.ServiceELS;
import com.mytech.mainservice.model.elasticsearch.UserELS;
import com.mytech.mainservice.repository.IMainServiceRepository;
import com.mytech.mainservice.repository.IUserRepository;
import com.mytech.mainservice.repository.ServiceELSRepository;
import com.mytech.mainservice.repository.UserELSRepository;
import com.mytech.mainservice.service.IELSService;
import com.mytech.mainservice.service.implement.UserService;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@EnableDiscoveryClient
class MainServiceApplicationTests {

	@Autowired
	private UserService userService;

	@Autowired
	private IUserRepository userRepository;

	@Autowired
	private IMainServiceRepository mainServiceServiceRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private IELSService ielsService;

	@Autowired
	private UserELSRepository userELSRepository;

	@Autowired
	private ServiceELSRepository serviceELSRepository;

	@Test
	void saveUserELS() {
		userELSRepository.deleteAll();

		var users = userRepository.getAllContainRoles();

		users.forEach(user -> {
			var userELS = modelMapper.map(user, UserELS.class);
			var listRoles =  userService.getVietnameseRolesFromRolesTable(user.getRoles());
			userELS.setRoles(listRoles);
			ielsService.saveUserELS(userELS);
		});
		List<UserELS> list = new ArrayList<>();
		userELSRepository.findAll().forEach(userELS -> {
			list.add(userELS);
		});
	}

	@Test
	void saveServiceELS() {
		serviceELSRepository.deleteAll();

		var services = mainServiceServiceRepository.findAll();

		services.forEach(service -> {
			var serviceELS = modelMapper.map(service, ServiceELS.class);
			ielsService.saveServiceELS(serviceELS);
		});
	}


}
