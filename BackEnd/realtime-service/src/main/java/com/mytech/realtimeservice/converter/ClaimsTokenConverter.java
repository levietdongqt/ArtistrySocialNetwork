package com.mytech.realtimeservice.converter;


import com.mytech.realtimeservice.models.feignClient.User;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;

import java.util.HashMap;

public class ClaimsTokenConverter implements Converter<User, HashMap<String, Object>> {
    @Override
    public HashMap<String, Object> convert(MappingContext<User, HashMap<String, Object>> mappingContext) {
        HashMap<String,Object> claims = new HashMap<String,Object>();
        User user = mappingContext.getSource();
        if(user == null){
            return null;
        }
        claims.put("roles", user.getRoles().stream().map(role -> role.getName().toString()).toList());
        return claims;
    }
}
