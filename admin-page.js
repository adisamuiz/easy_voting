import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js"
import { getAuth,
         signOut,
         onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js"
import { getFirestore, 
         collection, 
         addDoc, 
         doc, 
         setDoc,
         onSnapshot} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js" 

const firebaseConfig = {
    databaseURL: "https://easy-voting-fd3ad-default-rtdb.firebaseio.com/",
    apiKey: "AIzaSyDrA_yYmQJNEgyWO0yJLoRVxBydmSuiP_4",
    authDomain: "easy-voting-fd3ad.firebaseapp.com",
    projectId: "easy-voting-fd3ad",
    storageBucket: "easy-voting-fd3ad.firebasestorage.app"
}
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app) 

const signOutBtn = document.getElementById("sign-out-btn")
const registerBtn = document.getElementById("register-btn")
const createBtn = document.getElementById("create-btn")
const positionInput = document.getElementById("position-input")
const noOfCandidatesInput = document.getElementById("no-of-candidates-input")
const candidateNameInput = document.getElementById("candidate-name-input")
const resultTable = document.getElementById("result-table-body")
const resetBtn = document.getElementById("reset-btn")
const voterNameInput = document.getElementById("voter-name-input")

let candidateName = ""
let noOfCandidates = 0
let position = ""
let trr = ""
let tdd1 = ""
let tdd2 = ""
let noRegistered = 0
let candidateIdInDB = 1

signOutBtn.addEventListener("click", authSignOut)

onAuthStateChanged(auth, (user) => {
  if (user) { 
    renderListOfCandidates()
  } 
  else {
    location.href = "admin.html" 
  }
})

function authSignOut(){
    signOut(auth).then(() => {

    })
    .catch((error) => {
        console.log(error.message)
    })
}

createBtn.addEventListener("click", function(){
    noOfCandidates = noOfCandidatesInput.value
    position = positionInput.value
    if(noOfCandidates && position){
        noOfCandidatesInput.value = ""
        positionInput.value = ""
    }
}) 
registerBtn.addEventListener("click", function(){
    candidateName = candidateNameInput.value
    if(candidateName && noRegistered < noOfCandidates){
        noRegistered++
        candidateNameInput.value = ""
        addNewCandidateToDB(candidateName)
    }
})

resetBtn.addEventListener("click", function(){
    clearAll(resultTable)
    noOfCandidates = 0
    candidateIdInDB = 1
    noRegistered = 0
})

function clearAll(element){
    element.innerHTML = ""
}
function deleteDBContent(){

}

async function addNewCandidateToDB(candidateName){
    try {
        const docRef = await setDoc(doc(db, "candidates", `Candidate${candidateIdInDB}`), {
            name: candidateName,
            id: "",
            votes: 0
        })
        candidateIdInDB++
        console.log("Document written with ID: ", docRef.id)
        console.log(candidateIdInDB)
    } catch (error) {
        console.error(error.message)
    }
}
function renderListOfCandidates(){
    onSnapshot(collection(db, "candidates"), (querySnapshot) => {
        clearAll(resultTable)
        
        querySnapshot.forEach((doc) => {
            trr = resultTable.insertRow()
            tdd1 = trr.insertCell(0)
            tdd1.innerHTML = `${doc.data().name}`
            tdd2 = trr.insertCell(1)
            tdd2.innerHTML = `${doc.data().votes}`         
        })
    })
}
