(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const done = document.getElementById('contactDone');

  function setError(id, message) {
    const field = document.getElementById(id).closest('.field');
    field.classList.toggle('invalid', Boolean(message));
    const err = field.querySelector('.err');
    if (err && message) err.textContent = message;
  }

  // Clear a field's error as soon as the person edits it
  form.addEventListener('input', function (e) {
    const f = e.target.closest('.field');
    if (f) f.classList.remove('invalid');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let ok = true;

    const name = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const message = document.getElementById('cMessage').value.trim();

    setError('cName', name ? '' : 'Enter your name.');
    if (!name) ok = false;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setError('cEmail', emailOk ? '' : 'Enter a valid email address.');
    if (!emailOk) ok = false;

    const msgOk = message.length >= 10;
    setError('cMessage', msgOk ? '' : 'Write at least a short sentence so we can help.');
    if (!msgOk) ok = false;

    if (!ok) {
      const firstBad = form.querySelector('.field.invalid input, .field.invalid textarea');
      if (firstBad) firstBad.focus();
      return;
    }

    // NOTE: nothing is sent anywhere yet. Connect a form service or backend here.
    document.getElementById('contactName').textContent = name.split(' ')[0];
    document.getElementById('contactEmail').textContent = email;
    form.hidden = true;
    done.classList.add('show');
    done.setAttribute('tabindex', '-1');
    done.focus();
  });

  document.getElementById('sendAnother').addEventListener('click', function () {
    form.reset();
    form.hidden = false;
    done.classList.remove('show');
    document.getElementById('cName').focus();
  });
})();