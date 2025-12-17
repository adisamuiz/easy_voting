import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js"
import { getAuth,
         signInWithEmailAndPassword,
         signOut,
         onAuthStateChanged,
         GoogleAuthProvider,
         signInWithPopup} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js"
import { getFirestore, 
         collection, 
         addDoc, 
         doc, 
         setDoc,
         onSnapshot,
         getDoc} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js" 

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
const provider = new GoogleAuthProvider()

const voterLoginBtn = document.getElementById("voter-login-btn")
const voterLoginWithGoogleBtn = document.getElementById("voter-login-with-google-btn")
const voterIdInput = document.getElementById("voter-id-input")
const voterPassInput = document.getElementById("voter-pass-input")
const voterLoginForm = document.getElementById("voter-login-form")


voterLoginBtn.addEventListener("click", authSignIn)
voterLoginWithGoogleBtn.addEventListener("click", authSignInWithGoogle)
voterLoginForm.addEventListener("submit", async function(event) {
    event.preventDefault()
})

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const voterRef = doc(db, "voters", user.uid)
    const voterSnap = await getDoc(voterRef)
    if (voterSnap.exists() && voterSnap.data().role == "voter") {
      location.href = "voter-page.html"
    } 
    else {
      console.log("User is logged in, but is NOT a verified voter.")
      signOut(auth)
    }
  } 
})
async function authSignIn(){
  const email = voterIdInput.value
  const password = voterPassInput.value
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    // const uid = userCredential.user.uid
    // await getVoterInformation(uid)
    voterIdInput.value = ""
    voterPassInput.value = ""
  } 
  catch (error) {
    console.error("Something went wrong:", error)
    voterIdInput.value = ""
    voterPassInput.value = ""
  }
}
async function authSignInWithGoogle(){
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    await addNewVoterToDB(user.uid)
    console.log("User signed in:", user.email)
  } 
  catch (error) {
    console.error("Something went wrong:", error)
  }
}
async function addNewVoterToDB(uid){
    await setDoc(doc(db, "voters", uid), {
        voterId: uid,
        role: "voter"
    })
}
// async function getVoterInformation(uid) {
//   const docRef = doc(db, "voters", uid)
//   const docSnap = await getDoc(docRef)
//   if (docSnap.exists() && docSnap.data().role === "voter") {
//     console.log("you're a voter")
//     console.log("uid:", uid)
//     location.href = "voter-page.html"
//   }
//   else{
//     console.log("you're not a voter")
//   }
// }
