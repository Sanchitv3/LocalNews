import React, { useState, useEffect } from "react";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";

import { analyticsService, NewsAnalytics } from "@/services/analyticsService";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
}> = ({ title, value, subtitle, icon }) => (
  <Card className="p-4 flex-1">
    <VStack space="xs">
      <HStack className="items-center justify-between">
        <Text className="text-sm text-gray-500 font-medium">{title}</Text>
        {icon && <Text className="text-lg">{icon}</Text>}
      </HStack>
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
      {subtitle && <Text className="text-xs text-gray-400">{subtitle}</Text>}
    </VStack>
  </Card>
);

const TopListCard: React.FC<{
  title: string;
  items: Array<{ name: string; count: number; percentage: number }>;
  icon?: string;
}> = ({ title, items, icon }) => (
  <Card className="p-4">
    <VStack space="md">
      <HStack className="items-center">
        {icon && <Text className="text-lg mr-2">{icon}</Text>}
        <Heading size="md">{title}</Heading>
      </HStack>
      
      {items.length === 0 ? (
        <Text className="text-gray-500 text-center py-4">No data available</Text>
      ) : (
        <VStack space="sm">
          {items.map((item, index) => (
            <HStack key={item.name} className="items-center justify-between">
              <HStack className="items-center flex-1">
                <Badge 
                  variant="outline" 
                  className="mr-2"
                  style={{ backgroundColor: `hsl(${(index * 60) % 360}, 70%, 95%)` }}
                >
                  <Text className="text-xs font-medium">#{index + 1}</Text>
                </Badge>
                <Text className="font-medium flex-1">{item.name}</Text>
              </HStack>
              <VStack className="items-end">
                <Text className="font-bold">{item.count}</Text>
                <Text className="text-xs text-gray-500">{item.percentage}%</Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
      )}
    </VStack>
  </Card>
);

const ActivityChart: React.FC<{
  data: Array<{ date: string; count: number }>;
}> = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  return (
    <Card className="p-4">
      <VStack space="md">
        <HStack className="items-center">
          <Text className="text-lg mr-2">📊</Text>
          <Heading size="md">Recent Activity (Last 7 Days)</Heading>
        </HStack>
        
        {data.length === 0 ? (
          <Text className="text-gray-500 text-center py-4">No activity data</Text>
        ) : (
          <VStack space="sm">
            {data.map((day) => (
              <VStack key={day.date} space="xs">
                <HStack className="justify-between items-center">
                  <Text className="text-sm font-medium">{day.date}</Text>
                  <Text className="text-sm text-gray-600">{day.count} posts</Text>
                </HStack>
                <Progress 
                  value={(day.count / maxCount) * 100} 
                  className="h-2"
                />
              </VStack>
            ))}
          </VStack>
        )}
      </VStack>
    </Card>
  );
};

export default function AnalyticsScreen() {
  const [analytics, setAnalytics] = useState<NewsAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getNewsAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    setIsRefreshing(true);
    await loadAnalytics();
    setIsRefreshing(false);
  };

  // Load analytics when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadAnalytics();
    }, [])
  );

  if (isLoading) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Spinner size="large" />
        <Text className="mt-4 text-gray-500">Loading analytics...</Text>
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box className="flex-1 justify-center items-center p-8">
        <Text className="text-center text-gray-500 text-lg">
          📊 No analytics data available
        </Text>
        <Text className="text-center text-gray-400 mt-2">
          Submit some news to see analytics!
        </Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gray-50">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshAnalytics} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <Box className="bg-white p-4 border-b border-gray-200">
          <Heading size="lg">News Analytics</Heading>
          <Text className="text-gray-500 mt-1">
            Insights about your local news platform
          </Text>
        </Box>

        <VStack space="md" className="p-4">
          {/* Overview Stats */}
          <VStack space="sm">
            <Heading size="md" className="mb-2">Overview</Heading>
            
            <HStack space="sm">
              <StatCard
                title="Total Posts"
                value={analytics.totalPosts}
                icon="📰"
              />
              <StatCard
                title="This Week"
                value={analytics.postsLastWeek}
                subtitle="posts"
                icon="📅"
              />
            </HStack>

            <HStack space="sm">
              <StatCard
                title="This Month"
                value={analytics.postsLastMonth}
                subtitle="posts"
                icon="📊"
              />
              <StatCard
                title="Daily Average"
                value={analytics.averagePostsPerDay}
                subtitle="posts/day"
                icon="⚡"
              />
            </HStack>
          </VStack>

          {/* Top Topics */}
          <TopListCard
            title="Top Topics"
            items={analytics.topTopics.map(topic => ({
              name: topic.category,
              count: topic.count,
              percentage: topic.percentage
            }))}
            icon="🏷️"
          />

          {/* Top Cities */}
          <TopListCard
            title="Top Cities"
            items={analytics.topCities.map(city => ({
              name: city.city,
              count: city.count,
              percentage: city.percentage
            }))}
            icon="📍"
          />

          {/* Activity Chart */}
          <ActivityChart data={analytics.recentActivity} />

          {/* Summary Card */}
          <Card className="p-4">
            <VStack space="sm">
              <Heading size="md">Summary</Heading>
              {analytics.totalPosts === 0 ? (
                <Text className="text-gray-500">
                  No news submissions yet. Be the first to share local news!
                </Text>
              ) : (
                <VStack space="xs">
                  <Text className="text-gray-700">
                    📊 Your platform has <Text className="font-bold">{analytics.totalPosts}</Text> total news posts
                  </Text>
                  {analytics.topTopics.length > 0 && (
                    <Text className="text-gray-700">
                      🏆 Most popular topic: <Text className="font-bold">{analytics.topTopics[0].category}</Text> ({analytics.topTopics[0].count} posts)
                    </Text>
                  )}
                  {analytics.topCities.length > 0 && (
                    <Text className="text-gray-700">
                      🌆 Most active city: <Text className="font-bold">{analytics.topCities[0].city}</Text> ({analytics.topCities[0].count} posts)
                    </Text>
                  )}
                  <Text className="text-gray-700">
                    📈 Average activity: <Text className="font-bold">{analytics.averagePostsPerDay}</Text> posts per day
                  </Text>
                </VStack>
              )}
            </VStack>
          </Card>
        </VStack>
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});