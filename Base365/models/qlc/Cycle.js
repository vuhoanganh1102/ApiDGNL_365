const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://localhost:27017/api-base365');


const CC365_CycleSchema = new Schema({
    cy_id: {
        type: Number,
        require:true
    },
    com_id: {
        type: Number,
        require:true
    },
    cy_name: {
        type: String,
        default:""
    },
    apply_month:{
        type: Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    },
    cy_detail:{
        type: String,
        default:""
    },
    status:{
        type: Number,
        default:1
    },
    is_personal:{
        type: Number,
        default:0
    }
}, {
    collection: 'CC365_Cycle',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
CC365_CycleSchema.pre('save', async function(next) {
    try{
        let maxId = await connection.model("CC365_Cycle", CC365_CycleSchema).find({},
            {cy_id:1}).sort({cy_id:-1}).limit(1);
        if(maxId && maxId.length){
            console.log(maxId)
            maxId = maxId[0].cy_id + 1;
            await Counter.findOneAndUpdate({TableId: 'CC365_CycleId'}, {$set:{Count:maxId}});
            console.log('Cập nhật counter')
            next();
        }
        else{
            return false;
        }
    }
    catch(e){
        return next(e);
    }
});
module.exports = connection.model("CC365_Cycle", CC365_CycleSchema);