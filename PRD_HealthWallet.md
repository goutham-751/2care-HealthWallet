# Product Requirements Document
## Digital Health Wallet — 2care.ai Assignment

**Version:** 1.0  
**Author:** Goutham  
**Date:** May 2026  
**Status:** Ready for Implementation

---

## 1. Executive Summary

The Digital Health Wallet is a full-stack web application that serves as a centralized, secure repository for a user's personal health records. The product solves a real, widespread problem: health data for most individuals is scattered across clinics, labs, hospitals, and paper files — inaccessible at the moment it's needed most.

This application gives users a single authenticated space to upload reports, track vitals over time, visualize health trends, and securely share records with doctors, family members, and trusted individuals — all through a clean, intuitive interface.

**Core Value Propositions:**
- One place for all health records — accessible anywhere, anytime
- Vitals trending so users can see health patterns over time
- Granular, revocable access sharing with trusted people
- Role-based access control: Owner vs. Viewer

---

## 2. Product Scope

### 2.1 In Scope (MVP)
- User registration, login, and JWT-based authentication
- Role model: Owner (full CRUD) and Viewer (read-only)
- Medical report upload (PDF / image) with metadata tagging
- Vitals data entry and trend visualization (charts)
- Report search and filter (by date, category, vital type)
- Access sharing with named users at the report or record level
- Share link management (grant and revoke)

### 2.2 Out of Scope (Future)
- WhatsApp integration for report upload
- AI-based OCR for report parsing
- Wearable device sync (Fitbit, Apple Watch)
- Payment gateways, subscription tiers
- HIPAA/ABDM compliance hardening (noted as future)

---

## 3. User Personas

### Persona 1 — Riya, 34 (Primary Owner)
A working professional managing her own health and her aging parents' records. She needs to quickly retrieve a blood test from 6 months ago during a doctor's visit. She shares reports selectively with her physician.

### Persona 2 — Dr. Suresh, 52 (Viewer — Doctor)
A cardiologist who needs to view a patient's vitals history and recent ECG before a consultation. He needs read-only, time-limited access.

### Persona 3 — Arjun, 28 (Viewer — Family Member)
Riya's brother who monitors their parents' health. He can see shared reports and vitals trends but cannot upload or delete anything.

---

## 4. Functional Requirements

### 4.1 User Management

| ID | Requirement | Priority |
|----|-------------|----------|
| UM-01 | User can register with name, email, password | P0 |
| UM-02 | User can log in with email and password | P0 |
| UM-03 | JWT token issued on login, stored in httpOnly cookie | P0 |
| UM-04 | Token refresh mechanism (15-min access, 7-day refresh) | P1 |
| UM-05 | User profile page showing name, email, join date | P1 |
| UM-06 | Password hashing with bcrypt (12 salt rounds) | P0 |

### 4.2 Health Reports

| ID | Requirement | Priority |
|----|-------------|----------|
| HR-01 | Upload reports in PDF or image format (JPG, PNG) | P0 |
| HR-02 | Set metadata on upload: report type, date, notes, vitals | P0 |
| HR-03 | Report types: Blood Test, X-Ray, MRI, ECG, Prescription, Other | P0 |
| HR-04 | Associated vitals per report: BP, Sugar, Heart Rate, SpO2, Cholesterol, Weight, Temperature | P0 |
| HR-05 | View a list of all uploaded reports with metadata | P0 |
| HR-06 | Download original uploaded file | P0 |
| HR-07 | Delete a report (Owner only) | P1 |
| HR-08 | Edit report metadata after upload | P1 |
| HR-09 | File size limit: 10MB per file | P0 |
| HR-10 | Files stored in `/uploads` directory on server, path saved in DB | P0 |

### 4.3 Vitals Tracking

| ID | Requirement | Priority |
|----|-------------|----------|
| VT-01 | Log a vitals entry manually (independent of report upload) | P0 |
| VT-02 | Vitals supported: Systolic/Diastolic BP, Blood Sugar (fasting/PP), Heart Rate, SpO2, Weight, Temperature | P0 |
| VT-03 | Each vitals entry has a timestamp and optional note | P0 |
| VT-04 | Dashboard displays individual line/area charts per vital type | P0 |
| VT-05 | Filter vitals by date range (7 days, 30 days, 90 days, custom) | P0 |
| VT-06 | Show min, max, average for any selected date range | P1 |
| VT-07 | Visual indicator if a vital is outside normal range (color-coded) | P1 |

### 4.4 Report Retrieval

| ID | Requirement | Priority |
|----|-------------|----------|
| RR-01 | Search reports by keyword (report name, notes) | P0 |
| RR-02 | Filter by report category (Blood Test, X-Ray, etc.) | P0 |
| RR-03 | Filter by date range | P0 |
| RR-04 | Filter by associated vital type | P1 |
| RR-05 | Sort results by date (newest/oldest) | P0 |
| RR-06 | Paginated results (10 per page) | P1 |

### 4.5 Access Control & Sharing

| ID | Requirement | Priority |
|----|-------------|----------|
| AC-01 | Owner can share a specific report with another user by email | P0 |
| AC-02 | Shared user receives Viewer role for that specific report | P0 |
| AC-03 | Owner can revoke access at any time | P0 |
| AC-04 | Shared user logs in with their own account to view shared reports | P0 |
| AC-05 | "Shared with me" section in Viewer dashboard | P0 |
| AC-06 | Owner can see list of all people they've shared reports with | P1 |
| AC-07 | Viewer cannot download files unless Owner explicitly allows it | P1 |
| AC-08 | Sharing audit log: who shared what, when | P2 |

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | API response < 500ms for list queries; < 2s for file upload |
| Security | All routes protected by JWT middleware; files not publicly accessible by URL |
| Reliability | Application must handle concurrent users without data collision |
| Usability | Mobile-responsive layout; touch-friendly components |
| Maintainability | All backend routes documented in README; modular code structure |
| Scalability | SQLite for MVP; schema designed to migrate to PostgreSQL without breaking |

---

## 6. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│                  ReactJS (Vite + TailwindCSS)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Auth Pages  │  │  Dashboard   │  │  Reports / Share │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│         │                  │                   │             │
│         └──────────────────┴───────────────────┘             │
│                       Axios + React Query                     │
└─────────────────────────────┬───────────────────────────────┘
                               │ HTTPS REST API
┌──────────────────────────────▼──────────────────────────────┐
│                       BACKEND LAYER                          │
│                 Node.js + Express.js                         │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Auth      │  │ Reports      │  │ Vitals / Share       │ │
│  │ Middleware│  │ Controller   │  │ Controller           │ │
│  └───────────┘  └──────────────┘  └──────────────────────┘ │
│         │                  │                   │             │
│     JWT Verify        Multer (upload)    Access Guard        │
└─────────────────┬────────────────────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────────────────────┐
│                       DATA LAYER                             │
│   SQLite (better-sqlite3)       /uploads (local file store)  │
│  ┌────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ users  │ │ reports │ │  vitals  │ │  report_shares   │  │
│  └────────┘ └─────────┘ └──────────┘ └──────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. Database Schema

### Table: `users`
```sql
CREATE TABLE users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,            -- bcrypt hash
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `reports`
```sql
CREATE TABLE reports (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  title         TEXT NOT NULL,
  report_type   TEXT NOT NULL,           -- 'Blood Test', 'X-Ray', etc.
  report_date   DATE NOT NULL,
  file_path     TEXT NOT NULL,           -- relative path in /uploads
  file_type     TEXT NOT NULL,           -- 'pdf' | 'image'
  notes         TEXT,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Table: `report_vitals`
```sql
CREATE TABLE report_vitals (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id   INTEGER NOT NULL,
  vital_type  TEXT NOT NULL,            -- 'BP_systolic', 'sugar_fasting', etc.
  value       REAL NOT NULL,
  unit        TEXT NOT NULL,            -- 'mmHg', 'mg/dL', 'bpm', '%', 'kg', '°C'
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);
```

### Table: `vitals`
```sql
CREATE TABLE vitals (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL,
  vital_type  TEXT NOT NULL,
  value       REAL NOT NULL,
  unit        TEXT NOT NULL,
  recorded_at DATETIME NOT NULL,
  note        TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Table: `report_shares`
```sql
CREATE TABLE report_shares (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id       INTEGER NOT NULL,
  owner_id        INTEGER NOT NULL,
  shared_with_id  INTEGER NOT NULL,
  can_download    INTEGER DEFAULT 0,     -- 0 = false, 1 = true
  shared_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id),
  FOREIGN KEY (shared_with_id) REFERENCES users(id)
);
```

---

## 8. API Contract Summary

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login, receive JWT |
| POST | `/api/auth/logout` | Invalidate session |
| GET | `/api/auth/me` | Get current user profile |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | List own reports (supports query: type, date_from, date_to, vital_type) |
| POST | `/api/reports` | Upload report with metadata (multipart/form-data) |
| GET | `/api/reports/:id` | Get single report detail |
| PUT | `/api/reports/:id` | Update report metadata |
| DELETE | `/api/reports/:id` | Delete report |
| GET | `/api/reports/:id/file` | Download/stream file |

### Vitals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vitals` | Get vitals (supports query: type, from, to) |
| POST | `/api/vitals` | Log a new vitals entry |
| DELETE | `/api/vitals/:id` | Delete a vitals entry |

### Sharing
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shares` | Share a report with user by email |
| GET | `/api/shares/mine` | Get all shares I've created |
| GET | `/api/shares/with-me` | Reports shared with me |
| DELETE | `/api/shares/:id` | Revoke a share |

---

## 9. User Flows

### Flow 1: New User Onboarding
1. User visits `/register`
2. Fills name, email, password → POST `/api/auth/register`
3. Redirected to Dashboard (empty state with upload CTA)

### Flow 2: Upload a Report
1. User clicks "Upload Report"
2. Selects file (PDF/image) → previewed
3. Fills metadata: title, type, date, notes
4. Adds vitals (optional: BP, sugar, heart rate)
5. Submits → POST `/api/reports` (multipart)
6. Redirected to report detail page

### Flow 3: View Vitals Trends
1. User visits "Vitals" tab
2. Sees charts for each tracked vital
3. Selects date range filter (e.g., last 30 days)
4. Chart re-renders with filtered data

### Flow 4: Share a Report
1. User opens a report
2. Clicks "Share" → enters email of recipient
3. Toggles "Allow Download" on/off
4. Submits → POST `/api/shares`
5. Recipient can see report in their "Shared with Me" section

### Flow 5: Viewer Experience
1. Viewer logs in with their own account
2. Navigates to "Shared with Me"
3. Sees list of reports shared by others
4. Can open/read; may or may not download based on permissions

---

## 10. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Password storage | bcrypt with 12 salt rounds; never stored in plain text |
| Authentication | JWT with short-lived access token (15 min) + httpOnly cookie for refresh token |
| File access | Files served via authenticated API endpoint, not exposed as static public URLs |
| Upload validation | Multer file type whitelist (PDF, JPG, PNG); max size 10MB |
| Authorization | Every protected route checks JWT; every resource access checks `user_id` ownership |
| CORS | Restricted to frontend origin only |
| SQL injection | All queries use parameterized statements (no raw string interpolation) |
| Share boundary | Viewer can only access explicitly shared reports; no cross-user data leakage |

---

## 11. Project Folder Structure

```
health-wallet/
├── client/                   # ReactJS frontend
│   ├── src/
│   │   ├── api/              # Axios instances + query hooks
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level page components
│   │   ├── context/          # AuthContext
│   │   ├── hooks/            # useVitals, useReports, etc.
│   │   └── utils/            # formatters, validators
│   └── vite.config.js
│
├── server/                   # Node.js backend
│   ├── src/
│   │   ├── routes/           # auth.js, reports.js, vitals.js, shares.js
│   │   ├── controllers/      # business logic per domain
│   │   ├── middleware/        # authenticate.js, authorize.js, upload.js
│   │   ├── db/               # db.js (better-sqlite3 init + schema)
│   │   └── utils/            # jwt.js, fileHelpers.js
│   ├── uploads/              # Stored files (gitignored)
│   └── app.js
│
├── README.md
└── .env.example
```

---

## 12. Implementation Checklist (Build Order)

The following order minimizes blockers and allows parallel frontend/backend development:

**Phase 1 — Backend Foundation (Day 1)**
- [ ] Initialize Express app with CORS, helmet, morgan
- [ ] Set up SQLite with better-sqlite3; run schema migrations
- [ ] Implement `/api/auth` routes (register, login, me)
- [ ] JWT middleware: `authenticate.js`
- [ ] Multer middleware for file upload
- [ ] Seed database with one test user

**Phase 2 — Reports & Vitals APIs (Day 1-2)**
- [ ] CRUD for `/api/reports` with file upload
- [ ] File serving endpoint (authenticated)
- [ ] CRUD for `/api/vitals`
- [ ] Query filters on both (date, type)

**Phase 3 — Sharing API (Day 2)**
- [ ] `/api/shares` endpoints (create, list mine, list shared-with-me, delete)
- [ ] Access guard middleware: validates share before allowing Viewer to read

**Phase 4 — Frontend Core (Day 2-3)**
- [ ] Vite + React setup with TailwindCSS
- [ ] AuthContext + protected routes
- [ ] Login / Register pages
- [ ] Dashboard with vitals summary cards
- [ ] Reports list page + upload modal

**Phase 5 — Vitals Charts & Sharing UI (Day 3)**
- [ ] Recharts integration for vitals trend charts
- [ ] Date range filter component
- [ ] Share modal on report detail page
- [ ] "Shared with Me" section in viewer mode

**Phase 6 — Polish & Docs (Day 4)**
- [ ] README with setup + API docs
- [ ] Error handling (toast notifications)
- [ ] Mobile responsive polish
- [ ] GitHub push + screen recording

---

## 13. Acceptance Criteria

The product is considered complete when:
1. A new user can register, log in, upload a report, and see it listed
2. Vitals entered (manually or via report) appear on the trends chart
3. A report can be shared with another registered user's email
4. The recipient can log in and view (but not delete) the shared report
5. Filters on the reports page work correctly by date, type, and vital
6. Downloading a file works for the Owner; for Viewers, only if allowed
7. All API routes return appropriate HTTP status codes and error messages
8. The app is responsive on both desktop and mobile viewports
