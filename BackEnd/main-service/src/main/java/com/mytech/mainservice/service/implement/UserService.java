package com.mytech.mainservice.service.implement;

import com.google.firebase.auth.UserInfo;
import com.mytech.mainservice.client.NotificationForeignClient;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.dto.request.ChangePassDTO;
import com.mytech.mainservice.dto.request.LoginDTO;
import com.mytech.mainservice.dto.request.RegisterDto;
import com.mytech.mainservice.enums.AccentType;
import com.mytech.mainservice.enums.Theme;
import com.mytech.mainservice.enums.UserRole;
import com.mytech.mainservice.enums.UserStatus;
import com.mytech.mainservice.exception.myException.InvalidPropertyException;
import com.mytech.mainservice.exception.myException.NotFoundException;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import com.mytech.mainservice.helper.JwtTokenHolder;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
    private JwtTokenHolder tokenHolder;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private IRoleRepository roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private IELSService elsService;

    @Autowired
    private NotificationForeignClient notificationForeignClient;

    @Value("${env.images.default.avatar}")
    private String DEFAULT_AVATAR;

    @Value("${env.images.default.background}")
    private String DEFAULT_BACKGROUND;

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
                .avatar(DEFAULT_AVATAR)
                .coverImage(DEFAULT_BACKGROUND)
                .theme(Theme.LIGHT)
                .accent(AccentType.BLUE)
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
                .coverImage(DEFAULT_BACKGROUND)
                .roles(roles)
                .status(UserStatus.ACTIVED)
                .theme(Theme.LIGHT)
                .accent(AccentType.BLUE)
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
            return;
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

    @Override
    public void deleteHistory(String userId, String history) {
        var updatedUserOptional = userRepo.findById(userId);
        if (updatedUserOptional.isPresent()) {
            var updatedUser = updatedUserOptional.get();
            var listHistory = updatedUser.getSearchHistory();
            listHistory.forEach(his -> {
                if (his.equals(history)) {
                    listHistory.remove(his);
                }
            });
            updatedUser.setSearchHistory(listHistory);
            userRepo.save(updatedUser);
            return;
        }
        throw new NotFoundException("Không tìm thấy người dùng");

    }

    @Override
    public void deleteAllHistory(String userId) {
        var updatedUserOptional = userRepo.findById(userId);
        if (updatedUserOptional.isPresent()) {
            var updatedUser = updatedUserOptional.get();
            var listHistory = updatedUser.getSearchHistory();
            listHistory.clear();
            updatedUser.setSearchHistory(listHistory);
            userRepo.save(updatedUser);
            return;
        }
        throw new NotFoundException("Không tìm thấy người dùng");

    }

    @Override
    public UserDTO updateUser(UserDTO userDto) {
        List<UserRole> userRoles = userDto.getRoles().stream().map(UserRole::valueOf).toList();
        List<Role> roles = roleRepo.findByListName(userRoles);
        User user = userRepo.findById(userDto.getId()).orElseThrow(() -> new NotFoundException("User not Found"));
        modelMapper.map(userDto, user);
        user.setRoles(roles);
        User saved = userRepo.save(user);
        notificationForeignClient.updateUserForRealtime(userDto);

        //update eslactic user
        var vietnameseRoles = getVietnameseRolesFromRolesTable(saved.getRoles());
        UserELS userELS = UserELS.builder()
               .id(saved.getId())
               .fullName(saved.getFullName())
               .avatar(saved.getAvatar())
               .coverImage(saved.getCoverImage())
               .email(saved.getEmail())
               .bio(saved.getBio())
               .roles(vietnameseRoles).build();
        elsService.updateUserELS(userELS);
        log.info("Update to els search successfully");

        return modelMapper.map(saved, UserDTO.class);

    }

    @Override
    public void changePasswordV2(ChangePassDTO changePassDTO) {
        User user = userRepo.findById(tokenHolder.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        boolean isValidOldPass = passwordEncoder.matches(changePassDTO.oldPass(), user.getPassword());
        if(isValidOldPass || user.getPassword() == null){
            user.setPassword(passwordEncoder.encode(changePassDTO.newPass()));
            userRepo.save(user);
            return;
        }
        throw new InvalidPropertyException("Old password is not valid");
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
        if (updatedUserOptional.isPresent()) {
            var updatedUser = updatedUserOptional.get();
            var listHistory = updatedUser.getSearchHistory();
            if (listHistory == null) {
                listHistory = new LinkedList<>();
            }
            //Xóa phần tử bị trùng trong mảng
            for (String history : listHistory) {
                if (history.equals(keyword)) {
                    listHistory.remove(history);
                    break;
                }
            }
            System.out.println(listHistory);
            //Nếu size lớn hơn 10 thì xóa phần tử đầu
            if (!listHistory.isEmpty()) {
                if (listHistory.size() >= 10) {
                    listHistory.poll();
                    listHistory.add(keyword);
                } else {
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
        if (userOptional.isPresent()) {
            var user = userOptional.get();
            var listHistory = user.getSearchHistory();
            if (listHistory == null) {
                listHistory = new LinkedList<>();
            }
            return listHistory.stream().toList();
        }
        throw new NotFoundException("User not found");
    }

    public List<String> getVietnameseRolesFromRolesTable(List<Role> roles) {
        List<String> vietnameseRoles = new ArrayList<>();
        for (Role role : roles) {
            switch (role.getName()) {
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
