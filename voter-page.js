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
const voterAction = document.getElementById("voter-action")
const signOutBtn = document.getElementById("sign-out-btn")

let tr = ""
let td1 = ""
let td2 = ""

signOutBtn.addEventListener("click", authSignOut)
votingTable.addEventListener("click", listenToVote)

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "voters", user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists() && docSnap.data().role === "voter") {
            console.log("you're a voter")
            renderListOfCandidates()
        }
        else{
            console.log("you're not a voter")
            location.href = "voter.html"
        }
    } 
    else {
    location.href = "voter.html" 
    }
})
function authSignOut(){
    signOut(auth).then(() => {
        location.href = "voter.html"
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
            voteBtnEl.setAttribute("class", "vote-btn")
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
async function listenToVote(event){
    if (event.target.tagName === "BUTTON"){
        const buttonClicked = event.target
        const row = buttonClicked.closest('tr')
        const candidateId = row.dataset.candidateId
        const voterId = auth.currentUser.uid
        await checkIfVoterAlreadyVotedAndUpdateCandidateVoteCount(candidateId, voterId)
    }
}
async function checkIfVoterAlreadyVotedAndUpdateCandidateVoteCount(candidateId, voterId) {
    const candidateDocRef = doc(db, "candidates", candidateId)
    const voterDocRef = doc(db, "voted", voterId)
    try {
        await runTransaction(db, async (transaction) => {
            const userVoteDoc = await transaction.get(voterDocRef)
            if (userVoteDoc.exists()) {
                throw voterAction.textContent = "You have already voted!"
            }
            transaction.set(voterDocRef, { 
                votedAt: new Date(),
                hasVoted: true
            })
            transaction.update(candidateDocRef, { votes: increment(1) })
        })
    voterAction.textContent = "Vote successfully cast!"
    } catch (error) {
    voterAction.textContent = `Vote failed: ${error}`
  }
}
