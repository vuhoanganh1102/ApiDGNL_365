import {Schema, model} from "mongoose";

export default interface IDistrict{
    name:string,
    order:number,
    type:number,
    count:number,
    parent:number
}
const districtSchema = new Schema<IDistrict>({

    name:String,
    order:{
        type: Number,
        default:0
    },
    type:Number,
    count:{
        type: Number,
        default:0
    },
    parent:{
        type:Number,
        required:true
    }
})
const Districts = model('districts', districtSchema);



export { Districts };
