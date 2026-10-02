(function () {
    'use strict';

    let lbEl, lbImgEl, lbTitleEl, lbDateEl, lbCounterEl;
    let currentIndex = 0;
    let currentSource = 'main';

    function init() {
        lbEl = document.getElementById('lightbox');
        lbImgEl = document.getElementById('lbImg');
        lbTitleEl = document.getElementById('lbTitle');
        lbDateEl = document.getElementById('lbDate');
        lbCounterEl = document.getElementById('lbCounter');

        if (!lbEl) {
            console.error('[Lightbox] #lightbox not found');
            return;
        }

        const closeBtn = document.getElementById('lbClose');
        const prevBtn = document.getElementById('lbPrev');
        const nextBtn = document.getElementById('lbNext');

        if (closeBtn) closeBtn.addEventListener('click', function (e) { e.stopPropagation(); close(); });
        if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
        if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); next(); });

        lbEl.addEventListener('click', function (e) {
            if (e.target === lbEl) close();
        });

        document.addEventListener('keydown', function (e) {
            if (!lbEl.classList.contains('open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        });

        let tX = 0, tY = 0;
        lbEl.addEventListener('touchstart', function (e) {
            tX = e.changedTouches[0].screenX;
            tY = e.changedTouches[0].screenY;
        }, { passive: true });

        lbEl.addEventListener('touchend', function (e) {
            const dx = e.changedTouches[0].screenX - tX;
            const dy = e.changedTouches[0].screenY - tY;
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
                if (dx < 0) next(); else prev();
            }
        }, { passive: true });
    }

    function getItems(source) {
        if (typeof CONFIG === 'undefined') return [];
        if (source === 'separate') {
            return (CONFIG.SEPARATE_GALLERY && CONFIG.SEPARATE_GALLERY.items) || [];
        }
        return (CONFIG.GALLERY && CONFIG.GALLERY.items) || [];
    }

    function open(index, source) {
        if (!lbEl) init();
        source = source || 'main';
        const items = getItems(source);
        if (!items.length) return;

        currentIndex = Math.max(0, Math.min(index || 0, items.length - 1));
        currentSource = source;

        render();
        lbEl.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        if (!lbEl) return;
        lbEl.classList.remove('open');
        document.body.style.overflow = '';
    }

    function render() {
        const items = getItems(currentSource);
        const item = items[currentIndex];
        if (!item) return;

        if (item.src) {
            lbImgEl.src = item.src;
            lbImgEl.alt = item.label || '';
            lbImgEl.style.display = '';
        } else {
            lbImgEl.style.display = 'none';
        }
        lbTitleEl.textContent = item.label || '';
        lbDateEl.textContent = item.date || '';
        lbCounterEl.textContent = (currentIndex + 1) + ' / ' + items.length;
    }

    function next() {
        const items = getItems(currentSource);
        if (!items.length) return;
        currentIndex = (currentIndex + 1) % items.length;
        render();
    }

    function prev() {
        const items = getItems(currentSource);
        if (!items.length) return;
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.openLightbox = open;
    window.closeLightbox = close;
    window.nextLightbox = next;
    window.prevLightbox = prev;
})();