import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js"
import { getDatabase, 
         ref,
         push,
         onValue,
         remove,
        } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js"

const firebaseConfig = {
    databaseURL: "https://easy-voting-fd3ad-default-rtdb.firebaseio.com/"
}
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const candidatesReferenceInDB = ref(database, "candidates")
const positionReferenceInDB = ref(database, "position")
const votingTable = document.getElementById("voting-table-body")
const electionTitle = document.getElementById("election-title")
let tr = ""
let td1 = ""
let td2 = ""


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
        }
    }
})

// onValue(positionReferenceInDB, function(snapshot){
//     votingTable.innerHTML = ""
//     const snapshotExists = snapshot.exists()
//     if (snapshotExists){
//         const snapshott = snapshot.val()
//         const snapshotValue = Object.keys(snapshott)
//         const snapshotLength = snapshotValue.length - 1
//         let candidateName = []
//         //const candidateName = snapshotValue[snapshotLength]
//         for(let i = 0; i <= snapshotLength; i++){
//             const voteBtnEl = document.createElement("button")
//             voteBtnEl.textContent = "VOTE"
//             const keyy = snapshotValue[i]
//             candidateName.push(keyy)
//             tr = votingTable.insertRow()
//             td1 = tr.insertCell(0)
//             td1.innerHTML = `${snapshott[candidateName[i]]}`
//             td2 = tr.insertCell(1)
//             td2.appendChild(voteBtnEl)
//         }
//     }
// })






    
 

