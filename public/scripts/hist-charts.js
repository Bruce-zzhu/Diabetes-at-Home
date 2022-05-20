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

const bloodConfigData = {
    labels: labels,
    datasets: [
        {
            label: 'BloodGlucose (mmol/L)',
            backgroundColor: 'rgb(217, 22, 22)',
            borderColor: 'rgb(217, 22, 22)',
            data: bloodData,
        }

    ],
};
const weightConfigData = {
    labels: labels,
    datasets: [
        {
            label: 'Weight (kg)',
            backgroundColor: 'rgb(255, 186, 0)',
            borderColor: 'rgb(255, 186, 0)',
            data: weightData,
        }
    ],
};
const insulinConfigData = {
    labels: labels,
    datasets: [
        {
            label: 'Insulin (doses)',
            backgroundColor: 'rgb(171, 59, 213)',
            borderColor: 'rgb(171, 59, 213)',
            data: insulinData,
        },

    ],
};
const exerciseConfigData = {
    labels: labels,
    datasets: [
        {
            label: 'Exercise (steps)',
            backgroundColor: 'rgb(35, 150, 81)',
            borderColor: 'rgb(35, 150, 81)',
            data: exerciseData,
        }, 

    ],
};


const bloodConfig = {
    type: 'line',
    data: bloodConfigData,
    options: {},
};
const weightConfig = {
    type: 'line',
    data: weightConfigData,
    options: {},
};
const insulinConfig = {
    type: 'line',
    data: insulinConfigData,
    options: {},
};
const exerciseConfig = {
    type: 'line',
    data: exerciseConfigData,
    options: {},
};

const bloodChart = new Chart(document.getElementById('bloodChart'), bloodConfig);
const weightChart = new Chart(document.getElementById('weightChart'), weightConfig);
const insulinChart = new Chart(document.getElementById('insulinChart'), insulinConfig);
const exerciseChart = new Chart(document.getElementById('exerciseChart'), exerciseConfig);


