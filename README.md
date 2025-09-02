# 🧠 PhiloLogic - AI-Powered Logical Reasoning Platform

![PhiloLogic Banner](https://via.placeholder.com/800x200/2c3e50/ffffff?text=PhiloLogic+-+Learn+Logic+Through+Philosophy)

## 📖 Overview

PhiloLogic is an innovative educational platform that teaches critical thinking and logical reasoning through the methodologies of great philosophers. Users learn structured thinking patterns from Carl Jung, Plato, Nietzsche, and Kant while developing practical reasoning skills.

## ✨ Features

### Core Features
- 🎓 **Interactive Learning Modules** - Step-by-step philosophical reasoning tutorials
- 👥 **Multiple Philosophers** - Learn from Jung, Plato, Nietzsche, and Kant
- 📊 **Progress Tracking** - Monitor your learning journey and skill development
- 🎯 **Difficulty Levels** - Beginner to advanced reasoning challenges
- 💳 **Premium Content** - Advanced modules with subscription access

### Interactive Features
- 🧪 **Logic Puzzles** - Apply philosophical methods to solve problems
- 💬 **AI-Powered Chat** - Discuss concepts with philosopher avatars
- 🎮 **Gamification** - Points, badges, and achievement system
- 📱 **Responsive Design** - Works seamlessly on all devices

## 🚀 Getting Started

### Prerequisites
- Python 3.8 or higher
- MySQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/philologic.git
   cd philologic
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   FLASK_SECRET_KEY=your-secret-key-here
   DB_USER=your-db-username
   DB_PASSWORD=your-db-password
   DB_HOST=localhost
   DB_NAME=philologic_db
   DB_PORT=3306
   STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   ```

5. **Set up the database**
   ```bash
   mysql -u root -p
   CREATE DATABASE philologic_db;
   exit
   ```

6. **Run the application**
   ```bash
   python app.py
   ```

7. **Visit the application**
   Open your browser and go to `http://localhost:5001`

## 🗄️ Database Schema

The application uses the following main tables:
- **users** - User accounts and subscription information
- **philosophers** - Philosophical guides and their methodologies
- **learning_modules** - Educational content and exercises
- **user_progress** - Individual learning progress tracking

## 🎨 Technology Stack

- **Backend**: Flask (Python)
- **Database**: MySQL with SQLAlchemy ORM
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Payments**: Stripe API
- **Deployment**: Render.com (Free tier)
- **Authentication**: Werkzeug security utilities

## 📁 Project Structure

```
philologic/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables (create this)
├── .gitignore           # Git ignore rules
├── render.yaml          # Render deployment config
├── README.md            # This file
├── database/
│   └── schema.sql       # Database schema
├── static/
│   ├── css/
│   │   └── style.css    # Custom styles
│   └── js/
│       └── main.js      # Frontend JavaScript
└── templates/
    ├── index.html       # Homepage
    ├── register.html    # Registration page
    ├── login.html       # Login page
    ├── dashboard.html   # User dashboard
    ├── philosopher.html # Philosopher details
    └── payment.html     # Payment page
```

## 🔧 Configuration

### Environment Variables
- `FLASK_SECRET_KEY`: Flask session secret key
- `DB_*`: Database connection parameters
- `STRIPE_*`: Stripe payment processing keys

### Database Configuration
The app automatically creates tables on first run. To manually initialize:
```bash
mysql -u root -p philologic_db < database/schema.sql
```

## 💳 Payment Integration

PhiloLogic integrates with Stripe for secure payment processing:
- Free tier: Access to basic modules
- Premium tier ($9.99/month): Advanced modules and exclusive content
- One-time purchases: Individual philosopher deep-dives

## 🚀 Deployment

### Free Deployment on Render.com

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/philologic.git
   git push -u origin main
   ```

2. **Connect to Render**
   - Sign up at render.com
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy automatically

### Environment Setup for Production
Set these environment variables in Render:
- All database credentials
- Stripe API keys
- Flask secret key

## 🧪 Testing

### Database Connection Test
Visit `/test-db` to verify database connectivity.

### Payment Test
Use Stripe test cards:
- Success: `4242424242424242`
- Declined: `4000000000000002`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email: support@philologic.com or create an issue in the GitHub repository.

## 🗺️ Roadmap

- [ ] AI-powered personalized learning paths
- [ ] Mobile app development
- [ ] Integration with external philosophy databases
- [ ] Virtual reality philosophy experiences
- [ ] Collaborative learning features
- [ ] Multi-language support

## 🙏 Acknowledgments

- Inspired by the great philosophers: Jung, Plato, Nietzsche, and Kant
- Built with love for critical thinking and education
- Thanks to the open-source community for amazing tools

---

**Made with ❤️ by the PhiloLogic Team**
