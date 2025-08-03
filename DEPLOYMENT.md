# 🚀 Deployment Guide - LocalNews

## 📋 Table of Contents

- [Deployment Overview](#deployment-overview)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Building for Production](#building-for-production)
- [iOS Deployment](#ios-deployment)
- [Android Deployment](#android-deployment)
- [Web Deployment](#web-deployment)
- [Distribution Options](#distribution-options)
- [Production Monitoring](#production-monitoring)
- [Maintenance & Updates](#maintenance--updates)

---

## 🎯 Deployment Overview

LocalNews is built with Expo, providing multiple deployment options for distributing your AI-powered community news platform. This guide covers building, testing, and distributing the app across all supported platforms.

### Deployment Strategy

- **Development**: Expo Go for rapid testing
- **Beta Testing**: Expo Application Services (EAS) for preview builds
- **Production**: App Store and Google Play Store distribution
- **Web**: Static hosting for web version (optional)

### Build Outputs

- **iOS**: `.ipa` file for App Store submission
- **Android**: `.apk` and `.aab` files for Google Play or direct distribution
- **Web**: Static bundle for web hosting

---

## 📋 Prerequisites

### Required Accounts

- **Apple Developer Account** (iOS deployment) - $99/year
- **Google Play Console Account** (Android deployment) - $25 one-time
- **Expo Account** (for EAS builds) - Free tier available

### Development Environment

```bash
# Ensure latest versions
npm install -g @expo/cli
npm install -g eas-cli

# Login to Expo
npx expo login

# Initialize EAS (if not already done)
eas build:configure
```

### Project Dependencies

```bash
# Install all dependencies
npm install

# Verify no security vulnerabilities
npm audit fix

# Update to latest compatible versions
npx expo install --fix
```

---

## ⚙️ Environment Configuration

### Production Environment Variables

Create production environment configuration:

```bash
# .env.production
EXPO_PUBLIC_OPENAI_API_KEY=your_production_api_key
EXPO_PUBLIC_APP_ENVIRONMENT=production
EXPO_PUBLIC_ANALYTICS_ENABLED=true
```

### App Configuration (`app.json`)

```json
{
  "expo": {
    "name": "LocalNews",
    "slug": "localnews",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "localnews",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.localnews",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses camera to take photos for news submissions.",
        "NSPhotoLibraryUsageDescription": "This app accesses photo library to select images for news submissions."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.localnews",
      "versionCode": 1,
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share images with news submissions.",
          "cameraPermission": "The app accesses your camera to let you take photos for news submissions."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### EAS Build Configuration (`eas.json`)

```json
{
  "cli": {
    "version": ">= 7.8.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium",
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 🏗️ Building for Production

### Pre-Build Checklist

```bash
# 1. Update version numbers
# In app.json: increment "version" and "buildNumber"/"versionCode"

# 2. Run tests
npm test

# 3. Lint code
npm run lint

# 4. Build optimization check
npx expo export

# 5. Verify environment variables
echo $EXPO_PUBLIC_OPENAI_API_KEY
```

### Production Build Commands

#### iOS Production Build

```bash
# Build for App Store submission
eas build --platform ios --profile production

# Build for simulator testing
eas build --platform ios --profile preview

# Build with local credentials (if preferred)
eas build --platform ios --profile production --local
```

#### Android Production Build

```bash
# Build AAB for Google Play
eas build --platform android --profile production

# Build APK for direct distribution
eas build --platform android --profile preview

# Build both platforms simultaneously
eas build --platform all --profile production
```

### Build Monitoring

```bash
# Check build status
eas build:list

# View specific build details
eas build:view [build-id]

# Download build artifacts
eas build:download [build-id]
```

---

## 📱 iOS Deployment

### App Store Connect Setup

#### 1. Create App Record

1. Log into [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+"
3. Enter app information:
   ```
   Name: LocalNews
   Bundle ID: com.yourcompany.localnews
   Primary Language: English
   SKU: localnews-ios
   ```

#### 2. App Information

```markdown
**App Description:**
LocalNews empowers communities to share local news with AI-assisted content validation. Submit local stories that are automatically reviewed and professionally edited by AI before publication to your community news feed.

**Keywords:**
local news, community, AI, news feed, citizen journalism

**Support URL:** https://yourwebsite.com/support
**Privacy Policy URL:** https://yourwebsite.com/privacy
```

#### 3. App Store Assets

Required screenshots and assets:

- **iPhone Screenshots**: 6.7", 6.5", 5.5" displays
- **iPad Screenshots**: 12.9" and 11" displays (if supporting iPad)
- **App Icon**: 1024x1024 PNG
- **App Preview Videos**: Optional but recommended

### Submission Process

#### 1. Upload Build

```bash
# Ensure build is complete
eas build --platform ios --profile production

# Build will automatically appear in App Store Connect
# Or manually upload using Application Loader
```

#### 2. App Store Review Information

```markdown
**App Review Information:**

- First Name: [Your First Name]
- Last Name: [Your Last Name]
- Phone Number: [Your Phone]
- Email: [Your Email]

**Notes for Review:**
This app allows users to submit local news that is validated by OpenAI GPT-4o-mini. To test:

1. Navigate to "Submit News" tab
2. Fill out the form with local news (e.g., "Library Book Fair this Saturday")
3. Submit and see AI validation in action
4. View published news in the feed

Test credentials not required - the app works immediately.
```

#### 3. Export Compliance

- **Uses Encryption**: No (unless implementing additional security)
- **Content Rights**: You own or have rights to all content

### iOS Build Troubleshooting

#### Common Issues

```bash
# Code signing issues
eas credentials:configure --platform ios

# Provisioning profile problems
eas build:configure --platform ios

# Build failures
eas build:inspect [build-id]
```

---

## 🤖 Android Deployment

### Google Play Console Setup

#### 1. Create App

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app:
   ```
   App name: LocalNews
   Default language: English (United States)
   App or game: App
   Free or paid: Free
   ```

#### 2. App Content Declarations

**App Category & Tags:**

- Category: News & Magazines
- Tags: local news, community, news feed

**Content Rating:**

- Target Age: 13+
- Content Descriptors: None (clean community content)

**Data Safety:**

```markdown
Data Collection:

- Personal Info: Name (for attribution)
- Photos: Optional image uploads
- App Activity: News submissions and bookmarks

Data Sharing: No data shared with third parties
Data Security: All data stored locally on device
```

#### 3. Store Listing

```markdown
**Short Description:**
AI-powered community news platform for sharing and discovering local stories.

**Full Description:**
LocalNews empowers your community to share local news with intelligent AI assistance. Submit stories about local events, business openings, community happenings, and more. Our AI editor validates content and improves clarity while maintaining your authentic voice.

Key Features:
• Smart news submission with AI validation
• Professional content editing by GPT-4o-mini
• Filter news by city and category
• Bookmark articles for later reading
• Analytics dashboard for community insights
• Works completely offline

Perfect for:
• Community organizers
• Local business owners
• Residents wanting to stay informed
• Citizen journalists

Join your neighbors in creating a connected, informed community through local news sharing.
```

### Android Release Process

#### 1. Upload Bundle

```bash
# Build production AAB
eas build --platform android --profile production

# Download and upload to Play Console
# Or use automatic submission:
eas submit --platform android
```

#### 2. Release Configuration

- **Release Type**: Production
- **Countries**: Select target countries
- **Staged Rollout**: Start with 20%, increase gradually

#### 3. Pre-Launch Report

Google Play automatically tests your app:

- Crashes and stability
- Performance
- Accessibility
- Security vulnerabilities

### Android Build Troubleshooting

#### Common Issues

```bash
# Keystore issues
eas credentials:configure --platform android

# Build size too large
# Check bundle analyzer
npx expo export --platform android --bundle-analyzer

# Permissions issues
# Verify in app.json android.permissions array
```

---

## 🌐 Web Deployment

### Building for Web

```bash
# Build web version
npx expo export --platform web

# Output will be in dist/ folder
# This contains static files ready for hosting
```

### Hosting Options

#### 1. Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npx expo export --platform web
netlify deploy --dir=dist --prod
```

#### 2. Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npx expo export --platform web
vercel --prod
```

#### 3. GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npx expo export --platform web
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 📦 Distribution Options

### 1. App Store Distribution

**Pros:**

- Maximum reach and discoverability
- Trusted platform
- Automatic updates

**Cons:**

- Review process (1-7 days)
- 30% fee for paid apps
- Strict guidelines

### 2. Google Play Store

**Pros:**

- Largest Android market
- Easy update distribution
- Play Protect security

**Cons:**

- Review process
- 30% fee for paid apps
- Region restrictions possible

### 3. Direct Distribution (Android)

**Pros:**

- No store fees
- Immediate distribution
- Full control

**Cons:**

- Manual update distribution
- Security warnings for users
- Limited reach

```bash
# Build APK for direct distribution
eas build --platform android --profile preview

# Users can install via:
# 1. Download APK file
# 2. Enable "Unknown Sources" in Android settings
# 3. Install APK
```

### 4. Enterprise Distribution

```bash
# For internal company use
eas build --platform ios --profile development
eas build --platform android --profile development
```

---

## 📊 Production Monitoring

### Analytics Setup

```typescript
// services/analyticsService.ts
class ProductionAnalytics {
  trackAppLaunch() {
    // Track app opens
  }

  trackNewsSubmission(category: string, city: string) {
    // Track user engagement
  }

  trackAIValidation(approved: boolean, category: string) {
    // Monitor AI performance
  }

  trackError(error: Error, context: string) {
    // Monitor app stability
  }
}
```

### Performance Monitoring

```typescript
// Monitor app performance
const performanceMetrics = {
  appLaunchTime: 0,
  apiResponseTime: 0,
  memoryUsage: 0,
  crashRate: 0,
};
```

### Error Tracking

```bash
# Install Sentry for production error tracking
npm install @sentry/react-native

# Configure in app initialization
```

---

## 🔄 Maintenance & Updates

### Version Management

```json
// app.json version strategy
{
  "version": "1.0.0", // Major.Minor.Patch
  "ios": {
    "buildNumber": "1" // Increment for each iOS build
  },
  "android": {
    "versionCode": 1 // Increment for each Android build
  }
}
```

### Update Strategy

#### 1. Over-the-Air Updates (OTA)

```bash
# For JavaScript-only changes
eas update --branch production --message "Bug fixes and improvements"
```

#### 2. Binary Updates

```bash
# For native dependency changes
# Increment version/buildNumber
eas build --platform all --profile production
eas submit --platform all
```

### Rollback Strategy

```bash
# Rollback OTA update if issues found
eas update:rollback --branch production

# For binary issues, release hotfix version
```

### Monitoring Checklist

- [ ] App Store ratings and reviews
- [ ] Google Play Console vitals
- [ ] Crash reports and analytics
- [ ] User feedback and support requests
- [ ] API usage and costs
- [ ] Performance metrics

---

## 📋 Deployment Checklist

### Pre-Deployment ✓

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] App icons and splash screens ready
- [ ] Store listings prepared
- [ ] Privacy policy and terms updated
- [ ] Support documentation ready

### iOS Deployment ✓

- [ ] Apple Developer account active
- [ ] App Store Connect record created
- [ ] Production build successful
- [ ] TestFlight testing complete
- [ ] App Store review submitted
- [ ] Release notes prepared

### Android Deployment ✓

- [ ] Google Play Console setup
- [ ] Production AAB build ready
- [ ] Internal testing complete
- [ ] Store listing optimized
- [ ] Release configuration set
- [ ] Staged rollout planned

### Post-Deployment ✓

- [ ] Monitor crash reports
- [ ] Track user feedback
- [ ] Review app store metrics
- [ ] Plan next version features
- [ ] Update documentation

---

## 🎯 Success Metrics

### Launch Goals

- **Week 1**: 100+ downloads, 4+ star rating
- **Month 1**: 500+ downloads, stable crash rate < 1%
- **Quarter 1**: 1000+ downloads, positive user reviews

### Monitoring KPIs

- Download/install rates
- User retention (Day 1, Day 7, Day 30)
- App store ratings and reviews
- Crash-free session percentage
- API usage and costs
- User engagement metrics

This deployment guide ensures professional distribution of your LocalNews app across all platforms while maintaining quality and monitoring for success.
