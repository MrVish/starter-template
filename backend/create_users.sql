-- Create admin role if it doesn't exist
INSERT INTO roles (name, description, is_default)
VALUES ('admin', 'Administrator role', false)
ON CONFLICT (name) DO NOTHING;

-- Get admin role ID
DO $$
DECLARE
    admin_role_id INTEGER;
BEGIN
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';

    -- Create admin user if it doesn't exist
    INSERT INTO users (username, email, password_hash, first_name, last_name, is_active, created_at, updated_at)
    VALUES (
        'admin',
        'admin@example.com',
        -- Password: admin123
        'pbkdf2:sha256:260000$1GvmeoAkcWBK0AkA$5f8e52b3c2989a07975c738a0f39c4fa7363d8cdc48c1cd8f4fc9deb7c90a2f9',
        'Admin',
        'User',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (username) DO NOTHING;

    -- Create regular users if they don't exist
    INSERT INTO users (username, email, password_hash, first_name, last_name, is_active, created_at, updated_at)
    VALUES
    (
        'user1',
        'user1@example.com',
        -- Password: user123
        'pbkdf2:sha256:260000$9XLkGZKzWpE3YzgA$7d2c9f6c988d446d6aaf3c9d0ca998c80be99c9187e3fcb47dca675f0e5647a3',
        'Test',
        'User 1',
        true,
        NOW(),
        NOW()
    ),
    (
        'user2',
        'user2@example.com',
        -- Password: user123
        'pbkdf2:sha256:260000$9XLkGZKzWpE3YzgA$7d2c9f6c988d446d6aaf3c9d0ca998c80be99c9187e3fcb47dca675f0e5647a3',
        'Test',
        'User 2',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (username) DO NOTHING;

    -- Assign admin role to admin user
    INSERT INTO user_roles (user_id, role_id)
    SELECT u.id, r.id
    FROM users u, roles r
    WHERE u.username = 'admin' AND r.name = 'admin'
    ON CONFLICT (user_id, role_id) DO NOTHING;
END $$; 