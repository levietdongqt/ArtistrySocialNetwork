package com.mytech.realtimeservice.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.*;
import org.springframework.http.HttpStatus;

import java.io.Serializable;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseObject<T> implements Serializable {
    private HttpStatus status;
    private String message;
    private T data;

    @JsonGetter("status")
    public int getStatusValue() {
        return status.value(); // Trả về giá trị số của HttpStatus
    }
    @JsonSetter("status")
    public void setStatusValue(int statusValue) {
        this.status = HttpStatus.valueOf(statusValue);
    }

    @JsonGetter("stringStatus")
    public HttpStatus getStringStatusValue() {
        return status;
    }
}