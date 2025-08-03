import { EditedNews, NewsCategory } from "../types/news";
import { dataService } from "./dataService";

export interface NewsAnalytics {
  totalPosts: number;
  topTopics: Array<{
    category: NewsCategory;
    count: number;
    percentage: number;
  }>;
  topCities: Array<{
    city: string;
    count: number;
    percentage: number;
  }>;
  postsLastWeek: number;
  postsLastMonth: number;
  averagePostsPerDay: number;
  recentActivity: Array<{
    date: string;
    count: number;
  }>;
}

class AnalyticsService {
  async getNewsAnalytics(): Promise<NewsAnalytics> {
    try {
      const news = await dataService.getPublishedNews();
      const totalPosts = news.length;

      if (totalPosts === 0) {
        return this.getEmptyAnalytics();
      }

      const topTopics = this.calculateTopTopics(news);
      const topCities = this.calculateTopCities(news);
      const { postsLastWeek, postsLastMonth } = this.calculateRecentPosts(news);
      const averagePostsPerDay = this.calculateAveragePostsPerDay(news);
      const recentActivity = this.calculateRecentActivity(news);

      return {
        totalPosts,
        topTopics,
        topCities,
        postsLastWeek,
        postsLastMonth,
        averagePostsPerDay,
        recentActivity,
      };
    } catch (error) {
      console.error("Error calculating analytics:", error);
      return this.getEmptyAnalytics();
    }
  }

  private getEmptyAnalytics(): NewsAnalytics {
    return {
      totalPosts: 0,
      topTopics: [],
      topCities: [],
      postsLastWeek: 0,
      postsLastMonth: 0,
      averagePostsPerDay: 0,
      recentActivity: [],
    };
  }

  private calculateTopTopics(news: EditedNews[]): Array<{
    category: NewsCategory;
    count: number;
    percentage: number;
  }> {
    const categoryCount = new Map<NewsCategory, number>();

    news.forEach((item) => {
      const current = categoryCount.get(item.category) || 0;
      categoryCount.set(item.category, current + 1);
    });

    const sortedCategories = Array.from(categoryCount.entries())
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / news.length) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 categories

    return sortedCategories;
  }

  private calculateTopCities(news: EditedNews[]): Array<{
    city: string;
    count: number;
    percentage: number;
  }> {
    const cityCount = new Map<string, number>();

    news.forEach((item) => {
      const current = cityCount.get(item.city) || 0;
      cityCount.set(item.city, current + 1);
    });

    const sortedCities = Array.from(cityCount.entries())
      .map(([city, count]) => ({
        city,
        count,
        percentage: Math.round((count / news.length) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 cities

    return sortedCities;
  }

  private calculateRecentPosts(news: EditedNews[]): {
    postsLastWeek: number;
    postsLastMonth: number;
  } {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const postsLastWeek = news.filter(
      (item) => new Date(item.publishedAt) >= oneWeekAgo
    ).length;

    const postsLastMonth = news.filter(
      (item) => new Date(item.publishedAt) >= oneMonthAgo
    ).length;

    return { postsLastWeek, postsLastMonth };
  }

  private calculateAveragePostsPerDay(news: EditedNews[]): number {
    if (news.length === 0) return 0;

    const dates = news.map((item) => new Date(item.publishedAt));
    const oldestDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const newestDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const daysDiff = Math.max(
      1,
      Math.ceil(
        (newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    return Math.round((news.length / daysDiff) * 10) / 10; // Round to 1 decimal
  }

  private calculateRecentActivity(news: EditedNews[]): Array<{
    date: string;
    count: number;
  }> {
    const last7Days = [];
    const now = new Date();

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split("T")[0];

      const count = news.filter((item) => {
        const itemDate = new Date(item.publishedAt).toISOString().split("T")[0];
        return itemDate === dateString;
      }).length;

      last7Days.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count,
      });
    }

    return last7Days;
  }

  // Get analytics for specific time period
  async getAnalyticsForPeriod(
    startDate: Date,
    endDate: Date
  ): Promise<Partial<NewsAnalytics>> {
    try {
      const allNews = await dataService.getPublishedNews();
      const filteredNews = allNews.filter((item) => {
        const itemDate = new Date(item.publishedAt);
        return itemDate >= startDate && itemDate <= endDate;
      });

      if (filteredNews.length === 0) {
        return { totalPosts: 0, topTopics: [], topCities: [] };
      }

      return {
        totalPosts: filteredNews.length,
        topTopics: this.calculateTopTopics(filteredNews),
        topCities: this.calculateTopCities(filteredNews),
      };
    } catch (error) {
      console.error("Error calculating period analytics:", error);
      return { totalPosts: 0, topTopics: [], topCities: [] };
    }
  }
}

export const analyticsService = new AnalyticsService();
