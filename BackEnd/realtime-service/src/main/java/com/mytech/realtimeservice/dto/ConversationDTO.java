package com.mytech.realtimeservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mytech.realtimeservice.enums.ConversationType;
import com.mytech.realtimeservice.models.Message;
import com.mytech.realtimeservice.models.users.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConversationDTO {
    private String id;
    private List<UserDTO> members;
    private MessageDTO lastMessage;
    private LocalDateTime updatedAt;
    private LocalDateTime createAt;
    private List<MessageDTO> messages = new ArrayList<>();
    private String name;
    private ConversationType type;
}
