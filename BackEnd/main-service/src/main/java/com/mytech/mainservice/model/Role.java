package com.mytech.mainservice.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mytech.mainservice.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.util.List;


@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "roles")
public class Role implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @Enumerated(EnumType.STRING)
    private UserRole name;

    @Size(max = 255)
    @Column(name = "description")
    private String description;

    @JsonBackReference
    @ManyToMany(mappedBy = "roles",fetch = FetchType.LAZY)
    private List<User> users;
}