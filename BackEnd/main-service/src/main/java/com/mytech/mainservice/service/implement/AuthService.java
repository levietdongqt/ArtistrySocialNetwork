package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.dto.RegisterDto;
import com.mytech.mainservice.enums.UserRole;
import com.mytech.mainservice.enums.UserStatus;
import com.mytech.mainservice.helper.JwtService;
import com.mytech.mainservice.model.Role;
import com.mytech.mainservice.model.Session;
import com.mytech.mainservice.model.User;
import com.mytech.mainservice.exception.myException.UnAuthenticationException;
import com.mytech.mainservice.repository.IRoleRepository;
import com.mytech.mainservice.repository.ISessionRepository;
import com.mytech.mainservice.repository.IUserRepository;
import com.mytech.mainservice.service.IAuthService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
public class AuthService implements IAuthService {
    private  final int expireTimeToken = 5;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private IUserRepository userRepo;
    @Autowired
    private ISessionRepository sessionRepo;
    @Autowired
    private IRoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Override
    @Transactional
    public User createUser(RegisterDto userRegister) throws UnAuthenticationException {

        boolean isExisted = userRepo.findByEmail(userRegister.getEmail()).isPresent();
        if(isExisted){
            throw new UnAuthenticationException(" Email already existed");
        }
        List<UserRole> userRoles = userRegister.getRoles().stream().map(item -> UserRole.valueOf(item.toUpperCase())).toList();
        List<Role> roles = roleRepository.findByListName(userRoles);
        User user = modelMapper.map(userRegister, User.class);
        user.setCreateDate(LocalDateTime.now());
        user.setStatus(UserStatus.PENDING);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(roles);
        User savedUser = userRepo.save(user);
        log.info("User added to this system");
        return savedUser;
    }

    @Override
    public String generateToken(String username) {
        return jwtService.generateToken(username);
    }

    @Override
    public Session generateSession(User user) {
        Session session = Session.builder()
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(expireTimeToken))
                .refreshToken(UUID.randomUUID().toString())
                .isBlocked(false)
                .user(user)
                .build();
        return sessionRepo.save(session);
    }

    @Override
    public Session checkRefreshToken(String refreshToken) throws UnAuthenticationException {
        Optional<Session> session = sessionRepo.findByRefreshToken(refreshToken);
        if (session.isPresent()) {
            Session validSession = session.get();
            if(isExpireToken(validSession)){
                throw new UnAuthenticationException("Refresh token is not available, Please make a new sign in request");
            }
            validSession.setRefreshToken(UUID.randomUUID().toString());
            validSession.setCreatedAt(LocalDateTime.now());
            validSession.setExpiresAt(LocalDateTime.now().plusDays(expireTimeToken));
            return sessionRepo.save(validSession);
        } else {
            throw new UnAuthenticationException("Refresh token is not available, Please make a new sign in request");
        }
    }

    private boolean isExpireToken(Session session) {
        return session.getExpiresAt().isBefore(LocalDateTime.now());
    }

}
