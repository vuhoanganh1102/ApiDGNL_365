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
        if (user.data.inForCompany) {
            if (user.data.inForCompany.companyID !== 0) {
                req.comId = user.data.inForCompany.companyID;
                next();
            } else {
                return res.status(403).json({ message: "bạn không có quyền truy cập tính năng này" });
            }
        } else {
            return res.status(403).json({ message: "bạn không có quyền truy cập tính năng này" });
        }

    });
}

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