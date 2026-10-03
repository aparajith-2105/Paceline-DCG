// ===========================================================
// PACELINE ORDERS
// Tracking + cancellation + return/exchange
// ===========================================================

(function () {

  const ordersList = document.getElementById('ordersList');
  const orderSuccess = document.getElementById('orderSuccess');

  let orders = [];

  try {
    orders = JSON.parse(
      localStorage.getItem('paceline_orders_v1') || '[]'
    );

    if (!Array.isArray(orders)) orders = [];

  } catch (e) {
    orders = [];
  }


  // -----------------------------------------------------------
  // Helpers
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


  function money(value) {
    return '£' + Number(value || 0).toFixed(2);
  }


  function formatDate(date) {
    return new Date(date).toLocaleDateString(
      'en-GB',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    );
  }


  function formatDateTime(date) {
    return new Date(date).toLocaleString(
      'en-GB',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }


  // -----------------------------------------------------------
  // Order tracking
  // -----------------------------------------------------------

  const trackingStages = [
    'Ordered',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];


  function getStatus(order) {

    if (order.status === 'Cancelled') {
      return 'Cancelled';
    }

    // New orders begin at Ordered.
    // This can later be changed from the browser/localStorage
    // while testing the tracking UI.
    return order.status || 'Ordered';
  }


  function getStageIndex(status) {

    return trackingStages.indexOf(status);

  }


  function renderTracker(order) {

    const status = getStatus(order);

    if (status === 'Cancelled') {

      return `
        <div class="order-cancelled">
          <span>✕</span>
          Order Cancelled
        </div>
      `;

    }


    const currentIndex = getStageIndex(status);

    return `
      <div class="tracking-wrapper">

        <div class="tracking-line"></div>

        <div class="tracking-steps">

          ${trackingStages.map(function (stage, index) {

            let className = '';

            if (index < currentIndex) {
              className = 'completed';
            }

            if (index === currentIndex) {
              className = 'active';
            }

            return `
              <div class="tracking-step ${className}">

                <div class="tracking-dot">
                  ${index < currentIndex ? '✓' : ''}
                </div>

                <span>
                  ${stage}
                </span>

              </div>
            `;

          }).join('')}

        </div>

      </div>
    `;

  }


  // -----------------------------------------------------------
  // Action buttons
  // -----------------------------------------------------------

  function renderActions(order) {

    const status = getStatus(order);


    if (status === 'Cancelled') {

      return `
        <div class="order-actions">

          <span class="cancelled-label">
            This order has been cancelled.
          </span>

        </div>
      `;

    }


    if (status === 'Delivered') {

      return `
        <div class="order-actions">

          <button
            class="order-action-btn return-btn"
            data-action="return"
            data-order="${esc(order.id)}"
          >
            Return / Exchange
          </button>

        </div>
      `;

    }


    return `
      <div class="order-actions">

        <button
          class="order-action-btn cancel-btn"
          data-action="cancel"
          data-order="${esc(order.id)}"
        >
          Cancel Order
        </button>

      </div>
    `;

  }


  // -----------------------------------------------------------
  // Render order
  // -----------------------------------------------------------

  function renderOrder(order) {

    const items = Array.isArray(order.items)
      ? order.items
      : [];


    const itemHTML = items.map(function (item) {

      return `
        <div class="order-item">

          <img
            src="${esc(item.img)}"
            alt="${esc(item.name)}"
          >

          <div>

            <div class="order-item-brand">
              ${esc(item.brand || '')}
            </div>

            <div class="order-item-name">
              ${esc(item.name)}
            </div>

            <div class="order-item-meta">
              Quantity: ${item.qty}
            </div>

          </div>

          <div class="order-item-price">
            ${money(item.price * item.qty)}
          </div>

        </div>
      `;

    }).join('');


    return `
      <article class="order-card">

        <div class="order-header">

          <div>

            <div class="order-id">
              ${esc(order.id)}
            </div>

            <div class="order-date">
              Ordered on ${formatDate(order.date)}
            </div>

          </div>

          <span class="order-status">
            ${esc(getStatus(order))}
          </span>

        </div>


        <div class="order-tracker-section">

          <h3>Order tracking</h3>

          ${renderTracker(order)}

        </div>


        <div class="order-products">

          <h3>Products</h3>

          ${itemHTML}

        </div>


        <div class="order-bottom">

          <div class="order-payment">

            Payment:
            <strong>
              ${esc(order.paymentMethod)}
            </strong>

          </div>

          <div class="order-total">

            Total:
            ${money(order.total)}

          </div>

        </div>


        ${renderActions(order)}

      </article>
    `;

  }


  // -----------------------------------------------------------
  // Render all orders
  // -----------------------------------------------------------

  function renderOrders() {

    if (!orders.length) {

      ordersList.innerHTML = `

        <div class="orders-empty">

          <h2>No orders yet.</h2>

          <p>
            Your completed orders will appear here.
          </p>

          <a
            href="footwear.html"
            class="btn btn-dark"
          >
            Start Shopping
          </a>

        </div>

      `;

      return;
    }


    ordersList.innerHTML =
      orders.map(renderOrder).join('');

  }


  // -----------------------------------------------------------
  // Save orders
  // -----------------------------------------------------------

  function saveOrders() {

    localStorage.setItem(
      'paceline_orders_v1',
      JSON.stringify(orders)
    );

  }


  // -----------------------------------------------------------
  // Cancel order
  // -----------------------------------------------------------

  function cancelOrder(orderId) {

    const order = orders.find(function (item) {
      return item.id === orderId;
    });


    if (!order) return;


    if (getStatus(order) === 'Delivered') {

      return;

    }


    const confirmed = window.confirm(
      'Are you sure you want to cancel this order?'
    );


    if (!confirmed) return;


    order.status = 'Cancelled';
    order.cancelledAt = new Date().toISOString();


    saveOrders();
    renderOrders();

  }


  // -----------------------------------------------------------
  // Return / Exchange popup
  // -----------------------------------------------------------

  function openReturnPopup(orderId) {

    const order = orders.find(function (item) {
      return item.id === orderId;
    });


    if (!order) return;


    if (getStatus(order) !== 'Delivered') {

      return;

    }


    const overlay =
      document.createElement('div');

    overlay.className =
      'return-modal-overlay';


    overlay.innerHTML = `

      <div
        class="return-modal"
        role="dialog"
        aria-modal="true"
      >

        <button
          class="return-modal-close"
          type="button"
          aria-label="Close"
        >
          ×
        </button>


        <p class="return-modal-kicker">
          ORDER ${esc(order.id)}
        </p>

        <h2>
          Return or Exchange
        </h2>

        <p class="return-modal-description">
          Select what you would like to do with your delivered product.
        </p>


        <div class="return-type-options">

          <label class="return-type selected">

            <input
              type="radio"
              name="returnType"
              value="Return"
              checked
            >

            <span>

              <strong>Return</strong>

              <small>
                Send the product back for a return.
              </small>

            </span>

          </label>


          <label class="return-type">

            <input
              type="radio"
              name="returnType"
              value="Exchange"
            >

            <span>

              <strong>Exchange</strong>

              <small>
                Request a replacement product.
              </small>

            </span>

          </label>

        </div>


        <label class="return-reason-label">

          Reason

          <select id="returnReason">

            <option value="">
              Select a reason
            </option>

            <option>
              Size issue
            </option>

            <option>
              Damaged product
            </option>

            <option>
              Wrong product received
            </option>

            <option>
              Product not as expected
            </option>

            <option>
              Other
            </option>

          </select>

        </label>


        <div class="return-modal-actions">

          <button
            type="button"
            class="return-cancel-btn"
          >
            Cancel
          </button>

          <button
            type="button"
            class="return-submit-btn"
          >
            Continue
          </button>

        </div>

      </div>

    `;


    document.body.appendChild(overlay);


    // Close popup

    function closeModal() {
      overlay.remove();
    }


    overlay
      .querySelector('.return-modal-close')
      .addEventListener('click', closeModal);


    overlay
      .querySelector('.return-cancel-btn')
      .addEventListener('click', closeModal);


    overlay.addEventListener('click', function (event) {

      if (event.target === overlay) {
        closeModal();
      }

    });


    // Change selected return type

    overlay
      .querySelectorAll('input[name="returnType"]')
      .forEach(function (radio) {

        radio.addEventListener('change', function () {

          overlay
            .querySelectorAll('.return-type')
            .forEach(function (option) {

              option.classList.toggle(
                'selected',
                option.querySelector('input').checked
              );

            });

        });

      });


    // Submit request

    overlay
      .querySelector('.return-submit-btn')
      .addEventListener('click', function () {

        const type =
          overlay.querySelector(
            'input[name="returnType"]:checked'
          ).value;


        const reason =
          overlay
            .querySelector('#returnReason')
            .value;


        if (!reason) {

          alert('Please select a reason.');

          return;

        }


        order.returnRequest = {

          type: type,

          reason: reason,

          date: new Date().toISOString(),

          status: 'Request submitted'

        };


        saveOrders();

        closeModal();

        renderOrders();

        alert(
          `${type} request submitted successfully.`
        );

      });

  }


  // -----------------------------------------------------------
  // Button events
  // -----------------------------------------------------------

  ordersList.addEventListener('click', function (event) {

    const button =
      event.target.closest('[data-action]');


    if (!button) return;


    const action =
      button.dataset.action;


    const orderId =
      button.dataset.order;


    if (action === 'cancel') {

      cancelOrder(orderId);

    }


    if (action === 'return') {

      openReturnPopup(orderId);

    }

  });


  // -----------------------------------------------------------
  // Recently placed message
  // -----------------------------------------------------------

  const params =
    new URLSearchParams(window.location.search);

  const placed =
    params.get('placed');


  if (placed && orderSuccess) {

    orderSuccess.innerHTML = `

      <div class="order-success">

        <strong>Order placed successfully!</strong>

        <br>

        Your order ID is
        <b>${esc(placed)}</b>.

      </div>

    `;

  }


  renderOrders();

})();