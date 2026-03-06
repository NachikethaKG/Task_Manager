-- Database initialization script for react-postgres-todo

-- Note: Run this script as a PostgreSQL superuser (e.g., postgres)

-- Create database (will fail if it already exists, which is fine)
CREATE DATABASE todo_react_db;

-- Connect to the new database and create the tasks table
\c todo_react_db

CREATE TABLE IF NOT EXISTS tasks (
    task_id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert sample data
-- INSERT INTO tasks (description, completed) VALUES 
--   ('Learn PostgreSQL', false),
--   ('Build React app', false),
--   ('Deploy to production', false);
