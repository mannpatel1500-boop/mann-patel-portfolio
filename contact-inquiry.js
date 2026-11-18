(() => {
  'use strict';
  const form = document.querySelector('#email-inquiry-form');
  const emailLink = document.querySelector('#inquiry-mailto-link');
  const status = document.querySelector('#inquiry-status');
  if (!form || !emailLink) return;

  // Keep the single animated guide clear of the form.
  const contact = document.querySelector('#contact');
  if (contact && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      document.body.classList.toggle('inquiry-in-view', Boolean(entries[0] && entries[0].isIntersecting));
    }, {rootMargin: '-12% 0px -12% 0px', threshold: 0});
    observer.observe(contact);
  }

  const recipient = 'mathgem010@gmail.com';
  const values = () => ({
    name: form.elements.namedItem('name').value.trim(),
    email: form.elements.namedItem('email').value.trim(),
    message: form.elements.namedItem('message').value.trim()
  });
  function links() {
    const {name,email,message} = values();
    const subject = `Portfolio inquiry — ${name || 'Website visitor'}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const gmail = 'https://mail.google.com/mail/?view=cm&fs=1'
        + `&to=${encodeURIComponent(recipient)}`
        + `&su=${encodeURIComponent(subject)}`
        + `&body=${encodeURIComponent(body)}`;
    return {mailto,gmail};
  }
  function refreshLink() { emailLink.href = links().mailto; }
  function showFallback(gmail) {
    if (!status) return;
    status.replaceChildren();
    status.append('If your email app didn’t open, ');
    const a = document.createElement('a');
    a.href = gmail;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'open Gmail instead ↗';
    status.append(a, '.');
  }
  form.addEventListener('input', refreshLink);
  // A real anchor click asks the browser to open its registered mailto handler.
  emailLink.addEventListener('click', event => {
    if (!form.reportValidity()) { event.preventDefault(); return; }
    const {mailto,gmail} = links();
    emailLink.href = mailto;
    showFallback(gmail);
    // Do not preventDefault: a native mailto: link is more reliable than a script redirect.
  });
  // If a visitor presses Enter in an input, use the same destination.
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const {mailto,gmail} = links();
    showFallback(gmail);
    window.location.assign(mailto);
  });
  refreshLink();
})();
