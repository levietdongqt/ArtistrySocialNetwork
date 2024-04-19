package com.mytech.mainservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IsCheckDTO {
    private boolean isFollow;
    private boolean isFriend;
    private boolean isPending;
}
