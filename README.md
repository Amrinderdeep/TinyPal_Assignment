# TinyPal

TinyPal is an evidence-based parenting tips app built with **React Native** and **Expo**. It provides bite-sized insights through "Did You Know" cards and "Flash Cards", along with an interactive assistant called **Tinu**.

---

## Features

- Home screen with options for **Did You Know** and **Flash Cards**
- Story-like card navigation with progress indicator
- AI-powered assistant (**Tinu**) integrated in a bottom sheet
- Easy navigation between cards and sections
- Responsive UI built with React Native components

---

## Screens / Components

### Screens
1. **HomeScreen**: Main menu with navigation to Did You Know and Flash Cards.
2. **DidYouKnowScreen**: Displays evidence-based insights as cards with images, overlay text, and Tinu activation.
3. **FlashCardScreen**: Quick actionable tips in a card carousel format with optional Tinu interaction.

### Components
1. **Card / Chip / IconButton**: Reusable UI components for cards and buttons.
2. **TinuBottomSheet**: Interactive AI assistant panel.
3. **TinuMiniBar**: Mini Tinu bar overlay accessible from all screens.

### Services
- **API.js**: Handles fetching content and activating Tinu using Expo fetch calls.

---

## Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd <repo-directory>
```

2. Install dependencies:
```bash
npm install
```

---

## Running the Project

Start the Expo development server:
```bash
npm start
```

This will open the Expo CLI. You can run the app on:

- **Android**: Use Expo Go or an emulator
- **iOS**: Use Expo Go or simulator
- **Web**: Press `w` in the Expo CLI

---

## Build APK (Android)

We use **EAS Build (Expo Application Services)** to generate an APK:

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure your project for EAS Build:
```bash
eas build:configure
```
This will create an `eas.json` file in your project.

4. Build the APK:
```bash
eas build --platform android
```

5. Wait for the build.  
EAS will provide a URL where you can download the APK once ready.

---

## Notes

- This project uses **GitHub Copilot** integrated with VSCode for code completion and faster development.
- Ensure you have **Node.js**, **npm**, and **Expo CLI** installed on your system.

---

## Author

**Amrinderdeep Singh Bhatt**  
Email: amrinderdeepbhatt@gmail.com  
Phone: +91 9814820822