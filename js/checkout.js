// ===========================================================
// PACELINE CHECKOUT
// Uses the existing PacelineStore basket.
// ===========================================================

(function () {

  const S = window.PacelineStore;

  if (!S) {
    console.error('PacelineStore not found.');
    return;
  }

  const items = S.get();

  const checkoutItems = document.getElementById('checkoutItems');
  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  const checkoutShipping = document.getElementById('checkoutShipping');
  const checkoutTotal = document.getElementById('checkoutTotal');

  const form = document.getElementById('checkoutForm');
  const error = document.getElementById('checkoutError');

  const FREE_OVER = 75;
  const DELIVERY_FEE = 4.95;


  // -----------------------------------------------------------
  // Stop checkout if basket is empty
  // -----------------------------------------------------------

  if (!items.length) {

    checkoutItems.innerHTML =
      '<p>Your basket is empty.</p>';

    document.querySelector('.checkout-section').innerHTML = `
      <div class="checkout-success">
        <h1>Your basket is empty.</h1>
        <p>Add some products before checking out.</p>
        <a class="btn btn-dark" href="footwear.html">
          Continue Shopping
        </a>
      </div>
    `;

    return;
  }


  // -----------------------------------------------------------
  // Escape HTML
  // -----------------------------------------------------------

  function esc(value) {

    return String(value).replace(/[&<>"']/g, function (c) {

      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[c];

    });

  }


  // -----------------------------------------------------------
  // Render order items
  // -----------------------------------------------------------

  function renderItems() {

    checkoutItems.innerHTML = items.map(function (item) {

      return `
        <div class="checkout-item">

          <img
            src="${esc(item.img)}"
            alt="${esc(item.name)}"
          >

          <div>
            <div class="checkout-item-name">
              ${esc(item.name)}
            </div>

            <div class="checkout-item-meta">
              ${esc(item.brand)} · Qty ${item.qty}
            </div>
          </div>

          <div class="checkout-item-price">
            ${S.money(item.price * item.qty)}
          </div>

        </div>
      `;

    }).join('');

  }


  // -----------------------------------------------------------
  // Calculate totals
  // -----------------------------------------------------------

  const subtotal = S.subtotal();

  const shipping =
    subtotal >= FREE_OVER
      ? 0
      : DELIVERY_FEE;

  const total =
    Math.round((subtotal + shipping) * 100) / 100;


  checkoutSubtotal.textContent = S.money(subtotal);

  checkoutShipping.textContent =
    shipping === 0
      ? 'Free'
      : S.money(shipping);

  checkoutTotal.textContent = S.money(total);

  renderItems();


  // -----------------------------------------------------------
  // Payment method switching
  // -----------------------------------------------------------

  const paymentOptions =
    document.querySelectorAll('.payment-option');

  const upiFields =
    document.getElementById('upiFields');

  const cardFields =
    document.getElementById('cardFields');


  function updatePaymentFields() {

    paymentOptions.forEach(function (option) {

      const radio = option.querySelector('input');

      option.classList.toggle(
        'selected',
        radio.checked
      );

    });


    const selected =
      document.querySelector(
        'input[name="payment"]:checked'
      );


    upiFields.classList.toggle(
      'active',
      selected && selected.value === 'UPI'
    );

    cardFields.classList.toggle(
      'active',
      selected && selected.value === 'Credit / Debit Card'
    );

  }


  document
    .querySelectorAll('input[name="payment"]')
    .forEach(function (radio) {

      radio.addEventListener(
        'change',
        updatePaymentFields
      );

    });


  updatePaymentFields();


  // -----------------------------------------------------------
  // Simple payment validation
  // -----------------------------------------------------------

  function validatePayment() {

    const selected =
      document.querySelector(
        'input[name="payment"]:checked'
      );


    if (!selected) {

      return 'Please select a payment method.';

    }


    if (selected.value === 'UPI') {

      const upi =
        document.getElementById('upiId').value.trim();


      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(upi)) {

        return 'Please enter a valid UPI ID.';

      }

    }


    if (selected.value === 'Credit / Debit Card') {

      const card =
        document.getElementById('cardNumber')
          .value
          .replace(/\s/g, '');

      const expiry =
        document.getElementById('expiry')
          .value
          .trim();

      const cvv =
        document.getElementById('cvv')
          .value
          .trim();


      if (!/^\d{16}$/.test(card)) {

        return 'Please enter a valid 16-digit card number.';

      }


      if (!/^\d{2}\/\d{2}$/.test(expiry)) {

        return 'Please enter a valid expiry date.';

      }


      if (!/^\d{3,4}$/.test(cvv)) {

        return 'Please enter a valid CVV.';

      }

    }


    return '';

  }


  // -----------------------------------------------------------
  // Place order
  // -----------------------------------------------------------

  form.addEventListener('submit', function (event) {

    event.preventDefault();

    error.textContent = '';


    if (!form.checkValidity()) {

      form.reportValidity();

      return;

    }


    const paymentError = validatePayment();


    if (paymentError) {

      error.textContent = paymentError;

      return;

    }


    const selectedPayment =
      document.querySelector(
        'input[name="payment"]:checked'
      );


    // Generate order ID
    const orderId =
      'PAC-' +
      Date.now().toString().slice(-8);


    const order = {

      id: orderId,

      date: new Date().toISOString(),

      items: items.map(function (item) {

        return Object.assign({}, item);

      }),

      subtotal: subtotal,

      shipping: shipping,

      total: total,

      paymentMethod: selectedPayment.value,

      customer: {

        firstName:
          document.getElementById('firstName').value.trim(),

        lastName:
          document.getElementById('lastName').value.trim(),

        address:
          document.getElementById('address').value.trim(),

        city:
          document.getElementById('city').value.trim(),

        postcode:
          document.getElementById('postcode').value.trim(),

        phone:
          document.getElementById('phone').value.trim()

      },

      status: 'Order placed'

    };


    // ---------------------------------------------------------
    // Save order
    // ---------------------------------------------------------

    let orders = [];

    try {

      orders =
        JSON.parse(
          localStorage.getItem('paceline_orders_v1')
          || '[]'
        );

      if (!Array.isArray(orders)) {

        orders = [];

      }

    } catch (e) {

      orders = [];

    }


    orders.unshift(order);


    localStorage.setItem(
      'paceline_orders_v1',
      JSON.stringify(orders)
    );


    // ---------------------------------------------------------
    // Clear basket
    // ---------------------------------------------------------

    S.clear();


    // ---------------------------------------------------------
    // Go to orders
    // ---------------------------------------------------------

    window.location.href =
      'orders.html?placed=' +
      encodeURIComponent(orderId);

  });

})();