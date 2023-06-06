const mongoose = require('mongoose');
const vanBan_dinh_kem = new mongoose.Schema({
    _id : {
        type : Number
    },
    id_van_ban : {
        type : Number
    },
    ten_tep_dinh_kem : {
        type : String
    },
    file_dinh_kem : {
        type : String
    }

});
module.exports = mongoosee.model("Van_thu_van_ban_dinh_kem",vanBan_dinh_kem)
