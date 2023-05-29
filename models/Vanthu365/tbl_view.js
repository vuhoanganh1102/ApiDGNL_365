const mongoose = require('mongoose');
const View = new mongoose.Schema({
    id_view: {
        type: Number,
    },
    id_user: {
        type: Number,
    },
    id_vb: {
        type: Number,
    },
    time: {
        type: Number,
    }
});
module.exports = mongoose.model("tbl_view", View);