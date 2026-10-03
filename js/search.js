// ===========================================================
// SEARCH POP-UP — opens when the search icon in the header is clicked.
// Builds its own HTML, so no page needs editing.
// ===========================================================
(function () {
  const trigger = document.querySelector('.icon-btn[aria-label="Search"]');
  if (!trigger) return;

  const S = window.PacelineStore;
  const POPULAR = ['Hoka', 'Nike', 'ON', 'Trail', 'Women', 'Sale'];
  let overlay, input, resultsEl, metaEl, lastFocus, list = null, loading = false;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // Product data comes from products.js. Pages that don't include it load it on first use.
  function withProducts(cb) {
    if (typeof PRODUCTS !== 'undefined') { list = PRODUCTS; return cb(); }
    if (loading) return;
    loading = true;
    const s = document.createElement('script');
    s.src = 'js/products.js';
    s.onload = function () { list = (typeof PRODUCTS !== 'undefined') ? PRODUCTS : []; cb(); };
    s.onerror = function () { list = []; cb(); };
    document.head.appendChild(s);
  }

  function pageFor(p) {
    if (p.cats.indexOf('footwear') !== -1) return 'footwear.html';
    if (p.cats.indexOf('apparel') !== -1) return 'apparel.html';
    return 'accessories.html';
  }
  function idOf(p) { return S.slug(p.brand + ' ' + p.name); }

  function matches(p, tokens) {
    const hay = (p.brand + ' ' + p.name + ' ' + p.cats.join(' ') + ' ' + (p.badge || '')).toLowerCase();
    return tokens.every(function (t) {
      return new RegExp('(^|[^a-z0-9])' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(hay);
    });
  }

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.innerHTML =
      '<div class="search-backdrop" data-close></div>' +
      '<div class="search-panel" role="dialog" aria-modal="true" aria-label="Search products">' +
        '<div class="wrap">' +
          '<form class="search-box" role="search" id="searchForm">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
            '<label class="sr-only" for="searchInput">Search products</label>' +
            '<input id="searchInput" type="search" placeholder="Search shoes, brands, kit…" autocomplete="off">' +
            '<button type="button" class="search-close" data-close>Close</button>' +
          '</form>' +
          '<div class="search-chips" id="searchChips"><span class="label">Popular</span>' +
            POPULAR.map(function (w) { return '<button type="button" class="chip" data-q="' + w + '">' + w + '</button>'; }).join('') +
          '</div>' +
          '<p class="search-meta" id="searchMeta" role="status"></p>' +
          '<div class="search-results" id="searchResults"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    input = overlay.querySelector('#searchInput');
    resultsEl = overlay.querySelector('#searchResults');
    metaEl = overlay.querySelector('#searchMeta');

    overlay.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) return close();
      const chip = e.target.closest('[data-q]');
      if (chip) { input.value = chip.dataset.q; render(); input.focus(); return; }
      const save = e.target.closest('.sr-save');
      if (save) {
        const p = list.filter(function (x) { return idOf(x) === save.dataset.id; })[0];
        if (p) S.toggle({ id: idOf(p), brand: p.brand, name: p.name, price: p.price, was: p.was || 0, img: p.img });
      }
    });
    input.addEventListener('input', render);
    overlay.querySelector('#searchForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const first = resultsEl.querySelector('a[href]');
      if (first) location.href = first.getAttribute('href');
    });
    overlay.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      const f = overlay.querySelectorAll('input, button, a[href]');
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    });
    window.addEventListener('basket:change', function () { if (overlay.classList.contains('open')) syncSaved(); });
  }

  function syncSaved() {
    resultsEl.querySelectorAll('.sr-save').forEach(function (b) { b.setAttribute('aria-pressed', String(S.has(b.dataset.id))); });
  }

  function render() {
    if (!list) return;
    const q = input.value.trim().toLowerCase();
    let found, label;
    if (!q) {
      found = list.filter(function (p) { return p.badge === 'new'; }).slice(0, 6);
      label = 'New in';
    } else {
      const tokens = q.split(/\s+/);
      found = list.filter(function (p) { return matches(p, tokens); }).slice(0, 12);
      label = found.length + (found.length === 1 ? ' result' : ' results') + ' for “' + input.value.trim() + '”';
    }
    metaEl.textContent = label;
    if (!found.length) {
      resultsEl.innerHTML = '<p class="search-none">No matches. Try “shoes”, “jacket” or a brand like Hoka.</p>';
      return;
    }
    resultsEl.innerHTML = found.map(function (p) {
      const id = idOf(p);
      return '<div class="sr-item">' +
        '<img src="' + esc(p.img) + '" alt="">' +
        '<a href="' + pageFor(p) + '"><p class="product-brand">' + esc(p.brand) + '</p>' +
          '<p class="product-name">' + esc(p.name) + '</p>' +
          '<p class="product-price">' + S.money(p.price) + (p.was ? '<s>' + S.money(p.was) + '</s>' : '') + '</p></a>' +
        '<button type="button" class="sr-save" data-id="' + id + '" aria-pressed="false" aria-label="Save ' + esc(p.name) + ' to basket">' +
          '<svg viewBox="0 0 24 24"><path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5c0 6.1-8 11-8 11Z"/></svg></button>' +
      '</div>';
    }).join('');
    syncSaved();
  }

  function open() {
    if (!overlay) build();
    lastFocus = document.activeElement;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    input.focus();
    withProducts(render);
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  trigger.addEventListener('click', open);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) close();
  });
})();