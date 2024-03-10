package com.mytech.mainservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
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
    private Map<String, Object> reviewDetails;

    @ManyToOne()
    @JoinColumn(name = "customer_User_Id")
    private User customerUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "provider_User_Id")
    private User providerUser;

}