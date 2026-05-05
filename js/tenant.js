import { initializeApp }    from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut }
                            from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  getFirestore, collection, doc, addDoc, getDoc, getDocs,
  query, where, orderBy, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

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
const db   = getFirestore(app);

let currentUser = null;
let currentUnit = null;

/* ── Auth guard + tenant check ── */
onAuthStateChanged(auth, async user => {
  if (!user) { window.location.replace('/login.html'); return; }

  try {
    const snap = await getDocs(
      query(collection(db, 'units'), where('tenantUid', '==', user.uid))
    );
    if (snap.empty) {
      window.location.replace('/dashboard.html');
      return;
    }
    currentUser = user;
    currentUnit = { id: snap.docs[0].id, ...snap.docs[0].data() };
    await initTenantPortal(user, currentUnit);
  } catch (err) {
    console.error('Init failed:', err);
    document.body.style.visibility = 'visible';
  }
});

/* ── Boot ── */
async function initTenantPortal(user, unit) {
  populateUserInfo(user);

  const [propSnap, paymentSnap] = await Promise.all([
    getDoc(doc(db, 'properties', unit.propertyId)),
    getDoc(doc(db, 'payments', `${unit.id}_${currentMonth()}`)),
  ]);

  const property     = propSnap.exists()  ? { id: propSnap.id,  ...propSnap.data()  } : null;
  const paymentStatus = paymentSnap.exists() ? paymentSnap.data().status : 'pending';

  renderUnitCard(unit, property);
  renderPaymentCard(unit, paymentStatus);

  await Promise.all([
    loadPaymentHistory(unit),
    loadMaintenanceRequests(user),
  ]);

  wireMaintenance(user, unit);

  document.getElementById('signout-btn')?.addEventListener('click', async () => {
    await signOut(auth);
    window.location.replace('/login.html');
  });
}

/* ── User info ── */
function populateUserInfo(user) {
  document.body.style.visibility = 'visible';
  const displayName = user.displayName || user.email.split('@')[0];
  const first = displayName.split(' ')[0];

  document.querySelectorAll('[data-user-name]').forEach(el => { el.textContent = displayName; });

  const avatarEls = document.querySelectorAll('[data-user-avatar]');
  if (user.photoURL) {
    avatarEls.forEach(el => {
      el.innerHTML = `<img src="${user.photoURL}" alt="${displayName}" referrerpolicy="no-referrer">`;
    });
  } else {
    const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    avatarEls.forEach(el => { el.textContent = initials; });
  }

  const welcomeEl = document.getElementById('welcome-name');
  if (welcomeEl) welcomeEl.textContent = `Welcome back, ${first}.`;
}

/* ── Unit card ── */
function renderUnitCard(unit, property) {
  const card = document.getElementById('tenant-unit-card');
  const rentLine = unit.rentAmount
    ? `<div class="tenant-card-rent">$${formatMoney(unit.rentAmount)}<span>/month</span></div>`
    : '';
  card.innerHTML = `
    <div class="tenant-card-eyebrow">Your unit</div>
    <div class="tenant-card-address">${property ? escapeHtml(property.address) : 'Address unavailable'}</div>
    <div class="tenant-card-unit-label">${escapeHtml(unit.label)}</div>
    ${rentLine}`;
}

/* ── Payment card ── */
function renderPaymentCard(unit, status) {
  const card = document.getElementById('tenant-payment-card');
  const statusMeta = {
    paid:    { label: 'Paid',    cls: 'badge-paid',    note: 'Your landlord has marked this month as paid.' },
    pending: { label: 'Due',     cls: 'badge-pending', note: 'Payment due this month. Contact your landlord once sent.' },
    late:    { label: 'Late',    cls: 'badge-late',    note: 'Your payment is overdue. Contact your landlord.' },
  };
  const meta = statusMeta[status] || statusMeta.pending;
  const amountLine = unit.rentAmount
    ? `<div class="tenant-payment-amount">$${formatMoney(unit.rentAmount)}</div>`
    : '';

  card.innerHTML = `
    <div class="tenant-card-eyebrow">${monthLabel()}</div>
    <div class="tenant-payment-row">
      <span class="badge ${meta.cls}">${meta.label}</span>
      ${amountLine}
    </div>
    <div class="tenant-payment-note">${meta.note}</div>`;
}

/* ── Payment history (last 6 months) ── */
async function loadPaymentHistory(unit) {
  const histEl = document.getElementById('payment-history');
  const months = getPastMonths(6);

  const snaps = await Promise.all(
    months.map(m => getDoc(doc(db, 'payments', `${unit.id}_${m}`)))
  );

  const rows = months.map((month, i) => {
    const snap   = snaps[i];
    const status = snap.exists() ? snap.data().status : 'pending';
    const label  = new Date(month + '-02').toLocaleString('default', { month: 'long', year: 'numeric' });
    const meta   = { paid: { l: 'Paid', c: 'badge-paid' }, pending: { l: 'Pending', c: 'badge-pending' }, late: { l: 'Late', c: 'badge-late' } };
    const m      = meta[status] || meta.pending;
    const amountStr = unit.rentAmount ? `<span class="history-amount">$${formatMoney(unit.rentAmount)}</span>` : '';
    return `
      <div class="payment-history-row">
        <div class="history-month">${label}</div>
        ${amountStr}
        <span class="badge ${m.c}">${m.l}</span>
      </div>`;
  });

  histEl.innerHTML = `<div class="dash-property-card">${rows.join('')}</div>`;
}

/* ── Maintenance requests (tenant view) ── */
async function loadMaintenanceRequests(user) {
  const listEl = document.getElementById('maintenance-list');

  try {
    const snap = await getDocs(
      query(collection(db, 'maintenance_requests'),
        where('tenantUid', '==', user.uid),
        orderBy('createdAt', 'desc'))
    );

    if (snap.empty) {
      listEl.innerHTML = `
        <div class="dash-empty">
          <div class="dash-empty-title">No requests yet</div>
          <p>Submit a request above and your landlord will be notified immediately.</p>
        </div>`;
      return;
    }

    const card = document.createElement('div');
    card.className = 'dash-property-card';
    snap.docs.forEach(d => {
      card.appendChild(buildTenantMaintenanceRow({ id: d.id, ...d.data() }));
    });
    listEl.innerHTML = '';
    listEl.appendChild(card);
  } catch (err) {
    console.error('Maintenance load failed:', err);
    listEl.innerHTML = '<div style="padding:1rem;font-size:0.72rem;color:var(--late)">Failed to load requests.</div>';
  }
}

function buildTenantMaintenanceRow(req) {
  const statusMeta = {
    open:        { label: 'Open',        cls: 'badge-pending' },
    in_progress: { label: 'In Progress', cls: 'badge-pending' },
    resolved:    { label: 'Resolved',    cls: 'badge-paid'    },
  };
  const priorityMeta = {
    low:       { label: 'Low',       cls: 'priority-low'       },
    medium:    { label: 'Medium',    cls: 'priority-medium'    },
    high:      { label: 'High',      cls: 'priority-high'      },
    emergency: { label: 'Emergency', cls: 'priority-emergency' },
  };
  const sm = statusMeta[req.status]   || statusMeta.open;
  const pm = priorityMeta[req.priority] || priorityMeta.medium;
  const date = req.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || '';

  const row = document.createElement('div');
  row.className = 'maint-row';
  row.innerHTML = `
    <div class="maint-row-body">
      <div class="maint-row-title">${escapeHtml(req.title)}</div>
      <div class="maint-row-desc">${escapeHtml(req.description)}</div>
    </div>
    <div class="maint-row-meta">
      <span class="badge ${sm.cls}">${sm.label}</span>
      <span class="maint-priority ${pm.cls}">${pm.label}</span>
      <span class="maint-date">${date}</span>
    </div>`;
  return row;
}

/* ── Maintenance modal wiring ── */
function wireMaintenance(user, unit) {
  document.getElementById('new-maintenance-btn')?.addEventListener('click', openMaintModal);
  document.getElementById('maint-modal-close')?.addEventListener('click', closeMaintModal);
  document.getElementById('maint-modal-overlay')?.addEventListener('click', e => {
    if (e.target === document.getElementById('maint-modal-overlay')) closeMaintModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMaintModal(); });

  document.getElementById('maint-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = document.getElementById('maint-submit');
    const errEl     = document.getElementById('maint-error');
    const title     = (document.getElementById('maint-title').value  || '').trim();
    const desc      = (document.getElementById('maint-desc').value   || '').trim();
    const priority  = document.getElementById('maint-priority').value;

    if (!title || !desc) return;

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Submitting…';
    errEl.classList.remove('show');

    try {
      await addDoc(collection(db, 'maintenance_requests'), {
        unitId:      unit.id,
        propertyId:  unit.propertyId,
        landlordUid: unit.landlordUid,
        tenantUid:   user.uid,
        tenantName:  user.displayName || user.email.split('@')[0],
        title,
        description: desc,
        priority,
        status:      'open',
        createdAt:   serverTimestamp(),
        updatedAt:   serverTimestamp(),
      });
      closeMaintModal();
      document.getElementById('maint-form').reset();
      showToast('Request submitted. Your landlord has been notified.');
      await loadMaintenanceRequests(user);
    } catch (err) {
      console.error('Maintenance submit failed:', err);
      errEl.textContent = 'Failed to submit. Please try again.';
      errEl.classList.add('show');
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Submit request';
    }
  });
}

function openMaintModal() {
  document.getElementById('maint-modal-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('maint-title')?.focus(), 200);
}

function closeMaintModal() {
  document.getElementById('maint-modal-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Helpers ── */
function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function monthLabel() {
  return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
}

function getPastMonths(count) {
  const months = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

function formatMoney(n) {
  return Number(n).toLocaleString('en-US');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showToast(msg) {
  const t = document.getElementById('rp-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}
