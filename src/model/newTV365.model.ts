import {Schema, model} from "mongoose";
import ICity from "./city.model";
import IDistrict from "./districts.model";
import ICategory from "./category.model";

export default interface INewTV365 {
    userID: string,
    title: string,
    newMd5: string,
    alias:string,
    minValue: string,
    redirect301: string,
    cateID: ICategory,
    tagID:string,
    cityID:ICity,
    districtID:IDistrict,
    address:string,
    money:number,
    capBac:number,
    exp:number,
    sex:string,
    salary:number,
    hinhThuc:number,
    doTuoi:number,
    createTime:Date,
    updateTime:Date,
    vipTime:Date,
    vip:Date,
    cateTime:Date,
    active:number,
    type:number,
    over:number,
    viewCount:number,
    hanNop:Date,
    post:number,
    renew:number,
    newMulti:object,
    newMoney:object,
}

const newTV365Schema = new Schema<INewTV365>({
    userID:String,
    title:String,
    newMd5:String,
    alias:String,
    redirect301:String,
    cateID:{
        type:String,
        ref:'Category'
    },
    tagID:String,
    cityID:{
        type:String,
        ref:"City"
    },
    districtID:{
        type:String,
        ref:"District"
    },
    address:String,
    money:Number,
    capBac:Number,
    exp:Number,
    sex:Number,
    salary:Number,
    hinhThuc:Number,
    doTuoi:Number,
    createTime:Date,
    updateTime:Date,
    vipTime:Date,
    vip:Date,
    cateTime:Date,
    active:Number,
    type:Number,
    over:Number,
    viewCount:Number,
    hanNop:Date,
    post:Number,
    renew:Number,
    newMulti:{
        type:{
            priNewId:{
                type:Number,
                required: true,
            },
            newId:{
                type:Number,
                required: true,
            },
            moTa:String,
            yeuCau:String,
            quyenLoi:String,
            hoSo:{
                type:String,
                required: true,
            },
            titleSeo:{
                type:String,
                required: true,
            },
            desSeo:{
                type:String,
                required: true,
            },
            hoaHong:{
                type:String,
                required: true,
            },
            tgtv:{
                type:String,
                required: true,
            },
            lv:{
                type:String,
                required: true,
            },
            baoLuu:String,
            timeBaoLuu:{
                type:Date,
                required: true,
            },
            jobPosting:{
                type:Number,
                required: true,
            },
            videoType:{
                type:Number,
                required: true,
            },
            videoActive:{
                type:String,
                required: true,
            },
            images:{
                type:String,
                required: true,
            }
        },
        default:null
    },
    newMoney:{
        type:{
            id: {
                type: Number,
                required: true,
            },
            newId: {
                type: Number,
                required: true,
            },
            type: {
                type: Number,
                required: true,
            },
            minValue: Number,
            maxValue: Number,
            unit: {
                type: Number,
                required: true,
            }
        },
        default:null
    }
})
const NewTV365 = model('NewTV365', newTV365Schema);


export {NewTV365};
