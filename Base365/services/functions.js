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

// tạo token
const jwt = require('jsonwebtoken');
const CV = require('../models/Timviec365/CV/CV');
const Users = require('../models/Users');
const AdminUserRaoNhanh365 = require('../models/Raonhanh365/Admin/AdminUser');

const functions = require('../services/functions')

// giới hạn dung lượng video < 100MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
// danh sách các loại video cho phép
const allowedTypes = ['.mp4', '.mov', '.avi', '.wmv', '.flv'];
// giới hạn dung lượng ảnh < 2MB
const MAX_IMG_SIZE = 2 * 1024 * 1024;
// giới hạn dung lượng kho ảnh
exports.MAX_Kho_Anh = 300 * 1024 * 1024;

dotenv.config();

// check title
const removeAccent = (str) => {
    const accents = "àáâãäåèéêëìíîïòóôõöùúûüýÿđ";
    const accentRegex = new RegExp(`[${accents}]`, "g");
    const accentMap = {
        à: "a",
        á: "a",
        â: "a",
        ã: "a",
        ä: "a",
        å: "a",
        è: "e",
        é: "e",
        ê: "e",
        ë: "e",
        ì: "i",
        í: "i",
        î: "i",
        ï: "i",
        ò: "o",
        ó: "o",
        ô: "o",
        õ: "o",
        ö: "o",
        ù: "u",
        ú: "u",
        û: "u",
        ü: "u",
        ý: "y",
        ÿ: "y",
        đ: "d",
    };
    return str.replace(accentRegex, (match) => accentMap[match]);
};

// check title
exports.checkTilte = async (input, list) => {
    const formattedInput = removeAccent(input).toLowerCase();
    const foundKeyword = list.find((keyword) => {
        const formattedKeyword = removeAccent(keyword).toLowerCase();
        return formattedInput.includes(formattedKeyword);
    });

    if (foundKeyword) {
        return false
    } else {
        return true
    }
};
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
// hàm check title khi update
exports.removeSimilarKeywords = (keyword, arr) => {
    return arr.filter(file => !file.startsWith(keyword));
}

// hàm mã otp ngẫu nhiên có 6 chữ số
exports.randomNumber = Math.floor(Math.random() * 900000) + 100000;
exports.keywordsTilte = ["hot", "tuyển gấp", "cần gấp", "lương cao"];

// hàm validate phone
exports.checkPhoneNumber = async (phone) => {
    const phoneNumberRegex = /^(?:\+84|0|\+1)?([1-9][0-9]{8,9})$/;
    return phoneNumberRegex.test(phone)
}
// hàm validate email
exports.checkEmail = async (email) => {
    const gmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return gmailRegex.test(email);
}
// hàm validate link
exports.checkLink = async (link) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(link);
}
// hàm validate thơi gian
exports.checkTime = async (time) => {
    const currentTime = new Date(); // Lấy thời gian hiện tại
    const inputTime = new Date(time); // Thời gian nhập vào
    if (inputTime < currentTime) {
        return false
    } else {
        return true
    }
}
// hàm check thời gian đăng tin 10p/1 lần
exports.isCurrentTimeGreaterThanInputTime = (timeInput) => {
    const inputTime = Date.parse(timeInput);

    const now = new Date().getTime();

    const diffInMinutes = (now - inputTime) / (1000 * 60);

    if (diffInMinutes >= 10) {
        return true;
    } else {
        return false;
    }
};
exports.getDatafindOne = async (model, condition) => {
    return model.findOne(condition).lean();
};

exports.getDatafind = async (model, condition) => {
    return model.find(condition).lean();
}

exports.getDatafindOneAndUpdate = async (model, condition, projection) => {
    return model.findOneAndUpdate(condition, projection);
};

// hàm khi thành công
exports.success = async (res, messsage = "", data = []) => {
    return res.status(200).json({ data: { result: true, message: messsage, ...data }, error: null, })
};

// hàm thực thi khi thất bại
exports.setError = async (res, message, code = 500) => {
    return res.status(code).json({ code, message })
};

// hàm tìm id max
exports.getMaxID = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
    return maxUser._id;
};

// hàm check định dạng ảnh
const isImage = async (filePath) => {
    const extname = path.extname(filePath).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(extname);
};

// hàm check ảnh
exports.checkImage = async (filePath) => {
    if (typeof (filePath) !== 'string') {
        return false;
    }

    const { size } = await promisify(fs.stat)(filePath);
    if (size > MAX_IMG_SIZE) {
        return false;
    }

    const isImg = await isImage(filePath);
    if (!isImg) {
        return false;
    }

    return true;
};

exports.checkFileCV = async (filePath) => {
    const extname = path.extname(filePath).toLowerCase();
    return ['.pdf', '.doc', '.docx'].includes(extname);
};

// hàm check video
exports.checkVideo = async (filePath) => {
    // kiểm tra loại file
    if (!allowedTypes.includes(path.extname(filePath.originalname).toLowerCase())) {
        return false;
    }
    // kiểm tra kích thước file
    if (filePath.size > MAX_VIDEO_SIZE) {
        return false;
    }
    return true;
};

exports.getDataDeleteOne = async (model, condition) => {
    return model.deleteOne(condition)
};

// storage để updload file
const storageMain = (destination) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            const userId = req.user.data._id; // Lấy id người dùng từ request
            const userDestination = `${destination}/${userId}`; // Tạo đường dẫn đến thư mục của người dùng
            if (!fs.existsSync(userDestination)) { // Nếu thư mục chưa tồn tại thì tạo mới
                fs.mkdirSync(userDestination, { recursive: true });
            }
            cb(null, userDestination);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + uniqueSuffix + '.' + file.originalname.split('.').pop())
        }
    })
};

const storageFile = (destination) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            let userDestination = " "
            if (req.user) {
                const userId = req.user.data._id; // Lấy id người dùng từ request
                userDestination = `${destination}/${userId}`; // Tạo đường dẫn đến thư mục của người dùng
                if (!fs.existsSync(userDestination)) { // Nếu thư mục chưa tồn tại thì tạo mới
                    fs.mkdirSync(userDestination, { recursive: true });
                }
            } else {
                userDestination = destination
            }
            cb(null, userDestination);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
        },
        fileFilter: function (req, file, cb) {
            const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm', 'video/quicktime'];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only .jpeg, .png, .mp4, .webm and .mov format allowed!'));
            }
        }
    });
};

exports.uploadVideoAndIMGNewTV = multer({ storage: storageFile('../Storage/TimViec365') })

exports.uploadVideoAndIMGRegister = multer({ storage: storageFile('../Storage/TimViec365') })

//  hàm upload ảnh ở cập nhập avatar
exports.uploadImg = multer({ storage: storageMain('../Storage/TimViec365') })

//  hàm upload ảnh ở kho ảnh
exports.uploadImgKhoAnh = multer({ storage: storageMain('../Storage/TimViec365') })

//  hàm upload video ở kho ảnh
exports.uploadVideoKhoAnh = multer({ storage: storageMain('../Storage/TimViec365') })

// hàm upload video ở cập nhập KhoAnh
exports.uploadVideo = multer({ storage: storageMain('../Storage/TimViec365') })

//hàm upload file ứng viên
exports.uploadFileUv = multer({ storage: storageFile('../Storage/TimViec365') })



const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log('File was deleted');
    });
};

// hàm xóa file
exports.deleteImg = async (condition) => {
    if (typeof (condition) == "string") {
        return await deleteFile(condition)
    }

    if (typeof (condition) == "object") {
        return await deleteFile(condition.path)
    }

};

// storega check file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/cvUpload')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + uniqueSuffix + `.$ { file.originalname.split('.').slice(-1)[0]
}
`)
    },
});

// hàm check file
exports.uploadFile = multer({ storage: storageFile })

exports.createError = async (code, message) => {
    const err = new Error();
    err.code = code;
    err.message = message;
    return { data: null, error: err };
};

// hàm cấu hình mail
const transport = nodemailer.createTransport({
    host: process.env.NODE_MAILER_HOST,
    port: Number(process.env.NODE_MAILER_PORT),
    service: process.env.NODE_MAILER_SERVICE,
    secure: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
});

// hàm gửi mail
exports.sendEmailVerificationRequest = async (otp, email, nameCompany) => {
    let options = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Tìm việc 365 WEB xác thực email',
        html: `
        <body style="width: 100%;background-color: #dad7d7;text-align: justify;padding: 0;margin: 0;font-family: unset;padding-top: 20px;padding-bottom: 20px;"><table style="width: 600px;background:#fff; margin:0 auto;border-collapse: collapse;color: #000"><tr style="height: 165px;background-image: url(https://timviec365.vn/images/email/bg1.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;padding: 0px 30px;box-sizing: border-box;">
        <td style="padding-top: 23px;float: left;">
        <img src="https://timviec365.vn/images/email/logo2.png"></td>
        <td style="text-align: left;float: right;">
        <ul style="margin-top: 15px;padding-left: 0px;">
        <li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">
        Hiển thị danh sách ứng viên online</span></li>
        <li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Nhắn tin trực tiếp ứng viên qua Chat365</span></li><li style="list-style-type: none;padding-bottom: 5px;height:25px;margin-left: 0px;"><span style="color: #307df1;font-size: 28px;padding-right: 5px;font-weight:bold;">&#8727;</span><span style="font-size:18px;">Cam kết bảo hành 100%</span></li></ul></td></tr><tr style="float: left;padding:10px 30px 30px 30px;"><td colspan="2"><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-top: 15px;">Xin chào <span style="color:#307df1;">${nameCompany}</span></p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Chúc mừng bạn đã hoàn thành thông tin đăng ký tài khoản nhà tuyển dụng tại website Timviec365</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Dưới đây là thông tin tài khoản đã tạo:</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-left: 35px;">- Tài khoản: ${email}</p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;padding-left: 35px;">- Mật khẩu: ****** </p><p style="font-size: 18px;margin: 0;line-height: 25px;margin-bottom: 5px;">Dưới đây là mã OTP của bạn</p><p style="margin: auto;margin-top: 45px;text-align: center;width: 160px;height: 43px;background:#307df1;border-radius: 5px;font-size: 22px;color: #fff">${otp}</a></p></td></tr><tr style="height: 160px;background-image: url(https://timviec365.vn/images/email/bg2.png);background-size:100% 100%;background-repeat: no-repeat;float: left;width: 100%;"><td style="padding-top: 50px;"><ul><li style="list-style-type: none;color: #fff;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;">Liên hệ với chúng tôi để được hỗ trợ nhiều hơn:</span></li><li style="list-style-type: none;color: #fff;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;">Hotline: <span style="color: #ffa111;">1900633682</span> - ấn phím 1</span></li><li style="list-style-type: none;color: #fff;margin-bottom: 5px;"><span style="font-size: 18px;line-height: 18px;color: #ffa111;">Trân trọng !</span></li></ul></td></tr></table></body>
        `
    }
    transport.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    })
};

exports.verifyPassword = async (inputPassword, hashedPassword) => {
    const md5Hash = crypto.createHash('md5').update(inputPassword).digest('hex');
    return md5Hash === hashedPassword;
};

// hàm check token
exports.checkToken = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }
    jwt.verify(token, process.env.NODE_SERCET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
};

// ham check admin rao nhanh 365
exports.isAdminRN365 = async(req, res, next)=>{
    let user = req.user.data;
    let admin = await functions.getDatafindOne(AdminUserRaoNhanh365, { _id: user._id, isAdmin: 1, active: 1 });
    if(admin) return next();
    return res.status(403).json({ message: "is not admin RN365" });
}

// hàm tạo token 
exports.createToken = async (data, time) => {
    return jwt.sign({ data }, process.env.NODE_SERCET, { expiresIn: time });
};

// hàm lấy data từ axios 
exports.getDataAxios = async (url, condition) => {
    return await axios({
        method: "post",
        url: url,
        data: condition,
        headers: { "Content-Type": "multipart/form-data" }
    }).then(async (response) => {
        return response.data
    })
};

// hàm lấy dữ liệu ngành nghề
exports.getDataCareer = async () => {
    return ["An toàn lao động", "Báo chí - Truyền hình", "Bảo hiểm", "Bảo trì", "Bảo vệ", "Biên - Phiên dịch",
        "Bưu chính viễn thông", "Chăm sóc khách hàng", "Chăn nuôi - Thú y", "Cơ khí - Chế tạo", "Công chức - Viên chức", "Công nghệ cao", "Công nghệ thực phẩm", "copywrite",
        "Dầu khí - Địa chất", "Dệt may - Da dày", "Dịch vụ", "Du lịch", "Freelancer", "Giáo dục - Đào tạo", "Giao thông vận tải -Thủy lợi - Cầu đường", "Giúp việc", "Hàng hải", "Hàng không",
        "Hành chính - Văn phòng", "Hóa học - Sinh học", "Hoạch định - Dự án", "In ấn - Xuất bản", "IT phần cứng - mạng", "IT phần mềm", "KD bất động sản", "Kế toán - Kiểm toán", "Khánh sạn - Nhà hàng",
        "Khu chế xuất - Khu công nghiệp", "Kiến trúc - Tk nội thất", "Kỹ thuật", "Kỹ thuật ứng dụng", "Làm đẹp - Thể lực - Spa", "Lao động phổ thông", "Lễ tan - PG - PB", "Logistic", "Luật - Pháp lý", "Lương cao",
        "Marketing - PR", "Môi trường - Xử lý chất thải", "Mỹ phẩm - Thời trang - Trang sức", "Ngân hàng - chứng khoán - Đầu tư", "Nghệ thuật - Điện ảnh", "Nhân sự", "Kinh doanh", "Nhập liệu", "Nông - Lâm - Ngư - Nghiệp",
        "Ô tô - Xe máy", "Pha chế - Bar", "Phát triển thị trường", "Phục vụ - Tạp vụ", "Quan hệ đối ngoại", "Quản lý điều hành", "Quản lý đơn hàng", "Quản trị kinh doanh", "Sản xuất - Vận hành sản xuất",
        "Sinh viên làm thêm", "StarUp", "Tài chính", "Telesales", "Thẩm định - Giảm thẩm định - Quản lý chất lượng", "Thể dục - Thể thao", "Thiết kế - Mỹ thuật", "Thiết kế web", "Thống kê", "Thư ký - Trợ lý",
        "Thu Ngân", "Thư viện", "Thực phẩm - Đồ uống", "Thương Mại điện tử", "Thủy Sản", "Thị trường - Quảng cáo", "Tìm việc làm thêm", "Tổ chức sự kiện", "Trắc địa", "Truyển thông", "Tư vấn", "Vận chuyển giao nhận", "Vận tải - Lái xe", "Vật tư - Thiết bị",
        "Việc làm bán hàng", "Việc làm Tết", "Xây dựng", "Xuất - nhập khẩu", "Xuất khẩu lao động", "Y tế - Dược", "Đầu bếp - phụ bếp", "Điện - Điện tử", "Điện tử viễn thông", "ngàng nghề khác"
    ]
};

// hàm lấy dữ liệu hình thức làm việc
exports.getDataWorkingForm = async () => {
    return ["Toàn thời gian cố định", "Toàn thời gian tạm thời", "Bán thời gian", "Bán thời gian tạm thời", "Hợp đồng", "Việc làm từ xa", "Khác"]
};

// hàm lấy dữ liệu cấp bậc làm việc
exports.getDataWorkingRank = async () => {
    return ["Mới tốt nghiệp", "Thực tập sinh", "Nhân viên", "Trưởng nhóm", "Phó tổ trưởng", "Tổ trưởng", "Phó trưởng phòng", "Trưởng phòng", "Phó giám đốc", "Giám đóc", "Phó tổng giám đốc", "Tổng giám đốc", "Quản lý cấp trung", "Quản lý cấp cao"]
};

// hàm lấy dữ liệu kinh nghiệm làm việc
exports.getDataEXP = async () => {
    return ["Không yêu cầu", "Chưa có kinh nghiệm", "0 - 1 năm kinh nghiệm", "Hơn 1 năm kinh nghiệm", "Hơn 2 năm kinh nghiệm", "Hơn 5 năm kinh nghiệm", "Hơn 10 năm kinh nghiệm"]
};
// hàm lấy dữ liệu bằng cấp làm việc
exports.getDataDegree = async () => {
    return ["Không yêu cầu", "Đại học trở lên", "Cao đẳng trở lên", "THPT trở lên", "Trung học trở lên", "Chứng chỉ", "Trung cấp trở lên", "Cử nhân trở lên", "Thạc sĩ trở lên", "Thạc sĩ Nghệ thuật", "Thạc sĩ Thương mại", "Thạc sĩ Khoa học",
        "Thạc sĩ Kiến trúc", "Thạc sĩ QTKD", "Thạc sĩ Kỹ thuật ứng dụng", "Thạc sĩ Luật", "Thạc sĩ Y học", "Thạc sĩ Dược phẩm", "Tiến sĩ", "Khác"
    ]
};

// hàm lấy dữ liệu giới tính làm việc
exports.getDataSex = async () => {
    return ["Nam", "Nữ", "Không yêu cầu"]
};

exports.pageFind = async (model, condition, sort, skip, limit) => {
    return model.find(condition).sort(sort).skip(skip).limit(limit).lean();
};

exports.pageFindWithFields = async(model, condition, fields, sort, skip, limit) => {
    return model.find(condition, fields).sort(sort).skip(skip).limit(limit);
};

// lấy danh sách mẫu CV sắp xếp mới nhất
exports.getDataCVSortById = async (condition, pageNumber) => {
    const data = await CV.find(condition).select('_id image name alias price status view love download langId designId cateId color')
        .sort({ _id: -1 }).skip((pageNumber - 1) * 20).limit(20);
    if (data.length > 0) {
        return data;
    };
    return null;
};

// lấy danh sách mẫu CV sắp xếp lượt tải nn
exports.getDataCVSortByDownload = async (condition) => {
    const data = await CV.find(condition).select('_id image name alias price status view love download langId designId cateId color')
        .sort({ download: -1 }).skip((pageNumber - 1) * 20).limit(20);
    if (data.length > 0) {
        return data;
    };
    return null;
};

//hàm kiểm tra string có phải number không
exports.checkNumber = async (string) => {
    return !isNaN(string)
}

//hàm phân trang có chọn lọc những trường dc hiển thị
exports.pageFindV2 = async (model, condition, select, sort, skip, limit) => {
    return model.find(condition, select).sort(sort).skip(skip).limit(limit);
}

//hàm check xem có truyền vào token hay không
exports.checkTokenV2 = async (req, res, next) => {
    if (req.headers.authorization) {
        functions.checkToken(req, res, next);
    } else {
        next();
    }
}

// hàm dém count
exports.findCount = async (model, filter) => {
    try {
        const count = await model.countDocuments(filter);
        return count;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
//base64 decrypt image
exports.decrypt = async (req, res, next) => {
    const base64 = req.body.base64;
    req.file = Buffer.from(base64, 'base64').toString('utf-8');
    return next();
};
exports.thresholds = [
    { minValue: 1000000, maxValue: 3000000, money: 2 },
    { minValue: 3000000, maxValue: 5000000, money: 3 },
    { minValue: 5000000, maxValue: 7000000, money: 4 },
    { minValue: 7000000, maxValue: 10000000, money: 5 },
    { minValue: 10000000, maxValue: 15000000, money: 6 },
    { minValue: 15000000, maxValue: 20000000, money: 7 },
    { minValue: 20000000, maxValue: 30000000, money: 8 },
    { minValue: 30000000, maxValue: 50000000, money: 9 },
    { minValue: 50000000, maxValue: 100000000, money: 10 },
    { minValue: 100000000, maxValue: Infinity, money: 11 }
];
//hàm tìm kiếm finduser với idtimviec và type = 0 hoặc 2
exports.findUser = async (userId, select, sort, skip, limit) => {
    return Users.find({
        $or: [{
            idTimViec365: userId,
            type: 0
        },
        {
            idTimViec365: userId,
            type: 2
        },
        ]
    }, { select }).sort(sort).skip(skip).limit(limit)
}

exports.findAll = async(model, fields)=> {
    return model.find({}, fields);
}

//hàm tìm kiếm findOneuser với idtimviec và type = 0 hoặc 2
exports.findOneUser = async (userId, select) => {
    return Users.findOne({
        $or: [{
            idTimViec365: userId,
            type: 0
        },
        {
            idTimViec365: userId,
            type: 2
        },
        ]
    }, select)
}

//hàm tìm kiếm và cập nhật user với id timviec và type =0 hoặc type =2
exports.findOneAndUpdateUser = async (userId, projection, select) => {
    return Users.findOneAndUpdate({
        $or: [{
            idTimViec365: userId,
            type: 0
        },
        {
            idTimViec365: userId,
            type: 2
        },
        ]
    }, projection, select)
};

exports.getUrlLogoCompany = async (createTime, logo) => {
    try {

        if (logo != null) {
            const time = new Date(createTime);
            let d = time.getDate();
            d = d < 10 ? "0" + d : d;
            let m = time.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            const y = time.getFullYear();
            return `http://210.245.108.202:3001/base365/timviec365/pictures/${y}/${m}/${d}/${logo}`;
        } else {
            return logo;
        }
    } catch (error) {
        console.log(error);
    }
}

exports.getTokenUser = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization;
        return jwt.decode(token).data;
    } else {
        return null;
    }
}
// hàm tạo link file rao nhanh 365
exports.createLinkFileRaonhanh = (folder, id, name) => {
    let link = process.env.DOMAIN_RAO_NHANH + '/base365/raonhanh365/pictures/' + folder + '/' + id + '/' + name;
    return link;
}
// hàm kiểm tra đầu vào có phải ngày không 
exports.checkDate = (date) => {
    let data = new Date(date)
    return data instanceof Date && !isNaN(data);
}

exports.uploadFileRaoNhanh = (folder, id, file,allowedExtensions) => {
    let path1 = `../Storage/base365/raonhanh365/pictures/${folder}/${id}/`;
    let filePath = `../Storage/base365/raonhanh365/pictures/${folder}/${id}/` + file.name;
    let fileCheck =  path.extname(filePath);
    console.log(folder)
    if(allowedExtensions.includes(fileCheck.toLocaleLowerCase()) === false)
    {
        return false
    }
    if (!fs.existsSync(path1)) {   
        fs.mkdirSync(path1, { recursive: true });
    }
    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        console.log("check", data);
        fs.writeFile(filePath, data, (err) => {
            if (err) {
            console.log(err)
            }
        });
    });
    return true
}

exports.uploadFileBase64RaoNhanh = async(folder, id, base64String, file)=>{
    let path1 = `../Storage/base365/raonhanh365/pictures/${folder}/${id}/`;
    // let filePath = `../Storage/base365/raonhanh365/pictures/${folder}/${id}/` + file.name;
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
    fs.writeFile(path1+imageName, data, (err) => {
        if (err) {
        console.log(err)
        }
    });
}

exports.deleteFileRaoNhanh = (id, file) => {
    let filePath = `../Storage/base365/raonhanh365/pictures/avt_tindangmua/${id}/` + file;
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });
}

exports.deleteImgRaoNhanh = (folder, id, file) => {
    let filePath = `../Storage/base365/raonhanh365/pictures/${folder}/${id}/` + file;
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });
}
// hàm tìm id max Quản Lí Chung
exports.getMaxIDQLC = async(model) => {
    const maxUser = await model.findOne({}, {}, { sort: { idQLC: -1 } }).lean() || 0;
    return maxUser.idQLC;
};
// hàm tìm idcompany max 
exports.getMaxIDcompany = async(model) => {
    const maxIDcompany = await model.findOne({}, {}, { sort: { companyId: -1 } }).lean() || 0;
    return maxIDcompany.companyId;
};

    //hàm tìm kiếm và cập nhật user với phoneTK và type =0 hoặc type =2
    exports.findOneAndUpdateUserByPhoneTK = async (phoneTK, projection) => {
        return Users.findOneAndUpdate({
            $or: [{
                phoneTK: phoneTK,
                type: 0
            },
            {
                idTimViec365: phoneTK,
                type: 2
            },
            ]
        }, projection)
    };

    //upload image cv,don, thu, syll

    exports.uploadAndCheckPathIMG = async (userId, imageFile, category) => {
        try {
            // upload
            const timestamp = Date.now();
            const imagePath = await fsPromises.readFile(imageFile.path);
            const uploadDir = `../Storage/TimViec365/${userId}/${category}`;
            const uploadFileName = `${timestamp}_${imageFile.originalFilename}`;
            const uploadPath = path.join(uploadDir, uploadFileName);
            await fsPromises.mkdir(uploadDir, { recursive: true });
            await fsPromises.writeFile(uploadPath, imagePath);
            // tìm và chuyển img sang pdf
            await fsPromises.access(uploadPath);
            const pdfPath = path.join(uploadDir, `${uploadFileName.slice(0, -4)}.pdf`);
            const doc = new PDFDocument();
            const stream = fs.createWriteStream(pdfPath);

            doc.pipe(stream);
            doc.image(uploadPath, 0, 0, { fit: [612, 792] });
            doc.end();

            await new Promise((resolve, reject) => {
                stream.on('finish', resolve);
                stream.on('error', reject);
            });

            console.log('Chuyển đổi ảnh thành PDF thành công.');
            return {
                status: 'EXIT',
                nameImage: uploadFileName,
                imgPath: uploadPath,
                pdfPath: pdfPath,
            };


        } catch (error) {
            if (error.code === 'ENOENT') {
                return 'ENOENT'
            } else {
                return error.message
            }
        }
    }

    // hàm  xóa  ảnh và video khi upload thất bại
    exports.deleteImgVideo = async (avatar = undefined, video = undefined) => {
        if (avatar) {
            avatar.forEach(async (element) => {
                await this.deleteImg(element)
            })
        }
        if (video) {
            video.forEach(async (element) => {
                await this.deleteImg(element)
            })
        }
    }

    //thay thế các kí tự đặc biệt trong tiêu đề
    exports.replaceKeywordSearch = async (lower, keyword) => {
        if (lower === 1) {
            keyword = keyword.toLowerCase();
        }
        const arrRep = ["'", '"', "-", "\\+", "=", "\\*", "\\?", "\\/", "!", "~", "#", "@", "%", "$", "\\^", "&", "\\(", "\\)", ";", ":", "\\\\", "\\.", ",", "\\[", "\\]", "{", "}", "‘", "’", '“', '”', '<', '>'];
        keyword = arrRep.reduce((str, rep) => {
            return str.replace(new RegExp(rep, "g"), " ");
        }, keyword);
        keyword = keyword.replace(/ {2,}/g, " ");
        return keyword;
    };

    exports.replaceMQ = async (text) => {
        text = text.replace(/\\'/g, "'");
        text = text.replace(/'/g, "");
        text = text.replace(/\\/g, "");
        text = text.replace(/"/g, "");
        return text;
    }

    //bỏ những từ khóa trong tiêu đề
    exports.removerTinlq = async (string) => {
        var arr_remove = ["lương", "nhân", "trình", "viên", "chuyên", "cao", "tuyển", "dụng", "hấp", "dẫn", "chi", "tiết", "công", "ty", "tnhh", "sx", "tm", "dv", "phòng", "tại", "biết", "về"];
        var result = arr_remove.reduce(function (str, remove) {
            return str.replace(new RegExp(remove, "gi"), "");
        }, string);

        result = result.trim().replace(/\s+/g, " "); // Loại bỏ khoảng trắng dư thừa

        return result;
    }

exports.checkNameCateRaoNhanh = async(data)=>{
    switch (data)
    {
        case 'Đồ điện tử':
            return 'electroniceDevice'
        case 'Xe cộ':
            return 'vehicle'
        case 'Bất động sản':
            return 'realEstate'
        case 'Ship':
            return 'ship'
        case 'Đồ gia dụng':
            return 'houseWare'
        case 'Sức khỏe - Sắc đẹp':
            return 'health'
        case 'Dịch vụ - Giải trí':
            return 'entertainmentService'   
        case 'Việc làm':
            return 'job'
        case 'Thực phẩm, Đồ uống':
            return 'food'
        
    } 
}

// hàm random 
exports.getRandomInt = (min, max)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
//bỏ những từ khóa trong tiêu đề
exports.removerTinlq = async(string) => {
    var arr_remove = ["lương", "nhân", "trình", "viên", "chuyên", "cao", "tuyển", "dụng", "hấp", "dẫn", "chi", "tiết", "công", "ty", "tnhh", "sx", "tm", "dv", "phòng", "tại", "biết", "về"];
    var result = arr_remove.reduce(function(str, remove) {
        return str.replace(new RegExp(remove, "gi"), "");
    }, string);

    result = result.trim().replace(/\s+/g, " "); // Loại bỏ khoảng trắng dư thừa

    return result;
}
