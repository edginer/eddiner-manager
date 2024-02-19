-- Migration number: 0001 	 2023-11-19T07:25:40.271Z
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS roles_by_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER NOT NULL,
    permission_name TEXT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS users_by_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

INSERT INTO
    roles (name, description)
VALUES
    ('admin', 'Administrator');

INSERT INTO
    roles (name, description)
VALUES
    ('moderator', 'Moderator');

INSERT INTO
    roles_by_permissions (role_id, permission_name)
VALUES
    (1, 'all');

INSERT INTO
    roles_by_permissions (role_id, permission_name)
VALUES
    (2, 'boards:list'),
    (2, 'threads:all'),
    (2, 'archives:all'),
    (2, 'responses:all'),
    (2, 'authed-tokens:all'),
    (2, 'caps:list:me'),
    (2, 'caps:show:me'),
    (2, 'caps:edit-password:me');