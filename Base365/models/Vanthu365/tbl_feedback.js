const mongoose = require('mongoose');
const tblFeedback = mongoose.Schema({
    fbID: { type: Number },
    userFb: { type: Number },
    vb_fb: { type: Number },
    nameUser: { type: Number },
    ndFeedback: { type: String },
    createTime: { type: Number },

});

module.exports = mongoose.model("tbl_feedback", tblFeedback);