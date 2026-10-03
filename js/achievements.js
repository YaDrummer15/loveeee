/* ACHIEVEMENTS */
(function(){
  const LIST = [
    { id:'start',    ico:'✦', name:'Первый шаг',         desc:'Открыл(а) эту историю' },
    { id:'ch1',      ico:'❖', name:'Знакомство',         desc:'Прочитал(а) главу первую' },
    { id:'ch2',      ico:'❖', name:'Хроника',            desc:'Прочитал(а) главу вторую' },
    { id:'ch3',      ico:'❖', name:'Фотограф',           desc:'Прочитал(а) главу третью' },
    { id:'letter',   ico:'✉', name:'Дошёл до письма',    desc:'Открыл(а) главу седьмую' },
    { id:'future',   ico:'⌛', name:'Взгляд в будущее',   desc:'Увидел(а) главу девятую' },
    { id:'lightbox', ico:'🔍', name:'Ближе к сердцу',    desc:'Открыл(а) фото в полном размере' },
    { id:'secret',   ico:'♥', name:'Хранитель секретов', desc:'Нашёл(а) секретную страницу' }
  ];

  const STORAGE_KEY = 'nikol_achievements_v1';
  let unlocked = new Set();

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    unlocked = new Set(saved);
  } catch(e){}

  function save(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...unlocked])); } catch(e){}
  }

  const panel = document.getElementById('achPanel');
  const list = document.getElementById('achList');
  const countEl = document.getElementById('achCount');
  const openedEl = document.getElementById('achOpened');
  const totalEl = document.getElementById('achTotal');
  const toggle = document.getElementById('achToggle');
  const toast = document.getElementById('achToast');
  const toastName = document.getElementById('achToastName');

  if (!list) return;

  LIST.forEach(a => {
    const li = document.createElement('li');
    li.dataset.id = a.id;
    li.innerHTML = `
      <div class="ach-item-ico">${a.ico}</div>
      <div class="ach-item-body">
        <div class="ach-item-name">${a.name}</div>
        <div class="ach-item-desc">${a.desc}</div>
      </div>`;
    list.appendChild(li);
  });

  totalEl.textContent = LIST.length;

  function render(){
    list.querySelectorAll('li').forEach(li => {
      li.classList.toggle('unlocked', unlocked.has(li.dataset.id));
    });
    countEl.textContent = `${unlocked.size}/${LIST.length}`;
    openedEl.textContent = unlocked.size;
  }

  function unlock(id){
    if (unlocked.has(id)) return;
    unlocked.add(id);
    save();
    render();
    const meta = LIST.find(a => a.id === id);
    if (meta && toast){
      toastName.textContent = meta.name;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3800);
    }
  }

  toggle.addEventListener('click', () => panel.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!e.target.closest('.achievements')) panel.classList.remove('open');
  });

  render();

  window.addEventListener('load', () => {
    setTimeout(() => unlock('start'), 2500);
  });

  const chapters = {
    ch1: 'ch1',
    ch2: 'ch2',
    ch3: 'ch3',
    ch7: 'letter',
    ch9: 'future'
  };
  Object.keys(chapters).forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting){
          unlock(chapters[id]);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });
    obs.observe(sec);
  });

  document.addEventListener('click', e => {
    if (e.target.closest('.photo.zoomable') || e.target.closest('.car-slide.zoomable')){
      unlock('lightbox');
    }
  });

  const secret = document.getElementById('secretPage');
  if (secret){
    const obs = new MutationObserver(() => {
      if (secret.classList.contains('open')) unlock('secret');
    });
    obs.observe(secret, { attributes:true, attributeFilter:['class'] });
  }

  window.NikolAchievements = { unlock, list: LIST };
})();