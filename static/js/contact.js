function showStatus(el, text, isError) {
  el.textContent = text;
  el.style.color = isError ? '#ef4444' : '#16a34a';
}
function contactSubmitted(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const name = document.getElementById('cname').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const message = document.getElementById('cmessage').value.trim();
  const status = document.getElementById('formStatus');
  const sendBtn = document.getElementById('sendBtn');

  if (!name || !email || !message) {
    showStatus(status, 'Please complete all fields.', true);
    return false;
  }

  // optimistic UI
  sendBtn.disabled = true;
  showStatus(status, 'Sending…', false);

  // Send via Fetch (AJAX) to keep user on page
  const data = new FormData(form);
  fetch(form.action, {
    method: 'POST',
    body: data,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
  .then(r => r.json())
  .then(json => {
    if (json.success) {
      showStatus(status, 'Thanks! Your feedback has been sent.', false);
      form.reset();
    } else {
      showStatus(status, json.error || 'Failed to send. Try again later.', true);
    }
  })
  .catch(() => {
    showStatus(status, 'Network error. Try again later.', true);
  })
  .finally(() => { sendBtn.disabled = false; });

  return false; // prevent normal submit
}
