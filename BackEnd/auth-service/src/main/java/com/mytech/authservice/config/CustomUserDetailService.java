package com.mytech.authservice.config;

import com.mytech.authservice.model.UserCredential;
import com.mytech.authservice.repository.IUserCredentialRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;
@Component
public class CustomUserDetailService implements UserDetailsService {

    @Autowired
    private IUserCredentialRepo userCredentialRepo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<UserCredential> credential = userCredentialRepo.findByEmail(username);

        return credential.map(CustomUserDetail::new).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
    }

}
