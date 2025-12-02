import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js"
import { getFirestore, 
         collection, 
         addDoc, 
         doc, 
         setDoc,
         onSnapshot} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js" 
import { getAuth,
         signOut,
         onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js"

const firebaseConfig = {
    databaseURL: "https://easy-voting-fd3ad-default-rtdb.firebaseio.com/",
    apiKey: "AIzaSyDrA_yYmQJNEgyWO0yJLoRVxBydmSuiP_4",
    authDomain: "easy-voting-fd3ad.firebaseapp.com",
    projectId: "easy-voting-fd3ad",
    storageBucket: "easy-voting-fd3ad.firebasestorage.app"
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app) 
const auth = getAuth(app)

const votingTable = document.getElementById("voting-table-body")
const electionTitle = document.getElementById("election-title")
const candidateVoted = document.getElementById("candidate-voted")
const signOutBtn = document.getElementById("sign-out-btn")

let tr = ""
let td1 = ""
let td2 = ""
let indexOfRow = ""
let voteCountIncrement = ""
let voteCount = [0]

signOutBtn.addEventListener("click", authSignOut)

onAuthStateChanged(auth, (user) => {
  if (user) { 
    renderListOfCandidates()
  } 
  else {
    location.href = "voter.html" 
  }
})

function authSignOut(){
    signOut(auth).then(() => {

    })
    .catch((error) => {
        console.log(error.message)
    })
}
function renderListOfCandidates(){
    onSnapshot(collection(db, "candidates"), (querySnapshot) => {
        clearAll(votingTable)
        
        querySnapshot.forEach((doc) => {
            const voteBtnEl = document.createElement("button")
            voteBtnEl.textContent = "VOTE"
            tr = votingTable.insertRow()
            td1 = tr.insertCell(0)
            td1.innerHTML = `${doc.data().name}`
            td2 = tr.insertCell(1)
            td2.appendChild(voteBtnEl)
        })
    })
}
function clearAll(element){
    element.innerHTML = ""
}

votingTable.addEventListener("click", function(event){
    if (event.target.tagName === "BUTTON"){
        let buttonClicked = event.target
        let row = buttonClicked.closest('tr')
        let candidateName = row.cells[0].textContent
        indexOfRow = row.rowIndex
        voteCountIncrement = voteCount[indexOfRow]++
        push(resultReferenceInDB, voteCount)
        candidateVoted.textContent = `you voted ${candidateName} vote count ${voteCount}`
    }
})





    
 

