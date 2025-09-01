-- Use database (MySQL)
-- For Postgres, replace with: CREATE DATABASE philologic_db;
CREATE DATABASE IF NOT EXISTS philologic_db;
USE philologic_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, -- AUTO_INCREMENT in MySQL / SERIAL works for Postgres
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    subscription_type VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Philosophers table
CREATE TABLE IF NOT EXISTS philosophers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    work_title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    reasoning_framework TEXT NOT NULL
);

-- Learning modules table
CREATE TABLE IF NOT EXISTS learning_modules (
    id SERIAL PRIMARY KEY,
    philosopher_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    difficulty_level INT DEFAULT 1,
    is_premium BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (philosopher_id) REFERENCES philosophers(id) ON DELETE CASCADE
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    module_id INT NOT NULL,
    completion_percentage FLOAT DEFAULT 0.0,
    reasoning_score FLOAT DEFAULT 0.0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES learning_modules(id) ON DELETE CASCADE
);

-- Flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample philosophers
INSERT INTO philosophers (name, work_title, description, reasoning_framework) VALUES
('Carl Jung', 'Analytical Psychology', 'Explore the depths of the psyche through analytical psychology', 'Introspective analysis using archetypes and the collective unconscious'),
('Plato', 'Allegory of the Cave', 'Journey from shadows to enlightenment through dialectical reasoning', 'Dialectical questioning to discover eternal forms and truth'),
('Friedrich Nietzsche', 'Genealogy of Morals', 'Deconstruct moral values through genealogical analysis', 'Critical deconstruction of assumed values and perspectives'),
('Immanuel Kant', 'Moral Theory', 'Develop systematic moral reasoning through categorical imperatives', 'Systematic deduction using practical reason and moral law');

-- Insert sample learning modules
INSERT INTO learning_modules (philosopher_id, title, content, difficulty_level, is_premium) VALUES
(1, 'Introduction to Analytical Psychology', 'Learn the basics of Jung''s analytical psychology and how it applies to reasoning...', 1, FALSE),
(2, 'The Cave Allegory', 'Understand Plato''s famous allegory and its implications for logical thinking...', 2, FALSE),
(3, 'Questioning Values', 'Learn Nietzsche''s method of questioning assumed moral values...', 2, TRUE),
(4, 'Categorical Imperative', 'Master Kant''s principle for moral reasoning...', 3, TRUE);
