const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
<<<<<<< HEAD
let connection = mongoose.createConnection('mongodb://127.0.0.1/api-base365');

=======
let connection = mongoose.createConnection('mongodb://localhost:27017/api-base365');
>>>>>>> 93b2358e97ed4d1db1444e660f4cbd347d3e847d

// hoa hồng cá nhân, nhóm ứng với từng đối tượng 
const TinhluongClassSchema = new Schema({
    cls_id: {
        type: Number,
        default:0
    },
    cls_id_cl: {
        type: Number,
        default:0
    },
    cls_id_user: {
        type: Number,
        default:0
    },
    cls_id_group:{
        type: Number,
        default:0
    },
    cls_id_com:{
        type: Number,
        default:0
    },
    cls_day:{
        type: Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    },
    cls_day_end:{
        type: Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    },
    cls_salary:{
        type: Number,
        default:0
    },
    cls_custom:{
        type: Number,
        default:0
    },
    cls_time_created:{
        type: Date,
        default:new Date()
    },
}, {
    collection: 'TinhluongClass',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongClassSchema.pre('save', async function(next) {
    try{
        await Counter.findOneAndUpdate({TableId: 'TinhluongClassId'}, {$inc: { Count: 1} });
        next();
    }
    catch(e){
        return next(e);
    }
});
module.exports = connection.model("TinhluongClass", TinhluongClassSchema);