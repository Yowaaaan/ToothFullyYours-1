import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCN7IMQBXb1gPY7NifAjxYp4bSUr_f2P04",
    authDomain: "toothfullyyours-b7f41.firebaseapp.com",
    projectId: "toothfullyyours-b7f41",
    storageBucket: "toothfullyyours-b7f41.appspot.com",
    messagingSenderId: "470168333871",
    appId: "1:470168333871:web:87c427f4b05c3dde40a0da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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
    const appointmentsRef = ref(database, 'appointments');
    const newAppointmentRef = push(appointmentsRef);
    set(newAppointmentRef, {
        name: name,
        email: email,
        date: date,
        time: time,
        message: message,
        timestamp: Date.now()
    }).then(() => {
        // Show notification
        document.getElementById("invoice-notification-name").innerText = name;
        document.getElementById("invoice-notification-date").innerText = date;
        document.getElementById("invoice-notification-time").innerText = time;
        document.getElementById("invoice-notification-message").innerText = message || "No additional notes";

        // Show the notification
        document.getElementById("invoice-notification").classList.add("show");

        // Hide the notification after 5 seconds
        setTimeout(() => {
            document.getElementById("invoice-notification").classList.remove("show");
        }, 5000);  // Notification will disappear after 5 seconds

        // Reset the form after submission
        form.reset();
    }).catch(error => {
        alert("Error saving appointment: " + error.message);
    });
});
