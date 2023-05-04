import mongoose from "mongoose";
const adminUserSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        loginName:String,
        password:String,
        name:String,
        email:String,
        author:String,
        address:String,
        phone:String,
        mobile:String,
        accesModule:String,
        accessCategory:String,
        date:{
            type: Date,
            default:0
        },
        isadmin:{
            type: Number,
            default:0
        },
        active:{
            type: Number,
            default:1
        },
        langID:{
            type: Number,
            default:1
        },
        delete:{
            type: Number,
            default:0
        },
        allCategory:{
            type: Number,
        },
        editAll:{
            type: Number,
            default:0
        },
        adminID:{
            type: Number,
            default:0
        },
        bophan:{
            type: Number,
            default:0
        },
        ntd:{
            type: Number,
            default:0,
            required:true
        },
        empID:{
            type: Number,
            required:true
        },
        nhaplieu:{
            type: Number,
            default:0,
            required:true
        },
        rank:{
            type: Number,
            required:true
        },
    })
