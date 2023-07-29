const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://localhost:27017/api-base365');


const TinhluongListRoseSchema = new Schema({
    lr_id:{
        type: Number,
        require:true
    },
    lr_name: {
        type:String,
        default:""
    },
    lr_note: {
        type:String,
        default:""
    },
    lr_status:{
        type:String,
        default:""
    },
    lr_time_created:{
        type:Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    }
},{
    collection: 'TinhluongListRose',
    versionKey: false,
    timestamp: true
})


// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongListRoseSchema.pre('save', async function(next) {
    try{
        await Counter.findOneAndUpdate({TableId: 'TinhluongListRoseId'}, {$inc: { Count: 1} });
        next();
    }
    catch(e){
        return next(e);
    }
});

module.exports = connection.model("TinhluongListRose", TinhluongListRoseSchema); 