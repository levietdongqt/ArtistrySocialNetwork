package com.mytech.mainservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mytech.mainservice.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WorkingTimeDTO implements Serializable {

    private long id;


    private LocalDateTime startDate;


    private LocalDateTime endDate;


    private String workingDay;


    private boolean status =true;

    private User provider;
}
