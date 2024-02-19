-- Migration number: 0002 	 2023-11-19T08:05:25.306Z
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    used_permission TEXT NOT NULL,
    info TEXT NOT NULL,
    ip_addr TEXT NOT NULL,
    timestamp TEXT NOT NULL
);