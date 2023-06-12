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

exports.uploadFileVanThu = (id, file) => {
    let path = `../Storage/base365/vanthu/dexuat/${id}/`;
    let filePath = `../Storage/base365/vanthu/dexuat/${id}/` + file.originalFilename;

    if (!fs.existsSync(path)) { // Nếu thư mục chưa tồn tại thì tạo mới
        fs.mkdirSync(path, { recursive: true });
    }

    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log(" luu thanh cong ");
            }
        });
    });
}

exports.getMaxID = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
    return maxUser._id;
};
