// Mobile menu
const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Product filter tabs (home)
const tabs = document.querySelectorAll('.tab');
const products = document.querySelectorAll('.product');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
  const f = tab.dataset.filter;
  products.forEach(p => { p.hidden = !p.dataset.tags.split(' ').includes(f); });
}));

// Wishlist hearts
document.querySelectorAll('.wish').forEach(btn => btn.addEventListener('click', () => {
  btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true'));
}));

// Newsletter form
const form = document.getElementById('subForm');
if (form) {
  const msg = document.getElementById('formMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('input');
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    msg.style.color = ok ? '' : '#ff9b85';
    msg.textContent = ok ? 'You’re in. Check your inbox for your 10% code.' : 'Enter a valid email address.';
    if (ok) form.reset();
  });
}
