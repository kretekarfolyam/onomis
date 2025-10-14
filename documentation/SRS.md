# Software Requirements Specification (SRS)  
**Project:** Onomis - Own Your Money, Own Your Future 


---

## 1. Introduction  

### 1.1 Purpose  
This document defines the requirements for a mobile wallet/expense tracker with an Express backend, Clerk authentication, PostgreSQL storage (via Neon), and Redis-based rate limiting. It is intended to guide development, quality assurance, and onboarding for contributors.  

### 1.2 Scope  
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
- **Clerk** – Hosted authentication service.  
- **Expo** – React Native framework for cross-platform mobile development.  
- **Neon** – Managed Postgres database.  
- **CRUD** – Create, Read, Update, Delete.  
- **JWT** – JSON Web Token.  

### 1.4 References  
- GitHub Repo: this repository
- Clerk Docs: https://clerk.com/docs  
- Expo Docs: https://docs.expo.dev  
- PostgreSQL Docs: https://www.postgresql.org/docs  
- Redis Docs: https://redis.io/documentation  

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

---

### 3.9 Interfaces  

#### 3.9.1 User Interfaces  
- **Login Screen**: email input, code entry.  
- **Home Screen**: balance display, transaction list, pull-to-refresh.  
- **Create Screen**: input fields (amount, type, note), submit button.  

#### 3.9.2 Hardware Interfaces  
- iOS 13+ / Android 8+ smartphones.  

#### 3.9.3 Software Interfaces  
- REST API:  
  - `GET /transactions` – list  
  - `POST /transactions` – create  
  - `DELETE /transactions/:id` – delete  
  - `GET /balance` – current balance  

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
