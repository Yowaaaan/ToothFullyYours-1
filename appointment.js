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
const treatmentSelect = document.getElementById("treatment");
const contactNumberInput = document.getElementById("contactNumber");
const timeSelect = document.getElementById("time");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const form = document.getElementById("appointment-form");

// Auto-fill appointment form from localStorage
const storedUser = JSON.parse(localStorage.getItem("userInfo"));
if (storedUser) {
  nameInput.value = `${storedUser.firstName} ${storedUser.lastName}`;
  emailInput.value = storedUser.email;
  contactNumberInput.value = storedUser.contactNumber;
}

// Doctor availability
const doctorSchedules = {
  "Dr. Kenjin Seloterio": {
    timeSlots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
    availableDays: ["Monday", "Wednesday", "Friday"]
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

// Restrict date input based on selected doctor
function setDateRestrictions() {
  const selectedDoctor = doctorSelect.value;
  const today = new Date();

  if (!selectedDoctor) return;

  const availableDays = doctorSchedules[selectedDoctor]?.availableDays || [];
  let availableDates = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });

    if (availableDays.includes(dayOfWeek)) {
      availableDates.push(date.toISOString().split("T")[0]);
    }
  }

  dateInput.removeAttribute("disabled");
  dateInput.setAttribute("min", availableDates[0] || today.toISOString().split("T")[0]);
  dateInput.setAttribute("max", availableDates[availableDates.length - 1] || today.toISOString().split("T")[0]);
}

// Update available time slots based on doctor and date
function updateAvailableTimes() {
  const selectedDoctor = doctorSelect.value;
  const selectedDate = dateInput.value;

  if (!selectedDoctor || !selectedDate) return;

  const timeSlots = doctorSchedules[selectedDoctor]?.timeSlots || [];
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

    const availableTimes = timeSlots.filter(time => !bookedTimes.includes(time));

    timeSelect.innerHTML = `<option value="">-- Select Time --</option>`;
    availableTimes.forEach(time => {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      timeSelect.appendChild(option);
    });
  }, { onlyOnce: true });
}

// Event listeners
doctorSelect.addEventListener("change", () => {
  setDateRestrictions();
  updateAvailableTimes();
});

dateInput.addEventListener("change", updateAvailableTimes);

// Form submit handler
form.addEventListener("submit", function(event) {
  event.preventDefault();

  const doctor = doctorSelect.value;
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const contactNumber = contactNumberInput.value.trim();
  const date = dateInput.value;
  const time = timeSelect.value;
  const treatment = treatmentSelect.value;
  const message = document.getElementById("message").value || "No additional notes";

  // Basic validation
  if (!doctor || !name || !email || !contactNumber || !date || !time || !treatment) {
    alert("Please fill in all required fields.");
    return;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  const contactNumberPattern = /^\d{10,15}$/;
  if (!contactNumberPattern.test(contactNumber)) {
    alert("Please enter a valid contact number (10 to 15 digits).");
    return;
  }

  const appointmentsRef = ref(database, 'appointments');
  const newAppointmentRef = push(appointmentsRef);

  set(newAppointmentRef, {
    doctor,
    name,
    email,
    contactNumber,
    date,
    time,
    treatment,
    message,
    timestamp: Date.now()
  }).then(() => {
    // Save appointment data to localStorage for receipt/QR
    localStorage.setItem("appointmentData", JSON.stringify({
      name, email, doctor, date, contactNumber, time, treatment, message
    }));

    // Redirect to receipt page (QR will be generated there)
    window.location.href = "appointment-receipt.html";
  }).catch((error) => {
    console.error("Error saving appointment: ", error);
    alert("There was an error saving your appointment. Please try again.");
  });
});
