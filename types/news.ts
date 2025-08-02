export interface NewsSubmission {
  id: string;
  title: string;
  description: string;
  city: string;
  category: NewsCategory;
  publisherName: string;
  publisherPhone: string;
  imageUri?: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export interface EditedNews {
  id: string;
  originalSubmissionId: string;
  editedTitle: string;
  editedSummary: string;
  city: string;
  category: NewsCategory;
  publisherName: string;
  maskedPhone: string;
  publishedAt: string;
  isBookmarked?: boolean;
  imageUri?: string;
}

export type NewsCategory =
  | "Accident"
  | "Festival"
  | "Community Event"
  | "Sports"
  | "Education"
  | "Business"
  | "Politics"
  | "Weather"
  | "Other";

export interface GPTValidationRequest {
  title: string;
  description: string;
  city: string;
  category: string;
}

export interface GPTValidationResponse {
  isValid: boolean;
  editedTitle?: string;
  editedSummary?: string;
  rejectionReason?: string;
}

export interface NewsFilter {
  city?: string;
  category?: NewsCategory;
}

export const NEWS_CATEGORIES: NewsCategory[] = [
  "Accident",
  "Festival",
  "Community Event",
  "Sports",
  "Education",
  "Business",
  "Politics",
  "Weather",
  "Other",
];
