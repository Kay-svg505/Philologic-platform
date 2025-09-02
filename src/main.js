// PhiloLogic Frontend Application
// Modern vanilla JavaScript implementation

class PhiloLogicApp {
    constructor() {
        this.philosophers = [];
        this.flashcards = [];
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadPhilosophers();
        this.setupEventListeners();
        this.loadFlashcards();
    }

    // ===========================
    // Data Loading
    // ===========================
    async loadPhilosophers() {
        try {
            // Mock data for demo purposes
            this.philosophers = [
                {
                    id: 1,
                    name: "Carl Jung",
                    work_title: "Analytical Psychology",
                    description: "Explore the depths of the psyche through analytical psychology and discover the collective unconscious.",
                    reasoning_framework: "Introspective analysis using archetypes and the collective unconscious"
                },
                {
                    id: 2,
                    name: "Plato",
                    work_title: "Allegory of the Cave",
                    description: "Journey from shadows to enlightenment through dialectical reasoning and discover eternal truths.",
                    reasoning_framework: "Dialectical questioning to discover eternal forms and truth"
                },
                {
                    id: 3,
                    name: "Friedrich Nietzsche",
                    work_title: "Genealogy of Morals",
                    description: "Deconstruct moral values through genealogical analysis and question everything you believe.",
                    reasoning_framework: "Critical deconstruction of assumed values and perspectives"
                },
                {
                    id: 4,
                    name: "Immanuel Kant",
                    work_title: "Moral Theory",
                    description: "Develop systematic moral reasoning through categorical imperatives and practical reason.",
                    reasoning_framework: "Systematic deduction using practical reason and moral law"
                }
            ];
            this.renderPhilosophers();
        } catch (error) {
            console.error('Error loading philosophers:', error);
            this.showError('Failed to load philosophers');
        }
    }

    renderPhilosophers() {
        const grid = document.getElementById('philosophers-grid');
        if (!grid) return;

        grid.innerHTML = '';
        this.philosophers.forEach(philosopher => {
            const card = this.createPhilosopherCard(philosopher);
            grid.appendChild(card);
        });
    }

    createPhilosopherCard(philosopher) {
        const card = document.createElement('div');
        card.className = 'philosopher-card';
        card.innerHTML = `
            <h3>${this.escapeHtml(philosopher.name)}</h3>
            <h4>${this.escapeHtml(philosopher.work_title)}</h4>
            <p>${this.escapeHtml(philosopher.description)}</p>
            <div style="display: flex; gap: 0.5rem; justify-content: center;">
                <button class="btn primary" data-action="start" data-id="${philosopher.id}">
                    Start Learning
                </button>
                <button class="btn secondary" data-action="details" data-id="${philosopher.id}">
                    Details
                </button>
            </div>
        `;
        return card;
    }

    // ===========================
    // Event Listeners
    // ===========================
    setupEventListeners() {
        // Philosopher card interactions
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;

            const id = parseInt(btn.getAttribute('data-id'));
            const action = btn.getAttribute('data-action');

            if (action === 'start') {
                this.startLearning(id);
            } else if (action === 'details') {
                this.showPhilosopherDetails(id);
            }
        });

        // Notes form submission
        const notesForm = document.getElementById('notes-form');
        if (notesForm) {
            notesForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.generateFlashcards();
            });
        }

        // Flashcard interactions
        document.addEventListener('click', (e) => {
            const flashcard = e.target.closest('.flashcard');
            if (flashcard) {
                flashcard.classList.toggle('flipped');
            }
        });
    }

    // ===========================
    // Philosopher Interactions
    // ===========================
    startLearning(philosopherId) {
        const philosopher = this.philosophers.find(p => p.id === philosopherId);
        if (!philosopher) return;

        this.showModal(`
            <h2>Start Learning with ${philosopher.name}</h2>
            <p><strong>Methodology:</strong> ${philosopher.reasoning_framework}</p>
            <p>This would begin an interactive learning session with ${philosopher.name}. 
            You'll learn their unique approach to logical reasoning through guided exercises.</p>
            <div style="text-align: center; margin-top: 1.5rem;">
                <button class="btn primary" onclick="app.closeModal()">Begin Session</button>
            </div>
        `);
    }

    showPhilosopherDetails(philosopherId) {
        const philosopher = this.philosophers.find(p => p.id === philosopherId);
        if (!philosopher) return;

        this.showModal(`
            <h2>${philosopher.name}</h2>
            <h3>${philosopher.work_title}</h3>
            <p><strong>Description:</strong> ${philosopher.description}</p>
            <p><strong>Reasoning Framework:</strong> ${philosopher.reasoning_framework}</p>
            <div style="text-align: center; margin-top: 1.5rem;">
                <button class="btn primary" onclick="app.startLearning(${philosopher.id})">Start Learning</button>
                <button class="btn secondary" onclick="app.closeModal()">Close</button>
            </div>
        `);
    }

    // ===========================
    // QA Functionality
    // ===========================
    async askQuestion() {
        const context = document.getElementById('context').value.trim();
        const question = document.getElementById('question').value.trim();
        const answerDiv = document.getElementById('answer');

        if (!context || !question) {
            this.showError('Please provide both context and question');
            return;
        }

        answerDiv.textContent = 'Thinking...';
        answerDiv.style.display = 'block';

        try {
            // Mock AI response for demo
            await this.delay(2000);
            const mockAnswer = this.generateMockAnswer(question, context);
            answerDiv.textContent = mockAnswer;
        } catch (error) {
            console.error('QA Error:', error);
            answerDiv.textContent = 'An error occurred while processing your question.';
        }
    }

    generateMockAnswer(question, context) {
        const responses = [
            `Based on the provided context, this question touches on fundamental philosophical principles. The answer involves careful consideration of the underlying assumptions and logical structure.`,
            `From a philosophical perspective, this inquiry requires us to examine the premises and apply systematic reasoning to reach a well-founded conclusion.`,
            `This question invites us to think critically about the relationship between the concepts presented in the context and their broader implications.`,
            `Using philosophical analysis, we can approach this by breaking down the components and examining their logical connections.`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // ===========================
    // Flashcard Generation
    // ===========================
    async generateFlashcards() {
        const notes = document.getElementById('notes').value.trim();
        const errorDiv = document.getElementById('notes-error');
        const container = document.getElementById('flashcards-container');

        if (!notes) {
            this.showError('Please enter some study notes');
            return;
        }

        errorDiv.style.display = 'none';
        container.innerHTML = '<p class="placeholder-text">Generating flashcards...</p>';

        try {
            // Mock flashcard generation for demo
            await this.delay(3000);
            const mockFlashcards = this.generateMockFlashcards(notes);
            this.flashcards = [...this.flashcards, ...mockFlashcards];
            this.renderFlashcards();
            document.getElementById('notes').value = '';
            this.showToast('Flashcards generated successfully!', 'success');
        } catch (error) {
            console.error('Flashcard generation error:', error);
            errorDiv.textContent = 'Failed to generate flashcards. Please try again.';
            errorDiv.style.display = 'block';
        }
    }

    generateMockFlashcards(notes) {
        const topics = notes.split(/[.!?]+/).filter(s => s.trim().length > 10);
        return topics.slice(0, 5).map((topic, index) => ({
            id: Date.now() + index,
            question: `What is the significance of: ${topic.trim().substring(0, 50)}...?`,
            answer: `This concept relates to the broader philosophical framework and requires careful analysis of its implications and underlying principles.`
        }));
    }

    loadFlashcards() {
        // In a real app, this would fetch from the server
        this.renderFlashcards();
    }

    renderFlashcards() {
        const container = document.getElementById('flashcards-container');
        if (!container) return;

        if (this.flashcards.length === 0) {
            container.innerHTML = '<p class="placeholder-text">Submit study notes above to generate flashcards</p>';
            return;
        }

        container.innerHTML = '';
        this.flashcards.forEach(flashcard => {
            const card = this.createFlashcard(flashcard);
            container.appendChild(card);
        });
    }

    createFlashcard(flashcard) {
        const card = document.createElement('div');
        card.className = 'flashcard';
        card.innerHTML = `
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <h3>${this.escapeHtml(flashcard.question)}</h3>
                </div>
                <div class="flashcard-back">
                    <p>${this.escapeHtml(flashcard.answer)}</p>
                </div>
            </div>
        `;
        return card;
    }

    // ===========================
    // Authentication Modal
    // ===========================
    showAuthModal(type) {
        const modal = document.getElementById('auth-modal');
        const container = document.getElementById('auth-form-container');
        
        if (type === 'register') {
            container.innerHTML = this.getRegisterForm();
        } else if (type === 'login') {
            container.innerHTML = this.getLoginForm();
        }
        
        modal.style.display = 'block';
    }

    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        modal.style.display = 'none';
    }

    getRegisterForm() {
        return `
            <h2>Join PhiloLogic</h2>
            <form id="register-form">
                <div class="form-group">
                    <label for="reg-username">Username</label>
                    <input type="text" id="reg-username" required>
                </div>
                <div class="form-group">
                    <label for="reg-email">Email</label>
                    <input type="email" id="reg-email" required>
                </div>
                <div class="form-group">
                    <label for="reg-password">Password</label>
                    <input type="password" id="reg-password" required>
                </div>
                <button type="submit" class="btn primary">Register</button>
            </form>
        `;
    }

    getLoginForm() {
        return `
            <h2>Welcome Back</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="login-email">Email</label>
                    <input type="email" id="login-email" required>
                </div>
                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" required>
                </div>
                <button type="submit" class="btn primary">Login</button>
            </form>
        `;
    }

    // ===========================
    // Modal System
    // ===========================
    showModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                ${content}
            </div>
        `;
        document.body.appendChild(modal);

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.remove());
    }

    // ===========================
    // Utility Functions
    // ===========================
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db'
        };
        
        toast.style.background = colors[type] || colors.info;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===========================
// Global Functions
// ===========================
function askQuestion() {
    app.askQuestion();
}

function showAuthModal(type) {
    app.showAuthModal(type);
}

function closeAuthModal() {
    app.closeAuthModal();
}

// ===========================
// CSS Animations
// ===========================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===========================
// Initialize App
// ===========================
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PhiloLogicApp();
    console.log('PhiloLogic app initialized');
});