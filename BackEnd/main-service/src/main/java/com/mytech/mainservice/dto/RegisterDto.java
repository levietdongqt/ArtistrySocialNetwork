package com.mytech.mainservice.dto;

import com.mytech.mainservice.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

/**
 * DTO for {@link User}
 */
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public  class RegisterDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 0L;
    private String email;
    private   String password;
    private List<String> roles;


}