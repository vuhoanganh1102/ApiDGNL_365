import mongoose from "mongoose";
const blogSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
            required: true,
        },
        adminID:{
            // id nhân viên
            type:Number,
            default:0
        },
        langID:{
            // id ngôn ngữ sử dụng
            type:Number,
            default:1
        },
        // tiêu đề
        title:String,
        // tiêu đề không dấu viết liền bằng - của title
        titleRewrite:String,
        // link quay lại
        redirect301: {
            type:String,
            required:true,
        },
        canonical:{
            //nội dung seo sử dụng
            type:String,
            required:true,
        },
        mail:{
            //
            type:Number,
            default:0,
            required:true,
        },
        picture:{
            //link file ảnh
            type:String,
            required:true,
        },
        teaser:{
            //code html
            type:String,
            required:true,
        },
        description:{
            //code html của blog
            type:String,
            required:true,
        },
        thongTin:{
            // thông tin
            type:String,
            required:true,
        },
        des:{
            //nội dung blog
            type:String,
            required:true,
        },
        //từ khóa của bài viết
        keyword:String,
        //video blog
        video:{
            type:String,
            required:true,
        },
        categoryID:{
            type:Number,
            required:true,
            default:0
        },
        categoryCB:{
            type:Number,
            required:true,
        },
        //thời gian đăng
        date:Date,
        adminEdit: {
            //admin sửa cuối cùng
            type:Number,
            required:true,
            default:0
        },
        dateLastEdit:{
            //thời gian sửa lần cuối
            type:Date,
            default:0
        },
        order:{
            //mức độ ưu tiên
            type:Number,
            default:0
        },
        hits:{
            type:Number,
            default:0
        },
        active:{
            //kích hoạt
            type:Number,
            default:1
        },
        cateUrl:{
            //danh sách loại url
            type:String,
            required:true
        },
        hot:{
            type:Number,
            default:0
        },
        new:{
            type:Number,
            default:0
        },
        view:{
            //số view
            type:Number,
            default:0
        },
        urlLq:{
            type:String,
            required:true
        },
        tagCate:{
            type:Number,
            default:0,
            required:true
        },
        Vl:{
            //nghề tuyển dụng
            type:String,
            required:true
        },
        tdgy:{
            type:String,
        },
        ndgy:{
            type:String,
        },
        audio:{
            type:Number,
            required:true,
            default:0
        },
    })
