const sampleTimeseries = [
    {
        id: 1,
        patientId: 1,
        date: "2022-04-02",
        data: {
            bloodGlucose: {
                status: "recorded",
                value: 10,
                createdAt: new Date().toString(),
                comment: "i am pat",
            },
            insulin: {
                status: "unrecorded",
                createdAt: "",
                value: 0,
                comment: "",
            },
            weight: {
                status: "unrecorded",
                value: 0,
                createdAt: "",
                comment: "",
            },
            exercise: {
                status: "unrecorded",
                value: 0,
                createdAt: "",
                comment: "",
            },
        },
    },

    {
        id: 2,
        patientId: 2,
        date: "2022-04-05",
        data: {
            bloodGlucose: {
                status: "recorded",
                value: 10,
                createdAt: new Date().toString(),
                comment: "i am pat",
            },
            insulin: {
                status: "recorded",
                createdAt: new Date().toString(),
                value: 20,
                comment: "",
            },
            weight: {
                status: "recorded",
                value: 66,
                createdAt: new Date().toString(),
                comment: "",
            },
            exercise: {
                status: "recorded",
                value: 5000,
                createdAt: new Date().toString(),
                comment: "so cold",
            },
        },
    },
];
module.exports = sampleTimeseries;
