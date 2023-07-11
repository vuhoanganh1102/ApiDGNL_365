const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    //ID của nhóm
    gr_id: {
        type: Number,
        required: true
    },
    //ID phong ban
    dep_id: {
        type: Number,
    },
    com_id: {
        type: Number,
    },
    team_id: {
        type: Number,
    },
    // Tên của nhóm
    gr_name: {
        type: String,
    },
    //ID quản lý nhóm
    managerId: {
        type: Number
    },
    //
    parent_gr: {
        type: Number
    },

}, {
    collection: 'QLC_Groups',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model('QLC_Groups', GroupSchema)