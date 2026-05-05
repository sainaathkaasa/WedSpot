package com.wedspot.backend.Model;

import lombok.Data;

@Data
public class ChatMessageDTO {
    private String id;
    private String role;
    private String content;
    private String timestamp;
}
