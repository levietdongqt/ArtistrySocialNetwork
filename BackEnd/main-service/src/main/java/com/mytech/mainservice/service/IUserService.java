package com.mytech.mainservice.service;

import com.mytech.mainservice.model.User;

import java.util.List;

public interface IUserService {

    public User getUserById(String userId);

    String getRandomId();
}
