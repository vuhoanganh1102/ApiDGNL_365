const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require('../Counter');
<<<<<<< HEAD
let connection = mongoose.createConnection('mongodb://127.0.0.1/api-base365');
=======
let connection = mongoose.createConnection('mongodb://localhost:27017/api-base365');
>>>>>>> 93b2358e97ed4d1db1444e660f4cbd347d3e847d


const TinhluongWelfareShiftSchema = new Schema({
    wf_id:{
        type: Number,
        require:true
    },
    wf_money: {
        type: Number,
        require:true
    },
    wf_time: {
        type:Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    },
    wf_time_end:{
        type:Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    },
    wf_shift:{
        type: Number,
        default:0
    },
    wf_com:{
        type: Number,
        default:0
    }
},{
    collection: 'TinhluongWelfareShift',
    versionKey: false,
    timestamp: true
})


// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongWelfareShiftSchema.pre('save', async function(next) {
    try{
        await Counter.findOneAndUpdate({TableId: 'TinhluongWelfareShiftId'}, {$inc: { Count: 1} });
        next();
    }
    catch(e){
        return next(e);
    }
});

module.exports = connection.model("TinhluongWelfareShift", TinhluongWelfareShiftSchema); 