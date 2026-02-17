// script.js
async function loadComponents() {
    const headerPlaceholder = document.querySelector('#header-placeholder');
    const footerPlaceholder = document.querySelector('#footer-placeholder');

    if (headerPlaceholder) {
        const response = await fetch('components/header/header.html');
        headerPlaceholder.innerHTML = await response.text();
    }

    if (footerPlaceholder) {
        const response = await fetch('components/footer/footer.html');
        footerPlaceholder.innerHTML = await response.text();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();

    const burgerBtn = document.querySelector('.burger-btn');
    const nav = document.querySelector('.nav');
    const icon = burgerBtn ? burgerBtn.querySelector('i') : null;
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = (forceState = null) => {
        const isOpen = forceState !== null ? forceState : !nav.classList.contains('active');
        nav.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (icon) {
            if (isOpen) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }
    };

    if (burgerBtn && nav) {
        burgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !burgerBtn.contains(e.target)) {
                toggleMenu(false);
            }
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const darkCards = document.querySelectorAll('.dark-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                }, index * 80);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    darkCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        cardObserver.observe(card);
    });

    const updateTime = () => {
        const el = document.querySelector('.current-time');
        if (el) el.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    updateTime();
    setInterval(updateTime, 1000);

    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rX = ((y - rect.height / 2) / (rect.height / 2)) * -15;
            const rY = ((x - rect.width / 2) / (rect.width / 2)) * 15;
            card.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02, 1.02, 1.02)`;
            const glare = card.querySelector('.card-glare');
            if(glare) glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            const glare = card.querySelector('.card-glare');
            if(glare) glare.style.background = 'transparent';
        });
    });

    document.querySelectorAll('.hub-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const id = tab.getAttribute('data-target');
            document.querySelectorAll('.hub-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.hub-grid').forEach(g => g.classList.toggle('active', g.id === id));
        });
    });

    const tGrid = document.querySelector('.testimonials-grid');
    const tDots = document.querySelectorAll('.testimonials-dots .dot');
    if (tGrid && tDots.length > 0) {
        const getCardWidth = () => {
            const card = tGrid.querySelector('.testimonial-card');
            return card ? card.offsetWidth + 16 : 0;
        };
        const updateDots = () => {
            const index = Math.round(tGrid.scrollLeft / getCardWidth());
            tDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        };
        tDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                tGrid.scrollTo({ left: getCardWidth() * index, behavior: 'smooth' });
            });
        });
        document.querySelector('.testimonials-next')?.addEventListener('click', () => {
            tGrid.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        });
        document.querySelector('.testimonials-prev')?.addEventListener('click', () => {
            tGrid.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });
        tGrid.addEventListener('scroll', updateDots);
    }

    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question').onclick = (e) => {
            e.preventDefault();
            const isOpen = item.classList.contains('is-open');
            document.querySelectorAll('.faq-item').forEach(o => {
                o.classList.remove('is-open');
                o.querySelector('.faq-answer').style.maxHeight = null;
            });
            if (!isOpen) {
                item.classList.add('is-open');
                const a = item.querySelector('.faq-answer');
                a.style.maxHeight = a.scrollHeight + 'px';
            }
        };
    });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    }); 
});