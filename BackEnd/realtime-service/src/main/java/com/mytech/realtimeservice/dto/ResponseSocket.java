package com.mytech.realtimeservice.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.mytech.realtimeservice.enums.ResponseSocketType;
import lombok.*;
import org.springframework.http.HttpStatus;

import java.io.Serializable;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseSocket<T> implements Serializable {
    private ResponseSocketType type;
    private T data;
}
