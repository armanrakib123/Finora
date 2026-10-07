INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('admin@bank.com', '$2a$10$RYY2skL78jcxVS1dc8AF0eBpq9PvGO.L79GEcN4PG035huShulfGu', 'System', 'Admin', 'ADMIN')
ON CONFLICT (email) DO NOTHING;
