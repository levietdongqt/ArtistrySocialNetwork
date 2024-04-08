package com.mytech.mainservice.model;

import com.mytech.mainservice.enums.OrderStatus;
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
@Table(name = "orders")
public class Order implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @Column(name = "additional_Service")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> additonalService;

    @NotNull
    @Column(name = "start_Date", nullable = false)
    private LocalDateTime startDate;

    @NotNull
    @Column(name = "end_Date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "create_Date")
    private LocalDateTime createDate;

    @Size(max = 50)
    @Column(name = "create_By", length = 50)
    private String createBy;

    @Column(name = "update_Date")
    private LocalDateTime updateDate;

    @Size(max = 255)
    @Column(name = "address")
    private String address;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @ManyToOne()
    @JoinColumn(name = "provider_User_Id")
    private User providerUser;

    @ManyToOne
    @JoinColumn(name = "customer_User_Id")
    private User customerUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_Service_Id")
    private MainService mainService;

    @ManyToOne()
    @JoinColumn(name = "promotion_Id")
    private Promotion promotion;

}