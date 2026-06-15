// components/team/team.js
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.team-modern-grid');
    const dotsContainer = document.querySelector('.team-slider-dots');
    const counter = document.querySelector('.team-slider-counter');
    const cards = grid ? Array.from(grid.querySelectorAll('.modern-card')) : [];
    let dots = Array.from(document.querySelectorAll('.team-dot'));

    if (dotsContainer && cards.length && dots.length !== cards.length) {
        dotsContainer.innerHTML = '';
        cards.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = `team-dot${index === 0 ? ' active' : ''}`;
            dotsContainer.appendChild(dot);
        });
        dots = Array.from(dotsContainer.querySelectorAll('.team-dot'));
    }

    const getActiveIndex = () => {
        const gridRect = grid.getBoundingClientRect();
        const gridCenter = gridRect.left + gridRect.width / 2;

        return cards.reduce((closestIndex, card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const currentDistance = Math.abs(cardCenter - gridCenter);
            const closestCard = cards[closestIndex];
            const closestRect = closestCard.getBoundingClientRect();
            const closestCenter = closestRect.left + closestRect.width / 2;

            return currentDistance < Math.abs(closestCenter - gridCenter) ? index : closestIndex;
        }, 0);
    };

    const updateSliderUI = () => {
        if (!grid || cards.length === 0 || dots.length === 0) return;
        const index = getActiveIndex();
        
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        
        if (counter) {
            counter.innerText = `${index + 1} / ${cards.length}`;
        }
    };

    if (grid) {
        grid.addEventListener('scroll', updateSliderUI);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const card = cards[index];
            if (!grid || !card) return;

            grid.scrollTo({
                left: Math.max(0, card.offsetLeft - grid.offsetLeft - ((grid.clientWidth - card.offsetWidth) / 2)),
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
