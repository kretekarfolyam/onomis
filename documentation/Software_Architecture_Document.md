<div align="center">

# Software Architecture Document (SAD)
**Project:** Onomis – Own Your Money, Own Your Future

</div>

---

# Table of Contents
- [Introduction](#1-introduction)
    - [Purpose](#11-purpose)
    - [Scope](#12-scope)
    - [Definitions, Acronyms and Abbreviations](#13-definitions-acronyms-and-abbreviations)
    - [References](#14-references)
    - [Overview](#15-overview)
- [Architectural Representation](#2-architectural-representation)
- [Architectural Goals and Constraints](#3-architectural-goals-and-constraints)
- [Use-Case View](#4-use-case-view)
- [Logical View](#5-logical-view)
    - [Mobile Client Layers](#51-mobile-client-layers)
    - [Domain Types](#52-domain-types)
    - [External Services](#53-external-services)
- [Process View](#6-process-view)
    - [Login & Session Handling](#61-login--session-handling)
    - [Wallet Creation/Update Flow](#62-wallet-creationupdate-flow)
    - [Transaction Creation/Update Flow](#63-transaction-creationupdate-flow)
    - [Image Upload Handling](#64-image-upload-handling)
    - [Concurrency & Consistency](#65-concurrency--consistency)
- [Deployment View](#7-deployment-view)
- [Implementation View](#8-implementation-view)
- [Data View](#9-data-view)
    - [Firestore Collections](#91-firestore-collections)
    - [Relationships](#92-relationships)
- [Size and Performance](#10-size-and-performance)
- [Quality](#11-quality)

---

## 1. Introduction

### 1.1 Purpose
This Software Architecture Document (SAD) describes how **Onomis** is structured and implemented across its React Native mobile client and managed backend services. It provides a shared architectural baseline for developers, testers, and stakeholders so they can extend or maintain the app without re-discovering design decisions.

### 1.2 Scope
The architecture covers the Expo-based mobile application, its internal layers (navigation, screens, components, contexts, hooks, services), and the managed backend capabilities provided by Firebase Authentication, Firebase Firestore, Firebase Storage, and Cloudinary. It also captures integration points, runtime behaviors, data models, deployment, and quality considerations required to deliver the features stated in the SRS.

### 1.3 Definitions, Acronyms and Abbreviations

| Term | Definition |
|------|------------|
| SRS | Software Requirements Specification |
| SAD | Software Architecture Document |
| UC | Use Case |
| UCD | Overall Use Case Diagram |
| API | Application Programming Interface |
| RN | React Native |
| Expo | React Native toolchain for cross-platform apps |
| BaaS | Backend as a Service (Firebase) |
| MVP | Minimum Viable Product |
| Wallet | Logical bucket that aggregates transactions and maintains balances |
| Transaction | Income or expense entry tied to a wallet and a user |
| Category | Classification (Food, Rent, Transport, etc.) used for analytics |

### 1.4 References

| Reference | Link |
|-----------|------|
| Onomis GitHub Repository | [https://github.com/kretekarfolyam/onomis](https://github.com/kretekarfolyam/onomis) |
| Software Requirements Specification | [documentation/SRS.md](https://github.com/kretekarfolyam/onomis/tree/main/documentation/SRS.md) |
| Overall Use Case Diagram | [documentation/diagramas/overall_use_case_diagram.png](https://github.com/kretekarfolyam/onomis/tree/main/documentation/diagramas/overall_use_case_diagram.png) |
| UC – Add Transaction | [documentation/UCs/uc_add_transaction_detailed.md](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_transaction_detailed.md) |
| UC – Add Wallet | [documentation/UCs/uc_add_wallet_detailed.md](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_wallet_detailed.md) |
| UC – Add Profile Picture | [documentation/UCs/uc_add_profile_picture_detailed.md](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_profile_picture_detailed.md) |
| Expo Documentation | [https://docs.expo.dev](https://docs.expo.dev) |
| Firebase Documentation | [https://firebase.google.com/docs](https://firebase.google.com/docs) |
| Cloudinary Documentation | [https://cloudinary.com/documentation](https://cloudinary.com/documentation) |

### 1.5 Overview
Section 2 summarizes the architectural representation. Sections 3–11 translate SRS requirements into architectural goals, component views, runtime flows, deployment, implementation details, data models, performance expectations, and quality attributes.

---

## 2. Architectural Representation
Onomis follows a **layered mobile architecture** with MV-pattern principles:

- **Presentation Layer:** Expo Router navigation (`app/`), screens, and reusable UI components (`components/`).
- **State/Domain Layer:** React Contexts (`contexts/`) and hooks (`hooks/useFetchData.ts`) that orchestrate user state and Firestore data fetching.
- **Service Layer:** TypeScript service modules (`services/`) that encapsulate Firestore queries/mutations and media uploads.
- **Managed Backend:** Firebase Authentication secures user identity, Firestore stores structured data, and Cloudinary stores media assets. Firebase Storage can mirror Cloudinary URLs when needed.

The mobile client communicates directly with Firebase using official SDKs. Firestore operations run on-device using secure client credentials and Firestore security rules. Image uploads use Cloudinary's HTTPS API; returned URLs are persisted to Firestore.

### 2.1 Pattern
The architecture implements a **Model-View (MV)** pattern adapted for React Native:

- **Models:** TypeScript types (`types.ts`) and Firestore documents represent domain entities (User, Wallet, Transaction).
- **Views:** React components (`components/`, `app/`) render UI and capture user interactions.
- **Controllers/Services:** Service layer (`services/`) acts as intermediary between Views and the Firebase backend, implementing business logic for data validation and state synchronization.

This separation ensures testability, maintainability, and clear boundaries between presentation and data layers.

---

## 3. Architectural Goals and Constraints
- **Fast UX & Low Friction Input:** Modal-driven forms, immediate validation, and client-side caching minimize round trips.
- **Data Integrity:** Wallet balances must remain consistent with transactions (service layer reverts/updates balances atomically).
- **Security & Privacy:** Firebase Auth enforces per-user access; Firestore security rules restrict reads/writes by `uid`. Sensitive tokens are stored using Expo secure storage primitives.
- **Scalability:** Firestore and Cloudinary scale horizontally; architecture supports increasing users with minimal changes.
- **Availability:** Reliance on Firebase-managed services (≥99.9% uptime). App gracefully handles intermittent connectivity.
- **Expo Constraints:** Only modules supported by Expo Go are used; no custom native code.
- **Third-Party Dependencies:** Firebase and Cloudinary availability and pricing tiers influence operational limits.

---

## 4. Use Case View
The architecture supports the main use case groups defined in the SRS and depicted in the [Overall Use Case Diagram](https://github.com/kretekarfolyam/onomis/tree/main/documentation/diagramas/overall_use_case_diagram.png):

- **Authentication & Profile:** Registration, login/logout, and avatar updates rely on Firebase Auth and the profile modal ([UC – Add Profile Picture](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_profile_picture_detailed.md)). Auth context ensures gated navigation.
- **Wallet Management:** Wallet list, creation, editing, and deletion flows ([UC – Add Wallet](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_wallet_detailed.md)) dictate Firestore data modeling (per-user collections, Cloudinary icons).
- **Transaction Engine:** Add/edit/delete transactions ([UC – Add Transaction](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_transaction_detailed.md)) drive service logic for balance updates and receipt uploads.
- **Statistics & Dashboard:** Queries aggregate per-wallet and per-category trends for the dashboard and statistics tab.
- **Settings & Navigation:** Profile tab routes to logout, privacy info, and placeholder preferences, guiding how contexts expose global actions.

These use cases shaped the selection of Expo Router for flexible navigation, service modules for reusable Firestore logic, and contexts/hooks for scoped data access.

---

## 5. Logical View

### 5.1 Mobile Client Layers
- **Navigation & Screens (`app/`)**
	- `(auth)/` stack: welcome, login, register screens.
	- `(tabs)/` stack: home dashboard, wallet list, statistics, profile.
	- `(modals)/`: wallet, transaction, profile, category, search modals presented over current screens.
- **UI Components (`components/`)** provide reusable building blocks (buttons, inputs, cards, lists, loaders).
- **Contexts (`contexts/authContext.tsx`)** manage user session, exposing `user`, `login`, `register`, `updateUserData`.
- **Hooks (`hooks/useFetchData.ts`)** abstract Firestore query logic with loading/error state.
- **Services (`services/`)** encapsulate backend interactions:
	- `walletService.ts`: create/update/delete wallets, cascade delete transactions.
	- `transactionService.ts`: transaction CRUD, wallet balance adjustments, Cloudinary uploads.
	- `userService.ts`: profile updates, Cloudinary avatar uploads.
	- `imageService.ts`: shared helper for Cloudinary uploads and avatar retrieval.
- **Utilities (`utils/`)** provide styling and data helpers.

### 5.2 Domain Types (`types.ts`)
- **UserType:** `uid`, `email`, `name`, `image`.
- **WalletType:** `id`, `name`, `amount`, `totalIncome`, `totalExpenses`, `image`, `uid`, `created`.
- **TransactionType:** `id`, `type`, `amount`, `category`, `date`, `description`, `image`, `uid`, `walletId`.
- **CategoryType:** metadata for expense categories (icon, color).

### 5.3 External Services
- **Firebase Auth:** email/password registration, session persistence.
- **Firestore:** collections `users`, `wallets`, `transactions` with security rules referencing `uid`.
- **Cloudinary:** image hosting for wallet icons, receipts, and profile pictures. Cloudinary URLs stored in Firestore for rendering.

---

## 6. Process View

### 6.1 Login & Session Handling
1. User submits credentials on `(auth)/login` screen.
2. `authContext.login` invokes Firebase Auth `signInWithEmailAndPassword`.
3. On success, context stores user data and triggers `updateUserData` to fetch Firestore profile.
4. Expo Router redirects to `(tabs)`; context persists session until logout or token expiry.

### 6.2 Wallet Creation/Update Flow
1. Wallet modal collects name and optional icon.
2. If icon selected, `imageService.uploadFileToCloudinary` uploads file; returned URL added to payload.
3. `walletService.createOrUpdateWallet` sets default totals for new wallets and writes data to Firestore.
4. Screen listens for service response; on success modal closes and list refreshes via `useFetchData`.

### 6.3 Transaction Creation/Update Flow
1. Transaction modal validates required fields and wallet balance (expenses cannot exceed wallet amount).
2. Optional receipt uploaded via Cloudinary similar to wallets.
3. `transactionService.createOrUpdateTransaction`:
	 - When creating: updates wallet totals using `updateWalletForNewTransaction`.
	 - When editing: reverts original wallet impact if amount/type/wallet changed, then applies new values.
4. Firestore document written/merged; UI navigates back and lists refresh automatically.

### 6.4 Image Upload Handling
All image uploads are asynchronous; UI disables submission via `loading` state. Errors produce alerts, allowing retry without losing form state.

### 6.5 Concurrency & Consistency
- Firestore writes executed sequentially per action to avoid conflicting balance updates.
- Client guards against duplicate submissions through `loading` flags and disabled buttons.
- Firestore’s last-write-wins semantics plus wallet recalculations keep balances accurate even if users edit concurrent transactions.

---

## 7. Deployment View
The system is deployed across multiple environments:

| Component                    | Deployment Environment              | Host/Service                 |
|------------------------------|-------------------------------------|------------------------------|
| **Mobile Client (iOS)**      | Native App (TestFlight/App Store)  | Apple Devices                |
| **Mobile Client (Android)**  | Native App (Play Store)             | Android Devices              |
| **Authentication**           | Managed Service                     | Firebase Authentication      |
| **Database**                 | Managed Service                     | Firebase Firestore           |
| **Media Storage**            | Managed Service                     | Cloudinary                   |
| **Version Control**          | Repository                          | GitHub                       |
| **Project Management**       | Issue Tracking                      | YouTrack                     |

An optional deployment diagram can be stored under `documentation/diagramas/` (e.g., `deployment_view.png`) and referenced via `https://github.com/kretekarfolyam/onomis/tree/main/documentation/diagramas/deployment_view.png` when available.

---

## 8. Implementation View

### 8.1 Overview
The core technologies and languages are:

| Component            | Technology                        | Language   | Version Control |
|----------------------|-----------------------------------|------------|-----------------|
| **Mobile Client**    | React Native, Expo Router         | TypeScript | Git             |
| **Authentication**   | Firebase Auth SDK                 | TypeScript | n/a             |
| **Database Client**  | Firebase Firestore SDK            | TypeScript | n/a             |
| **Image Upload**     | Cloudinary API                    | TypeScript | n/a             |
| **Testing**          | Jest, Behave (BDD)                | TypeScript | Git             |

### 8.2 Layers
The project structure follows a layered approach:

- `app/` – Navigation tree (Expo Router), grouping by stacks/tabs/modals
- `components/` – Reusable UI elements (buttons, inputs, cards, lists)
- `contexts/` – React Contexts for global state (`authContext`)
- `hooks/` – Data fetching hooks (Firestore queries with loading/error handling)
- `services/` – Business logic layer (wallets, transactions, users, images)
- `constants/` – Design tokens and seed data (categories, colors)
- `utils/` – Helpers for styling and formatting
- `assets/` – Static resources (fonts, images)

**Tooling:** ESLint, Prettier, TypeScript strict mode, Expo CLI commands.  
**Version Control:** Git with GitHub remote (`main` branch). Pull requests enforce code review before merging.

---

## 9. Data View

### 9.1 Firestore Collections
- **`users`** (`uid` as document ID)
	- Fields: `name`, `email`, `image`, `createdAt`.
	- Access: only authenticated user reads/writes own document.

- **`wallets`** (auto ID)
	- Fields: `name`, `image`, `amount`, `totalIncome`, `totalExpenses`, `uid`, `created`.
	- Indexed by `uid` + `created` for per-user sorting.
	- Cascading delete removes related transactions.

- **`transactions`** (auto ID)
	- Fields: `walletId`, `uid`, `type`, `amount`, `category`, `date`, `description`, `image`.
	- Indexed by `uid` + `date` and `walletId` for filters.

### 9.2 Relationships
- Each user owns multiple wallets (`users:wallets` 1:N).
- Each wallet holds multiple transactions (`wallets:transactions` 1:N).
- Categories are static constants referenced by `category` field for analytics.
- Cloudinary URLs stored in `image` fields connect Firestore records to hosted media.

When a data-model diagram becomes available it should be stored under `documentation/diagramas/` and referenced using the GitHub tree URL.

---

## 10. Size and Performance
- Target up to **1,000 transactions per user** without noticeable slowdown; Firestore queries remain scoped and indexed.
- Dashboard and modal submissions should respond within **≤4 seconds** on typical LTE connections, aligning with SRS performance goals.
- Pagination or lazy loading kicks in beyond 100 visible transactions to limit UI work.
- Image uploads compressed to **50% quality** and **4:3** aspect ratio to minimize bandwidth.
- Network efficiency achieved via pull-to-refresh (user-initiated) instead of constant polling.

---

## 11. Quality

- **Reliability:** Firebase-managed services deliver high availability; service layer logic ensures wallet/transaction consistency and retries failed uploads with user prompts.
- **Security:** Firebase Auth + Firestore security rules enforce per-user access; sensitive secrets restricted to env vars. HTTPS enforced for all remote calls.
- **Maintainability:** Modular folder structure, typed services, and reusable components keep code easy to navigate. Documentation resides under `documentation/`.
- **Testability:** Service functions encapsulate side effects, enabling unit testing/mocking. Hooks expose deterministic state transitions.
- **Performance:** Indexed Firestore queries, debounced fetches, and compressed media preserve responsiveness on mobile networks.
- **Usability:** Consistent theming, clear validation, and modal workflows align with low-friction goals outlined in the SRS.

---
