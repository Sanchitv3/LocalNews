# 📰 LocalNews - AI-Powered Community News Platform

> **A React Native mobile application that empowers communities to share local news with AI-assisted content validation and editorial enhancement.**

![React Native](https://img.shields.io/badge/React%20Native-0.76.6-blue)
![Expo](https://img.shields.io/badge/Expo-~52.0.25-000020)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green)

## 🎯 Project Overview

LocalNews is an innovative mobile application that bridges citizen journalism with professional editorial standards. Users can submit local news stories, which are automatically validated and refined by OpenAI's GPT-4o-mini before being published to a community news feed.

### ✨ Key Features
- **📝 Smart News Submission** - AI-validated form with image upload
- **🤖 Intelligent Content Review** - GPT-4o-mini powered validation and editing
- **📰 Dynamic News Feed** - Filterable, bookmarkable community content
- **📊 Analytics Dashboard** - Comprehensive publishing insights
- **👤 User Profiles** - Personal dashboards with submission tracking
- **🔄 Offline Capability** - Full functionality without internet

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (macOS) or Android Studio

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd LocalNews
   npm install
   ```

2. **OpenAI API Setup** (Optional but Recommended)
   
   Create a `.env` file in the project root:
   ```env
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   *Note: The app works with mock validation if no API key is provided.*

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Run on Device**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator  
   - Scan QR code with Expo Go for physical device

---

## 📱 Platform Support

| Platform | Status | Notes |
|----------|---------|-------|
| 📱 iOS | ✅ Full Support | Native functionality via Expo |
| 🤖 Android | ✅ Full Support | Complete feature parity |
| 🌐 Web | ⚠️ Limited | Development/testing only |

---

## 🎮 How to Use

### 1. Submit Local News
Navigate to the "Submit News" tab and fill out the form:
- **Title**: Catchy headline for your story
- **Description**: Detailed story (minimum 50 characters)
- **Location**: City where the news occurred
- **Category**: Type of news (Festival, Accident, Sports, etc.)
- **Contact Info**: Your name and phone number
- **Image**: Optional photo from camera or gallery

### 2. AI Content Review
Your submission is automatically:
- ✅ Validated for local relevance and appropriateness
- ✍️ Edited for clarity and professional tone
- 🚫 Rejected if spam or inappropriate (with clear feedback)

### 3. Browse Community News
View published articles in the News Feed:
- Filter by city or category
- Bookmark articles for later reading
- See masked publisher contact information
- Pull to refresh for latest content

### 4. Track Your Impact
Use the Analytics dashboard to see:
- Total published articles
- Most popular categories
- Geographic distribution
- Recent activity trends

---

## 🏗️ Project Structure

```
LocalNews/
├── 📱 app/                       # Expo Router screens
├── 🎨 components/                # Reusable UI components  
├── ⚙️ services/                 # Business logic & APIs
├── 📋 types/                    # TypeScript definitions
├── 🎯 assets/                   # Images, fonts, icons
└── 📚 docs/                     # Project documentation
```

---

## 🔧 Development Scripts

```bash
npm start          # Start Expo development server
npm run android    # Launch Android emulator
npm run ios        # Launch iOS simulator  
npm run web        # Start web development server
npm test           # Run Jest test suite
npm run lint       # Check code style with ESLint
```

---

## 🛠️ Built With

### Core Technologies
- **[React Native](https://reactnative.dev/)** - Cross-platform mobile framework
- **[Expo](https://expo.dev/)** - Development platform and tools
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[OpenAI API](https://openai.com/)** - GPT-4o-mini for content validation

### UI & Styling  
- **[Gluestack UI](https://gluestack.io/)** - Component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Expo Vector Icons](https://docs.expo.dev/guides/icons/)** - Icon library

### Form & Data Management
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod](https://zod.dev/)** - Schema validation
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** - Local data persistence

---

## 📖 Documentation

- **[📋 Project Overview](PROJECT_DOCUMENTATION.md)** - Comprehensive project details
- **[🏗️ Technical Architecture](TECHNICAL_ARCHITECTURE.md)** - Code structure and design decisions  
- **[🤖 AI Integration Guide](API_INTEGRATION.md)** - OpenAI GPT-4o-mini implementation
- **[👤 User Guide](USER_GUIDE.md)** - Step-by-step usage instructions
- **[🧪 Testing Guide](TESTING_GUIDE.md)** - Validation and testing scenarios
- **[⚙️ Setup Guide](SETUP.md)** - Detailed installation instructions
- **[🚀 Deployment Guide](DEPLOYMENT.md)** - Build and distribution

---

## 🤝 Contributing

This is an educational project demonstrating:
- Modern React Native development practices
- AI API integration patterns
- Mobile UI/UX design principles
- Cross-platform app development
- Professional code organization

---

## 📄 License

This project is created for educational purposes as part of a coding assignment.

---

## 🎓 Assignment Context

**LocalNews** fulfills the requirements for an AI-powered local news submission platform, demonstrating:
- ✅ Complete React Native mobile app (iOS + Android)
- ✅ OpenAI GPT-4o-mini integration for content validation
- ✅ Full submission-to-publication workflow
- ✅ Professional UI with filtering and bookmarking
- ✅ Comprehensive documentation and testing guides

For detailed assignment compliance, see [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md).
