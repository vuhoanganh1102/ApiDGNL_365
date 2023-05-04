import mongoose from "mongoose";
const ThuSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            require: true
        },
        name:{
            type: String,
        },
        alias:{
            type: String,
        },
        image:{
            type: String,
        },
        price:{
            type: Number,
        },
        color:{
            type: String
        },
        view:{
            type: Number
        },
        favorite:{
            type: Number
        },
        download:{
            type: Number
        },
        vip:{
            type: Number
        },
        htmlVi:{
           type: String
        },
        htmlEn:{
            type: String
        },
        htmlJp:{
            type: String
        },
        htmlCn:{
            type: String
        },
        htmlKr:{
            type: String
        },
        cateId:{
            type: Number
        },
        exp:{
            type: Number
        },
        nhuCau:{
            type: Number
        },
        sstatus:{
            Type: Number
        }

    },
    { collection: 'Thu',
      versionKey: false}
)

export default mongoose.model("Thu", ThuSchema)