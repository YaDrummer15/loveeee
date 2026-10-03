/* LIGHTBOX */
(function(){
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  document.querySelectorAll('.photo.zoomable, .car-slide.zoomable').forEach(fig => {
    fig.addEventListener('click', () => {
      const img = fig.querySelector('img');
      const full = fig.getAttribute('data-full') || (img ? img.src : '');
      const cap = fig.querySelector('.cap');
      if (!full) return;
      lbImg.src = full;
      lbImg.alt = img ? img.alt : '';
      lbCap.textContent = cap ? cap.textContent : '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  function close(){
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 500);
  }
  lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) close();
  });
})();