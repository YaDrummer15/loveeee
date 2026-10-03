/* СЕКРЕТНОЕ */
(function(){
  const heart = document.getElementById('secretHeart');
  const secretPage = document.getElementById('secretPage');
  const secretClose = document.getElementById('secretClose');
  let clicks = 0, timer;
  heart.addEventListener('click', () => {
    clicks++;
    clearTimeout(timer);
    timer = setTimeout(() => { clicks = 0; }, 900);
    if (clicks >= 3){
      clicks = 0;
      secretPage.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
  function close(){
    secretPage.classList.remove('open');
    document.body.style.overflow = '';
  }
  secretClose.addEventListener('click', close);
  secretPage.addEventListener('click', e => { if (e.target === secretPage) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && secretPage.classList.contains('open')) close();
  });
})();