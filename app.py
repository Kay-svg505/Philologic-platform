from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import pymysql
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# --- Application Setup ---
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'a_very_secret_key_for_development')

# --- Database Configuration ---
# This block safely gets database credentials from environment variables.
# It uses default values for a common local development setup (root, no password).
db_user = os.getenv('DB_USER', 'root')
db_password = os.getenv('DB_PASSWORD', '')
db_host = os.getenv('DB_HOST', 'localhost')
db_port = os.getenv('DB_PORT', '3306')
db_name = os.getenv('DB_NAME', 'philo_logic_db')

try:
    # Ensure the port is an integer
    db_port = int(db_port)
except (TypeError, ValueError):
    raise RuntimeError("DB_PORT environment variable must be a valid integer.")

# Construct the SQLAlchemy database URI
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database object
db = SQLAlchemy(app)

# --- Database Models ---
# These classes represent the tables in your database.

class User(db.Model):
    """Model for the 'users' table."""
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    subscription_type = db.Column(db.String(20), default='free')

class Philosopher(db.Model):
    """Model for the 'philosophers' table."""
    __tablename__ = 'philosophers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    work_title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    reasoning_framework = db.Column(db.Text, nullable=False)

class LearningModule(db.Model):
    """Model for the 'learning_modules' table."""
    __tablename__ = 'learning_modules'
    id = db.Column(db.Integer, primary_key=True)
    philosopher_id = db.Column(db.Integer, db.ForeignKey('philosophers.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    difficulty_level = db.Column(db.Integer, default=1)
    is_premium = db.Column(db.Boolean, default=False)

# --- Routes ---
# These functions handle different URL paths of your web application.

@app.route('/')
def home():
    """Renders the main homepage."""
    return render_template('index.html')

@app.route('/philosophers')
def get_philosophers():
    """Fetches and displays all philosophers."""
    philosophers = Philosopher.query.all()
    # Replace with render_template('philosophers.html', philosophers=philosophers)
    return jsonify([{'name': p.name, 'work_title': p.work_title} for p in philosophers])

@app.route('/api/philosophers')
def api_philosophers():
    """Provides a JSON API endpoint for philosophers."""
    philosophers = Philosopher.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'work_title': p.work_title,
        'description': p.description
    } for p in philosophers])

@app.route('/register', methods=['GET', 'POST'])
def register():
    """Handles user registration."""
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        # Check if user exists
        if User.query.filter_by(email=email).first():
            flash('Email already registered')
            return redirect(url_for('register'))
        
        # Create new user
        user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password)
        )
        
        db.session.add(user)
        db.session.commit()
        
        flash('Registration successful!')
        return redirect(url_for('home'))
    
    return render_template('register.html')

from sqlalchemy import text

@app.route('/test-db')
def test_db():
    """A test route to check database connection."""
    try:
        # Try to query the database to confirm the connection is active
        with db.engine.connect() as connection:
            result = connection.execute(text('SELECT 1'))
            return f"Database connected! Result: {result.fetchone()}"
    except Exception as e:
        return f"Database connection failed: {str(e)}"

# --- Main Execution Block ---
if __name__ == '__main__':
    with app.app_context():
        # Creates all tables in the database if they do not already exist
        print("Creating database tables if they don't exist...")
        db.create_all()
        print("Tables created (or already exist).")
        
    # Run the Flask development server
    app.run(debug=True, host='0.0.0.0', port=5001)
