document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // FLOATING PETALS
    // ===========================
    const petalsContainer = document.getElementById('petals-container');

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        const rand = Math.random();
        if (rand > 0.7) petal.classList.add('light-petal');
        else if (rand > 0.55) petal.classList.add('gold-petal');

        const size = 6 + Math.random() * 16;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (5 + Math.random() * 9) + 's';
        petal.style.animationDelay = Math.random() * 2 + 's';
        petal.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');

        petalsContainer.appendChild(petal);
        setTimeout(() => petal.remove(), 18000);
    }

    const petalInterval = setInterval(() => {
        createPetal();
        createPetal();
        if (Math.random() > 0.5) createPetal();
    }, 300);

    for (let i = 0; i < 40; i++) createPetal();

    // ===========================
    // CINEMATIC ENVELOPE OPEN
    // ===========================
    const envelopeScreen = document.getElementById('envelope-screen');
    const envelopeOuter = document.getElementById('envelope-outer');
    const openBtn = document.getElementById('open-btn');
    const mainSite = document.getElementById('main-site');
    const whiteFlash = document.getElementById('white-flash');
    const particlesContainer = document.getElementById('particles-container');

    let isOpening = false;

    function spawnSealParticles() {
        const seal = document.getElementById('wax-seal');
        if (!seal) return;
        const rect = seal.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const colors = ['#d63031', '#a21a20', '#5d0f12', '#d4af37', '#f1cf72'];

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 140;
            const px = Math.cos(angle) * distance;
            const py = Math.sin(angle) * distance - 40; // bias upward

            particle.style.left = cx + 'px';
            particle.style.top = cy + 'px';
            particle.style.width = (3 + Math.random() * 6) + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.setProperty('--px', px + 'px');
            particle.style.setProperty('--py', py + 'px');
            particle.style.animationDuration = (0.6 + Math.random() * 0.8) + 's';

            particlesContainer.appendChild(particle);
            setTimeout(() => particle.remove(), 1500);
        }
    }

    function cinematicOpen() {
        if (isOpening) return;
        isOpening = true;

        // Disable button
        openBtn.style.pointerEvents = 'none';
        openBtn.style.opacity = '0';
        openBtn.style.transition = 'opacity 0.5s ease';

        // Hide label
        const label = document.querySelector('.envelope-label');
        if (label) {
            label.style.transition = 'opacity 0.5s ease';
            label.style.opacity = '0';
        }

        // Timeline:
        // 0ms      — Seal breaks with particles
        // 400ms    — Camera zooms in subtly
        // 800ms    — Flap opens
        // 2200ms   — Letter rises out
        // 3800ms   — White flash
        // 5000ms   — Show main site

        // Step 1: Break seal (0ms)
        setTimeout(() => {
            spawnSealParticles();
            envelopeOuter.classList.add('phase-seal');
        }, 300);

        // Step 2: Subtle zoom (400ms)
        setTimeout(() => {
            envelopeScreen.classList.add('phase-zoom');
        }, 700);

        // Step 3: Open flap (800ms)
        setTimeout(() => {
            envelopeOuter.classList.add('phase-flap');
        }, 1200);

        // Step 4: Letter rises (2200ms)
        setTimeout(() => {
            envelopeOuter.classList.add('phase-letter');
        }, 2800);

        // Step 5: White flash (3800ms)
        setTimeout(() => {
            whiteFlash.style.transition = 'opacity 1.2s ease';
            whiteFlash.style.opacity = '1';
            clearInterval(petalInterval);
        }, 4500);

        // Step 6: Show website (5000ms)
        setTimeout(() => {
            mainSite.classList.remove('hidden');
            document.body.style.overflow = 'auto';
            envelopeScreen.style.display = 'none';

            requestAnimationFrame(() => {
                initScrollReveals();
                startCountdown();
            });
            setTimeout(initScratchCard, 600);
        }, 5800);
    }

    openBtn.addEventListener('click', cinematicOpen);
    envelopeOuter.addEventListener('click', (e) => {
        if (e.target === openBtn || openBtn.contains(e.target)) return;
        cinematicOpen();
    });

    // Lock scroll during envelope
    document.body.style.overflow = 'hidden';

    // ===========================
    // SCROLL REVEAL
    // ===========================
    function initScrollReveals() {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
        reveals.forEach(el => observer.observe(el));
    }

    // ===========================
    // COUNTDOWN TIMER
    // ===========================
    const WEDDING_DATE = new Date('2027-03-22T11:30:00+05:30').getTime();

    function startCountdown() {
        const daysEl = document.getElementById('cd-days');
        const hoursEl = document.getElementById('cd-hours');
        const minutesEl = document.getElementById('cd-minutes');
        const secondsEl = document.getElementById('cd-seconds');

        function update() {
            const now = Date.now();
            let diff = WEDDING_DATE - now;

            if (diff <= 0) {
                daysEl.textContent = '0';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            diff -= days * (1000 * 60 * 60 * 24);
            const hours = Math.floor(diff / (1000 * 60 * 60));
            diff -= hours * (1000 * 60 * 60);
            const minutes = Math.floor(diff / (1000 * 60));
            diff -= minutes * (1000 * 60);
            const seconds = Math.floor(diff / 1000);

            daysEl.textContent = String(days);
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');

            // Animate the seconds change
            if (secondsEl.textContent !== String(seconds).padStart(2, '0')) {
                secondsEl.style.transform = 'scale(1.08)';
                secondsEl.style.color = '#f1cf72';
                setTimeout(() => {
                    secondsEl.style.transform = 'scale(1)';
                    secondsEl.style.color = '';
                }, 150);
            }
            secondsEl.textContent = String(seconds).padStart(2, '0');
        }

        update();
        setInterval(update, 1000);
    }

    // ===========================
    // SCRATCH CARD
    // ===========================
    function initScratchCard() {
        const canvas = document.getElementById('scratch-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;

        // Gold metallic layer
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#a67c00');
        grad.addColorStop(0.2, '#d4af37');
        grad.addColorStop(0.4, '#f1cf72');
        grad.addColorStop(0.6, '#d4af37');
        grad.addColorStop(0.8, '#c5a365');
        grad.addColorStop(1, '#a67c00');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Shimmer
        for (let i = 0; i < w; i += 3) {
            for (let j = 0; j < h; j += 3) {
                if (Math.random() > 0.55) {
                    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`;
                    ctx.fillRect(i, j, 2, 2);
                }
            }
        }

        ctx.fillStyle = '#7a5c1e';
        ctx.font = `600 14px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✦  SCRATCH HERE  ✦', w / 2, h / 2);

        ctx.globalCompositeOperation = 'destination-out';

        let isDown = false;
        let lastX, lastY;
        let cleared = false;

        function getPos(e) {
            const cr = canvas.getBoundingClientRect();
            const clientX = e.clientX ?? e.touches?.[0]?.clientX;
            const clientY = e.clientY ?? e.touches?.[0]?.clientY;
            return { x: clientX - cr.left, y: clientY - cr.top };
        }

        function onStart(e) {
            e.preventDefault();
            isDown = true;
            const p = getPos(e);
            lastX = p.x; lastY = p.y;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
            ctx.fill();
        }

        function onMove(e) {
            if (!isDown) return;
            e.preventDefault();
            const p = getPos(e);
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(p.x, p.y);
            ctx.lineWidth = 36;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            lastX = p.x; lastY = p.y;
            if (Math.random() > 0.75) checkPercent();
        }

        function onEnd() {
            isDown = false;
            checkPercent();
        }

        function checkPercent() {
            if (cleared) return;
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const px = imgData.data;
            let transparent = 0;
            const step = 16;
            for (let i = 3; i < px.length; i += step * 4) {
                if (px[i] === 0) transparent++;
            }
            const total = Math.ceil(px.length / (step * 4));
            if ((transparent / total) > 0.40) {
                cleared = true;
                canvas.style.transition = 'opacity 0.8s ease-out';
                canvas.style.opacity = '0';
                setTimeout(() => {
                    canvas.style.display = 'none';
                    const hint = document.querySelector('.scratch-instruction');
                    if (hint) {
                        hint.textContent = '✦  Save the Dates  ✦';
                        hint.style.animation = 'none';
                        hint.style.opacity = '1';
                        hint.style.color = '#5d0f12';
                    }
                }, 800);
            }
        }

        canvas.addEventListener('mousedown', onStart);
        canvas.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
        canvas.addEventListener('touchstart', onStart, { passive: false });
        canvas.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);
    }
});
