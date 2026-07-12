/* ============================================================
   SafeHer Watch — shared utilities
   Loaded on every screen: live clock, battery readout, toast helper
   ============================================================ */

(function () {
  "use strict";

  /* ---------- live clock ---------- */
  function updateClock() {
    const els = document.querySelectorAll("[data-clock]");
    if (!els.length) return;
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    const text = `${h}:${m} ${ampm}`;
    els.forEach((el) => (el.textContent = text));
  }
  updateClock();
  setInterval(updateClock, 1000 * 10);

  /* ---------- battery readout (falls back to a static 78% if unavailable) ---------- */
  function paintBattery(level, charging) {
    const fills = document.querySelectorAll("[data-battery-fill]");
    fills.forEach((f) => {
      f.style.width = Math.max(6, Math.round(level * 100)) + "%";
      f.style.background =
        level <= 0.2 ? "#FF3B30" : charging ? "#30D158" : "#30D158";
    });
  }
  if (navigator.getBattery) {
    navigator
      .getBattery()
      .then((batt) => {
        paintBattery(batt.level, batt.charging);
        batt.addEventListener("levelchange", () =>
          paintBattery(batt.level, batt.charging),
        );
        batt.addEventListener("chargingchange", () =>
          paintBattery(batt.level, batt.charging),
        );
      })
      .catch(() => paintBattery(0.78, false));
  } else {
    paintBattery(0.78, false);
  }

  /* ---------- toast helper, available globally ---------- */
  window.SafeHer = window.SafeHer || {};
  window.SafeHer.toast = function (message, opts) {
    opts = opts || {};
    const type = opts.type || "ok"; // ok | err | info
    const duration = opts.duration || 2600;
    const host = document.querySelector("[data-toast]");
    if (!host) return;
    host.querySelector("[data-toast-text]").textContent = message;
    host.classList.remove("err", "info");
    if (type !== "ok") host.classList.add(type);
    host.classList.add("show");
    clearTimeout(host._timer);
    host._timer = setTimeout(() => host.classList.remove("show"), duration);
  };

  /* ---------- tiny helper: navigate with a soft fade ---------- */
  window.SafeHer.go = function (url) {
    const screen = document.querySelector(".screen");
    if (screen) {
      screen.style.transition = "opacity .18s ease";
      screen.style.opacity = "0";
    }
    setTimeout(() => {
      window.location.href = url;
    }, 160);
  };
})();
