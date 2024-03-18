package com.mytech.mainservice.config;

import com.mytech.mainservice.enums.UserStatus;
import com.mytech.mainservice.model.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public class CustomUserDetail implements UserDetails {

    private final String usename;
    private final String password;

    @Getter
    private final UserStatus status;

    @Getter
    @Setter
    private List<SimpleGrantedAuthority> authorities;

    public CustomUserDetail(User credential) {
        this.usename = credential.getEmail();
        this.password = credential.getPassword();
        this.authorities = credential.getRoles().stream().
                map(item -> new SimpleGrantedAuthority(item.getName().toString())).toList();
        this.status = credential.getStatus();

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
        return status == UserStatus.ACTIVED;
    }


}
