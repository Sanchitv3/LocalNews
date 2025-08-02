import React, { useState, useEffect, useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
} from "@/components/ui/select";
import { Pressable } from "@/components/ui/pressable";
import { Badge } from "@/components/ui/badge";
import { Image } from "@/components/ui/image";
import { Spinner } from "@/components/ui/spinner";
import { ChevronDownIcon } from "@/components/ui/icon";

import { EditedNews, NEWS_CATEGORIES, NewsFilter } from "@/types/news";
import { dataService } from "@/services/dataService";

interface NewsCardProps {
  news: EditedNews;
  onBookmarkPress: (newsId: string) => void;
  isBookmarked: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({
  news,
  onBookmarkPress,
  isBookmarked,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="m-2 p-4">
      <VStack space="md">
        {/* Header with category and bookmark */}
        <HStack className="justify-between items-start">
          <Badge variant="outline" className="self-start">
            <Text className="text-xs font-medium">{news.category}</Text>
          </Badge>
          <Pressable onPress={() => onBookmarkPress(news.id)}>
            <Text
              className={`text-lg ${
                isBookmarked ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              {isBookmarked ? "⭐" : "☆"}
            </Text>
          </Pressable>
        </HStack>

        {/* Image if available */}
        {news.imageUri && (
          <Image
            source={{ uri: news.imageUri }}
            style={{ width: "100%", height: 160, borderRadius: 8 }}
            resizeMode="cover"
          />
        )}

        {/* Title */}
        <Heading size="md" className="font-bold">
          {news.editedTitle}
        </Heading>

        {/* Summary */}
        <Text className="text-gray-700 leading-relaxed">
          {news.editedSummary}
        </Text>

        {/* Footer info */}
        <VStack space="xs">
          <HStack className="justify-between items-center">
            <Text className="text-sm text-gray-500">📍 {news.city}</Text>
            <Text className="text-sm text-gray-500">
              {formatDate(news.publishedAt)}
            </Text>
          </HStack>
          <HStack className="justify-between items-center">
            <Text className="text-sm text-gray-500">
              By: {news.publisherName}
            </Text>
            <Text className="text-sm text-gray-500">📞 {news.maskedPhone}</Text>
          </HStack>
        </VStack>
      </VStack>
    </Card>
  );
};

export default function NewsFeedScreen() {
  const [news, setNews] = useState<EditedNews[]>([]);
  const [filteredNews, setFilteredNews] = useState<EditedNews[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [filters, setFilters] = useState<NewsFilter>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const loadNews = async () => {
    try {
      setIsLoading(true);
      const [newsData, bookmarksData] = await Promise.all([
        dataService.getPublishedNews(),
        dataService.getBookmarks(),
      ]);
      setNews(newsData);
      setBookmarks(bookmarksData);
    } catch (error) {
      console.error("Error loading news:", error);
      Alert.alert("Error", "Failed to load news. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshNews = async () => {
    setIsRefreshing(true);
    await loadNews();
    setIsRefreshing(false);
  };

  // Load news when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadNews();
    }, [])
  );

  // Apply filters whenever news, filters, or bookmark mode changes
  useEffect(() => {
    let filtered = [...news];

    // Apply bookmarks filter
    if (showBookmarksOnly) {
      filtered = filtered.filter((item) => bookmarks.includes(item.id));
    }

    // Apply city filter
    if (filters.city && filters.city.trim()) {
      filtered = filtered.filter((item) =>
        item.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    setFilteredNews(filtered);
  }, [news, filters, bookmarks, showBookmarksOnly]);

  const handleBookmarkPress = async (newsId: string) => {
    try {
      const newBookmarkStatus = await dataService.toggleBookmark(newsId);

      // Update local bookmarks state
      setBookmarks((prev) =>
        newBookmarkStatus
          ? [...prev, newsId]
          : prev.filter((id) => id !== newsId)
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      Alert.alert("Error", "Failed to update bookmark. Please try again.");
    }
  };

  const clearFilters = () => {
    setFilters({});
    setShowBookmarksOnly(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.city) count++;
    if (filters.category) count++;
    if (showBookmarksOnly) count++;
    return count;
  };

  const renderNewsItem = ({ item }: { item: EditedNews }) => (
    <NewsCard
      news={item}
      onBookmarkPress={handleBookmarkPress}
      isBookmarked={bookmarks.includes(item.id)}
    />
  );

  const renderEmptyState = () => (
    <Box className="flex-1 justify-center items-center p-8">
      <Text className="text-center text-gray-500 text-lg mb-4">
        {showBookmarksOnly ? "📌 No bookmarked news" : "📰 No news available"}
      </Text>
      <Text className="text-center text-gray-400 mb-6">
        {showBookmarksOnly
          ? "Bookmark some news articles to see them here"
          : "Be the first to submit local news!"}
      </Text>
      {(filters.city || filters.category || showBookmarksOnly) && (
        <Button onPress={clearFilters} variant="outline">
          <Text>Clear Filters</Text>
        </Button>
      )}
    </Box>
  );

  if (isLoading) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Spinner size="large" />
        <Text className="mt-4 text-gray-500">Loading news...</Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gray-50">
      {/* Header and Filters */}
      <Box className="bg-white p-4 border-b border-gray-200">
        <VStack space="md">
          <HStack className="justify-between items-center">
            <Heading size="lg">Local News Feed</Heading>
            <Button
              size="sm"
              variant={showBookmarksOnly ? "solid" : "outline"}
              onPress={() => setShowBookmarksOnly(!showBookmarksOnly)}
            >
              <Text
                className={showBookmarksOnly ? "text-white" : "text-blue-600"}
              >
                {showBookmarksOnly ? "⭐ Bookmarks" : "☆ Show Bookmarks"}
              </Text>
            </Button>
          </HStack>

          {/* Filter Controls */}
          <HStack space="md">
            <Box className="flex-1">
              <Select
                selectedValue={filters.city || ""}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, city: value || undefined }))
                }
              >
                <SelectTrigger>
                  <SelectInput placeholder="All Cities" />
                  <SelectIcon>
                    <ChevronDownIcon />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectScrollView>
                      <SelectItem label="All Cities" value="" />
                      {/* Get unique cities from news */}
                      {Array.from(new Set(news.map((item) => item.city))).map(
                        (city) => (
                          <SelectItem key={city} label={city} value={city} />
                        )
                      )}
                    </SelectScrollView>
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>

            <Box className="flex-1">
              <Select
                selectedValue={filters.category || ""}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: (value as any) || undefined,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectInput placeholder="All Categories" />
                  <SelectIcon>
                    <ChevronDownIcon />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectScrollView>
                      <SelectItem label="All Categories" value="" />
                      {NEWS_CATEGORIES.map((category) => (
                        <SelectItem
                          key={category}
                          label={category}
                          value={category}
                        />
                      ))}
                    </SelectScrollView>
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>
          </HStack>

          {/* Active filters indicator */}
          {getActiveFiltersCount() > 0 && (
            <HStack className="justify-between items-center">
              <Text className="text-sm text-gray-600">
                {getActiveFiltersCount()} filter(s) active •{" "}
                {filteredNews.length} articles
              </Text>
              <Pressable onPress={clearFilters}>
                <Text className="text-sm text-blue-600">Clear All</Text>
              </Pressable>
            </HStack>
          )}
        </VStack>
      </Box>

      {/* News List */}
      <FlatList
        data={filteredNews}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshNews} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          filteredNews.length === 0
            ? styles.emptyContainer
            : styles.listContainer
        }
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
});
