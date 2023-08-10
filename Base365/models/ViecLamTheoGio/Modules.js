const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModulesSchema = new Schema({
    mod_id: {
        type: Number,
        required: true,
    },
    mod_path: {
        type: String,
        default: null,
    },
    mod_listname: {
        type: String,
        default: null,
    },
    mod_listfile: {
        type: String,
        default: null,
    },
    mod_order: {
        type: Number,
        default: 0,
    },
    mod_help: {
        type: String,
        default: null,
    },
    lang_id: {
        type: Number,
        default: 0,
    },
    mod_checkloca: {
        type: Number,
        default: 0,
    },
},{
    collection: 'VLTH_Modules',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("VLTH_Modules",ModulesSchema);
