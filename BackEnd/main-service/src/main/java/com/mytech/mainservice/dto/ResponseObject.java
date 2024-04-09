package com.mytech.mainservice.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.http.HttpStatus;

import java.io.Serializable;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseObject<T> implements Serializable {
    private HttpStatus status;
    private String message;
    private T data;

    @JsonGetter("status")
    public int getStatusValue() {
        return status.value(); // Trả về giá trị số của HttpStatus
    }

    @JsonGetter("stringStatus")
    public HttpStatus getStringStatusValue() {
        return status;
    }
}
