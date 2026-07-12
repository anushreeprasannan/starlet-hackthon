function saveData() {

    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let blood = document.getElementById("blood").value;
    let contactName = document.getElementById("contactName").value;
    let contactNumber = document.getElementById("contactNumber").value;
    let history = document.getElementById("history").value;
    let medications = document.getElementById("medications").value;

    document.getElementById("displayName").innerHTML = name || "Patient Name";

    document.getElementById("displayAge").innerHTML = age || "--";

    document.getElementById("displayBlood").innerHTML = blood || "--";

    document.getElementById("displayContactName").innerHTML = contactName || "Not Added";

    document.getElementById("displayContactNumber").innerHTML = contactNumber || "---------";

    document.getElementById("displayHistory").innerHTML = history || "No medical history added.";

    document.getElementById("displayMedication").innerHTML = medications || "No medications added.";

    localStorage.setItem("patient", JSON.stringify({
        name,
        age,
        blood,
        contactName,
        contactNumber,
        history,
        medications
    }));

    alert("Details Saved!");

}

window.onload = function () {

    let patient = JSON.parse(localStorage.getItem("patient"));

    if (patient) {

        document.getElementById("displayName").innerHTML = patient.name;

        document.getElementById("displayAge").innerHTML = patient.age;

        document.getElementById("displayBlood").innerHTML = patient.blood;

        document.getElementById("displayContactName").innerHTML = patient.contactName;

        document.getElementById("displayContactNumber").innerHTML = patient.contactNumber;

        document.getElementById("displayHistory").innerHTML = patient.history;

        document.getElementById("displayMedication").innerHTML = patient.medications;

        document.getElementById("name").value = patient.name;

        document.getElementById("age").value = patient.age;

        document.getElementById("blood").value = patient.blood;

        document.getElementById("contactName").value = patient.contactName;

        document.getElementById("contactNumber").value = patient.contactNumber;

        document.getElementById("history").value = patient.history;

        document.getElementById("medications").value = patient.medications;

    }

}