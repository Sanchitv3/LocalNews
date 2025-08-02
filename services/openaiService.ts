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
      const systemPrompt = `You are an AI news editor for a local news platform. Your job is to:

1. Check if the submitted story is relevant local news (real events, not spam/inappropriate content)
2. If appropriate, rewrite it into a clean title (max 80 characters) and a brief summary (2-3 sentences, max 200 characters)
3. If spam, inappropriate, or not newsworthy, provide a brief rejection reason

Respond ONLY with valid JSON in this exact format:
{
  "isValid": boolean,
  "editedTitle": "string" (only if isValid is true),
  "editedSummary": "string" (only if isValid is true),
  "rejectionReason": "string" (only if isValid is false)
}

Guidelines:
- Accept genuine local events, community news, accidents, festivals, etc.
- Reject spam, advertisements, personal grievances, fake news, inappropriate content
- Make the language professional but accessible
- Focus on factual, newsworthy content`;

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

    // Simple mock validation logic
    const lowerTitle = title.toLowerCase();
    const lowerDescription = description.toLowerCase();

    // Check for spam/inappropriate content
    const spamKeywords = [
      "buy now",
      "click here",
      "free money",
      "scam",
      "fake",
    ];
    const hasSpam = spamKeywords.some(
      (keyword) =>
        lowerTitle.includes(keyword) || lowerDescription.includes(keyword)
    );

    if (hasSpam) {
      return {
        isValid: false,
        rejectionReason:
          "Content appears to be spam or inappropriate for local news.",
      };
    }

    // Check minimum content length
    if (description.length < 50) {
      return {
        isValid: false,
        rejectionReason:
          "Description is too short. Please provide more details about the event.",
      };
    }

    // Mock editing - make it sound more professional
    const editedTitle =
      title.length > 80 ? title.substring(0, 77) + "..." : title;
    const editedSummary =
      description.length > 200
        ? description.substring(0, 197) + "..."
        : description;

    return {
      isValid: true,
      editedTitle,
      editedSummary,
    };
  }
}

export const openaiService = new OpenAIService();
