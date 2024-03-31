package com.mytech.mainservice.service.implement;

import com.google.firebase.auth.*;
import com.mytech.mainservice.config.CustomUserDetail;
import com.mytech.mainservice.helper.JwtService;
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

import java.time.LocalDateTime;
import java.util.Arrays;
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
    public String generateAccessToken(User user) {
        return jwtService.generateAccessToken(user);
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
    public Session generateSession(String username) {
        User user = userRepo.findByEmail(username).orElse(null);
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
    public UserInfo firebaseHandler(String token) throws FirebaseAuthException {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
        return Arrays.stream(FirebaseAuth.getInstance().getUser(decodedToken.getUid()).getProviderData()).findFirst().get();
//        return User.builder()
//                .id(UUID.randomUUID().toString())
//                .email(userRecord.getEmail())
//                .phoneNumber(userRecord.getPhoneNumber())
//                .verified(true)
//                .emailConfirmed(userRecord.getEmail() != null)
//                .phoneConfirmed(userRecord.getPhoneNumber() != null)
//                .build();

    }

    @Override
    public Session checkRefreshToken(String refreshToken) throws UnAuthenticationException {
        Optional<Session> session = sessionRepo.findByRefreshToken(refreshToken);
        if (session.isPresent()) {
            Session validSession = session.get();
            if(isExpireToken(validSession)){
                throw new UnAuthenticationException("Refresh token is not available, Please make a new sign in request");
            }
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
