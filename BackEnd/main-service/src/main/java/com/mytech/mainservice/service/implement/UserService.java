package com.mytech.mainservice.service.implement;

import com.google.firebase.auth.UserInfo;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.dto.request.RegisterDto;
import com.mytech.mainservice.enums.UserRole;
import com.mytech.mainservice.enums.UserStatus;
import com.mytech.mainservice.exception.myException.NotFoundException;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import com.mytech.mainservice.model.Role;
import com.mytech.mainservice.model.User;
import com.mytech.mainservice.model.elasticsearch.UserELS;
import com.mytech.mainservice.repository.IRoleRepository;
import com.mytech.mainservice.repository.IUserRepository;
import com.mytech.mainservice.service.IELSService;
import com.mytech.mainservice.service.IUserService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

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

    @Autowired
    private IELSService elsService;

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
    @Transactional
    public User createUser(RegisterDto userRegister) throws UnAuthenticationException {
        try {
            boolean isExisted = userRepo.findByEmail(userRegister.email()).isPresent();
            if (isExisted) {
                throw new UnAuthenticationException(" Email already existed");
            }
            List<UserRole> userRoles = userRegister.roles().stream().map(item -> UserRole.valueOf(item.toUpperCase())).toList();
            List<Role> roles = roleRepo.findByListName(userRoles);

            User user = modelMapper.map(userRegister, User.class);
            user.setCreateDate(LocalDateTime.now());
            user.setStatus(UserStatus.PENDING);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRoles(roles);
            User savedUser = userRepo.save(user);
            log.info("User added to this system");
            return savedUser;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Role name is not valid");
        }
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
        //Save vào els search
        //Lấy ra list roles
        var vietnameseRoles = getVietnameseRolesFromRolesTable(savedUser.getRoles());
        UserELS userELS = UserELS.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .avatar(savedUser.getAvatar())
                .coverImage(savedUser.getCoverImage())
                .email(savedUser.getEmail())
                .bio(savedUser.getBio())
                .roles(vietnameseRoles).build();
        elsService.saveUserELS(userELS);
        log.info("Save to els search successfully");
        return savedUser;
    }



    public User existUser(UserInfo userInfo) throws UnAuthenticationException {
        Optional<User> user = userRepo.findByEmailOrPhoneNumber(userInfo.getEmail(), userInfo.getPhoneNumber());
        if (user.isPresent() && !user.get().getAuthProvider().equals(userInfo.getProviderId())) {
            log.error("User already exists");
            throw new UnAuthenticationException("Bạn đã đăng nhập trước đó bằng " + user.get().getAuthProvider() + " với cùng 1 email hoặc số điện thoại tương tự");
        }
        return user.orElse(null);
    }

    @Override
    public void updateHistorySearch(String userId, String keyword) {
        var updatedUserOptional = userRepo.findById(userId);
        if (updatedUserOptional.isPresent()){
            var updatedUser = updatedUserOptional.get();
            var listHistory = updatedUser.getSearchHistory();
            if(listHistory == null){
                listHistory = new LinkedList<>();
            }
            //Xóa phần tử bị trùng trong mảng
            for(String history : listHistory){
                if(history.equals(keyword)){
                    listHistory.remove(history);
                    break;
                }
            }
            System.out.println(listHistory);
            //Nếu size lớn hơn 10 thì xóa phần tử đầu
            if (!listHistory.isEmpty()){
                if (listHistory.size() >= 10) {
                    listHistory.poll();
                    listHistory.add(keyword);
                }else {
                    listHistory.add(keyword);
                }
                updatedUser.setSearchHistory(listHistory);
                userRepo.save(updatedUser);
                return;
            }
            listHistory.add(keyword);
            updatedUser.setSearchHistory(listHistory);
            userRepo.save(updatedUser);
            return;
        }
        throw new NotFoundException("User not found");

    }

    @Override
    public List<String> getHistorySearch(String userId) {
        var userOptional = userRepo.findById(userId);
        if (userOptional.isPresent()){
            var user = userOptional.get();
            var listHistory = user.getSearchHistory();
            if(listHistory == null){
                listHistory = new LinkedList<>();
            }
            return listHistory.stream().toList();
        }
        throw new NotFoundException("User not found");
    }

    public List<String> getVietnameseRolesFromRolesTable(List<Role> roles) {
        List<String> vietnameseRoles = new ArrayList<>();
        for (Role role : roles) {
            switch (role.getName()){
                case ROLE_ADMIN:
                    vietnameseRoles.add("Quản trị viên");
                    break;
                case ROLE_USER:
                    vietnameseRoles.add("Người dùng");
                    break;
                case ROLE_PROVIDER:
                    vietnameseRoles.add("Nhà cung cấp");
                    break;
                case ROLE_STUDIO:
                    vietnameseRoles.add("Studio");
                    break;
                case ROLE_MAKEUP:
                    vietnameseRoles.add("Makeup");
                    break;
            }
        }
        return vietnameseRoles;
    }


}
