# 🏥 Health Wallet — 2care.ai

![Health Wallet Banner](https://img.shields.io/badge/Health_Wallet-2care.ai-blue?style=for-the-badge)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

**Health Wallet** is a comprehensive digital health management platform designed to empower users by centralizing their medical data. It provides a secure vault to store medical reports, track vital signs dynamically, and securely share health records with doctors or family members. 

---

## ✨ Key Features
- **Secure Authentication:** Integrated with Clerk for robust, enterprise-grade user authentication.
- **Report Management:** Upload, view, and organize medical reports (PDFs, Images) with metadata tagging.
- **Dynamic Vitals Tracking:** Log vital signs (e.g., Blood Pressure, Heart Rate, Glucose) and visualize them using interactive Recharts graphs.
- **Secure Sharing:** Share specific medical reports with authorized users via email, with fine-grained download permissions.
- **Responsive UI:** A modern, mobile-friendly interface built with React 19 and Vite.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Styling:** CSS3 & Modern UI Patterns
- **Data Visualization:** Recharts
- **Icons:** React Icons

### Backend
- **Server:** Node.js + Express.js 5
- **Database:** SQLite (via `better-sqlite3` for blazing fast, synchronous queries)
- **Authentication:** Clerk Express Middleware
- **File Uploads:** Multer (Local storage for reports)
- **Security:** Helmet, CORS
- **Logging:** Morgan

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Clerk](https://clerk.com/) account for authentication keys.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/health-wallet.git
   cd health-wallet
   ```

2. **Install Root Dependencies:**
   The project uses `concurrently` to run both the frontend and backend together.
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Variables:**
   Create a `.env` file inside the `server/` directory and add the following keys:
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
   *(Note: You will also need to provide the Clerk publishable key to your React frontend, usually via a `.env` in the root folder using `VITE_CLERK_PUBLISHABLE_KEY`)*

5. **Start the Application:**
   From the root of the project, run:
   ```bash
   npm run dev
   ```
   This will simultaneously start the Vite development server (usually on port 5173) and the Express backend (on port 5000).

---

## 📖 API Documentation

All API routes require authentication via a valid Clerk token passed in the `Authorization` header.

### 📄 Reports (`/api/reports`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Retrieve a list of the user's reports. Supports query params: `type`, `vital_type`, `date_from`, `date_to`, `search`. |
| `POST` | `/` | Upload a new report. Accepts `multipart/form-data` with `file`, `title`, `report_type`, `report_date`, and `vitals`. |
| `GET` | `/:id` | Get details of a specific report (including associated vitals and shares). |
| `PUT` | `/:id` | Update metadata of a specific report. |
| `DELETE`| `/:id` | Delete a report and its associated file. |
| `GET` | `/:id/file` | Download or stream the actual report file (respects sharing permissions). |

### ❤️ Vitals (`/api/vitals`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Fetch vital logs. Supports query params: `type`, `from`, `to`, `range`. |
| `POST` | `/` | Log a new vital sign. Accepts JSON: `vital_type`, `value`, `unit`, `recorded_at`, `note`. |
| `DELETE`| `/:id` | Remove a vital log entry. |

### 🤝 Shares (`/api/shares`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Share a report. Accepts JSON: `report_id`, `email`, `can_download`. |
| `GET` | `/mine` | List all outgoing shares initiated by the user. |
| `GET` | `/with-me`| List all reports that other users have shared with the current user. |
| `DELETE`| `/:id` | Revoke a share permission. |

---

## 📂 Project Structure

```text
health-wallet/
├── public/                 # Static assets
├── server/                 # Node.js Express Backend
│   ├── src/
│   │   ├── data/           # SQLite Database files
│   │   ├── db/             # DB initialization & schema
│   │   ├── middleware/     # Custom middlewares (Uploads)
│   │   ├── routes/         # API Route definitions
│   │   └── utils/          # Auth & Helper utilities
│   ├── uploads/            # Local storage for user report files
│   └── app.js              # Server Entry Point
├── src/                    # React Frontend
│   ├── components/         # Reusable UI components
│   ├── pages/              # Application views (Dashboard, Reports, Vitals)
│   ├── App.jsx             # Main application component & Routing
│   └── main.jsx            # React DOM rendering
├── .gitignore              # Git ignored files
├── package.json            # Root configuration and scripts
└── vite.config.js          # Vite bundler configuration
```

---

<div align="center">
  <i>Built with ❤️ for better health management</i>
</div>
