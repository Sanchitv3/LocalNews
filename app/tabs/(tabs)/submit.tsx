import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as ImagePicker from "expo-image-picker";

import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form-control";
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
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import { ChevronDownIcon } from "@/components/ui/icon";

import {
  NEWS_CATEGORIES,
  NewsCategory,
  NewsSubmission,
  EditedNews,
} from "@/types/news";
import { openaiService } from "@/services/openaiService";
import { dataService } from "@/services/dataService";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  city: z.string().min(2, "City is required"),
  category: z.enum(NEWS_CATEGORIES as [NewsCategory, ...NewsCategory[]]),
  publisherName: z.string().min(2, "Publisher name is required"),
  publisherPhone: z.string().min(10, "Valid phone number is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function SubmitNewsScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      city: "",
      category: "Other",
      publisherName: "",
      publisherPhone: "",
    },
  });

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll permissions to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Please grant camera permissions to take photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const showImagePicker = () => {
    Alert.alert("Select Image", "Choose how you want to add an image", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Create submission object
      const submission: NewsSubmission = {
        id: dataService.generateId(),
        title: data.title,
        description: data.description,
        city: data.city,
        category: data.category,
        publisherName: data.publisherName,
        publisherPhone: data.publisherPhone,
        imageUri: selectedImage || undefined,
        submittedAt: new Date().toISOString(),
        status: "pending",
      };

      // Save submission first
      await dataService.saveSubmission(submission);

      // Validate with GPT
      const gptResponse = await openaiService.validateAndEditNews({
        title: data.title,
        description: data.description,
        city: data.city,
        category: data.category,
      });

      if (
        gptResponse.isValid &&
        gptResponse.editedTitle &&
        gptResponse.editedSummary
      ) {
        // Update submission status to approved
        await dataService.updateSubmissionStatus(submission.id, "approved");

        // Create edited news for publication
        const editedNews: EditedNews = {
          id: dataService.generateId(),
          originalSubmissionId: submission.id,
          editedTitle: gptResponse.editedTitle,
          editedSummary: gptResponse.editedSummary,
          city: data.city,
          category: data.category,
          publisherName: data.publisherName,
          maskedPhone: dataService.maskPhoneNumber(data.publisherPhone),
          publishedAt: new Date().toISOString(),
          imageUri: selectedImage || undefined,
        };

        // Publish the news
        await dataService.publishNews(editedNews);

        Alert.alert(
          "News Submitted Successfully!",
          `Your news has been reviewed and published with the title: "${gptResponse.editedTitle}"`,
          [
            {
              text: "OK",
              onPress: () => {
                reset();
                setSelectedImage(null);
              },
            },
          ]
        );
      } else {
        // Update submission status to rejected
        await dataService.updateSubmissionStatus(
          submission.id,
          "rejected",
          gptResponse.rejectionReason
        );

        Alert.alert(
          "Submission Rejected",
          gptResponse.rejectionReason ||
            "Your submission did not meet our guidelines. Please review and try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert(
        "Submission Error",
        "There was an error processing your submission. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Box className="p-6">
        <VStack space="lg">
          <Heading size="xl" className="text-center mb-4">
            Submit Local News
          </Heading>

          {/* Title Field */}
          <FormControl isInvalid={!!errors.title}>
            <Text className="font-semibold mb-2">News Title *</Text>
            <Controller
              name="title"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Enter news title..."
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </Input>
              )}
            />
            {errors.title && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </Text>
            )}
          </FormControl>

          {/* Description Field */}
          <FormControl isInvalid={!!errors.description}>
            <Text className="font-semibold mb-2">
              Description * (min 50 characters)
            </Text>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Textarea className="min-h-[100px]">
                  <TextareaInput
                    placeholder="Describe the news event in detail..."
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </Textarea>
              )}
            />
            {errors.description && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </Text>
            )}
          </FormControl>

          {/* City Field */}
          <FormControl isInvalid={!!errors.city}>
            <Text className="font-semibold mb-2">City *</Text>
            <Controller
              name="city"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Enter city name..."
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </Input>
              )}
            />
            {errors.city && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.city.message}
              </Text>
            )}
          </FormControl>

          {/* Category Field */}
          <FormControl isInvalid={!!errors.category}>
            <Text className="font-semibold mb-2">Category *</Text>
            <Controller
              name="category"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select selectedValue={value} onValueChange={onChange}>
                  <SelectTrigger>
                    <SelectInput placeholder="Select category" />
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
              )}
            />
            {errors.category && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </Text>
            )}
          </FormControl>

          {/* Publisher Name Field */}
          <FormControl isInvalid={!!errors.publisherName}>
            <Text className="font-semibold mb-2">Your Name *</Text>
            <Controller
              name="publisherName"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Enter your first name..."
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </Input>
              )}
            />
            {errors.publisherName && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.publisherName.message}
              </Text>
            )}
          </FormControl>

          {/* Phone Number Field */}
          <FormControl isInvalid={!!errors.publisherPhone}>
            <Text className="font-semibold mb-2">Phone Number *</Text>
            <Controller
              name="publisherPhone"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Enter your phone number..."
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="phone-pad"
                  />
                </Input>
              )}
            />
            {errors.publisherPhone && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.publisherPhone.message}
              </Text>
            )}
          </FormControl>

          {/* Image Upload */}
          <Box>
            <Text className="font-semibold mb-2">Image (Optional)</Text>
            <Pressable onPress={showImagePicker} disabled={isSubmitting}>
              <Box className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[120px] justify-center items-center">
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={{ width: "100%", height: 120, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                ) : (
                  <VStack space="sm" className="items-center">
                    <Text className="text-gray-500 text-center">
                      Tap to add image
                    </Text>
                    <Text className="text-gray-400 text-sm text-center">
                      From camera or gallery
                    </Text>
                  </VStack>
                )}
              </Box>
            </Pressable>
          </Box>

          {/* Submit Button */}
          <Button
            size="lg"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="mt-6"
          >
            {isSubmitting ? (
              <HStack space="sm" className="items-center">
                <Spinner size="small" />
                <Text className="text-white">Submitting...</Text>
              </HStack>
            ) : (
              <Text className="text-white font-semibold">Submit News</Text>
            )}
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
