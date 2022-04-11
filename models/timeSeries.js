const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeSeriesSchema = new Schema({
    name: String,
    value: Number,
    unit: String,
    lowerBound: Number,
    upperBound: Number,
    isRequired: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('TimeSeries', timeSeriesSchema);