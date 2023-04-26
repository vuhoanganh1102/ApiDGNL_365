import {Schema, model} from "mongoose";
import ICity from "./city.model";
import ICategory from "./category.model";

interface IKeyword {
    name:string,
    lq:Date,
    cateID:number,
    cityID:ICity,
    qhID:number,
    cbID:number,
    teaser:string,
    type:number,
    err:number,
    qhKcn:number,
    cateLq:ICategory,
    title:string,
    description:string,
    keyword:string,
    h1:string,
    createTime:Date,
    redirect301:string,
    index:number,
    baoHam:number,
    tdgy:string,
    ndgy:string,
}
const keywordSchema = new Schema<IKeyword>({
    name:{
        type:String,
        required:true
    },
    lq:{
        type:Date,
        required:true
    },
    cateID:{
        type:Number,
        required:true
    },
    cityID:{
        type:Number,
        required:true,
        ref:'City'

    },
    qhID:{
        type:Number,
        required:true
    },
    cbID:{
        type:Number,
        required:true
    },
    teaser:{
        type:String,
        required:true
    },
    type:{
        type:Number,
        required:true
    },
    err:{
        type:Number,
        required:true
    },
    qhKcn:{
        type:Number,
        required:true
    },
    cateLq:{
        type:Number,
        required:true,
        ref:'Category'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    keyword:{
        type:String,
        required:true
    },
    h1:{
        type:String,
        required:true
    },
    createTime:{
        type:Date,
        required:true
    },
    redirect301:{
        type:String,
        required:true
    },
    index:{
        type:Number,
        required:true
    },
    baoHam:{
        type:Number,
        required:true
    },
    tdgy:{
        type:String,
        required:true
    },
    ndgy:{
        type:String,
        required:true
    },
})
const Keyword = model('Keyword', keywordSchema);



export { Keyword };
