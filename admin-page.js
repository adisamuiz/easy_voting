import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js"
import { getDatabase, 
         ref,
         push,
         onValue,
         remove} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js"
import { getAuth,
         signOut,
         onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js"

const firebaseConfig = {
    databaseURL: "https://easy-voting-fd3ad-default-rtdb.firebaseio.com/",
    apiKey: "AIzaSyDrA_yYmQJNEgyWO0yJLoRVxBydmSuiP_4",
    authDomain: "easy-voting-fd3ad.firebaseapp.com",
    projectId: "easy-voting-fd3ad",
    storageBucket: "easy-voting-fd3ad.firebasestorage.app",
}
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const database = getDatabase(app)
const candidatesReferenceInDB = ref(database, "candidates")
const positionReferenceInDB = ref(database, "position")
const votesReferenceInDB = ref(database, "votes")

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

signOutBtn.addEventListener("click", authSignOut)

onAuthStateChanged(auth, (user) => {
  if (user) { 
  } 
  else {
    location.href = "admin.html" 
  }
})

function authSignOut(){
    signOut(auth).then(() => {
        //location.href = "admin.html" 
    }).catch((error) => {
        console.log(error.message)
    })
}

onValue(candidatesReferenceInDB, function(snapshot){
    resultTable.innerHTML = ""
    const snapshotExists = snapshot.exists()
    if (snapshotExists){
        const snapshott = snapshot.val()
        const snapshotValue = Object.keys(snapshott)
        const snapshotLength = snapshotValue.length - 1
        let candidateName = []
        for(let i = 0; i <= snapshotLength; i++){
            const keyy = snapshotValue[i]
            candidateName.push(keyy)
            trr = resultTable.insertRow()
            tdd1 = trr.insertCell(0)
            tdd1.innerHTML = `${snapshott[candidateName[i]]}`
            tdd2 = trr.insertCell(1)
        }
    }
})

createBtn.addEventListener("click", function(){
    noOfCandidates = noOfCandidatesInput.value
    position = positionInput.value
    if(noOfCandidates && position){
        noOfCandidatesInput.value = ""
        positionInput.value = ""
        push(positionReferenceInDB, position)
    }
}) 
registerBtn.addEventListener("click", function(){
    candidateName = candidateNameInput.value
    if(candidateName && noRegistered < noOfCandidates){
        noRegistered++
        candidateNameInput.value = ""
        push(candidatesReferenceInDB, candidateName)
        push(votesReferenceInDB, 0)
    }
})

resetBtn.addEventListener("click", function(){
    deleteDBContent()
    noOfCandidates = 0
})

function deleteDBContent(){
    remove(candidatesReferenceInDB)
}
