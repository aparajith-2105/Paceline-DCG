// ===========================================================
// BASKET PAGE — draws everything the person saved with the hearts.
// ===========================================================
(function () {
  const listEl = document.getElementById('cartList');
  if (!listEl) return;

  const S = window.PacelineStore;
  const FREE_OVER = 75;      // free UK delivery from this subtotal
  const DELIVERY_FEE = 4.95; // delivery cost below that

  const grid = document.getElementById('cartGrid');
  const empty = document.getElementById('cartEmpty');
  const note = document.getElementById('cartNote');

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function render() {
    const items = S.get();
    grid.hidden = items.length === 0;
    empty.hidden = items.length !== 0;
    if (!items.length) return;

    listEl.innerHTML = items.map(function (i) {
      return '<article class="cart-item" data-id="' + esc(i.id) + '">' +
        '<img src="' + esc(i.img) + '" alt="' + esc(i.name) + '">' +
        '<div class="ci-info">' +
          '<p class="product-brand">' + esc(i.brand) + '</p>' +
          '<h3 class="product-name">' + esc(i.name) + '</h3>' +
          '<p class="product-price">' + S.money(i.price) + (i.was ? '<s>' + S.money(i.was) + '</s>' : '') + '</p>' +
          '<div class="qty" role="group" aria-label="Quantity">' +
            '<button type="button" data-act="dec" aria-label="Decrease quantity">−</button>' +
            '<span aria-live="polite">' + i.qty + '</span>' +
            '<button type="button" data-act="inc" aria-label="Increase quantity">+</button>' +
          '</div>' +
        '</div>' +
        '<div class="ci-right">' +
          '<p class="ci-line">' + S.money(i.price * i.qty) + '</p>' +
          '<button type="button" class="link-btn" data-act="remove">Remove</button>' +
        '</div>' +
      '</article>';
    }).join('');

    const sub = S.subtotal();
    const shipping = sub >= FREE_OVER ? 0 : DELIVERY_FEE;
    document.getElementById('sumSub').textContent = S.money(sub);
    document.getElementById('sumShip').textContent = shipping === 0 ? 'Free' : S.money(shipping);
    document.getElementById('sumTotal').textContent = S.money(Math.round((sub + shipping) * 100) / 100);
    document.getElementById('shipBar').style.width = Math.min(100, (sub / FREE_OVER) * 100) + '%';
    document.getElementById('shipMsg').textContent = shipping === 0
      ? 'You’ve unlocked free UK delivery.'
      : 'Add ' + S.money(Math.round((FREE_OVER - sub) * 100) / 100) + ' more for free UK delivery.';
  }

  listEl.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const id = btn.closest('.cart-item').dataset.id;
    const item = S.get().filter(function (i) { return i.id === id; })[0];
    if (!item) return;
    if (btn.dataset.act === 'inc') S.setQty(id, item.qty + 1);
    if (btn.dataset.act === 'dec') S.setQty(id, item.qty - 1);
    if (btn.dataset.act === 'remove') S.remove(id);
  });

  document.getElementById('clearCart').addEventListener('click', function () { S.clear(); });

  document.getElementById('checkoutBtn').addEventListener('click', function () {
    // NOTE: connect your real checkout / payment provider here.
    note.textContent = 'Checkout isn’t connected yet.';
  });

  window.addEventListener('basket:change', render);
  render();
})();