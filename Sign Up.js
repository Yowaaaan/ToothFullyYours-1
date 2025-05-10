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
const confirmPasswordInput = document.getElementById("confirmPassword"); // Corrected ID
const errorMessage = document.getElementById("errorMessage");

// Submit listener
submit.addEventListener("click", function (event) {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
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
          window.location.href = "Untitled-1.html";
        }
      });
      
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});
