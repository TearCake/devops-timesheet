-- =====================================================
-- Automated Timesheet Management Platform
-- Week 3 skeleton - database schema
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
    role     VARCHAR(50)  NOT NULL
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

-- ---------- Optional seed data (handy for local testing) ----------
INSERT INTO users (name, email, password, role) VALUES
    ('Asha Rao', 'asha@example.com', 'placeholder', 'EMPLOYEE'),
    ('Manager Mia', 'mia@example.com', 'placeholder', 'MANAGER');

INSERT INTO projects (project_name, description) VALUES
    ('Website Revamp', 'Company marketing website rebuild'),
    ('Mobile App', 'Internal timesheet mobile client');

INSERT INTO timesheets (user_id, project_id, date, hours, description, status) VALUES
    (1, 1, '2026-08-17', 8.0, 'Homepage layout', 'APPROVED'),
    (1, 2, '2026-08-18', 6.5, 'API integration', 'SUBMITTED'),
    (1, 1, '2026-08-18', 2.0, 'Bug fixes', 'DRAFT');
