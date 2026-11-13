// Bips synthétisés (aucun fichier son), joués seulement si le son est activé.
(function (A) {
  'use strict';
  let ac = null;
  A.beep = (freq = 700, duration = 0.10, type = 'sine') => {
    if (!A.state.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const osc = ac.createOscillator(), gain = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      gain.gain.setValueAtTime(0.045, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
      osc.connect(gain).connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + duration);
    } catch {}
  };
})(window.Arcade = window.Arcade || {});
