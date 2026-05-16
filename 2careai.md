# **Part 3: Backend Architecture & Database Document (Node.js & SQLite)**

## **1\. System Architecture Design**

The backend follows a classic layered MVC pattern: `Client Request -> Routing Layer -> Auth Middleware -> Controller (Business Logic) -> Data Access Object (SQLite/Knex) -> DB Storage`.

Plaintext  
\+--------------------------------------------------------------------+  
|                         SYSTEM ARCHITECTURE                        |  
\+--------------------------------------------------------------------+  
| \[ ReactJS Frontend \] \---\> (REST APIs / Form-Data)                  |  
|                                  |                                 |  
|                                  v                                 |  
|                       \[ ExpressJS Server \]                         |  
|                 \+--------------------------------+                 |  
|                 | \- Auth Middleware (JWT Verify) |                 |  
|                 | \- Router (Users, Reports)      |                 |  
|                 | \- Controller Engine            |                 |  
|                 \+--------------------------------+                 |  
|                                  |                                 |  
|                \+-----------------+-----------------+               |  
|                |                                   |               |  
|                v                                   v               |  
|       \[ SQLite Database \]               \[ Local / Cloud Storage \]  |  
|    (Structured Data & Metadata)         (Raw PDFs and Images)      |  
\+--------------------------------------------------------------------+

## **2\. Database Schema (SQLite)**

Plaintext  
 \+-------------------+              \+-------------------+  
  |       USERS       |              |   HEALTH\_REPORTS  |  
  \+-------------------+              \+-------------------+  
  | id (PK)           |\<------------ | id (PK)           |  
  | name              |              | user\_id (FK)      |  
  | email (Unique)    |              | title             |  
  | password\_hash     |              | file\_path         |  
  | role              |              | category          |  
  | created\_at        |              | test\_date         |  
  \+-------------------+              \+-------------------+  
            |                                  |  
            |                                  |  
            |    \+-------------------+         |  
            |    |    USER\_VITALS    |         |  
            |    \+-------------------+         |  
            \+---\>| id (PK)           |         |  
                 | user\_id (FK)      |         |  
                 | record\_date       |         |  
                 | systolic\_bp       |         |  
                 | diastolic\_bp      |         |  
                 | blood\_sugar       |         |  
                 | heart\_rate        |         |  
                 \+-------------------+         |  
                           |                   |  
                           v                   v  
                 \+-----------------------------------+  
                 |        REPORT\_ACCESS\_CONTROL      |  
                 \+-----------------------------------+  
                 | id (PK)                           |  
                 | report\_id (FK)                    |  
                 | shared\_with\_email                 |  
                 | permission\_level (read)           |  
                 \+-----------------------------------+

### **2.1 SQLite Schema Definitions**

SQL  
CREATE TABLE users (  
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    name TEXT NOT NULL,  
    email TEXT UNIQUE NOT NULL,  
    password\_hash TEXT NOT NULL,  
    role TEXT CHECK(role IN ('Owner', 'Viewer')) DEFAULT 'Owner',  
    created\_at DATETIME DEFAULT CURRENT\_TIMESTAMP  
);

CREATE TABLE health\_reports (  
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    user\_id INTEGER NOT NULL,  
    title TEXT NOT NULL,  
    file\_path TEXT NOT NULL,  
    category TEXT NOT NULL, \-- e.g., 'Blood Test', 'X-Ray'  
    test\_date DATE NOT NULL,  
    created\_at DATETIME DEFAULT CURRENT\_TIMESTAMP,  
    FOREIGN KEY(user\_id) REFERENCES users(id) ON DELETE CASCADE  
);

CREATE TABLE user\_vitals (  
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    user\_id INTEGER NOT NULL,  
    record\_date DATETIME NOT NULL,  
    systolic\_bp INTEGER,  
    diastolic\_bp INTEGER,  
    blood\_sugar REAL,  
    heart\_rate INTEGER,  
    FOREIGN KEY(user\_id) REFERENCES users(id) ON DELETE CASCADE  
);

CREATE TABLE report\_access\_control (  
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    report\_id INTEGER NOT NULL,  
    shared\_with\_email TEXT NOT NULL,  
    permission\_level TEXT DEFAULT 'read',  
    FOREIGN KEY(report\_id) REFERENCES health\_reports(id) ON DELETE CASCADE  
);

## **3\. RESTful API Blueprint**

### **Auth Endpoints**

* `POST /api/auth/register` — Registers a new user. Acccepts `name`, `email`, `password`.  
* `POST /api/auth/login` — Verifies credentials. Returns a signed JWT token and user metadata.

### **Reports Endpoints**

* `POST /api/reports/upload` — Uses `multer` middleware. Accepts multi-part form data: file binary (`pdf`/`image`), `title`, `category`, `test_date`, and optional vitals stringified object.  
* `GET /api/reports` — Retrieves authorized files. If the requester is an `Owner`, fetches their files. If a `Viewer`, returns files shared with their email address. Supports queries: `?category=`, `?startDate=`, `?endDate=`.  
* `GET /api/reports/:id/download` — Stream individual report files securely checking user-permissions first.

### **Vitals Endpoints**

* `POST /api/vitals` — Log a new metrics point. Accepts `systolic_bp`, `diastolic_bp`, `blood_sugar`, `heart_rate`, `record_date`.  
* `GET /api/vitals` — Time-series database extract. Supports query filters `?range=7days` or `?range=30days`.

### **Share Access Endpoints**

* `POST /api/share` — Grants target access. Body parameters: `{ report_id, shared_with_email }`.  
* `DELETE /api/share/:id` — Revokes visibility/access for a specific user row.

## **4\. File Storage Strategy**

To meet evaluation standards cleanly without complex cloud configuration hurdles right away:

* **Local Storage (Selected for Local Evaluation MVP):** Store uploaded records inside a non-public `/uploads` directory on the backend filesystem.  
* **Security abstraction:** Never serve files statically through `express.static()`. Instead, read files using Node’s filesystem module (`fs.createReadStream`) after verifying ownership in the controller endpoint.

---

# **🔐 Part 4: Production Security & Implementation Guardrails**

1. **Password Safety:** Always hash passwords before writing to SQLite using `bcryptjs` (salt rounds \= 10).  
2. **File Upload Validation:** Configure `multer` filters strictly limiting files to `application/pdf`, `image/png`, and `image/jpeg`. Cap maximum file sizes at 5MB to avoid disk-denial-of-service vectors.  
3. **SQL Injection Defense:** Avoid standard string concatenation when constructing query logic. Use SQLite parameter placeholders (`?`) or object abstraction layers natively provided by query builders like Knex.js to protect database parameters fully.

