import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

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

// Submit button
const submit = document.getElementById('submit');
submit.addEventListener("click", function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
     Swal.fire({
  title: 'Account logged in',
  text: 'Welcome to Toothfully Yours.',
  icon: 'success',
  confirmButtonText: 'Continue',
  timer: 4000,
  timerProgressBar: true,
  showConfirmButton: true
}).then((result) => {
  if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
    // ✅ Remove appointment data
    localStorage.removeItem("appointmentDetails");

    // Redirect to main page
    window.location.href = "mainpage2.html";
  }
});
    }
    ).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // Show error message
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
} );
// Show password toggle
