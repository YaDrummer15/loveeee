(function () {
    'use strict';

    const gate = document.getElementById('gate');
    const gateInput = document.getElementById('gateInput');
    const gateBtn = document.getElementById('gateBtn');
    const gateError = document.getElementById('gateError');
    const content = document.getElementById('content');

    if (!gate) return;

    const gatePassed = localStorage.getItem('nikol-gate-passed') === 'true';

    function tryGate() {
        const val = gateInput.value.trim().toLowerCase().replace(/\s+/g, '');
        if (val === CONFIG.PASSWORD) {
            localStorage.setItem('nikol-gate-passed', 'true');
            gate.classList.add('hidden');
            content.classList.add('visible');
            document.body.classList.remove('locked');
            window.scrollTo({ top: 0 });
            setTimeout(revealOnScroll, 200);
            setTimeout(startTypewriter, 800);
        } else {
            gateInput.classList.add('error');
            gateError.classList.add('show');
            setTimeout(() => gateInput.classList.remove('error'), 500);
        }
    }

    gateBtn.addEventListener('click', tryGate);
    gateInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryGate(); });
    gateInput.addEventListener('input', () => {
        gateInput.classList.remove('error');
        gateError.classList.remove('show');
    });

    window.gatePassed = gatePassed;
})();