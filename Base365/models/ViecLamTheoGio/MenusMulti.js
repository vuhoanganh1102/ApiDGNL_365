const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MuSchema = new Schema({
    mnu_id: {
        type: Number,
        required: true,
    },
    mnu_name: {
        type: Number,
        required: true,
    },
    mnu_name_index: {
        type: String,
        required: true,
    },
    mnu_check: {
        type: String,
        required: true, 
    },
    mnu_link: {
        type: String,
        required: true,
    },
    mnu_target: {
        type: String,
        required: true,
    },
    mnu_description: {
        type: String,
        required: true,
    },
    mnu_data: {
        type: String,
        required: true,
    },
    admin_id: {
        type: String,
        required: true,
    },
    lang_id: {
        type: String,
        required: true,
    },
    mnu_active: {
        type: String,
        required: true,
    },
    mnu_active: {
        type: String,
        required: true,
    },
    
},{
    collection: 'VLTH_Mu',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("VLTH_Mu",MuSchema);
