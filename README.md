# Automated Timesheet Management Platform

> **Week 3 skeleton** of a 15-week college DevOps project. This is *not* the final MVP.
> It contains a clean, runnable architecture (frontend + backend + database) with
> **placeholder** logic only.

---

## 1. Project overview

A web platform for employees to log daily work hours against projects and for
managers to review/approve them. At this stage the goal is a minimal, working
local skeleton that proves the chosen architecture holds together end to end.

## 2. Architecture overview

```text
┌─────────────────┐        REST / JSON        ┌──────────────────┐        JDBC        ┌────────────┐
│  React + Vite   │  ───────────────────────► │  Spring Boot API  │  ───────────────► │   MySQL     │
│  localhost:5173 │  ◄─────────────────────── │  localhost:8080   │  ◄─────────────── │  :3306      │
└─────────────────┘                           └──────────────────┘                    └────────────┘
```

Backend follows a standard layered structure:
`controller → service → repository → model (JPA entities)`, plus a `config` package for CORS.

## 3. Tech stack

| Layer            | Technology            |
|------------------|-----------------------|
| Frontend         | React + Vite          |
| Backend          | Java + Spring Boot    |
| Build tool       | Maven                 |
| Database         | MySQL                 |
| API style        | REST (JSON)           |

*Planned for later weeks: Git/GitHub, Jenkins (CI/CD), Selenium (testing), Docker,
Tomcat/Nginx (deployment), Ansible/Puppet (configuration management).*

## 4. Folder structure

```text
/
├── src/                      # React + Vite frontend (Figma mirror UI)
├── timesheet-management/     
│   ├── backend/              # Spring Boot + Maven app
│   └── database/             # schema.sql
├── package.json              # Frontend dependencies
└── README.md
```

## 5. Prerequisites & Installations

Ensure the following tools are installed on your system:

- **Node.js (18+) & npm**
- **Java JDK (17+)** (e.g., Eclipse Temurin 17)
- **Apache Maven (3.8+)**
- **MySQL Server (8.0+)** running on port `3306`

> **Quick Windows Setup via Winget / PowerShell:**
> ```powershell
> # Install JDK 17
> winget install EclipseAdoptium.Temurin.17.JDK
> 
> # Install MySQL Server
> winget install Oracle.MySQL
> ```

---

## 6. Database Setup

1. Ensure MySQL service is running locally on port `3306`.
2. Import the schema and seed data:

   **On Windows (PowerShell):**
   ```powershell
   Get-Content timesheet-management\database\schema.sql | & "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -p
   ```
   *(or `Get-Content timesheet-management\database\schema.sql | mysql -u root -p` if MySQL is in your system PATH).*

   **On Linux / macOS / Git Bash:**
   ```bash
   mysql -u root -p < timesheet-management/database/schema.sql
   ```

   This initializes the `timesheet_db` database with `users`, `projects`, and `timesheets` tables and default seed data.

---

## 7. Backend Setup (Spring Boot)

1. Open `timesheet-management/backend/src/main/resources/application.properties`.
2. Configure your MySQL credentials:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
3. Start the backend:

   ```bash
   cd timesheet-management/backend
   mvn spring-boot:run
   ```

   The backend REST API will start on **`http://localhost:8080`**.

---

## 8. Frontend Setup (React + Vite)

1. Open a new terminal in the project root directory (`/`):
   ```bash
   npm install
   npm run dev
   ```

2. Open the local URL printed in the terminal (e.g., **`http://localhost:8443`** or **`http://localhost:5173`**).

---

## 9. Verification & Testing

1. Open the frontend in your browser and click **Sign in** on the login screen.
2. The Dashboard will call `GET /api/dashboard` on the backend.
3. You should see a **green banner** confirming the live connection:
   > `Connected to backend at localhost:8080.`
4. If the backend is stopped or unreachable, the UI gracefully falls back to sample preview data.

## 10. Current Week 3 Scope

- ✅ Clean layered backend (controller / service / repository / model / config)
- ✅ Placeholder entities: User, Project, Timesheet (+ status enum)
- ✅ Placeholder REST endpoints returning sample JSON
- ✅ CORS configured for the local frontend
- ✅ React frontend: Login, Dashboard, Timesheet pages + sidebar
- ✅ One real frontend → backend test call (Dashboard)
- ✅ `database/schema.sql` with tables, PKs, FKs, status field
- ❌ No real authentication, no full CRUD, no business rules (by design)

## 11. Future Week 4+ Roadmap

- **Week 4:** Initialize Git/GitHub, branching strategy, commit history.
- **Week 5+:** Real CRUD, authentication/roles, status-transition rules,
  validation, then DevOps activities — Jenkins CI/CD, Selenium tests, Docker,
  Tomcat/Nginx deployment, and Ansible/Puppet configuration management.
