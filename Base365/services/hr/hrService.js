// check ảnh và video
const fs = require('fs');
const PerUser  = require('../../models/hr/PerUsers');

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

const functions = require('../functions')

// giới hạn dung lượng video < 100MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
// danh sách các loại video cho phép
const allowedTypes = ['.mp4', '.mov', '.avi', '.wmv', '.flv'];
// giới hạn dung lượng ảnh < 2MB
const MAX_IMG_SIZE = 2 * 1024 * 1024;
// giới hạn dung lượng kho ảnh
exports.MAX_Kho_Anh = 300 * 1024 * 1024;

dotenv.config();

exports.HR_CheckTokenCompany = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }
    jwt.verify(token, process.env.NODE_SERCET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        if (user.data.role !== 0) {
            if (user.data.inForCompany.companyID) {
                req.comId = user.data.inForCompany.companyID;
                next();
            } else {
                return res.status(403).json({ message: "không tìm thấy id company" });
            }
        } else {
            return res.status(403).json({ message: "bạn không có quyền truy cập tính năng này" });
        }

    });
}

exports.HR_UploadFile = async (folder, id, file,allowedExtensions) => {

    let path1 = `../Storage/hr/${folder}/${id}/`;
    let filePath = `../Storage/hr/${folder}/${id}/` + file.name;

    let fileCheck =  path.extname(filePath);
    if(allowedExtensions.includes(fileCheck.toLocaleLowerCase()) === false)
    {
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

exports.createLinkFileHR = (folder, id, name) => {
    let link = process.env.DOMAIN_RAO_NHANH + '/hr/' + folder + '/' + id + '/' + name;
    return link;
}
exports.deleteFileHR = (folder,id, file) => {
    let filePath = '../Storage/hr/'+ folder + '/'+ id +'/'+ file;
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });
}

exports.checkPermissions = async (req, res, next,per,bar)=>{
      //1. Quản lý tuyển dụng, 2. Quản lý thông tin nhân sự, 3. Thành tích - Vi phạm,5. Báo cáo nhân sự, 6. Dữ liệu đã xóa gần đây, 7. Tăng/giảm lương
      if(per === 'read'){
        per = 1
      }else if(per === 'create')
      {
        per = 2
      }else if(per === 'update')
      {
        per = 3
      }else if(per === 'delete')
      {
        per = 4
      }
      if(bar === 'QLTD')
      {
        bar = 1;
      }else if(bar === 'QLTTNS')
      {
        bar = 2;
      }else if(bar === 'TTVP')
      {
        bar = 3;
      }else if(bar === 'BCNS')
      {
        bar = 5;
      }else if(bar === 'DLXGD')
      {
        bar = 6;
      }
      if(req.user.data.type === 0)
        {
            return functions.setError(res,'Unauthorized',401)
        }
      if(req.user.data.type === 2)
        {
            let check  = await PerUser.findOne({userId:req.user.data.idQLC,perId:per,barId:bar})
            if(!check)
            {
                return functions.setError(res,'Unauthorized',401)
            }
        }
}