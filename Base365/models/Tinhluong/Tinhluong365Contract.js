const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
<<<<<<< HEAD
let connection = mongoose.createConnection('mongodb://127.0.0.1/api-base365');
=======
let connection = mongoose.createConnection('mongodb://localhost:27017/api-base365');
>>>>>>> 93b2358e97ed4d1db1444e660f4cbd347d3e847d


const Tinhluong365ContractSchema = new Schema({
    con_id: {
        type: Number,
        default:0
    },
    con_id_user: {
        type: Number,
        default:0
    },
    con_name: {
        type: String,
        default:""
    },
    con_time_up:{
        type: Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    },
    con_time_end:{
        type: Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    },
    con_file:{
        type: String,
        default:""
    },
    con_salary_persent:{
        type: String,
        default:""
    },
    con_time_created:{
        type: Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    }
}, {
    collection: 'Tinhluong365Contract',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
Tinhluong365ContractSchema.pre('save', async function(next) {
    try{
        await Counter.findOneAndUpdate({TableId: 'Tinhluong365ContractSchemaId'}, {$inc: { Count: 1} });
        next();
    }
    catch(e){
        return next(e);
    }
});
module.exports = connection.model("Tinhluong365Contract", Tinhluong365ContractSchema);