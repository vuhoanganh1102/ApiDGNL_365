import {Schema, model} from "mongoose";

export default interface IFormBlog{
    name:string,
    title:string,
    url:string,
    redirect301:string,
    cateID:number,
    tagID:number,
    avatar:string,
    teaser:string,
    description:string,
    sapo:string,
    ghim:number,
    view:number,
    time:Date,
    timeEdit:Date,
    file:number,
    dg:number,
    cateUrl:string,
    ponitDg:number,
    adminEdit:number,
    audio:number,
}
const formBlogSchema = new Schema<IFormBlog>({
    name: {
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
    },
    redirect301:{
        type:String,
        required:true,
    },
    cateID:{
        type:Number,
        required:true,
    },
    tagID:{
        type:Number,
        required:true,
    },
    avatar:{
        type:String,
        required:true,
    },
    teaser:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    sapo:{
        type:String,
        required:true,
    },
    ghim:{
        type:Number,
        required:true,
    },
    view:{
        type:Number,
        required:true,
        default:0
    },
    time:Date,
    timeEdit:Date,
    file:{
        type:Number,
        required:true,
    },
    dg:{
        type:Number,
        required:true,
    },
    cateUrl:{
        type:String,
        required:true,
    },
    ponitDg:{
        type:Number,
        required:true,
    },
    adminEdit:{
        type:Number,
        required:true,
    },
    audio:{
        type:Number,
        required:true,
    },
})
const FormBlog = model('Form_Blog', formBlogSchema);



export { FormBlog };
