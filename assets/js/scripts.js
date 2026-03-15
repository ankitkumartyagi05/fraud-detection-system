/* ================================================
   FRAUD SHIELD AI - PRODUCTION JS
   Architecture: Modular | Backend Ready | Mobile Optimized
=============================================== */

// Immediate function to avoid global scope pollution
(function () {
    'use strict';

    // ================================================
    //   1. CONFIGURATION & STATE
    // ================================================
    const Config = {
        API_BASE_URL: 'http://localhost:5000', // Change this to your deployed backend URL
        PAGES: ['home', 'scanner', 'threats', 'features', 'stats'],
        ANIMATION_SPEED: 600,
        TIMEOUT: 5000
    };

    const State = {
        currentPage: 0,
        isAnimating: false,
        isLoading: false,
        backendAvailable: false, // Will be checked on load
        statsAnimated: false
    };

    // ================================================
    //   2. UTILITY FUNCTIONS
    // ================================================
    const Utils = {
        // Simulated Data for Demo Mode
        getDemoData: {
            scams: [
                { icon: '⚡', title: 'Electricity Scam', desc: 'Threatens power cut via malicious link.', tag: 'High Risk' },
                { icon: '🏦', title: 'Bank KYC', desc: 'Steals credentials via fake forms.', tag: 'Phishing' },
                { icon: '💰', title: 'Fake Payment', desc: 'Demands product release on fake proof.', tag: 'Merchant' },
                { icon: '🔑', title: 'OTP Fraud', desc: 'Steals One Time Passwords.', tag: 'Identity' },
                { icon: '🏛️', title: 'Govt Scheme', desc: 'Extracts personal details.', tag: 'Data Harvest' }
            ],
            features: [
                { icon: '📲', title: 'Detect SMS', desc: 'Real-time monitoring' },
                { icon: '🔍', title: 'Analyze Content', desc: 'Keyword extraction' },
                { icon: '🚫', title: 'Detect Fraud', desc: 'AI classification' },
                { icon: '🔗', title: 'Identify Links', desc: 'URL reputation' },
                { icon: '🔔', title: 'Alert User', desc: 'Instant notification' },
                { icon: ' Quarantine', title: 'Block', desc: 'Isolate threat' }
            ],
            stats: { scanned: 15420, frauds: 3210, blocked: 980 }
        },

        // Render HTML Templates
        render: (containerId, html) => {
            const container = document.getElementById(containerId);
            if (container) container.innerHTML = html;
        },

        // Check Backend Health
        checkBackend: async () => {
            try {
                // Try to fetch a lightweight endpoint or root
                const response = await fetch(Config.API_BASE_URL + '/', { method: 'GET', mode: 'cors' });
                if (response.ok) {
                    State.backendAvailable = true;
                    console.log('Backend Connected.');
                    document.getElementById('apiStatus').innerText = 'Live API';
                    document.getElementById('apiStatus').style.background = 'rgba(0, 255, 136, 0.2)';
                    document.getElementById('apiStatus').style.color = '#00ff88';
                }
            } catch (error) {
                console.log('Backend not found. Running in Demo Mode.');
                State.backendAvailable = false;
            }
        }
    };

    // ================================================
    //   3. CORE MODULES
    // ================================================

    // Router: Handles Navigation & Swipes
    const Router = {
        init: function () {
            this.wrapper = document.getElementById('pageWrapper');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.dots = document.querySelectorAll('.dot');

            // Click Events
            document.querySelectorAll('[data-page]').forEach(el => {
                el.addEventListener('click', (e) => {
                    const page = parseInt(e.currentTarget.getAttribute('data-page'));
                    this.navigate(page);
                });
            });

            // Touch Events (Swipe)
            this.touchStartX = 0;
            this.touchEndX = 0;
            const appContainer = document.getElementById('app-container');

            appContainer.addEventListener('touchstart', e => { this.touchStartX = e.changedTouches[0].screenX; }, false);
            appContainer.addEventListener('touchend', e => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, false);

            // Keyboard Events
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') this.navigate(State.currentPage + 1);
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') this.navigate(State.currentPage - 1);
            });
        },

        navigate: function (index) {
            if (State.isAnimating || index === State.currentPage || index < 0 || index >= Config.PAGES.length) return;

            State.isAnimating = true;
            State.currentPage = index;

            // Transform
            this.wrapper.style.transform = `translateX(-${State.currentPage * 100}%)`;

            // Update UI
            this.updateIndicators();

            // Lock animation
            setTimeout(() => { State.isAnimating = false; }, Config.ANIMATION_SPEED);

            // Trigger Page Specific Events
            if (Config.PAGES[index] === 'stats' && !State.statsAnimated) Dashboard.animateStats();
        },

        handleSwipe: function () {
            const threshold = 50;
            const diff = this.touchStartX - this.touchEndX;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) this.navigate(State.currentPage + 1); // Swipe Left
                else this.navigate(State.currentPage - 1); // Swipe Right
            }
        },

        updateIndicators: function () {
            this.navLinks.forEach((link, i) => {
                if (i === State.currentPage) link.classList.add('active');
                else link.classList.remove('active');
            });

            this.dots.forEach((dot, i) => {
                if (i === State.currentPage) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }
    };

    // Scanner: Core Logic
    const Scanner = {
        init: function () {
            this.input = document.getElementById('msgInput');
            this.btn = document.getElementById('scanBtn');
            this.workflowContainer = document.getElementById('workflowContainer');

            // Quick Chips
            document.querySelectorAll('.chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    this.input.value = chip.getAttribute('data-msg');
                });
            });

            // Analysis
            this.btn.addEventListener('click', () => this.analyze());
            this.renderWorkflowSteps();
        },

        renderWorkflowSteps: function () {
            const steps = [
                { name: 'Detect SMS', sub: 'Reading headers' },
                { name: 'Analyze Content', sub: 'Processing text' },
                { name: 'AI Detection', sub: 'Pattern matching' },
                { name: 'Link Check', sub: 'Domain reputation' },
                { name: 'Final Action', sub: 'Alert user' }
            ];

            let html = '';
            steps.forEach((s, i) => {
                html += `
                    <div class="workflow-item" data-step="${i + 1}">
                        <div class="step-icon">${i + 1}</div>
                        <div class="step-text">${s.name}<p>${s.sub}</p></div>
                        <div class="step-status">Pending</div>
                    </div>
                `;
            });
            this.workflowContainer.innerHTML = html;
        },

        analyze: async function () {
            const text = this.input.value.trim();
            if (!text) return;

            this.btn.disabled = true;
            this.btn.innerText = "Processing...";

            // Reset UI
            document.querySelectorAll('.workflow-item').forEach(el => {
                el.className = 'workflow-item';
                el.querySelector('.step-status').innerText = 'Pending';
            });

            // Check if Backend Available
            if (State.backendAvailable) {
                await this.runBackendAnalysis(text);
            } else {
                await this.runSimulation(text);
            }

            this.btn.disabled = false;
            this.btn.innerText = "Analyze";
        },

        runBackendAnalysis: async function (text) {
            try {
                const response = await fetch(Config.API_BASE_URL + '/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });
                const data = await response.json();

                // Fast UI update based on result
                this.updateStepsUI(data.classification === 'Fraud' ? 'danger' : 'success', data);

            } catch (error) {
                console.error("API Error, falling back to demo", error);
                await this.runSimulation(text);
            }
        },

        runSimulation: async function (text) {
            const isFraud = text.toLowerCase().includes('urgent') ||
                text.toLowerCase().includes('pay') ||
                text.toLowerCase().includes('kyc') ||
                text.includes('http');

            // Step-by-step Animation
            const items = document.querySelectorAll('.workflow-item');

            for (let i = 0; i < items.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 500));
                items[i].classList.add('active');
                items[i].querySelector('.step-status').innerText = 'Processing...';

                await new Promise(resolve => setTimeout(resolve, 300));

                let stepClass = 'success';
                if (isFraud && i === 2) stepClass = 'danger'; // AI Detection step
                if (isFraud && i === 3) stepClass = 'danger'; // Link Check step
                if (isFraud && i === 4) stepClass = 'danger'; // Final step

                items[i].classList.remove('active');
                items[i].classList.add(stepClass);
                items[i].querySelector('.step-status').innerText = stepClass === 'danger' ? 'ALERT' : 'OK';
            }

            if (isFraud) {
                App.modal.show("Malicious content detected in simulation.");
            } else {
                App.modal.show("Message appears safe (Simulation).", false);
            }
        },

        updateStepsUI: function (status, data) {
            const items = document.querySelectorAll('.workflow-item');
            items.forEach((item, i) => {
                item.classList.add(status);
                item.querySelector('.step-status').innerText = status === 'danger' ? 'ALERT' : 'OK';
            });
            App.modal.show(data.suspicious_words ? "Fraud Detected: " + data.suspicious_words.join(", ") : "Fraud Detected", status === 'danger');
        }
    };

    // Dashboard: Stats & Charts
    const Dashboard = {
        init: function () {
            this.renderStats();
            this.initChart();
        },

        renderStats: function () {
            const d = Utils.getDemoData.stats;
            document.getElementById('statsRow').innerHTML = `
                <div class="stat-card"><div class="stat-num" id="stat1">0</div><div class="stat-label">Scanned</div></div>
                <div class="stat-card"><div class="stat-num" id="stat2" style="color:var(--rgb-pink)">0</div><div class="stat-label">Frauds</div></div>
                <div class="stat-card"><div class="stat-num" id="stat3" style="color:var(--rgb-gold)">0</div><div class="stat-label">Blocked</div></div>
            `;
        },

        animateStats: function () {
            State.statsAnimated = true;
            const d = Utils.getDemoData.stats;
            this.countUp('stat1', d.scanned);
            this.countUp('stat2', d.frauds);
            this.countUp('stat3', d.blocked);
        },

        countUp: function (id, target) {
            const obj = document.getElementById(id);
            if (!obj) return;
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                obj.innerText = Math.floor(current).toLocaleString();
            }, 30);
        },

        initChart: function () {
            const ctx = document.getElementById('mainChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Threats',
                        data: [12, 19, 3, 5, 2, 3, 10],
                        borderColor: '#ff0096',
                        backgroundColor: 'rgba(255, 0, 150, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { display: false, beginAtZero: true },
                        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.3)' } }
                    }
                }
            });
        }
    };

    // Content Renderer
    const Content = {
        init: function () {
            this.renderScams();
            this.renderFeatures();
            this.renderDots();
        },
        renderScams: function () {
            let html = '';
            Utils.getDemoData.scams.forEach(s => {
                html += `
                    <div class="scam-box">
                        <div class="scam-header">
                            <div class="scam-icon">${s.icon}</div>
                            <div class="scam-title">${s.title}</div>
                        </div>
                        <p class="scam-desc">${s.desc}</p>
                        <span class="tag">${s.tag}</span>
                    </div>
                `;
            });
            document.getElementById('scamsGrid').innerHTML = html;
        },
        renderFeatures: function () {
            let html = '';
            Utils.getDemoData.features.forEach(f => {
                html += `
                    <div class="feature-card">
                        <div class="f-icon">${f.icon}</div>
                        <div class="f-content">
                            <h5>${f.title}</h5>
                            <p>${f.desc}</p>
                        </div>
                    </div>
                `;
            });
            document.getElementById('featureList').innerHTML = html;
        },
        renderDots: function () {
            let html = '';
            Config.PAGES.forEach((p, i) => {
                html += `<div class="dot ${i === 0 ? 'active' : ''}" data-page="${i}"></div>`;
            });
            document.getElementById('pageIndicator').innerHTML = html;
        }
    };

    // Modal Handler
    const Modal = {
        init: function () {
            this.modal = document.getElementById('attentionModal');
            this.desc = document.getElementById('threatDesc');
            this.btn = document.getElementById('closeAttention');

            this.btn.addEventListener('click', () => this.hide());
        },
        show: function (text, isDanger = true) {
            this.desc.innerText = text;
            if (isDanger) {
                this.modal.classList.add('show');
                // Vibration API for mobile
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            } else {
                alert("SAFE: " + text);
            }
        },
        hide: function () {
            this.modal.classList.remove('show');
        }
    };

    // ================================================
    //   4. APP INITIALIZATION
    // ================================================
    const App = {
        init: async function () {
            // 1. Check Backend
            await Utils.checkBackend();

            // 2. Init Modules
            Router.init();
            Scanner.init();
            Content.init();
            Dashboard.init();
            Modal.init();

            // 3. Expose Router globally for HTML onclick
            window.App = { router: Router, modal: Modal };

            // 4. Hide Preloader
            setTimeout(() => {
                document.getElementById('preloader').classList.add('loaded');
            }, 1500);
        }
    };

    // Start App when DOM is ready
    document.addEventListener('DOMContentLoaded', App.init);

})();