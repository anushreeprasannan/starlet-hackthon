/* ============================================================
   SafeHer Watch — Emergency SOS
   On load: acquires live GPS location (watchPosition) and shows
   an acquiring/ready/unavailable status.
   On "Call Now": places an emergency call via tel: link AND
   pushes the current live location to the admin inbox
   (persisted in localStorage), then shows a confirmation.
   ============================================================ */

(function () {
  "use strict";

  const EMERGENCY_NUMBER = "112"; // change to a configured guardian/emergency number

  const locDot = document.querySelector("[data-loc-dot]");
  const locStatus = document.querySelector("[data-loc-status]");
  const callBtn = document.querySelector("[data-call-btn]");
  const states = document.querySelectorAll("[data-state]");
  const coordsOut = document.querySelector("[data-coords-out]");

  let lastPosition = null;
  let watchId = null;

  function setState(name) {
    states.forEach((s) =>
      s.classList.toggle("active", s.dataset.state === name),
    );
  }

  function setLocUI(mode, text) {
    locDot.className = "status-dot " + mode; // pending | on | off
    locStatus.textContent = text;
  }

  function fmtCoord(n) {
    return n.toFixed(5);
  }

  function beginLocating() {
    if (!("geolocation" in navigator)) {
      setLocUI("off", "Location not supported");
      return;
    }
    setLocUI("pending", "Locating you…");
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        lastPosition = pos;
        setLocUI("on", `Location ready · ±${Math.round(pos.coords.accuracy)}m`);
      },
      (err) => {
        const msg =
          err.code === err.PERMISSION_DENIED
            ? "Location access denied"
            : "Location unavailable";
        setLocUI("off", msg);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  }

  function sendLocationToAdmin() {
    if (!lastPosition) return null;
    const { latitude, longitude, accuracy } = lastPosition.coords;
    try {
      const inboxKey = "safeher_admin_inbox";
      const inbox = JSON.parse(localStorage.getItem(inboxKey) || "[]");
      inbox.push({
        type: "sos-location",
        from: "Watch User",
        sentAt: new Date().toISOString(),
        latitude,
        longitude,
        accuracy,
        mapUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
      });
      localStorage.setItem(inboxKey, JSON.stringify(inbox));
    } catch (e) {
      /* storage unavailable — continue anyway */
    }
    return { latitude, longitude };
  }

  function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  callBtn.addEventListener("click", () => {
    vibrate([60, 40, 60, 40, 120]);

    const sent = sendLocationToAdmin();
    if (sent) {
      coordsOut.textContent = `${fmtCoord(sent.latitude)}, ${fmtCoord(sent.longitude)}`;
      SafeHer.toast("Live location sent to admin", { duration: 3200 });
    } else {
      coordsOut.textContent = "Location will follow once available";
      SafeHer.toast("Calling — location will be sent once located", {
        type: "info",
        duration: 3200,
      });
      // Try once more shortly in case a fix lands just after tapping.
      setTimeout(() => {
        const retry = sendLocationToAdmin();
        if (retry)
          coordsOut.textContent = `${fmtCoord(retry.latitude)}, ${fmtCoord(retry.longitude)}`;
      }, 4000);
    }

    // Place the emergency call.
    window.location.href = `tel:${EMERGENCY_NUMBER}`;

    setTimeout(() => setState("sent"), 350);
  });

  window.addEventListener("beforeunload", () => {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
  });

  beginLocating();
})();
