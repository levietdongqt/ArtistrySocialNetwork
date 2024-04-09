package com.mytech.mainservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "extra_services")
public class ExtraService implements Serializable  {
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

    @ManyToMany(mappedBy = "extraServices")
    private List<MainService> mainServices;

    @ManyToOne()
    @JoinColumn(name = "user_Id")
    private User provider;

}