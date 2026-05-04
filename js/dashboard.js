import { initializeApp }    from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut }
                            from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  getFirestore, collection, doc, addDoc, setDoc, getDocs,
  query, where, serverTimestamp,
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

/* ── Auth guard ── */
onAuthStateChanged(auth, user => {
  if (!user) { window.location.replace('/login.html'); return; }
  currentUser = user;
  initDashboard(user);
});

/* ── Boot ── */
async function initDashboard(user) {
  populateUserInfo(user);
  wireAddPropertyModal(user);
  await loadPortfolio(user);
}

/* ── User info ── */
function populateUserInfo(user) {
  document.body.style.visibility = 'visible';
  const displayName = user.displayName || user.email.split('@')[0];
  const first = displayName.split(' ')[0];

  document.querySelectorAll('[data-user-name]').forEach(el  => { el.textContent = displayName; });
  document.querySelectorAll('[data-user-email]').forEach(el => { el.textContent = user.email; });

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

/* ── Portfolio load ── */
async function loadPortfolio(user) {
  const listEl = document.getElementById('properties-list');
  listEl.innerHTML = '<div style="padding:1.5rem;font-size:0.72rem;color:var(--mid);">Loading...</div>';

  try {
    const [propsSnap, unitsSnap] = await Promise.all([
      getDocs(query(collection(db, 'properties'), where('landlordUid', '==', user.uid))),
      getDocs(query(collection(db, 'units'),      where('landlordUid', '==', user.uid))),
    ]);

    const properties = propsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const units      = unitsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const month        = currentMonth();
    const paymentsSnap = await getDocs(
      query(collection(db, 'payments'),
        where('landlordUid', '==', user.uid),
        where('month', '==', month))
    );
    const payments = {};
    paymentsSnap.docs.forEach(d => { payments[d.data().unitId] = d.data().status; });

    renderStats(units, payments);
    renderProperties(properties, units, payments, user);
  } catch (err) {
    console.error('Portfolio load failed:', err);
    listEl.innerHTML =
      '<div style="padding:1.5rem;font-size:0.72rem;color:var(--late);">Failed to load. Refresh to try again.</div>';
  }
}

/* ── Stats ── */
function renderStats(units, payments) {
  const total   = units.length;
  const paid    = units.filter(u => payments[u.id] === 'paid').length;
  const late    = units.filter(u => payments[u.id] === 'late').length;

  setText('stat-units',     total);
  setText('stat-units-sub', total === 1 ? '1 unit total' : `${total} units total`);
  setText('stat-paid',      `${paid}/${total}`);
  setText('stat-paid-sub',  `Units paid · ${monthLabel()}`);
  setText('stat-late',      late);
}

async function reloadStats(user) {
  try {
    const [unitsSnap, paymentsSnap] = await Promise.all([
      getDocs(query(collection(db, 'units'), where('landlordUid', '==', user.uid))),
      getDocs(query(collection(db, 'payments'),
        where('landlordUid', '==', user.uid),
        where('month', '==', currentMonth()))),
    ]);
    const units    = unitsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const payments = {};
    paymentsSnap.docs.forEach(d => { payments[d.data().unitId] = d.data().status; });
    renderStats(units, payments);
  } catch (err) {
    console.error('Stats reload failed:', err);
  }
}

/* ── Properties render ── */
function renderProperties(properties, units, payments, user) {
  const listEl = document.getElementById('properties-list');
  listEl.innerHTML = '';

  if (properties.length === 0) {
    listEl.innerHTML = `
      <div class="dash-empty">
        <div class="dash-empty-title">No properties yet</div>
        <p>Add your first property to get started.<br>Units and invite links are created automatically.</p>
        <button class="btn-add" id="empty-add-btn">+ Add property</button>
      </div>`;
    document.getElementById('empty-add-btn')
      ?.addEventListener('click', openAddModal);
    return;
  }

  properties.forEach(prop => {
    const propUnits = units.filter(u => u.propertyId === prop.id);
    listEl.appendChild(buildPropertyCard(prop, propUnits, payments, user));
  });
}

function buildPropertyCard(prop, units, payments, user) {
  const card = document.createElement('div');
  card.className = 'dash-property-card';

  const header = document.createElement('div');
  header.className = 'dash-property-header';
  header.innerHTML = `
    <div>
      <div class="dash-property-address">${escapeHtml(prop.address)}</div>
      <div class="dash-property-meta">${units.length} unit${units.length !== 1 ? 's' : ''}</div>
    </div>`;
  card.appendChild(header);

  if (units.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'padding:1rem 1.5rem;font-size:0.72rem;color:var(--mid)';
    empty.textContent = 'No units.';
    card.appendChild(empty);
    return card;
  }

  /* Column header row */
  const colHead = document.createElement('div');
  colHead.className = 'dash-unit-row dash-unit-row-header';
  colHead.innerHTML = `
    <div>Unit</div>
    <div>Tenant</div>
    <div></div>
    <div>${monthLabel()}</div>`;
  card.appendChild(colHead);

  units.forEach(unit => {
    card.appendChild(buildUnitRow(unit, payments[unit.id] || 'pending', user));
  });

  return card;
}

function buildUnitRow(unit, status, user) {
  const row = document.createElement('div');
  row.className = 'dash-unit-row';
  row.dataset.unitId = unit.id;

  /* Unit label */
  const labelEl = document.createElement('div');
  labelEl.className = 'unit-label';
  labelEl.textContent = unit.label;

  /* Tenant */
  const tenantEl = document.createElement('div');
  tenantEl.className = 'unit-tenant';
  if (unit.tenantName) {
    tenantEl.innerHTML = `<span class="unit-tenant-name">${escapeHtml(unit.tenantName)}</span>`;
  } else {
    tenantEl.textContent = 'No tenant';
  }

  /* Invite button */
  const inviteBtn = document.createElement('button');
  inviteBtn.className = 'btn-invite';
  inviteBtn.textContent = unit.tenantName ? 'Resend link' : 'Copy invite';
  inviteBtn.addEventListener('click', () => copyInviteLink(unit, inviteBtn));

  /* Payment status select */
  const statusSel = document.createElement('select');
  statusSel.className = `unit-status-select ${status}`;
  ['paid', 'pending', 'late'].forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
    if (s === status) opt.selected = true;
    statusSel.appendChild(opt);
  });
  statusSel.addEventListener('change', async () => {
    const newStatus = statusSel.value;
    statusSel.className = `unit-status-select ${newStatus}`;
    try {
      await setDoc(doc(db, 'payments', `${unit.id}_${currentMonth()}`), {
        unitId:      unit.id,
        landlordUid: user.uid,
        month:       currentMonth(),
        status:      newStatus,
        updatedAt:   serverTimestamp(),
      });
      await reloadStats(user);
    } catch (err) {
      console.error('Payment update failed:', err);
    }
  });

  row.appendChild(labelEl);
  row.appendChild(tenantEl);
  row.appendChild(inviteBtn);
  row.appendChild(statusSel);
  return row;
}

/* ── Invite link ── */
function copyInviteLink(unit, btn) {
  const link = `${window.location.origin}/invite.html?t=${unit.inviteToken}`;
  const originalText = btn.textContent;
  navigator.clipboard.writeText(link).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('copied');
    }, 2500);
  }).catch(() => {
    /* Fallback for browsers that block clipboard without HTTPS */
    prompt('Copy this invite link:', link);
  });
}

/* ── Add property modal ── */
function wireAddPropertyModal(user) {
  document.getElementById('add-property-btn')
    ?.addEventListener('click', openAddModal);
  document.getElementById('add-modal-close')
    ?.addEventListener('click', closeAddModal);
  document.getElementById('add-modal-overlay')
    ?.addEventListener('click', e => {
      if (e.target === document.getElementById('add-modal-overlay')) closeAddModal();
    });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAddModal();
  });

  document.getElementById('add-property-form')
    ?.addEventListener('submit', async e => {
      e.preventDefault();
      const submitBtn = document.getElementById('add-property-submit');
      const errEl     = document.getElementById('add-modal-error');
      const address   = (document.getElementById('prop-address').value || '').trim();
      const unitCount = parseInt(document.getElementById('prop-units').value, 10);

      errEl.classList.remove('show');

      if (!address) return;
      if (!unitCount || unitCount < 1 || unitCount > 100) {
        errEl.textContent = 'Enter a number between 1 and 100.';
        errEl.classList.add('show');
        return;
      }

      submitBtn.disabled    = true;
      submitBtn.textContent = 'Adding…';

      try {
        await createProperty(user, address, unitCount);
        closeAddModal();
        document.getElementById('add-property-form').reset();
        showToast('Property added.');
        await loadPortfolio(user);
      } catch (err) {
        console.error('Add property failed:', err);
        errEl.textContent = 'Something went wrong. Try again.';
        errEl.classList.add('show');
      } finally {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Add property';
      }
    });
}

function openAddModal() {
  document.getElementById('add-modal-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('prop-address')?.focus(), 200);
}

function closeAddModal() {
  document.getElementById('add-modal-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

async function createProperty(user, address, unitCount) {
  const propRef = await addDoc(collection(db, 'properties'), {
    landlordUid: user.uid,
    address,
    createdAt: serverTimestamp(),
  });

  const promises = [];
  for (let i = 1; i <= unitCount; i++) {
    const inviteToken = generateToken();
    const label       = unitCount === 1 ? 'Unit' : `Unit ${i}`;
    promises.push(
      addDoc(collection(db, 'units'), {
        propertyId:  propRef.id,
        landlordUid: user.uid,
        label,
        tenantUid:   null,
        tenantName:  null,
        tenantEmail: null,
        inviteToken,
        createdAt:   serverTimestamp(),
      }).then(unitRef =>
        setDoc(doc(db, 'invites', inviteToken), {
          unitId:          unitRef.id,
          unitLabel:       label,
          propertyAddress: address,
          landlordUid:     user.uid,
          createdAt:       serverTimestamp(),
          usedAt:          null,
          tenantUid:       null,
        })
      )
    );
  }
  await Promise.all(promises);
}

/* ── Sign out ── */
document.getElementById('signout-btn')?.addEventListener('click', async () => {
  await signOut(auth);
  window.location.replace('/login.html');
});

/* ── Helpers ── */
function generateToken() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return Array.from(crypto.getRandomValues(new Uint8Array(20)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function monthLabel() {
  return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function showToast(msg) {
  const t = document.getElementById('rp-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
