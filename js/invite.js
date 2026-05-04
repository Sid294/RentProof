import { initializeApp }    from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  getFirestore, doc, getDoc, updateDoc, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            'AIzaSyAr3P9nn0gBmFegU-SVBqSv2tqx68f6ALQ',
  authDomain:        'rentroof-bcfaf.firebaseapp.com',
  projectId:         'rentroof-bcfaf',
  storageBucket:     'rentroof-bcfaf.firebasestorage.app',
  messagingSenderId: '62296156879',
  appId:             '1:62296156879:web:54ba1c9c6e96df09fe25ba',
};

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const db       = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

const token = new URLSearchParams(window.location.search).get('t');
let inviteData = null;
let isSignup   = true;

/* ── Wait for Firebase auth to resolve, then load invite ── */
function waitForAuth() {
  return new Promise(resolve => {
    const unsub = onAuthStateChanged(auth, user => { unsub(); resolve(user); });
  });
}

async function init() {
  document.body.style.visibility = 'visible';

  if (!token) { showErrorPage('Invalid invite link.'); return; }

  try {
    const [user, snap] = await Promise.all([
      waitForAuth(),
      getDoc(doc(db, 'invites', token)),
    ]);

    if (!snap.exists()) { showErrorPage('This invite link is invalid.'); return; }

    const data = snap.data();
    if (data.usedAt) { showErrorPage('This invite link has already been used.'); return; }

    inviteData = data;

    /* Reveal invite info */
    hide('invite-loading');
    show('invite-info');
    setText('invite-desc',
      `You've been invited to ${inviteData.unitLabel} at ${inviteData.propertyAddress}.`);

    /* If the user is the landlord, show a read-only note instead of the form */
    if (user && user.uid === inviteData.landlordUid) {
      document.getElementById('invite-auth').innerHTML = `
        <div style="padding:1.25rem;background:var(--bg-raised);border:1px solid var(--border);
                    border-radius:3px;font-size:0.75rem;color:var(--mid);line-height:1.6">
          This is your invite link for <strong style="color:var(--paper)">${inviteData.unitLabel}</strong>.
          Share it with your tenant — they will use it to sign up and link to this unit.
        </div>
        <a href="/dashboard.html"
           style="display:block;margin-top:1.25rem;text-align:center;font-size:0.72rem;
                  color:var(--accent);letter-spacing:0.05em">
          &larr; Back to dashboard
        </a>`;
      return;
    }

    /* Wire the auth form unconditionally so it is always functional.
       For auto-accept failures the form becomes the retry fallback. */
    wireAuthForm();

    /* If already signed in as a non-landlord, auto-accept */
    if (user) {
      await acceptInvite(user, user.displayName);
      return;
    }

    /* Otherwise just show the form (wireAuthForm already called above) */

  } catch (err) {
    console.error('Invite load failed:', err);
    showErrorPage('Failed to load the invite. Please try again.');
  }
}

/* ── Accept invite ── */
async function acceptInvite(user, overrideName) {
  const tenantName = overrideName || user.displayName || user.email.split('@')[0];
  try {
    await updateDoc(doc(db, 'units', inviteData.unitId), {
      tenantUid:   user.uid,
      tenantName,
      tenantEmail: user.email,
    });
    await updateDoc(doc(db, 'invites', token), {
      usedAt:    serverTimestamp(),
      tenantUid: user.uid,
    });

    /* Show success */
    hide('invite-auth');
    show('invite-success');
    setText('success-unit-label',
      `${inviteData.unitLabel} at ${inviteData.propertyAddress}`);

  } catch (err) {
    console.error('Accept invite failed:', err);
    showAuthError('Failed to accept the invite. The unit may already be claimed.');
  }
}

/* ── Auth form wiring ── */
function wireAuthForm() {
  /* Google */
  document.getElementById('invite-google-btn')?.addEventListener('click', async () => {
    clearAuthError();
    try {
      const result = await signInWithPopup(auth, provider);
      await acceptInvite(result.user, result.user.displayName);
    } catch (err) {
      showAuthError(friendlyError(err.code));
    }
  });

  /* Toggle signup / sign-in */
  document.getElementById('invite-toggle-mode')?.addEventListener('click', e => {
    e.preventDefault();
    isSignup = !isSignup;
    const submitBtn   = document.getElementById('invite-submit');
    const toggleLink  = document.getElementById('invite-toggle-mode');
    const nameField   = document.getElementById('invite-name-field');

    if (isSignup) {
      submitBtn.textContent  = 'Create account & accept invite';
      toggleLink.textContent = 'Sign in instead';
      if (nameField) nameField.style.display = '';
    } else {
      submitBtn.textContent  = 'Sign in & accept invite';
      toggleLink.textContent = 'Create an account';
      if (nameField) nameField.style.display = 'none';
    }
  });

  /* Email / password form */
  document.getElementById('invite-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    clearAuthError();

    const submitBtn = document.getElementById('invite-submit');
    const email     = (document.getElementById('invite-email')?.value    || '').trim();
    const password  = document.getElementById('invite-password')?.value  || '';
    const name      = (document.getElementById('invite-name')?.value     || '').trim();

    if (!email || !password) return;

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Please wait…';

    try {
      let user, displayName;
      if (isSignup) {
        if (!name) { showAuthError('Enter your name.'); return; }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        user        = cred.user;
        displayName = name;
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        user        = cred.user;
        displayName = user.displayName;
      }
      await acceptInvite(user, displayName);
    } catch (err) {
      showAuthError(friendlyError(err.code));
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = isSignup
        ? 'Create account & accept invite'
        : 'Sign in & accept invite';
    }
  });
}

/* ── Helpers ── */
function showErrorPage(msg) {
  hide('invite-loading');
  show('invite-error-page');
  setText('invite-error-msg', msg);
}

function showAuthError(msg) {
  const el = document.getElementById('invite-auth-error');
  if (el) { el.textContent = msg; el.classList.add('show'); }
}

function clearAuthError() {
  const el = document.getElementById('invite-auth-error');
  if (el) { el.textContent = ''; el.classList.remove('show'); }
}

function hide(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function show(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'block';
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found':        'No account found with that email.',
    'auth/wrong-password':        'Incorrect password.',
    'auth/invalid-credential':    'Incorrect email or password.',
    'auth/email-already-in-use':  'An account with this email already exists. Sign in instead.',
    'auth/weak-password':         'Password must be at least 6 characters.',
    'auth/invalid-email':         'Enter a valid email address.',
    'auth/popup-closed-by-user':  'Sign-in popup was closed. Try again.',
    'auth/popup-blocked':         'Your browser blocked the sign-in popup. Allow popups for this site.',
    'auth/network-request-failed':'Network error. Check your connection.',
    'auth/too-many-requests':     'Too many attempts. Try again in a few minutes.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

/* ── Boot ── */
init();
