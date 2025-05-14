import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

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
const auth = getAuth(app);

// Form elements
const form = document.querySelector("form");
const submit = document.getElementById("submit");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const contactNumberInput = document.getElementById("contactNumber");
const confirmPasswordInput = document.getElementById("confirmPassword");
const errorMessage = document.getElementById("errorMessage");

// Submit listener
submit.addEventListener("click", function (event) {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const contactNumber = contactNumberInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Check if passwords match
  if (password !== confirmPassword) {
    errorMessage.style.display = "block";
    return; // Do not proceed to Firebase
  } else {
    errorMessage.style.display = "none";
  }

  // Firebase account creation
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // After successful account creation, get user details and save them
      const userInfo = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        contactNumber: document.getElementById("contactNumber").value,
        email: email // Store email as well
      };

      // Check if all fields are filled
      if (userInfo.firstName && userInfo.lastName && userInfo.contactNumber && userInfo.email) {
        // Save data to localStorage
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        // Show success message
        Swal.fire({
          title: 'Account Created!',
          text: 'Welcome to Toothfully Yours.',
          icon: 'success',
          confirmButtonText: 'Continue',
          timer: 4000, // optional: auto-close in 4 seconds
          timerProgressBar: true,
          showConfirmButton: true
        }).then((result) => {
          // Redirect only after user clicks "Continue" or after timer ends
          if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
            window.location.href = "Untitled-1.html"; // Redirect to appointment form
          }
        });
      } else {
        alert("Please fill out all required fields.");
      }
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});
// Password visibility toggle
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
togglePassword.addEventListener("click", function () {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});
toggleConfirmPassword.addEventListener("click", function () {
  const type = confirmPasswordInput.getAttribute("type") === "password" ? "text" : "password";
  confirmPasswordInput.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});
// Password strength validation
const passwordStrength = document.getElementById("passwordStrength");
const passwordStrengthText = document.getElementById("passwordStrengthText");

