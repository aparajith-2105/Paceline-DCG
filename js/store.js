// ===========================================================
// BASKET STORE — runs on every page.
// - Clicking a heart on any product adds / removes it from the basket
// - Keeps the basket in the browser (localStorage) so it survives page changes
// - Updates the number on the basket icon in the header
// - Exposes window.PacelineStore for the basket page and the search pop-up
// ===========================================================
(function () {
  const KEY = 'paceline_basket_v1';

  function read() {
    try {
      const a = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(a) ? a : [];
    } catch (e) { return []; }
  }
  function write() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* storage blocked: keep in memory */ }
  }

  let items = read();

  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function money(n) { return '£' + (n % 1 ? n.toFixed(2) : n); }
  function num(s) { return parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0; }

  const api = {
    slug: slug,
    money: money,
    get: function () { return items.map(function (i) { return Object.assign({}, i); }); },
    has: function (id) { return items.some(function (i) { return i.id === id; }); },
    count: function () { return items.reduce(function (n, i) { return n + i.qty; }, 0); },
    subtotal: function () { return items.reduce(function (n, i) { return n + i.price * i.qty; }, 0); },
    toggle: function (p) {
      let added;
      if (api.has(p.id)) {
        items = items.filter(function (i) { return i.id !== p.id; });
        added = false;
      } else {
        items.push({ id: p.id, brand: p.brand, name: p.name, price: p.price, was: p.was || 0, img: p.img, qty: 1 });
        added = true;
      }
      changed();
      toast(added ? 'Added to your basket' : 'Removed from your basket', added);
      return added;
    },
    setQty: function (id, q) {
      items.forEach(function (i) { if (i.id === id) i.qty = Math.max(1, Math.min(9, q)); });
      changed();
    },
    remove: function (id) { items = items.filter(function (i) { return i.id !== id; }); changed(); },
    clear: function () { items = []; changed(); }
  };
  window.PacelineStore = api;

  // ---------- header badge ----------
  function updateBadge() {
    const n = api.count();
    document.querySelectorAll('.cart-count').forEach(function (el) { el.textContent = n; el.hidden = (n === 0); });
    document.querySelectorAll('.icon-btn[aria-label^="Basket"]').forEach(function (el) {
      el.setAttribute('aria-label', 'Basket, ' + n + (n === 1 ? ' item' : ' items'));
    });
  }

  // ---------- read a product card from the page ----------
  function fromCard(card) {
    const brand = (card.querySelector('.product-brand') || {}).textContent || '';
    const name = (card.querySelector('.product-name') || {}).textContent || '';
    const priceEl = card.querySelector('.product-price');
    const was = priceEl && priceEl.querySelector('s');
    const img = card.querySelector('img');
    return {
      id: slug(brand + ' ' + name),
      brand: brand.trim(),
      name: name.trim(),
      price: priceEl ? num(priceEl.firstChild ? priceEl.firstChild.textContent : priceEl.textContent) : 0,
      was: was ? num(was.textContent) : 0,
      img: img ? img.getAttribute('src') : ''
    };
  }

  // ---------- hearts ----------
  function syncHearts() {
    document.querySelectorAll('.product').forEach(function (card) {
      const btn = card.querySelector('.wish');
      if (btn) btn.setAttribute('aria-pressed', String(api.has(fromCard(card).id)));
    });
  }

  // Capture phase: this is the only handler that reacts to hearts
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.wish');
    if (!btn) return;
    const card = btn.closest('.product');
    if (!card) return;
    e.stopPropagation();
    api.toggle(fromCard(card));
  }, true);

  // ---------- "added" message ----------
  let toastEl = null, toastTimer = null;
  function toast(message, withLink) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '<span></span>' + (withLink ? '<a href="cart.html">View basket</a>' : '');
    toastEl.firstChild.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2800);
  }

  // ---------- keep everything in sync ----------
  function changed() {
    write();
    updateBadge();
    syncHearts();
    window.dispatchEvent(new CustomEvent('basket:change'));
  }

  // Products drawn by JavaScript (shop pages) need their hearts refreshed
  let raf = 0;
  const obs = new MutationObserver(function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(syncHearts);
  });
  document.querySelectorAll('.product-grid').forEach(function (g) { obs.observe(g, { childList: true }); });

  // Another tab changed the basket
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { items = read(); updateBadge(); syncHearts(); window.dispatchEvent(new CustomEvent('basket:change')); }
  });

  updateBadge();
  syncHearts();
})();