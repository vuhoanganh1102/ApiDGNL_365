const mongoose = require('mongoose');
const nguoiDuyetVanBan = new mongoose.Schema({
    id_duyet: {
        type: Number
    },
    id_vb_duyet: {
        type: Number
    },
    id_user_duyet: {
        type: Number
    },
    time_duyet: {
        type: Number
    }
});
module.exports = mongoose.model("user_duyet_vb", nguoiDuyetVanBan);