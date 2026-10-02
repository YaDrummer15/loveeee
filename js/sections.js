function head(num, title, meta) {
    return `
        <div class="wrap">
            <div class="spread-head">
                <div class="spread-num">${num}</div>
                <div class="spread-title-block">
                    <h2 class="spread-title">${title}</h2>
                    <div class="spread-meta">${meta}</div>
                </div>
            </div>
        </div>
    `;
}

function renderQuote(q) {
    if (!q) return '';
    return `
        <div class="editorial-quote">
            <span class="q-mark">"</span>
            <p class="q-text">${q.text}</p>
            <div class="q-author">${q.author}</div>
        </div>
    `;
}

function mediaType(src) {
    if (!src) return 'none';
    return /\.(mp4|webm|ogg|mov|avi)(\?|$)/i.test(src) ? 'video' : 'image';
}

function mediaEl(src, alt = '') {
    const t = mediaType(src);
    if (t === 'none') return null;
    if (t === 'video') {
        const v = document.createElement('video');
        v.src = src; v.controls = true; v.playsInline = true; v.preload = 'metadata';
        return v;
    }
    const i = document.createElement('img');
    i.src = src; i.alt = alt; i.loading = 'lazy';
    return i;
}

function renderMeeting() {
    const m = CONFIG.MEETING;
    const el = document.getElementById('meetingSection');
    if (!el) return;
    el.innerHTML = head(m.num, m.title, m.meta) + `
        <div class="wrap">
            <div class="meeting">
                <div class="meeting-left">
                    <div class="meeting-figure">
                        <span class="meeting-figure-emoji">◆</span>
                        <div class="meeting-figure-title">${m.figureTitle}</div>
                        <div class="meeting-figure-text">${m.figureText}</div>
                    </div>
                    <div class="meeting-quote">${m.quote}</div>
                    ${renderQuote(CONFIG.QUOTES.meeting)}
                </div>
                <div class="meeting-right">
                    ${m.paragraphs.map(p => `<p>${p}</p>`).join('')}
                    <div class="meeting-media" id="meetingMedia">
                        <span class="corner corner-tr"></span>
                        <span class="corner corner-bl"></span>
                        <span class="corner corner-br"></span>
                    </div>
                </div>
            </div>
        </div>
    `;
    const c = el.querySelector('#meetingMedia');
    if (m.mediaSrc) {
        const media = mediaEl(m.mediaSrc, 'Первая встреча');
        if (media) c.appendChild(media);
    } else {
        const ph = document.createElement('div');
        ph.className = 'ph';
        ph.innerHTML = `<span class="ph-icon">◉</span>${m.mediaPlaceholder}`;
        c.appendChild(ph);
    }
}

function renderTimeline() {
    const t = CONFIG.TIMELINE;
    const el = document.getElementById('timelineSection');
    if (!el) return;
    el.innerHTML = head(t.num, t.title, t.meta) + `
        <div class="wrap">
            <div class="timeline-list">
                ${t.events.map(ev => `
                    <div class="tl-item">
                        <div class="tl-date">${ev.date}</div>
                        <div class="tl-body">
                            <div class="tl-event">${ev.event}</div>
                            <div class="tl-desc">${ev.desc}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ${renderQuote(CONFIG.QUOTES.timeline)}
        </div>
    `;
    el.querySelectorAll('.tl-item').forEach(it => it.addEventListener('click', e => sparkles(e.clientX, e.clientY)));
}

function renderGallery() {
    const g = CONFIG.GALLERY;
    const el = document.getElementById('gallerySection');
    if (!el) return;
    el.innerHTML = head(g.num, g.title, g.meta) + `
        <div class="wrap">
            <div class="gallery" id="galleryGrid"></div>
        </div>
    `;
    const grid = el.querySelector('#galleryGrid');
    g.items.forEach((item, index) => {
        const d = document.createElement('div');
        d.className = 'g-item';
        if (item.src) {
            const media = mediaEl(item.src, item.label);
            if (media) d.appendChild(media);
        } else {
            d.innerHTML = `<div class="g-placeholder"><span class="ph-icon">◉</span>${item.label}</div>`;
        }
        const lab = document.createElement('div');
        lab.className = 'g-label';
        lab.innerHTML = `
            <div class="g-label-title">${item.label}</div>
            ${item.date ? `<div class="g-label-date">${item.date}</div>` : ''}
        `;
        d.appendChild(lab);

        d.addEventListener('click', function () {
            if (item.src && typeof window.openLightbox === 'function') {
                window.openLightbox(index, 'main');
            }
            const rect = d.getBoundingClientRect();
            sparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });

        grid.appendChild(d);
    });
}

function renderSeparateGallery() {
    const g = CONFIG.SEPARATE_GALLERY;
    const el = document.getElementById('separateGallerySection');
    if (!el) return;
    el.innerHTML = head(g.num, g.title, g.meta) + `
        <div class="wrap">
            <p style="font-family: var(--serif); font-style: italic; font-size: 1.15rem; color: var(--text-2); max-width: 620px; margin-bottom: 2.5rem; line-height: 1.6;">${g.intro}</p>
            <div class="separate-gallery" id="separateGalleryGrid"></div>
            ${renderQuote(CONFIG.QUOTES.separate)}
        </div>
    `;
    const grid = el.querySelector('#separateGalleryGrid');
    g.items.forEach((item, index) => {
        const d = document.createElement('div');
        d.className = 'sg-item';
        if (item.src) {
            const media = mediaEl(item.src, item.label);
            if (media) d.appendChild(media);
        }
        const lab = document.createElement('div');
        lab.className = 'sg-label';
        lab.innerHTML = `
            <div class="sg-label-title">${item.label}</div>
            ${item.date ? `<div class="sg-label-date">${item.date}</div>` : ''}
        `;
        d.appendChild(lab);

        d.addEventListener('click', function () {
            if (item.src && typeof window.openLightbox === 'function') {
                window.openLightbox(index, 'separate');
            }
            const rect = d.getBoundingClientRect();
            sparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });

        grid.appendChild(d);
    });
}

function renderNicknames() {
    const n = CONFIG.NICKNAMES;
    const el = document.getElementById('nicknamesSection');
    if (!el) return;
    el.innerHTML = head(n.num, n.title, n.meta) + `
        <div class="wrap">
            <p style="font-family: var(--serif); font-style: italic; font-size: 1.1rem; color: var(--text-2); max-width: 620px; margin-bottom: 2rem;">${n.intro}</p>
            <div class="nicknames-grid" id="nnGrid"></div>
            ${renderQuote(CONFIG.QUOTES.nicknames)}
        </div>
    `;
    const grid = el.querySelector('#nnGrid');
    n.list.forEach(item => {
        const d = document.createElement('div');
        d.className = 'nn-item';
        d.innerHTML = `
            <span class="nn-emoji">${item.emoji}</span>
            <span class="nn-name">${item.name}</span>
            <span class="nn-hint">Touch</span>
        `;
        d.addEventListener('click', e => {
            const p = document.createElement('div');
            p.className = 'popup-note';
            p.textContent = item.msg;
            p.style.left = e.clientX + 'px';
            p.style.top = (e.clientY - 20) + 'px';
            p.style.transform = 'translate(-50%, -100%)';
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 2100);
            sparkles(e.clientX, e.clientY);
        });
        grid.appendChild(d);
    });
}

function renderMoments() {
    const m = CONFIG.MOMENTS;
    const el = document.getElementById('momentsSection');
    if (!el) return;
    el.innerHTML = head(m.num, m.title, m.meta) + `
        <div class="wrap">
            <div class="moments">
                ${m.list.map((item, i) => `
                    <div class="m-item">
                        <div class="m-num">${String(i + 1).padStart(2, '0')} / 10</div>
                        <div class="m-title">${item.title}</div>
                        <div class="m-text">${item.text}</div>
                    </div>
                `).join('')}
            </div>
            ${renderQuote(CONFIG.QUOTES.moments)}
        </div>
    `;
    el.querySelectorAll('.m-item').forEach(it => it.addEventListener('click', e => sparkles(e.clientX, e.clientY)));
}

function renderBioFacts() {
    const b = CONFIG.BIO_FACTS;
    const el = document.getElementById('bioFactsSection');
    if (!el) return;
    el.innerHTML = head(b.num, b.title, b.meta) + `
        <div class="wrap">
            <p style="font-family: var(--serif); font-style: italic; font-size: 1.15rem; color: var(--text-2); max-width: 640px; margin-bottom: 2.5rem; line-height: 1.6;">${b.intro}</p>
            <div class="bio-facts">
                ${b.facts.map(f => `
                    <div class="bio-fact">
                        <div class="bio-fact-num">FACT · ${f.num}</div>
                        <span class="bio-fact-icon">${f.icon}</span>
                        <div class="bio-fact-title">${f.title}</div>
                        <p class="bio-fact-text">${f.text}</p>
                    </div>
                `).join('')}
            </div>
            ${renderQuote(CONFIG.QUOTES.bioFacts)}
        </div>
    `;
    el.querySelectorAll('.bio-fact').forEach(it => it.addEventListener('click', e => sparkles(e.clientX, e.clientY)));
}

function renderPoem() {
    const p = CONFIG.POEM;
    const el = document.getElementById('poemSection');
    if (!el) return;
    el.innerHTML = head(p.num, p.title, p.meta) + `
        <div class="wrap">
            <div class="poem">
                ${p.verses.map(v => `<p>${v}</p>`).join('')}
                <div class="poem-mark">${p.mark}</div>
            </div>
        </div>
    `;
}

function renderWheel() {
    const w = CONFIG.WHEEL;
    const el = document.getElementById('wheelSection');
    if (!el) return;
    el.innerHTML = head(w.num, w.title, w.meta) + `
        <div class="wrap">
            <div class="wheel-wrap">
                <div class="wheel-display" id="wheelDisplay">
                    <div class="wheel-emoji" id="wheelEmoji">❋</div>
                    <div class="wheel-text" id="wheelText">Нажми на кнопку — и я скажу тебе, что чувствую прямо сейчас</div>
                </div>
                <button class="wheel-btn" id="wheelBtn">Крутить рулетку</button>
            </div>
        </div>
    `;
    initWheel();
}

function renderCompliment() {
    const c = CONFIG.COMPLIMENT;
    const el = document.getElementById('complimentSection');
    if (!el) return;
    el.innerHTML = head(c.num, c.title, c.meta) + `
        <div class="wrap">
            <div class="compliment-wrap">
                <p class="compliment-intro">${c.intro}</p>
                <div class="compliment-display" id="complimentDisplay">Здесь появятся тёплые слова…</div>
                <button class="compliment-btn" id="complimentBtn">Сказать комплимент</button>
                <div class="compliment-counter">Признаний: <strong id="complimentCount">0</strong></div>
            </div>
        </div>
    `;
    initCompliment();
}

function renderLetter() {
    const l = CONFIG.LETTER;
    const el = document.getElementById('letterSection');
    if (!el) return;
    el.innerHTML = head(l.num, l.title, l.meta) + `
        <div class="wrap">
            ${renderQuote(CONFIG.QUOTES.letter)}
            <div class="letter-block" id="letterBlock">
                <div class="envelope" id="envelope">
                    <span class="env-label">${l.envLabel}</span>
                    <div class="env-title">${l.envTitle}</div>
                    <span class="env-hint">${l.envHint}</span>
                    <span class="env-seal">${CONFIG.INITIAL}</span>
                </div>
                <div class="letter-open">
                    <div class="paper">
                        <button class="paper-close" id="paperClose">✕</button>
                        <div class="paper-meta">
                            <span>${l.metaPlace}</span>
                            <span>${l.metaDate}</span>
                        </div>
                        <div class="paper-greeting">${l.greeting}</div>
                        <div class="paper-body">
                            ${l.paragraphs.map(p => `<p>${p}</p>`).join('')}
                        </div>
                        <div class="paper-close-line">${l.closing}</div>
                        <div class="paper-sign">${l.signature}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    initLetter();
}

function renderSecret() {
    const s = CONFIG.SECRET;
    const el = document.getElementById('secretSection');
    if (!el) return;
    el.innerHTML = head(s.num, s.title, s.meta) + `
        <div class="wrap">
            <div class="secret-head" id="secretHead">
                <span class="secret-head-text">${s.toggleText}</span>
                <span class="secret-head-icon"><span>Открыть</span><span class="arrow">▼</span></span>
            </div>
            <div class="secret-body" id="secretBody">
                <div class="paper">
                    <div class="paper-meta">
                        <span>${s.metaPlace}</span>
                        <span>${s.metaDate}</span>
                    </div>
                    <div class="paper-greeting">${s.greeting}</div>
                    <div class="paper-body">
                        ${s.paragraphs.map(p => `<p>${p}</p>`).join('')}
                    </div>
                    <div class="paper-close-line">${s.closing}</div>
                    <div class="paper-sign">${s.signature}</div>
                </div>
            </div>
        </div>
    `;
    const h = document.getElementById('secretHead');
    const b = document.getElementById('secretBody');
    h.addEventListener('click', () => {
        h.classList.toggle('open');
        b.classList.toggle('open');
        h.querySelector('.secret-head-icon span').textContent = b.classList.contains('open') ? 'Закрыть' : 'Открыть';
    });
}

function renderFuture() {
    const f = CONFIG.FUTURE;
    const el = document.getElementById('futureSection');
    if (!el) return;
    el.innerHTML = head(f.num, f.title, f.meta) + `
        <div class="wrap">
            <div class="future-wrap">
                <div class="future-badge">◷ Откроется ${CONFIG.FUTURE_DATE_DISPLAY}</div>
                <div class="future-locked" id="futureLocked">
                    <div class="lock-symbol">◈</div>
                    <div class="countdown" id="futureCountdown">Загрузка…</div>
                    <div class="future-buttons">
                        <button class="future-btn" id="futureTry">Попробовать открыть</button>
                    </div>
                    <div class="code-row">
                        <input type="text" class="code-input" id="futureCode" placeholder="Секретный код">
                        <button class="future-btn" id="futureSubmit">Открыть</button>
                    </div>
                </div>
                <div class="future-open" id="futureOpen">
                    <div class="paper">
                        <div class="paper-meta">
                            <span>${f.metaPlace}</span>
                            <span>${CONFIG.FUTURE_DATE_DISPLAY}</span>
                        </div>
                        <div class="paper-greeting">${f.greeting}</div>
                        <div class="paper-body">
                            ${f.paragraphs.map(p => `<p>${p}</p>`).join('')}
                        </div>
                        <div class="paper-close-line">${f.closing}</div>
                        <div class="paper-sign">${f.signature}</div>
                    </div>
                </div>
                ${renderQuote(CONFIG.QUOTES.future)}
            </div>
        </div>
    `;
    initFuture();
}

function initLetter() {
    const block = document.getElementById('letterBlock');
    const env = document.getElementById('envelope');
    const close = document.getElementById('paperClose');
    if (!block || !env) return;

    env.addEventListener('click', () => {
        block.classList.add('open');
        setTimeout(() => block.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    });
    close.addEventListener('click', () => {
        block.classList.remove('open');
        setTimeout(() => block.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
    });
}

function initFuture() {
    const locked = document.getElementById('futureLocked');
    const open = document.getElementById('futureOpen');
    const cd = document.getElementById('futureCountdown');
    const tryBtn = document.getElementById('futureTry');
    const codeIn = document.getElementById('futureCode');
    const submit = document.getElementById('futureSubmit');
    if (!locked) return;

    if (localStorage.getItem('nikol-future-open') === 'true') {
        locked.style.display = 'none';
        open.classList.add('visible');
    }

    function tick() {
        const now = new Date();
        const target = CONFIG.FUTURE_DATE;
        if (now >= target) { cd.innerHTML = 'Письмо можно открыть'; return; }
        const diff = target - now;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        cd.innerHTML = `Осталось <span>${d}</span> дней <span>${h}</span> часов <span>${m}</span> минут <span>${s}</span> секунд`;
    }
    tick();
    setInterval(tick, 1000);

    function openIt() {
        localStorage.setItem('nikol-future-open', 'true');
        locked.style.display = 'none';
        open.classList.add('visible');
        setTimeout(() => open.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }

    tryBtn.addEventListener('click', () => {
        if (new Date() >= CONFIG.FUTURE_DATE) openIt();
        else {
            cd.style.transform = 'scale(1.05)';
            cd.style.color = 'var(--accent-2)';
            setTimeout(() => { cd.style.transform = 'scale(1)'; cd.style.color = ''; }, 400);
        }
    });

    submit.addEventListener('click', () => {
        const c = codeIn.value.trim().toLowerCase();
        if (c === CONFIG.FUTURE_CODE) openIt();
        else {
            codeIn.classList.add('error');
            codeIn.value = '';
            codeIn.placeholder = 'Неверный код';
            setTimeout(() => {
                codeIn.classList.remove('error');
                codeIn.placeholder = 'Секретный код';
            }, 1500);
        }
    });
    codeIn.addEventListener('keydown', e => { if (e.key === 'Enter') submit.click(); });
}

function initWheel() {
    const display = document.getElementById('wheelDisplay');
    const emoji = document.getElementById('wheelEmoji');
    const text = document.getElementById('wheelText');
    const btn = document.getElementById('wheelBtn');
    if (!btn) return;
    let spinning = false;

    btn.addEventListener('click', () => {
        if (spinning) return;
        spinning = true;
        btn.disabled = true;
        display.classList.add('spinning', 'active');

        let count = 0;
        const total = 14;
        const interval = setInterval(() => {
            const r = CONFIG.WHEEL.moments[Math.floor(Math.random() * CONFIG.WHEEL.moments.length)];
            emoji.textContent = r.emoji;
            count++;
            if (count >= total) {
                clearInterval(interval);
                display.classList.remove('spinning');
                const final = CONFIG.WHEEL.moments[Math.floor(Math.random() * CONFIG.WHEEL.moments.length)];
                emoji.textContent = final.emoji;
                text.textContent = final.text;
                const rect = display.getBoundingClientRect();
                sparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
                spinning = false;
                btn.disabled = false;
            }
        }, 100);
    });
}

function initCompliment() {
    const btn = document.getElementById('complimentBtn');
    const display = document.getElementById('complimentDisplay');
    const counter = document.getElementById('complimentCount');
    if (!btn) return;
    let count = parseInt(localStorage.getItem('nikol-compliment-count') || '0', 10);
    counter.textContent = count;

    btn.addEventListener('click', e => {
        const c = CONFIG.COMPLIMENT.list[Math.floor(Math.random() * CONFIG.COMPLIMENT.list.length)];
        display.style.opacity = '0';
        display.style.transform = 'translateY(8px)';
        setTimeout(() => {
            display.textContent = c;
            display.style.opacity = '1';
            display.style.transform = 'translateY(0)';
        }, 220);
        count++;
        counter.textContent = count;
        localStorage.setItem('nikol-compliment-count', count);
        sparkles(e.clientX, e.clientY);
    });
}