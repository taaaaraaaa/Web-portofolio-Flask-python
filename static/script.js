document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initContactForm();
    initScrollSpy();
    initSectionAnimations();
});

// === SMOOTH SCROLL NAVIGASI ===
function initSmoothScroll() {
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// === HANDLE FORM KONTAK ===
function initContactForm() {
    const form = document.getElementById('contact-form');
    const notif = createNotificationElement();

    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            const result = await response.json();

            if (response.ok) {
                showNotification('Pesan berhasil dikirim!', 'success');
                form.reset();
            } else {
                showNotification(result.message || 'Gagal mengirim pesan.', 'error');
            }
        } catch (error) {
            showNotification('Terjadi kesalahan saat menghubungi server.', 'error');
        }

        function showNotification(message, type) {
            notif.textContent = message;
            notif.className = `notif ${type}`;
            notif.style.display = 'block';

            setTimeout(() => {
                notif.style.display = 'none';
            }, 4000);
        }
    });
}

// === SCROLLSPY: LINK NAVIGASI AKTIF ===
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;

        sections.forEach(section => {
            const offset = section.offsetTop - 100;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= offset && scrollY < offset + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// === ANIMASI FADE-IN SAAT SECTION MUNCUL ===
function initSectionAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// === UTILITY: NOTIFIKASI ELEMENT ===
function createNotificationElement() {
    let notif = document.querySelector('.notif');
    if (!notif) {
        notif = document.createElement('div');
        notif.className = 'notif';
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            background-color: #333;
            color: #fff;
            display: none;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(notif);
    }
    return notif;
}
