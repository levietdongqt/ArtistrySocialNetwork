package com.mytech.realtimeservice.models.feignClient;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mytech.realtimeservice.enums.UserRole;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Role implements Serializable {
    private long id;

    private UserRole name;

    private String description;

    private List<User> users;
}
