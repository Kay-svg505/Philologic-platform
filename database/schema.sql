-- Use the database
USE philologic_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    subscription_type VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Philosophers table
CREATE TABLE philosophers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    work_title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    reasoning_framework TEXT NOT NULL
);

-- Learning modules table
CREATE TABLE learning_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    philosopher_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    difficulty_level INT DEFAULT 1,
    is_premium BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (philosopher_id) REFERENCES philosophers(id)
);

-- User progress table
CREATE TABLE user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    module_id INT NOT NULL,
    completion_percentage FLOAT DEFAULT 0.0,
    reasoning_score FLOAT DEFAULT 0.0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (module_id) REFERENCES learning_modules(id)
);

-- Insert sample philosophers
INSERT INTO philosophers (name, work_title, description, reasoning_framework) VALUES
('Carl Jung', 'Analytical Psychology', 'Explore the depths of the psyche through analytical psychology', 'Introspective analysis using archetypes and the collective unconscious'),
('Plato', 'Allegory of the Cave', 'Journey from shadows to enlightenment through dialectical reasoning', 'Dialectical questioning to discover eternal forms and truth'),
('Friedrich Nietzsche', 'Genealogy of Morals', 'Deconstruct moral values through genealogical analysis', 'Critical deconstruction of assumed values and perspectives'),
('Immanuel Kant', 'Moral Theory', 'Develop systematic moral reasoning through categorical imperatives', 'Systematic deduction using practical reason and moral law');

-- Insert sample modules
INSERT INTO learning_modules (philosopher_id, title, content, difficulty_level, is_premium) VALUES
(1, 'Introduction to Analytical Psychology', 'Learn the basics of Jung''s analytical psychology and how it applies to reasoning...', 1, FALSE),
(2, 'The Cave Allegory', 'Understand Plato''s famous allegory and its implications for logical thinking...', 2, FALSE),
(3, 'Questioning Values', 'Learn Nietzsche''s method of questioning assumed moral values...', 2, TRUE),
(4, 'Categorical Imperative', 'Master Kant''s principle for moral reasoning...', 3, TRUE);