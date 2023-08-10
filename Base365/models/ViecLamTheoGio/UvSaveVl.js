const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UvSaveVlSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    id_uv: {
        type: Number,
        required: true,
    },
    id_viec: {
        type: String,
        required: true,
    },
    ntd_name: {
        type: String,
        required: true,
    },
    created_at: {
        type: Number,
        default: 0,
    },
},{
    collection: 'VLTH_UvSaveVl',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("VLTH_UvSaveVl",UvSaveVlSchema);
