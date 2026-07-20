document.addEventListener('DOMContentLoaded', () => {
  const fruitEl = document.getElementById('fruit');
  const qtyEl = document.getElementById('quantity');
  const emojiEl = document.getElementById('fruitEmoji');
  const nameEl = document.getElementById('fruitName');
  const unitPriceEl = document.getElementById('unitPrice');
  const totalEl = document.getElementById('summaryTotal');
  const qtySummary = document.getElementById('summaryQty');
  const mobileEl = document.getElementById('mobile');
  const submitBtn = document.getElementById('submitBtn');

  const emojiMap = {
    'apple': '🍎', 'banana': '🍌', 'mango': '🥭', 'orange':'🍊', 'grape':'🍇', 'melon':'🍉',
    'pear':'🍐', 'strawberry':'🍓', 'kiwi':'🥝'
  };

  function formatINR(v){ return '₹' + Number(v).toFixed(2); }

  function updateUI(){
    const opt = fruitEl.selectedOptions[0];
    const price = opt ? Number(opt.dataset.price || 0) : 0;
    const name = opt ? (opt.dataset.name || '') : '';
    const qty = Math.max(1, Number(qtyEl.value || 1));
    // pick emoji by name fallback
    let foundEmoji = '🍎';
    if (name) {
      const lc = name.toLowerCase();
      for (const key in emojiMap) if (lc.includes(key)) { foundEmoji = emojiMap[key]; break; }
    }
    emojiEl.textContent = foundEmoji;
    nameEl.textContent = name || 'No fruit selected';
    unitPriceEl.textContent = price ? `${formatINR(price)} / unit` : '₹0.00 / unit';
    qtySummary.textContent = qty;
    totalEl.textContent = formatINR(price * qty);
  }

  // initial update
  updateUI();

  fruitEl.addEventListener('change', updateUI);
  qtyEl.addEventListener('input', updateUI);

  // mobile inline validation hint
  mobileEl.addEventListener('input', () => {
    const ok = /^\d{0,10}$/.test(mobileEl.value);
    if (!ok) {
      mobileEl.setCustomValidity('Only digits allowed, max 10.');
    } else {
      mobileEl.setCustomValidity('');
    }
  });

  // animate success message when server returns success
  const serverSuccess = document.getElementById('serverSuccess');
  if (serverSuccess) {
    serverSuccess.style.opacity = 0;
    serverSuccess.style.transition = 'opacity .5s ease, transform .5s ease';
    requestAnimationFrame(()=>{ serverSuccess.style.opacity = 1; serverSuccess.style.transform = 'translateY(0)'; });
    setTimeout(()=>{ serverSuccess.style.opacity = 0; serverSuccess.style.transform = 'translateY(-6px)'; }, 3500);
  }

  // subtle submit button feedback
  submitBtn.addEventListener('click', () => {
    submitBtn.classList.add('busy');
    setTimeout(()=> submitBtn.classList.remove('busy'), 700);
  });
});
