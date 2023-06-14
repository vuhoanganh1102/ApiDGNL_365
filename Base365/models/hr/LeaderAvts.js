const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LeaderAvtSchema = new Schema({
    // id avatar leader
    _id:{
        type: Number,
        require: true
    },
    // id nhân viên
    ep_id:{
        type: Number,
        require: true
    },
    // avatar
    avatar:{
        type: String,
        require: true
    },
    // thời gian tạo
    created_at:{
        type: String,
        require: true
    }
})