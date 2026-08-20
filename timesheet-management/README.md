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

```
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

```
timesheet-management/
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── components/Sidebar.jsx
│   │   ├── pages/            # Login, Dashboard, Timesheet
│   │   ├── api.js            # backend base URL + fetch helper
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
├── backend/                  # Spring Boot + Maven app
│   ├── src/main/java/com/timesheet/
│   │   ├── TimesheetApplication.java
│   │   ├── config/           # CorsConfig
│   │   ├── controller/       # TimesheetController, DashboardController
│   │   ├── service/          # TimesheetService
│   │   ├── repository/       # User/Project/Timesheet repositories
│   │   └── model/            # User, Project, Timesheet, TimesheetStatus
│   ├── src/main/resources/application.properties
│   └── pom.xml
├── database/schema.sql
└── README.md
```

## 5. Database setup

1. Install and start MySQL (listening on `localhost:3306`).
2. Create the schema (also creates seed data):

   ```bash
   mysql -u root -p < database/schema.sql
   ```

   This creates the `timesheet_db` database with `users`, `projects`, and
   `timesheets` tables (primary keys + foreign keys).

## 6. Backend setup

1. Requires **JDK 17+** and **Maven**.
2. Edit `backend/src/main/resources/application.properties` and set your MySQL
   username/password (the placeholders are `CHANGE_ME_DB_USER` / `CHANGE_ME_DB_PASSWORD`).
3. Run:

   ```bash
   cd backend
   mvn spring-boot:run
   ```

   Backend starts on **http://localhost:8080**.

## 7. Frontend setup

1. Requires **Node.js 18+**.
2. Run:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Frontend starts on **http://localhost:5173**.

## 8. How to run locally

Open three terminals (or start MySQL as a service):

```bash
# 1) MySQL running on :3306, schema loaded (see section 5)

# 2) Backend
cd backend && mvn spring-boot:run

# 3) Frontend
cd frontend && npm install && npm run dev
```

Then open http://localhost:5173, click **Sign in** (placeholder), and the
Dashboard will call `GET /api/dashboard` on the backend — a green banner confirms
the frontend ↔ backend connection.

## 9. API list

All endpoints are **placeholders** that return sample JSON for now.

| Method | Endpoint                          | Purpose (placeholder)          |
|--------|-----------------------------------|--------------------------------|
| GET    | `/api/timesheets`                 | List timesheets                |
| GET    | `/api/timesheets/{id}`            | Get one timesheet              |
| POST   | `/api/timesheets`                 | Create timesheet               |
| PUT    | `/api/timesheets/{id}`            | Update timesheet               |
| GET    | `/api/timesheets/search`          | Search timesheets              |
| PATCH  | `/api/timesheets/{id}/submit`     | Submit for approval            |
| PATCH  | `/api/timesheets/{id}/approve`    | Approve                        |
| PATCH  | `/api/timesheets/{id}/reject`     | Reject                         |
| GET    | `/api/dashboard`                  | Dashboard summary numbers      |

Timesheet status values: `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`.

## 10. Current Week 3 scope

- ✅ Clean layered backend (controller / service / repository / model / config)
- ✅ Placeholder entities: User, Project, Timesheet (+ status enum)
- ✅ Placeholder REST endpoints returning sample JSON
- ✅ CORS configured for the local frontend
- ✅ React frontend: Login, Dashboard, Timesheet pages + sidebar
- ✅ One real frontend → backend test call (Dashboard)
- ✅ `database/schema.sql` with tables, PKs, FKs, status field
- ❌ No real authentication, no full CRUD, no business rules (by design)

## 11. Future Week 4+ work

- **Week 4:** Initialize Git/GitHub, branching strategy, commit history.
- **Week 5+:** Real CRUD, authentication/roles, status-transition rules,
  validation, then DevOps activities — Jenkins CI/CD, Selenium tests, Docker,
  Tomcat/Nginx deployment, and Ansible/Puppet configuration management.
```
