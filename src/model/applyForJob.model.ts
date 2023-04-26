import {Schema, model} from "mongoose";
import IUser from "./users.model";
import INewTV365 from "./newTV365.model";

export default interface IApplyForJob {
    userID: IUser,
    newID: INewTV365,
    time: Date,
    active:number,
    kq:number,
    timePV:Date,
    timeTVS:Date,
    timeTVE:Date,
    text:string,
    cv:string
}
const applyForJobSchema = new Schema<IApplyForJob>({
    userID: {
        type:Number,
        required: true,
        ref: "User"
    },
    newID: {
        type:Number,
        required: true,
        ref:'NewTV365'
    },
    time: {
        type:Date,
        required: true
    },
    active:{
        type:Number,
        required: true
    },
    kq:{
        type:Number,
        required: true
    },
    timePV:{
        type:Date,
        required: true
    },
    timeTVS:{
        type:Date,
        required: true
    },
    timeTVE:{
        type:Date,
        required: true
    },
    text:{
        type:String,
        required: true
    },
    cv:{
        type:String,
        required: true
    }
})
const ApplyForJob = model('Apply_for_job', applyForJobSchema);


export {ApplyForJob};
