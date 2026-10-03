(function () {
  const tabsBox = document.getElementById('authTabs');
  if (!tabsBox) return;

  const tabs = {
    signin: document.getElementById('tab-signin'),
    signup: document.getElementById('tab-signup')
  };
  const panels = {
    signin: document.getElementById('panel-signin'),
    signup: document.getElementById('panel-signup'),
    reset: document.getElementById('panel-reset')
  };
  const done = document.getElementById('authDone');

  function show(name) {
    Object.keys(panels).forEach(function (k) { panels[k].hidden = (k !== name); });
    done.classList.remove('show');
    tabsBox.hidden = (name === 'reset');
    Object.keys(tabs).forEach(function (k) {
      const on = (k === name);
      tabs[k].setAttribute('aria-selected', String(on));
      tabs[k].tabIndex = on ? 0 : -1;
    });
  }

  function focusFirst(name) {
    const el = panels[name].querySelector('input');
    if (el) el.focus();
  }

  // Tabs: click + arrow keys
  tabs.signin.addEventListener('click', function () { show('signin'); focusFirst('signin'); });
  tabs.signup.addEventListener('click', function () { show('signup'); focusFirst('signup'); });
  tabsBox.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const next = tabs.signin.getAttribute('aria-selected') === 'true' ? 'signup' : 'signin';
    show(next);
    tabs[next].focus();
  });

  document.getElementById('forgotLink').addEventListener('click', function () { show('reset'); focusFirst('reset'); });
  document.getElementById('backToSignin').addEventListener('click', function () { show('signin'); focusFirst('signin'); });

  // Show / hide password
  document.querySelectorAll('.pw-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const input = btn.parentElement.querySelector('input');
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.textContent = showing ? 'Show' : 'Hide';
      btn.setAttribute('aria-pressed', String(!showing));
      btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });
  });

  // Clear a field's error as soon as the person edits it
  document.querySelector('.auth-card').addEventListener('input', function (e) {
    const f = e.target.closest('.field');
    if (f) f.classList.remove('invalid');
  });

  function setError(id, message) {
    const field = document.getElementById(id).closest('.field');
    field.classList.toggle('invalid', Boolean(message));
    const err = field.querySelector('.err');
    if (err && message) err.textContent = message;
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function finish(title, text) {
    Object.keys(panels).forEach(function (k) { panels[k].hidden = true; });
    tabsBox.hidden = true;
    document.getElementById('doneTitle').textContent = title;
    document.getElementById('doneText').textContent = text;
    done.classList.add('show');
    done.setAttribute('tabindex', '-1');
    done.focus();
  }

  function firstInvalid(form) {
    const el = form.querySelector('.field.invalid input');
    if (el) el.focus();
  }

  // Sign in
  panels.signin.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('siEmail').value.trim();
    const pass = document.getElementById('siPass').value;
    const okE = emailRe.test(email), okP = pass.length > 0;
    setError('siEmail', okE ? '' : 'Enter a valid email address.');
    setError('siPass', okP ? '' : 'Enter your password.');
    if (!okE || !okP) return firstInvalid(panels.signin);
    // NOTE: connect your real sign-in (backend / auth service) here.
    finish('You’re signed in.', 'Signed in as ' + email + '.');
  });

  // Create account
  panels.signup.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('suName').value.trim();
    const email = document.getElementById('suEmail').value.trim();
    const pass = document.getElementById('suPass').value;
    const okN = name.length > 0, okE = emailRe.test(email), okP = pass.length >= 8;
    setError('suName', okN ? '' : 'Enter your name.');
    setError('suEmail', okE ? '' : 'Enter a valid email address.');
    setError('suPass', okP ? '' : 'Use at least 8 characters.');
    if (!okN || !okE || !okP) return firstInvalid(panels.signup);
    // NOTE: connect your real account creation (backend / auth service) here.
    finish('Welcome, ' + name.split(' ')[0] + '.', 'Your account has been created for ' + email + '.');
  });

  // Reset password
  panels.reset.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('rsEmail').value.trim();
    const ok = emailRe.test(email);
    setError('rsEmail', ok ? '' : 'Enter a valid email address.');
    if (!ok) return firstInvalid(panels.reset);
    // NOTE: connect your real password-reset email here.
    finish('Check your inbox.', 'If ' + email + ' has an account, a reset link is on its way.');
  });
})();