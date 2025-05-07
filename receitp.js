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

const form = document.getElementById("appointment-form");
const overlay = document.getElementById("invoice-overlay");
const closeBtn = document.getElementById("close-invoice");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const message = document.getElementById("message").value;

  const appointmentsRef = ref(database, 'appointments');
  const newAppointmentRef = push(appointmentsRef);
  set(newAppointmentRef, {
    name,
    email,
    date,
    time,
    message,
    timestamp: Date.now()
  }).then(() => {
    const timestamp = new Date().toLocaleString();
    document.getElementById("invoice-name").innerText = name;
    document.getElementById("invoice-email").innerText = email;
    document.getElementById("invoice-date").innerText = date;
    document.getElementById("invoice-time").innerText = time;
    document.getElementById("invoice-message").innerText = message || "N/A";
    document.getElementById("invoice-timestamp").innerText = timestamp;

    overlay.classList.add("show");
    form.reset();
  }).catch(error => {
    alert("Error saving appointment: " + error.message);
  });
});

closeBtn.addEventListener("click", () => {
  overlay.classList.remove("show");
});
