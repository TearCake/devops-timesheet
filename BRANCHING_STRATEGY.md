# 🌿 Branching Strategy & Git Workflow

This document outlines the branching model and Git rules for the **Automated Timesheet Management Platform** (15-Week DevOps Project).

---

## 1. Branch Hierarchy

```text
main (Production / Stable Releases)
  ▲
  │ (Release / Milestone Merges via PR)
  │
develop (Integration Branch)
  ▲
  ├── feature/timesheet-entry
  ├── feature/manager-approval
  ├── bugfix/date-validation
  └── devops/jenkins-ci
```

---

## 2. Core Long-Lived Branches

1. **`main`**:
   - Always represents stable, release-ready code.
   - Direct commits to `main` are strictly prohibited.
   - Tagged releases (e.g., `v0.1.0-week6-mvp`) are created here.

2. **`develop`**:
   - The primary integration branch where ongoing work is combined.
   - All feature branches branch off from `develop` and merge back into `develop` via Pull Requests.

---

## 3. Supporting Branch Naming Conventions

All temporary branches must follow standard prefix conventions:

| Prefix | Format | Description & Examples |
| :--- | :--- | :--- |
| **Feature** | `feature/<short-desc>` | New features or user stories.<br>• `feature/timesheet-crud`<br>• `feature/manager-approval-flow` |
| **Bugfix** | `bugfix/<short-desc>` | Non-critical bug fixes during development.<br>• `bugfix/table-layout-overflow`<br>• `bugfix/cors-allowed-origins` |
| **Hotfix** | `hotfix/<short-desc>` | Urgent fixes branched directly from `main`.<br>• `hotfix/mysql-connection-failure` |
| **DevOps / CI** | `devops/<short-desc>` | CI/CD, Docker, Selenium, Ansible scripts.<br>• `devops/jenkins-pipeline-ci`<br>• `devops/docker-compose-setup` |
| **Release** | `release/vX.Y.Z` | Milestone/viva release preparations.<br>• `release/v0.1.0-mvp` |

---

## 4. Commit Message Guidelines (Conventional Commits)

Commit messages must follow the standard structured format:

```text
<type>(<optional scope>): <short description in imperative mood>

[optional body explaining 'why' and 'what']
```

### Allowed Types:
- **`feat`**: A new user-facing feature.
- **`fix`**: A bug fix.
- **`docs`**: Documentation updates (README, diagrams, SRS).
- **`refactor`**: Code change that neither fixes a bug nor adds a feature.
- **`ci` / `devops`**: Changes to CI/CD, Docker, scripts, or build configs.
- **`test`**: Adding or updating tests (JUnit, Selenium).
- **`chore`**: Maintenance, dependency updates, or `.gitignore` adjustments.

---

## 5. Pull Request & Review Policy

1. **Always branch from the latest `develop`**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```
2. **Push to GitHub & Open a PR**:
   - PR base branch: `develop`
   - Fill out the PR template completely.
3. **Review & Merge**:
   - Complete peer code review.
   - Squash and merge (or standard merge commit) into `develop`.
