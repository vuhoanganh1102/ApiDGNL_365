const mongoose = require('mongoose');
const LoveNewschema = new mongoose.Schema({
    _id:{
        type:Number,
        require:true
    },
    id_new:{
        type:Number,
        require:true
    },
    id_user:{
        type:Number,
        require:true
    },
    createdAt:{
        type:Date,
        require:true
    }
});
module.exports = mongoose.model("LoveNews", LoveNewschema);