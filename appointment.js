import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCN7IMQBXb1gPY7NifAjxYp4bSUr_f2P04",
  authDomain: "toothfullyyours-b7f41.firebaseapp.com",
  projectId: "toothfullyyours-b7f41",
  storageBucket: "toothfullyyours-b7f41.appspot.com",
  messagingSenderId: "470168333871",
  appId: "1:470168333871:web:87c427f4b05c3dde40a0da"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Get form elements
const doctorSelect = document.getElementById("doctor");
const dateInput = document.getElementById("date");
const timeSelect = document.getElementById("time");
const form = document.getElementById("appointment-form");

// Static schedules (each doctor's availability for certain dates)
const doctorSchedules = {
  "Dr. Kenjin Seloterio": {
    timeSlots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
    availableDays: ["Monday", "Wednesday", "Friday"] // Available days
  },
  "Dr. Kendhryx Barroga": {
    timeSlots: ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
    availableDays: ["Tuesday", "Thursday"]
  },
  "Dr. John Micheal Generalao": {
    timeSlots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
    availableDays: ["Monday", "Tuesday", "Thursday"]
  },
  "Dr. Rio Bautista": {
    timeSlots: ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
    availableDays: ["Monday", "Wednesday", "Friday"]
  }
};

// Function to update the available date picker based on selected doctor
function setDateRestrictions() {
  const selectedDoctor = doctorSelect.value;
  const today = new Date();

  if (!selectedDoctor) return;

  // Get the available days for the selected doctor
  const availableDays = doctorSchedules[selectedDoctor]?.availableDays || [];

  // Disable all dates first
  dateInput.setAttribute("disabled", "true");

  let availableDates = [];

  // Loop through the next 30 days to filter out days based on the doctor availability
  for (let i = 0; i < 30; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" }); // Get full weekday name

    if (availableDays.includes(dayOfWeek)) {
      availableDates.push(date.toISOString().split("T")[0]); // Add the date in YYYY-MM-DD format
    }
  }

  // Enable the date picker and update the available options
  dateInput.removeAttribute("disabled");

  // Set available dates in the date picker
  dateInput.setAttribute("min", availableDates[0] || today.toISOString().split("T")[0]);
  dateInput.setAttribute("max", availableDates[availableDates.length - 1] || today.toISOString().split("T")[0]);
}

// Function to update available times based on selected doctor and date
function updateAvailableTimes() {
  const selectedDoctor = doctorSelect.value;
  const selectedDate = dateInput.value;

  if (!selectedDoctor || !selectedDate) return;

  // Get the available time slots for the selected doctor
  const timeSlots = doctorSchedules[selectedDoctor]?.timeSlots || [];

  // Fetch booked appointments for this doctor and date
  const appointmentsRef = ref(database, "appointments");
  onValue(appointmentsRef, snapshot => {
    const data = snapshot.val();
    const bookedTimes = [];

    if (data) {
      for (let id in data) {
        const appt = data[id];
        if (appt.doctor === selectedDoctor && appt.date === selectedDate) {
          bookedTimes.push(appt.time);
        }
      }
    }

    // Filter out booked times from available times
    const availableTimes = timeSlots.filter(time => !bookedTimes.includes(time));

    // Update the dropdown for available times
    timeSelect.innerHTML = `<option value="">-- Select Time --</option>`;
    availableTimes.forEach(time => {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      timeSelect.appendChild(option);
    });
  }, { onlyOnce: true });
}

// Listen to doctor and date changes
doctorSelect.addEventListener("change", () => {
  setDateRestrictions();
  updateAvailableTimes();
});

// Listen to date changes
dateInput.addEventListener("change", updateAvailableTimes);

// Form submission logic    
// Form submission logic    
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const doctor = doctorSelect.value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const date = dateInput.value;
  const time = timeSelect.value;
  const message = document.getElementById("message").value;
  const treatment = document.getElementById("treatment").value; // Get the selected treatment

  const appointmentsRef = ref(database, 'appointments');
  const newAppointmentRef = push(appointmentsRef);

  set(newAppointmentRef, {
    doctor, name, email, date, time, treatment,  // Include treatment here
    message: message || "No additional notes",
    timestamp: Date.now()
  }).then(() => {
    // Save to localStorage including treatment
    localStorage.setItem("appointmentData", JSON.stringify({
      name, doctor, date, time, treatment, message: message || "No additional notes"
    }));

    // Redirect immediately to receipt
    window.location.href = "appointment-receipt.html";

    form.reset();
    timeSelect.innerHTML = `<option value="">-- Select Time --</option>`;
    dateInput.value = "";
    doctorSelect.value = "";
    setDateRestrictions();
    updateAvailableTimes();
  }
  ).catch((error) => {
    console.error("Error saving appointment: ", error);
    alert("There was an error saving your appointment. Please try again.");
  });

  new QRCode(document.getElementById("qrcode"), {
  text: qrText,
  width: 128, // Adjust the size here (smaller value for a smaller QR code)
  height: 128, // Same size as width to maintain the aspect ratio
});



}
);