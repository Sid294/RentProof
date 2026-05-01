/*
  RentProof Auth Module
  ─────────────────────────────────────────────────────────────
  Shared by login.html and signup.html.
  Replace firebaseConfig values with your real project config.
*/

import { initializeApp }                          from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

/* ── Firebase config ── */
const firebaseConfig = {
  apiKey:            'YOUR_API_KEY',
  authDomain:        'YOUR_PROJECT_ID.firebaseapp.com',
  projectId:         'YOUR_PROJECT_ID',
  storageBucket:     'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId:             'YOUR_APP_ID',
};

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({ prompt: 'select_account' });

/* ── Redirect if already signed in ── */
onAuthStateChanged(auth, user => {
  if (user) window.location.replace('/dashboard.html');
});

/* ── Helpers ── */
const DASHBOARD = '/dashboard.html';

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
}

function clearError(el) {
  if (!el) return;
  el.textContent = '';
  el.classList.remove('show');
}

function setLoading(btn, loading) {
  btn.disabled  = loading;
  btn.textContent = loading ? 'Please wait...' : btn.dataset.label;
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found':           'No account found with that email.',
    'auth/wrong-password':           'Incorrect password.',
    'auth/invalid-credential':       'Incorrect email or password.',
    'auth/email-already-in-use':     'An account with this email already exists.',
    'auth/weak-password':            'Password must be at least 6 characters.',
    'auth/invalid-email':            'Enter a valid email address.',
    'auth/popup-closed-by-user':     'Sign-in popup was closed. Try again.',
    'auth/popup-blocked':            'Your browser blocked the sign-in popup. Allow popups for this site.',
    'auth/network-request-failed':   'Network error. Check your connection.',
    'auth/too-many-requests':        'Too many attempts. Try again in a few minutes.',
    'auth/user-disabled':            'This account has been disabled.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

/* ────────────────────────────────────────────────────────────
   LOGIN PAGE
   ──────────────────────────────────────────────────────────── */
const loginForm   = document.getElementById('login-form');
const loginError  = document.getElementById('login-error');
const googleBtn   = document.getElementById('google-btn');
const forgotLink  = document.getElementById('forgot-link');

/* Google sign-in */
if (googleBtn) {
  googleBtn.addEventListener('click', async () => {
    clearError(loginError);
    googleBtn.disabled = true;

    try {
      await signInWithPopup(auth, provider);
      window.location.replace(DASHBOARD);
    } catch (err) {
      googleBtn.disabled = false;
      showError(loginError, friendlyError(err.code));
    }
  });
}

/* Email + password login */
if (loginForm) {
  const submitBtn = loginForm.querySelector('.auth-submit');
  submitBtn.dataset.label = submitBtn.textContent;

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    clearError(loginError);

    const email    = loginForm.querySelector('#login-email').value.trim();
    const password = loginForm.querySelector('#login-password').value;

    if (!email || !password) {
      showError(loginError, 'Enter your email and password.');
      return;
    }

    setLoading(submitBtn, true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.replace(DASHBOARD);
    } catch (err) {
      setLoading(submitBtn, false);
      showError(loginError, friendlyError(err.code));
    }
  });
}

/* Forgot password */
if (forgotLink) {
  forgotLink.addEventListener('click', async e => {
    e.preventDefault();
    const emailEl = document.getElementById('login-email');
    const email   = emailEl ? emailEl.value.trim() : '';

    if (!email) {
      showError(loginError, 'Enter your email address first, then click Forgot password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      clearError(loginError);
      const notice = document.getElementById('reset-notice');
      if (notice) { notice.style.display = 'block'; }
    } catch (err) {
      showError(loginError, friendlyError(err.code));
    }
  });
}

/* ────────────────────────────────────────────────────────────
   SIGNUP PAGE
   ──────────────────────────────────────────────────────────── */
const signupForm  = document.getElementById('signup-form');
const signupError = document.getElementById('signup-error');
const signupGoogle = document.getElementById('signup-google-btn');
const passwordInput = document.getElementById('signup-password');

/* Google sign-up */
if (signupGoogle) {
  signupGoogle.addEventListener('click', async () => {
    clearError(signupError);
    signupGoogle.disabled = true;

    try {
      await signInWithPopup(auth, provider);
      window.location.replace(DASHBOARD);
    } catch (err) {
      signupGoogle.disabled = false;
      showError(signupError, friendlyError(err.code));
    }
  });
}

/* Password strength indicator */
if (passwordInput) {
  passwordInput.addEventListener('input', () => {
    const val   = passwordInput.value;
    const bars  = document.querySelectorAll('.strength-bar');
    if (!bars.length) return;

    bars.forEach(b => b.className = 'strength-bar');

    if (val.length === 0) return;

    let score = 0;
    if (val.length >= 8)                           score++;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val))   score++;
    if (/[^A-Za-z0-9]/.test(val))                 score++;

    const levels = ['weak', 'medium', 'strong'];
    const level  = levels[score - 1] || 'weak';
    bars.forEach((bar, i) => {
      if (i < score) bar.classList.add(level);
    });
  });
}

/* Email + password signup */
if (signupForm) {
  const submitBtn = signupForm.querySelector('.auth-submit');
  submitBtn.dataset.label = submitBtn.textContent;

  signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    clearError(signupError);

    const name     = (signupForm.querySelector('#signup-name').value || '').trim();
    const email    = signupForm.querySelector('#signup-email').value.trim();
    const password = signupForm.querySelector('#signup-password').value;

    if (!name)     { showError(signupError, 'Enter your full name.');     return; }
    if (!email)    { showError(signupError, 'Enter your email address.'); return; }
    if (!password) { showError(signupError, 'Choose a password.');        return; }
    if (password.length < 6) { showError(signupError, 'Password must be at least 6 characters.'); return; }

    setLoading(submitBtn, true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      window.location.replace(DASHBOARD);
    } catch (err) {
      setLoading(submitBtn, false);
      showError(signupError, friendlyError(err.code));
    }
  });
}
