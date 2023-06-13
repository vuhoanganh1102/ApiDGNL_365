const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CandidateSchema = new Schema({
   // id ứng viên
   _id: {
      type: Number,
      require: true
   },
   // tên ứng viên
   name: {
      type: String,
      default: null
   },
   // email ứng viên
   email: {
      type: String,
      default: null
   },
   // số điện thoại ứng viên
   phone: {
      type: String,
      default: null
   },
   // CV tới từ đâu
   cv_from: {
      type: String,
      default: null
   },
   // người đề xuất
   user_recommend: {
      type: Number,
      require: true
   },
   // id tin tuyển dụng
   recruitment_news_id: {
      type: Number,
      default: null
   },
   // thời gian gửi CV
   time_send_cv: {
      type: String,
      default: null
   },
   // thời gian phỏng vấn
   interview_time: {
      type: String,
      default: null
   },
   // kết quả phỏng vấn
   interview_result: {
      type: Number,
      default: null
   },
   // đánh giá phỏng vấn
   interview_vote: {
      type: String,
      default: null
   },
   // lương thoả thuật
   salary_agree: {
      type: String,
      default: null
   },
   // trạng thái
   status: {
      type: String,
      default: null
   },
   // CV
   cv: {
      type: String,
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
   // tình trạng xoá
   is_delete: {
      type: Number,
      default: 0
   },
   // id công ty
   com_id: {
      type: Number,
      require: true
   },
   // tình trạng job
   is_offer_job: {
      type: Number,
      require: true,
      default: 0
   },
   // giới tính
   can_gender: {
      type: Number,
      require: true,
   },
   // ngày sinh
   can_birthday: {
      type: String,
      require: true
   },
   // trường học
   can_education: {
      type: Number,
      require: true,
   },
   // kinh nghiệm
   can_exp: {
      type: Number,
      require: true,
   },
   // tình trạng hôn nhân
   can_is_married: {
      type: Number,
      require: true
   },
   // địa chỉ
   can_address: {
      type: String,
      require: true
   },
   // 
   user_hiring: {
      type: Number,
      require: true
   },
   // sao
   star_vote: {
      type: Number,
      require: true
   },
   // trường học
   school: {
      type: String,
      require: true
   },
   // quê quán
   hometown: {
      type: String,
      require: true
   },
   // tình trạng chuyển
   is_switch: {
      type: Number,
      require: true,
      default: 0
   },
   ep_id_crm: {
      type: Number,
      require: true,
      default: 0
   },
   cancel_job: {
      type: [
         {
            //id Cancel_job
            id_cancel_job: {
               type: Number,
               require: true
            },

            // trạng thái xoá
            is_delete: {
               type: Number,
               require: true,
               default: 0
            },
            // thời gian xoá
            deleted_at: {
               type: String,
               require: true,
            },
            // lương đề xuất
            resired_salary: {
               type: String,
               require: true
            },
            // lương
            salary: {
               type: String,
               require: true
            },
            // ghi chú
            note: {
               type: String,
               require: true,
            },
            // email ứng viên
            status: {
               type: Number,
               require: true,
            },
            // trạng thái chuyển
            is_switch: {
               type: Number,
               require: true
            },
            // thời gian tạo
            created_at: {
               type: String,
               require: true,
            }
         }
      ]
   },
   failed_job: {
      type: [
         {
            //id Failed_job
            id_failed_job: {
               type: Number,
               require: true
            },
            //  1. Trượt vòng loại hồ sơ. 2. Trượt phỏng vấn, 3. Trượt học việc	
            type: {
               type: Number,
               require: true
            },
            // trạng thái xoá
            is_delete: {
               type: Number,
               require: true,
               default: 0
            },
            // thời gian xoá
            deleted_at: {
               type: String,
               require: true,
            },
            // ghi chú
            note: {
               type: String,
               require: true,
            },
            // email ứng viên
            email: {
               type: String,
               require: true,
            },
            // nội dung gửi
            contentsend: {
               type: String,
               require: true,
            },
            // trạng thái chuyển
            is_switch: {
               type: Number,
               default: 0
            },
            // thời gian tạo
            created_at: {
               type: String,
               require: true,
            }
         }
      ]
   },
   get_job: {
      type: [
         {
            // id get_job
            id_get_job: {
               type: Number,
               require: true
            },
            // lương đề xuất
            resired_salary: {
               type: String,
               require: true
            },
            // lương
            salary: {
               type: String,
               require: true
            },
            // thời gian phỏng vấn
            interview_time: {
               type: String,
               require: true
            },
            ep_interview: {
               type: Number,
               require: true
            },
            // ghi chú
            note: {
               type: String,
               require: true
            },
            // email ứng viên
            candidate_email: {
               type: String,
               require: true
            },
            // nội dung gửi
            contentsend: {
               type: String,
               require: true
            },
            // trạng thái chuyển
            is_switch: {
               type: Number,
               require: true,
               default: 0
            },
            // trạng thái xoá
            is_delete: {
               type: Number,
               require: true,
               default: 0
            },
            // thời gian xoá
            deleted_at: {
               type: String,
               require: true
            },
            // thời gian tạo
            created_at: {
               type: String,
               require: true
            }
         }
      ]
   },
   contact_job:{
      type:[{
          // id get_job
          id_contact_job: {
            type: Number,
            require: true
         },
         // lương đề xuất
         resired_salary: {
            type: String,
            require: true
         },
         // lương
         salary: {
            type: String,
            require: true
         },
         offer_time: {
            type: String,
            require: true
         },
         ep_offer: {
            type: Number,
            require: true
         },
         // ghi chú
         note: {
            type: String,
            require: true
         },
         // trạng thái chuyển
         is_switch: {
            type: Number,
            require: true,
            default: 0
         },
         // trạng thái xoá
         is_delete: {
            type: Number,
            require: true,
            default: 0
         },
         // thời gian xoá
         deleted_at: {
            type: String,
            require: true
         },
         // thời gian tạo
         created_at: {
            type: String,
            require: true
         }
      }]
   },
   // đối tượng quá trình phòng vấn
   tbl_process_interview:{
      type:[{
         // id tiến trình phỏng vấn
         id_tbl_process_interview:{
            type:Number,
            require:true
         },
         // tên quá trình
         name:{
            type:String,
            require:true
         },
         // quá trình trước
         process_before:{
            type:Number,
            require:true
         },
         // id công ty
         com_id:{
            type:Number,
            require:true
         },
         before_process:{
            type:Number,
            default:0
         },
         // thời gian tạo
         created_at:{
            type:String,
            require:true
         },
         // đối tượng lịch trình phỏng vấn
         tbl_schedule_interview:{
            type:[{
               // id lịch trình phỏng vấn
               id_tbl_schedule_interview:{
                  type: Number,
                  require:true
               },
               // nhân viên phỏng vấn
               ep_interview:{
                  type: Number,
                  require:true
               },
               // lương mong muốn
               resired_salary:{
                  type: String,
                  require:true
               },
               // mức lương
               salary:{
                  type: String,
                  require:true
               },
               // thời gian phỏng vấn
               interview_time:{
                  type: String,
                  require:true
               },
               // nội dung gửi
               contentsend:{
                  type: String,
                  require:true
               },
               // tình trạng chuyển đổi
               is_switch:{
                  type: Number,
                  require:true,
                  default:0
               },
               // ghi chú
               note:{
                  type: String,
                  require:true
               },
               // id nhân viên crm
               id_ep_crm:{
                  type: String,
                  require:true
               },
               // thời gian tạo
               created_at:{
                  type: String,
                  require:true
               }
            }]
            
         },
         // đối tượng mời phỏng vấn
         invite_interview:{
            type:[{
               id_invite_interview:{
                  type:Number,
                  require:true
               },
               position_apply:{
                  type:String,
                  require:true
               },
               hr_name:{
                  type:String,
                  require:true
               },
               content:{
                  type:String,
                  require:true
               },
               note:{
                  type:String,
                  require:true
               },
               note_test:{
                  type:String,
                  require:true
               }
            }]
         }
      }]
   },
   // đối tượng CV
   get_cv:[{
      // id get CV
      id_get_cv:{
         type:Number,
         require:true
      },
      // trạng thái xoá
      is_delete:{
         type:Number,
         require:true,
         default:0
      },
      // thời gian xoá
      deleted_at:{
         type:String,
         require:true
      },
      // thời gian tạo
      created_at:{
         type:String,
         require:true
      }

   }],
   // đối tượng skill khác
   another_skill:{
      type:[{
         // id skill
         id_another_skill:{
            type:Number,
            require:true
         },
         // tên kĩ năng
         skill_name:{
            type:String,
            require:true
         },
         // bầu chọn kĩ năng
         skill_vote:{
            type:Number,
            require:true
         },
         // ngày tạo
         created_at:{
            type:String,
            require:true
         }
      }]
   }


})
module.exports = mongoose.Model("HR_Candidate", CandidateSchema)