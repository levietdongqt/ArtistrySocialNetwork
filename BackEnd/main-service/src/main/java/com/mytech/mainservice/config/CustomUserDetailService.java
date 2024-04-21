package com.mytech.mainservice.config;


import com.mytech.mainservice.model.User;
import com.mytech.mainservice.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CustomUserDetailService implements UserDetailsService {

    @Autowired
    private IUserRepository userCredentialRepo;

    @Override
    public CustomUserDetail loadUserByUsername(String loginInfo) throws UsernameNotFoundException {

        Optional<User> credential = userCredentialRepo.findByPhoneNumber(loginInfo);

        return credential.map(CustomUserDetail::new).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
    }

}
