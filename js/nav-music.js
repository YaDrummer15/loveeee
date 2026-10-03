/* NAV */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) nav.classList.add('shrink');
  else nav.classList.remove('shrink');
});
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* МУЗЫКА */
(function(){
  const musicBtn = document.getElementById('musicBtn');
  const musicLabel = musicBtn.querySelector('.label');
  let ctx = null, master = null, isPlaying = false;
  const tracks = [
    { name:'Cinematic', notes:[220.00,261.63,329.63,392.00,440.00,523.25], tempo:4200, wave:'sine', filter:800 },
    { name:'Ambient',   notes:[196.00,246.94,293.66,349.23,392.00,493.88], tempo:5200, wave:'triangle', filter:650 },
    { name:'Piano',     notes:[261.63,329.63,392.00,523.25,659.25,783.99], tempo:3600, wave:'sine', filter:1100 }
  ];
  let currentTrack = 0;
  function initAudio(){
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    master.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 3);
  }
  function playNote(freq, when, dur, wave, filterFreq){
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = wave; osc.frequency.value = freq;
    filter.type = 'lowpass'; filter.frequency.value = filterFreq; filter.Q.value = 0.6;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(0.08, when + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(filter); filter.connect(gain); gain.connect(master);
    osc.start(when); osc.stop(when + dur + 0.2);
  }
  function scheduleLoop(){
    if (!isPlaying) return;
    const track = tracks[currentTrack];
    const now = ctx.currentTime;
    track.notes.forEach((freq, i) => {
      const delay = i * (track.tempo / 1000 / 3);
      const jitter = (Math.random() - 0.5) * 0.4;
      const dur = (track.tempo / 1000) * 0.9;
      playNote(freq, now + delay + jitter, dur, track.wave, track.filter);
    });
    setTimeout(() => { if (isPlaying) scheduleLoop(); }, track.tempo);
  }
  musicBtn.addEventListener('click', () => {
    if (!isPlaying){
      initAudio();
      if (ctx.state === 'suspended') ctx.resume();
      master.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 2);
      isPlaying = true;
      musicBtn.classList.remove('paused');
      musicLabel.textContent = 'Играет';
      scheduleLoop();
    } else {
      isPlaying = false;
      musicBtn.classList.add('paused');
      musicLabel.textContent = 'Музыка';
      if (master) master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    }
  });
  musicBtn.addEventListener('dblclick', () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    musicLabel.textContent = tracks[currentTrack].name;
    if (isPlaying){
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setTimeout(() => { if (master) master.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 1.5); }, 500);
    }
    setTimeout(() => { if (isPlaying) musicLabel.textContent = 'Играет'; }, 2000);
  });
})();