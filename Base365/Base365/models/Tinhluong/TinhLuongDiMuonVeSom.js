const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');


const TinhluongDiMuonVeSomSchema = new Schema({
    dmvs_id:{
        type: Number,
        require:true
    },
    dmvs_com: {
        type: Number,
        require:true
    },
    dmvs_name: {
        type: String,
        default:""
    },
    dmvs_time_start:{
        type:Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    },
    dmvs_time_end:{
        type:Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    },
    dmvs_shift: {
        type: Number,
        default: 0
    }
},{
    collection: 'TinhluongDiMuonVeSom',
    versionKey: false,
    timestamp: true
})


// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongDiMuonVeSomSchema.pre('save', async function(next) {
    try{
        await Counter.findOneAndUpdate({TableId: 'TinhluongDiMuonVeSomId'}, {$inc: { Count: 1} });
        next();
    }
    catch(e){
        return next(e);
    }
});

module.exports = connection.model("TinhluongDiMuonVeSom", TinhluongDiMuonVeSomSchema); 