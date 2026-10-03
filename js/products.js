// ===========================================================
// PRODUCT DATA — edit this list to add / change products.
// cats: which pages the product shows on
//       (men, women, footwear, apparel). Brands page shows all.
// badge: 'new' | 'sale' | ''   (sale products need a `was` price)
// img: change to each product's own photo, e.g. 'img/brooks-ghost.jpg'
// ===========================================================
const PRODUCTS = [
  { name: 'Forerunner 265 — Black',            brand: 'Garmin',      price: 429, badge: 'new',  cats: ['accessories'], img: 'img/forerunner.jpg' },
  { name: 'Pace 3 — Navy',                      brand: 'Coros',       price: 219, badge: '',     cats: ['accessories'], img: 'img/pace.jpg' },
  { name: 'Active Skin 8 Vest — Black',         brand: 'Salomon',     price: 120, badge: '',     cats: ['accessories'], img: 'img/active.jpg' },
  { name: 'OpenRun Pro Headphones — Black',     brand: 'Shokz',       price: 159, badge: 'new',  cats: ['accessories'], img: 'img/openrun.jpg' },
  { name: 'Handheld Flask 500ml',        brand: 'Nathan',      price: 22,  badge: '',     cats: ['accessories'], img: 'img/flask.jpg' },
  { name: 'Energy Gel — Box of 24',             brand: 'GU',          price: 38,  was: 48, badge: 'sale', cats: ['accessories'], img: 'img/energy.jpg' },
  { name: 'Hidden Comfort Socks — 3 pack',      brand: 'Balega',      price: 30,  badge: '',     cats: ['accessories'], img: 'img/socks.jpg' },
  { name: 'Run Cap — Black',                    brand: 'Nike',        price: 25,  badge: '',     cats: ['accessories'], img: 'img/cap.jpg' }, 
  { name: 'Cloudmonster 3 — Hyper Lily',        brand: 'ON',          price: 210, badge: 'new',  cats: ['men', 'women', 'footwear'], img: 'img/hper lily.jpg' },
  { name: 'Vaporfly 4 — Volt Ice',              brand: 'Nike',        price: 240, badge: 'new',  cats: ['men', 'women', 'footwear'], img: 'img/shoe 2.jpg' },
  { name: 'Tecton X 4 — Frost / Tangerine',     brand: 'Hoka',        price: 220, badge: 'new',  cats: ['men', 'footwear'],          img: 'img/shoe 3.webp' },
  { name: 'Megablast Glow',    brand: 'Asics',       price: 210, was: 260, badge: 'sale', cats: ['men', 'women', 'footwear'], img: 'img/shoe 4.jpg' },
  { name: 'Ghost 17 — Black / Lime',            brand: 'Brooks',      price: 140, badge: '',     cats: ['men', 'footwear'],          img: 'img/brook.jpg' },
  { name: 'Endorphin Speed 5 — Citron',         brand: 'Saucony',     price: 195, badge: 'new',  cats: ['women', 'footwear'],        img: 'img/endorphin.jpg' },
  { name: 'Fresh Foam 1080 — Cream',            brand: 'New Balance', price: 175, badge: '',     cats: ['women', 'footwear'],        img: 'img/fresh foam.jpg' },
  { name: 'Adizero Boston 13 — Solar Red',      brand: 'Adidas',      price: 160, was: 190, badge: 'sale', cats: ['men', 'footwear'],          img:'img/adizero.jpg' },
  { name: 'Speedgoat 6 — Slate',                brand: 'Hoka',        price: 155, badge: '',     cats: ['men', 'women', 'footwear'], img: 'img/speedgoat.jpg' },
  { name: 'Cloudultra 2 — Eclipse',             brand: 'ON',          price: 200, badge: '',     cats: ['men', 'footwear'],          img: 'img/cloudultra.jpg' },
  { name: 'Dri-FIT Run Tee — Chalk',            brand: 'Nike',        price: 38,  badge: '',     cats: ['men', 'apparel'],           img: 'img/tee.jpg' },
  { name: 'Pacer Half-Zip — Sage',              brand: 'Nike',        price: 70,  badge: 'new',  cats: ['women', 'apparel'],         img: 'img/half-zip.jpg' },
  { name: 'Own the Run Shorts — Black',         brand: 'Adidas',      price: 35,  was: 45,  badge: 'sale', cats: ['men', 'apparel'],           img: 'img/shorts.jpg' },
  { name: 'Weather Jacket — Navy',              brand: 'ON',          price: 220, badge: '',     cats: ['men', 'women', 'apparel'],  img: 'img/weather.jpg' },
  { name: 'Run Tights — Charcoal',              brand: 'Saucony',     price: 65,  badge: '',     cats: ['women', 'apparel'],         img: 'img/run.jpg' },
  { name: 'Performance Tank — Lime',            brand: 'Hoka',        price: 40,  badge: 'new',  cats: ['women', 'apparel'],         img: 'img/performance.jpg' },
  { name: 'Run Visible Vest — Hi-Vis',          brand: 'Brooks',      price: 90,  was: 120, badge: 'sale', cats: ['men', 'women', 'apparel'],  img: 'img/visible.jpg' }
];

// ===========================================================
// PAGE LOGIC — you don't need to change anything below.
// ===========================================================
(function () {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;

  const page = document.body.dataset.page; // men | women | footwear | apparel | brands | sale
  const pool = PRODUCTS.filter(function (p) {
    if (page === 'brands') return true;
    if (page === 'sale') return p.badge === 'sale';
    return p.cats.indexOf(page) !== -1;
  });

  const chipsBox = document.getElementById('brandChips');
  const countEl = document.getElementById('resultCount');
  const sortEl = document.getElementById('sortSelect');
  let brand = 'All';

  const brands = ['All'].concat(
    Array.from(new Set(pool.map(function (p) { return p.brand; }))).sort()
  );

  function drawChips() {
    chipsBox.innerHTML = brands.map(function (b) {
      return '<button type="button" class="chip" data-brand="' + b + '" aria-pressed="' + (b === brand) + '">' + b + '</button>';
    }).join('');
  }

  function card(p) {
    const badge = p.badge
      ? '<span class="badge' + (p.badge === 'sale' ? ' sale' : '') + '">' + (p.badge === 'sale' ? 'Sale' : 'New') + '</span>'
      : '';
    const was = p.was ? '<s>£' + p.was + '</s>' : '';
    return '<article class="product">' +
      '<div class="product-img">' + badge +
      '<button class="wish" type="button" aria-label="Save ' + p.name + '" aria-pressed="false"><svg viewBox="0 0 24 24"><path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5c0 6.1-8 11-8 11Z"/></svg></button>' +
      '<img src="' + p.img + '" alt="' + p.name + '"></div>' +
      '<div class="product-info"><p class="product-brand">' + p.brand + '</p>' +
      '<h3 class="product-name">' + p.name + '</h3>' +
      '<p class="product-price">£' + p.price + was + '</p></div></article>';
  }

  function render() {
    let list = pool.filter(function (p) { return brand === 'All' || p.brand === brand; });
    const s = sortEl.value;
    if (s === 'low') list = list.slice().sort(function (a, b) { return a.price - b.price; });
    if (s === 'high') list = list.slice().sort(function (a, b) { return b.price - a.price; });
    if (s === 'az') list = list.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });

    countEl.textContent = list.length + (list.length === 1 ? ' product' : ' products');
    grid.innerHTML = list.length
      ? list.map(card).join('')
      : '<p class="shop-empty">Nothing here yet. Check back soon.</p>';
  }

  chipsBox.addEventListener('click', function (e) {
    const b = e.target.closest('.chip');
    if (!b) return;
    brand = b.dataset.brand;
    drawChips();
    render();
  });
  sortEl.addEventListener('change', render);
  grid.addEventListener('click', function (e) {
    const w = e.target.closest('.wish');
    if (w) w.setAttribute('aria-pressed', String(w.getAttribute('aria-pressed') !== 'true'));
  });

  drawChips();
  render();
})();