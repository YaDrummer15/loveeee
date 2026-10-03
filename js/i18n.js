/* i18n RU / EN */
(function(){
  const dict = {
    ru: {
      'brand': 'Николь <em>· journal</em>',
      'nav.ch1': 'Знакомство',
      'nav.ch2': 'Моменты',
      'nav.ch3': 'Фотографии',
      'nav.ch4': 'Её взгляд',
      'nav.ch7': 'Письмо',
      'nav.ch9': 'Будущее',
      'music.label': 'Музыка',
      'hero.kicker': 'Официальный сайт · создан для Николь',
      'hero.title1': 'История',
      'hero.title2': 'моих',
      'hero.title3': 'чувств',
      'hero.title4': 'к',
      'hero.title5': '<em>Николь</em>',
      'hero.sub': 'Кинематографичная хроника одного сердца — от первого взгляда до бесконечности.',
      'hero.official': 'Приватный архив · только для неё',
      'lock.title': 'Эта история заперта',
      'lock.sub': 'Введите пароль, чтобы открыть',
      'lock.btn': 'Открыть',
      'lock.error': 'Неверный пароль. Попробуй ещё раз.',
      'lock.hint': 'Подсказка: как ты меня называешь',
      'timer.label': 'Мы в дружбе с 4 февраля 2026',
      'timer.years': 'лет',
      'timer.months': 'месяцев',
      'timer.days': 'дней',
      'timer.hours': 'часов',
      'timer.minutes': 'минут',
      'timer.seconds': 'секунд',
      'footer.l1': 'Официальный сайт · создан для Николь',
      'footer.l2': 'Твой Бублик · навсегда',
      'footer.hint': 'нажми на сердце три раза'
    },
    en: {
      'brand': 'Nicole <em>· journal</em>',
      'nav.ch1': 'Meeting',
      'nav.ch2': 'Moments',
      'nav.ch3': 'Photos',
      'nav.ch4': 'Her View',
      'nav.ch7': 'Letter',
      'nav.ch9': 'Future',
      'music.label': 'Music',
      'hero.kicker': 'Official site · made for Nicole',
      'hero.title1': 'The Story',
      'hero.title2': 'of my',
      'hero.title3': 'feelings',
      'hero.title4': 'for',
      'hero.title5': '<em>Nicole</em>',
      'hero.sub': 'A cinematic chronicle of one heart — from first glance to infinity.',
      'hero.official': 'Private archive · for her eyes only',
      'lock.title': 'This story is locked',
      'lock.sub': 'Enter the password to open',
      'lock.btn': 'Open',
      'lock.error': 'Wrong password. Try again.',
      'lock.hint': 'Hint: what you call me',
      'timer.label': 'We have been friends since February 4, 2026',
      'timer.years': 'years',
      'timer.months': 'months',
      'timer.days': 'days',
      'timer.hours': 'hours',
      'timer.minutes': 'minutes',
      'timer.seconds': 'seconds',
      'footer.l1': 'Official site · made for Nicole',
      'footer.l2': 'Your Bun · forever',
      'footer.hint': 'tap the heart three times'
    }
  };

  const STORAGE_KEY = 'nikol_lang';
  let lang = localStorage.getItem(STORAGE_KEY) || 'ru';

  function apply(l){
    lang = l;
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = dict[l][key];
      if (val !== undefined) el.innerHTML = val;
    });

    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch){
      langSwitch.querySelectorAll('button').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === l);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    apply(lang);
    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch){
      langSwitch.querySelectorAll('button').forEach(b => {
        b.addEventListener('click', () => apply(b.dataset.lang));
      });
    }
  });

  window.NikolI18n = { apply, get lang(){ return lang; } };
})();