import {Schema, model} from "mongoose";

export default interface ISetOfTestTag{
    name:string,
    redirect301:string,
    title:string,
    description:string,
    key:string,
    active:number
}
const setOfTestTagSchema = new Schema<ISetOfTestTag>({
    name: {
        type:String,
        required:true,
    },
    redirect301: {
        type:String,
        required:true,
    },
    title: {
        type:String,
        required:true,
    },
    description: {
        type:String,
        required:true,
    },
    key: {
        type:String,
        required:true,
    },
    active: {
        type:Number,
        required:true,
    }
})
const SetOfTestTag = model('Set_Of_Test_Tag', setOfTestTagSchema);



export { SetOfTestTag };
