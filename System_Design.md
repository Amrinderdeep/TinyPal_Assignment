# TinyPal App – System Design Document

**Author:** Amrinderdeep Singh Bhatt  
**Date:** 19-Oct-2025  
**Repo:** [Your repo link]  
**Note:** Document drafted using GitHub Copilot integrated with VSCode.

---

## 1. Overview

**TinyPal** is a React Native application that provides evidence-based parenting tips in two formats:

1. **Did You Know** – short, story-like insights with optional AI assistant activation.  
2. **Flash Cards** – quick actionable tips, also integrated with an AI assistant.  

**Key Features:**
- Home screen for navigation between modules.
- Floating AI assistant (Tinu) accessible globally.
- Story-like navigation with swipeable cards.
- Responsive design for various device sizes.

The design emphasizes **component reusability**, **clear separation of concerns**, and **API integration** for dynamic content.

---

## 2. Architecture

```
App.js
 ├─ HomeScreen
 ├─ DidYouKnowScreen
 ├─ FlashCardScreen
 ├─ TinuBottomSheet
 └─ TinuMiniBar
```

### 2.1 Main App
- Controls **screen navigation** and **Tinu visibility**.
- Centralized functions:
  - `openTinu(props)` → opens Tinu with optional context.
  - `go(screenName)` → navigate to a screen.
  - `goBack()` → return to Home screen.
- Wraps Tinu components in an overlay using absolute positioning.

---

### 2.2 Screens

#### 2.2.1 HomeScreen
- Serves as the **entry point**.
- Displays two navigation cards:
  - `Did You Know`
  - `Flash Cards`
- Includes footer with **author info**.
- Props: `onSelect(screenName)` → triggers navigation.

#### 2.2.2 DidYouKnowScreen
- Fetches cards from **API (`fetchP13nAnswers`)**.
- Displays swipeable horizontal **story cards**:
  - Background image
  - Overlay card with title, subtitle, content, and optional chips
  - Ask Tinu CTA for AI activation
- Props:  
  - `openTinu(props)` → triggers AI assistant  
  - `onBack()` → returns to Home

#### 2.2.3 FlashCardScreen
- Similar structure to DidYouKnowScreen.
- Focuses on **actionable parenting tips**.
- Overlay card contains title and content.
- Supports Tinu AI activation.

---

### 2.3 Components

#### 2.3.1 TinuBottomSheet
- Floating bottom sheet AI assistant.
- Props:
  - `visible`: show/hide state
  - `onClose`: close callback
  - `contextProps`: context for Tinu AI
- Reusable across screens.

#### 2.3.2 TinuMiniBar
- Small persistent bar at the bottom.
- Opens Tinu in **general mode**.
- Props: `onOpen()` → triggers TinuBottomSheet.

#### 2.3.3 UI Components
- **Card**: reusable component with variants (`default` / `full`).
- **Chip**: small tag or label.
- **IconButton**: flexible pressable button for icons.

---

### 2.4 API Services

File: `api/index.js`  
Provides functions for dynamic content:
- `fetchP13nAnswers()` → fetches Did You Know & Flash Cards content.
- `activateTinu(params)` → triggers AI assistant.
- `makeImageUrl(path)` → normalizes image URLs.

All API calls use `postJson()` wrapper for consistent POST requests.

---

## 3. Component Breakdown

| Component | Responsibility | Props |
|-----------|----------------|-------|
| App.js | Main container, handles navigation & Tinu overlay | – |
| HomeScreen | Displays navigation cards & author info | onSelect(screenName) |
| DidYouKnowScreen | Displays story cards with AI activation | openTinu(props), onBack() |
| FlashCardScreen | Displays flash cards with AI activation | openTinu(props), onBack() |
| TinuBottomSheet | AI assistant floating sheet | visible, onClose, contextProps |
| TinuMiniBar | Persistent mini AI trigger | onOpen() |
| Card | Reusable card component | title, subtitle, image, variant, onPress |
| Chip | Tag label | children, onPress |
| IconButton | Button for icons | children, onPress |

---

## 4. Screen Coding Approach

1. **State Management**
   - Screens use **React hooks** (`useState`, `useEffect`) for fetching data and tracking current index.
   - `FlatList` handles horizontal scrolling and story-like swiping.

2. **Dynamic Content**
   - All text, images, and activation parameters are fetched from the API.
   - Tinu activation integrates via `tinu_activation` field in card data.

3. **Overlay Cards**
   - Both screens use **absolute positioning** to overlay cards on background images.
   - Styled for **responsive sizing** using `Dimensions`.

4. **Navigation**
   - Tap zones on left/right to navigate between cards.
   - HomeScreen triggers screen change via `onSelect`.

---

## 5. Styling Approach

- Consistent **color palette** for backgrounds and text.
- Shadows and elevation applied for **depth perception**.
- Rounded corners and padding for **friendly UI**.
- Absolute positioning for **floating AI assistant** components.

---

## 6. Advantages of Design

- **Modular & reusable** components reduce code duplication.
- **Separation of concerns**:
  - Screens handle UI & state.
  - API calls centralized in `api/index.js`.
  - AI assistant is independent and reusable.
- **Responsive design** ensures usability across devices.
- Easy to **extend** with new content types or screens.

---

## 7. Future Enhancements

- Add **local caching** for offline support.
- Introduce **search & filter** for Did You Know and Flash Cards.
- Integrate **analytics** to track Tinu usage.
- Allow **user personalization** for AI responses.

---

## 8. Conclusion

The TinyPal app is designed to be **modular, scalable, and maintainable**. Each screen is decoupled from the AI assistant, and components are reusable for future content expansions. The API integration ensures dynamic content delivery, and the design focuses on **easy navigation, engagement, and evidence-based learning**.

---

**End of Document**