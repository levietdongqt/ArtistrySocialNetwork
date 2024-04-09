package com.mytech.mainservice.model;

import com.mytech.mainservice.enums.ReviewDetailKey;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "reviews")
public class Review implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @Column(name = "review_Details")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<ReviewDetailKey, Object> reviewDetails;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_User_Id")
    private User customerUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_User_Id")
    private User providerUser;

}