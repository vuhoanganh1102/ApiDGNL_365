const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecruitmentSchema = new Schema({
    //Id của quy trình tuyển dụng
    _id: {
        type: Number,
        require: true
    },
    // tên quy trình tuyển dụng
    name: {
        type: String,
        require: true
    },
    // tên đơn vị, người tạo
    created_by: {
        type: String,
        default: null
    },
    // thời gian tạo
    created_at: {
        type: String,
        default: null
    },
    // thời gian xoá
    deleted_at: {
        type: String,
        require: true
    },
    // đã xoá chưa
    is_delete: {
        type: Number,
        default: 0
    },
    // áp dụng cho đối tượng 
    apply_for: {
        type: String,
        default: null
    },
    // 
    slug: {
        type: String,
        require: true
    },
    // id công ty
    com_id: {
        type: Number,
        require: true
    },
    // có phải công ty không
    is_com: {
        type: Number,
        require: true
    },
    // đối tượng tin tuyển dụng
    recruitment_news: {
        type:[{
             //Id của tin tuyển dụng
        id_recruitment_news: {
            type: Number,
            require: true
        },
        // tên tiêu đề tuyển dụng
        title: {
            type: String,
            default: null
        },
        // vị trí tuyển dụng
        position_apply: {
            type: Number,
            default: null
        },
        // id thành phố
        cit_id: {
            type: Number,
            default: null
        },
        // địa chỉ 
        address: {
            type: String,
            default: null
        },
        // id danh mục
        cate_id: {
            type: Number,
            default: null
        },
        // id lương
        salary_id: {
            type: Number,
            default: null
        },
        // số lượng muốn tuyển
        number: {
            type: Number,
            default: null
        },
        // thời gian bắt đầu
        recruitment_time: {
            type: String,
            default: null
        },
        // thời gian kết thúc
        recruitment_time_to: {
            type: String,
            default: null
        },
        // chi tiết công việc
        job_detail: {
            type: String,
            default: null
        },
        // hình thức làm việc
        woking_form: {
            type: Number,
            default: null
        },
        // thời gian thử việc
        probationary_time: {
            type: String,
            default: null
        },
        // tiền hoa hồng
        money_tip: {
            type: Number,
            default: null
        },
        // mô tả công việc
        job_description: {
            type: String,
            default: null
        },
        // quyền lợi
        interest: {
            type: String,
            default: null
        },
        // kinh nghiệm
        job_exp: {
            type: Number,
            default: null
        },
        // bằng cấp
        degree: {
            type: Number,
            default: null
        },
        // giới tính
        gender: {
            type: Number,
            default: null
        },
        // yêu cầu công việc
        job_require: {
            type: String,
            default: null
        },
        //thành viên theo dõi
        member_follow: {
            type: Number,
            default: null
        },
        hr_name: {
            type: Number,
            default: null
        },
        // thời gian tạo
        created_at: {
            type: String,
            default: null
        },
        // thời gian update
        updated_at: {
            type: String,
            default: null
        },
        // thời gian xoá
        deleted_at: {
            type: String,
            require: true
        },
        // đã xoá chưa
        is_delete: {
            type: Number,
            require: true,
            default: 0,
        },
        // id công ty
        com_id: {
            type: Number,
            require: true,
            default: 0,
        },
        // có phải công ty
        is_com: {
            type: Number,
            require: true,
            default: 0,
        },
        // được tạo bởi
        created_by: {
            type: String,
            require: true,
        },
        is_sample: {
            type: Number,
            require: true,
            default: 0,
        },
        // đối tượng giai đoạn tuyển dụng 
        stage_recruitment: [{
            // id của giai đoạn tuyển dụng
            id_stage_recruitment: {
                type: Number,
                require: true
            },
            // tên giai đoạn
            name: {
                type: String,
                default: null
            },
            // vị trí
            position_assumed: {
                type: String,
                default: null
            },
            // mục tiêu
            target: {
                type: String,
                default: null
            },
            // thời gian hoàn thành
            complete_time: {
                type: String,
                default: null
            },
            // mô tả
            description: {
                type: String,
                default: null
            },
            // tình trạng xoá chưa
            is_delete: {
                type: Number,
                require: true,
                default: 0
            }
        }],
        // đối tượng thông tin phỏng vấn
        schedule_interview:[{
            // id thông tin phỏng vấn
            id_schedule_interview:{
                type:Number,
                require:true
            },
            // id ứng viên
            candidate_id:{
                type:Number,
                require:true
            },
            // thời gian phỏng vấn
            time_interview:{
                type:String,
                require:true
            },
           // Kết quả: 1. đang chờ phỏng vấn, 2. qua, 3. trượt	
            result:{
                type:Number,
                require:true
            },
            // tên hr
            hr_name:{
                type:String,
                require:true
            },
            // lương	
            salary:{
                type:String,
                require:true
            },
            // bầu chọn
            vote:{
                type:String,
                require:true
            },
            // kĩ năng giao tiếp
            communication_skill:{
                type:Number,
                require:true
            },
            //	Kỹ năng chuyên môn
            advanced_skill:{
                type:Number,
                require:true
            },
            //	Trình độ ngoại ngữ
            foreign_language:{
                type:Number,
                require:true
            },
            // kĩ năng khác
            another_skill:{
                type:Number,
                require:true    
            },
            // thêm thông tin           
            another:{
                type:String,
                require:true
            }

        }]

    }
]
    }
});

module.exports = mongoose.model("HR_Recruitment", RecruitmentSchema);