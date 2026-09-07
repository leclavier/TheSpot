const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const body = document.body;
const htmlElem = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-theme');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
    });
}

const savedLang = localStorage.getItem('lang') || 'en';
setLanguage(savedLang);

function setLanguage(lang) {
    if (lang === 'ar') {
        htmlElem.setAttribute('dir', 'rtl');
        htmlElem.setAttribute('lang', 'ar');
        if (langToggle) langToggle.textContent = 'EN';
        localStorage.setItem('lang', 'ar');
    } else {
        htmlElem.setAttribute('dir', 'ltr');
        htmlElem.setAttribute('lang', 'en');
        if (langToggle) langToggle.textContent = 'AR';
        localStorage.setItem('lang', 'en');
    }
}

if (langToggle) {
    langToggle.addEventListener('click', () => {
        const currentLang = htmlElem.getAttribute('lang');
        setLanguage(currentLang === 'ar' ? 'en' : 'ar');
    });
}

const navbar = document.getElementById('navbar');
let ticking = false;

if (navbar) {
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 40) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const isAr = htmlElem.getAttribute('lang') === 'ar';
        formStatus.textContent = isAr ? 'جاري فتح تطبيق البريد...' : 'Opening email client...';
        
        const name = document.getElementById('name').value;
        const company = document.getElementById('company').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        const subject = encodeURIComponent(`New Inquiry from ${name} - ${company}`);
        const bodyText = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nVision:\n${message}`);
        
        window.location.href = `mailto:team@thespotsa.co?subject=${subject}&body=${bodyText}`;
        
        setTimeout(() => {
            formStatus.textContent = '';
            contactForm.reset();
        }, 3000);
    });
}
