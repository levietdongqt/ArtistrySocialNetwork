package com.mytech.mainservice.service.implement;


import com.mytech.mainservice.dto.RegisterDto;
import com.mytech.mainservice.helper.JwtService;
import com.mytech.mainservice.model.User;
import com.mytech.mainservice.repository.IUserRepository;
import com.mytech.mainservice.service.IAuthService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthService implements IAuthService {

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private IUserRepository userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    public String createUser(RegisterDto userRegister) {
        User user = modelMapper.map(userRegister,User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        log.info("User added to this system");
        return "User added to this system";
    }

    public String generateToken(String username) {
            return jwtService.generateToken(username);
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }

}
