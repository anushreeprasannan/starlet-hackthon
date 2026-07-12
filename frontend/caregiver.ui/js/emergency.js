let seconds = 0;
let sosActive = true;

const timer = document.getElementById("timer");
const locationText = document.getElementById("locationText");
const cancelBtn = document.querySelector(".cancel-btn");
const title = document.querySelector(".top h1");
const status = document.querySelector(".top p");
const outerRing = document.querySelector(".outer-ring");
const innerCircle = document.querySelector(".inner-circle");

// Timer
const timerInterval = setInterval(() => {

    if (sosActive) {
        seconds++;
        timer.textContent = seconds;
    }

}, 1000);


// Get Current Location
if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude = position.coords.latitude.toFixed(5);
            const longitude = position.coords.longitude.toFixed(5);

            locationText.textContent = `${latitude}, ${longitude}`;

        },

        function() {

            locationText.textContent = "Location Permission Denied";

        }

    );

} else {

    locationText.textContent = "Geolocation Not Supported";

}


// Cancel SOS
cancelBtn.addEventListener("click", function () {

    if (!sosActive) return;

    sosActive = false;

    // Stop timer
    clearInterval(timerInterval);

    // Stop pulse animation
    outerRing.style.animation = "none";

    // Change heading
    title.innerHTML = "SOS<br>ABORTED";
    title.style.color = "#ffffff";

    // Change status
    status.innerHTML = "✔ Emergency alert cancelled";

    // Change center circle color
    innerCircle.style.background = "#666666";

    // Update button
    cancelBtn.textContent = "✓ SOS Cancelled";
    cancelBtn.disabled = true;

    // Optional console message
    console.log("SOS Aborted");

});