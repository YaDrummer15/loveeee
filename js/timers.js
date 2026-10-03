/* ТАЙМЕР */
const START = new Date(2026, 1, 4, 0, 0, 0);
function pad(n){ return n < 10 ? '0' + n : '' + n; }
function diffYMDHMS(from, to){
  let y = to.getFullYear() - from.getFullYear();
  let mo = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  let h = to.getHours() - from.getHours();
  let mi = to.getMinutes() - from.getMinutes();
  let s = to.getSeconds() - from.getSeconds();
  if (s < 0){ s += 60; mi--; }
  if (mi < 0){ mi += 60; h--; }
  if (h < 0){ h += 24; d--; }
  if (d < 0){
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    d += prevMonth; mo--;
  }
  if (mo < 0){ mo += 12; y--; }
  return {y, mo, d, h, mi, s};
}
function tick(){
  const now = new Date();
  if (now < START){
    ['years','months','days','hours','minutes','seconds'].forEach(id => {
      document.getElementById(id).textContent = '0';
    });
    return;
  }
  const t = diffYMDHMS(START, now);
  document.getElementById('years').textContent = t.y;
  document.getElementById('months').textContent = t.mo;
  document.getElementById('days').textContent = t.d;
  document.getElementById('hours').textContent = pad(t.h);
  document.getElementById('minutes').textContent = pad(t.mi);
  document.getElementById('seconds').textContent = pad(t.s);
  const cells = ['cell-years','cell-months','cell-days','cell-hours','cell-minutes','cell-seconds'];
  cells.forEach(id => document.getElementById(id).classList.remove('highlight-month'));
  if (now.getDate() === 4) document.getElementById('cell-months').classList.add('highlight-month');
}
tick();
setInterval(tick, 1000);

/* COUNTDOWN */
const UNLOCK_DATE = new Date(2027, 1, 4, 0, 0, 0);
function pad2(n){ return n < 10 ? '0' + n : '' + n; }
function tickUnlock(){
  const now = new Date();
  let delta = UNLOCK_DATE - now;
  const letter = document.getElementById('futureLetter');
  const cd = document.getElementById('countdown');
  if (delta <= 0){
    cd.style.display = 'none';
    letter.classList.add('show');
    return;
  }
  const d = Math.floor(delta / 86400000);
  delta -= d * 86400000;
  const h = Math.floor(delta / 3600000);
  delta -= h * 3600000;
  const m = Math.floor(delta / 60000);
  delta -= m * 60000;
  const s = Math.floor(delta / 1000);
  document.getElementById('cd-d').textContent = d;
  document.getElementById('cd-h').textContent = pad2(h);
  document.getElementById('cd-m').textContent = pad2(m);
  document.getElementById('cd-s').textContent = pad2(s);
}
tickUnlock();
setInterval(tickUnlock, 1000);