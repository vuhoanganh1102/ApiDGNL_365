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
    startvalue:{
        // giá sàn dự kiến
        type: Number,
        default: 0
    },
    endvalue: {
        // Giá sàn kết thúc
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
        type: Number,
        default: 0
    },
    type: {
        // 1 công ty 0 là cá nhân
        type: Number,
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
        default: null
    },
    buySell: {
        // 1 là tin mua 2 là tin bán
        type: Number,
        default: 0
    },
    createTime: {
        // Thời gian tạo
        type: Date,
        default: null
    },
    updateTime: {
        // Thời gian cập nhập
        type: Date,
        default: null
    },
    active: {
        // kích hoạt
        type: Number,
        default: 1
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
        // tên người mua/bán
        type: String,
        default: null
    },
    phone: {
        // số điện thoại người mua/bán
        type: String,
        default: null
    },
    email: {
        // email người mua/bán
        type: String,
        default: null
    },
    
    address: [{
        // địa chỉ người mua/bán
        type: String,
        default: null
    }],
    city: {
        // mã thành phố
        type: Number,
        default: 0
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
        type: String,
        default: 0
    },
    status: {
        // tình trạng
        type: Number,
        default: 0
    },
    warranty: {
        // bảo hành
        type: Number,
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
    timePushNew: {
        // thời gian đẩy tin 
        type: Date,
        default: null
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
        type: String,
        default: null
    },
    timePinning: {
        // thời gian ghim
        type: Date,
        default: null
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
    timeReceivebidding :{
        // thời gian nhận hồ sơ mời thầu
        type: Date,
        default: null
    },
    timeEndReceivebidding :{
        // thời gian kết thúc nhận hồ sơ mời thầu
        type: Date,
        default: null
    },
    timeNotiBiddingStart:{
        // thời gian bắt đầu thông báo kết quả trúng thầu
        type: Date,
        default: null
    },
    timeNotiBiddingEnd:{
        // thời gian bắt đầu thông báo kết quả trúng thầu
        type: Date,
        default: null
    },
    authen: {
        // xac thuc
        type: Number,
        default: 0
    },
    tenderFile: {
        // file thông tin đấu thầu
        type: String,
        default: null,
    },
    fileContentProcedureApply: {
        // Thủ tục nộp hồ sơ mời thầu
        type: String,
        default: null
    },
    contentOnline:{
         // nội dung nộp hồ sơ online
         type: String,
         default: null
    },
    fileContent: {
        // file nộp hồ sơ
        type: String,
        default: null
    },
    instructionContent: {
        // nội dung chỉ dẫn
        type: String,
        default: null
    },
    instructionFile: {
        // file chỉ dẫn
        type: String,
        default: null
    },
    until_tu: {
        // loại tiền từ mức. 1 VND , 2 USD ,3 EURO
        type: String,
        default: 1
    },
    until_den: {
        // loại tiền đến mức. 1 VND , 2 USD ,3 EURO
        type: String,
        default: 1
    },
    until_bidFee: {
        // loại tiền phí dự thầu. 1 VND , 2 USD ,3 EURO
        type: String,
        default: 1
    },
    bidFee: {
        // phí dự thầu
        type: Number,
        default: null
    },
    desFile: {
        // file mô tả
        type: String,
        default: null,
    },
    procedureFile: {
        // file thủ tục
        type: String,
        default: null
    },
    file: {
        // file hồ sơ
        type: String,
        default: null
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
    quantitySold: {
        // số lượng đã bán
        type: Number,
        default: 0
    },
    cityProcedure:{
        // địa chỉ nộp hồ sơ đấu thầu offline
        type: String,
        default: null
    },
    districtProcedure:{
        // địa chỉ nộp hồ sơ đấu thầu offline
        type: String,
        default: null
    },
    wardProcedure:{
        // địa chỉ nộp hồ sơ đấu thầu offline
        type: String,
        default: null
    },
    totalSold: {
        // tổng số lượng
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
    productType: {
        // loại sản phẩm 
        type: Number,
        default: 0
    },
    productGroup: {
        // nhóm sản phẩm
        type: Number,
        default: 0
    },
    poster: {
        // 0 là cá nhân 1 là môi giới 
        type: Number,
        default: 0
    },
    img: [{
        // danh sách ảnh
        _id: Number,
        nameImg: {
            type: String,
            default: null
        },
        size: {
            type: Number,
            default: 0
        }
    }],
    // chi tiết sản phẩm mua/bán
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
    //thuong hieu(dung chung cho cac danh muc health, vehicle, electrionic device, entertament)
    brand: {
        // 
        type: Number,
        default: null
    },
    // han su dung(dung chung health, food)
    expiry: {
         // 
        type: Date,
        default: null
    },

    //cong suat(vehicle, houseWare)
    wattage: {
        type: Number,
        default: 0
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
            type: Number,
            default: 0
        },
        brand: {
            // hãng
            type: Number,
            default: 0
        },
        machineSeries: {
            // dòng máy
            type: Number,
            default: 0
        },
    },
    // xe cộ
    vehicle: {
        brandMaterials: {
            // hãng vật tư
            type: Number,
            default: 0
        },
        vehicles: {
            // dòng xe
            type: Number,
            default: 0
        },
        spareParts: {
            // loại phụ tùng 
            type: Number,
            default: 0
        },
        interior: {
            type: {
                // loại nội thất
                type: Number,
                default: 0
            },
        },
        device: {
            // thiết bị
            type: Number,
            default: 0
        },
        color: {
            // màu xắc
            type: Number,
            default: 0
        },
        capacity: {
            // dung lượng
            type: Number,
            default: 0
        },
        connectInternet: {
            // kết nối internet
            type: String,
            default: null
        },
        generalType: {
            // loại chung
            type: Number,
            default: 0
        },
        resolution: {
            // độ phân giải
            type: Number,
            default: 0
        },
        wattage: {
            // công suất
            type: Number,
            default: 0
        },
        engine: {
            // động cơ
            type: Number,
            default: 0
        },
        accessary: {
            type: Number,
            default: 0
        },
        frameMaterial: {
            // chất liêu khung
            type: Number,
            default: 0
        },
        volume: {
            // dung tích
            type: Number,
            default: 0
        },
        manufacturingYear: {
            // năm sản xuất
            type: String,
            default: null
        },
        fuel: {
            // nhiên liệu
            type: Number,
            default: 0
        },
        numberOfSeats: {
            // số chỗ ngồi 
            type: Number,
            default: 0
        },
        gearBox: {
            // hộp số
            type: Number,
            default: 0
        },
        style: {
            // kiểu dáng
            type: Number,
            default: 0
        },
        payload: {
            // trọng tải
            type: Number,
            default: 0
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
        version: {
            type: Number,
            default: 0
        }
    },
    // bất động sản
    realEstate: {
        statusSell: {
            // cần bán / cho thuê
            type: Number,
            default: 0
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
            type: Number,
            default: 0
        },
        mainDirection: {
            // hướng chính của tòa
            type: Number,
            default: 0
        },
        balconyDirection: {
            // hướng ban công
            type: Number,
            default: 0
        },
        legalDocuments: {
            // giấy tờ pháp lý
            type: String,
            default: null
        },
        statusInterior: {
            // tình trạng nội thất
            type: Number,
            default: 0
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
            type: Number,
            default: 0
        },
        kvDistrict: {
            // khu vực quận huyện
            type: Number,
            default: 0
        },
        kvWard: {
            // khu vực phường xã
            type: Number,
            default: 0
        },
        numberToletRoom: {
            // số phòng wc 
            type: Number,
            default: 0
        },
        numberBedRoom: {
            // số phòng ngủ
            type: Number,
            default: 0
        },
        typeOfApartment: {
            // loại hình căn hộ
            type: Number,
            default: 0
        },
        special: {
            // đặc diểm
            type: String,
            default: null
        },
        statusBDS: {
            // tình trạng bát động sản 
            type: Number,
            default: 0
        },
        codeApartment: {
            // mã căn hộ
            type: Number,
            default: null,
        },
        cornerUnit: {
            // căn góc
            type: Number,
            default: 0
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
        },
        landType: {
            // loại hình đất
            type: Number,
            default: 0
        },
        officeType: {
            // loại hình văn phòng
            type: Number,
            default: 0
        },
        block: {
            // block tháp
            type: String,
            default: null
        },
        htmchrt: {
            // hiển thị mã căn hộ rao tin
            type: Number,
            default: 0
        }
    },
    //ship
    ship: {
        product: {
            // Loại hàng hóa giao
            type: Number,
            default: 0
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
            type: Number,
            default: 0
        },
        vehicloType: {
            // loại xe
            type: Number,
            default: 0
        },
    },
    // dịch vụ giải trí
    entertainmentService: {
        brand: {
            // hãng
            type: Number,
            default: 0
        },

    },
    // môn thể thao
    sports: {
        type: Object,
        default: null,
        sport: {
            // môn thể thao 
            type: Number,
            default: 0
        },
        typeSport: {
            // loại phụ kiện , loại thời trang
            type: Number,
            default: 0
        },
    },

    material: {
        // chất liệu trong danh mục nội thât 
        type: Number,
        default: 0
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
    // đồ gia dụng
    houseWare: {
        typeDevice: {
            // loại thiết bị
            type: Number,
            default: 0
        },
        typeProduct: {
            // loại sản phẩm
            type: Number,
            default: 0
        },
        guarantee: {
            // bảo hành
            type: Number,
            default: 0
        },

    },
    // sức khỏe sắc đẹp
    health: {
        typeProduct: {
            // loại sản phẩm , loại thực phẩm chức năng , loại phụ kiện, loại hình
            type: Number,
            default: 0,
        },
        kindCosmetics: {
            // loại mỹ phẩm
            type: Number,
            default: 0
        },
        expiry: {
            // hạn sử dụng
            type: Date,
            default: null
        },
        brand: {
            // hãng 
            type: Number,
            default: 0
        }
    },
    // tìm việc
    Job: {
        jobType: {
            // ngành nghề
            type: String,
            default: null
        },
        jobDetail: {
            // chi thiet cong việc
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
        salary: {
            // luong
            type: String,
            default: null
        },
        gender: {
            // luong
            type: Number,
            default: 0
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
        degree: {
            // bang cap
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

        benefit: {
            // quyền lợi
            type: String,
            default: null
        },
        cv: {
            type: String,
            default:null
        }
    },
    // đồ ăn đồ uống
    food: {
        typeFood: {
            // loại đồ ăn dồ uống
            type: Number,
            default: 0
        },
        expiry: {
            // hạn sử dụng
            type: Date,
            default: 0
        },

    },
    // thông tin bán hàng
    infoSell: {
        groupType: {
            // nhóm phân loại
            type: String,
            default: null
        },
        classify: {
            type: String,
            default: null
        },
        numberWarehouses: {
            // số lượng kho
            type: String,
            default: null
        },
        promotionType: {
            // loại khuyến mãi
            type: Number,
            default: 0,
        },
        promotionValue: {
            // giá trị khuyến mãi
            type: String,
            default: null
        },
        transport: {
            // vận chuyển
            type: Number,
            default: 0
        },
        transportFee: {
            // phí vận chuyển
            type: String,
            default: null
        },
        productValue: {
            //  giá tiền theo từng sản phẩm 
            type: String,
            default: null,
        },
        untilMoney: {
            // đơn vị tiền theo từng loại sản phẩm
            type: String,
            default: null
        },
        untilTranpost: {
            // đơn vị tiền vận chuyển
            type: Number,
            default: 0
        }
    },

}, {
    collection: 'NewRN',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("NewRN", newSchema);