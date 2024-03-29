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
@Table(name = "promotions")
public class Promotion implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @Size(max = 100)
    @NotNull
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @NotNull
    @Column(name = "discount_Percent", nullable = false)
    private float discountPercent;

    @NotNull
    @Column(name = "start_Date", nullable = false)
    private LocalDateTime startDate;

    @NotNull
    @Column(name = "end_Date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private boolean status = true;

    @ManyToMany(mappedBy = "promotions")
    private List<MainService> mainServices;

}