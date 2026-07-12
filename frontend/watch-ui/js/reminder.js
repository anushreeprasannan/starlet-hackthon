/* ============================================================
   SafeHer Watch — Medicine reminder
   "Done" logs completion. "Snooze 10 min" schedules a real
   re-alert 10 minutes out (persisted in localStorage so it
   survives a refresh) and re-notifies via the Notification API
   and device vibration when it fires.
   ============================================================ */

(function () {
  "use strict";

  const SNOOZE_KEY = "safeher_medicine_snooze_until";
  const LOG_KEY = "safeher_medicine_log";
  const SNOOZE_MINUTES = 10;

  const states = document.querySelectorAll("[data-state]");
  const medTime = document.querySelector("[data-med-time]");
  const doneTime = document.querySelector("[data-done-time]");
  const doneBtn = document.querySelector("[data-done-btn]");
  const snoozeBtn = document.querySelector("[data-snooze-btn]");

  function setState(name) {
    states.forEach((s) =>
      s.classList.toggle("active", s.dataset.state === name),
    );
  }

  function timeLabel(d) {
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  // Show the scheduled dose time (defaults to "now" for the demo).
  medTime.textContent = timeLabel(new Date());

  function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  function logEvent(action) {
    try {
      const log = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
      log.push({ action, at: new Date().toISOString() });
      localStorage.setItem(LOG_KEY, JSON.stringify(log));
    } catch (e) {
      /* ignore storage errors */
    }
  }

  async function notifyAdminAndUser(title, body) {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch (e) {
          /* ignore */
        }
      }
      if (Notification.permission === "granted") {
        new Notification(title, { body });
      }
    }
  }

  doneBtn.addEventListener("click", () => {
    vibrate(40);
    logEvent("done");
    localStorage.removeItem(SNOOZE_KEY);
    doneTime.textContent = timeLabel(new Date());
    setState("done");
    SafeHer.toast("Marked as taken");
  });

  snoozeBtn.addEventListener("click", () => {
    vibrate([20, 40, 20]);
    logEvent("snoozed");
    const until = Date.now() + SNOOZE_MINUTES * 60 * 1000;
    localStorage.setItem(SNOOZE_KEY, String(until));
    scheduleSnoozeAlert(until);
    setState("snoozed");
    SafeHer.toast(`Snoozed for ${SNOOZE_MINUTES} min`, { type: "info" });
  });

  function scheduleSnoozeAlert(until) {
    const delay = Math.max(0, until - Date.now());
    setTimeout(() => {
      vibrate([80, 60, 80, 60, 80]);
      notifyAdminAndUser("Take Medicine", "It’s time for your snoozed dose.");
      SafeHer.toast("Time to take your medicine", {
        type: "err",
        duration: 5000,
      });
      setState("due");
      medTime.textContent = timeLabel(new Date());
    }, delay);
  }

  // If a snooze was already pending from a previous visit, keep honoring it.
  const pending = Number(localStorage.getItem(SNOOZE_KEY) || 0);
  if (pending && pending > Date.now()) {
    setState("snoozed");
    scheduleSnoozeAlert(pending);
  } else if (pending) {
    localStorage.removeItem(SNOOZE_KEY);
  }
})();
