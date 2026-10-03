/* ПЫЛЬ, СЕРДЕЧКИ, КУРСОР */
(function(){
  const dust = document.getElementById('dust');
  for (let i = 0; i < 46; i++){
    const s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.bottom = '-10px';
    s.style.animationDuration = (12 + Math.random() * 16) + 's';
    s.style.animationDelay = (Math.random() * 12) + 's';
    s.style.opacity = 0.3 + Math.random() * 0.6;
    const size = 1 + Math.random() * 2.5;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    dust.appendChild(s);
  }
  const hearts = document.getElementById('hearts');
  for (let i = 0; i < 12; i++){
    const h = document.createElement('span');
    h.textContent = '♥';
    h.style.left = Math.random() * 100 + '%';
    h.style.bottom = '-30px';
    h.style.fontSize = (8 + Math.random() * 10) + 'px';
    h.style.animationDuration = (18 + Math.random() * 18) + 's';
    h.style.animationDelay = (Math.random() * 20) + 's';
    hearts.appendChild(h);
  }
  const glow = document.getElementById('cursorGlow');
  let gx = window.innerWidth/2, gy = window.innerHeight/2;
  let tx = gx, ty = gy;
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  function animGlow(){
    gx += (tx - gx) * 0.14;
    gy += (ty - gy) * 0.14;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(animGlow);
  }
  animGlow();
})();