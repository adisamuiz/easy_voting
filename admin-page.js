import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js"
import { getAuth,
         signOut,
         onAuthStateChanged,
         createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js"
import { getFirestore, 
         collection, 
         addDoc, 
         doc, 
         setDoc,
         onSnapshot,
         deleteDoc,
         getDocs,
         getDoc,
         updateDoc} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js" 

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

const secondaryApp = initializeApp(firebaseConfig, "Secondary")
const secondaryAuth = getAuth(secondaryApp)

const signOutBtn = document.getElementById("sign-out-btn")
const registerBtn = document.getElementById("register-btn")
const registerVoterBtn = document.getElementById("register-voter-btn")
const createBtn = document.getElementById("create-btn")
const positionInput = document.getElementById("position-input")
const noOfCandidatesInput = document.getElementById("no-of-candidates-input")
const candidateNameInput = document.getElementById("candidate-name-input")
const resultTable = document.getElementById("result-table-body")
const resetBtn = document.getElementById("reset-btn")
const voterEmailInput = document.getElementById("voter-name-input")
const voterPassInput = document.getElementById("voter-pass-input")

let candidateName = ""
let noOfCandidates = 0
let position = ""
let trr = ""
let tdd1 = ""
let tdd2 = ""
let noRegistered = 0
let candidateIdInDB = 1

signOutBtn.addEventListener("click", authSignOut)
registerVoterBtn.addEventListener("click", authCreateVoterAccount)
resetBtn.addEventListener("click", resetElection)

onAuthStateChanged(auth, async (user) => {
    if (user) { 
        const docRef = doc(db, "admin", user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists() && docSnap.data().role === "admin") {
                console.log("you're an admin")
                renderListOfCandidates()
        }
        else{
            console.log("you're not an admin")
            location.href = "admin.html"
        }
    } 
    else {
        location.href = "admin.html" 
    }
})
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
function authSignOut(){
    signOut(auth).then(() => {
    })
    .catch((error) => {
        console.log(error.message)
    })
}
async function authCreateVoterAccount(){
    const email = voterEmailInput.value
    const password = voterPassInput.value
    try {
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password)
        const voterUid = userCredential.user.uid
        await addNewVoterToDB(voterUid)
        await signOut(secondaryAuth)
        voterEmailInput.value = ""
        voterPassInput.value = ""
        console.log("Voter added to DB successfully")
    } 
    catch (error) {
        console.error("Something went wrong:", error)
    }
}
async function addNewCandidateToDB(candidateName){
    try {
        await setDoc(doc(db, "candidates", `Candidate${candidateIdInDB}`), {
            name: candidateName,
            id: "",
            votes: 0
        })
        candidateIdInDB++
        console.log("Document written to DB")
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
async function addNewVoterToDB(uid){
    await setDoc(doc(db, "voters", uid), {
        voterId: uid,
        role: "voter"
    })
    console.log("Document written with ID: ", uid)
}
function clearAll(element){
    element.innerHTML = ""
}
async function resetElection(){
    clearAll(resultTable)
    noOfCandidates = 0
    candidateIdInDB = 1
    noRegistered = 0
    const candidatesSnapshot = await getDocs(collection(db, "candidates"))
    const votesSnapshot = await getDocs(collection(db, "voted"))
    for (const candidateDoc of candidatesSnapshot.docs) {
        await deleteDoc(candidateDoc.ref)
    }
    for (const voteDoc of votesSnapshot.docs) {
        await deleteDoc(voteDoc.ref)
    }
    console.log("Election reset successfully")
}

