package com.mytech.mainservice.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.*;
import org.springframework.http.HttpStatus;

import java.io.Serializable;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseObject implements Serializable {
    private HttpStatus status;
    private String message;
    private Object data;
    @JsonGetter("status")
    public int getStatusValue() {
        return status.value(); // Trả về giá trị số của HttpStatus
    }
}
