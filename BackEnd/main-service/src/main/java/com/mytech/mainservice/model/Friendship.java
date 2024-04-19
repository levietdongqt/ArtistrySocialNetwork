package com.mytech.mainservice.model;

import com.mytech.mainservice.enums.FriendShipStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "friendships")
public class Friendship implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<FriendShipStatus> status;

    @ManyToOne
    @JoinColumn(name = "from_User_Id")
    private User fromUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "to_User_Id")
    private User friend;

}