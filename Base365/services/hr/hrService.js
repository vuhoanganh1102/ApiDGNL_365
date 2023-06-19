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
const https = require('https');

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
        }}
//thông tin công ty
exports.detailInfoCompany = async(com_id, access_token) => {
    let result = {};
    const headers = {
        'Authorization': access_token
    };
    const url = `https://chamcong.24hpay.vn/api_web_hr/getInfoByCompany.php?id_com=${com_id}`;

    try {
        const response = await axios.get(url, {
            headers: headers,
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Disabling SSL verification
        });

        if (!response.data.data.items.comManager) {
            response.data.data.items.comManager = "Chưa cập nhật"

        }
        if (!response.data.data.items.comDeputy) {
            response.data.data.items.comDeputy = "Chưa cập nhật"
        }
        result = {
            result: true,
            list_nest: response.data.data.items
        };

    } catch (error) {
        result = {
            result: false
        };
    }
    return result;
}

//thông tin phòng ban của công ty
exports.detailInfoDepartment = async(com_id, dep_id, access_token) => {
    let result = {};
    const headers = {
        'Authorization': access_token
    };
    const url = `https://chamcong.24hpay.vn/api_web_hr/getInfoByDepartment.php?id_com=${com_id}&dep_id=${dep_id}`;

    try {
        const response = await axios.get(url, {
            headers: headers,
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Disabling SSL verification
        });
        result = {
            result: true,
            list_nest: response.data.data.items
        };
        if (!response.data.data.items.comManager) {
            response.data.data.items.comManager = "Chưa cập nhật"

        }
        if (!response.data.data.items.comDeputy) {
            response.data.data.items.comDeputy = "Chưa cập nhật"
        }
    } catch (error) {
        result = {
            result: false
        };
    }
    return result;
}

//lấy ra id tổ
exports.showNestByIdDep = async(com_id, dep_id) => {
    let result = {};

    if (com_id == 0 || dep_id == 0) {
        result = {
            result: false
        };
    } else {
        const headers = {
            'Authorization': ''
        };
        const url = `https://chamcong.24hpay.vn/api_web_hr/list_nest_dk.php?id_nest=${dep_id}&cp=${com_id}`;

        try {
            const response = await axios.get(url, {
                headers: headers,
                httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Disabling SSL verification
            });

            result = {
                result: true,
                list_nest: response.data.data.items
            };
        } catch (error) {
            result = {
                result: false
            };
        }
    }

    return result
}

//lấy ra thông tin tổ
exports.detailInfoNest = async(com_id, nest_id, dep_id = 0, access_token) => {
    let result = {};

    const headers = {
        'Authorization': access_token
    };
    let url = `https://chamcong.24hpay.vn/api_web_hr/getInfoByNest.php?id_com=${com_id}&group_id=${nest_id}`;

    if (dep_id != 0) {
        url += `&dep_id=${dep_id}`;
    }

    try {
        const response = await axios.get(url, {
            headers: headers,
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Disabling SSL verification
        });

        result = {
            result: true,
            list_nest: response.data.data.items
        };
    } catch (error) {
        result = {
            result: false
        };
    }

    return result;
}

//lấy ra thông tin công ty con
exports.detailInfoChildCompany = async(com_id, access_token) => {
    let result = {};
    const headers = {
        'Authorization': `Bearer ${access_token}`
    };
    const url = `https://chamcong.24hpay.vn/service/list_child_of_company.php?id_com=${com_id}`;

    try {
        const response = await axios.get(url, {
            headers: headers,
            httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Disabling SSL verification
        });

        result = {
            result: true,
            list_nest: response.data.data.items
        };

    } catch (error) {
        result = {
            result: false
        };
    }
    return result;
}