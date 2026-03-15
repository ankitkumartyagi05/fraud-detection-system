/* ================================================
   FRAUD SHIELD AI - FULL WORKING FRONTEND JS
=============================================== */

(function () {
    'use strict';

    // ================================================
    //   1. CONFIGURATION
    // ================================================
    const Config = {
        // CHANGE THIS URL when deploying backend (e.g., to Render.com)
        // Example: 'https://your-app.onrender.com'
        API_BASE_URL: 'http://localhost:5000',

        PAGES: ['home', 'scanner', 'threats', 'features', 'stats'],
        ANIMATION_SPEED: 600
    };

    const State = {
        currentPage: 0,
        isAnimating: false,
        statsAnimated: false,
        backendAvailable: false
    };

    // ================================================
    //   2. UTILITIES
    // ================================================
    const Utils = {
        sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

        Data: {
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
                { icon: '📥', title: 'Quarantine', desc: 'Isolate threat' }
            ],
            stats: { scanned: 15420, frauds: 3210, blocked: 980 }
        }
    };

    // ================================================
    //   3. CORE MODULES
    // ================================================

    const Router = {
        init: function () {
            this.wrapper = document.getElementById('pageWrapper');

            document.querySelectorAll('[data-page]').forEach(el => {
                el.addEventListener('click', (e) => {
                    const page = parseInt(e.currentTarget.getAttribute('data-page'));
                    this.navigate(page);
                });
            });

            // Touch Swipe
            let touchStartX = 0;
            const container = document.getElementById('app-container');

            container.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, false);
            container.addEventListener('touchend', e => {
                const diff = touchStartX - e.changedTouches[0].screenX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) this.navigate(State.currentPage + 1);
                    else this.navigate(State.currentPage - 1);
                }
            }, false);

            // Keyboard
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') this.navigate(State.currentPage + 1);
                if (e.key === 'ArrowLeft') this.navigate(State.currentPage - 1);
            });
        },

        navigate: function (index) {
            if (State.isAnimating || index === State.currentPage || index < 0 || index >= Config.PAGES.length) return;

            State.isAnimating = true;
            State.currentPage = index;

            this.wrapper.style.transform = `translateX(-${State.currentPage * 100}%)`;
            this.updateUI();

            setTimeout(() => { State.isAnimating = false; }, Config.ANIMATION_SPEED);

            if (Config.PAGES[index] === 'stats' && !State.statsAnimated) Dashboard.animateStats();
        },

        updateUI: function () {
            document.querySelectorAll('.nav-link').forEach((l, i) => l.classList.toggle('active', i === State.currentPage));
            document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === State.currentPage));
        }
    };

    const Scanner = {
        init: function () {
            this.input = document.getElementById('msgInput');
            this.btn = document.getElementById('scanBtn');
            this.container = document.getElementById('workflowContainer');
            this.statusTag = document.getElementById('apiStatus');

            document.querySelectorAll('.chip').forEach(c => {
                c.addEventListener('click', () => {
                    this.input.value = c.getAttribute('data-msg');
                });
            });

            this.btn.addEventListener('click', () => this.startAnalysis());
            this.generateSteps();
            this.checkBackend();
        },

        checkBackend: async function () {
            try {
                // Try to check if backend is alive
                // Note: Simple GET request to root usually
                await fetch(Config.API_BASE_URL + '/', { method: 'GET', mode: 'cors' });
                State.backendAvailable = true;
                this.statusTag.innerText = "Live API";
                this.statusTag.style.color = "#00ff88";
                this.statusTag.style.background = "rgba(0, 255, 136, 0.2)";
                console.log("Backend Connected");
            } catch (e) {
                console.log("Running in Demo Mode");
                State.backendAvailable = false;
            }
        },

        generateSteps: function () {
            const steps = ['Detect SMS', 'Analyze Content', 'AI Detection', 'Link Check', 'Final Action'];
            let html = '';
            steps.forEach((s, i) => {
                html += `<div class="workflow-item" id="step-${i}">
                            <div class="step-icon">${i + 1}</div>
                            <div class="step-text">${s}<p>Waiting...</p></div>
                            <div class="step-status">Pending</div>
                         </div>`;
            });
            this.container.innerHTML = html;
        },

        startAnalysis: async function () {
            const text = this.input.value.trim();
            if (!text) return;

            this.btn.disabled = true;
            this.btn.innerText = "Processing...";
            this.generateSteps();

            let result;

            if (State.backendAvailable) {
                result = await this.runBackend(text);
            } else {
                result = this.runLocalLogic(text);
            }

            // Animate Steps based on result
            for (let i = 0; i < 5; i++) {
                const stepEl = document.getElementById(`step-${i}`);

                stepEl.classList.add('active');
                stepEl.querySelector('.step-status').innerText = 'Processing...';
                stepEl.querySelector('p').innerText = 'Analyzing...';

                await Utils.sleep(400);

                let resultClass = 'success';
                let statusText = 'Clear';

                if (result.isFraud) {
                    if (i === 2) { resultClass = 'danger'; statusText = 'Fraud Found'; }
                    if (i === 3 && result.links.length > 0) { resultClass = 'danger'; statusText = 'Malicious'; }
                    if (i === 4) { resultClass = 'danger'; statusText = 'BLOCKED'; }
                } else {
                    if (i === 4) statusText = 'Safe';
                }

                stepEl.classList.remove('active');
                stepEl.classList.add(resultClass);
                stepEl.querySelector('.step-status').innerText = statusText;
                stepEl.querySelector('p').innerText = 'Complete';
            }

            // Show Result
            if (result.isFraud) {
                let details = "";
                if (result.keywords.length > 0) details += "Keywords: " + result.keywords.join(", ");
                if (result.links.length > 0) details += "\nLinks: " + result.links.join(", ");
                Modal.show("ATTENTION", details || "Threat detected", true);
            } else {
                Modal.show("SAFE", "No malicious content detected.", false);
            }

            this.btn.disabled = false;
            this.btn.innerText = "Analyze";
        },

        runLocalLogic: function (text) {
            const lowerText = text.toLowerCase();
            const keywords = ['urgent', 'verify', 'suspend', 'blocked', 'winner', 'click', 'pay', 'lottery', 'kyc', 'password'];
            const foundKeywords = keywords.filter(k => lowerText.includes(k));
            const linkRegex = /(https?:\/\/[^\s]+)/g;
            const foundLinks = text.match(linkRegex) || [];
            const isFraud = foundKeywords.length > 0 || foundLinks.length > 0;

            return {
                isFraud: isFraud,
                keywords: foundKeywords,
                links: foundLinks
            };
        },

        runBackend: async function (text) {
            try {
                const response = await fetch(Config.API_BASE_URL + '/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });
                const data = await response.json();
                return {
                    isFraud: data.classification === "Fraud",
                    keywords: data.suspicious_words,
                    links: data.detected_links
                };
            } catch (error) {
                console.error("Backend error, fallback to local", error);
                return this.runLocalLogic(text);
            }
        }
    };

    const Dashboard = {
        init: function () {
            const d = Utils.Data.stats;
            document.getElementById('statsRow').innerHTML = `
                <div class="stat-card"><div class="stat-num" id="stat1">0</div><div class="stat-label">Scanned</div></div>
                <div class="stat-card"><div class="stat-num" id="stat2" style="color:var(--rgb-pink)">0</div><div class="stat-label">Frauds</div></div>
                <div class="stat-card"><div class="stat-num" id="stat3" style="color:var(--rgb-gold)">0</div><div class="stat-label">Blocked</div></div>
            `;

            const ctx = document.getElementById('mainChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                    datasets: [{
                        label: 'Threats',
                        data: [12, 19, 8, 15, 10, 6, 12],
                        borderColor: '#ff0096',
                        backgroundColor: 'rgba(255, 0, 150, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { display: false }, x: { grid: { color: 'rgba(255,255,255,0.05)' } } }
                }
            });
        },
        animateStats: function () {
            State.statsAnimated = true;
            const d = Utils.Data.stats;
            this.countUp('stat1', d.scanned);
            this.countUp('stat2', d.frauds);
            this.countUp('stat3', d.blocked);
        },
        countUp: (id, target) => {
            const el = document.getElementById(id);
            if (!el) return;
            let i = 0;
            const inc = target / 40;
            const int = setInterval(() => {
                i += inc;
                if (i >= target) { i = target; clearInterval(int); }
                el.innerText = Math.floor(i).toLocaleString();
            }, 30);
        }
    };

    const Content = {
        init: function () {
            let sHtml = '';
            Utils.Data.scams.forEach(s => {
                sHtml += `<div class="scam-box"><div class="scam-header"><div class="scam-icon">${s.icon}</div><div class="scam-title">${s.title}</div></div><p class="scam-desc">${s.desc}</p><span class="tag">${s.tag}</span></div>`;
            });
            document.getElementById('scamsGrid').innerHTML = sHtml;

            let fHtml = '';
            Utils.Data.features.forEach(f => {
                fHtml += `<div class="feature-card"><div class="f-icon">${f.icon}</div><div class="f-content"><h5>${f.title}</h5><p>${f.desc}</p></div></div>`;
            });
            document.getElementById('featureList').innerHTML = fHtml;

            let dHtml = '';
            Config.PAGES.forEach((p, i) => { dHtml += `<div class="dot ${i === 0 ? 'active' : ''}" data-page="${i}"></div>`; });
            document.getElementById('pageIndicator').innerHTML = dHtml;
        }
    };

    const Modal = {
        init: function () {
            this.el = document.getElementById('resultModal');
            this.box = document.getElementById('modalContent');
            this.title = document.getElementById('modalTitle');
            this.text = document.getElementById('modalText');
            this.desc = document.getElementById('modalDesc');
            this.btn = document.getElementById('closeModalBtn');

            this.btn.addEventListener('click', () => this.hide());
        },
        show: function (title, desc, isDanger) {
            this.title.innerText = title;
            this.text.innerText = isDanger ? "Security Alert" : "Analysis Complete";
            this.desc.innerText = desc;

            if (isDanger) {
                this.box.classList.remove('safe-mode');
                this.title.style.color = "var(--rgb-red)";
            } else {
                this.box.classList.add('safe-mode');
                this.title.style.color = "var(--rgb-green)";
            }

            this.el.classList.add('show');
            if (navigator.vibrate && isDanger) navigator.vibrate([200]);
        },
        hide: function () {
            this.el.classList.remove('show');
        }
    };

    // ================================================
    //   4. APP INIT
    // ================================================
    const App = {
        init: function () {
            Router.init();
            Scanner.init();
            Content.init();
            Dashboard.init();
            Modal.init();
            window.App = { router: Router };
            setTimeout(() => { document.getElementById('preloader').classList.add('loaded'); }, 2000);
        }
    };

    document.addEventListener('DOMContentLoaded', App.init);

})();
