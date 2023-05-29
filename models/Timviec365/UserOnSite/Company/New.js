const mongoose = require('mongoose');
const newTV365Schema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    userID: Number,
    title: {
        // tiêu đề
        type: String,
        default: null,
    },
    newMd5: {
        type: String,
        default: null,
    },
    alias: {
        // tên tiêu đè không đấu
        type: String,
        default: null,
    },

    redirect301: {
        // link quay lại
        type: String,
        default: ""
    },

    cateID: [{
        // thể loại việc làm
        type: String,
        default: null,
    }],
    realCate: {
        type: String,
        default: null,
    },


    tagID: {
        //thể loại tag
        type: Number,
        default: null,
    },

    cityID: [{
        // thành phố
        type: String,
    }],

    districtID: [{
        // quận huyện
        type: String,
    }],

    address: {
        // dịa chỉ
        type: String,
        default: null,
    },
    money: {
        //giá trị trong option trong khoảng , nếu là 1 thì không phải option trong khoảng
        type: Number,
        default: 0
    },

    capBac: {
        // cấp bậc
        type: Number,
        default: 0
    },

    exp: {
        //kinh nghiệm
        type: Number,
        default: 0
    },

    sex: {
        //giới tính
        type: String,
        default: 0
    },

    bangCap: {
        //bằng cấp
        type: Number,
        default: 0
    },

    soLuong: {
        //sô lượng
        type: Number,
        default: 0
    },

    hinhThuc: {
        //hình thức
        type: Number,
        default: 0
    },

    doTuoi: {
        // độ tuổi
        type: Number,
        default: 0
    },

    createTime: {
        // thời gian tạo bài đăng
        type: Date,
        default: null,
    },

    updateTime: {
        // thới gian update
        type: Date,
        default: null,
    },

    vipTime: {
        // thời gian vip của bài post
        type: Date,
        default: null,
    },
    vip: {
        type: Number,
        default: 0
    },
    cateTime: {
        type: Date,
        default: null,
    },

    active: {
        // 0 là chưa được duyệt 1 là ngược lại
        type: Number,
        default: 0
    },

    type: {
        // thể loại
        type: Number,
        default: 0
    },
    over: {
        //
        type: Number,
        default: 0
    },

    viewCount: {
        // số lượng xem
        type: Number,
        default: 0
    },

    hanNop: {
        // hạn nộp
        type: Date,
        default: null,
    },
    userRedirect: {
        type: Number,
        default: null
    },
    post: {
        type: Number,
        default: 0
    },
    renew: {
        type: Number,
        default: 0
    },
    newHot: {
        type: Number,
        default: 0
    },
    newDo: {
        type: Number,
        default: 0
    },
    newCao: {
        type: Number,
        default: 0
    },
    newGap: {
        type: Number,
        default: 0
    },
    newNganh: {
        type: Number,
        default: 0
    },
    newGhim: {
        type: Number,
        default: 0
    },
    newThuc: {
        type: Number,
        default: 0
    },
    newOrder: {
        type: Number,
        default: 0
    },
    newUt: {
        //
        type: Number,
        default: 0
    },
    hideAdmin: {
        type: Number,
        default: 0
    },
    sendVip: {
        type: Number,
        default: 0
    },
    newPoint: {
        type: Number,
        default: 0
    },
    newMutil: {

        moTa: {
            // mô tả công việc
            type: String,
            default: null,
        },
        // yêu cầu    
        yeuCau: {
            type: String,
            default: null,
        },

        quyenLoi: {
            //quyền lợi
            type: String,
            default: null,
        },

        hoSo: {
            //hô sơ  nhà tuyển dụng cần để ứng viên có
            type: String,
            default: null,
        },
        //tiêu đề seo
        titleSeo: {
            type: String,
            default: null,
        },

        desSeo: {
            // nọi dung seo
            type: String,
            default: null
        },

        hoaHong: {
            // hoa hồng nhận được
            type: String,
            default: null,
        },
        tgtv: {
            type: String,
            default: null,
        },
        lv: [{
            type: String,
            default: null,
        }],
        baoLuu: {
            type: String,
            default: null,
        },
        timeBaoLuu: {
            type: Date,
            default: null,
        },
        jobPosting: {
            type: Number,
        },

        videoType: {
            // video bài post
            type: String,
            default: null,
        },
        videoActive: {
            type: String,
            default: null,
        },

        link: {
            // link video
            type: String,
            default: null,
        },

        images: [{
            // list ảnh bài post
            type: String,
            default: null,
        }]

    },
    newMoney: {

        type: {
            // thể loại
            type: Number,
            default: null
        },

        minValue: {
            // từ mức
            type: Number,
            default: null
        },

        maxValue: {
            //đến mức
            type: Number,
            default: null
        },

        unit: {
            // loại tiền
            type: Number,
            default: 1
        }
    },

}, {
    collection: 'NewTV365',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("NewTV365", newTV365Schema);