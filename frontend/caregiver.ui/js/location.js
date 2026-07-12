let map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

let marker;

function getLocation() {

    document.getElementById("status").innerHTML = "Finding...";

    if (navigator.geolocation) {

        navigator.geolocation.watchPosition(
            showPosition,
            showError,
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            }
        );

    } else {

        alert("Geolocation is not supported by this browser.");

    }

}


function showPosition(position) {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    document.getElementById("latitude").textContent = lat.toFixed(6);
    document.getElementById("longitude").textContent = lng.toFixed(6);
    document.getElementById("accuracy").textContent = Math.round(accuracy) + " m";
    document.getElementById("status").textContent = "Live";

    map.setView([lat, lng], 17);

    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng]).addTo(map);
    }

}

function showError(error) {

    let message = "";

    switch (error.code) {

        case error.PERMISSION_DENIED:
            message = "Permission Denied";
            break;

        case error.POSITION_UNAVAILABLE:
            message = "Location Unavailable";
            break;

        case error.TIMEOUT:
            message = "Request Timed Out";
            break;

        default:
            message = "Unknown Error";

    }

    document.getElementById("status").textContent = message;

}

getLocation();