import {Schema, model} from "mongoose";

interface Department {
    com_id:number,
    dep_name:string,
    dep_created_time:Date,
    manager_id:number,
    dep_order:number
}
const dePartmentSchema = new Schema<Department>({
  com_id:Number,
  dep_name:String,
  dep_created_time:Date,
  manager_id:Number,
  dep_order:Number
})
const Departments = model('Departments', dePartmentSchema);



export { Departments };
