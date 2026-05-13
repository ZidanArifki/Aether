  // GSAP Registration
        const firebaseConfig = {
            apiKey: "AIzaSyAoe8rNw_Ti-StzB0ERzdsGpJ1CKjmiEMU",
            authDomain: "aether-sovereign.firebaseapp.com",
            projectId: "aether-sovereign",
            storageBucket: "aether-sovereign.firebasestorage.app",
            messagingSenderId: "461248328418",
            appId: "1:461248328418:web:1d767ddb136c2f6f7464bb",
            measurementId: "G-X7LBQST23N"
        };
        firebase.initializeApp(firebaseConfig);

        const db = firebase.firestore();
        gsap.registerPlugin(ScrollTrigger);

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.9)';
            }
        });

        // Mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Hero animations
        gsap.from('.hero-content h1', { 
            opacity: 0, 
            y: 100, 
            duration: 1.5, 
            ease: 'power3.out' 
        });
        gsap.from('.hero-subtitle', { 
            opacity: 0, 
            y: 50, 
            duration: 1.2, 
            delay: 0.3 
        });
        gsap.from('.hero-description', { 
            opacity: 0, 
            y: 50, 
            duration: 1, 
            delay: 0.6 
        });
        gsap.from('.cta-buttons .btn', { 
            opacity: 0, 
            y: 50, 
            duration: 1, 
            delay: 0.9,
            stagger: 0.1 
        });

        // Section animations
        gsap.utils.toArray('.section').forEach((section, i) => {
            gsap.from(section.querySelectorAll('.category-card, .trending-card, .community-card'), {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                },
                opacity: 0,
                y: 100,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            });
        });

        // Copy functionality with ad delay
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showCopyModal();
            });
        });

        function showCopyModal() {
            const modal = document.getElementById('copyModal');
            modal.classList.add('active');
            
            // Simulate ad delay then copy
            setTimeout(() => {
                navigator.clipboard.writeText('https://link.clashofclans.com/en/?action=CopyArmy&army=u12x3-0_0x3-0_0x3-0_0x3-0_0x3-0_0x3-0_0x3-0_0x3-0_0x3-0_0x3-0_0x3-0_0x3-0');
            }, 3000);
        }

        function closeModal() {
            document.getElementById('copyModal').classList.remove('active');
        }

        // Particles animation
        function initParticles() {
            const canvas = document.getElementById('particles');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const particles = [];
            for (let i = 0; i < 100; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1
                });
            }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 245, 255, ${p.radius * 0.3})`;
                    ctx.fill();

                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                });

                requestAnimationFrame(animate);
            }

            animate();

            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Initialize
        initParticles();
        async function loadBases(){

    const container =
    document.getElementById("basesContainer");

    // kalau container tidak ada
    if(!container) return;

    // kosongkan isi
    container.innerHTML = "";

    // ambil data dari firestore
    const snapshot =
    await db.collection("bases")
    .orderBy("createdAt", "desc")
    .get();

    // looping data
    snapshot.forEach((doc) => {

        const base = doc.data();

        container.innerHTML += `

        <div class="category-card">

            <img src="${base.imageUrl}"
                 class="base-image">

            <div class="category-title">
                ${base.title}
            </div>

            <div>
                ${base.category}
            </div>

            <a href="${base.layoutLink}"
               target="_blank"
               class="copy-btn">

               Copy Layout

            </a>

        </div>

        `;

    });

}

// jalankan function
loadBases();
