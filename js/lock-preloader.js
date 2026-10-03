/* ЭКРАН БЛОКИРОВКИ + ПРЕЛОАДЕР С ДЕТАЛЬНЫМ КОНВЕРТОМ */
(function(){
  const PASSWORD = 'Бублик';
  const lockScreen = document.getElementById('lockScreen');
  const lockBox = document.getElementById('lockBox');
  const lockInput = document.getElementById('lockInput');
  const lockBtn = document.getElementById('lockBtn');
  const lockError = document.getElementById('lockError');
  const preloader = document.getElementById('preloader');
  const envelope = document.getElementById('envelope');
  const promptText = document.getElementById('promptText');
  const flash = document.getElementById('flash');

  function tryUnlock(){
    const val = lockInput.value.trim().toLowerCase();
    if (val === PASSWORD.toLowerCase()){
      lockError.classList.remove('show');
      lockBox.classList.add('unlocked');
      setTimeout(() => { lockScreen.classList.add('hidden'); }, 500);
      setTimeout(() => { preloader.classList.add('active'); }, 1000);
    } else {
      lockBox.classList.add('shake');
      lockError.classList.add('show');
      setTimeout(() => lockBox.classList.remove('shake'), 500);
      lockInput.value = '';
    }
  }
  lockBtn.addEventListener('click', tryUnlock);
  lockInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });

  envelope.addEventListener('click', () => {
    promptText.classList.add('hide');
    envelope.classList.add('opening');
    spawnHearts();
    setTimeout(() => { flash.classList.add('fire'); }, 900);
    setTimeout(() => {
      preloader.classList.remove('active');
      document.body.classList.remove('locked');
      setTimeout(() => { flash.classList.remove('fire'); }, 400);
      setTimeout(() => {
        const musicBtn = document.getElementById('musicBtn');
        if (musicBtn && musicBtn.classList.contains('paused')) musicBtn.click();
      }, 800);
    }, 1900);
  });

  function spawnHearts(){
    const rect = envelope.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const count = 24;
    for (let i = 0; i < count; i++){
      const heart = document.createElement('span');
      heart.className = 'fly-heart';
      heart.textContent = Math.random() > 0.5 ? '♥' : '♡';

      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const distance = 180 + Math.random() * 220;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 80 - Math.random() * 100;

      heart.style.left = cx + 'px';
      heart.style.top = cy + 'px';
      heart.style.setProperty('--tx', tx + 'px');
      heart.style.setProperty('--ty', ty + 'px');
      heart.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      heart.style.setProperty('--dur', (1.4 + Math.random() * 1.2) + 's');
      heart.style.setProperty('--delay', (Math.random() * 0.25) + 's');
      heart.style.fontSize = (12 + Math.random() * 18) + 'px';

      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 3000);
    }
  }
})();