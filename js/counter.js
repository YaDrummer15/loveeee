let prevSec = null;

function updateCounter() {
    const now = new Date();
    const start = CONFIG.START_DATE;
    if (now < start) return;
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
    let hours = now.getHours() - start.getHours();
    let minutes = now.getMinutes() - start.getMinutes();
    let seconds = now.getSeconds() - start.getSeconds();
    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) { const dim = new Date(now.getFullYear(), now.getMonth(), 0).getDate(); days += dim; months--; }
    if (months < 0) { months += 12; years--; }

    const yEl = document.getElementById('years');
    const moEl = document.getElementById('months');
    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const miEl = document.getElementById('minutes');
    const secEl = document.getElementById('seconds');
    if (!yEl) return;

    yEl.textContent = years;
    moEl.textContent = months;
    dEl.textContent = days;
    hEl.textContent = String(hours).padStart(2, '0');
    miEl.textContent = String(minutes).padStart(2, '0');
    secEl.textContent = String(seconds).padStart(2, '0');

    if (prevSec !== null && prevSec !== seconds) {
        secEl.classList.remove('tick');
        void secEl.offsetWidth;
        secEl.classList.add('tick');
    }
    prevSec = seconds;
}