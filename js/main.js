(function () {
    'use strict';

    /* ---------- INIT DATES ---------- */
    const today = new Date();
    const dateStr = today.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const todayEl = document.getElementById('todayDate');
    const footerDateEl = document.getElementById('footerDate');
    const heroNameEl = document.getElementById('heroName');
    if (todayEl) todayEl.textContent = dateStr;
    if (footerDateEl) footerDateEl.textContent = 'Выпуск от ' + dateStr;
    if (heroNameEl) heroNameEl.textContent = 'к ' + CONFIG.GIRL_NAME;

    /* ---------- GATE STATE ---------- */
    const gate = document.getElementById('gate');
    const content = document.getElementById('content');
    const gatePassed = localStorage.getItem('nikol-gate-passed') === 'true';

    if (gatePassed) {
        if (gate) gate.classList.add('hidden');
        if (content) content.classList.add('visible');
        document.body.classList.remove('locked');
    } else {
        document.body.classList.add('locked');
    }

    /* ---------- HERO QUOTE ---------- */
    const heroQuoteEl = document.getElementById('heroQuote');
    if (heroQuoteEl) heroQuoteEl.innerHTML = renderQuote(CONFIG.QUOTES.hero);

    /* ---------- RENDER ALL SECTIONS ---------- */
    renderMeeting();
    renderTimeline();
    renderGallery();
    renderSeparateGallery();
    renderNicknames();
    renderMoments();
    renderBioFacts();
    renderPoem();
    renderWheel();
    renderCompliment();
    renderLetter();
    renderSecret();
    renderFuture();

    /* ---------- COUNTER ---------- */
    updateCounter();
    setInterval(updateCounter, 1000);

    /* ---------- REVEAL & TYPEWRITER ---------- */
    if (gatePassed) {
        revealOnScroll();
        setTimeout(startTypewriter, 800);
    }

    /* ---------- PROGRESS & TO TOP ---------- */
    const progress = document.getElementById('progressBar');
    const toTop = document.getElementById('toTop');

    if (progress && toTop) {
        window.addEventListener('scroll', () => {
            const st = window.scrollY;
            const h = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.width = (h > 0 ? (st / h) * 100 : 0) + '%';
            toTop.classList.toggle('visible', st > 500);
        }, { passive: true });

        toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ---------- WINDOW LOAD ---------- */
    window.addEventListener('load', () => {
        if (gatePassed && content) {
            content.classList.add('visible');
            document.body.classList.remove('locked');
        }
    });
})();