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

const functions = require('../../services/functions');

exports.uploadAvaPH = async(file, allowedExtensions, createdAt = null) => {
    // const namefiles = req.files.name
    let date = new Date();
    if (createdAt) {
        date = new Date(createdAt*1000);
    }
    var filename = file.name;
    var arr_filename = filename.split('.');
    var new_filename = 'PH' +  Math.round(date.getTime() / 1000) + '.' + arr_filename[arr_filename.length - 1];
    // let namefile = 'PH' + Math.round(date.getTime() / 1000) + "_" + file.name;
    let path1 = `../storage/base365/giasu/upload/ph/${functions.convertDate(date.getTime()/1000, true)}/`;
    let filePath = `../storage/base365/giasu/upload/ph/${functions.convertDate(date.getTime()/1000, true)}/` + new_filename;
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
    return new_filename
}