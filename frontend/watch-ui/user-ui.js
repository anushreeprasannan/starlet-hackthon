/* ==========================================
   Guardian Angel
   user-ui.js
========================================== */

/* -----------------------------
   DOM Elements
------------------------------ */

const pages = document.querySelectorAll(".page");

const navButtons = document.querySelectorAll(".nav-btn");

const liveTime = document.getElementById("liveTime");
const liveDate = document.getElementById("liveDate");
const greeting = document.getElementById("greeting");

const sosButton = document.getElementById("sosButton");

const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
const timestamp = document.getElementById("timestamp");
const status = document.getElementById("status");

const loader = document.getElementById("loader");
const popup = document.getElementById("successPopup");

/* ==========================================
   Live Time & Date
========================================== */

function updateClock() {
  const now = new Date();

  liveTime.innerHTML = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  liveDate.innerHTML = now.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = now.getHours();

  if (hour < 12) {
    greeting.innerHTML = "Good Morning";
  } else if (hour < 17) {
    greeting.innerHTML = "Good Afternoon";
  } else {
    greeting.innerHTML = "Good Evening";
  }
}

updateClock();

setInterval(updateClock, 1000);

/* ==========================================
   Navigation
========================================== */

function showPage(pageId, button) {
  pages.forEach((page) => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  if (button) {
    navButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
  }
}

/* ==========================================
   SOS BUTTON
========================================== */

sosButton.addEventListener("click", getLocation);

function getLocation() {
  loader.style.display = "flex";

  status.innerHTML = "Getting Location...";

  if (!navigator.geolocation) {
    loader.style.display = "none";

    alert("Location not supported.");

    return;
  }

  navigator.geolocation.getCurrentPosition(
    locationSuccess,

    locationError,

    {
      enableHighAccuracy: true,

      timeout: 10000,
    },
  );
}

/* ==========================================
   GPS SUCCESS
========================================== */

function locationSuccess(position) {
  loader.style.display = "none";

  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  latitude.innerHTML = lat.toFixed(6);

  longitude.innerHTML = lng.toFixed(6);

  timestamp.innerHTML = new Date().toLocaleString();

  status.innerHTML = "Location Successfully Obtained";

  const location = {
    latitude: lat,

    longitude: lng,

    time: new Date().toISOString(),
  };

  sendSOS(location);

  popup.style.display = "flex";
}

/* ==========================================
   GPS ERROR
========================================== */

function locationError(error) {
  loader.style.display = "none";

  status.innerHTML = "Permission Denied";

  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("Please allow location permission.");

      break;

    case error.POSITION_UNAVAILABLE:
      alert("Location unavailable.");

      break;

    case error.TIMEOUT:
      alert("Location request timed out.");

      break;

    default:
      alert("Unknown error.");
  }
}

/* ==========================================
   Popup
========================================== */

function closePopup() {
  popup.style.display = "none";
}

/* ==========================================
   Placeholder Backend
========================================== */

function sendSOS(location) {
  console.log("SOS Sent");

  console.log(location);
}

/* Firebase later

await addDoc(collection(db,"sos_alerts"),{

latitude:location.latitude,

longitude:location.longitude,

timestamp:serverTimestamp()

});

*/
/* ==========================================
   VOICE RECORDER
========================================== */

let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioUrl;

let timer = 0;
let timerInterval;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const playBtn = document.getElementById("playBtn");
const deleteBtn = document.getElementById("deleteBtn");
const sendBtn = document.getElementById("sendBtn");

const audioPlayer = document.getElementById("audioPlayer");
const recordTime = document.getElementById("recordTime");

startBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);
playBtn.addEventListener("click", playRecording);
deleteBtn.addEventListener("click", deleteRecording);
sendBtn.addEventListener("click", sendRecording);

/* =========================== */

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    mediaRecorder = new MediaRecorder(stream);

    audioChunks = [];

    mediaRecorder.start();

    timer = 0;

    updateTimer();

    timerInterval = setInterval(updateTimer, 1000);

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, {
        type: "audio/webm",
      });

      audioUrl = URL.createObjectURL(audioBlob);

      audioPlayer.src = audioUrl;
    };
  } catch {
    alert("Microphone permission denied.");
  }
}

/* =========================== */

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();

    clearInterval(timerInterval);
  }
}

/* =========================== */

function playRecording() {
  if (audioUrl) {
    audioPlayer.play();
  }
}

/* =========================== */

function deleteRecording() {
  audioPlayer.src = "";

  audioBlob = null;

  audioUrl = null;

  recordTime.innerHTML = "00 : 00";
}

/* =========================== */

function sendRecording() {
  if (!audioBlob) {
    alert("Please record first.");

    return;
  }

  uploadVoice(audioBlob);

  alert("Voice Message Uploaded");
}

/* =========================== */

function updateTimer() {
  const minutes = String(Math.floor(timer / 60)).padStart(2, "0");

  const seconds = String(timer % 60).padStart(2, "0");

  recordTime.innerHTML = `${minutes} : ${seconds}`;

  timer++;
}

/* ==========================================
   REMINDERS
========================================== */

const reminders = [
  {
    icon: "🛏️",
    title: "Sleep Time",
    time: "9:30 PM",
    status: "Pending",
  },

  {
    icon: "💊",
    title: "Medication",
    time: "8:00 AM",
    status: "Pending",
  },

  {
    icon: "🚿",
    title: "Bath Time",
    time: "7:30 AM",
    status: "Completed",
  },

  {
    icon: "📖",
    title: "Study Time",
    time: "5:00 PM",
    status: "Pending",
  },

  {
    icon: "🌞",
    title: "Wake Up",
    time: "6:00 AM",
    status: "Completed",
  },

  {
    icon: "💧",
    title: "Drink Water",
    time: "11:00 AM",
    status: "Pending",
  },

  {
    icon: "⚽",
    title: "Play Time",
    time: "4:00 PM",
    status: "Pending",
  },
];

function loadReminders() {
  const container = document.getElementById("reminderContainer");

  container.innerHTML = "";

  reminders.forEach((reminder) => {
    container.innerHTML += `

        <div class="reminder-card">

            <div class="reminder-left">

                <div class="reminder-icon">

                    ${reminder.icon}

                </div>

                <div>

                    <div class="reminder-title">

                        ${reminder.title}

                    </div>

                    <div class="reminder-time">

                        ${reminder.time}

                    </div>

                </div>

            </div>

            <div class="badge">

                ${reminder.status}

            </div>

        </div>

        `;
  });
}

loadReminders();

/* ==========================================
   Placeholder Backend Functions
========================================== */

function uploadVoice(audioBlob) {
  console.log("Voice Uploaded");

  console.log(audioBlob);
}

/* ==========================================
   OPTIONAL BATTERY STATUS
========================================== */

if ("getBattery" in navigator) {
  navigator.getBattery().then((battery) => {
    const batteryText = document.querySelector(
      ".status-card:nth-child(3) span",
    );

    function updateBattery() {
      batteryText.innerHTML = Math.round(battery.level * 100) + "%";
    }

    updateBattery();

    battery.addEventListener("levelchange", updateBattery);
  });
}

/* ==========================================
   OPTIONAL NETWORK STATUS
========================================== */

const networkText = document.querySelector(".status-card:nth-child(4) span");

function updateNetwork() {
  networkText.innerHTML = navigator.onLine ? "Online" : "Offline";
}

updateNetwork();

window.addEventListener("online", updateNetwork);

window.addEventListener("offline", updateNetwork);
