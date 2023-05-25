const mongoose = require('mongoose');
const newSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    userID: {
        // id người đăng
        type: Number,
        required: true
    },
    title: {
        // tiêu đề
        type: String,
        default: null
    },
    linkTitle: {
        // link tiêu đề
        type: String,
        default: 0
    },
    money: {
        // giá tiền đăng
        type: Number,
        default: 0,
    },
    endvalue: {
        // Giá kết thúc
        type: Number,
        default: 0
    },
    downPayment: {
        // tiền đặt cọc
        type: Number,
        default: 0
    },
    until: {
        // loại tiền
        type: Number,
        default: 1
    },
    cateID: {
        // danh mục của bài đăng
        type: String,
        default: 0
    },
    type: {
        // 1 công ty 0 là cá nhân
        type: Number,
        default: 0
    },
    city: {
        // mã thành phố
        type: String,
        default: 0
    },
    image: {
        // ảnh bài viết
        type: String,
        default: null
    },

    video: {
        // video của bài viết
        type: String,
        default: 0
    },
    buySell: {
        // 
        type: Number,
        default: 0
    },
    createTime: {
        // Thời gian tạo
        type: Date,
        default: 0
    },
    updateTime: {
        // Thời gian cập nhập
        type: Date,
        default: 0
    },
    active: {
        // kích hoạt
        type: Number,
        default: 0
    },
    detailCategory: {
        // chi tiết danh mục
        type: Number,
        default: 0
    },
    viewCount: {
        // số view
        type: Number,
        default: 0
    },
    name: {
        // tên người mua
        type: Number,
        default: null
    },
    phone: {
        // số điện thoại người mua
        type: Number,
        default: null
    },
    email: {
        // email người mua
        type: Number,
        default: null
    },
    address: {
        // địa chỉ người mua
        type: Number,
        default: 0
    },
    addressNext: {
        // địa chỉ thêm
        type: Number,
        default: null
    },
    district: {
        // quận huyện
        type: Number,
        default: 0
    },
    ward: {
        // phường xã
        type: Number,
        default: 0
    },
    apartmentNumber: {
        // số nhà
        type: Number,
        default: 0
    },
    status: {
        // tình trạng
        type: Number,
        default: 0
    },
    warranty: {
        // bảo hành
        type: String,
        default: 0
    },
    free: {
        // cho tặng miễn phí
        type: Number,
        default: 0
    },
    sold: {
        // đã bán
        type: Number,
        default: 0
    },
    timeSell: {
        // thời gian bán
        type: Date,
        default: null
    },
    pinHome: {
        // Ghim tin trên trang chủ 
        type: Number,
        default: 0
    },
    pinCate: {
        // ghim tin trên Trang ngày
        type: Number,
        default: 0
    },
    pushNew: {
        // thời gian đẩy tin 
        type: String,
        default: 0
    },
    timeStartPinning: {
        // thời gian bắt đầu ghim
        type: Date,
        default: null
    },
    dayStartPinning: {
        // ngày bắt đầu ghim
        type: Date,
        default: null
    },
    dayEndPinning: {
        // ngày kết thúc ghim
        type: Date,
        default: null
    },
    numberDayPinning: {
        // số ngày ghim
        type: Number,
        default: 0
    },
    moneyPinning: {
        // tiền ghim
        type: Number,
        default: 0
    },
    countRefresh: {
        // số lần làm mới trong ngày
        type: Number,
        default: 0
    },
    authen: {
        // 
        type: Number,
        default: 0
    },
    pinCount: {
        // số lượng tin ghim
        type: Number,
        default: 0
    },
    refreshTime: {
        // thời gian làm mới
        type: Number,
        default: null
    },
    timeHome: {
        // thời gian ghim trên trang chủ
        type: Number,
        default: null
    },
    timeCate: {
        // thời gian ghim tren trang ngày
        type: Number,
        default: null
    },
    bidExpirationTime: {
        // thời gian hết hạn thầu
        type: Date,
        default: null
    },
    quantitySold: {
        // số lượng đã bán
        type: Number,
        default: 0
    },
    quantityMin: {
        // sô lượng nhỏ nhất
        type: Number,
        default: 0
    },
    quantityMax: {
        // sô lượng lớn nhất
        type: Number,
        default: 0
    },
    timePromotionStart: {
        // thời gian khuyến mãi bắt đầu
        type: Date,
        default: null
    },
    timePromotionEnd: {
        // thời gian khuyến mãi kết thúc
        type: Date,
        default: null
    },
    newDetail: {
        description: {
            // mô tả
            type: String,
            default: null
        },
        hashtag: {
            // 
            type: String,
            default: null
        },
        // đô điện tử
        electroniceDevice: {
            microprocessor: {
                // bộ vi xử lý
                type: Number,
                default: 0
            },
            ram: {
                // ram 
                type: Number,
                default: 0
            },
            hardDrive: {
                // ở cứng
                type: Number,
                default: 0
            },
            typeHarđrive: {
                // loại ổ cứng
                type: Number,
                default: 0
            },
            screen: {
                // màn hình
                type: Number,
                default: 0
            },
            size: {
                // kích cỡ
                type: String,
                default: null
            },
            brand: {
                // hãng
                type: String,
                default: null
            },
            machineSeries: {
                // dòng xe
                type: String,
                default: null
            },
        },
        // xe cộ
        vehicle: {
            brandMaterials: {
                // hãng vật tư
                type: String,
                default: null
            },
            vehicles: {
                // dòng xe
                type: String,
                default: null
            },
            accessary: {
                // loại phụ tùng 
                type: String,
                default: null
            },
            interior: {
                // loại nội thất
                type: String,
                default: null
            },
            device: {
                // thiết bị
                type: String,
                default: null
            },
            color: {
                // màu xắc
                type: String,
                default: null
            },
            capacity: {
                // dung lượng
                type: String,
                default: null
            },
            connectInternet: {
                // kết nối internet
                type: String,
                default: null
            },
            generalType: {
                // loại chung
                type: String,
                default: null
            },
            resolution: {
                // độ phân giải
                type: String,
                default: null
            },
            wattage: {
                // công suất
                type: String,
                default: null
            },
            frameMaterial: {
                // chất liêu khung
                type: String,
                default: null
            },
            volume: {
                // dung tích
                type: String,
                default: null
            },
            manufacturingYear: {
                // năm sản xuất
                type: String,
                default: null
            },
            fuel: {
                // nhiên liệu
                type: String,
                default: null
            },
            numberOfSeats: {
                // số chỗ ngồi 
                type: String,
                default: null
            },
            gearBox: {
                // hộp số
                type: String,
                default: null
            },
            style: {
                // kiểu dáng
                type: String,
                default: null
            },
            payload: {
                // trọng tải
                type: String,
                default: null
            },
            carNumber: {
                // biern số xe
                type: String,
                default: null,
            },
            km: {
                // số km đã đi 
                type: String,
                default: null
            },
            origin: {
                // xuất xứ
                type: String,
                default: null
            },
        },
        // bất động sản
        realEstate: {
            statusSell: {
                // cần bán / cho thuê
                type: String,
                default: null
            },
            nameApartment: {
                // tên tòa nhà
                type: String,
                default: null
            },
            numberOfStoreys: {
                // tổng số tầng
                type: String,
                default: null
            },
            storey: {
                // số tầng
                type: String,
                default: null
            },
            mainDirection: {
                // hướng chính của tòa
                type: String,
                default: null
            },
            balconyDirection: {
                // hướng ban công
                type: String,
                default: null
            },
            legalDocuments: {
                // giấy tờ pháp lý
                type: String,
                default: null
            },
            statusInterior: {
                // tình trạng nội thất
                type: String,
                default: null
            },
            acreage: {
                // diện tích 
                type: String,
                default: null
            },
            length: {
                // chiều dài
                type: String,
                default: null
            },
            width: {
                // chiều rộng 
                type: String,
                default: null
            },
            buyingArea: {
                // khu vực mua
                type: String,
                default: null
            },
            kvCity: {
                // khu vực thành phố
                type: String,
                default: null
            },
            kvDistrict: {
                // khu vực quận huyện
                type: String,
                default: null
            },
            kvWard: {
                // khu vực phường xã
                type: String,
                default: null
            },
            numberToletRoom: {
                // số phòng wc 
                type: String,
                default: null
            },
            numberBedRoom: {
                // số phòng ngủ
                type: String,
                default: null
            },
            typeOfApartment: {
                // loại hình căn hộ
                type: String,
                default: null
            },
            special: {
                // đặc diểm
                type: String,
                default: null
            },
            statusBDS: {
                // tình trạng bát động sản 
                type: String,
                default: null
            },
            codeApartment: {
                // mã căn hộ
                type: Number,
                default: null,
            },
            cornerUnit: {
                // căn góc
                type: String,
                default: null
            },
            nameArea: {
                // tên phân khu
                type: String,
                default: null
            },
            useArea: {
                // diện tích sử dụng
                type: String,
                default: null
            }
        },
        //ship
        ship: {
            product: {
                // Loại hàng hóa giao
                type: String,
                default: null
            },
            timeStart: {
                // thời gian bắt đâu
                type: Date,
                default: null
            },
            timeEnd: {
                // thời gian kết thúc
                type: Date,
                default: null
            },
            allDay: {
                // Cả ngày
                type: String,
                default: null
            },
            vehicloType: {
                // loại xe
                type: String,
                default: null
            },
        },

        entertainmentService: {
            // dịch vụ giải trí
            brand: {
                type: Number,
                default: 0
            },

        },
        merchandiseType: {
            // loại hàng hóa
            type: String,
            default: null
        },
        sports: {
            // môn thể thao 
            type: String,
            default: null
        },
        Material: {
            // chất liệu
            type: String,
            default: null
        },
        shape: {
            // hinhfd dáng
            type: String,
            default: null
        },
        volumeUnit: {
            // đươn vị dung tích
            type: String,
            default: null
        },
        productTypeInterior: {
            // loại sản phẩm nội ngoại thất
            type: String,
            default: null
        },
        deadlineStarts: {
            // thời hạn bắt đầu
            type: String,
            default: null
        },
        expiry: {
            // hạn sử dụng
            type: String,
            default: null
        },
        // thú cưng
        pet: {
            kindOfPet: {
                // loại thú cưng
                type: String,
                default: null
            },
            age: {
                // độ tuổi
                type: String,
                default: null
            },
            gender: {
                // giới tính
                type: String,
                default: null
            },
            weigth: {
                // khối lượng
                type: String,
                default: null
            },
        },
        volume: {
            // thể tích
            type: String,
            default: null
        },
        sim: {
            // sử dụng sim nào
            type: String,
            default: null
        },
        accessary: {
            // phụ kiện,linh kiện
            type: String,
            default: null
        },
        // tìm việc
        Job: {
            jobType: {
                // ngành nghề
                type: String,
                default: null
            },
            jobKind: {
                // hình thức làm việc
                type: String,
                default: null
            },
            minAge: {
                // tuổi nhỏ nhất
                type: String,
                default: null
            },
            maxAge: {
                // tuổi lớn nhất
                type: String,
                default: null
            },
            exp: {
                // kinh nghiệm
                type: String,
                default: null
            },
            level: {
                // chứng chỉ
                type: String,
                default: null
            },
            skill: {
                // kỹ năng 
                type: String,
                default: null
            },
            quantity: {
                // số lượng tuyển
                type: String,
                default: null
            },
            city: {
                // thành phố
                type: String,
                default: null
            },
            district: {
                // quận huyện
                type: String,
                default: null
            },
            ward: {
                // phường xã
                type: String,
                default: null
            },
            addressNumber: {
                // số nhà
                type: String,
                default: null
            },
            payBy: {
                // hình thức trả lương
                type: String,
                default: null
            },
            logo: {
                // ảnh công ty
                type: String,
                default: null
            },
            benefit: {
                // quyền lợi
                type: String,
                default: null
            },
            logo: {
                // ảnh công ty
                type: String,
                default: null
            }

        },
        infoSell: {
            groupType: {
                // nhóm phân loại
                type: String,
                default: null
            },
            classify: {
                type: String,
                default: null
            }
        }
    }
}, {
    collection: 'NewRN',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("NewRN", newSchema);