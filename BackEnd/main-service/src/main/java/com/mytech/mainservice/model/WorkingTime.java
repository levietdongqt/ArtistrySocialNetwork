package com.mytech.mainservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "working_time")
public class WorkingTime implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @NotNull
    @Column(name = "start_Date", nullable = false)
    private LocalDateTime startDate;

    @NotNull
    @Column(name = "end_Date", nullable = false)
    private LocalDateTime endDate;

    @Size(max = 20)
    @Column(name = "working_Day", length = 20)
    private String workingDay;

    @Column(name = "working_Days")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<DayOfWeek> workingDays;

    @Column(name = "status")
    private boolean status = true;

    @ManyToOne
    @JoinColumn(name = "user_Id")
    private User provider;

}