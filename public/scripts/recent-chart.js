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
        // {
        //     label: 'Weight (kg)',
        //     backgroundColor: 'rgb(255, 186, 0)',
        //     borderColor: 'rgb(255, 186, 0)',
        //     data: weightData,
        // },
        // {
        //     label: 'Insulin',
        //     backgroundColor: 'rgb(171, 59, 213)',
        //     borderColor: 'rgb(171, 59, 213)',
        //     data: insulinData,
        // },
        // {
        //     label: 'Exercise',
        //     backgroundColor: 'rgb(35, 150, 81)',
        //     borderColor: 'rgb(35, 150, 81)',
        //     data: exerciseData,
        // }, 
    ],
};
const data2 = {
    labels: labels,
    datasets: [
        {
            label: 'Weight (kg)',
            backgroundColor: 'rgb(255, 186, 0)',
            borderColor: 'rgb(255, 186, 0)',
            data: weightData,
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
const config2 = {
    type: 'line',
    data: data2,
    options: {},
};

const myChart = new Chart(document.getElementById('myChart'), config);
const myChart2 = new Chart(document.getElementById('myChart2'), config2);
