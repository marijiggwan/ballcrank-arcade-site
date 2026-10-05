/* Ballcrank Arcade — small site script. No dependencies. */
(function () {
  'use strict';

  // Copyright year
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });
  }

  // Add to calendar menu: close on Escape or outside click
  var cal = document.querySelector('details.cal');
  if (cal) {
    document.addEventListener('click', function (e) {
      if (cal.open && !cal.contains(e.target)) cal.open = false;
    });
    cal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { cal.open = false; cal.querySelector('summary').focus(); }
    });
  }

  // FAQ: open every item for print
  var faqItems = document.querySelectorAll('.faq details');
  var faqState = [];
  window.addEventListener('beforeprint', function () {
    faqState = [];
    faqItems.forEach(function (d) { faqState.push(d.open); d.open = true; });
  });
  window.addEventListener('afterprint', function () {
    faqItems.forEach(function (d, i) { d.open = !!faqState[i]; });
  });

  // GA4 events (Blueprint section 7). Sends only when gtag is loaded.
  // Event names: rsvp_click, calendar_add, directions_click, vendor_apply_click, fridays_signup
  var track = function (name) {
    if (typeof window.gtag === 'function') window.gtag('event', name);
  };
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) track(el.getAttribute('data-track'));
  });

  // Fridays signup: text error message, then track
  var form = document.querySelector('form[name="fridays-updates"]');
  if (form) {
    var email = form.querySelector('input[type="email"]');
    var err = document.getElementById('email-error');
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      if (!email.value || !email.checkValidity()) {
        e.preventDefault();
        err.hidden = false;
        email.setAttribute('aria-invalid', 'true');
        email.focus();
        return;
      }
      err.hidden = true;
      email.removeAttribute('aria-invalid');
      track('fridays_signup');
    });
  }
})();
