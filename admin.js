
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js"
import { getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js"

const firebaseConfig = {
    apiKey: "AIzaSyDrA_yYmQJNEgyWO0yJLoRVxBydmSuiP_4",
    authDomain: "easy-voting-fd3ad.firebaseapp.com",
    databaseURL: "https://easy-voting-fd3ad-default-rtdb.firebaseio.com",
    projectId: "easy-voting-fd3ad",
    storageBucket: "easy-voting-fd3ad.firebasestorage.app"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const adminCreateAccountBtn = document.getElementById("admin-create-account-btn")
const adminLoginBtn = document.getElementById("admin-login-btn")
const adminIdInput = document.getElementById("admin-id-input")
const adminPassInput = document.getElementById("admin-pass-input")

adminCreateAccountBtn.addEventListener("click", authCreateAccount)
adminLoginBtn.addEventListener("click", authSignIn)

onAuthStateChanged(auth, (user) => {
  if (user) {
    location.href = "admin-page.html" 
  } 
  else {
  }
})
function authCreateAccount(){
    const email = adminIdInput.value
    const password = adminPassInput.value
    
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        adminIdInput.value = ""
        adminPassInput.value = ""
    })
    .catch((error) => {
        console.log(error.message)
    })
}
function authSignIn(){
    const email = adminIdInput.value
    const password = adminPassInput.value

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        adminIdInput.value = ""
        adminPassInput.value = ""
    })
    .catch((error) => {
        console.log(error.message)
    });
}

