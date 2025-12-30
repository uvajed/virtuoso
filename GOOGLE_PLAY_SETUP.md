# Google Play Console Setup Guide for Virtuoso

This guide will help you complete all the required items in the Google Play Console to publish your app.

---

## 1. Set Privacy Policy

**URL to enter:** `https://music-virtuoso.vercel.app/privacy`

This page is now live on your website. Enter this URL in the Privacy Policy field.

---

## 2. App Access

**Select:** "All functionality is available without special access"

*If your app requires login:*
- Select "All or some functionality is restricted"
- Add instructions: "Create a free account using any email address and password"
- Optionally provide a test account:
  - Email: `test@virtuoso-app.com`
  - Password: `TestAccount123!`

---

## 3. Ads

**Select:** "No, my app does not contain ads"

Virtuoso does not display any advertisements.

---

## 4. Content Rating

Complete the IARC questionnaire with these answers:

| Question | Answer |
|----------|--------|
| Does your app contain violence? | No |
| Does your app contain sexual content? | No |
| Does your app contain profanity? | No |
| Does your app allow users to communicate? | No |
| Does your app share user location? | No |
| Does your app allow purchases? | No |
| Does your app contain gambling? | No |
| Does your app contain drugs/alcohol references? | No |
| Does your app allow user-generated content? | No |

**Expected rating:** Everyone (E) / PEGI 3

---

## 5. Target Audience

**Select target age groups:**
- [x] 13-15
- [x] 16-17
- [x] 18 and over

**Important:** If you also want to include children under 13:
- You must comply with COPPA (Children's Online Privacy Protection Act)
- Your app will need additional review
- **Recommendation:** Start with 13+ unless you specifically want to target children

**Is your app designed primarily for children?** No

---

## 6. Data Safety

This is the most detailed section. Here are your answers:

### Data Collection Overview

| Question | Answer |
|----------|--------|
| Does your app collect or share any user data? | Yes |

### Data Types Collected

| Data Type | Collected | Shared | Required | Purpose |
|-----------|-----------|--------|----------|---------|
| **Email address** | Yes | No | Yes (for account) | Account management |
| **Password** | Yes (encrypted) | No | Yes | Authentication |
| **App activity** (practice data, scores) | Yes | No | Yes | App functionality |
| **App interactions** (features used) | Yes | No | No | Analytics |

### Security Practices

| Question | Answer |
|----------|--------|
| Is data encrypted in transit? | Yes (HTTPS/TLS) |
| Can users request data deletion? | Yes |
| Is data encrypted at rest? | Yes |

### Data Deletion

**Provide data deletion instructions:**
> Users can request account and data deletion by emailing privacy@virtuoso-app.com. Data will be deleted within 30 days of the request.

---

## 7. Government Apps

**Select:** "No, this is not a government app"

---

## 8. Financial Features

**Select:** "No" for all questions:
- Does your app provide financial services? No
- Does your app handle cryptocurrency? No
- Does your app facilitate loans? No

---

## 9. Health

**Select:** "No" for all questions:
- Is your app a health app? No
- Does your app provide medical advice? No
- Does your app track health data? No

*Note: Music practice does not constitute health tracking*

---

## 10. App Category and Contact Details

### Category
- **Primary category:** Education
- **Secondary category:** Music & Audio (if available)

### Contact Details
Fill in your information:
- **Email:** support@virtuoso-app.com (or your email)
- **Phone:** (Optional)
- **Website:** https://music-virtuoso.vercel.app

---

## 11. Store Listing

### App Name
`Virtuoso - Music Practice`

### Short Description (80 characters max)
```
Learn music theory, train your ear, and practice piano, guitar & voice.
```

### Full Description (4000 characters max)
```
Master music with Virtuoso – your all-in-one music practice companion!

Whether you're a beginner picking up your first instrument or an experienced musician looking to sharpen your skills, Virtuoso provides everything you need to become a better musician.

🎵 MUSIC THEORY
Learn the fundamentals of music with interactive lessons on:
• Notes and the musical alphabet
• Scales (major, minor, pentatonic, and more)
• Chords and chord progressions
• Key signatures and the circle of fifths
• Intervals and their sounds

🎧 EAR TRAINING
Develop your musical ear with exercises for:
• Interval recognition
• Chord identification
• Melody dictation
• Rhythm training

🎹 PIANO PRACTICE
• Interactive virtual piano keyboard
• Sight-reading exercises
• Finger exercises and technique builders
• Chord practice with visual guidance

🎸 GUITAR LEARNING
• Comprehensive chord library with diagrams
• Fretboard visualization
• Tab reading practice
• Strumming pattern exercises

🎤 VOICE TRAINING
• Real-time pitch detection
• Pitch matching exercises
• Vocal range tests
• Breathing technique guides

🛠️ PRACTICE TOOLS
• Metronome with customizable tempo and time signatures
• Chromatic tuner for any instrument
• Practice timer with session tracking

📊 TRACK YOUR PROGRESS
• Earn XP for completing exercises
• Unlock achievements as you improve
• Maintain daily practice streaks
• View detailed progress statistics

✨ KEY FEATURES
• Works offline – practice anywhere
• Clean, dark theme design
• No ads, no distractions
• Suitable for all skill levels
• Free to use

Start your musical journey today with Virtuoso!
```

### Screenshots Needed
You'll need to provide:
- **Phone:** At least 2 screenshots (recommended 4-8)
- **Tablet:** At least 1 screenshot (7-inch and 10-inch)

**Screenshot suggestions:**
1. Dashboard showing progress
2. Piano keyboard interface
3. Ear training exercise
4. Music theory lesson
5. Guitar chord library
6. Achievements page

**Screenshot specifications:**
- JPEG or PNG (24-bit, no alpha)
- Minimum: 320px, Maximum: 3840px
- Aspect ratio between 16:9 and 9:16

### App Icon
- 512 x 512 PNG (32-bit with alpha)
- Use your existing app icon

### Feature Graphic
- 1024 x 500 PNG or JPEG
- This appears at the top of your store listing
- Should showcase your app visually

---

## Quick Checklist

- [ ] Privacy Policy URL entered
- [ ] App Access configured
- [ ] Ads declaration (No)
- [ ] Content rating questionnaire completed
- [ ] Target audience selected (13+)
- [ ] Data safety form completed
- [ ] Government apps (No)
- [ ] Financial features (No)
- [ ] Health features (No)
- [ ] Category: Education
- [ ] Contact email added
- [ ] Store listing text added
- [ ] Screenshots uploaded
- [ ] App icon uploaded
- [ ] Feature graphic uploaded

---

## Notes

1. **Email addresses** used in this guide (privacy@virtuoso-app.com, support@virtuoso-app.com) are placeholders. Replace with your actual email addresses.

2. **Test account** - If you're using the restricted access option, make sure the test account actually works on your production server.

3. **Screenshots** - Take these from your actual deployed app at music-virtuoso.vercel.app for authenticity.

4. After completing all items, you can submit your app for review. Review typically takes 1-3 business days.
