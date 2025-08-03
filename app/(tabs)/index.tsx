import React from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";

export default function AboutScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Box className="p-6">
        <VStack space="lg">
          <Center>
            <Heading className="font-bold text-3xl text-center mb-2">
              📰 Local News
            </Heading>
            <Text className="text-gray-600 text-center">
              AI-Powered Community News Platform
            </Text>
          </Center>

          <Divider className="my-4" />

          <Card className="p-6">
            <VStack space="md">
              <Heading size="lg" className="text-blue-600">
                🎯 How It Works
              </Heading>

              <VStack space="sm">
                <Text className="font-semibold">1. Submit Local News</Text>
                <Text className="text-gray-700 ml-4">
                  Share local events, accidents, festivals, or community
                  happenings in your area.
                </Text>
              </VStack>

              <VStack space="sm">
                <Text className="font-semibold">2. AI Content Review</Text>
                <Text className="text-gray-700 ml-4">
                  Our AI editor (GPT-4o-mini) reviews and refines your
                  submission for clarity and newsworthiness.
                </Text>
              </VStack>

              <VStack space="sm">
                <Text className="font-semibold">3. Public Publication</Text>
                <Text className="text-gray-700 ml-4">
                  Approved news appears in the community feed for everyone to
                  read and bookmark.
                </Text>
              </VStack>
            </VStack>
          </Card>

          <Card className="p-6">
            <VStack space="md">
              <Heading size="lg" className="text-green-600">
                ✨ Features
              </Heading>

              <VStack space="xs">
                <Text>• 📝 Easy news submission form</Text>
                <Text>• 🤖 AI-powered content editing</Text>
                <Text>• 📱 Image upload support</Text>
                <Text>• 🏷️ Category filtering</Text>
                <Text>• 📍 Location-based news</Text>
                <Text>• ⭐ Bookmark favorite articles</Text>
                <Text>• 🔄 Real-time feed updates</Text>
              </VStack>
            </VStack>
          </Card>

          <Card className="p-6">
            <VStack space="md">
              <Heading size="lg" className="text-purple-600">
                📋 Submission Guidelines
              </Heading>

              <VStack space="xs">
                <Text className="font-semibold text-green-700">
                  ✅ We Accept:
                </Text>
                <Text className="ml-4">• Local community events</Text>
                <Text className="ml-4">• Traffic incidents & accidents</Text>
                <Text className="ml-4">• Festival announcements</Text>
                <Text className="ml-4">• Business openings/closings</Text>
                <Text className="ml-4">• School & education news</Text>
                <Text className="ml-4">• Weather-related events</Text>
              </VStack>

              <VStack space="xs">
                <Text className="font-semibold text-red-700">
                  ❌ We Reject:
                </Text>
                <Text className="ml-4">• Spam or advertisements</Text>
                <Text className="ml-4">• Personal grievances</Text>
                <Text className="ml-4">• Fake or unverified news</Text>
                <Text className="ml-4">• Inappropriate content</Text>
                <Text className="ml-4">• Non-local events</Text>
              </VStack>
            </VStack>
          </Card>

          <Card className="p-6 border-blue-200 bg-blue-50">
            <Center>
              <VStack space="sm" className="items-center">
                <Text className="text-blue-800 font-bold text-lg">
                  🚀 Get Started
                </Text>
                <Text className="text-blue-700 text-center">
                  Tap "Submit News" to share your local story or check the "News
                  Feed" to read community updates!
                </Text>
              </VStack>
            </Center>
          </Card>

          <Center className="mt-4">
            <Text className="text-gray-500 text-sm text-center">
              Built with React Native & OpenAI GPT-4o-mini
            </Text>
          </Center>
        </VStack>
      </Box>
    </ScrollView>
  );
}
