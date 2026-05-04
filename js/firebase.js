/*
  FIREBASE SETUP
  ──────────────────────────────────────────
  Replace the placeholder config below with your real Firebase project config.
  Find it at: Firebase Console -> Project Settings -> Your apps -> Web app -> Config

  To enable Firestore:
    1. Go to Firebase Console -> Firestore Database -> Create database
    2. Start in production mode
    3. Deploy security rules (see firestore.rules)
*/

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            'AIzaSyAr3P9nn0gBmFegU-SVBqSv2tqx68f6ALQ',
  authDomain:        'rentroof-bcfaf.firebaseapp.com',
  projectId:         'rentroof-bcfaf',
  storageBucket:     'rentroof-bcfaf.firebasestorage.app',
  messagingSenderId: '62296156879',
  appId:             '1:62296156879:web:54ba1c9c6e96df09fe25ba',
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* ── Modal wiring ── */
const modalOverlay = document.getElementById('modal-overlay');
const modalClose   = document.getElementById('modal-close');
const modalForm    = document.getElementById('modal-form');
const modalSuccess = document.getElementById('modal-success');
const modalSubmit  = document.getElementById('modal-submit');
const emailInput   = document.getElementById('modal-email');
const planOptions  = document.querySelectorAll('.plan-option');

let selectedPlan = 'growth';

/* Open modal from any CTA */
document.querySelectorAll('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const plan = btn.dataset.plan || 'growth';
    setSelectedPlan(plan);
    openModal();
  });
});

function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => emailInput && emailInput.focus(), 300);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalClose)   modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

/* Plan selector inside modal */
function setSelectedPlan(plan) {
  selectedPlan = plan;
  planOptions.forEach(opt => {
    const isMatch = opt.dataset.value === plan;
    opt.classList.toggle('selected', isMatch);
    const radio = opt.querySelector('input[type="radio"]');
    if (radio) radio.checked = isMatch;
  });
}

planOptions.forEach(opt => {
  opt.addEventListener('click', () => setSelectedPlan(opt.dataset.value));
});

/* ── Form submission ── */
if (modalForm) {
  modalForm.addEventListener('submit', async e => {
    e.preventDefault();

    const email = (emailInput.value || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      emailInput.focus();
      return;
    }

    /* Guard: already signed up in this browser */
    const stored = localStorage.getItem('rp_signup');
    if (stored) {
      showSuccess();
      return;
    }

    modalSubmit.disabled = true;
    modalSubmit.textContent = 'Saving...';

    try {
      await addDoc(collection(db, 'signups'), {
        email,
        plan:      selectedPlan,
        source:    'landing',
        timestamp: serverTimestamp(),
      });

      localStorage.setItem('rp_signup', JSON.stringify({ email, plan: selectedPlan }));
      showSuccess();
    } catch (err) {
      console.error('Signup error:', err);
      modalSubmit.disabled = false;
      modalSubmit.textContent = 'Start Free Trial';

      /* Show a friendly inline error without crashing */
      let errMsg = document.getElementById('modal-error');
      if (!errMsg) {
        errMsg = document.createElement('p');
        errMsg.id = 'modal-error';
        errMsg.style.cssText = 'font-size:0.7rem;color:#e84f2b;text-align:center;margin-top:0.5rem;';
        modalSubmit.parentNode.insertBefore(errMsg, modalSubmit.nextSibling);
      }
      errMsg.textContent = 'Something went wrong. Please try again.';
    }
  });
}

function showSuccess() {
  modalForm.style.display = 'none';
  modalSuccess.classList.add('show');
}
