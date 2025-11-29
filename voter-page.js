import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js"
import { getDatabase, 
         ref,
         push,
         onValue,
         remove,
         runTransaction,
        } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js"

const firebaseConfig = {
    databaseURL: "https://easy-voting-fd3ad-default-rtdb.firebaseio.com/"
}
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const candidatesReferenceInDB = ref(database, "candidates")
const positionReferenceInDB = ref(database, "position")
const resultReferenceInDB = ref(database, "result")
const votesReferenceInDB = ref(database, "votes")

const votingTable = document.getElementById("voting-table-body")
const electionTitle = document.getElementById("election-title")
const candidateVoted = document.getElementById("candidate-voted")
let tr = ""
let td1 = ""
let td2 = ""
let indexOfRow = ""
let voteCountIncrement = ""
let voteCount = [0]

onValue(candidatesReferenceInDB, function(snapshot){
    votingTable.innerHTML = ""
    const snapshotExists = snapshot.exists()
    if (snapshotExists){
        const snapshott = snapshot.val()
        const snapshotValue = Object.keys(snapshott)
        const snapshotLength = snapshotValue.length - 1
        let candidateName = []
        //const candidateName = snapshotValue[snapshotLength]
        for(let i = 0; i <= snapshotLength; i++){
            const voteBtnEl = document.createElement("button")
            voteBtnEl.textContent = "VOTE"
            const keyy = snapshotValue[i]
            candidateName.push(keyy)
            tr = votingTable.insertRow()
            td1 = tr.insertCell(0)
            td1.innerHTML = `${snapshott[candidateName[i]]}`
            td2 = tr.insertCell(1)
            td2.appendChild(voteBtnEl)
            voteCount.push(0)
        }
    }
})

runTransaction(votesReferenceInDB, function(snapshot){
    const snapshotExists = snapshot.exists()
    if (snapshotExists){
        const snapshott = snapshot.val()
        const snapshotKey = Object.keys(snapshott)
        const snapshotLength = snapshotKey.length - 1
        let votesKey = []
        //const candidateName = snapshotValue[snapshotLength]
        for(let i = 0; i <= snapshotLength; i++){
            // const voteBtnEl = document.createElement("button")
            // voteBtnEl.textContent = "VOTE"
            const keyy = snapshotKey[i]
            votesKey.push(keyy)
            tr = votingTable.insertRow()
            td1 = tr.insertCell(0)
            td1.innerHTML = `${snapshott[votesKey[i]]}`
            td2 = tr.insertCell(1)
            td2.appendChild(voteBtnEl)
            voteCount.push(0)
        }
    }
})

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





    
 

