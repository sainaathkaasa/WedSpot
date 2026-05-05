package com.wedspot.backend.services;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.AiDesignRequest;
import com.wedspot.backend.Model.AiDesignResponse;

public interface IAiService {
    APIResponse<AiDesignResponse> getAiDesign(AiDesignRequest request);
}
