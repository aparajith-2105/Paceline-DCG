(function () {
  const form = document.getElementById('gaitForm');
  if (!form) return;

  const done = document.getElementById('gaitDone');
  const dateInput = document.getElementById('gDate');

  // Earliest date = today
  const now = new Date();
  const pad = function (n) { return String(n).padStart(2, '0'); };
  dateInput.min = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());

  function setError(id, message) {
    const field = document.getElementById(id).closest('.field');
    field.classList.toggle('invalid', Boolean(message));
    const err = field.querySelector('.err');
    if (err && message) err.textContent = message;
  }

  function isSaturday(value) {
    const p = value.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]).getDay() === 6;
  }

  function prettyDate(value) {
    const p = value.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let ok = true;

    const name = document.getElementById('gName').value.trim();
    const email = document.getElementById('gEmail').value.trim();
    const date = dateInput.value;
    const slot = form.querySelector('input[name="slot"]:checked');

    setError('gName', name ? '' : 'Enter your name.');
    if (!name) ok = false;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setError('gEmail', emailOk ? '' : 'Enter a valid email address.');
    if (!emailOk) ok = false;

    let dateMsg = '';
    if (!date) dateMsg = 'Choose a date.';
    else if (date < dateInput.min) dateMsg = 'Choose a date from today onwards.';
    else if (!isSaturday(date)) dateMsg = 'Gait analysis runs on Saturdays. Pick a Saturday.';
    setError('gDate', dateMsg);
    if (dateMsg) ok = false;

    const slotField = document.getElementById('slotField');
    slotField.classList.toggle('invalid', !slot);
    if (!slot) ok = false;

    if (!ok) {
      const firstBad = form.querySelector('.field.invalid input, .field.invalid select');
      if (firstBad) firstBad.focus();
      return;
    }

    // NOTE: nothing is sent anywhere yet. Connect a form service or backend here.
    document.getElementById('doneName').textContent = name.split(' ')[0];
    document.getElementById('doneEmail').textContent = email;
    document.getElementById('doneDate').textContent = prettyDate(date);
    document.getElementById('doneTime').textContent = slot.value;
    form.hidden = true;
    done.classList.add('show');
    done.setAttribute('tabindex', '-1');
    done.focus();
  });

  document.getElementById('bookAnother').addEventListener('click', function () {
    form.reset();
    form.hidden = false;
    done.classList.remove('show');
    document.getElementById('gName').focus();
  });
})();