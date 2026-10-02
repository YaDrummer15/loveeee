(function () {
    'use strict';

    const musicBtn = document.getElementById('musicBtn');
    if (!musicBtn) return;

    let audioCtx = null;
    let playing = false;
    let nodes = [];
    let scheduleTimer = null;

    function startMusic() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const notes = [196.00, 220.00, 261.63, 293.66, 329.63, 392.00];
        let time = audioCtx.currentTime;

        function schedule() {
            if (!playing) return;
            for (let i = 0; i < 5; i++) {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const filt = audioCtx.createBiquadFilter();
                osc.type = 'sine';
                osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];
                filt.type = 'lowpass';
                filt.frequency.value = 700;
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.05, time + 0.8);
                gain.gain.linearRampToValueAtTime(0, time + 3.5);
                osc.connect(filt); filt.connect(gain); gain.connect(audioCtx.destination);
                osc.start(time); osc.stop(time + 3.5);
                nodes.push({ osc, gain });
                time += 1.4 + Math.random() * 0.9;
            }
            scheduleTimer = setTimeout(schedule, 8000);
        }
        schedule();
    }

    function stopMusic() {
        playing = false;
        if (scheduleTimer) clearTimeout(scheduleTimer);
        nodes.forEach(({ osc, gain }) => {
            try {
                gain.gain.cancelScheduledValues(audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
                osc.stop(audioCtx.currentTime + 0.5);
            } catch (e) {}
        });
        nodes = [];
    }

    musicBtn.addEventListener('click', () => {
        if (!playing) {
            if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
            playing = true;
            musicBtn.classList.add('playing');
            musicBtn.textContent = '♫';
            startMusic();
        } else {
            stopMusic();
            musicBtn.classList.remove('playing');
            musicBtn.textContent = '♪';
        }
    });
})();