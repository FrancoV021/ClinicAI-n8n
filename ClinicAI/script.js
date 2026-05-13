/* ═══════════════════════════════════════════
   CLINICAI — script.js
   Animations, interactions & particles
═══════════════════════════════════════════ */

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
window.addEventListener('scroll', debounce(() => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, 10));

/* ── MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── PARTICLES ── */
const particlesContainer = document.getElementById('particles');
const primaryRGB = '59,130,246';
const accentRGB = '6,182,212';
for (let i = 0; i < 50; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = 2 + Math.random() * 4;
  const useAccent = Math.random() > 0.6;
  p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random() * 100}%;
    top:${Math.random() * 100}%;
    animation-delay:-${Math.random() * 20}s;
    animation-duration:${15 + Math.random() * 15}s;
    background: radial-gradient(circle, rgba(${useAccent ? accentRGB : primaryRGB},0.9), transparent);
    opacity:${0.2 + Math.random() * 0.5};
  `;
  particlesContainer.appendChild(p);
}

/* ── HERO REVEAL (runs on load) ── */
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal-fade').forEach(el => {
    el.classList.add('visible');
  });
});

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in-view'), idx * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

/* ── ANIMATED COUNTERS ── */
function animateCounter(el, target, suffix) {
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statsObserver.observe(el));

/* ── FLIP CARDS (tap on mobile) ── */
document.querySelectorAll('.service-card-flip').forEach(card => {
  card.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      card.classList.toggle('flipped');
    }
  });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── SPECIALTY CARDS STAGGER ── */
const specObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.specialty-card');
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('in-view'), i * 60);
      });
      specObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
const specGrid = document.querySelector('.specialties-grid');
if (specGrid) specObserver.observe(specGrid);

/* ═══════════════════════════════════════════
   MODAL DE TURNO
═══════════════════════════════════════════ */

const WEBHOOK_URL = 'http://localhost:5678/webhook/961d5cc8-5872-417c-ba9f-34eb915cde77';

const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalFormView = document.getElementById('modalFormView');
const modalSuccessView = document.getElementById('modalSuccessView');
const modalErrorBanner = document.getElementById('modalErrorBanner');
const appointmentForm = document.getElementById('appointmentForm');
const btnSubmit = document.getElementById('btnSubmit');
const btnCloseSuccess = document.getElementById('btnCloseSuccess');
const successDetails = document.getElementById('successDetails');

/* ── Fecha mínima: hoy ── */
const dateInput = document.getElementById('appointmentDate');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

/* ── Abrir modal ── */
function openModal(preselect) {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalFormView.style.display = 'block';
  modalSuccessView.style.display = 'none';
  modalErrorBanner.style.display = 'none';
  appointmentForm.reset();
  clearAllErrors();

  // Pre-seleccionar especialidad si viene del botón de una specialty-card
  if (preselect) {
    const sel = document.getElementById('specialty');
    if (sel) sel.value = preselect;
  }
}

/* ── Cerrar modal ── */
function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Listeners de apertura ── */
// Botón Hero CTA principal
document.getElementById('cta-turnos')?.addEventListener('click', (e) => {
  e.preventDefault(); openModal();
});
// Botón "Sacar Turno Online" en navbar
document.querySelector('.nav-link-cta')?.addEventListener('click', (e) => {
  e.preventDefault(); openModal();
});
// Botones "Sacar Turno" de specialties
document.querySelectorAll('.specialty-cta').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const card = btn.closest('.specialty-card');
    const spec = card?.querySelector('h3')?.textContent?.trim() || '';
    openModal(spec);
  });
});
// Botón CTA final "Llamar" → abrir modal también
document.getElementById('btn-llamar')?.addEventListener('click', (e) => {
  // Dejar que actúe el href tel: normalmente
});

/* ── Cerrar con X, click en overlay, Escape ── */
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});
btnCloseSuccess?.addEventListener('click', closeModal);

/* ── Validación ── */
function clearAllErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function showError(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (input) input.classList.add('error');
  if (err) err.textContent = msg;
}

function validateForm() {
  clearAllErrors();
  let valid = true;

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const dni = document.getElementById('dni').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const specialty = document.getElementById('specialty').value;
  const date = document.getElementById('appointmentDate').value;
  const time = document.getElementById('appointmentTime').value;
  const notes = document.getElementById('notes').value.trim();

  if (!firstName) { showError('firstName', 'err-firstName', 'El nombre es obligatorio.'); valid = false; }
  if (!lastName) { showError('lastName', 'err-lastName', 'El apellido es obligatorio.'); valid = false; }
  if (!dni || !/^\d{7,10}$/.test(dni)) { showError('dni', 'err-dni', 'Ingresá un DNI válido (7-10 dígitos).'); valid = false; }
  if (!phone) { showError('phone', 'err-phone', 'El teléfono es obligatorio.'); valid = false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'err-email', 'Ingresá un email válido.'); valid = false; }
  if (!specialty) { showError('specialty', 'err-specialty', 'Seleccioná una especialidad.'); valid = false; }
  if (!date) { showError('appointmentDate', 'err-appointmentDate', 'Seleccioná un día.'); valid = false; }
  if (!time) { showError('appointmentTime', 'err-appointmentTime', 'Seleccioná un horario.'); valid = false; }
  if (!notes) { showError('notes', 'err-notes', 'Describí brevemente el motivo de consulta.'); valid = false; }

  return { valid, data: { firstName, lastName, dni, phone, email, specialty, date, time, notes } };
}

/* ── Envío al Webhook ── */
appointmentForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  modalErrorBanner.style.display = 'none';

  const { valid, data } = validateForm();
  if (!valid) return;

  // Loading state
  const textSpan = btnSubmit.querySelector('.btn-submit-text');
  const loadingSpan = btnSubmit.querySelector('.btn-submit-loading');
  textSpan.style.display = 'none';
  loadingSpan.style.display = 'flex';
  btnSubmit.disabled = true;

  // Build JSON payload
  const insurance = document.getElementById('insurance').value.trim();
  const payload = {
    nombre: data.firstName,
    apellido: data.lastName,
    nombre_completo: `${data.firstName} ${data.lastName}`,
    dni: data.dni,
    telefono: data.phone,
    email: data.email,
    especialidad: data.specialty,
    fecha: data.date,
    horario: data.time,
    obra_social: insurance || 'No especificada',
    motivo_consulta: data.notes,
    timestamp: new Date().toISOString(),
    origen: 'ClinicAI Web — Formulario de Turnos'
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // n8n webhook-test returns 200 even on first trigger
    if (response.ok || response.status === 200) {
      showSuccess(payload);
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (err) {
    console.error('Webhook error:', err);
    modalErrorBanner.style.display = 'block';
    textSpan.style.display = 'flex';
    loadingSpan.style.display = 'none';
    btnSubmit.disabled = false;
  }
});

/* ── Mostrar éxito ── */
function showSuccess(payload) {
  modalFormView.style.display = 'none';
  modalSuccessView.style.display = 'block';

  const rows = [
    ['Paciente', `${payload.nombre} ${payload.apellido}`],
    ['Especialidad', payload.especialidad],
    ['Fecha', formatDate(payload.fecha)],
    ['Horario', payload.horario],
    ['Contacto', payload.email],
  ];

  successDetails.innerHTML = rows.map(([label, value]) => `
    <div class="success-row">
      <span class="success-row-label">${label}</span>
      <span class="success-row-value">${value}</span>
    </div>
  `).join('');
}

function formatDate(dateStr) {
  if (!dateStr) return dateStr;
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}
