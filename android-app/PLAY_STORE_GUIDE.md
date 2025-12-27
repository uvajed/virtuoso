# Publishing Virtuoso to Google Play Store

## Quick Path: PWABuilder (Recommended - 10 minutes)

### Step 1: Generate Android Package
1. Go to **https://www.pwabuilder.com/**
2. Enter your URL: `https://music-virtuoso.vercel.app`
3. Click **Start**
4. Click **Package for stores** → **Android**
5. Configure these settings:
   - **Package ID**: `com.virtuoso.musicpractice`
   - **App name**: `Virtuoso - Music Practice`
   - **Short name**: `Virtuoso`
   - **App version**: `1.0.0`
   - **Version code**: `1`
6. Click **Generate**
7. Download the ZIP file containing your AAB and signing key

### Step 2: Set Up Google Play Console
1. Go to **https://play.google.com/console**
2. Pay the one-time **$25 developer fee** (if not already registered)
3. Click **Create app**
4. Fill in:
   - **App name**: Virtuoso - Music Practice
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free
5. Accept policies and click **Create app**

### Step 3: Store Listing
Fill out the required information:

**Main store listing:**
- **Short description** (80 chars max):
  `Master music theory, train your ear, and practice with interactive exercises`

- **Full description** (4000 chars max):
```
Virtuoso is your comprehensive music practice companion. Whether you're a beginner or advancing musician, Virtuoso helps you:

🎵 EAR TRAINING
• Interval recognition - Learn to identify musical intervals by ear
• Chord recognition - Distinguish between major, minor, 7th, 9th, 11th, and 13th chords
• Pitch matching - Train your voice to match pitches accurately
• Melody dictation - Transcribe melodies you hear

🎹 INSTRUMENT PRACTICE
• Piano - Virtual keyboard with sight reading exercises
• Guitar - Chord library and fretboard trainer
• Voice - Real-time pitch feedback and vocal exercises

📚 MUSIC THEORY
• Interactive lessons on scales, chords, and keys
• Circle of fifths visualization
• Staff notation with treble clef reading (including sharps and flats!)

🛠️ PRACTICE TOOLS
• Metronome - Adjustable tempo with visual beat indicator
• Tuner - Chromatic tuner using your device microphone
• Practice timer - Track your sessions with break reminders

✨ FEATURES
• Beautiful dark theme inspired by modern music apps
• Works offline - practice anywhere
• Track your progress with XP and achievements
• Keyboard shortcuts for quick input
• Free to use with no ads

Start your musical journey today with Virtuoso!
```

**Graphics:**
- App icon: 512x512 PNG (already generated at `/public/icons/icon-512x512.png`)
- Feature graphic: 1024x500 PNG (create one showing the app interface)
- Screenshots: At least 2 phone screenshots (1080x1920 or similar)

### Step 4: Upload Your App
1. In Play Console, go to **Production** → **Create new release**
2. Upload the `.aab` file from PWABuilder
3. Add release notes: "Initial release of Virtuoso - Music Practice"
4. Click **Save** then **Review release**

### Step 5: Complete Content Rating
1. Go to **Policy** → **App content** → **Content rating**
2. Start the questionnaire
3. For a music education app, you'll likely get an **Everyone** rating

### Step 6: Update Digital Asset Links
After PWABuilder generates your app, you'll get a SHA256 fingerprint. Update the file:
`public/.well-known/assetlinks.json`

Replace `REPLACE_WITH_YOUR_SHA256_FINGERPRINT` with your actual fingerprint.

Then redeploy to Vercel:
```bash
git add .
git commit -m "Add Digital Asset Links for Play Store"
git push
```

### Step 7: Submit for Review
1. Complete all required sections (marked with ✓)
2. Click **Submit for review**
3. Wait 1-3 days for review (can be faster for simple apps)

---

## App Store Listing Assets Needed

| Asset | Size | Status |
|-------|------|--------|
| App Icon | 512x512 PNG | ✅ Ready |
| Feature Graphic | 1024x500 PNG | ❌ Create |
| Phone Screenshots | 1080x1920 (2-8) | ❌ Create |
| Tablet Screenshots | 1920x1200 (optional) | ❌ Create |

---

## Pricing & Requirements

- **Developer Account**: $25 one-time fee
- **Review Time**: Usually 1-3 days
- **Requirements**: Must have a privacy policy URL

---

## Privacy Policy

You'll need a privacy policy. Create a simple one at `/privacy` or use a generator:
- https://www.freeprivacypolicy.com/
- https://www.termsfeed.com/

---

## Questions?

PWABuilder support: https://github.com/pwa-builder/PWABuilder/issues
Play Console help: https://support.google.com/googleplay/android-developer
