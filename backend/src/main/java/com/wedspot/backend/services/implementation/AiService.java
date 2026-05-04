package com.wedspot.backend.services.implementation;

import com.wedspot.backend.Model.APIResponse;
import com.wedspot.backend.Model.AiDesignRequest;
import com.wedspot.backend.Model.AiDesignResponse;
import com.wedspot.backend.services.IAiService;
import org.springframework.stereotype.Service;

@Service
public class AiService implements IAiService {

    @Override
    public APIResponse<AiDesignResponse> getAiDesign(AiDesignRequest request) {
        String suggestion = buildSuggestion(request);
        String description = buildDescription(request);
        String[] tips = buildTips(request);

        AiDesignResponse response = new AiDesignResponse();
        response.setSuggestion(suggestion);
        response.setDescription(description);
        response.setTips(tips);

        APIResponse<AiDesignResponse> apiResponse = new APIResponse<>();
        apiResponse.setMessage("AI design suggestions generated successfully");
        apiResponse.setData(response);
        return apiResponse;
    }

    private String buildSuggestion(AiDesignRequest request) {
        String productType = request.getProductType() != null ? request.getProductType().toLowerCase() : "";
        String theme = request.getTheme() != null ? request.getTheme().toLowerCase() : "";
        String colorScheme = request.getColorScheme() != null ? request.getColorScheme().toLowerCase() : "";

        StringBuilder suggestion = new StringBuilder();

        if (productType.contains("floral") || productType.contains("bouquet")) {
            suggestion.append("For your floral arrangements, we recommend a mix of seasonal blooms with ");
            if (theme.contains("rustic")) {
                suggestion.append("wildflowers, eucalyptus, and dried elements for a natural, organic feel. ");
            } else if (theme.contains("modern")) {
                suggestion.append("architectural flowers like orchids and calla lilies with clean greenery. ");
            } else if (theme.contains("romantic")) {
                suggestion.append("soft roses, peonies, and ranunculus in cascading arrangements. ");
            } else {
                suggestion.append("a curated selection of premium seasonal flowers. ");
            }
        } else if (productType.contains("photography") || productType.contains("photo")) {
            suggestion.append("Consider a blend of candid and posed photography with ");
            if (theme.contains("rustic")) {
                suggestion.append("natural outdoor lighting and scenic backdrops. ");
            } else if (theme.contains("modern")) {
                suggestion.append("creative angles, urban settings, and artistic compositions. ");
            } else if (theme.contains("romantic")) {
                suggestion.append("golden hour shots and intimate moment captures. ");
            } else {
                suggestion.append("a professional mix of traditional and contemporary styles. ");
            }
        } else if (productType.contains("catering") || productType.contains("food")) {
            suggestion.append("A curated menu featuring ");
            if (theme.contains("rustic")) {
                suggestion.append("farm-to-table options, BBQ stations, and comfort food elegantly presented. ");
            } else if (theme.contains("modern")) {
                suggestion.append("fusion cuisine, molecular gastronomy elements, and artistic plating. ");
            } else if (theme.contains("romantic")) {
                suggestion.append("classic fine dining with French-inspired dishes and wine pairings. ");
            } else {
                suggestion.append("a diverse menu with international and local favorites. ");
            }
        } else {
            suggestion.append("Based on your preferences, we suggest a cohesive design that incorporates ");
            suggestion.append("elegant elements tailored to your wedding vision. ");
        }

        if (!colorScheme.isEmpty()) {
            suggestion.append("The ").append(colorScheme).append(" color palette will beautifully complement the overall aesthetic.");
        }

        return suggestion.toString();
    }

    private String buildDescription(AiDesignRequest request) {
        StringBuilder desc = new StringBuilder();
        desc.append("Your wedding design concept features ");

        if (request.getTheme() != null) {
            desc.append("a ").append(request.getTheme()).append(" style ");
        } else {
            desc.append("a beautifully curated style ");
        }

        if (request.getColorScheme() != null) {
            desc.append("with a ").append(request.getColorScheme()).append(" color scheme ");
        }

        desc.append("that creates an unforgettable atmosphere for your special day. ");

        if (request.getAdditionalDetails() != null && !request.getAdditionalDetails().isEmpty()) {
            desc.append("Additional notes: ").append(request.getAdditionalDetails());
        }

        return desc.toString();
    }

    private String[] buildTips(AiDesignRequest request) {
        return new String[]{
                "Book your vendors 6-12 months in advance for the best selection",
                "Consider seasonal flowers to reduce costs and ensure freshness",
                "Create a detailed timeline for your wedding day",
                "Have a backup plan for outdoor events",
                "Allocate 10-15% of your budget for unexpected expenses",
                "Schedule a tasting session with your caterer",
                "Request a detailed contract from each vendor",
                "Consider hiring a day-of coordinator for smooth execution"
        };
    }
}
