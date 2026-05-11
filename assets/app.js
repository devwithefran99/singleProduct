// =============================================
// BanglaBazar — app.js
// =============================================

const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyEN8-O5141mUr_cazY2fgRGrycg2-Mac69txD1WXvdkZHZ2XP6rBcilBF_3cDpPZBm/exec";

// Product price
const PRICE = 999;

// =============================================
// COUPON SYSTEM — Secret, not visible in form
// =============================================
const COUPONS = {
  "SAVE5":   5,
  "DEAL10":  10,
  "SUPER15": 15,
  "VIP20":   20,
};

let appliedCoupon = null; // { code: "DEAL10", pct: 10 }

function toggleCouponBox() {
  var box = document.getElementById("couponSection");
  var trigger = document.getElementById("couponTriggerText");
  var isVisible = box.style.display === "block";
  box.style.display = isVisible ? "none" : "block";
  trigger.textContent = isVisible
    ? "আপনার কাছে কি কোনো Coupon Code আছে?"
    : "Hide Coupon Code";
}

function applyCoupon() {
  var input   = document.getElementById("couponInput");
  var msgEl   = document.getElementById("couponMsg");
  var code    = input.value.trim().toUpperCase();

  msgEl.className = "coupon-msg";
  msgEl.style.display = "none";

  if (!code) {
    msgEl.className = "coupon-msg coupon-error";
    msgEl.textContent = "Coupon code লিখুন।";
    msgEl.style.display = "block";
    return;
  }

  if (appliedCoupon) {
    msgEl.className = "coupon-msg coupon-error";
    msgEl.textContent = "একটি coupon আগে থেকেই apply করা আছে।";
    msgEl.style.display = "block";
    return;
  }

  if (COUPONS[code] !== undefined) {
    appliedCoupon = { code: code, pct: COUPONS[code] };
    input.disabled = true;
    document.getElementById("couponApplyBtn").disabled = true;

    msgEl.className = "coupon-msg coupon-success";
    msgEl.innerHTML =
      '"' + code + '" সফলভাবে apply হয়েছে — ' + COUPONS[code] + '% discount পাচ্ছেন! ' +
      '<span class="coupon-remove" onclick="removeCoupon()">সরান ✕</span>';
    msgEl.style.display = "block";

    updateSummary();
  } else {
    msgEl.className = "coupon-msg coupon-error";
    msgEl.textContent = "Coupon code টি সঠিক নয়।";
    msgEl.style.display = "block";
  }
}

function removeCoupon() {
  appliedCoupon = null;
  var input = document.getElementById("couponInput");
  input.value = "";
  input.disabled = false;
  document.getElementById("couponApplyBtn").disabled = false;

  var msgEl = document.getElementById("couponMsg");
  msgEl.style.display = "none";

  updateSummary();
}

function updateSummary() {
  var qty      = parseInt(document.getElementById("qty").value) || 1;
  var subtotal = PRICE * qty;
  var gm       = qty * 330;

  document.getElementById("summaryQty").textContent = "× " + qty + " Pack (" + gm + " gm)";

  var discountRow = document.getElementById("discountRow");
  var discountAmt = document.getElementById("discountAmt");
  var discountLbl = document.getElementById("discountLabel");

  if (appliedCoupon) {
    var disc = Math.round(subtotal * appliedCoupon.pct / 100);
    discountRow.style.display = "flex";
    discountLbl.textContent   = "(" + appliedCoupon.pct + "% — " + appliedCoupon.code + ")";
    discountAmt.textContent   = "− ৳ " + disc.toLocaleString();
    document.getElementById("summaryTotal").textContent = "৳ " + (subtotal - disc).toLocaleString();
  } else {
    discountRow.style.display = "none";
    document.getElementById("summaryTotal").textContent = "৳ " + subtotal.toLocaleString();
  }
}

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
  thumb.onclick = function () { loadYT(this); };
  var titleEl = document.querySelector(".video-meta-title");
  if (titleEl) titleEl.textContent = title;
  document.querySelectorAll(".vid-tab").forEach(function (t) { t.classList.remove("active-tab"); });
  if (btn) btn.classList.add("active-tab");
}

/* ===== THEME TOGGLE ===== */
var html      = document.documentElement;
var themeIcon = document.getElementById("theme-icon");
var themeLabel = document.getElementById("theme-label");
var dark = false;

function toggleTheme() {
  dark = !dark;
  html.setAttribute("data-theme", dark ? "dark" : "light");
  themeIcon.className    = dark ? "fas fa-sun" : "fas fa-moon";
  themeLabel.textContent = dark ? "Light" : "Dark";
}

/* ===== QUANTITY ===== */
function changeQty(delta) {
  var inp = document.getElementById("qty");
  var v   = parseInt(inp.value) + delta;
  if (v < 1)  v = 1;
  if (v > 10) v = 10;
  inp.value = v;
  updateSummary();
}

/* ===== PAYMENT TOGGLE ===== */
function handlePayment() {
  var bkash = document.getElementById("payBkash").checked;
  var box   = document.getElementById("bkashBox");
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

  // --- Calculate final price with coupon ---
  var subtotal  = PRICE * qty;
  var discount  = 0;
  var finalPrice = subtotal;

  if (appliedCoupon) {
    discount   = Math.round(subtotal * appliedCoupon.pct / 100);
    finalPrice = subtotal - discount;
  }

  // --- Prepare order data ---
  var orderData = {
    name:          name,
    phone:         phone,
    address:       address,
    quantity:      qty,
    totalPrice:    "৳ " + finalPrice.toLocaleString(),
    paymentMethod: bkash ? "bKash" : "Cash on Delivery",
    transactionId: bkash ? trxId : "N/A",
    couponCode:    appliedCoupon ? appliedCoupon.code : "N/A",
    discount:      appliedCoupon ? (appliedCoupon.pct + "% (− ৳ " + discount.toLocaleString() + ")") : "N/A",
  };

  // --- Disable button & show loading ---
  var btn = document.querySelector(".btn-confirm");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  // --- Send to Google Sheets ---
  fetch(SHEET_API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  })
    .then(function () {
      document.getElementById("orderForm").style.display = "none";
      var sb = document.getElementById("successBox");
      sb.classList.add("show");
      window.scrollTo({
        top: document.getElementById("order").offsetTop - 80,
        behavior: "smooth",
      });
    })
    .catch(function (err) {
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
document.querySelectorAll(".fade-up").forEach(function (el) { obs.observe(el); });