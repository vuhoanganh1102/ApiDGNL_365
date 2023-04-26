import {Schema, model} from "mongoose";

export default interface ICity{
    name:string,
    order:number,
    type:number,
    count:number,
    countVl:number,
    countVlCh:number,
    postCode:string,
    tw:number,
    code:string,
    cCode:string,
    imgCity:string,
    m:number
}
const citySchema = new Schema<ICity>({
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
    countVl:{
        type: Number,
        default:0
    },
    postCode:{
        type: String,
        required:true
    },
    tw:{
        type: Number,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    cCode:{
        type:String,
        required:true
    },
    imgCity:{
        type:String,
        required:true
    },
    m:{
        type:Number,
        required:true
    }
})
const City = model('City', citySchema);



export { City };
