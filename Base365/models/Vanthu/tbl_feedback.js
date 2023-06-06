const mongoose = require('mongoose');
const tblFeedback = new mongoose.Schema({
    _id: {
        type: Number
    },
    user_fb: {
        type: Number
    },
    vb_fb: {
        type: Number
    },
    name_user: {
        type: String
    },
    nd_fb: {
        type: String
    },
    createTime: {
        type: Number
    },

});

module.exports = mongoose.model("Vanthu_feedback", tblFeedback);