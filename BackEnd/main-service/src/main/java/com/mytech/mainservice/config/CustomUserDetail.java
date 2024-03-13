package com.mytech.mainservice.config;

import com.mytech.mainservice.model.Role;
import com.mytech.mainservice.model.User;
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
    @Setter
    private List<Role> roles;

    public CustomUserDetail(User credential) {
        this.usename = credential.getEmail();
        this.password = credential.getPassword();
        this.roles = credential.getRoles();

    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        this.roles.forEach(item -> log.debug(item.getName().toString()));

        return this.roles.stream().
                map(item ->{
                    log.debug(item.getName().toString());
                  return  new SimpleGrantedAuthority(item.getName().toString());
                } ).collect(Collectors.toList());
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
        return true;
    }


}
