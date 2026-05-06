// =============================================
// BanglaBazar — app.js
// =============================================

const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyEN8-O5141mUr_cazY2fgRGrycg2-Mac69txD1WXvdkZHZ2XP6rBcilBF_3cDpPZBm/exec";

// Product price
const PRICE = 999;

/* ===== VIDEO PLAYER ===== */
function loadYT(el) {
  var vid = el.getAttribute("data-videoid");
  el.innerHTML =
    '<iframe src="https://www.youtube.com/embed/' +
    vid +
    '?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  el.style.cursor = "default";
  el.onclick = null;
}

function switchVideo(videoId, title, btn) {
  var thumb = document.getElementById("ytThumb");
  thumb.innerHTML =
    '<img src="https://img.youtube.com/vi/' +
    videoId +
    '/maxresdefault.jpg" alt="Video" onerror=\'this.src="https://placehold.co/800x450/1a1a2e/e63946?text=Video+Preview"\'>' +
    '<div class="play-btn-overlay"><div class="play-circle"><i class="fab fa-youtube" style="margin-left:2px"></i></div></div>';
  thumb.setAttribute("data-videoid", videoId);
  thumb.style.cursor = "pointer";
  thumb.onclick = function () {
    loadYT(this);
  };
  var titleEl = document.querySelector(".video-meta-title");
  if (titleEl) titleEl.textContent = title;
  document.querySelectorAll(".vid-tab").forEach(function (t) {
    t.classList.remove("active-tab");
  });
  if (btn) btn.classList.add("active-tab");
}

/* ===== THEME TOGGLE ===== */
var html = document.documentElement;
var themeIcon = document.getElementById("theme-icon");
var themeLabel = document.getElementById("theme-label");
var dark = false;

function toggleTheme() {
  dark = !dark;
  html.setAttribute("data-theme", dark ? "dark" : "light");
  themeIcon.className = dark ? "fas fa-sun" : "fas fa-moon";
  themeLabel.textContent = dark ? "Light" : "Dark";
}

/* ===== QUANTITY ===== */
function changeQty(delta) {
  var inp = document.getElementById("qty");
  var v = parseInt(inp.value) + delta;
  if (v < 1) v = 1;
  if (v > 10) v = 10;
  inp.value = v;

  var gm = v * 330;
  document.getElementById("summaryQty").textContent = "× " + v + " Pack (" + gm + " gm)";
  document.getElementById("summaryTotal").textContent = "৳ " + (PRICE * v).toLocaleString();
}

/* ===== PAYMENT TOGGLE ===== */
function handlePayment() {
  var bkash = document.getElementById("payBkash").checked;
  var box = document.getElementById("bkashBox");
  if (bkash) {
    box.classList.add("show");
  } else {
    box.classList.remove("show");
  }
}

/* ===== FORM VALIDATION ===== */
function showErr(inputId, errId, show) {
  var errEl = document.getElementById(errId);
  var inpEl = document.getElementById(inputId);
  if (errEl) errEl.classList.toggle("show", show);
  if (inpEl) inpEl.classList.toggle("error", show);
}

/* ===== SUBMIT ORDER ===== */
document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // --- Collect values ---
  var name    = document.getElementById("name").value.trim();
  var phone   = document.getElementById("phone").value.trim();
  var address = document.getElementById("address").value.trim();
  var qty     = parseInt(document.getElementById("qty").value);
  var bkash   = document.getElementById("payBkash").checked;
  var trxId   = document.getElementById("trxId").value.trim();

  // --- Validate ---
  var valid = true;

  showErr("name", "nameErr", !name);
  if (!name) valid = false;

  var phoneOk = /^01[3-9]\d{8}$/.test(phone);
  showErr("phone", "phoneErr", !phoneOk);
  if (!phoneOk) valid = false;

  showErr("address", "addressErr", !address);
  if (!address) valid = false;

  if (bkash) {
  // bKash TrxID: ঠিক 10 characters, letters ও numbers মিলিয়ে
  var trxOk = /^[A-Z0-9]{10}$/.test(trxId.toUpperCase());
  if (!trxId || !trxOk) {
    showErr("trxId", "trxErr", true);
    valid = false;
  } else {
    showErr("trxId", "trxErr", false);
  }
} else {
  showErr("trxId", "trxErr", false);
}

  if (!valid) return;

  // --- Prepare order data ---
  var orderData = {
    name:          name,
    phone:         phone,
    address:       address,
    quantity:      qty,
    totalPrice:    "৳ " + (PRICE * qty).toLocaleString(),
    paymentMethod: bkash ? "bKash" : "Cash on Delivery",
    transactionId: bkash ? trxId : "N/A",
  };

  // --- Disable button & show loading ---
  var btn = document.querySelector(".btn-confirm");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  // --- Send to Google Sheets ---
  fetch(SHEET_API_URL, {
    method: "POST",
    // mode: "no-cors" used because Apps Script doesn't support full CORS
    // Data still saves successfully — we just can't read the response
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  })
    .then(function () {
      // Show success (no-cors means response is opaque, so we assume success)
      document.getElementById("orderForm").style.display = "none";
      var sb = document.getElementById("successBox");
      sb.classList.add("show");
      window.scrollTo({
        top: document.getElementById("order").offsetTop - 80,
        behavior: "smooth",
      });
    })
    .catch(function (err) {
      // Show error
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check-circle"></i> Confirm Order';
      alert("Something went wrong. Please try again.\n" + err);
    });
});

/* ===== FADE UP ON SCROLL ===== */
var obs = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".fade-up").forEach(function (el) {
  obs.observe(el);
});