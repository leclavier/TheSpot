const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const body = document.body;
const htmlElem = document.documentElement;
const navbar = document.getElementById('navbar');
const statNumbers = document.querySelectorAll('.glitch-stat');
const statsSection = document.getElementById('stats');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

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

let ticking = false;
if (navbar) {
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
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

const animateNumbers = () => {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target')) || 0;
        const suffix = stat.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 30));

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.innerText = current + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                stat.innerText = target + suffix;
            }
        };
        updateCounter();
    });
};

const resetNumbers = () => {
    statNumbers.forEach(stat => {
        const suffix = stat.getAttribute('data-suffix') || '';
        stat.innerText = "0" + suffix;
    });
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            entry.target.classList.add('show');
            
            if (entry.target.id === 'stats') {
                animateNumbers();
            }
        } else {
            entry.target.style.opacity = "0";
            entry.target.style.transform = "translateY(30px)";
            entry.target.classList.remove('show');
            
            if (entry.target.id === 'stats') {
                resetNumbers();
            }
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
    observer.observe(el);
});

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
