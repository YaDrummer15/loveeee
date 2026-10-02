function sparkles(x, y) {
    for (let i = 0; i < 6; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.textContent = ['❋', '✧', '✦', '✿', '❀', '★'][Math.floor(Math.random() * 6)];
        s.style.left = (x + (Math.random() - 0.5) * 100) + 'px';
        s.style.top = (y + (Math.random() - 0.5) * 100) + 'px';
        s.style.fontSize = (Math.random() * 0.6 + 0.8) + 'rem';
        s.style.animationDelay = (Math.random() * 0.2) + 's';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 1500);
    }
}

let observer = null;
function revealOnScroll() {
    const els = document.querySelectorAll('.reveal');
    if (!observer) {
        observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    }
    els.forEach(el => observer.observe(el));
}

let typeStarted = false;
function startTypewriter() {
    if (typeStarted) return;
    typeStarted = true;
    const el = document.getElementById('typewriter');
    if (!el) return;
    const text = CONFIG.HERO_SUBTITLE;
    let i = 0;
    function tick() {
        if (i < text.length) {
            el.textContent = text.substring(0, i + 1);
            i++;
            setTimeout(tick, 28);
        }
    }
    tick();
}