/* TYPEWRITER — посимвольное появление текста в письмах
   - Печатается только когда письмо в зоне видимости
   - Если письмо ушло из зоны видимости — печать ставится на паузу
   - Если письмо уже напечаталось — текст остаётся как есть, не перезапускается
*/
(function(){
  const SPEED = 22;           // мс на символ (базовая)
  const START_DELAY = 350;    // задержка перед началом
  const PAUSE_CHARS = ['.', ',', '!', '?', '—', '…', ':', ';'];

  // Хранилище состояния для каждого письма
  const states = new WeakMap();

  function createState(el){
    return {
      fullText: el.dataset.fullText || el.textContent,
      index: 0,
      done: false,
      timerId: null,
      el
    };
  }

  function applyText(state){
    // Показываем только часть текста до текущего индекса
    state.el.textContent = state.fullText.slice(0, state.index);
  }

  function step(state){
    if (state.done) return;
    if (state.index >= state.fullText.length){
      state.done = true;
      state.el.classList.remove('typing');
      state.el.classList.add('typed');
      state.el.textContent = state.fullText;
      return;
    }
    state.index++;
    applyText(state);

    // Паузы после знаков препинания — для естественности
    const ch = state.fullText.charAt(state.index - 1);
    let delay = SPEED + (Math.random() * 14 - 4);
    if (PAUSE_CHARS.includes(ch)) delay += 180;
    if (ch === '.' || ch === '!' || ch === '?') delay += 120;

    state.timerId = setTimeout(() => step(state), delay);
  }

  function startTyping(state){
    if (state.done) return;
    if (state.timerId) return; // уже печатается
    if (state.el.classList.contains('typing') === false){
      state.el.classList.add('typing');
    }
    // Небольшая задержка перед стартом именно этого абзаца
    state.timerId = setTimeout(() => step(state), state.index === 0 ? START_DELAY : 80);
  }

  function pauseTyping(state){
    if (state.timerId){
      clearTimeout(state.timerId);
      state.timerId = null;
    }
  }

  function processLetter(letter){
    if (letter.dataset.twInit === '1') return;
    letter.dataset.twInit = '1';

    const paras = letter.querySelectorAll('p');
    const paraStates = [];

    paras.forEach(p => {
      // Сохраняем полный текст и СРАЗУ очищаем — чтобы не мигало
      if (!p.dataset.fullText){
        p.dataset.fullText = p.textContent.trim();
      }
      // Очищаем содержимое — абзац будет полностью пуст до начала печати
      p.textContent = '';
      p.classList.add('tw-pending');

      const st = createState(p);
      st.fullText = p.dataset.fullText;
      st.el = p;
      paraStates.push(st);
      states.set(p, st);
    });

    // Последовательно печатаем абзацы: следующий стартует после завершения предыдущего
    let currentIdx = 0;

    function watchCurrent(){
      if (currentIdx >= paraStates.length){
        // Все абзацы готовы — проявим подпись и печать
        const sign = letter.querySelector('.sign');
        const seal = letter.querySelector('.seal');
        if (sign) sign.classList.add('visible');
        if (seal) seal.classList.add('visible');
        return;
      }
      const st = paraStates[currentIdx];
      st.el.classList.remove('tw-pending');

      // Если абзац уже готов (на случай повторного наблюдения)
      if (st.done){
        currentIdx++;
        watchCurrent();
        return;
      }

      // Запускаем печать
      startTyping(st);

      // Проверяем завершение
      const check = setInterval(() => {
        if (st.done){
          clearInterval(check);
          currentIdx++;
          watchCurrent();
        }
      }, 120);
    }

    // Запускаем всю цепочку при появлении письма в поле зрения
    const letterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const st = states.get(e.target);
        if (!st) return;

        if (e.isIntersecting){
          // Если абзац ещё печатается или не начинался — продолжить
          if (!st.done) startTyping(st);
        } else {
          // Ушёл из зоны видимости — пауза
          pauseTyping(st);
        }
      });
    }, { threshold: 0.15 });

    paraStates.forEach(st => letterObs.observe(st.el));

    // Запускаем только первый абзац, остальные — по цепочке
    const firstObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting){
          // Небольшая задержка — чтобы DOM успел отрисоваться
          setTimeout(watchCurrent, 100);
          obs.disconnect();
        }
      });
    }, { threshold: 0.25 });
    firstObs.observe(letter);
  }

  // Инициализация при загрузке
  function init(){
    document.querySelectorAll('.letter').forEach(processLetter);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();