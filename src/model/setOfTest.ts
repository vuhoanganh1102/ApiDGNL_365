import {Schema, model} from "mongoose";

export default interface ISetOfTest{
    cate:string,
    order:number,
    footerOrder:number,
    description:string,
    keyword:string,
    title:string,
    mota:string
}
const setOfTestSchema = new Schema<ISetOfTest>({
    cate: {
        type:String,
        required:true,
    },
    order:{
        type:Number,
        required:true,
    },
    footerOrder:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    keyword:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    mota:{
        type:String,
        required:true,
    }
})
const SetOfTest = model('Set_Of_Test', setOfTestSchema);



export { SetOfTest };
