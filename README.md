# TinyPal - Evidence-Based Parenting Tips App

TinyPal is a React Native app built with **Expo**, designed to provide parents with short, evidence-backed insights and actionable flashcards for child development. The app features a mini AI assistant named **Tinu** for interactive guidance.

---

## Features

- **Home Screen:** Navigate between "Did You Know" and "Flash Cards" sections.
- **Did You Know:** Short, evidence-backed insights presented in a story-like interface.
- **Flash Cards:** Quick actionable tips displayed in swipeable cards.
- **Tinu Mini Bar & Bottom Sheet:** Interactive AI assistant that can answer context-specific questions.
- **API Integration:** Fetches personalized parenting content from a remote backend.

---

## Screens & Components

- **Screens**
  - `HomeScreen` – Entry point for the app.
  - `DidYouKnowScreen` – Swipeable knowledge cards.
  - `FlashCardScreen` – Flash cards with actionable advice.
- **Components**
  - `TinuMiniBar` – Floating mini bar for AI assistant access.
  - `TinuBottomSheet` – Bottom sheet modal for AI conversation.
  - `Card`, `Chip`, `IconButton` – Reusable UI components for consistent styling.
- **API Services**
  - `api.js` – Handles fetching content and activating Tinu interactions.

> **Development Note:** Screens and components were built using **React Native with Expo**. GitHub Copilot integrated in **VSCode** was used to speed up component and API logic creation.

---

## Getting Started

### Prerequisites

- Node.js (>=16)
- Expo CLI (`npm install -g expo-cli`)
- Yarn or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/tiny-pal.git
   cd tiny-pal
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App

1. Start the Expo development server:
   ```bash
   expo start
   ```
2. Open the app:
   - On your phone: Scan the QR code using the Expo Go app (iOS/Android)
   - On an emulator: Press `i` for iOS simulator, `a` for Android emulator

### Building a Standalone App

To build for production:
```bash
expo build:android
expo build:ios
```
Refer to [Expo Docs](https://docs.expo.dev/) for detailed build instructions.

---

## Project Structure

```
tiny-pal/
├── assets/          # Images and icons
├── src/
│   ├── api/         # API services
│   ├── components/  # Reusable UI components
│   └── screens/     # App screens
├── App.js           # Main entry point
├── package.json
└── README.md
```

---

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT License

---

## Contact

**Amrinderdeep Singh Bhatt**  
Email: amrinderdeepbhatt@gmail.com  
Phone: +91 9814820822  
GitHub: [https://github.com/amrinderdeep](https://github.com/amrinderdeep)