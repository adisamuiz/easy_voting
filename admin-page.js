import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js"
import { getDatabase, 
         ref,
         push,
         onValue,
         remove} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js"

const registerBtn = document.getElementById("register-btn")
const createBtn = document.getElementById("create-btn")
const positionInput = document.getElementById("position-input")
const noOfCandidatesInput = document.getElementById("no-of-candidates-input")
const candidateNameInput = document.getElementById("candidate-name-input")
const resultTable = document.getElementById("result-table-body")
const resetBtn = document.getElementById("reset-btn")


let candidateName = ""
let noOfCandidates = 0
let position = ""
let trr = ""
let tdd1 = ""
let tdd2 = ""
let noRegistered = 0

const firebaseConfig = {
    databaseURL: "https://easy-voting-fd3ad-default-rtdb.firebaseio.com/"
}
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const candidatesReferenceInDB = ref(database, "candidates")
const positionReferenceInDB = ref(database, "position")

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
    }
})

resetBtn.addEventListener("click", function(){
    deleteDBContent()
})

function deleteDBContent(){
    remove(candidatesReferenceInDB)
}
