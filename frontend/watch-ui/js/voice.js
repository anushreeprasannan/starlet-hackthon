/* ============================================================
   SafeHer Watch — Voice message to admin
   Uses MediaRecorder + Web Audio API for real mic capture,
   a live waveform, a timer, playback, and a simulated send
   to the admin inbox (persisted in localStorage so the
   "admin side" could read it from the same browser).
   ============================================================ */

(function () {
  "use strict";

  const micWrap = document.querySelector("[data-mic-wrap]");
  const micBtn = document.querySelector("[data-mic-btn]");
  const hint = document.querySelector("[data-hint]");
  const states = document.querySelectorAll("[data-state]");
  const finalTime = document.querySelector("[data-final-time]");
  const playBtn = document.querySelector("[data-play-btn]");
  const playIcon = document.querySelector("[data-play-icon]");
  const redoBtn = document.querySelector("[data-redo-btn]");
  const sendBtn = document.querySelector("[data-send-btn]");
  const errorText = document.querySelector("[data-error-text]");
  const reviewWaveHost = document.querySelector("[data-review-wave]");

  const MAX_SECONDS = 60; // safety cap on a single voice memo

  let mediaRecorder = null;
  let audioChunks = [];
  let audioCtx = null;
  let analyser = null;
  let sourceNode = null;
  let stream = null;
  let recording = false;
  let seconds = 0;
  let timerHandle = null;
  let waveHandle = null;
  let recordedBlob = null;
  let recordedUrl = null;
  let player = null;
  let isPlaying = false;

  function setState(name) {
    states.forEach((s) =>
      s.classList.toggle("active", s.dataset.state === name),
    );
  }

  function fmt(t) {
    const m = Math.floor(t / 60);
    const s = (t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function buildReviewWave() {
    reviewWaveHost.innerHTML = "";
    const bars = 26;
    for (let i = 0; i < bars; i++) {
      const bar = document.createElement("span");
      const h = 4 + Math.round(Math.random() * 16);
      bar.style.height = h + "px";
      bar.style.opacity = "0.85";
      reviewWaveHost.appendChild(bar);
    }
  }

  async function startRecording() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      errorText.textContent =
        err && err.name === "NotAllowedError"
          ? "Microphone access was denied. Allow it in your browser settings to send a voice message."
          : "No microphone was found on this device.";
      setState("error");
      return;
    }

    audioChunks = [];
    recordedBlob = null;
    seconds = 0;

    const mimeType = MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "";
    mediaRecorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);

    mediaRecorder.addEventListener("dataavailable", (e) => {
      if (e.data && e.data.size > 0) audioChunks.push(e.data);
    });
    mediaRecorder.addEventListener("stop", onRecordingStopped);

    mediaRecorder.start();
    recording = true;

    micBtn.classList.add("recording");
    micWrap.classList.add("is-recording");
    hint.textContent = "Listening… tap to stop";

    // live timer
    timerRender();
    timerHandle = setInterval(() => {
      seconds += 1;
      timerRender();
      if (seconds >= MAX_SECONDS) stopRecording();
    }, 1000);

    // live waveform via analyser
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sourceNode = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    sourceNode.connect(analyser);
    animateMicWaveform();
  }

  function timerRender() {
    if (!document.querySelector(".timer")) {
      const t = document.createElement("p");
      t.className = "timer";
      t.textContent = fmt(seconds);
      hint.insertAdjacentElement("beforebegin", t);
    } else {
      document.querySelector(".timer").textContent = fmt(seconds);
    }
  }

  function clearTimerDisplay() {
    const t = document.querySelector(".timer");
    if (t) t.remove();
  }

  function animateMicWaveform() {
    if (!recording || !analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const scale = 1 + Math.min(avg / 90, 0.55);
    micBtn.style.transform = `scale(${scale})`;
    waveHandle = requestAnimationFrame(animateMicWaveform);
  }

  function onRecordingStopped() {
    const type = mediaRecorder.mimeType || "audio/webm";
    recordedBlob = new Blob(audioChunks, { type });
    recordedUrl = URL.createObjectURL(recordedBlob);

    // tear down live capture
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (audioCtx) audioCtx.close();
    cancelAnimationFrame(waveHandle);
    micBtn.style.transform = "";

    finalTime.textContent = fmt(seconds);
    buildReviewWave();
    setState("review");
  }

  function stopRecording() {
    if (!recording) return;
    recording = false;
    clearInterval(timerHandle);
    clearTimerDisplay();
    micBtn.classList.remove("recording");
    micWrap.classList.remove("is-recording");
    if (mediaRecorder && mediaRecorder.state !== "inactive")
      mediaRecorder.stop();
  }

  micBtn.addEventListener("click", () => {
    if (!recording) startRecording();
    else stopRecording();
  });

  playBtn.addEventListener("click", () => {
    if (!recordedUrl) return;
    if (!player) player = new Audio(recordedUrl);
    if (isPlaying) {
      player.pause();
      player.currentTime = 0;
      isPlaying = false;
      playIcon.innerHTML = '<path d="M7 5.5v13l11-6.5-11-6.5Z" fill="#fff"/>';
      return;
    }
    player.play();
    isPlaying = true;
    playIcon.innerHTML =
      '<path d="M8 5.5h3v13H8v-13Zm5 0h3v13h-3v-13Z" fill="#fff"/>';
    player.addEventListener(
      "ended",
      () => {
        isPlaying = false;
        playIcon.innerHTML = '<path d="M7 5.5v13l11-6.5-11-6.5Z" fill="#fff"/>';
      },
      { once: true },
    );
  });

  redoBtn.addEventListener("click", () => {
    if (player) {
      player.pause();
      player = null;
      isPlaying = false;
    }
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    recordedUrl = null;
    recordedBlob = null;
    setState("idle");
    hint.textContent = "Tap to speak";
  });

  sendBtn.addEventListener("click", () => {
    setState("sending");
    // Simulate the network round-trip to the admin's inbox.
    // The recording is persisted locally (base64) so it can be
    // picked up by an admin-side view reading the same storage.
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const inboxKey = "safeher_admin_inbox";
        const inbox = JSON.parse(localStorage.getItem(inboxKey) || "[]");
        inbox.push({
          type: "voice-message",
          from: "Watch User",
          sentAt: new Date().toISOString(),
          durationSeconds: seconds,
          audioDataUrl: reader.result,
        });
        localStorage.setItem(inboxKey, JSON.stringify(inbox));
      } catch (e) {
        /* storage full or unavailable — still proceed with the UX */
      }
      setTimeout(() => setState("sent"), 900);
    };
    if (recordedBlob) reader.readAsDataURL(recordedBlob);
    else setTimeout(() => setState("sent"), 900);
  });
})();
