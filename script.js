// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar background opacity on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26,26,26,0.95)';
    } else {
        navbar.style.background = 'rgba(26,26,26,0.8)';
    }
});

// Add animation class to features when they come into view
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Loading Animation
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader-container');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }, 500);
    }
});

// Page Transitions
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.href.includes(window.location.origin)) {
            e.preventDefault();
            document.body.classList.remove('page-transition', 'visible');
            setTimeout(() => {
                window.location = link.href;
            }, 300);
        }
    });
});

// Back to Top
const backToTop = document.createElement('div');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form Feedback
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedback = document.createElement('div');
        feedback.className = 'feedback-message success';
        feedback.textContent = 'Message sent successfully!';
        contactForm.insertBefore(feedback, contactForm.firstChild);
        feedback.style.display = 'block';
        contactForm.reset();
    });
}

// 3D Model Loading Progress
if (window.location.pathname.includes('3d-model')) {
    const loader = new GLTFLoader();
    loader.onProgress = function (url, itemsLoaded, itemsTotal) {
        const progress = (itemsLoaded / itemsTotal) * 100;
        // Update progress bar
    };
} 