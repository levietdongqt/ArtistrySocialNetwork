package com.mytech.mainservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "sessions")
public class Session implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Size(max = 100)
    @NotNull
    @Column(name = "refresh_Token", nullable = false, length = 100)
    private String refreshToken;

    @Size(max = 100)
    @Column(name = "user_Agent",  length = 100)
    private String userAgent;

    @Size(max = 100)
    @Column(name = "client_Ip",  length = 100)
    private String clientIp;

    @NotNull
    @Column(name = "is_Blocked")
    private boolean isBlocked = false;

    @NotNull
    @Column(name = "expires_At", nullable = false)
    private LocalDateTime expiresAt;

    @NotNull
    @Column(name = "created_At", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne()
    @JoinColumn(name = "user_Id")
    private User user;

}