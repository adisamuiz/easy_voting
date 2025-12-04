
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js"
import { getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js"
import { getFirestore, 
         collection, 
         addDoc, 
         doc, 
         setDoc,
         onSnapshot} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js" 

const firebaseConfig = {
    apiKey: "AIzaSyDrA_yYmQJNEgyWO0yJLoRVxBydmSuiP_4",
    authDomain: "easy-voting-fd3ad.firebaseapp.com",
    databaseURL: "https://easy-voting-fd3ad-default-rtdb.firebaseio.com",
    projectId: "easy-voting-fd3ad",
    storageBucket: "easy-voting-fd3ad.firebasestorage.app"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app) 

const adminCreateAccountBtn = document.getElementById("admin-create-account-btn")
const adminLoginBtn = document.getElementById("admin-login-btn")
const adminIdInput = document.getElementById("admin-id-input")
const adminPassInput = document.getElementById("admin-pass-input")

adminCreateAccountBtn.addEventListener("click", authCreateAccount)
adminLoginBtn.addEventListener("click", authSignIn)

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User detected: ", user.uid)
  } 
  else {

  }
})
function authCreateAccount(){
    const email = adminIdInput.value
    const password = adminPassInput.value
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const uid = userCredential.user.uid
        return addNewAdminToDB(uid) 
    })
    .then(() => {
        adminIdInput.value = ""
        adminPassInput.value = ""
        console.log("Admin added to DB successfully")
        location.href = "admin-page.html"
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
        location.href = "admin-page.html" 
    })
    .catch((error) => {
        console.log(error.message)
    });
}
async function addNewAdminToDB(uid){
    const docRef = await addDoc(collection(db, "admin"), {
        adminId: uid
    });
    
    console.log("Document written with ID: ", docRef.id)
    return docRef
}
