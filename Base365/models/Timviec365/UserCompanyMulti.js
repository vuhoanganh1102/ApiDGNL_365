const mongoose = require('mongoose');
const Tv365UserCompanyMultiSchema = new mongoose.Schema({
    pri_id: {
        type: Number,
        required: true
    },
    usc_id: {
        type: Number,
        required: true
    },
    usc_company_info: {
        type: String,
        default: null
    },
    usc_map: {
        type: String,
        default: null
    },
    usc_dgc: {
        type: String,
        default: null
    },
    usc_dgtv: {
        type: String,
        default: null
    },
    usc_dg_time: {
        type: Number,
        default: 0
    },
    usc_skype: {
        type: String,
        default: null
    },
    usc_video_com: {
        type: String,
        default: null
    },
    usc_lv: {
        type: String,
        default: null
    },
    usc_zalo: {
        //Zalo ntd
        type: String,
        default: null
    },
}, {
    collection: 'Tv365UserCompanyMulti',
})
module.exports = mongoose.model("Tv365UserCompanyMulti", Tv365UserCompanyMultiSchema);