 /* ===== VIDEO PLAYER ===== */
  function loadYT(el) {
    const vid = el.getAttribute('data-videoid');
    el.innerHTML = '<iframe src="https://www.youtube.com/embed/' + vid + '?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    el.style.cursor = 'default';
    el.onclick = null;
  }
 
  function switchVideo(videoId, title, btn) {
    const thumb = document.getElementById('ytThumb');
    // Reset to thumbnail view
    thumb.innerHTML = '<img src="https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg" alt="Video" onerror=\'this.src=\"https://placehold.co/800x450/1a1a2e/e63946?text=Video+Preview\"\'>' +
      '<div class="play-btn-overlay"><div class="play-circle"><i class="fab fa-youtube" style="margin-left:2px"></i></div></div>';
    thumb.setAttribute('data-videoid', videoId);
    thumb.style.cursor = 'pointer';
    thumb.onclick = function() { loadYT(this); };
    // Update title
    const titleEl = document.querySelector('.video-meta-title');
    if (titleEl) titleEl.textContent = title;
    // Update tab active state
    document.querySelectorAll('.vid-tab').forEach(t => t.classList.remove('active-tab'));
    if (btn) btn.classList.add('active-tab');
  }
 
  /* ===== THEME TOGGLE ===== */
  const html = document.documentElement;
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');
  let dark = false;
 
  function toggleTheme() {
    dark = !dark;
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    themeLabel.textContent = dark ? 'Light' : 'Dark';
  }
 
  /* ===== QTY ===== */
  const PRICE = 999;
  function changeQty(delta) {
    const inp = document.getElementById('qty');
    let v = parseInt(inp.value) + delta;
    if (v < 1) v = 1;
    if (v > 10) v = 10;
    inp.value = v;
    document.getElementById('summaryQty').textContent = '× ' + tobn(v);
    document.getElementById('summaryTotal').textContent = '৳ ' + tobn(PRICE * v).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function tobn(n) {
    const bDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return String(n).replace(/\d/g, d => bDigits[d]);
  }
 
  /* ===== PAYMENT ===== */
  function handlePayment() {
    const bkash = document.getElementById('payBkash').checked;
    const box = document.getElementById('bkashBox');
    if (bkash) { box.classList.add('show'); }
    else        { box.classList.remove('show'); }
  }
 
  /* ===== FORM VALIDATION ===== */
  function showErr(id, show) {
    const el = document.getElementById(id);
    const inp = document.getElementById(id.replace('Err',''));
    el.classList.toggle('show', show);
    if (inp) inp.classList.toggle('error', show);
  }
 
  document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
 
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const bkash = document.getElementById('payBkash').checked;
    const trxId = document.getElementById('trxId').value.trim();
 
    showErr('nameErr', !name);
    if (!name) valid = false;
 
    const phoneOk = /^01[3-9]\d{8}$/.test(phone);
    showErr('phoneErr', !phoneOk);
    if (!phoneOk) valid = false;
 
    showErr('addressErr', !address);
    if (!address) valid = false;
 
    if (bkash && !trxId) {
      showErr('trxErr', true);
      valid = false;
    } else {
      showErr('trxErr', false);
    }
 
    if (!valid) return;
 
    // Success
    document.getElementById('orderForm').style.display = 'none';
    const sb = document.getElementById('successBox');
    sb.classList.add('show');
    window.scrollTo({ top: document.getElementById('order').offsetTop - 80, behavior: 'smooth' });
  });
 
  /* ===== FADE UP OBSERVER ===== */
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));