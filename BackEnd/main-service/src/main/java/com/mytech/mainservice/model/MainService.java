package com.mytech.mainservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "main_services")
public class MainService  implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @Size(max = 100)
    @Column(name = "name", length = 100)
    private String name;

    @NotNull
    @Column(name = "price", nullable = false)
    private double price;

    @Size(max = 20)
    @NotNull
    @Column(name = "price_Type", nullable = false, length = 20)
    private String priceType;

    @NotNull
    @Column(name = "duration", nullable = false)
    private float duration;

    @Column(name = "rest_Time")
    private float restTime;

    @Column(name = "image_Url")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> imageUrl;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private boolean status = true;

    @Column(name = "create_Date")
    private LocalDateTime createDate;

    @Size(max = 50)
    @Column(name = "create_By", length = 50)
    private String createBy;

    @Column(name = "update_Date")
    private LocalDateTime updateDate;

    @ManyToMany(mappedBy ="savedMainServices")
    private List<User> savedByUser;

    @ManyToMany
    @JoinTable(name = "additional_details",
            joinColumns = @JoinColumn(name = "main_service_Id"),
            inverseJoinColumns = @JoinColumn(name = "extra_service_Id"))
    private List<ExtraService> extraServices;

    @ManyToMany
    @JoinTable(name = "promotion_details",
            joinColumns = @JoinColumn(name = "main_Service_Id"),
            inverseJoinColumns = @JoinColumn(name = "promotion_Id"))
    private List<Promotion> promotions;

    @ManyToOne
    @JoinColumn(name = "user_Id")
    private User provider;

    @OneToMany(mappedBy = "mainService")
    private List<Order> orders;

}