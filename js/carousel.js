/* CAROUSEL */
(function(){
  document.querySelectorAll('.carousel').forEach(car => {
    const track = car.querySelector('.car-track');
    const slides = car.querySelectorAll('.car-slide');
    const prev = car.querySelector('.car-btn.prev');
    const next = car.querySelector('.car-btn.next');
    const dotsBox = car.querySelector('.car-dots');
    const autoplayMs = parseInt(car.dataset.autoplay, 10) || 0;
    let idx = 0;
    let timer = null;
    let startX = 0, deltaX = 0, dragging = false;

    slides.forEach((_, i) => {
      const d = document.createElement('span');
      if (i === 0) d.classList.add('active');
      d.addEventListener('click', () => go(i));
      dotsBox.appendChild(d);
    });
    const dots = dotsBox.querySelectorAll('span');

    function go(n){
      idx = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    function nextSlide(){ go(idx + 1); }
    function prevSlide(){ go(idx - 1); }

    next.addEventListener('click', () => { nextSlide(); restart(); });
    prev.addEventListener('click', () => { prevSlide(); restart(); });

    function startAuto(){
      if (!autoplayMs) return;
      stopAuto();
      timer = setInterval(nextSlide, autoplayMs);
    }
    function stopAuto(){ if (timer) clearInterval(timer); timer = null; }
    function restart(){ stopAuto(); startAuto(); }

    car.addEventListener('mouseenter', stopAuto);
    car.addEventListener('mouseleave', startAuto);

    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX; deltaX = 0; dragging = true;
      stopAuto();
    }, {passive:true});
    track.addEventListener('touchmove', e => {
      if (!dragging) return;
      deltaX = e.touches[0].clientX - startX;
    }, {passive:true});
    track.addEventListener('touchend', () => {
      dragging = false;
      if (Math.abs(deltaX) > 50){
        if (deltaX < 0) nextSlide(); else prevSlide();
      }
      startAuto();
    });

    document.addEventListener('keydown', e => {
      if (!car.matches(':hover')) return;
      if (e.key === 'ArrowRight') { nextSlide(); restart(); }
      if (e.key === 'ArrowLeft')  { prevSlide(); restart(); }
    });

    startAuto();
  });
})();