package com.wedspot.backend.controller;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.ChatMessageDTO;
import com.wedspot.backend.services.IChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final IChatService chatService;

    @GetMapping("/history")
    public ResponseEntity<APIResponse<List<ChatMessageDTO>>> getChatHistory(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "200") int pageSize) {
        APIResponse<List<ChatMessageDTO>> response = chatService.getChatHistory(page, pageSize);
        return ResponseEntity.ok().body(response);
    }
}
