// check ảnh và video
const fs = require('fs');

// upload file
const multer = require('multer')

// gửi mail
const nodemailer = require("nodemailer");
// tạo biến môi trường
const dotenv = require("dotenv");
// mã hóa mật khẩu
const crypto = require('crypto');
// gọi api
const axios = require('axios')

// check video
const path = require('path');
//check ảnh
const { promisify } = require('util');

const jwt = require('jsonwebtoken');
// giới hạn dung lượng video < 100MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
// danh sách các loại video cho phép
const allowedTypes = ['.mp4', '.mov', '.avi', '.wmv', '.flv'];
// giới hạn dung lượng ảnh < 2MB
const MAX_IMG_SIZE = 10 * 1024 * 1024;
// giới hạn dung lượng kho ảnh
exports.MAX_Kho_Anh = 300 * 1024 * 1024;

const functions = require('../functions');

// import model
const AdminUserRaoNhanh365 = require('../../models/Raonhanh365/Admin/AdminUser');
const AdminUserRight = require('../../models/Raonhanh365/Admin/AdminUserRight');
const Category = require('../../models/Raonhanh365/Category');
const CateDetail = require('../../models/Raonhanh365/CateDetail')
dotenv.config();

// hàm tạo link title
exports.createLinkTilte = (input) => {
    input = input.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    str = input.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.toLowerCase();
    str = str.replaceAll(' ', '-')
    return str
}
exports.deleteFileRaoNhanh = (id, file) => {
    let filePath = `../storage/base365/raonhanh365/pictures/avt_tindangmua/${id}/` + file;
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });
}
exports.checkNameCateRaoNhanh = async (data) => {
    switch (data) {
        case 'Đồ điện tử':
            return 'electroniceDevice'
        case 'Xe cộ':
            return 'vehicle'
        case 'Bất động sản':
            return 'realEstate'
        case 'Ship':
            return 'ship'
        case 'Thú cưng':
            return 'pet'
        case 'Việc làm':
            return 'job'
        case 'Thực phẩm, Đồ uống':
            return 'food'
        case 'Đồ gia dụng':
            return 'wareHouse'
        case 'Sức khỏe - Sắc đẹp':
            return 'beautifull'
        case 'Thể thao':
            return 'Thể thao'
        case 'Du lịch':
            return 'Du lịch'
        case 'Đồ dùng văn phòng, công nông nghiệp':
            return 'Đồ dùng văn phòng, công nông nghiệp'
    }
}

// // hàm tạo link file rao nhanh 365
// exports.createLinkFileRaonhanh = (folder, id, name) => {
//     let link = process.env.DOMAIN_RAO_NHANH + '/base365/raonhanh365/pictures/' + folder + '/' + id + '/' + name;
//     return link;
// }


exports.uploadFileRaoNhanh = async (folder, id, file, allowedExtensions) => {

    let path1 = `../storage/base365/raonhanh365/pictures/${folder}/${id}/`;
    let filePath = `../storage/base365/raonhanh365/pictures/${folder}/${id}/` + file.name;

    let fileCheck = path.extname(filePath);
    if (allowedExtensions.includes(fileCheck.toLocaleLowerCase()) === false) {
        return false
    }
    // const { size } = await promisify(fs.stat)(filePath);
    // if (size > MAX_IMG_SIZE) {
    //     return false;
    // }

    if (!fs.existsSync(path1)) {
        fs.mkdirSync(path1, { recursive: true });
    }
    fs.readFile(file.path, (err, data) => {
        if (err) {
            return false
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                return false
            }
        });
    });
    return file.name
}

exports.uploadFileRN2 = (folder, id, file) => {
    let path1 = `../storage/base365/raonhanh365/pictures/${folder}/${id}/`;
    let filePath = `../storage/base365/raonhanh365/pictures/${folder}/${id}/` + file.name;
    let fileCheck = path.extname(filePath);
    if (!fs.existsSync(path1)) {
        fs.mkdirSync(path1, { recursive: true });
    }
    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.log(err)
            }
        });
    });
    return true
}
exports.uploadFileBase64RaoNhanh = async (folder, id, base64String, file) => {
    let path1 = `../storage/base365/raonhanh365/pictures/${folder}/${id}/`;
    // let filePath = `../storage/base365/raonhanh365/pictures/${folder}/${id}/` + file.name;
    if (!fs.existsSync(path1)) {
        fs.mkdirSync(path1, { recursive: true });
    }
    var matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches.length !== 3) {
        return false;
    }

    let type = matches[1];
    let data = Buffer.from(matches[2], 'base64');

    const imageName = `${Date.now()}.${type.split("/")[1]}`;
    fs.writeFile(path1 + imageName, data, (err) => {
        if (err) {
            console.log(err)
        }
    });
}

// ham check admin rao nhanh 365
exports.isAdminRN365 = async (req, res, next) => {
    let user = req.user.data;

    let admin = await functions.getDatafindOne(AdminUserRaoNhanh365, { _id: user._id, active: 1 });
    if (admin && admin.active == 1) {
        req.infoAdmin = admin;
        return next();
    }
    return res.status(403).json({ message: "is not admin RN365 or not active" });
}

exports.checkRight = (moduleId, perId) => {
    return async (req, res, next) => {
        try {
            if (!moduleId || !perId) {
                return res.status(505).json({ message: "Missing input moduleId or perId" });
            }
            let infoAdmin = req.infoAdmin;
            if (infoAdmin.isAdmin) return next();
            let permission = await AdminUserRight.findOne({ adminId: infoAdmin._id, moduleId: moduleId }, { add: 1, edit: 1, delete: 1 });
            // console.log(permission);
            if (!permission) {
                return res.status(404).json({ message: "no role" });
            }
            if (perId == 2 && permission.add == 1) return next();
            if (perId == 3 && permission.edit == 1) return next();
            if (perId == 4 && permission.delete == 1) return next();
            return next();
        } catch (e) {
            return res.status(505).json({ message: e });
        }

    };
};

exports.checkTokenUser = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        return jwt.decode(token).data.idRaoNhanh365
    } else {
        return null;
    }
}
exports.checkFolderCateRaoNhanh = async (data) => {
    switch (data) {
        case 'Đồ điện tử':
            return 'do_dien_tu'
        case 'Xe cộ':
            return 'dangtin_xeco'
        case 'Dịch vụ - Giải trí':
            return 'dichvu_giaitri'
        case 'Bất động sản':
            return 'dangtin_bds'
        case 'Thời trang':
            return 'thoi_trang'
        case 'ship':
            return 'dangtin_ship'
        case 'Sức khỏe - Sắc đẹp':
            return 'dangtin_suckhoesacdep'
        // thiếu mẹ và bé, Đồ gia dụng,Thủ công - Mỹ nghệ - Quà tặng,Tìm ứng viên
        case 'Nội thất - Ngoại thất':
            return 'noi_ngoai_that'
        case 'Khuyến mại - Giảm giá':
            return 'khuyen_mai'
        case 'Thể thao':
            return 'dtin_thethao'
        case 'Du lịch':
            return 'du_lich'
        case 'Đồ dùng văn phòng, công nông nghiệp':
            return 'dangtin_dodung'
        case 'Thực phẩm, Đồ uống':
            return 'thuc_pham'
        case 'Thú cưng':
            return 'dangtin_thucung'
        case 'Việc làm':
            return 'timviec'
        case 'Thực phẩm, Đồ uống':
            return 'thuc_pham'
    }
}
// lấy tên danh mục
exports.getNameCate = async (cateId, number) => {
    let danh_muc1 = null;
    let danh_muc2 = null;
    cate1 = await Category.findById(cateId).lean();
    if (cate1)
        danh_muc1 = cate1.name;
    if (cate1.parentId !== 0) {
        cate2 = await Category.findById(cate1.parentId).lean();
        danh_muc2 = cate2.name;
    }
    let name = {};
    name.danh_muc1 = danh_muc1
    name.danh_muc2 = danh_muc2
    if (number === 2) {
        return name
    } else if (danh_muc2) {
        return danh_muc2
    } else if (danh_muc1) {
        return danh_muc1
    }
}
// lấy link file
exports.getLinkFile = async (userID, file, cateId, buySell) => {
    let nameCate = await exports.getNameCate(cateId, 1);
    let folder = await exports.checkFolderCateRaoNhanh(nameCate)
    let link = process.env.DOMAIN_RAO_NHANH + `/base365/raonhanh365/pictures/${folder}/${userID}/`;
    if (buySell == 1) link = process.env.DOMAIN_RAO_NHANH + `/base365/raonhanh365/pictures/avt_tindangmua/${userID}/`;
    let res = '';
    let arr = [];
    for (let i = 0; i < file.length; i++) {
        res = link + file[i].nameImg;
        arr.push({ nameImg: res })
    }
    return arr;
}

// lấy avatar user
exports.getLinkAvatarUser = async (id, name) => {
    let link = process.env.DOMAIN_RAO_NHANH + `/base365/raonhanh365/pictures/avt_dangtin/${id}/` + name;
    return link;
}

// hàm chứa item serch của chi tiết tin
exports.searchItem = async (type) => {
    if (type === 1) {
        return searchitem = {
            _id: 1,
            title: 1,
            money: 1,
            endvalue: 1,
            city: 1,
            userID: 1,
            img: 1,
            cateID: 1,
            updateTime: 1,
            type: 1,
            active: 1,
            until: 1,
            address: 1,
            ward: 1,
            detailCategory: 1,
            district: 1,
            viewCount: 1,
            apartmentNumber: 1,
            com_city: 1,
            com_district: 1,
            com_ward: 1,
            com_address_num: 1,
            bidding: 1,
            tgian_kt: 1,
            tgian_bd: 1,
            buySell: 1,
            video: 1,
            brand: 1,
            kich_co: 1,
            user: { _id: 1, idRaoNhanh365: 1, phone: 1, isOnline: 1, avatarUser: 1, 'inforRN365.xacThucLienket': 1, createdAt: 1, userName: 1, type: 1, chat365_secret: 1, email: 1, lastActivedAt: 1, time_login: 1 },
        };
    } else if (type === 2) {
        return searchitem = {
            _id: 1,
            title: 1,
            linkTitle: 1,
            free: 1,
            address: 1,
            money: 1,
            createTime: 1,
            cateID: 1,
            pinHome: 1,
            pinCate: 1,
            new_day_tin: 1,
            buySell: 1,
            email: 1,
            tgian_kt: 1,
            tgian_bd: 1,
            phone: 1,
            userID: 1,
            img: 1,
            updateTime: 1,
            user: { _id: 1, idRaoNhanh365: 1, isOnline: 1, phone: 1, avatarUser: 1, userName: 1, type: 1, chat365_secret: 1, email: 1, 'inforRN365.xacThucLienket': 1, 'inforRN365.store_name': 1, lastActivedAt: 1, time_login: 1 },
            district: 1,
            ward: 1,
            description: 1,
            city: 1,
            islove: '1',
            until: 1,
            endvalue: 1,
            type: 1,
            detailCategory: 1,
            infoSell: 1,
            timePromotionStart: 1,
            timePromotionEnd: 1,
            quantitySold: 1,
            infoSell: 1,
            viewCount: 1,
            poster: 1,
            sold: 1,
            com_city: 1,
            video: 1,
            district: 1,
            ward: 1,
            com_address_num: 1,
            buySell: 1,
            totalSold: 1,
            quantityMin: 1,
            quantityMax: 1,
            productGroup: 1,
            productType: 1
        }
    }
}

// lấy tin tương tự cho chi tiết tin
exports.tinTuongTu = async (res, New, check, id_new, userId, LoveNews) => {
    try {
        let tintuongtu = await New.aggregate([
            { $match: { cateID: check.cateID, active: 1, sold: 0, _id: { $ne: id_new } } },
            { $limit: 6 },
            {
                $lookup: {
                    from: 'Users',
                    foreignField: 'idRaoNhanh365',
                    localField: 'userID',
                    as: 'user'
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    linkTitle: 1,
                    free: 1,
                    address: 1,
                    money: 1,
                    createTime: 1,
                    cateID: 1,
                    pinHome: 1,
                    userID: 1,
                    img: 1,
                    updateTime: 1,
                    user: { _id: 1, avatarUser: 1, phone: 1, userName: 1, type: 1, chat365_secret: 1, 'inforRN365.xacThucLienket': 1, email: 1, 'inforRN365.store_name': 1, lastActivedAt: 1, time_login: 1 },
                    district: 1,
                    ward: 1,
                    city: 1,
                    dia_chi: 1,
                    islove: 1,
                    until: 1,
                    endvalue: 1,
                    active: 1,
                    type: 1,
                    sold: 1,
                    createTime: 1,
                    free: 1,
                    buySell: 1
                }
            }
        ]);
        if (tintuongtu.length !== 0) {
            for (let i = 0; i < tintuongtu.length; i++) {
                if (tintuongtu[i].user && tintuongtu[i].user.avatarUser) {
                    tintuongtu[i].user.avatarUser = await exports.getLinkAvatarUser(tintuongtu[i].user.idRaoNhanh365, tintuongtu[i].user.avatarUser);
                }
                if (tintuongtu[i].img) {
                    tintuongtu[i].img = await exports.getLinkFile(tintuongtu[i].img, tintuongtu[i].cateID, tintuongtu[i].buySell);
                    tintuongtu[i].soluonganh = tintuongtu[i].img.length;
                }
                tintuongtu[i].buySell == 1 ? tintuongtu[i].link = `https://raonhanh.vn/${tintuongtu[i].linkTitle}-ct${tintuongtu[i]._id}.html` : tintuongtu[i].link = `https://raonhanh.vn/${tintuongtu[i].linkTitle}-c${tintuongtu[i]._id}.html`
                if (userId) {
                    let dataLoveNew = await LoveNews.findOne({ id_user: userId, id_new: tintuongtu[i]._id });
                    if (dataLoveNew) tintuongtu[i].islove = 1;
                    else tintuongtu[i].islove = 0;
                } else {
                    tintuongtu[i].islove = 0;
                }
            }
        }
        return tintuongtu
    } catch (error) {
        return functions.setError(res, error)
    }
}

// lấy like comment cho chi tiết tin
exports.getComment = async (res, Comments, LikeRN, url, sort, cm_start, cm_limit) => {
    try {
        let ListComment = [];
        if (sort == 1) {
            ListComment = await Comments.find({ url, parent_id: 0 }).sort({ _id: -1 }).skip(cm_start).limit(cm_limit).lean();
        } else {
            ListComment = await Comments.find({ url, parent_id: 0 }).sort({ _id: 1 }).skip(cm_start).limit(cm_limit).lean();
        }
        let ListReplyComment = [];
        let ListLikeComment = [];
        let ListLikeCommentChild = [];
        if (ListComment.length !== 0) {
            for (let i = 0; i < ListComment.length; i++) {
                ListLikeComment = await LikeRN.find({ forUrlNew: url, type: { $lt: 8 }, commentId: ListComment[i]._id }, {}, { type: 1 })
                ListReplyComment = await Comments.find({ url, parent_id: ListComment[i]._id }, {}, { time: -1 }).lean();
                // lấy lượt like của từng trả lời
                if (ListReplyComment && ListReplyComment.length > 0) {
                    for (let j = 0; j < ListReplyComment.length; j++) {
                        ListLikeCommentChild = await LikeRN.find({ forUrlNew: url, type: { $lt: 8 }, commentId: ListReplyComment[j]._id }, {}, { type: 1 })
                        ListReplyComment[j].ListLikeCommentChild = ListLikeCommentChild
                        ListReplyComment[i].img = process.env.DOMAIN_RAO_NHANH + '/' + ListReplyComment[i].img
                    }
                }
                ListComment[i].ListLikeComment = ListLikeComment
                ListComment[i].ListReplyComment = ListReplyComment
                if (ListComment[i].img) {
                    ListComment[i].img = process.env.DOMAIN_RAO_NHANH + '/' + ListComment[i].img
                }
            }
        }
        return ListComment
    } catch (error) {
        return functions.setError(res, error)
    }
}

// lấy thông tin đấu thầu nếu là tin mua
exports.getDataBidding = async (res, Bidding, id_new, Evaluate) => {
    try {
        let dataBidding = await Bidding.aggregate([
            { $match: { newId: id_new } },
            {
                $lookup: {
                    from: "Users",
                    localField: 'userID',
                    foreignField: 'idRaoNhanh365',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    user: { _id: 1, idRaoNhanh365: 1, phone: 1, avatarUser: 1, 'inforRN365.xacThucLienket': 1, createdAt: 1, userName: 1, type: 1, chat365_secret: 1, email: 1 },
                    _id: 1,
                    userName: 1,
                    userIntro: 1,
                    userFile: 1,
                    userProfile: 1,
                    userProfileFile: 1,
                    productName: 1,
                    productDesc: 1,
                    productLink: 1,
                    price: 1,
                    priceUnit: 1,
                    promotion: 1,
                    promotionFile: 1,
                    status: 1,
                    createTime: 1,
                    note: 1,
                    updatedAt: 1,
                }
            }
        ])
        if (dataBidding.length !== 0) {
            for (let i = 0; i < dataBidding.length; i++) {
                if (dataBidding[i].user && dataBidding[i].user.avatarUser) {
                    dataBidding[i].user.avatarUser = await exports.getLinkAvatarUser(dataBidding[i].user.idRaoNhanh365, dataBidding[i].user.avatarUser);
                }
                if (dataBidding[i].userFile) {
                    dataBidding[i].userFile = process.env.DOMAIN_RAO_NHANH + '/base365/raonhanh365/pictures/avt_tindangmua/' + dataBidding[i].userFile;
                }
                if (dataBidding[i].userProfileFile) {
                    dataBidding[i].userProfileFile = process.env.DOMAIN_RAO_NHANH + '/base365/raonhanh365/pictures/avt_tindangmua/' + dataBidding[i].userProfileFile;
                }
                if (dataBidding[i].promotionFile) {
                    dataBidding[i].promotionFile = process.env.DOMAIN_RAO_NHANH + '/base365/raonhanh365/pictures/avt_tindangmua/' + dataBidding[i].promotionFile;
                }
                dataBidding[i].user.thongTinSao = await exports.getInfoEnvaluate(res, Evaluate, dataBidding[i].user.idRaoNhanh365)
            }
        }
        return dataBidding
    } catch (error) {
        return functions.setError(res, error)
    }
}

// lấy thông tin sao của user
exports.getInfoEnvaluate = async (res, Evaluate, userID) => {
    try {
        let cousao = await Evaluate.find({ blUser: 0, userId: userID }).count();
        let sumsao = await Evaluate.aggregate([
            { $match: { blUser: 0, userId: userID } },
            {
                $group:
                {
                    _id: null,
                    count: { $sum: "$stars" }
                }
            }
        ]);
        let thongTinSao = {};
        if (sumsao && sumsao.length !== 0) {
            thongTinSao.cousao = cousao;
            thongTinSao.sumsao = sumsao[0].count;
        }
        return thongTinSao;
    } catch (error) {
        return functions.setError(res, error)
    }
}

// hàm xửl lý tên mặt hàng cho danh mục
exports.getDataNewDetail = async (objectarr, cate) => {
    let array = Object.entries(objectarr).map(([key, value]) => [key, value]);

    let check = await CateDetail.findOne({ _id: cate }).lean();

    let data ='';
    for (let i = 0; i < array.length; i++) {
        let name = await exports.switchCase(array[i][0])
        if (name)
            var chartAt = name.split('.')[0];
        let filter1 = check[`${chartAt}`]
        data = await filter1.find(item => item._id === array[i][1])
        console.log("🚀 ~ file: service.js:593 ~ exports.getDataNewDetail= ~ filter1:", filter1)
        objectarr[`${array[i][0]}`] =  data.name
    }
    return objectarr
}

// hàm lấy tên mặt hàng cho danh mục
exports.cateDetail = async (cateID, item, id) => {



}

exports.switchCase = (item) => {
    switch (item) {
        case 'microprocessor':
            return 'processor'
        case 'ram':
            return 'capacity'
        case 'hardDrive':
            return 'capacity'
        case 'typeHardrive':
            return 'capacity'
        case 'screen':
            return 'screen'
        case 'size':
            return 'screen'
        case 'machineSeries':
            return 'brand.line'
        case 'device':
            return 'allType'
        case 'loai_xe':
            return 'allType'
        case 'capacity':
            return 'capacity'
        case 'chat_lieu_khung':
            return 'productMaterial'
        case 'dong_xe':
            return 'brand.line'
        case 'vehicleType':
            return 'allType'
        case 'loai_thiet_bi':
            return 'allType'
        case 'cong_suat':
            return 'capacity'
        case 'dung_tich':
            return 'capacity'
        case 'kindOfPet':
            return 'petPurebred'
        case 'age':
            return 'petInfo'
    }
}

// copy folder image
exports.copyFolder = async (imgOld, folderNew) => {
    let fileOld = imgOld.replace(`${process.env.DOMAIN_RAO_NHANH}`, '')
    let folderOld = fileOld.split('/').reverse()[2]
    let id = fileOld.split('/').reverse()[1]
    let fileNew = fileOld.replace(`${folderOld}`, folderNew)
    let path = `../storage/base365/raonhanh365/pictures/${folderNew}/${id}`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    fs.copyFile(`../storage/${fileOld}`, `../storage/${fileNew}`, (err) => {
        if (err) {
            console.error(err)
            return false
        }
    });
    return true
}

// send chat
exports.sendChat = async (id_nguoigui, id_nguoinhan, noidung) => {
    await axios({
        method: "post",
        url: "http://43.239.223.142:9000/api/V2/Notification/SendNewNotification_v2",
        data: {
            'UserId': id_nguoinhan,
            'SenderId': id_nguoigui,
            'Message': noidung,
            'Type': 'text',
            'Title': "",
            'Link': '',
        },
        headers: { 'Content-Type': 'application/json' }
    });
    return true
}

