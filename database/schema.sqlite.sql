-- 스터디그라운드 MVP SQLite 데이터베이스 스키마
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    student_number VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20),
    grade VARCHAR(10),
    school VARCHAR(100),
    enrollment_date DATE DEFAULT (date('now')),
    status VARCHAR(20) DEFAULT 'active',
    fixed_seat_number INTEGER UNIQUE,
    archived_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME,
    study_duration INTEGER,
    seat_number INTEGER,
    attendance_status VARCHAR(20),
    checkout_reason VARCHAR(50),
    date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE seats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seat_number INTEGER UNIQUE NOT NULL,
    seat_type VARCHAR(20),
    pin VARCHAR(6) UNIQUE NOT NULL,
    is_available BOOLEAN DEFAULT 1,
    current_student_id INTEGER REFERENCES students(id),
    status VARCHAR(20) DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE study_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    weekly_goal_hours INTEGER,
    monthly_goal_hours INTEGER,
    daily_goal_hours INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    is_active BOOLEAN DEFAULT 1,
    created_by INTEGER REFERENCES admins(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
);

CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_students_pin ON students(pin);
CREATE INDEX idx_seats_status ON seats(status);

