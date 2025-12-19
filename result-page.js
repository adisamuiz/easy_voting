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

let barChart = null;
let doughnutChart = null;
let lineChart = null;

onSnapshot(collection(db, "candidates"), async (querySnapshot) => {
    let labels = []
    let data = []
    await querySnapshot.forEach((doc) => {
        const candidateName = doc.data().name
        const candidateVotes = doc.data().votes
        labels.push(candidateName)
        data.push(candidateVotes)     
    })
    const { bgColors, borderColors } = generateColors(data.length)
    
    if (barChart === null) {
        initChart(labels, data, bgColors, borderColors)
    } 
    else {
        updateChart(labels, data, bgColors, borderColors)
    }
}, 
    (error) => {
        console.error("Error fetching updates:", error);
    })

    
function initChart(labels, data, bgColors, borderColors){
    barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                // label: 'My Dataset',
                data: data,
                backgroundColor: bgColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            scales: { 
                y: {
                    beginAtZero: true,
                    grid: { display: true }
                 },
                x: { grid: { display: false } },
            },
            responsive: true, 
            maintainAspectRatio: false,
            ticks: {
                stepSize: 1, 
                precision: 0 
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart',
                delay: (c) => {
                return c.dataIndex * 200; 
                }
            },
            plugins: {
                legend: {
                    display: true, 
                    labels: {
                        generateLabels: function(chart) {
                            const data = chart.data
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const ds = data.datasets[0]
                                    return {
                                        text: `${label}: ${ds.data[i]}`, 
                                        fillStyle: ds.backgroundColor[i], 
                                        strokeStyle: ds.borderColor[i],   
                                        lineWidth: 1,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return []
                        }
                    }
                }
            }
        }
    })
    doughnutChart = new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                // label: 'My Dataset',
                data: data,
                borderColor: borderColors,
                backgroundColor: bgColors
            }]
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
        }
    })
    lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Votes",
                data: data
            }]
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            ticks: {
                stepSize: 1, 
                precision: 0 
            }
        }
    })
}
function updateChart(labels, data, bgColors, borderColors) {
    barChart.data.labels = labels
    barChart.data.datasets[0].data = data
    barChart.data.datasets[0].backgroundColor = bgColors
    barChart.data.datasets[0].borderColor = borderColors
    barChart.update()

    doughnutChart.data.labels = labels
    doughnutChart.data.datasets[0].data = data
    doughnutChart.data.datasets[0].backgroundColor = bgColors
    doughnutChart.update()

    lineChart.data.labels = labels
    lineChart.data.datasets[0].data = data
    lineChart.update()
}
function generateColors(count) {
    const bgColors = [];
    const borderColors = [];
        const step = 360 / count; 

    for (let i = 0; i < count; i++) {
        const hue = Math.round(i * step);
        const colorString = "hsla(" + hue + ", 70%, 60%, 0.7)";
        const borderString = "hsla(" + hue + ", 70%, 60%, 1)";
        bgColors.push(colorString);
        borderColors.push(borderString);
    }

    return { bgColors, borderColors };
}
