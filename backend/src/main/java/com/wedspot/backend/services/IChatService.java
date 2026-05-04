package com.wedspot.backend.services;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.ChatMessageDTO;

import java.util.List;

public interface IChatService {
    APIResponse<List<ChatMessageDTO>> getChatHistory(int page, int pageSize);
}
