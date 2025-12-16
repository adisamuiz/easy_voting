import { Chart } from "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.esm.js"
const ctx = document.getElementById("resultChart")

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['A', 'B', 'C'],
        datasets: [{
            label: 'My Dataset',
            data: [10, 20, 30]
        }]
    }
})