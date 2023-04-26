import {Schema, model} from "mongoose";

export default interface IFormTag{
    name:string,
    redirect301:string,
    title:string,
    description:string,
    key:string,
    active:number
}
const formTagSchema = new Schema<IFormTag>({
    name: {
        type:String,
        required:true
    },
    redirect301: {
        type:String,
        required:true
    },
    title: {
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    key: {
        type:String,
        required:true
    },
    active: {
        type:Number,
        required:true
    }
})
const FormTag = model('Form_Tag', formTagSchema);



export { FormTag };
