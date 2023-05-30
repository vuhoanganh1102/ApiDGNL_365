const mongoose = require('mongoose');
const Schema = mongoose.Schema
const UserSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    email: {
        // Email đăng nhập (nếu đối tượng đăng ký bằng email)
        type: String,
        // required: true,
    },
    phoneTK: {
        // Sđt đăng nhập (nếu đối tượng đăng ký bằng sđt)
        type: String,
        default: null,
    },
    userName: {
        // Tên của đối tượng
        type: String,
        // required: true,
    },
    alias: {
        // Phục vụ sinh ra url seo (slug)
        type: String,
        default: null
    },
    phone: {
        // Sđt liên hệ
        type: String,
        default: null
    },
    emailContact: {
        // Email của người liên hệ
        type: String,
        default: null
    },
    avatarUser: {
        // Ảnh đại diện
        type: String,
        default: null
    },
    type: {
        // 0: Cá nhân, 1: Công ty, 2: Nhân viên
        type: Number,
        required: true,
    },
    password: {
        // Mật khẩu đăng nhập
        type: String,
        // required: true,
    },
    city: {
        // Tỉnh thành của đối tượng khi đăng ký
        type: Number,
        default: null,
    },
    district: {
        // Quận huyện của đối tượng khi đăng ký
        type: Number,
        default: null,
    },
    address: {
        // Địa chỉ chi tiết của đối tượng khi đăng ký
        type: String,
        default: null,
    },
    otp: {
        // OTP xác thực khi thực hiện 1 chức năng nào đó (Đăng ký thành công, quên mật khẩu,...) mà cần otp
        type: String,
        default: null
    },
    authentic: {
        // Tình trạng kích hoạt tài khoản hay chưa (0: Chưa kích hoạt, 1: Đã kích hoạt)
        type: Number,
        default: 0
    },
    isOnline: {
        // Trạng thái online bên chat
        type: Number,
        default: 0
    },
    fromWeb: {
        // Nguồn đăng ký từ site nào
        type: String,
        default: null
    },
    fromDevice: {
        // Nguồn đăng ký từ thiết bị nào
        type: Number,
        default: 0
    },
    createdAt: {
        // Thời gian đăng ký
        type: Date,
        default: null
    },
    updatedAt: {
        // Thời gian cập nhật
        type: Date,
        default: null
    },
    lastActivedAt: {
        // Thời gian hoạt động gần nhất
        type: Date,
        default: null
    },
    time_login: {
        // Thời gian đăng nhập
        type: Date,
        default: null
    },
    role: {
        // Quyền thực hiện bên quản lý chung
        type: Number,
        default: 0
    },
    latitude: {
        // Tọa độ lat
        type: String,
        default: null
    },
    longtitude: {
        // Tọa độ long
        type: String,
        default: null
    },
    idQLC: {
        // ID gốc lấy từ base chuyển đổi số
        type: Number,
        default: 0
    },
    idTimViec365: {
        // ID gốc lấy từ base timviec365
        type: Number,
        default: 0
    },
    idRaoNhanh365: {
        // ID gốc lấy từ base raonhanh365
        type: Number,
        default: 0
    },
    chat365_secret: {
        // Mã chat
        type: String,
        default: null
    },
    inForPerson: {
        type: {
            // Thông tin dành cho luồng chuyển đổi số
            companyID: {
                // ID của công ty chủ quyền nếu là nhân viên (giá trị = 0 là cá nhân)
                type: Number,
                default: 0
            },
            depID: {
                // ID của phòng ban nếu là nhân viên (giá trị = 0 là cá nhân)
                type: Number,
                default: 0
            },
            groupID: {
                // ID của nhóm nếu là nhân viên (giá trị = 0 là cá nhân)
                type: Number,
                default: 0
            },
            positionID: {
                // Cấp bậc của nhân viên trong công ty
                type: Number,
                default: 0
            },
            startWorkingTime: {
                // Thời gian bắt đầu làm việc
                type: String,
                default: null
            },
            timeQuitJob: {
                // Thời gian nghỉ việc
                type: String,
                default: null
            },
            description: {
                // Mô tả chi tiết
                type: String,
                default: null
            },
            status: {
                // Trạng thái
                type: String,
                default: null
            },
            ep_signature: {
                // Chữ ký
                type: Number,
                default: 0
            },
            allow_update_face: {
                // Cho phép cập nhật khuôn mặt chấm công
                type: Number,
                default: 0
            },
            version_in_use: {
                // Version dùng trên app
                type: Number,
                default: 0
            },
            ep_featured_recognition: {
                // Chưa rõ
                type: String,
                default: null
            },
            birthday: {
                // Ngày sinh
                type: String,
                default: null
            },
            gender: {
                // Giới tính
                type: Number,
                default: 0
            },
            married: {
                // Tình trạng hôn nhân
                type: Number,
                default: 0
            },
            exp: {
                // Kinh nghiệm làm việc trong thôn tin liên hệ
                type: Number,
                default: 0
            },
            // Thông tin dùng trên timviec365
            candiTitle: {
                // Công việc mong muốn
                type: String,
                default: 0
            },
            candiHocVan: {
                // Học vấn
                type: Number,
                default: 0
            },
            candiTarget: {
                // Mục tiêu làm việc
                type: String,
                default: null
            },
            candiSkill: {
                // Kỹ năng làm việc
                type: String,
                default: null
            },
            candiCityID: {
                // Tỉnh thành làm việc mong muốn
                type: String,
                default: null
            },
            candiCateID: {
                // Ngành nghề làm việc mong muốn
                type: String,
                default: null
            },
            candiCapBac: {
                // Cấp bậc làm việc mong muốn
                type: Number,
                default: 0
            },
            candiMoney: {
                // Mức lương mong muốn
                type: Number,
                default: 0
            },
            candiMoneyUnit: {
                // Mức lương mong muốn (vnd/usd)
                type: Number,
                default: 0
            },
            candiMoneyType: {
                // Mức lương mong muốn (thỏa thuận hoặc từ min đến max)
                type: Number,
                default: 0
            },
            candiMoneyMin: {
                // Mức lương mong muốn
                type: Number,
                default: 0
            },
            candiMoneyMax: {
                // Mức lương mong muốn
                type: Number,
                default: 0
            },
            candiLoaiHinh: {
                // Loại hình làm việc (fulltime, parttime,...)
                type: Number,
                default: 0
            },
            referencePersonName: {
                // Tên người tham chiếu
                type: String,
                default: null
            },
            referencePersonEmail: {
                // Email người tham chiếu
                type: String,
                default: null
            },
            referencePersonPhone: {
                // SĐT người tham chiếu
                type: String,
                default: null
            },
            referencePersonPosition: {
                // Chức vụ của người tham chiếu
                type: String,
                default: null
            },
            referencePersonAddress: {
                // Địa chỉ của người tham chiếu
                type: String,
                default: null
            },
            referencePersonCompany: {
                // Công ty làm việc của người tham chiếu
                type: String,
                default: null
            },
            video: {
                // Video khi ứng viên đăng ký tài khoản
                type: String,
                default: null
            },
            videoType: {
                // 1: Video tự tải, 2: Video từ youtube, tiktok
                type: Number,
                default: 0
            },
            videoActive: {
                // Video được duyệt hay chưa (0: chưa duyệt, 1: được duyệt)
                type: Number,
                default: 0
            },
            cv: {
                //tên cv dc tải lên 
                type: String,
                default: null
            },
            candiDegree: [{
                type: {
                    id: {
                        type: Number,
                    },
                    degree: {
                        type: String,
                    },
                    school: {
                        type: String,
                    },
                    start: {
                        type: String,
                    },
                    end: {
                        type: String,
                    },
                    major: {
                        type: String,
                    },
                    rate: {
                        type: Number,
                    },
                    implement: {
                        type: String,
                    },
                },
                default: null
            }],
            candiNgoaiNgu: [{
                type: {
                    id: {
                        type: Number
                    },
                    chungChi: {
                        type: String,
                    },
                    point: {
                        type: String,
                    },
                    ngoaiNgu: {
                        type: Number,
                    }
                },
                default: null
            }],
            candiExp: [{
                type: {
                    id: {
                        type: Number
                    },
                    jobTitle: {
                        type: String,
                    },
                    company: {
                        type: String,
                    },
                    start: {
                        type: String,
                    },
                    end: {
                        type: String,
                    },
                    desExp: {
                        type: String
                    }
                },
                default: null
            }],
        },
        default: null
    },
    inForCompany: {
        type: {
            // Thông tin công ty luồng timviec365
            comMd5: {
                type: String,
                default: null
            },
            comViewCount: {
                // Tổng lượt xem
                type: Number,
                default: 0
            },
            idKD: {
                // ID Kinh doanh phụ trách hỗ trợ
                type: Number,
                default: 0
            },
            canonical: {
                // Mã sinh ra url phục vụ seo (canonical)
                type: String,
                default: null
            },
            linkVideo: {
                // Đường dẫn video khi tải lên
                type: String,
                default: 0
            },
            videoType: {
                // 1: Video tự up, 2: Video từ youtube hoặc tiktok
                type: String,
                default: 0
            },
            videoActive: {
                // Duyệt video
                type: Number,
                default: 0
            },
            //kho ảnh
            comImages: [{
                _id: Number,
                name: String,
                size: Number,
            }],
            // kho video
            comVideos: [{
                _id: Number,
                name: String,
                size: Number,
            }],
            website: {
                // Website công ty
                type: String,
                default: null
            },
            mst: {
                // Mã số thuế
                type: String,
                default: null
            },
            ipAddressRegister: {
                // IP của công ty khi đăng ký
                type: String,
                default: null
            },
            userContactName: {
                // Tên người liên hệ
                type: String,
                default: null
            },
            userContactAddress: {
                // Địa chỉ người liên hệ
                type: String,
                default: null
            },
            userContactPhone: {
                // SĐT người liên hệ
                type: String,
                default: null
            },
            userContactEmail: {
                // Email người liên hệ
                type: String,
                default: null
            },
            tagLinhVuc: {
                // Lĩnh vực của công ty
                type: String,
                default: null
            },
            description: {
                // Mô tả công ty
                type: String,
                default: null
            },
            // Thông tin công ty luồng chuyển đổi số
            type_timekeeping: {
                // 1: là khuôn mặt, 2: là QR, 3: là chấm công công ty, 4: là chấm công web, 5: là PC365, 6: là giới hạn IP nhân viên, 7 là giới hạn IP công ty; 8: chấm công trên app chat365; 9: chấm công qr app chat
                type: String,
                default: null
            },
            id_way_timekeeping: {
                // Chưa rõ, cập nhật sau
                type: String,
                default: null
            },
            com_role_id: {
                // Chưa rõ, cập nhật sau
                type: Number,
                default: 0
            },
            com_size: {
                // Quy mô công ty
                type: Number,
                default: 0
            },
            enable_scan_qr: {
                // Cho phép quét mã QR
                type: Number,
                default: 0
            },
            com_vip: {
                // Có phải là công ty vip hay không (1:VIP)
                type: Number,
                default: 0
            },
            com_ep_vip: {
                // Số lượng nhận viên đạt vip
                type: Number,
                default: 0
            }
        },
        default: null
    },
    configChat: {
        notificationAcceptOffer: {
            type: Number,
            default: 1,
        },
        notificationAllocationRecall: {
            type: Number,
            default: 1,
        },
        notificationChangeSalary: {
            type: Number,
            default: 1,
        },
        notificationCommentFromRaoNhanh: {
            type: Number,
            default: 1,
        },
        notificationCommentFromTimViec: {
            type: Number,
            default: 1,
        },
        notificationDecilineOffer: {
            type: Number,
            default: 1,
        },
        notificationMissMessage: {
            type: Number,
            default: 1,
        },
        notificationNTDExpiredPin: {
            type: Number,
            default: 1,
        },
        notificationNTDExpiredRecruit: {
            type: Number,
            default: 1,
        },
        notificationNTDPoint: {
            type: Number,
            default: 1,
        },
        notificationSendCandidate: {
            type: Number,
            default: 1,
        },
        notificationTag: {
            type: Number,
            default: 1,
        },
        HistoryAccess: [{
            IdDevice: {
                type: String,
                default: "",
            },
            IpAddress: {
                type: String,
                default: "",
            },
            NameDevice: {
                type: String,
                default: "",
            },
            Time: {
                type: Date,
                default: new Date(),
            },
            AccessPermision: {
                type: Boolean,
                default: false,
            },
        }],
        removeSugges: {
            type: [Number],
            default: [],
        },
        userNameNoVn: {
            type: String,
            default: ""
        },
        doubleVerify: {
            type: Number,
            default: 0,
        }
    }
}, {
    collection: 'Users',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("Users", UserSchema);