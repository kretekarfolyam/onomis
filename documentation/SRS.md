# Software Requirements Specification (SRS)  
**Project:** Onomis – Own Your Money, Own Your Future

---

## 1. Introduction  

### 1.1 Purpose  
This SRS defines the requirements for **Onomis**, a cross-platform mobile application that helps individuals record expenses and incomes, organize wallets, and visualize spending trends. The document guides designers, developers, and testers so they share a consistent understanding of what must be delivered.

### 1.2 Scope  
Onomis is a personal finance companion built with Expo + React Native. Authenticated users can register, manage their profile, configure wallets, track categorized transactions, review statistics, and adjust preferences. The solution relies on Firebase (authentication + Firestore database) and Cloudinary for media storage. Core subsystems:

- **Authentication & Profile** – registration, login, session state, profile picture, name, email.
- **Wallet Management** – CRUD operations for wallet entities (“Cash”, “Salary Account”, etc.).
- **Transaction Engine** – capture of income/expense entries, wallet linkage, optional receipts, categories.
- **Analytics & Dashboard** – real-time balance cards, recent activity, statistics/tabs for per-category views.
- **Settings** – lightweight preferences (language/currency placeholder) and logout flows.

Actors:

- **Guest** – sees onboarding, signs up.
- **Authenticated User** – performs the finance workflows above.
- **External Services** – Firebase Auth, Firestore, Cloudinary.

### 1.3 Definitions, Acronyms and Abbreviations  

| Term/Acronym | Description |
|--------------|-------------|
| SRS | Software Requirements Specification |
| UC | Use Case |
| UCD | Overall Use Case Diagram |
| N/A | Not Applicable |
| tbd | To Be Determined |
| FAQ | Frequently Asked Questions |
| MVP | Minimum Viable Product |
| API | Application Programming Interface |
| BaaS | Backend as a Service (Firebase) |
| Wallet | Logical container that holds a running balance and aggregates transactions |
| Transaction | Income or expense record linked to a wallet, category, timestamp, optional note/receipt |
| Category | Classification such as Food, Rent, Transport used for filtering and analytics |

### 1.4 References  

| Title | Link / Date | Organization |
|-------|-------------|--------------|
| Onomis GitHub Repository | [https://github.com/kretekarfolyam/onomis](https://github.com/kretekarfolyam/onomis) | Onomis Team |
| Documentation folder (UCs, diagrams) | [https://github.com/kretekarfolyam/onomis/tree/main/documentation](https://github.com/kretekarfolyam/onomis/tree/main/documentation) | Onomis Team |
| Expo Documentation | [https://docs.expo.dev](https://docs.expo.dev) | Expo |
| React Native Documentation | [https://reactnative.dev](https://reactnative.dev) | Meta |
| Firebase Documentation | [https://firebase.google.com/docs](https://firebase.google.com/docs) | Google |
| Cloudinary Documentation | [https://cloudinary.com/documentation](https://cloudinary.com/documentation) | Cloudinary |

### 1.5 Overview  
Section 2 outlines the vision, use case view, and tech stack. Section 3 details functional and non-functional requirements following the Common Playground template. Section 4 lists supporting information and navigation pointers for contributors.

---

## 2. Overall Description  

### 2.1 Vision  
Onomis empowers everyday users to **own their money**: capture every expense or income in seconds, assign it to the right wallet, attach receipts, and instantly see the impact on balances and trends. The app emphasizes clarity, low friction input, and actionable insights so users can make smarter financial decisions.

### 2.2 Use Case Diagram  
The overall use case diagram (UCD) highlights how a user interacts with authentication, wallet, transaction, analytics, and profile flows.  
[Overall Use Case Diagram](https://github.com/kretekarfolyam/onomis/tree/main/documentation/diagramas/overall_use_case_diagram.png)

### 2.3 Technology Stack  
- **Mobile App:** React Native + Expo Router, TypeScript, Phosphor icons, expo-image, react-native-dropdown-element.  
- **State & Context:** React Context for authentication state, hooks (`useFetchData`) for Firestore queries.  
- **Backend/BaaS:** Firebase Authentication, Firebase Firestore, Firebase Storage (via Cloudinary for images).  
- **Media Handling:** Cloudinary uploads for wallet icons, receipts, and profile photos.  
- **CI/CD:** Local Expo workflow; optional EAS build (future).  
- **Project Tooling:** ESLint, Prettier, Expo CLI, npm scripts.  
- **Target Platforms:** iOS and Android via Expo Go or standalone builds.

---

## 3. Specific Requirements  

### 3.1 Functionality  

This section describes the main functional use cases of Onomis. Each use case includes a brief description and links to detailed specifications where available.

#### 3.1.1 Create Account  
Users register with email/password through the registration screen. The system stores identity in Firebase Auth and creates a Firestore user document with name, email, and default profile fields. Validation ensures email format and password strength requirements.  
Reference: UC tbd

#### 3.1.2 Authenticate (Login/Logout)  
Users log in via the `(auth)/login` screen with email and password. Successful authentication routes to the `(tabs)` home screen with persistent session state managed by Firebase Auth. Logout clears the session and returns to the welcome screen.  
Reference: UC tbd

#### 3.1.3 Manage Profile & Avatar  
Users access the profile modal to edit their display name and upload a profile photo. Images are validated (format, size) and stored in Cloudinary. Changes persist to Firestore and update the authentication context immediately.  
Reference: [UC – Add Profile Picture](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_profile_picture_detailed.md)

#### 3.1.4 View Wallets  
The wallet tab displays a list of user wallets showing name, icon, current balance, total income, and total expenses. Users can tap a wallet to view detailed transaction history or access edit/delete actions. Pull-to-refresh updates the wallet list.  
Reference: UC tbd

#### 3.1.5 Create or Edit Wallet  
Users can add a new wallet or edit an existing one via the wallet modal. Required fields include wallet name; optional fields include a custom icon uploaded to Cloudinary. The system initializes new wallets with zero balance and timestamps creation.  
Reference: [UC – Add Wallet](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_wallet_detailed.md)

#### 3.1.6 Delete Wallet  
Users may delete a wallet after confirmation. The system cascades deletion of all linked transactions via `walletService.ts` to maintain referential integrity. A warning dialog alerts users about data loss before proceeding.  
Reference: UC tbd

#### 3.1.7 View Transactions  
The home dashboard displays recent transactions with amount, type, category, date, and associated wallet. Users can filter transactions by wallet, category, or date range via the search modal. Transaction lists support pull-to-refresh for updates.  

#### 3.1.8 Add / Edit Transaction  
Users create or update transactions via the transaction modal. Required fields: wallet, type (income/expense), amount, date. Optional fields: category (required for expenses), description, receipt image. The system validates sufficient wallet balance for expenses and automatically updates wallet totals.  
Reference: [UC – Add Transaction](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_transaction_detailed.md)

#### 3.1.9 Delete Transaction  
Users delete transactions from lists with swipe actions or detail screens. The system reverts wallet balances (subtracts income or adds back expenses) to maintain consistency. Confirmation prompts prevent accidental deletion.  
Reference: UC tbd

#### 3.1.10 Categorize Transactions  
Expense transactions require category selection from predefined options in `constants/data.ts` (Food, Transport, Shopping, Entertainment, Bills, Healthcare, etc.). Income transactions do not require categories. Categories enable filtering and statistical breakdowns.  
Reference: Implemented in transaction modal; categories are part of the Add Transaction use case.

#### 3.1.11 View Statistics  
The statistics tab provides insights through visual summaries: spending by category, income vs expenses over time, wallet comparisons, monthly trends. Data is aggregated from Firestore queries and presented in charts and summary cards.  
Reference: UC tbd

#### 3.1.12 Manage Settings  
The profile tab provides access to settings including logout functionality. Future enhancements may include currency preferences, language selection, notification settings, and privacy options. Current implementation focuses on account management and logout.  
Reference: UC tbd

### 3.2 Usability  

#### 3.2.1 Navigation and Consistency  
- Consistent bottom tab navigation for main sections: `Home`, `Wallet`, `Statistics`, `Profile`.  
- Standardized headers across all screens with back buttons and contextual titles.  
- Modal-based flows for data entry (transactions, wallets, profile) minimize navigation complexity.

#### 3.2.2 Input Validation and Feedback  
- Inline validation with friendly error alerts (e.g., "Please fill all the fields").  
- Clear visual feedback for loading states using `Loading.tsx` component.  
- Success confirmations implicit through navigation (returning to previous screen).  
- Error messages are user-friendly, avoiding technical jargon.

#### 3.2.3 Visual Design  
- Dark-friendly color palette ensures legibility in various lighting conditions.  
- Consistent spacing and typography through theme constants (`constants/theme.ts`).  
- Icon-based visual language (Phosphor icons) for quick recognition of actions and categories.

#### 3.2.4 Learning Curve  
- New users should complete their first transaction within five minutes.  
- Intuitive form layouts with clearly labeled required and optional fields.  
- Minimal onboarding required; UI is self-explanatory through visual cues and standard patterns.

### 3.3 Reliability  

#### 3.3.1 System Availability  
- Firebase infrastructure provides ≥99.9% uptime baseline for authentication and database services.  
- Graceful degradation: app displays cached data when network is temporarily unavailable.  
- Error recovery mechanisms notify users of issues and allow retry operations.

#### 3.3.2 Data Integrity  
- Wallet balances updated atomically alongside transaction operations to prevent inconsistencies.  
- Transaction creation and wallet updates handled in transactional manner through Firestore batched writes.  
- Referential integrity maintained through cascade deletion (deleting wallet removes associated transactions).

#### 3.3.3 Error Prevention  
- Local state guarded against duplicate submissions via `loading` flags and button disabling.  
- Validation checks prevent invalid data entry (negative amounts, empty required fields).  
- Failed uploads or Firestore writes notify the user and preserve current form state for retry.

#### 3.3.4 Data Persistence  
- All financial data persisted to Firebase Firestore cloud database.  
- Images stored redundantly on Cloudinary with URLs saved in Firestore.  
- No critical data stored only in local state; all operations sync to cloud immediately.

### 3.4 Performance  

#### 3.4.1 Response Times  
- Modal form submissions (transaction, wallet) must complete in ≤2 seconds on typical LTE connection.  
- Image uploads to Cloudinary target ≤3 seconds for files under 5MB (compressed to 50% quality).  
- Dashboard initial load should complete in ≤4 seconds for users with ≤500 transactions.

#### 3.4.2 Data Volume  
- System designed to handle up to 1,000 transactions per user efficiently.  
- Firestore queries optimized with indexed filters on `uid` and `created` timestamp fields.  
- Lazy loading or pagination implemented for transaction lists exceeding 100 items.

#### 3.4.3 Query Optimization  
- Firestore queries scoped to authenticated user only (`where("uid", "==", user.uid)`).  
- Compound indexes configured for common query patterns (user + date sorting).  
- Local caching through React state reduces redundant database reads.

#### 3.4.4 Network Efficiency  
- Image compression (50% quality, 4:3 aspect ratio) reduces upload bandwidth.  
- Minimal payload sizes through selective field queries (not fetching entire collections).  
- Pull-to-refresh pattern prevents excessive automatic refreshes.  

### 3.5 Supportability  

#### 3.5.1 Code Organization  
- Codebase organized by feature folders: `components/`, `contexts/`, `hooks/`, `services/`, `utils/`.  
- TypeScript typings in `types.ts` enforce consistent data contracts across the application.  
- Clear separation of concerns: UI components, business logic (services), and state management (contexts).

#### 3.5.2 Development Support  
- README documents environment setup, Firebase configuration, and Cloudinary integration.  
- Scripts folder (`scripts/reset-project.js`) provides utilities for project maintenance.  
- Separable modules (`walletService`, `transactionService`, `userService`, `imageService`) enable unit testing and mocking.  

#### 3.5.3 Extensibility  
- Modular service architecture allows easy addition of new features (budgets, recurring transactions, export).  
- Firebase Firestore schema supports flexible querying for future analytics enhancements.  
- Component library (Button, Input, Modal) provides consistent UI building blocks for new screens.

### 3.6 Design Constraints  
- Must remain compatible with Expo Go (no bare native modules outside approved list).  
- Authentication bound to Firebase Auth; replacing it requires refactoring `authContext`.  
- Firestore document schema (wallets, transactions) dictates available queries and indexes.  
- Cloudinary usage requires network connectivity and valid API keys stored securely.  

### 3.7 Online User Documentation and Help System Requirements  

#### 3.7.1 In-App Help  
- Clear error messages and validation feedback guide users through correct input.  
- Alert dialogs explain consequences of destructive actions (delete wallet, delete transaction).  
- Future enhancement: Welcome screen tutorial or tooltips for first-time users.

#### 3.7.2 Developer Documentation  
- README.md provides setup instructions, environment configuration, and quick start guide.  
- Use case documents in `documentation/UCs/` detail user flows and system behavior.  
- Code comments explain complex business logic in service files.

#### 3.7.3 External Resources  
- GitHub repository serves as central documentation hub.  
- Architecture diagrams available in `documentation/diagrams/` folder.  
- Environment variables documented with examples (.env.example format recommended).  

### 3.8 Purchased Components  

#### 3.8.1 Current Services (Free Tier)  
- **Firebase Authentication**: Free tier supports unlimited users with email/password authentication.  
- **Firebase Firestore**: Free tier includes 1GB storage and 50K reads/20K writes per day.  
- **Cloudinary**: Free tier provides 25GB storage and 25GB bandwidth per month.

#### 3.8.2 Potential Paid Upgrades  
If the project scales beyond student project scope, the following upgrades may be needed:
- Cloudinary paid plan for increased storage/bandwidth if many users upload large receipt images.  
- Firebase Blaze plan if read/write operations exceed free tier limits.  
- No current paid subscriptions are required for MVP (Minimum Viable Product) functionality.

### 3.9 Interfaces  

#### 3.9.1 User Interfaces  
- **Welcome/Login/Register** – onboarding carousel, credential entry.  
- **Home Dashboard** – balance cards (`HomeCard`), quick actions, recent transactions.  
- **Wallets Tab** – list of wallets, “Add Wallet” FAB, wallet detail modal.  
- **Transactions Modal** – multi-field form with dropdowns, date picker, receipt uploader.  
- **Statistics Tab** – charts/cards summarizing spending by category and period.  
- **Profile Tab/Modal** – avatar, name/email, preferences, logout.

#### 3.9.2 Hardware Interfaces  
N/A beyond standard iOS/Android sensors and storage.

#### 3.9.3 Software Interfaces  
- **Firebase Auth** – handles login/logout, session tokens.  
- **Firestore** – collections: `users`, `wallets`, `transactions`.  
- **Cloudinary** – REST upload API for images.  
- **Expo Modules** – ImagePicker, FileSystem for local media.

#### 3.9.4 Communication Interfaces  
- **Protocol**: HTTPS required for all external communications (Firebase, Cloudinary APIs).  
- **Network Requirements**: Device must have active internet connection for authentication, data sync, and image uploads.  
- **Data Format**: JSON for Firebase Firestore documents and API requests; multipart/form-data for Cloudinary image uploads.  
- **Real-time Updates**: Current implementation uses on-demand queries (`getDocs`); real-time listeners (`onSnapshot`) are available but not currently implemented.  
- **Offline Capability**: Limited offline support; Firebase SDK provides basic caching but full offline mode is not implemented.  

### 3.10 Licensing Requirements  

#### 3.10.1 Project License  
- Repository intended for MIT License or similar permissive open-source license.  
- License should be confirmed in root LICENSE file and package.json.  
- All original code is licensed under the chosen project license.

#### 3.10.2 Third-Party Dependencies  
- All npm packages and libraries must comply with their respective open-source licenses.  
- Major dependencies (React Native, Expo, Firebase SDK) use permissive licenses compatible with commercial use.  
- Cloudinary SDK follows its own terms of service and API usage agreements.

### 3.11 Legal, Copyright And Other Notices  

#### 3.11.1 User Responsibilities  
- Users are responsible for the accuracy and completeness of financial data they enter.  
- Onomis is a tracking tool; it does not provide financial advice or tax guidance.  
- Users must comply with local laws regarding financial record-keeping.

#### 3.11.2 Data Privacy  
- The app stores personal financial information; developers must follow data protection best practices.  
- Sensitive data (passwords, tokens) must never be logged or exposed in client code.  
- Contributors must respect user privacy and handle data in accordance with GDPR/CCPA where applicable.

#### 3.11.3 Third-Party Services  
- Firebase Terms of Service and Privacy Policy apply to authentication and data storage.  
- Cloudinary Terms of Service govern image storage and delivery.  
- Users implicitly accept these third-party terms when using the application.

#### 3.11.4 Disclaimer  
- This is a student project provided "as is" without warranty of any kind.  
- Developers are not liable for data loss, financial decisions, or damages resulting from app use.  
- Users should maintain independent backups of important financial records.

### 3.12 Applicable Standards  

#### 3.12.1 Documentation Standards  
- **IEEE 830**: Software Requirements Specification recommended practice guides this document's structure.  
- Use case documentation follows standard format with preconditions, main flow, alternative flows, and postconditions.

#### 3.12.2 Coding Standards  
- **TypeScript**: Strict type checking enabled for type safety.  
- **ESLint + Prettier**: Code formatting and linting enforced through configuration files.  
- **React/React Native Best Practices**: Functional components, hooks, and modern patterns preferred.  
- **Naming Conventions**: camelCase for variables/functions, PascalCase for components, UPPER_CASE for constants.

#### 3.12.3 Security Standards  
- **OWASP Mobile Security**: Best practices for token storage, network communication, and input validation.  
- **Firebase Security Rules**: Firestore rules enforce user-level data isolation.  
- **Authentication**: Firebase Auth handles secure credential storage and session management.

#### 3.12.4 Accessibility Standards  
- **WCAG 2.1**: Color contrast ratios meet AA standards where feasible.  
- Touch targets sized appropriately for mobile interaction (minimum 44x44 points).  
- Text remains readable with system font size adjustments.

---

## 4. Supporting Information  

### 4.1 Additional Documentation  
Further project artifacts are organized in the repository as follows:

- **Use Case Specifications**: Detailed use case documents located in `documentation/UCs/` folder.  
  - [UC – Add Transaction](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_transaction_detailed.md)  
  - [UC – Add Wallet](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_wallet_detailed.md)  
  - [UC – Add Profile Picture](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_profile_picture_detailed.md)  


- **Gherkin Feature Files**: Behavior-driven development scenarios in `documentation/UCs/features/`.  
  - [Add Transaction Feature](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/features/add_transaction.feature)  
  - [Add Wallet Feature](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/features/add_wallet.feature)  
  - [View Dashboard Feature](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/features/view_dashboard.feature)

- **System Diagrams**: Architecture and use case diagrams in `documentation/diagrams/` folder.

- **Architecture Document**: Software Architecture Document (SAD) available at [Software_Architecture_Document.md](https://github.com/kretekarfolyam/onomis/tree/main/documentation/Software_Architecture_Document.md).

### 4.2 Project Management  
- **GitHub Repository**: [https://github.com/kretekarfolyam/onomis](https://github.com/kretekarfolyam/onomis)  
- **Issue Tracking**: YouTrack at [https://dhbw-newstudy.youtrack.cloud/projects/ONO](https://dhbw-newstudy.youtrack.cloud/projects/ONO) for bug reports, feature requests, and task management.  
- **Project Board**: YouTrack board at [https://dhbw-newstudy.youtrack.cloud/projects/ONO](https://dhbw-newstudy.youtrack.cloud/projects/ONO) for milestone tracking and sprint planning.

### 4.3 Getting Started  
For new contributors and developers:

1. **Setup Instructions**: Consult the root [README.md](https://github.com/kretekarfolyam/onomis/blob/main/README.md) for environment setup, dependency installation, and configuration.  
2. **Use Case Flows**: Review use case documents in `documentation/UCs/` to understand user interactions and system behavior.  
3. **Code Structure**: Explore the `onomis/` folder structure with organized components, services, and utilities.  
4. **Architecture**: Read the Software Architecture Document for system design decisions and patterns.

### 4.4 Contact and Support  
- Questions and discussions: Use GitHub Discussions.  
- Documentation improvements: Submit pull requests to the `documentation/` folder.  
- Code contributions: Follow the contribution guidelines in the repository.