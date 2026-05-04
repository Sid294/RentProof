/*
  RentProof Dashboard Auth Guard
  ─────────────────────────────────────────────────────────────
  Checks Firebase auth state on load. Redirects unauthenticated
  users to /login.html immediately. Populates user info when ready.
*/

import { initializeApp }         from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut }
                                  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const firebaseConfig = {
  apiKey:            'AIzaSyAr3P9nn0gBmFegU-SVBqSv2tqx68f6ALQ',
  authDomain:        'rentroof-bcfaf.firebaseapp.com',
  projectId:         'rentroof-bcfaf',
  storageBucket:     'rentroof-bcfaf.firebasestorage.app',
  messagingSenderId: '62296156879',
  appId:             '1:62296156879:web:54ba1c9c6e96df09fe25ba',
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ── Auth guard ── */
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.replace('/login.html');
    return;
  }
  initDashboard(user);
});

/* ── Populate dashboard with user data ── */
function initDashboard(user) {
  /* Show the page (it starts hidden to prevent flash) */
  document.body.style.visibility = 'visible';

  /* User name */
  const nameEls = document.querySelectorAll('[data-user-name]');
  const displayName = user.displayName || user.email.split('@')[0];
  nameEls.forEach(el => { el.textContent = displayName; });

  /* User email */
  const emailEls = document.querySelectorAll('[data-user-email]');
  emailEls.forEach(el => { el.textContent = user.email; });

  /* Avatar */
  const avatarEls = document.querySelectorAll('[data-user-avatar]');
  if (user.photoURL) {
    avatarEls.forEach(el => {
      el.innerHTML = `<img src="${user.photoURL}" alt="${displayName}" referrerpolicy="no-referrer">`;
    });
  } else {
    const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    avatarEls.forEach(el => { el.textContent = initials; });
  }

  /* Welcome headline */
  const first = displayName.split(' ')[0];
  const welcomeEl = document.getElementById('welcome-name');
  if (welcomeEl) welcomeEl.textContent = `Welcome back, ${first}.`;
}

/* ── Sign out ── */
const signoutBtn = document.getElementById('signout-btn');
if (signoutBtn) {
  signoutBtn.addEventListener('click', async () => {
    signoutBtn.disabled = true;
    await signOut(auth);
    window.location.replace('/login.html');
  });
}
