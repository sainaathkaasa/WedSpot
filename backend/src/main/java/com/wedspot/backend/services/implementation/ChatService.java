package com.wedspot.backend.services.implementation;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.ChatMessageDTO;
import com.wedspot.backend.services.IChatService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class ChatService implements IChatService {

    @Override
    public APIResponse<List<ChatMessageDTO>> getChatHistory(int page, int pageSize) {
        List<ChatMessageDTO> allMessages = new ArrayList<>(Arrays.asList(
                createMessage("1", "user", "Hello, I need help planning my wedding.", "2024-01-15T10:00:00"),
                createMessage("2", "assistant", "Welcome to WedsPot! I'd be happy to help you plan your special day. What's your wedding date?", "2024-01-15T10:00:05"),
                createMessage("3", "user", "We're planning for June 2024. Looking for floral arrangements.", "2024-01-15T10:01:00"),
                createMessage("4", "assistant", "June is a beautiful month for weddings! I'd recommend roses, peonies, and hydrangeas. Would you like me to show you our floral vendors?", "2024-01-15T10:01:10"),
                createMessage("5", "user", "Yes, please show me the best floral vendors.", "2024-01-15T10:02:00"),
                createMessage("6", "assistant", "Here are our top-rated floral vendors: Blooming Elegance, Petal Paradise, and Garden Dreams. Each has excellent reviews for June weddings.", "2024-01-15T10:02:15"),
                createMessage("7", "user", "What's the average cost for a 200-guest wedding?", "2024-01-15T10:03:00"),
                createMessage("8", "assistant", "For a 200-guest wedding, floral arrangements typically range from $2,000 to $5,000 depending on the complexity and flower types selected.", "2024-01-15T10:03:10"),
                createMessage("9", "user", "Can you help me create a budget breakdown?", "2024-01-15T10:04:00"),
                createMessage("10", "assistant", "Absolutely! Here's a typical budget breakdown: Venue 40%, Catering 25%, Photography 10%, Flowers 10%, Music 5%, Attire 5%, Misc 5%. Shall I create a detailed one for you?", "2024-01-15T10:04:15")
        ));

        int start = (page - 1) * pageSize;
        int end = Math.min(start + pageSize, allMessages.size());

        if (start >= allMessages.size()) {
            APIResponse<List<ChatMessageDTO>> apiResponse = new APIResponse<>();
            apiResponse.setMessage("No more messages");
            apiResponse.setData(Collections.emptyList());
            return apiResponse;
        }

        List<ChatMessageDTO> paginatedMessages = allMessages.subList(start, end);

        APIResponse<List<ChatMessageDTO>> apiResponse = new APIResponse<>();
        apiResponse.setMessage("Chat history retrieved successfully");
        apiResponse.setData(paginatedMessages);
        apiResponse.setTotalElements(allMessages.size());
        apiResponse.setPageNumber(page);
        apiResponse.setPageSize(pageSize);
        apiResponse.setTotalPages((int) Math.ceil((double) allMessages.size() / pageSize));
        return apiResponse;
    }

    private ChatMessageDTO createMessage(String id, String role, String content, String timestamp) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(id);
        dto.setRole(role);
        dto.setContent(content);
        dto.setTimestamp(timestamp);
        return dto;
    }
}
