import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js"
import { getFirestore, 
         collection, 
         addDoc, 
         doc, 
         setDoc,
         onSnapshot,
         runTransaction, 
         increment, 
         getDoc,
         updateDoc} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js" 
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
let voterId = ""

signOutBtn.addEventListener("click", authSignOut)
votingTable.addEventListener("click", listenToVote)

onAuthStateChanged(auth, (user) => {
    if (user) {
    voterId = user.uid
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
            tr.setAttribute("data-candidate-id", doc.id)
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
function listenToVote(event){
    if (event.target.tagName === "BUTTON"){
        const buttonClicked = event.target
        const row = buttonClicked.closest('tr')
        const candidateId = row.dataset.candidateId
        checkIfVoterAlreadyVotedAndUpdateCandidateVoteCount(candidateId, voterId)
    }
}
async function checkIfVoterAlreadyVotedAndUpdateCandidateVoteCount(candidateId, voterId) {
    const candidateDocRef = doc(db, "candidates", candidateId)
    const voterDocRef = doc(db, "voted", voterId)
    try {
        await runTransaction(db, async (transaction) => {
            const userVoteDoc = await transaction.get(voterDocRef)
            if (userVoteDoc.exists()) {
                throw "User has already voted!"
            }
            transaction.set(voterDocRef, { votedAt: new Date() })
            transaction.update(candidateDocRef, { votes: increment(1) })
        })
    console.log("Vote successfully cast!")
    } catch (error) {
    console.error("Vote failed: ", error)
  }
}




    
 

