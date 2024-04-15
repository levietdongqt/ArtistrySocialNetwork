package com.mytech.mainservice.service.implement;

import com.google.firebase.auth.UserInfo;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.dto.request.LoginDTO;
import com.mytech.mainservice.dto.request.RegisterDto;
import com.mytech.mainservice.enums.UserRole;
import com.mytech.mainservice.enums.UserStatus;
import com.mytech.mainservice.exception.myException.NotFoundException;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import com.mytech.mainservice.model.Role;
import com.mytech.mainservice.model.User;
import com.mytech.mainservice.repository.IRoleRepository;
import com.mytech.mainservice.repository.IUserRepository;
import com.mytech.mainservice.service.IUserService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
public class UserService implements IUserService {

    @Autowired
    private IUserRepository userRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private IRoleRepository roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDTO getUserById(String userId) {
        try {
            Optional<User> user = userRepo.findById(userId);
            if (user.isPresent()) {
                UserDTO userDTO = modelMapper.map(user.get(), UserDTO.class);
                return userDTO;
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        throw new RuntimeException("User not found");
    }


    @Override
    public User createUser(RegisterDto userRegister) throws UnAuthenticationException {
        boolean isExisted = userRepo.findByEmail(userRegister.phoneNumber()).isPresent();
        if (isExisted) {
            throw new UnAuthenticationException(" Email already existed");
        }
        List<Role> roles = roleRepo.findByListName(userRegister.roles());
        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .fullName(userRegister.fullName())
                .phoneNumber(userRegister.phoneNumber())
                .password(passwordEncoder.encode(userRegister.password()))
                .roles(roles)
                .status(UserStatus.PENDING)
                .createDate(LocalDateTime.now())
                .build();
        User savedUser = userRepo.save(user);
        log.info("User added to this system");
        return savedUser;
    }


    @Override
    public String getRandomId() {
        return userRepo.findAll().stream().toList().get(0).getId().toString();
    }

    @Override
    public User createUser(UserInfo userInfo) throws UnAuthenticationException {
        List<Role> roles = roleRepo.findByListName(List.of(UserRole.ROLE_USER));
        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .email(userInfo.getEmail())
                .phoneNumber(userInfo.getPhoneNumber())
                .fullName(userInfo.getDisplayName())
                .avatar(userInfo.getPhotoUrl())
                .authProvider(userInfo.getProviderId())
                .verified(true)
                .emailConfirmed(userInfo.getEmail() != null)
                .phoneConfirmed(userInfo.getPhoneNumber() != null)
                .createDate(LocalDateTime.now())
                .roles(roles)
                .status(UserStatus.ACTIVED)
                .build();
        User savedUser = userRepo.save(user);
        log.info("User added to this system");
        return savedUser;
    }

    @Override
    public User getUserByPhoneNumber(String phoneNumber) {
        Optional<User> user = userRepo.findByPhoneNumber(phoneNumber);
        return user.orElse(null);
    }

    @Override
    public void verifyPhone(String phoneNumber) {
        Optional<User> user = userRepo.findByPhoneNumber(phoneNumber);
        if (user.isPresent()) {
            user.get().setPhoneConfirmed(true);
            user.get().setStatus(UserStatus.ACTIVED);
            userRepo.save(user.get());
        }
        throw new NotFoundException("User not found");
    }
    @Override
    public void changePass(LoginDTO data) {
        Optional<User> user = userRepo.findByPhoneNumber(data.phoneNumber());
        if (user.isPresent()) {
            user.get().setPassword(passwordEncoder.encode(data.password()));
            userRepo.save(user.get());
            return;
        }
        throw new NotFoundException("User not found");
    }

    public User existUser(UserInfo userInfo) throws UnAuthenticationException {
        Optional<User> user = userRepo.findByEmailOrPhoneNumber(userInfo.getEmail(), userInfo.getPhoneNumber());
        if (user.isPresent() && !user.get().getAuthProvider().equals(userInfo.getProviderId())) {
            log.error("User already exists");
            throw new UnAuthenticationException("Bạn đã đăng nhập trước đó bằng " + user.get().getAuthProvider() + " với cùng 1 email hoặc số điện thoại tương tự");
        }
        return user.orElse(null);
    }
}
