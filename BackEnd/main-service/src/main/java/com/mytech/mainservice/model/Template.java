package com.mytech.mainservice.model;

import com.mytech.mainservice.enums.TemplateType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
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
@Table(name = "template")
public class Template implements Serializable {
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

    @Column(name = "image_Url")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> imageUrl;

    @Size(max = 255)
    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    private TemplateType type;

}