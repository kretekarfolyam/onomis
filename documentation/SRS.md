# Software Requirements Specification (SRS)  
**Project:** Onomis - Own Your Money, Own Your Future 


---

## 1. Introduction  

### 1.1 Purpose  
This Software Requirements Specification (SRS) describes all specifications for the application **ONOMIS**, a mobile-first personal finance app focused on simple expense & income tracking with a clear balance overview. It captures the system’s purpose, vision, features, and constraints to guide implementation and testing.

### 1.2 Scope  
The project will be implemented as a **cross‑platform mobile app** (Expo/React Native) with a lightweight REST API (Node/Express + PostgreSQL). 
Primary stakeholders and actors:

- **Guest** – sees marketing/onboarding, proceeds to sign-up.
- **Authenticated User** – creates transactions (income/expense), views balance & history, deletes items, logs out.
- **Administrator** – oversees system health, database, and access control (out of band/ops).

**In scope (MVP):**  
- Email-code authentication with Clerk (signup/login/verification, logout).  
- Dashboard showing **current balance** and **transaction history** (latest first).  
- Create income/expense, delete transactions, pull-to-refresh.  
- iOS/Android app (Expo), Express API with Postgres + Redis.  

**Out of scope (v1):**  
- Budgets, charts/analytics, multi-currency.  
- Web app version.  
- Payment integrations.  
- Push notifications.  

### 1.3 Definitions, Acronyms and Abbreviations  
| Abbrevation | Explanation                            |
| ----------- | -------------------------------------- |
| SRS         | Software Requirements Specification    |
| UC          | Use Case                               |
| UCD         | overall Use Case Diagram               |
| N/A         | not applicable                         |
| tbd         | to be determined                       |
| FAQ         | Frequently asked Questions             |
| MVP         | Minimum Viable Product                 |
| JWT         | JSON Web Token                         |
| a11y        | Accessibility                          |
| i18n        | Internationalization                   |
| REST        | Representational State Transfer        |
| CRUD        | Create, Read, Update, Delete           |
| Neon        | Managed Postgres database              |
| Expo        | React Native framework for cross-platform mobile development|
| Clerk       |  Hosted authentication service         |

### 1.4 References  
| Title                                                              | Date       | Publishing organization             |
| -------------------------------------------------------------------|:----------:| ------------------------------------|
| ONOMIS Project Docs (internal)                                     | 01.10.2025 | ONOMIS Team                         |
| IEEE 830 – SRS Recommended Practice                                |            | IEEE                                |
| [React Native](https://reactnative.dev)                            |            | Meta Platform                       |
| [Expo](https://expo.dev)                                           |            | EXPO                                |
| [Express](https://expressjs.com)                                   |            | Open JS Foundation                  |
| [PostgreSQL](https://www.postgresql.org)                           |            | PostgreSQL Global Development Group |
| [Clerk](https://clerk.com/doc)                                     |            | Clerk.dev                           |
| [Redis Docs](https://redis.io/documentation)                       |            | Redis Ltd.                          |

### 1.5 Overview  
This SRS covers the overall description of the product and its requirements, including functional, non-functional, platform, and process specifications.  

---

## 2. Overall Description  

- **Product perspective:** Full-stack mobile app (Expo frontend + Express backend).  
- **Core functions:** Auth, dashboard showing balance/transactions, create/delete transactions, pull-to-refresh, logout.  
- **Users:** General mobile app users; no training required.  
- **Constraints:** Must use Expo, Express, Clerk, Postgres (Neon), Redis.  
- **Dependencies:** Availability of Clerk, Neon Postgres, Redis; internet connectivity; iOS/Android devices.  

---

## 3. Specific Requirements  

### 3.1 Functionality  

#### 3.1.1 Authentication  
- Users can sign up & log in with email (6-digit code verification).  
- Verified users gain access to protected screens.  
- Logout clears session and redirects to login.  
- Sessions persist until logout.  

#### 3.1.2 Transactions  
- Add a transaction:  
  - Amount (numeric, required).  
  - Type (income/expense).  
  - Note (optional).  
  - Timestamp (auto).  
- Delete transaction by ID.  
- Balance updates automatically after every change.  

#### 3.1.3 Dashboard & Refresh  
- Display **current balance**.  
- Display **past transactions** (newest first).  
- Allow **pull-to-refresh** to fetch updated data.  

#### 3.1.4 Navigation & Session  
- Auth-guarded routes (Home, Create).  
- App startup redirects based on session state.  
- Logout navigates to login.  

---

### 3.2 Usability  

#### 3.2.1 Usability Requirement One  
- Minimalist 3-screen flow: **Login**, **Home**, **Create Transaction**.  
- First-time users can add a transaction and view balance in under **5 minutes**.  
- Input validation with clear error messages.  

---

### 3.3 Reliability  

#### 3.3.1 Reliability Requirement One  
- Backend uptime target: **≥99% per month**.  
- Balance always consistent with transactions in DB.  
- App recovers gracefully from network/API errors.
- Redis caching prevents excessive API calls and improves resilience.  
- Local state persists temporarily if network connection drops; syncs automatically when online.

---

### 3.4 Performance  

#### 3.4.1 Performance Requirement One  
- API response latency: **≤500 ms median** for normal datasets (<1k rows).  
- Dashboard loads in **≤5 seconds**.  
- Pull-to-refresh completes in **≤2 seconds** with <100 transactions.  

---

### 3.5 Supportability  

#### 3.5.1 Supportability Requirement One  
- Code follows React Native and Express conventions.  
- Setup documented in README.  
- New devs can run system in under **30 minutes**.  
- Environment managed via `.env`.  

**Required environment variables (from repo):**  
- Backend: `PORT`, `NODE_ENV`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL`, `REDIS_URL`  
- Mobile: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`  

---

### 3.6 Design Constraints  

#### 3.6.1 Design Constraint One  
- Frontend: **React Native + Expo**.  
- Backend: **Node.js + Express**.  
- Authentication: **Clerk**.  
- Database: **PostgreSQL (Neon)**.  
- Cache/Rate limiting: **Redis**.  

---

### 3.7 Online User Documentation and Help System Requirements  
- README includes setup, install, run instructions.  
- User-facing error messages are simple and clear (no technical stack traces).  

---

### 3.8 Purchased Components  
- Clerk (auth).  
- Neon Postgres (DB).  
- Redis Cloud (rate limiting).
- Cloudinary subscription (file hosting).


---

### 3.9 Interfaces  

#### 3.9.1 User Interfaces  
- **Login Screen**: email input, code entry.  
- **Home Screen**: balance display, transaction list, pull-to-refresh.  
- **Create Screen**: input fields (amount, type, note), submit button.
- **Error Modals / Toasts** – Display API or validation errors.  


#### 3.9.2 Hardware Interfaces  
- iOS 13+ / Android 8+ smartphones.  

#### 3.9.3 Software Interfaces  
- REST API:  
  - `GET /transactions` – list  
  - `POST /transactions` – create  
  - `DELETE /transactions/:id` – delete  
  - `GET /balance` – current balance  
- Clerk Api (Authentication)
- Neon Postgress DB
- Redis Cloudq


#### 3.9.4 Communications Interfaces  
- HTTP/HTTPS; HTTPS required in production.  

---

### 3.10 Licensing Requirements  
- Open-source license (MIT unless otherwise specified).  

### 3.11 Legal, Copyright and Other Notices  
- Clerk, Neon, Redis subject to their own licenses.  
- App branding must not violate third-party trademarks.  

### 3.12 Applicable Standards  
- REST API best practices.  
- OWASP auth/session security.  
- IEEE-830 (SRS standard).
- ESLint/Prettier (JS/TS).

---

## 4. Supporting Information  

### Repo Structure  
- `/backend` – Express + Postgres + Redis.  
- `/mobile` – React Native (Expo).  
- `README.md` – setup guide.  

### Run Instructions (from README)  
```bash
# Backend
cd backend
npm install
npm run dev

# Mobile
cd mobile
npm install
npx expo start
