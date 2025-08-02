# 📰 Local News Submission App (AI Edited)

## 🎯 Goal

Build a **React Native mobile app** (Android + iOS) where users can submit local news. The submission is analyzed and refined by **OpenAI GPT-4o-mini**, acting as an AI content editor. Approved news is published to a public news feed.

---

## 📌 Key Features

### 1️⃣ News Submission Screen

**Form Fields:**
- News Title
- News Description (minimum 50 characters)
- City
- Topic/Category (e.g., Accident, Festival, Community Event)
- Publisher’s First Name
- Publisher’s Phone Number
- Optional Image Upload (JPEG/PNG from gallery or camera)

**Validations:**
- All fields required except image
- Description must be at least 50 characters

---

### 2️⃣ AI Editing & Validation

Upon submission:
- The raw text is sent to **GPT-4o-mini** via API (or mocked if unavailable)

**GPT Logic:**
- ✅ **Check relevance**: Ensure the submission relates to a real local event
- ✍️ **Improve writing**: Rewrite into a publishable snippet (title + 2–3 sentence summary)
- 🚫 **Reject sensitive/unsafe content**: Flag and reject harmful or off-topic entries

**Outcomes:**
- If GPT **accepts**: Return edited title + summary → store it
- If GPT **rejects**: Show an error with GPT’s explanation

---

### 3️⃣ News Feed Screen

Display approved entries as cards showing:
- ✅ Edited Title
- ✅ Edited Summary
- 🏷️ City and Topic/Category tags
- 👤 Publisher’s First Name
- 📞 Masked phone number (e.g., 987****10)
- 🔖 Bookmark button (saved to local storage)

**Filters:**
- By City
- By Topic/Category

---

### 4️⃣ Data Handling

Persistence options:
- Local JSON or state
- Firebase (Firestore or Realtime DB)
- Google Sheets API

No backend required — just store and display GPT-approved submissions.

---

### 5️⃣ Testing & Quality

- Ensure complete flow works:
  1. Submission
  2. GPT validation/editing
  3. Display on feed
- Test on both **Android** and **iOS** (Expo is acceptable)
- Handle network errors with fallback messaging

---

## ⚡ Extra Credit (Optional)

- 📊 Analytics (count of posts, top categories)
- 🔄 Real-time updates (e.g., Firebase listeners)
- 👤 Simple authentication for personal bookmarks

---

## 📦 Deliverables

1. ✅ Working APK (Android) + testable iOS build (Expo)
2. ✅ GitHub repo with:
   - Setup instructions (OpenAI key or mocked GPT)
   - Running/testing guide
   - GPT prompt design explanation
3. ✅ Short write-up on:
   - GPT validation/editing logic
   - Assumptions and limitations

---

## 🔹 Notes

- Prioritize **functional flow** over polished design
- GPT API can be real or mocked
- Keep code **modular**: screens, services, helpers separated
- MVP expected in 48 hours — not production-ready polish

---

## 🧠 GPT Prompt Example

```json
{
  "role": "system",
  "content": "You are an AI news editor. Your job is to check if a submitted story is relevant local news. If appropriate, rewrite it into a clean title and a short summary. If spam or inappropriate, return a rejection reason."
}

Provide optimised and refactored code