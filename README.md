# **Onomis – Own Your Money, Own Your Future**

## 🌍 Vision & Mission
We are building **Onomis**, a personal finance companion that makes everyday money management effortless. Onomis helps people capture every income or expense, organize funds into wallets, and spot spending patterns that matter. Our mission focuses on:
- **Financial clarity without friction** – record transactions in seconds with friendly modals and smart defaults.
- **Actionable insights** – real-time wallets, category statistics, and dashboards that highlight what changed.
- **Trustworthy data** – secure authentication, consistent balances, and transparent documentation for every workflow.

---

## 🚀 Core Features

### 💼 Wallet Management
- Create, edit, and delete wallets with custom icons stored in Cloudinary.
- Track totals for balance, income, and expenses with automatic recalculations.

### 🧾 Transaction Engine
- Capture income or expenses with categories, descriptions, and optional receipt uploads.
- Edit or delete entries with safeguards that keep wallet balances in sync.

### 📊 Analytics & Dashboard
- Home dashboard highlights recent activity and wallet summaries.
- Statistics tab visualizes category trends, monthly comparisons, and spending ratios.

### 🙋 Authentication & Profile
- Firebase Authentication handles registration, login, and session persistence.
- Profile modal lets users update display name and avatar instantly.

### 🔍 Search & Filtering
- Search modal filters transactions by wallet, category, or time range.
- Pull-to-refresh and FlashList provide responsive browsing at scale.

---

## ⚙️ Technology Stack

- **Mobile App:** React Native 0.76, Expo Router 4.x, TypeScript
- **State & Logic:** React Context, custom hooks (`useFetchData`) for Firestore queries
- **Backend/BaaS:** Firebase Authentication, Firestore, optional Firebase Storage
- **Media Handling:** Cloudinary uploads with shared `imageService`
- **Analytics UI:** `react-native-gifted-charts`, Phosphor icons, Expo theming
- **Testing:** Jest (unit tests), Cucumber.js BDD scenarios (`documentation/UCs/features`)
- **Tooling:** ESLint, Prettier, Expo CLI, npm scripts
- **Project Management:** YouTrack board ([ONO](https://dhbw-newstudy.youtrack.cloud/projects/ONO))

---

## Documentation
This repository includes living documentation for requirements, architecture, and behavior. Key entry points:

- **Software Requirements Specification (SRS):** [documentation/SRS.md](https://github.com/kretekarfolyam/onomis/tree/main/documentation/SRS.md)
- **Software Architecture Document (SAD):** [documentation/Software_Architecture_Document.md](https://github.com/kretekarfolyam/onomis/tree/main/documentation/Software_Architecture_Document.md)
- **Use Case Specifications:** [documentation/UCs/](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/)
	- Transaction flow: [uc_add_transaction_detailed.md](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_transaction_detailed.md)
	- Wallet flow: [uc_add_wallet_detailed.md](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_wallet_detailed.md)
	- Profile avatar flow: [uc_add_profile_picture_detailed.md](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/uc_add_profile_picture_detailed.md)
- **BDD Feature Files:** [documentation/UCs/features/](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/features)
- **System Diagrams:** [documentation/diagrams/](https://github.com/kretekarfolyam/onomis/tree/main/documentation/diagrams)
	- Overall Use Case Diagram: [overall_use_case_diagram.png](https://github.com/kretekarfolyam/onomis/tree/main/documentation/diagrams/overall_use_case_diagram.png)

## References

| References |
|------------|
| [Onomis GitHub Repository](https://github.com/kretekarfolyam/onomis) |
| [Software Requirements Specification](https://github.com/kretekarfolyam/onomis/tree/main/documentation/SRS.md) |
| [Software Architecture Document](https://github.com/kretekarfolyam/onomis/tree/main/documentation/Software_Architecture_Document.md) |
| [Use Case Specifications](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/) |
| [BDD Feature Files](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/features) |
| [Overall Use Case Diagram](https://github.com/kretekarfolyam/onomis/tree/main/documentation/diagrams/overall_use_case_diagram.png) |

---

## 👥 Team
We collaborate as a cross-functional Onomis crew to deliver iterative releases:

- **Product & UX Lead** – shapes the finance journeys, validates requirements against the SRS, and curates backlog in YouTrack.
- **Mobile Engineer** – implements Expo Router navigation, screens, and reusable UI components with TypeScript discipline.
- **Backend Integration Engineer** – configures Firebase projects, authors Firestore security rules, and maintains Cloudinary automation.
- **QA & Documentation Specialist** – owns BDD feature files, ensures use case coverage, and keeps the knowledge base current.

---

## 🤝 Contributing
We welcome issues, pull requests, and documentation updates:
- Review the [SRS](https://github.com/kretekarfolyam/onomis/tree/main/documentation/SRS.md) to understand scope and constraints before proposing changes.
- Align new features with the architecture principles captured in the [SAD](https://github.com/kretekarfolyam/onomis/tree/main/documentation/Software_Architecture_Document.md).
- Add or update use case documentation in [documentation/UCs/](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/) when introducing new flows.
- Follow conventional commit messages and include relevant YouTrack issue IDs where applicable.

# Running the Project Locally

## Testing (Cucumber)
Quick start for behavior-driven scenarios (from the repository root):

```bash
# Install dependencies for BDD tests
npm install

# Execute the Gherkin features aligned with our use cases
npm run test:features
```

The command runs `@cucumber/cucumber` against [documentation/UCs/features](https://github.com/kretekarfolyam/onomis/tree/main/documentation/UCs/features) with step definitions stored in `tests/steps`.

## Backend Services
Onomis relies on managed services instead of a custom backend server. Configure the following before running the mobile app:

1. Create a Firebase project with Authentication (Email/Password) and Firestore enabled.
2. Download the web app configuration and populate `onomis/config/firebase.ts` with the project credentials.
3. Set up a Cloudinary account, generate an unsigned upload preset, and add the credentials to your Expo environment variables (`app.json` or `expo-env.d.ts`).
4. (Optional) Configure Firebase Storage if you plan to mirror Cloudinary assets.

## Mobile App (Expo)
Launch the Expo-powered mobile client from the `onomis/` directory:

```bash
cd onomis

# Install dependencies
npm install

# Start the Expo development server
npx expo start

# Optional platform shortcuts
npx expo start -i
npx expo start -a
```

The entry point uses Expo Router (`expo-router/entry`). Scan the QR code with Expo Go or run on a simulator/emulator. Use `npm run test` inside `onomis/` to execute Jest unit tests.

---

## 📣 Stay in Touch
- Issues & feature requests: submit via [GitHub Issues](https://github.com/kretekarfolyam/onomis/issues)
- Project tracking: [YouTrack Board – ONO](https://dhbw-newstudy.youtrack.cloud/projects/ONO)
- Questions: open a discussion or connect with the team through repository channels


