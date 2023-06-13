const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    // id user
    _id:{
        type:Number,
        require:true
    },
    // email
    email:{
        type:String,
        default:null
    },
    // phone
    phone:{
        type:String,
        default:null
    },
    // tên
    name:{
        type:String,
        default:null
    },
    // id công ty
    company_id:{
        type:Number,
        default:null
    },
    // tên công ty
    company_name:{
        type:String,
        require:true
    },
    // id bộ phận
    department_id:{
        type:Number,
        default:null
    },
    // mật khẩu
    password:{
        type:String,
        default:null
    },
    // chức năng
    role_id:{
        type:Number,
        default:null
    },
    // giới tính
    gender:{
        type:Number,
        default:null
    },
    // địa chỉ
    address:{
        type:String,
        default:null
    },
    // ngày sinh
    birthday:{
        type:Number,
        default:null
    },
    // ngày tạo
    created_at:{
        type:Number,
        default:null
    },
    // ngày update
    updated_at:{
        type:Number,
        default:null
    },
    // tình trạng xoá
    is_delete:{
        type:Number,
        default:null
    },
   // kiểm tra 
    authentic:{
        type:Number,
        default:null
    },
    // trạng thái
    status:{
        type:String,
        default:null
    },
    // id vị trí 
    position_id:{
        type:Number,
        default:null
    },
    // hình ảnh
    image:{
        type:String,
        default:null
    },
    // mổ tả
    description:{
        type:String,
        default:null
    },
    // id user
    user_id:{
        type:Number,
        require:true
    },
    // access_token
    access_token:{
        type:String,
        require:true
    },
    // đối tượng permision user
    permision:{
        type:[{
            id_permision:{
                type:Number,
                require:true
            },
            name_per:{
                type:String,
                require:true
            },
            // đối tượng permision detail
            per_detail:{
                type:[{
                        id_per_detail:{
                            type:Number,
                            require:true
                        },
                        action_name:{
                            type:String,
                            require:true  
                        },
                        action_code:{
                            type:String,
                            require:true  
                        },
                        
                    }
                ]
            }
        }]
    }


})

module.export = mongoose.Schema("HR_Users",UserSchema)