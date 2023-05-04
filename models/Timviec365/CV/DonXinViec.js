import mongoose from 'mongoose';
const DonXinViecSchema = new mongoose.Schema(
    {
        _id:{
            type: Number
        },
        name:{
            type: String
        },
        nameSub:{
            type: String
        },
        alias:{
            type: String
        },
        image:{
            type: String
        },
        price:{
            type: Number
        },
        view:{
            type: Number
        },
        favourite:{
            type:Number
        },
        downLoad:{
            type: Number
        },
        color:{
            type: String
        },
        htmlVi:{
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
        tId:{
            type: Number
        },
        status:{
            type: Number
        },
        vip:{
            type: Number
        },
        htmlEn:{
            type: String
        },
        htmlCn:{
            type: String
        },
        htmlJp:{
            type: String
        },
        htmlKr:{
            type: String
        },
        
    },
    { collection: 'DonXinViec',
      versionKey: false}
);

export default mongoose.model("DonXinViec", DonXinViecSchema)