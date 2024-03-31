package com.mytech.realtimeservice.configs;


import com.mytech.realtimeservice.enums.UserStatus;
import com.mytech.realtimeservice.models.feignClient.User;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Slf4j
public class CustomUserDetail implements UserDetails {

    private final String usename;
    private final String password;

    @Getter
    private final User user;

    @Setter
    private List<SimpleGrantedAuthority> authorities;

    public CustomUserDetail(User credential) {
        this.usename = credential.getEmail();
        this.password = credential.getPassword();
        this.authorities = credential.getRoles().stream().
                map(item -> new SimpleGrantedAuthority(item.getName().toString())).toList();
        this.user = credential;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return usename;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.user.getStatus() == UserStatus.ACTIVED;
    }


}
