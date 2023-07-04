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
const Users = require('../../models/Users');

// giới hạn dung lượng video < 100MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
// danh sách các loại video cho phép
const allowedTypes = ['.mp4', '.mov', '.avi', '.wmv', '.flv'];
// giới hạn dung lượng ảnh < 2MB
const MAX_IMG_SIZE = 2 * 1024 * 1024;
// giới hạn dung lượng kho ảnh
exports.MAX_Kho_Anh = 300 * 1024 * 1024;

//gioi han file
const MAX_FILE_SIZE = 20 * 1024 * 1024;

dotenv.config();


//QLC
exports.uploadFileQLC = async(folder, id, file, allowedExtensions) => {

    let path1 = `../Storage/base365/QLC/pictures/${folder}/${id}/`;
    let filePath = `../Storage/base365/QLC/pictures/${folder}/${id}/` + file.name;
    let fileCheck = path.extname(filePath);
    if (allowedExtensions.includes(fileCheck.toLocaleLowerCase()) === false) {
        return false
    }

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

// hàm tạo link file QLC
exports.createLinkFileQLC = (folder, id, name) => {
    let link = process.env.PORT_QLC + '/base365/QLC/pictures/' + folder + '/' + id + '/' + name;
    return link;
}

exports.deleteFileQLC = (id, file) => {
        let filePath = `../Storage/base365/QLC/pictures/${id}/` + file;
        fs.unlink(filePath, (err) => {
            if (err) console.log(err);
        });
    }

// hàm validate phone
exports.checkPhoneNumber = async(phone) => {
    const phoneNumberRegex = /^(?:\+84|0|\+1)?([1-9][0-9]{8,9})$/;
    return phoneNumberRegex.test(phone)
}
// hàm validate email
exports.checkEmail = async(email) => {
    const gmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return gmailRegex.test(email);
}
// hàm validate link
exports.checkLink = async(link) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(link);
}
// hàm validate thơi gian
exports.checkTime = async(time) => {
    const currentTime = new Date(); // Lấy thời gian hiện tại
    const inputTime = new Date(time); // Thời gian nhập vào
    if (inputTime < currentTime) {
        return false
    } else {
        return true
    }
}
// hàm tìm id max
exports.getMaxID = async(model) => {
    const maxUser = await model.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
    return maxUser._id;
};
// hàm tạo token 
exports.createToken = async(data, time) => {
    return jwt.sign({ data }, process.env.NODE_SERCET, { expiresIn: time });
};
exports.setError = async(res, message, code = 500) => {
    return res.status(code).json({ code, message })
};
// hàm khi thành công
exports.success = async(res, messsage = "", data = []) => {
    return res.status(200).json({ data: { result: true, message: messsage, ...data }, error: null, })
};
exports.verifyPassword = async(inputPassword, hashedPassword) => {
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
exports.getDatafindOne = async(model, condition) => {
    return model.findOne(condition).lean();
};

exports.getDatafind = async(model, condition) => {
    return model.find(condition).lean();
}

exports.getDatafindOneAndUpdate = async(model, condition, projection) => {
    return model.findOneAndUpdate(condition, projection);
};
exports.getMaxUserID = async(type = "user") => {
    let condition = {};
    if (type == "user") {
        condition = { type: { $ne: 1 } };
    } else {
        condition = { type: 1 }
    }

    // ID Chat
    const maxID = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
    if (maxID) {
        _id = Number(maxID._id) + 1;
    } else _id = 1;

    // ID timviec365
    const maxIDTimviec = await Users.findOne(condition, { idTimViec365: 1 }).sort({ idTimViec365: -1 }).lean();
    if (maxIDTimviec) {
        _idTV365 = Number(maxIDTimviec.idTimViec365) + 1;
    } else _idTV365 = 1;

    // ID chuyển đổi số
    const maxIdQLC = await Users.findOne(condition, { idQLC: 1 }).sort({ idQLC: -1 }).lean();
    if (maxIdQLC) {
        _idQLC = Number(maxIdQLC.idQLC) + 1;
    } else _idQLC = 1;

    // ID raonhanh365
    const maxIdRN365 = await Users.findOne(condition, { idRaoNhanh365: 1 }).sort({ idRaoNhanh365: -1 }).lean();
    if (maxIdRN365) {
        _idRN365 = Number(maxIdRN365.idRaoNhanh365) + 1;
    } else _idRN365 = 1;

    return { _id, _idTV365, _idQLC, _idRN365 }
}

const hostImage = () => {
    return "https://cdn.timviec365.vn";
}