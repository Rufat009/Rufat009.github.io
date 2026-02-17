// components/team/team.js
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.team-modern-grid');
    const dots = document.querySelectorAll('.team-dot');
    const counter = document.querySelector('.team-slider-counter');

    const updateSliderUI = () => {
        if (!grid || dots.length === 0) return;
        const cardWidth = grid.querySelector('.modern-card').offsetWidth + 16;
        const index = Math.round(grid.scrollLeft / cardWidth);
        
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        
        if (counter) {
            counter.innerText = `${index + 1} / ${dots.length}`;
        }
    };

    if (grid) {
        grid.addEventListener('scroll', updateSliderUI);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const cardWidth = grid.querySelector('.modern-card').offsetWidth + 16;
            grid.scrollTo({
                left: cardWidth * index,
                behavior: 'smooth'
            });
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});