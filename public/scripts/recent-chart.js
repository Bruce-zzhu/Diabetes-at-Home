var histData = histData;
var dates = [];
var bloodData = [];
var weightData = [];
var insulinData = [];
var exerciseData = [];

for (ts of histData) {
    var date = ts.date;
    var res = `${date[0]}/${date[1]}`;
    dates.push(res);
    
    bloodData.push(ts.timeSeries.bloodGlucose.value);
    weightData.push(ts.timeSeries.weight.value);
    insulinData.push(ts.timeSeries.insulin.value);
    exerciseData.push(ts.timeSeries.exercise.value);
}

var labels = dates.reverse();
bloodData.reverse();
weightData.reverse();
insulinData.reverse();
exerciseData.reverse();

const data = {
    labels: labels,
    datasets: [
        {
            label: 'BloodGlucose (mmol/L)',
            backgroundColor: 'rgb(217, 22, 22)',
            borderColor: 'rgb(217, 22, 22)',
            data: bloodData,
        },

    ],
};


const config = {
    type: 'line',
    data: data,
    options: {
        scales: {
            y: {
                suggestedMin: 0,
                suggestedMax: 20
            }
        }
    },
};


const myChart = new Chart(document.getElementById('myChart'), config);
