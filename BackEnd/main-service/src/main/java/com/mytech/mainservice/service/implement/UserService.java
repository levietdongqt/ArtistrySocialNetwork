package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.model.User;
import com.mytech.mainservice.repository.IUserRepository;
import com.mytech.mainservice.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements IUserService {

    @Autowired
    private IUserRepository userRepository;

    @Override
    public User getUserById(String userId) {
        List<User> list = userRepository.findAll();
        list.forEach(user -> {
            System.out.println("ID: " + user.getId());
        });
        try {
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) {
                return user.get();
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        throw new RuntimeException("User not found");
    }

    @Override
    public String getRandomId() {
        return userRepository.findAll().stream().toList().get(0).getId().toString();
    }
}
