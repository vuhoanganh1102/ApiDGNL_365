const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProvisionsOfCompany = new Schema({
    _id: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    is_delete: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: true
    },
    time_start: {
        type: Date,
        default: Date.now(),
    },
    supervisor_name: {
        type: String,
    },
    com_id: {
        type: Number,
    },
    file: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    deleted_at: {
        type: Date,
    }
});

const RegulationGroupModel = mongoose.model('HR_ProvisionsOfCompany', ProvisionsOfCompany);

module.exports = RegulationGroupModel;