package com.mytech.authservice.model;


import com.mytech.authservice.enums.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class UserCredential {

    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(length = 50, nullable = false)
    private String email;

    @Column(length = 128)
    private String password;

}
