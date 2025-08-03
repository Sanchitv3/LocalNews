import OpenAI from "openai";
import { GPTValidationRequest, GPTValidationResponse } from "../types/news";

// Configuration - In a real app, this would be in environment variables
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || "mock-key";
const USE_MOCK_GPT = !OPENAI_API_KEY || OPENAI_API_KEY === "mock-key";

class OpenAIService {
  private client: OpenAI | null = null;

  constructor() {
    if (!USE_MOCK_GPT) {
      this.client = new OpenAI({
        apiKey: OPENAI_API_KEY,
      });
    }
  }

  async validateAndEditNews(
    request: GPTValidationRequest
  ): Promise<GPTValidationResponse> {
    if (USE_MOCK_GPT) {
      return this.mockGPTValidation(request);
    }

    try {
      const systemPrompt = `You are an AI news editor for a local news platform. Your job is to validate and edit user-submitted news for local communities.

VALIDATION CRITERIA:
1. RELEVANCE CHECK: Must be about LOCAL HAPPENINGS
   - Accept: Local events, community news, accidents, festivals, business openings, school events, local government, weather events affecting the area
   - Reject: National/international news, spam, advertisements, personal grievances, non-news content

2. CONTENT SAFETY CHECK: Flag harmful or inappropriate content
   - Reject: Hate speech, violence, harassment, false information, inappropriate content, commercial advertisements

3. QUALITY CHECK: Must be newsworthy and substantial
   - Reject: Trivial personal matters, incomplete information, incoherent content

EDITING REQUIREMENTS (only if content passes validation):
- Create a CONCISE, CLEAR title (max 80 characters)
- Write a 2-3 sentence summary that captures the key facts
- Use professional but accessible language
- Focus on WHO, WHAT, WHEN, WHERE

Respond ONLY with valid JSON in this exact format:
{
  "isValid": boolean,
  "editedTitle": "string" (only if isValid is true),
  "editedSummary": "string" (only if isValid is true, must be 2-3 complete sentences),
  "rejectionReason": "string" (only if isValid is false, explain why it was rejected)
}

CRITICAL: editedSummary must be exactly 2-3 complete sentences, no more, no less.`;

      const userPrompt = `Please validate and edit this local news submission:

Title: ${request.title}
Description: ${request.description}
City: ${request.city}
Category: ${request.category}`;

      const completion = await this.client!.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.3,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from GPT");
      }

      try {
        const response = JSON.parse(content) as GPTValidationResponse;
        return response;
      } catch (parseError) {
        console.error("Failed to parse GPT response:", content);
        throw new Error("Invalid response format from GPT");
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Fallback to mock validation if API fails
      return this.mockGPTValidation(request);
    }
  }

  private mockGPTValidation(
    request: GPTValidationRequest
  ): GPTValidationResponse {
    const { title, description, city, category } = request;

    // Enhanced mock validation logic
    const lowerTitle = title.toLowerCase();
    const lowerDescription = description.toLowerCase();
    const fullText = `${lowerTitle} ${lowerDescription}`;

    // 1. Check for spam/inappropriate content
    const spamKeywords = [
      "buy now",
      "click here",
      "free money",
      "scam",
      "fake news",
      "advertisement",
      "promote",
      "sale",
      "discount",
      "offer",
    ];
    const inappropriateKeywords = [
      "hate",
      "violence",
      "harassment",
      "explicit",
    ];

    const hasSpam = spamKeywords.some((keyword) => fullText.includes(keyword));
    const hasInappropriate = inappropriateKeywords.some((keyword) =>
      fullText.includes(keyword)
    );

    if (hasSpam) {
      return {
        isValid: false,
        rejectionReason:
          "Content appears to be spam or commercial advertisement, not suitable for local news.",
      };
    }

    if (hasInappropriate) {
      return {
        isValid: false,
        rejectionReason:
          "Content contains inappropriate or harmful material that violates our community guidelines.",
      };
    }

    // 2. Check for local relevance
    const nonLocalKeywords = [
      "national",
      "international",
      "worldwide",
      "global",
      "federal government",
      "president",
      "congress",
      "senate",
      "foreign country",
    ];
    const hasNonLocal = nonLocalKeywords.some((keyword) =>
      fullText.includes(keyword)
    );

    if (hasNonLocal) {
      return {
        isValid: false,
        rejectionReason:
          "Content appears to be about national/international news rather than local happenings.",
      };
    }

    // 3. Check minimum content quality
    if (description.length < 50) {
      return {
        isValid: false,
        rejectionReason:
          "Description is too short. Please provide more details about the local event.",
      };
    }

    if (title.length < 10) {
      return {
        isValid: false,
        rejectionReason:
          "Title is too brief. Please provide a more descriptive title for the news event.",
      };
    }

    // 4. Mock editing - create professional title and 2-3 sentence summary
    let editedTitle = title.trim();
    if (editedTitle.length > 80) {
      editedTitle = editedTitle.substring(0, 77) + "...";
    }

    // Create a 2-3 sentence summary from the description
    const sentences = description
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    let editedSummary: string;

    if (sentences.length >= 2) {
      // Take first 2-3 sentences and clean them up
      editedSummary =
        sentences
          .slice(0, 3)
          .map((s) => s.trim())
          .join(". ") + ".";
    } else {
      // Create a professional summary from the description
      const cleanDesc = description.trim().replace(/\s+/g, " ");
      if (cleanDesc.length > 150) {
        editedSummary = cleanDesc.substring(0, 147) + "...";
      } else {
        editedSummary = cleanDesc + (cleanDesc.endsWith(".") ? "" : ".");
      }
      // Add a second sentence to meet the 2-3 sentence requirement
      editedSummary += ` This event took place in ${city}.`;
    }

    return {
      isValid: true,
      editedTitle,
      editedSummary,
    };
  }
}

export const openaiService = new OpenAIService();
