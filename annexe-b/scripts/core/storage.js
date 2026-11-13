// Sauvegarde locale tolérante : navigation privée ou stockage bloqué renvoient la valeur par défaut.
(function (A) {
  'use strict';
  A.storage = {
    get(k, fallback) {
      try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; }
    },
    set(k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
    }
  };
})(window.Arcade = window.Arcade || {});
