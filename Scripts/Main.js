const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-theme');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    if (body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
});

const navbar = document.getElementById('navbar');
let lastScrollState = false;

function updateNavbar() {
    const shouldPin = window.scrollY > 40;
    if (shouldPin !== lastScrollState) {
        navbar.classList.toggle('scrolled', shouldPin);
        lastScrollState = shouldPin;
    }
}

let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            updateNavbar();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

updateNavbar();

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const navOverlay = document.getElementById('nav-overlay');
const mobileNavClose = document.getElementById('mobile-nav-close');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-nav-bottom .btn');

function openMobileNav() {
    mobileNav.classList.add('open');
    navOverlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    body.classList.add('no-scroll');
}

function closeMobileNav() {
    mobileNav.classList.remove('open');
    navOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    body.classList.remove('no-scroll');
}

hamburger.addEventListener('click', () => {
    if (mobileNav.classList.contains('open')) {
        closeMobileNav();
    } else {
        openMobileNav();
    }
});

mobileNavClose.addEventListener('click', closeMobileNav);
navOverlay.addEventListener('click', closeMobileNav);

mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileNav();
    }
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        entry.target.classList.toggle('show', entry.isIntersecting);
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

const statItems = document.querySelectorAll('.stat-item h3');

function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = value + suffix;
        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            animateCount(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

statItems.forEach(el => statsObserver.observe(el));

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', () => {
        formStatus.textContent = 'Opening your email client…';
    });
}
