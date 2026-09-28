// Interface uniquement : le serveur doit protéger les fichiers avant de les servir.
const status = document.getElementById('access-status');
const login = document.getElementById('login-form');
const logout = document.getElementById('logout');
const cards = document.querySelector('.cards');
const allowedNext = new Set(['/jeu/index.html', '/PacQC/index.html', '/espace-jeux/selection.html']);
const requested = new URLSearchParams(location.search).get('next');
const next = allowedNext.has(requested) ? requested : '/espace-jeux/selection.html';
const localPreview = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
let csrfToken;
async function api(path, body) {
  const response = await fetch(`/api/games/${path}`, {
    method: body ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken } : {},
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(8000),
  });
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('unavailable');
  return { response, data: await response.json() };
}
function unavailable() {
  status.textContent = 'L’accès privé n’est pas encore configuré sur l’hébergement. Aucun mot de passe ne peut être validé ici pour le moment.';
  if (localPreview) {
    status.append(' Aperçu local sans protection : ');
    const link = document.createElement('a');
    link.href = 'selection.html'; link.textContent = 'voir la sélection'; status.append(link);
    if (cards) cards.hidden = false;
  }
}
async function checkSession() {
  try {
    const { response, data } = await api('session');
    if (!response.ok || typeof data.authenticated !== 'boolean' || !data.csrfToken) throw new Error('unavailable');
    csrfToken = data.csrfToken;
    if (data.authenticated) {
      if (login) location.replace(next);
      else { cards.hidden = false; logout.disabled = false; status.textContent = ''; }
    } else if (login) {
      document.getElementById('password').disabled = false;
      document.getElementById('submit').disabled = false;
      status.textContent = 'Saisissez votre mot de passe.';
    } else location.replace('index.html?next=/espace-jeux/selection.html');
  } catch { unavailable(); }
}
login?.addEventListener('submit', async event => {
  event.preventDefault();
  const button = document.getElementById('submit'), password = document.getElementById('password');
  if (!csrfToken) return;
  button.disabled = true;
  try {
    const { response, data } = await api('login', { password: password.value, next });
    password.value = '';
    if (response.ok && data.authenticated === true) location.replace(next);
    else {
      status.textContent = response.status === 429 ? 'Trop de tentatives. Patientez quelques minutes avant de réessayer.' : response.status === 401 ? 'Mot de passe incorrect. Réessayez.' : 'Connexion impossible. Rechargez la page et réessayez.';
      password.focus();
    }
  } catch { password.value = ''; unavailable(); }
  finally { button.disabled = false; }
});
logout?.addEventListener('click', async () => {
  logout.disabled = true;
  try {
    const { response } = await api('logout', {});
    if (!response.ok) throw new Error('logout');
    location.replace('index.html');
  } catch { status.textContent = 'Déconnexion non confirmée. Réessayez.'; logout.disabled = false; }
});
window.addEventListener('pageshow', event => { if (event.persisted) { if (cards) cards.hidden = true; checkSession(); } });
checkSession();
