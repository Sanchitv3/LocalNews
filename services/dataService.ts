import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewsSubmission, EditedNews, NewsFilter } from "../types/news";

const SUBMISSIONS_KEY = "news_submissions";
const PUBLISHED_NEWS_KEY = "published_news";
const BOOKMARKS_KEY = "bookmarked_news";

class DataService {
  // News Submissions Management
  async saveSubmission(submission: NewsSubmission): Promise<void> {
    try {
      const existingSubmissions = await this.getSubmissions();
      const updatedSubmissions = [...existingSubmissions, submission];
      await AsyncStorage.setItem(
        SUBMISSIONS_KEY,
        JSON.stringify(updatedSubmissions)
      );
    } catch (error) {
      console.error("Error saving submission:", error);
      throw new Error("Failed to save news submission");
    }
  }

  async getSubmissions(): Promise<NewsSubmission[]> {
    try {
      const data = await AsyncStorage.getItem(SUBMISSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting submissions:", error);
      return [];
    }
  }

  async updateSubmissionStatus(
    submissionId: string,
    status: "approved" | "rejected",
    rejectionReason?: string
  ): Promise<void> {
    try {
      const submissions = await this.getSubmissions();
      const updatedSubmissions = submissions.map((submission) =>
        submission.id === submissionId
          ? { ...submission, status, rejectionReason }
          : submission
      );
      await AsyncStorage.setItem(
        SUBMISSIONS_KEY,
        JSON.stringify(updatedSubmissions)
      );
    } catch (error) {
      console.error("Error updating submission status:", error);
      throw new Error("Failed to update submission status");
    }
  }

  // Published News Management
  async publishNews(news: EditedNews): Promise<void> {
    try {
      const existingNews = await this.getPublishedNews();
      const updatedNews = [news, ...existingNews]; // Add to beginning for newest first
      await AsyncStorage.setItem(
        PUBLISHED_NEWS_KEY,
        JSON.stringify(updatedNews)
      );
    } catch (error) {
      console.error("Error publishing news:", error);
      throw new Error("Failed to publish news");
    }
  }

  async getPublishedNews(filters?: NewsFilter): Promise<EditedNews[]> {
    try {
      const data = await AsyncStorage.getItem(PUBLISHED_NEWS_KEY);
      let news: EditedNews[] = data ? JSON.parse(data) : [];

      // Apply filters if provided
      if (filters) {
        if (filters.city) {
          news = news.filter((item) =>
            item.city.toLowerCase().includes(filters.city!.toLowerCase())
          );
        }
        if (filters.category) {
          news = news.filter((item) => item.category === filters.category);
        }
      }

      return news;
    } catch (error) {
      console.error("Error getting published news:", error);
      return [];
    }
  }

  // Bookmark Management
  async toggleBookmark(newsId: string): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      const isBookmarked = bookmarks.includes(newsId);

      let updatedBookmarks: string[];
      if (isBookmarked) {
        updatedBookmarks = bookmarks.filter((id) => id !== newsId);
      } else {
        updatedBookmarks = [...bookmarks, newsId];
      }

      await AsyncStorage.setItem(
        BOOKMARKS_KEY,
        JSON.stringify(updatedBookmarks)
      );
      return !isBookmarked; // Return new bookmark status
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      throw new Error("Failed to toggle bookmark");
    }
  }

  async getBookmarks(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(BOOKMARKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting bookmarks:", error);
      return [];
    }
  }

  async getBookmarkedNews(): Promise<EditedNews[]> {
    try {
      const bookmarks = await this.getBookmarks();
      const allNews = await this.getPublishedNews();
      return allNews.filter((news) => bookmarks.includes(news.id));
    } catch (error) {
      console.error("Error getting bookmarked news:", error);
      return [];
    }
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        SUBMISSIONS_KEY,
        PUBLISHED_NEWS_KEY,
        BOOKMARKS_KEY,
      ]);
    } catch (error) {
      console.error("Error clearing data:", error);
      throw new Error("Failed to clear data");
    }
  }

  // Helper to mask phone number
  maskPhoneNumber(phone: string): string {
    if (phone.length <= 4) return phone;
    const visible = 3;
    const start = phone.substring(0, visible);
    const end = phone.substring(phone.length - 2);
    const middle = "*".repeat(Math.max(0, phone.length - visible - 2));
    return start + middle + end;
  }

  // Generate unique ID
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const dataService = new DataService();
