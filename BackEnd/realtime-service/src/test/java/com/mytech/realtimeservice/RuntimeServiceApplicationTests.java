package com.mytech.realtimeservice;

import com.mytech.realtimeservice.client.FriendForeignClient;
import com.mytech.realtimeservice.dto.PostDTO;
import com.mytech.realtimeservice.dto.PostELS;
import com.mytech.realtimeservice.repositories.PostRepository;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RuntimeServiceApplicationTests {

	@Autowired
	private PostRepository postRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private FriendForeignClient friendForeignClient;

	@Test
	void savePostELS() {

	}

}
