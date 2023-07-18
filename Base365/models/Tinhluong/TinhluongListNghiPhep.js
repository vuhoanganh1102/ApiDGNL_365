const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://localhost:27017/api-base365');


const TinhluongListNghiPhepSchema = new Schema({
    of_id:{
        type: Number,
        require:true
    },
    of_name: {
        type: Number,
        require:true
    },
    of_note: {
        type: String,
        default:""
    },
    of_active:{
        type: Number,
        default:0
    },
    of_time_created:{
        type:Date,
        default:new Date()
    },
},{
    collection: 'TinhluongListNghiPhep',
    versionKey: false,
    timestamp: true
})


// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongListNghiPhepSchema.pre('save', async function(next) {
    try{
        await Counter.findOneAndUpdate({TableId: 'TinhluongListNghiPhepId'}, {$inc: { Count: 1} });
        next();
    }
    catch(e){
        return next(e);
    }
});

module.exports = connection.model("TinhluongListNghiPhep", TinhluongListNghiPhepSchema); 