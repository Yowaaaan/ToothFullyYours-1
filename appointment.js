import { } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js"
import { } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js"


const firebaseConfig = {
    apiKey: "AIzaSyCN7IMQBXb1gPY7NifAjxYp4bSUr_f2P04",
    authDomain: "toothfullyyours-b7f41.firebaseapp.com",
    projectId: "toothfullyyours-b7f41",
    storageBucket: "toothfullyyours-b7f41.appspot.com",
    messagingSenderId: "470168333871",
    appId: "1:470168333871:web:87c427f4b05c3dde40a0da"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Handle form submission
const form = document.getElementById("appointment-form");
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const message = document.getElementById("message").value;

    // Save data to Firebase Realtime Database
    const appointmentsRef = database.ref("appointments");
    const newAppointmentRef = appointmentsRef.push();
    newAppointmentRef.set({
        name: name,
        email: email,
        date: date,
        time: time,
        message: message,
        timestamp: Date.now()
    }).then(() => {
        alert("Appointment booked successfully!");
        form.reset(); // Clear form after successful submission
    }).catch(error => {
        alert("Error saving appointment: " + error.message);
    });
});
