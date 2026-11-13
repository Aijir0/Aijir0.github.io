// Vibrations courtes, seulement si le son est activé (même interrupteur) et si l'appareil sait vibrer.
(function (A) {
  'use strict';
  A.vibre = (motif) => {
    if (!A.state.sound || !navigator.vibrate) return;
    try { navigator.vibrate(motif); } catch {}
  };
})(window.Arcade = window.Arcade || {});
