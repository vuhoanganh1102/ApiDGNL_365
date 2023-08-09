const mongoose = require('mongoose');
const newTV365Schema = new mongoose.Schema({
    new_id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    new_title: {
        // tiêu đề
        type: String,
        default: null,
    },
    new_md5: {
        type: String,
        default: null,
    },
    new_alias: {
        // tên tiêu đề không dấu
        type: String,
        default: null,
    },
    new_301: {
        // url điều hướng 301
        type: String,
        default: ""
    },
    // Ngành nghề việc làm
    new_cat_id: [{
        type: Number,
        default: null,
    }],
    new_real_cate: {
        type: String,
        default: null,
    },
    // Tỉnh thành làm việc
    new_city: [{
        type: Number,
        default: null,
    }],
    // quận huyện
    new_qh_id: [{
        type: Number,
        default: null,
    }],
    // địa chỉ chi tiết
    new_addr: {
        type: String,
        default: null,
    },
    //giá trị trong option trong khoảng , nếu là 1 thì không phải option trong khoảng
    new_money: {
        type: Number,
        default: 0
    },
    // cấp bậc
    new_cap_bac: {
        type: Number,
        default: 0
    },
    //kinh nghiệm
    new_exp: {
        type: Number,
        default: 0
    },
    //bằng cấp
    new_bang_cap: {
        type: Number,
        default: 0
    },
    //giới tính
    new_gioi_tinh: {
        type: String
    },
    //sô lượng
    new_so_luong: {
        type: Number,
        default: 0
    },
    //hình thức
    new_hinh_thuc: {
        type: Number,
        default: 0
    },
    new_user_id: {
        type: Number,
        default: 0
    },
    new_user_redirect: {
        type: Number,
        default: 0
    },
    // độ tuổi
    new_do_tuoi: {
        type: Number,
        default: 0
    },
    // thời gian tạo bài đăng
    new_create_time: {
        type: Number,
        default: 0,
    },
    // thới gian update
    new_update_time: {
        type: Number,
        default: 0,
    },
    // thời gian vip của bài post
    new_vip_time: {
        type: Number,
        default: 0,
    },
    new_vip: {
        type: Number,
        default: 0,
    },
    new_cate_time: {
        type: Date,
        default: null,
    },
    // 0 là chưa được duyệt 1 là ngược lại
    new_active: {
        type: Number,
        default: 1
    },
    // thể loại
    new_type: {
        type: Number,
        default: 1
    },
    //
    new_over: {
        type: Number,
        default: 0
    },
    // số lượng xem
    new_view_count: {
        type: Number,
        default: 0
    },
    // hạn nộp
    new_han_nop: {
        type: Number,
        default: 0,
    },
    new_post: {
        type: Number,
        default: 1
    },
    new_renew: {
        type: Number,
        default: 0
    },
    new_hot: {
        type: Number,
        default: 0
    },
    new_do: {
        type: Number,
        default: 0
    },
    new_cao: {
        type: Number,
        default: 0
    },
    new_gap: {
        type: Number,
        default: 0
    },
    new_nganh: {
        type: Number,
        default: 0
    },
    new_ghim: {
        type: Number,
        default: 0
    },
    new_thuc: {
        type: Number,
        default: 0
    },
    new_order: {
        type: Number,
        default: 11
    },
    new_ut: {
        type: Number,
        default: 0
    },
    send_vip: {
        type: Number,
        default: 0
    },
    new_hide_admin: {
        type: Number,
        default: 0
    },
    new_point: {
        type: Number,
        default: 0
    },
    new_test: {
        type: Number,
        default: 0
    },
    new_badge: {
        type: Number,
        default: 0
    },
    // mô tả công việc
    new_mota: {
        type: String,
        default: null,
    },
    // yêu cầu    
    new_yeucau: {
        type: String,
        default: null,
    },
    //quyền lợi
    new_quyenloi: {
        type: String,
        default: null,
    },
    //hô sơ  nhà tuyển dụng cần để ứng viên có
    new_ho_so: {
        type: String,
        default: null,
    },
    //tiêu đề seo
    new_title_seo: {
        type: String,
        default: null,
    },
    // nọi dung seo
    new_des_seo: {
        type: String,
        default: null,
    },
    // hoa hồng nhận được
    new_hoahong: {
        type: String,
        default: null,
    },
    new_tgtv: {
        type: String,
        default: null,
    },
    new_lv: {
        type: String,
        default: null,
    },
    new_bao_luu: {
        type: String,
        default: null,
    },
    time_bao_luu: {
        type: Number,
        default: 0,
    },
    no_jobposting: {
        type: Number,
        default: 0
    },
    new_video: {
        type: String,
        default: null,
    },
    // video bài post
    new_video_type: {
        type: Number,
        default: 1,
    },
    new_video_active: {
        type: Number,
        default: 0,
    },
    // list ảnh bài post
    new_images: {
        type: String,
        default: null,
    },
    nm_id: {
        type: Number,
        default: null
    },
    nm_type: {
        type: Number,
        default: null
    },
    nm_min_value: {
        type: Number,
        default: null
    },
    nm_max_value: {
        type: Number,
        default: null
    },
    nm_unit: {
        type: Number,
        default: null
    }
}, {
    collection: 'NewTV365',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("NewTV365", newTV365Schema);