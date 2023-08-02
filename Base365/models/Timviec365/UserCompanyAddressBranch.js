const mongoose = require('mongoose');
const Tv365UserCompanyAddressBranchSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    usc_id: {
        //id công ty
        type: Number,
        required: true
    },
    usc_branch_cit: {
        //tỉnh thành chi nhánh
        type: Number,
        default: 0
    },
    usc_branch_qh: {
        //quận huyện chi nhánh
        type: Number,
        default: 0
    },
    usc_branch_address: {
        //địa chỉ chi nhánh
        type: Number,
        default: 0
    },
    usc_branch_time: {
        //Thời gian tạo
        type: Number,
        default: 0
    },

}, {
    collection: 'Tv365UserCompanyAddressBranch',
})
module.exports = mongoose.model("Tv365UserCompanyAddressBranch", Tv365UserCompanyAddressBranchSchema);