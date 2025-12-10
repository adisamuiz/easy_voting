import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js"
import { getAuth,
         signInWithEmailAndPassword,
         onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js"
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

const voterLoginBtn = document.getElementById("voter-login-btn")
const voterIdInput = document.getElementById("voter-id-input")
const voterPassInput = document.getElementById("voter-pass-input")

voterLoginBtn.addEventListener("click", authSignIn)

onAuthStateChanged(auth, (user) => {
  if (user) {
    location.href = "voter-page.html"
  } 
  else {
  }
})
async function authSignIn(){
  const email = voterIdInput.value
  const password = voterPassInput.value
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid
    const voterid = await getVoterInformation(uid)
    if (uid == voterid){
      console.log("you're a voter")
      console.log("uid:", uid)
      location.href = "voter-page.html"
    }else{
      console.log("you're not a voter")
    }
    voterIdInput.value = ""
    voterPassInput.value = ""
  } 
  catch (error) {
        console.error("Something went wrong:", error)
  }
}
async function getVoterInformation(uid) {
  let voterUid = ""
  const docRef = doc(db, "voters", uid)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
      voterUid = docSnap.data().voterId
      console.log("User data:", voterUid)
  } else {
      console.log("No such document!");
  }
  return voterUid
}
