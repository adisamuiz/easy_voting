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
const ctxBar = document.getElementById("result-bar-chart")
const ctxDoughnut = document.getElementById("result-doughnut-chart")
const ctxLine = document.getElementById("result-line-chart")



onSnapshot(collection(db, "candidates"), async (querySnapshot) => {
    let labels = []
    let data = []
        await querySnapshot.forEach((doc) => {
           const candidateName = doc.data().name
           const candidateVotes = doc.data().votes
           labels.push(candidateName)
           data.push(candidateVotes)     
        })
        renderChart(labels, data)
    })
    
function renderChart(labels, data){
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'My Dataset',
                data: data
            }]
        }
    })
    new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'My Dataset',
                data: data
            }]
        }
    })
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'My Dataset',
                data: data
            }]
        }
    })
}
