import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import text
import requests

# Load environment variables
load_dotenv()

# --- App Setup ---
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'a_very_secret_key_for_dev')

# --- Database Configuration ---
db_url = os.getenv('DATABASE_URL')
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)
elif not db_url:
    db_user = os.getenv("MYSQL_USER", "root")
    db_pass = os.getenv("MYSQL_PASSWORD", "")
    db_host = os.getenv("MYSQL_HOST", "localhost")
    db_name = os.getenv("MYSQL_DB", "flashcards_db")
    db_url = f"mysql+pymysql://{db_user}:{db_pass}@{db_host}/{db_name}"

app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- Models ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

class Philosopher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    work_title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)

class Flashcard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

# --- Hugging Face Config ---
HF_API_KEY = os.getenv("HF_API_KEY")
HF_MODEL = os.getenv("HF_MODEL", "deepset/roberta-base-squad2")

# --- Routes ---
@app.route('/')
def home():
    return render_template('index.html')

# Registration
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        if User.query.filter_by(email=email).first():
            flash('Email already registered', 'error')
            return redirect(url_for('register'))
        user = User(username=username, email=email, password_hash=generate_password_hash(password))
        db.session.add(user)
        db.session.commit()
        flash('Registration successful!', 'success')
        return redirect(url_for('login'))
    return render_template('register.html')

# Login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            session['username'] = user.username
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        flash('Invalid credentials', 'error')
        return redirect(url_for('login'))
    return render_template('login.html')

# Logout
@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully', 'success')
    return redirect(url_for('home'))

# Submit notes -> generate flashcards (returns JSON)
@app.route('/submit-notes', methods=['POST'])
def submit_notes():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    notes_text = request.form.get('notes')
    if not notes_text:
        return jsonify({"error": "No notes submitted"}), 400

    # Call Hugging Face API
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    payload = {"inputs": f"Generate 5 quiz questions with answers based on the following text:\n\n{notes_text}"}

    try:
        response = requests.post(
            f"https://api-inference.huggingface.co/models/{HF_MODEL}",
            headers=headers,
            json=payload
        )
        if response.status_code != 200:
            return jsonify({"error": f"Hugging Face API error: {response.status_code}"}), 500
        generated_text = response.json().get("generated_text", "")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Parse questions/answers
    qa_pairs = []
    lines = [line.strip() for line in generated_text.split("\n") if line.strip()]
    i = 0
    while i < len(lines):
        if lines[i].lower().startswith('q') or lines[i].lower().startswith('question'):
            question = lines[i]
            answer = lines[i+1] if i+1 < len(lines) else "Answer not provided"
            qa_pairs.append({"question": question, "answer": answer})
            flashcard = Flashcard(user_id=user_id, question=question, answer=answer)
            db.session.add(flashcard)
            i += 2
        else:
            i += 1
    db.session.commit()
    return jsonify(qa_pairs)

# Get flashcards for current user (returns JSON)
@app.route('/flashcards')
def get_flashcards():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401
    flashcards = Flashcard.query.filter_by(user_id=user_id).all()
    return jsonify([{"question": f.question, "answer": f.answer} for f in flashcards])

# Hugging Face QA endpoint
@app.route('/qa', methods=['POST'])
def qa():
    data = request.get_json()
    context = data.get("context", "")
    question = data.get("question", "")
    if not context or not question:
        return jsonify({"error": "Both context and question are required"}), 400

    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    payload = {"inputs": {"question": question, "context": context}}

    try:
        response = requests.post(
            f"https://api-inference.huggingface.co/models/{HF_MODEL}",
            headers=headers,
            json=payload
        )
        if response.status_code != 200:
            return jsonify({"error": f"Hugging Face API error: {response.status_code}"}), 500
        answer_data = response.json()
        answer = answer_data.get("answer", "No answer returned")
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Main ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv("PORT", 5001)))
