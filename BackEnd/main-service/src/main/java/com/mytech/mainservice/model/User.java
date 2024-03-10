package com.mytech.mainservice.model;

import com.mytech.mainservice.enums.AccentType;
import com.mytech.mainservice.enums.Theme;
import com.mytech.mainservice.enums.UserStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class User implements Serializable {
    @Id
    private UUID id;

    @Size(max = 50)
    @Column(name = "full_name", length = 50)
    private String fullName;

    @Size(max = 50)
    @NotNull
    @Column(name = "email", nullable = false, length = 50)
    private String email;

    @Size(max = 20)
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "gender")
    private boolean gender = true;

    private LocalDate dateOfBirth;

    @Column(name = "email_confirmed")
    private boolean emailConfirmed = false;

    @Column(name = "phone_confirmed")
    private boolean phoneConfirmed = false;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(name = "location")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> location;

    @Size(max = 255)
    @Column(name = "avatar")
    private String avatar;

    @Size(max = 255)
    @Column(name = "cover_image")
    private String coverImage;

    @Column(name = "user_details")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> userDetails;

    @Column(name = "priority_score")
    private float priorityScore;

    @Size(max = 128)
    @Column(name = "password", length = 128)
    private String password;

    @Column(name = "change_password")
    private boolean changePassword = false;

    @Column(name = "search_history")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> searchHistory;

    @Enumerated(EnumType.STRING)
    private Theme theme;

    @Enumerated(EnumType.STRING)
    @Column(name = "accent")
    private AccentType accent;

    @Column(name = "bio")
    private String bio;

    @Column(name = "update_At")
    private LocalDateTime updateAt;

    @Column(name = "verified")
    private boolean verified = false;

    @Column(name = "total_Post")
    private int totalPost;

    @Column(name = "total_Photos")
    private int totalPhotos;

    @Size(max = 250)
    @Column(name = "pinned_Post", length = 250)
    private String pinnedPost;

    @ManyToMany(mappedBy ="users")
    private  List<Role> roles;

    @ManyToMany(mappedBy ="savedByUser")
    private  List<MainService> savedMainServices;

    @OneToMany(mappedBy ="provider")
    private List<MainService> mainServices;

    @OneToMany(mappedBy = "provider",fetch = FetchType.LAZY)
    private List<ExtraService> extraServices;

    @OneToMany(mappedBy = "fromUser")
    private List<Friendship> friendships;

    @Getter(AccessLevel.PRIVATE)
    @Setter(AccessLevel.PRIVATE)
    @OneToMany(mappedBy = "friend",fetch = FetchType.LAZY)
    private List<Friendship> noAccess;

    @OneToMany(mappedBy = "providerUser",fetch = FetchType.LAZY)
    private List<Review> reviews;

    @OneToMany(mappedBy = "customerUser",fetch = FetchType.LAZY)
    private List<Review> selfReviews;

    @OneToMany(mappedBy = "provider")
    private List<WorkingTime> workingTimes;
}