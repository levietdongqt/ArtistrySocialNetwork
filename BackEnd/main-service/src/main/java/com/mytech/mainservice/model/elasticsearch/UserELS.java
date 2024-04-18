package com.mytech.mainservice.model.elasticsearch;

import com.mytech.mainservice.enums.FriendShipStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(indexName = IndexCreated.INDEX_USER)
public class UserELS {

    @Id
    private String id;
    private final String type = "user";
    private String email;
    private String fullName;
    private String avatar;
    private String coverImage;
    private String bio;
    private List<String> roles;
}
