/* REVEAL */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting){
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.reveal, .chapter, .chapter-divider, .quote-section').forEach(el => io.observe(el));

const io2 = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting){
      e.target.classList.add('visible');
      io2.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.event').forEach(el => io2.observe(el));

/* ПРОГРЕСС ЧТЕНИЯ */
(function(){
  const bar = document.getElementById('readProgress');
  function update(){
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = 'scaleX(' + p + ')';
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
})();

/* ПАРАЛЛАКС ФОНА */
(function(){
  const bg = document.querySelector('.bg-layer');
  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 20;
    my = (e.clientY / window.innerHeight - 0.5) * 20;
  });
  function loop(){
    cx += (mx - cx) * 0.05;
    cy += (my - cy) * 0.05;
    bg.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    requestAnimationFrame(loop);
  }
  loop();
})();

/* АКТИВНАЯ ГЛАВА В ИНДИКАТОРЕ (scroll-snap dots) */
(function(){
  const dots = document.querySelectorAll('.chapter-nav a');
  if (!dots.length) return;
  const sections = [...dots].map(d => document.querySelector(d.getAttribute('href'))).filter(Boolean);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        dots.forEach(d => d.classList.remove('active'));
        const idx = sections.indexOf(e.target);
        if (idx !== -1) dots[idx].classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();