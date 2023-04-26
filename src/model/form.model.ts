import {Schema, model} from "mongoose";

export default interface IForm{
    cate:string,
    order:number,
    footerOder:number,
    description:string,
    h1:string,
    keyword:string,
    title:string,
    mota:string,
}
const formSchema = new Schema<IForm>({
    cate: {
        type:String,
        required:true,
    },
    order:{
        type:Number,
        required:true,
    },
    footerOder:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    h1:{
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
    },
})
const Form = model('Form', formSchema);



export { Form };
