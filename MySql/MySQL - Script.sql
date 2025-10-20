-- ======================================================
-- DATABASE: hermandad_db
-- Author: Frank Gutierrez
-- Purpose: Economic Control System for Hermandad
-- Engine: InnoDB | Charset: utf8mb4
-- ======================================================

CREATE DATABASE IF NOT EXISTS hermandad_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE hermandad_db;

-- ======================================================
-- 🧩 1. TABLE: roles
-- ======================================================
CREATE TABLE roles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_roles_active ON roles(is_active);


-- ======================================================
-- 👤 2. TABLE: users
-- ======================================================
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id INT UNSIGNED NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    last_login DATETIME DEFAULT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_users_role FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_role ON users(role_id);


-- ======================================================
-- 🧑‍🤝‍🧑 3. TABLE: persons
-- ======================================================
CREATE TABLE persons (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(255),
    birth_date DATE,
    gender ENUM('M', 'F', 'O') DEFAULT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_persons_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_persons_dni ON persons(dni);
CREATE INDEX idx_persons_name ON persons(last_name, first_name);
CREATE INDEX idx_persons_active ON persons(is_active);


-- ======================================================
-- 💰 4. TABLE: incomes (ingresos de cada persona)
-- ======================================================
CREATE TABLE incomes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    person_id INT UNSIGNED NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    income_date DATE NOT NULL,
    income_type VARCHAR(100),
    reference VARCHAR(100),
    notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_incomes_person FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_incomes_date ON incomes(income_date);
CREATE INDEX idx_incomes_person ON incomes(person_id);


-- ======================================================
-- 🧾 5. TABLE: expenses (egresos generales)
-- ======================================================
CREATE TABLE expenses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    person_id INT UNSIGNED DEFAULT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    expense_date DATE NOT NULL,
    expense_type VARCHAR(100),
    description TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_expenses_person FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_person ON expenses(person_id);


-- ======================================================
-- 🗒️ 6. TABLE: observations (notas opcionales)
-- ======================================================
CREATE TABLE observations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    income_id INT UNSIGNED DEFAULT NULL,
    person_id INT UNSIGNED DEFAULT NULL,
    note TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_obs_income FOREIGN KEY (income_id)
        REFERENCES incomes(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_obs_person FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ======================================================
-- 💼 7. TABLE: account_status (resumen de cuenta)
-- ======================================================
CREATE TABLE account_status (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    person_id INT UNSIGNED NOT NULL,
    total_income DECIMAL(10,2) DEFAULT 0.00,
    total_expense DECIMAL(10,2) DEFAULT 0.00,
    balance DECIMAL(10,2) AS (total_income - total_expense) STORED,

    last_update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_acc_person FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE UNIQUE INDEX idx_acc_person_unique ON account_status(person_id);


-- ======================================================
-- 🌱 8. DEFAULT DATA
-- ======================================================
INSERT INTO roles (name, description, created_by)
VALUES
('Administrator', 'System administrator with full access', 'system'),
('Treasurer', 'Manages incomes and reports', 'system'),
('User', 'Regular system user', 'system')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (role_id, username, password, created_by)
VALUES (1, 'admin', 'admin123', 'system')
ON DUPLICATE KEY UPDATE username = VALUES(username);

INSERT INTO persons (user_id, first_name, last_name, dni, phone, address, birth_date, gender, created_by)
VALUES (1, 'System', 'Administrator', '00000000', '999999999', 'Main Office', '1990-01-01', 'M', 'system')
ON DUPLICATE KEY UPDATE dni = VALUES(dni);
