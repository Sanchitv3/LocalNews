# 📰 Local News App - Setup Guide

This React Native app allows users to submit local news that gets validated and edited by OpenAI GPT-4o-mini before being published to a community news feed.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (macOS) or Android Studio (for device testing)

### Installation

1. **Clone and Install Dependencies**

   ```bash
   cd LocalNews
   npm install
   ```

2. **OpenAI API Setup (Optional but Recommended)**

   The app can work with or without a real OpenAI API key:

   **Option A: With Real OpenAI API (Recommended)**

   - Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a `.env` file in the project root:
     ```
     EXPO_PUBLIC_OPENAI_API_KEY=your_actual_api_key_here
     ```

   **Option B: Mock Mode (Testing)**

   - No setup needed - the app automatically uses mock GPT validation
   - Mock mode simulates content review with basic validation rules

3. **Start the Development Server**

   ```bash
   npm start
   ```

4. **Run on Device/Simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

## 📱 App Features

### 🏠 Three Main Screens

1. **News Feed** 📰

   - View all published local news
   - Filter by city and category
   - Bookmark articles for later
   - Pull to refresh

2. **Submit News** ✍️

   - Complete form with validation
   - Upload images from camera/gallery
   - AI content review and editing
   - Instant feedback on submissions

3. **About** ℹ️
   - App explanation and guidelines
   - Submission dos and don'ts

### 🤖 AI Content Review

The GPT-4o-mini model:

- ✅ **Validates** submissions for newsworthiness
- ✍️ **Edits** content for clarity and professionalism
- 🚫 **Rejects** spam, inappropriate, or non-local content
- 📝 **Provides** clear feedback on rejections

### 💾 Data Storage

- Uses AsyncStorage for local persistence
- No backend required - fully offline capable
- Data survives app restarts

## 🧪 Testing the Complete Flow

### Test Scenario 1: Valid Submission

1. Go to "Submit News" tab
2. Fill out the form:
   ```
   Title: Local Farmers Market Opens This Weekend
   Description: The downtown farmers market is opening this Saturday at 8 AM in Central Park. Local vendors will be selling fresh produce, baked goods, and handmade crafts. The market runs every Saturday through October.
   City: Springfield
   Category: Community Event
   Publisher: John Doe
   Phone: 555-123-4567
   ```
3. Submit and verify it appears in the News Feed

### Test Scenario 2: Invalid Submission (Spam)

1. Try submitting with spam keywords like "buy now" or "click here"
2. Verify the AI rejects it with appropriate feedback

### Test Scenario 3: Image Upload

1. Submit news with an image from camera or gallery
2. Verify image appears in both submission and feed

### Test Scenario 4: Filtering and Bookmarks

1. Submit multiple news items with different cities/categories
2. Test filtering functionality
3. Bookmark articles and view bookmarked items

## 📄 Project Structure

```
LocalNews/
├── app/tabs/(tabs)/
│   ├── feed.tsx          # News feed screen
│   ├── submit.tsx        # News submission form
│   └── index.tsx         # About/info screen
├── types/
│   └── news.ts           # TypeScript type definitions
├── services/
│   ├── openaiService.ts  # GPT-4o-mini integration
│   └── dataService.ts    # AsyncStorage management
└── components/ui/        # Gluestack UI components
```

## 🔧 Configuration

### Environment Variables

- `EXPO_PUBLIC_OPENAI_API_KEY`: Your OpenAI API key (optional)

### Mock vs Real GPT

- **Mock Mode**: Activates when no API key provided
- **Real Mode**: Uses actual GPT-4o-mini for content review
- The app gracefully falls back to mock mode if API calls fail

## 🐛 Troubleshooting

### Common Issues

1. **"expo-image-picker" not working**

   - Ensure camera/gallery permissions are granted
   - Test on physical device (simulator has limited camera support)

2. **OpenAI API errors**

   - Check your API key is valid
   - Ensure you have credits in your OpenAI account
   - App will fall back to mock mode if API fails

3. **AsyncStorage data not persisting**
   - Data is device-specific and survives app restarts
   - Use "Clear All Data" function in dev mode if needed

## 📱 Platform Testing

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

### Web (Limited support)

```bash
npm run web
```

## 🔄 Development Mode Features

- Pull-to-refresh on news feed
- Real-time validation feedback
- Automatic fallback to mock GPT
- Form validation with immediate error messages

## 📞 Support

This is a demo application built for the Local News submission requirements. The GPT prompt can be customized in `services/openaiService.ts` for different content validation needs.
