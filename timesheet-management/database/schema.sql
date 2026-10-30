-- =====================================================
-- Automated Timesheet Management Platform
-- Database Schema & Seed Data
-- MySQL (localhost:3306)
-- =====================================================

CREATE DATABASE IF NOT EXISTS timesheet_db;
USE timesheet_db;

-- ---------- Users ----------
CREATE TABLE IF NOT EXISTS users (
    user_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    email    VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role     VARCHAR(50)  NOT NULL,
    status   VARCHAR(20)  NOT NULL DEFAULT 'APPROVED'
);

-- ---------- Projects ----------
CREATE TABLE IF NOT EXISTS projects (
    project_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    description  VARCHAR(500)
);

-- ---------- Timesheets ----------
CREATE TABLE IF NOT EXISTS timesheets (
    timesheet_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    project_id   BIGINT NOT NULL,
    date         DATE   NOT NULL,
    hours        DOUBLE NOT NULL,
    description  VARCHAR(500),
    status       VARCHAR(20) NOT NULL DEFAULT 'DRAFT',  -- DRAFT | SUBMITTED | APPROVED | REJECTED
    CONSTRAINT fk_timesheet_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_timesheet_project
        FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- ---------- Sign-up Requests (Employee Registration Approval) ----------
CREATE TABLE IF NOT EXISTS signup_requests (
    request_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(50)  NOT NULL DEFAULT 'EMPLOYEE',
    status     VARCHAR(20)  NOT NULL DEFAULT 'PENDING',  -- PENDING | APPROVED | REJECTED
    created_at VARCHAR(50)
);

-- ---------- Seed data (handy for local testing & demos) ----------
INSERT IGNORE INTO users (user_id, name, email, password, role, status) VALUES
    (1, 'Asha Rao', 'asha@example.com', 'placeholder', 'EMPLOYEE', 'APPROVED'),
    (2, 'Manager Mia', 'mia@example.com', 'placeholder', 'MANAGER', 'APPROVED');

INSERT IGNORE INTO projects (project_id, project_name, description) VALUES
    (1, 'Website Revamp', 'Company marketing website rebuild'),
    (2, 'Mobile App', 'Internal timesheet mobile client'),
    (3, 'Cloud Migration', 'Infrastructure migration to AWS');

INSERT IGNORE INTO timesheets (timesheet_id, user_id, project_id, date, hours, description, status) VALUES
    (1, 1, 1, '2026-08-17', 8.0, 'Homepage layout', 'APPROVED'),
    (2, 1, 2, '2026-08-18', 6.5, 'API integration', 'SUBMITTED'),
    (3, 1, 1, '2026-08-18', 2.0, 'Bug fixes', 'DRAFT');

INSERT IGNORE INTO signup_requests (request_id, name, email, password, role, status, created_at) VALUES
    (1, 'Rahul Sharma', 'rahul@example.com', 'password123', 'EMPLOYEE', 'PENDING', '2026-10-30 10:15');
