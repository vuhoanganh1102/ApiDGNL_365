const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NtdXemUvSchema = new Schema({
    stt: {
        type: Number,
        required: true,
    },
    id_ntd: {
        type: Number,
        required: true,
    },
    id_uv: {
        type: Number,
        required: true,
    },
    ket_qua: {
        type: Number,
        default: 0,
    },
    time_created: {
        type: Number,
        default: 0,
    }
},{
    collection: 'VLTH_NtdXemUv',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("VLTH_NtdXemUv",NtdXemUvSchema);
