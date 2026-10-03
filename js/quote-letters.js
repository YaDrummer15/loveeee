/* ПЛАВНОЕ ПОЯВЛЕНИЕ БУКВ В ЦИТАТАХ */
(function(){
  function splitLetters(el){
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const text = el.textContent;
    el.textContent = '';
    const frag = document.createDocumentFragment();
    let letterIndex = 0;
    for (let i = 0; i < text.length; i++){
      const ch = text.charAt(i);
      if (ch === ' '){
        frag.appendChild(document.createTextNode(' '));
        continue;
      }
      const span = document.createElement('span');
      span.className = 'ql-letter';
      span.textContent = ch;
      span.style.transitionDelay = (letterIndex * 0.028) + 's';
      frag.appendChild(span);
      letterIndex++;
    }
    el.appendChild(frag);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        splitLetters(e.target);
        requestAnimationFrame(() => e.target.classList.add('visible'));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.quote-text').forEach(q => io.observe(q));
})();