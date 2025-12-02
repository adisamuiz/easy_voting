import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js"
import { getAuth,
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

const voterLoginBtn = document.getElementById("voter-login-btn")
const voterIdInput = document.getElementById("voter-id-input")
const voterPassInput = document.getElementById("voter-pass-input")

onAuthStateChanged(auth, (user) => {
  if (user) {
    location.href = "voter-page.html" 
  } 
  else {
  }
})
function authSignIn(){
    const email = voterIdInput.value
    const password = voterPassInput.value

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        location.href = "voter-page.html" 
        voterIdInput.value = ""
        voterPassInput.value = ""
    })
    .catch((error) => {
        console.log(error.message)
    });
}


voterLoginBtn.addEventListener("click", authSignIn)
