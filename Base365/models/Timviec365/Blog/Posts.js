const mongoose = require('mongoose');
const PostsTV365Schema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    adminID: {
        // ID của admin đăng bài
        type: Number,
        default: 0
    },
    title: {
        // Tiêu đề của bài viết
        type: String,
        default: null
    },
    titleRewrite: {
        // Slug của bài viết (sinh ra theo tiêu đề)
        type: String,
        default: null
    },
    mail: {
        // 
        type: Number,
        default: 0
    },
    redirect301: {
        // Link điều hướng 301
        type: String,
        default: null
    },
    canonical: {
        // Link canonical tương ứng mà seo muốn đặt
        type: String,
        default: null
    },
    picture: {
        // Ảnh đại diện bài viết
        type: String,
        default: null
    },
    sapo: {
        type: String,
        default: null
    },
    content: {
        // Nội dung bài viết
        type: String,
        default: null
    },
    seoTitle: {
        // Nội dung tiêu đề thẻ meta title
        type: String,
        default: null
    },
    seoDescription: {
        // Nội dung tiêu đề thẻ meta description
        type: String,
        default: null
    },
    seoKeyword: {
        // Nội dung tiêu đề thẻ meta keyword
        type: String,
        default: null
    },
    urlVideo: {
        // Đường dẫn video 
        type: String,
        default: null
    },
    categoryID: {
        // ID của danh mục blog
        type: Number,
        default: 0
    },
    categoryCB: {
        // ID của ngành nghề liên quan
        type: Number,
        default: 0
    },
    createdAt: {
        // Thời điểm tạo bài viết
        type: Date,
        default: Date()
    },
    updateAt: {
        // Thời điểm chỉnh sửa bài viết
        type: Date,
        default: 0
    },
    adminEdit: {
        // ID của admin chỉnh sửa lần cuối
        type: Number,
        default: 0
    },
    order: {
        // Mức độ ưu tiên
        type: Number,
        default: 0
    },
    hits: {
        // Có phải tin hot hay không
        type: Number,
        default: 0
    },
    active: {
        // Tin có được kích hoạt hay không
        type: Number,
        default: 1
    },
    cateUrl: [{
        // Đường dẫn ngành nghề liên quan
        type: String,
        default: null
    }],
    isHot: {
        // Có phải tin hot hay không
        type: Number,
        default: 0
    },
    new: {
        type: Number,
        default: 0
    },
    view: {
        // Lượt xem
        type: Number,
        default: 0
    },
    urlLq: {
        // 
        type: String,
        default: null
    },
    tagCate: {
        // ID ngành nghề
        type: Number,
        default: 0,
    },
    jobKeyword: {
        // Từ khóa việc làm
        type: String,
        default: null
    },
    suggestTitle: {
        // Tiêu đề gợi ý
        type: String,
        default: null
    },
    suggestContent: {
        // Nội dung gợi ý
        type: String,
        default: null
    },
    audio: {
        // Đường dẫn audio
        type: String,
        default: null
    },
}, {
    collection: 'PostsTV365',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("PostsTV365", PostsTV365Schema);