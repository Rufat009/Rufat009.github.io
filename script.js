document.addEventListener('DOMContentLoaded', () => {

    const burgerBtn = document.querySelector('.burger-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const icon = burgerBtn ? burgerBtn.querySelector('i') : null;

    if (burgerBtn && nav) {
        burgerBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            });
        });
    }

    const observerOptions = {
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    const darkCards = document.querySelectorAll('.dark-card');
    darkCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
    });

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
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    darkCards.forEach(card => cardObserver.observe(card));

    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const timeElement = document.querySelector('.current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            const glare = card.querySelector('.card-glare');
            if(glare) {
                glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`;
            }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            const glare = card.querySelector('.card-glare');
            if(glare) {
                glare.style.background = `transparent`;
            }
        });
    });

    const hubTabs = document.querySelectorAll('.hub-tab');
    const hubGrids = document.querySelectorAll('.hub-grid');

    if (hubTabs.length > 0 && hubGrids.length > 0) {
        hubTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('data-target');
                
                hubTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                hubGrids.forEach(grid => {
                    grid.classList.remove('active');
                    if(grid.id === targetId) {
                        grid.classList.add('active');
                    }
                });
            });
        });
    }

    const tGrid = document.querySelector('.testimonials-grid');
    const tPrev = document.querySelector('.testimonials-prev');
    const tNext = document.querySelector('.testimonials-next');
    const tDots = document.querySelectorAll('.testimonials-dots .dot');

    if (tGrid && tPrev && tNext) {
        const getCardWidth = () => {
            const card = tGrid.querySelector('.testimonial-card');
            return card ? card.offsetWidth + 16 : 0; 
        };

        tNext.addEventListener('click', () => {
            tGrid.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        });

        tPrev.addEventListener('click', () => {
            tGrid.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });

        tGrid.addEventListener('scroll', () => {
            const scrollLeft = tGrid.scrollLeft;
            const width = getCardWidth();
            if (width === 0) return;
            
            const index = Math.round(scrollLeft / width);
            
            tDots.forEach(d => d.classList.remove('active'));
            if (tDots[index]) {
                tDots[index].classList.add('active');
            }
        });
    }

    // ========== ПРОСТЕЙШИЙ РАБОЧИЙ FAQ ==========
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            // Убираем всё лишнее
            question.onclick = function(e) {
                e.preventDefault();
                
                // Проверяем текущее состояние
                const isOpen = item.classList.contains('is-open');
                
                // Закрываем все остальные
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('is-open');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = null;
                        }
                    }
                });
                
                // Открываем или закрываем текущий
                if (!isOpen) {
                    // Открываем
                    item.classList.add('is-open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    // Закрываем
                    item.classList.remove('is-open');
                    answer.style.maxHeight = null;
                }
            };
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

});