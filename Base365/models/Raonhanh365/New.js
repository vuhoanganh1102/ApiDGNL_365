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
        // tình trạng  0 đã tìm ứng viên, 1 tìm ứng viên
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
    
   
    authen: {
        // xac thuc
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
    quantitySold: {
        // số lượng đã bán
        type: Number,
        default: 0
    },
    until:{
        type: Number,
        default: 0
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
    com_city:{
        type:Number,
        default: 0
    },
    com_district:{
        type:Number,
        default: 0
    },
    com_ward:{
        type:Number,
        default: 0
    },
    com_address_num:{
        type:Number,
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
    ashtag: {
        // 
        type: String,
        default: null
    },
    //thuong hieu(dung chung cho cac danh muc health, vehicle, electrionic device, entertament)
    brand: {
        type: Number,
        default: null
    },
    // han su dung(dung chung health, food)
    expiry: {
        type: Date,
        default: null
    },

    //cong suat(vehicle, houseWare)
    wattage: {
        type: Number,
        default: 0
    },
    order: {
        type: Number
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
        typeHardrive: {
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
        warranty: {
            // bảo hành
            type: Number,
            default: 0
        },
        device: {
            type: Number,
            default: 0
        },
        capacity: {
            type: Number,
            default: 0
        },
        sdung_sim: {
            type: Number,
            default: 0
        },
        phien_ban: {
            type: Number,
            default: 0
        }
    },
    // xe cộ
    vehicle: {
        hang: {
            type: Number,
            default: 0
        },
        loai_xe: {
            type: Number,
            default: 0
        },
        xuat_xu: {
            type: Number,
            default: 0
        },
        mau_sac: {
            type: Number,
            default: 0
        },
        kich_co: {
            type: Number,
            default: 0
        },
        chat_lieu_khung: {
            type: Number,
            default: 0
        },
        baohanh: {
            type: Number,
            default: 0
        },
        hang: {
            type: Number,
            default: 0
        },
        dong_xe: {
            type: Number,
            default: 0
        },
        nam_san_xuat: {
            type: Number,
            default: 0
        },
        dung_tich: {
            type: Number,
            default: 0
        },
        td_bien_soxe: {
            type: Number,
            default: 0
        },
        phien_ban: {
            type: Number,
            default: 0
        },
        hop_so: {
            type: Number,
            default: 0
        },
        nhien_lieu: {
            type: Number,
            default: 0
        },
        kieu_dang: {
            type: Number,
            default: 0
        },
        so_cho: {
            type: Number,
            default: 0
        },
        trong_tai: {
            type: Number,
            default: 0
        },
        loai_linhphu_kien: {
            type: Number,
            default: 0
        },
        so_km_da_di:{
            type: Number,
            default: 0
        }

    },
    // bất động sản
    realEstate: {
        ten_toa_nha: {
            type: String
        },
        td_macanho: {
            type: Number
        },
        ten_phan_khu: {
            type: String
        },
        td_htmch_rt: {
            // Hiển thị mã căn hộ rao tin
            type: Number,
            default: 0
        },
        so_pngu: {
            type: Number,
            default: 0
        },
        so_pve_sinh: {
            type: Number,
            default: 0
        },
        tong_so_tang: {
            type: Number,
            default: 0
        },
        huong_chinh: {
            type: Number,
            default: 0
        },
        giay_to_phap_ly: {
            type: Number,
            default: 0
        },
        tinh_trang_noi_that: {
            type: Number,
            default: 0
        },
        dac_diem: {
            type: Number,
            default: 0
        },
        dien_tich: {
            type: Number,
            default: 0
        },
        dientichsd: {
            type: Number,
            default: 0
        },
        chieu_dai: {
            type: Number,
            default: 0
        },
        chieu_rong: {
            type: Number,
            default: 0
        },
        tinh_trang_bds: {
            type: Number,
            default: 0
        },
        td_block_thap: {
            type: String,
            default: null
        },
        tang_so: {
            type: Number,
            default: 0
        },
        loai_hinh_canho: {
            type: Number,
            default: 0
        },
        loaihinh_vp: {
            type: Number,
            default: 0
        },
        loai_hinh_dat: {
            type: Number,
            default: 0
        },
        kv_thanhpho: {
            type: Number,
            default: 0
        },
        kv_quanhuyen: {
            type: Number,
            default: 0
        },
        kv_phuongxa: {
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
    // sức khoẻ - sắc đẹp
    beautifull: {
        loai_hinh_sp: {
            type: Number,
            default: 0
        },
        loai_sanpham: {
            type: Number,
            default: 0
        },
        han_su_dung: {
            type: Number,
            default: 0
        },
        hang_vattu: {
            type: Number,
            default: 0
        }
    },
    // đồ gia dụng
    wareHouse: {
        loai_thiet_bi: {
            type: Number,
            default: 0
        },
        hang: {
            type: Number,
            default: 0
        },
        cong_suat: {
            type: Number,
            default: 0
        },
        dung_tich: {
            type: Number,
            default: 0
        },
        khoiluong: {
            type: Number,
            default: 0
        },
        loai_chung: {
            type: Number,
            default: 0
        },
        loai_sanpham: {
            type: Number,
            default: 0
        },
        
        
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

            default: null
        }
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
            type: Number,
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
    bidding:{
        tgian_hethan_thau:{
            type:Date
        },
        han_bat_dau:{
            type:Date
        },
        han_su_dung:{
            type:Date
        }
        ,
        tgian_bd:{
            type:Date
        }
        ,
        tgian_kt:{
            type:Date
        },
        new_job_kind:{
            type:Number
        },
        new_file_dthau:{
            type:String
        },
        noidung_nhs:{
            type:String
        },
        new_file_nophs:{
            type:String
        },
        noidung_chidan:{
            type:String
        },
        new_file_chidan:{
            type:String
        },
        donvi_thau:{
            type:String
        },
        phi_duthau:{
            type:String
        },
        file_mota:{
            type:String
        },
        file_thutuc:{
            type:String
        },
        file_hoso:{
            type:String
        }


    }

}, {
    collection: 'RN365_News',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("RN365_News", newSchema);