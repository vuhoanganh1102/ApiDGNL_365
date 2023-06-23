// check ảnh và video
const fs = require('fs');
const PerUser  = require('../../models/hr/PerUsers');
const Users  = require('../../models/Users');

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
// giới hạn dung luong file < 2MB
const MAX_FILE_SIZE = 20* 1024 * 1024;

dotenv.config();
const PermissionUser = require('../../models/hr/PermisionUser');

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

// hàm check định dạng ảnh
let checkFile = async (filePath) => {
    const extname = path.extname(filePath).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.pdf', '.doc', '.docx'].includes(extname);
};

exports.createLinkFile = async(folder, id, name) => {
    let link = process.env.DOMAIN_RAO_NHANH + '/base365/hr/pictures/' + folder + '/' + id + '/' + name;
    return link;
}

exports.uploadFile = async(folder, id, file) => {
    let path1 = `../Storage/base365/hr/pictures/${folder}/${id}/`;
    let filePath = `../Storage/base365/hr/pictures/${folder}/${id}/` + file.name;
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
exports.uploadFileBase64 = async(folder, id, base64String, file)=>{
    let path1 = `../Storage/base365/hr/pictures/${folder}/${id}/`;
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

exports.getMaxId = async(model)=>{
    let maxId = await model.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
    if (maxId) {
        maxId = Number(maxId.id) + 1;
    } else maxId = 1;
    return maxId;
}
exports.titleToSlug = title => {
    let slug;

    // convert to lower case
    slug = title.toLowerCase();

    //
    slug = toLowerCaseNonAccentVietnamese(slug);

    // remove special characters
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    // The /gi modifier is used to do a case insensitive search of all occurrences of a regular expression in a string

    // replace spaces with dash symbols
    slug = slug.replace(/ /gi, "-");
    
    // remove consecutive dash symbols 
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');

    // remove the unwanted dash symbols at the beginning and the end of the slug
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    return slug;
};

let toLowerCaseNonAccentVietnamese = (str) => {
    str = str.toLowerCase();
//     We can also use this instead of from line 11 to line 17
//     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
//     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
//     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
//     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
//     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
//     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
//     str = str.replace(/\u0111/g, "d");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}


// hàm check ảnh
exports.checkFile = async (filePath) => {
    if (typeof (filePath) !== 'string') {
        return false;
    }

    const { size } = await promisify(fs.stat)(filePath);
    if (size > MAX_FILE_SIZE) {
        return false;
    }

    const isFile = await checkFile(filePath);
    if (!isFile) {
        return false;
    }

    return true;
};

exports.checkRoleUser = (req, res, next)=> {
    try{
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Missing token" });
        }
        jwt.verify(token, process.env.NODE_SERCET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            // console.log(user.data);
            var infoLogin = {type: user.data.type, id: user.data._id, name: user.data.userName};
            if(user.data.type!=1){
                infoLogin.comId = user.data.inForPerson.companyID;
            }else {
                infoLogin.comId = user.data._id;
            }
            req.infoLogin = infoLogin;
            next();
            
        });
    }catch(err){
        console.log(err);
        return res.status(503).json({ message: "Error from server!" });
    }
    
}

exports.checkRole = async(infoLogin, barId, perId)=> {
    if(infoLogin.type==1) return true;
    let permission = await PermissionUser.findOne({userId: infoLogin.id, barId: barId, perId: perId});
    console.log(permission);
    if(permission) return true;
    return false;
}

exports.checkIsInteger = (data)=>{
    console.log(data);
    for(let i=0; i<data.length; i++){
        if (isNaN(data[i])) {
        return false;
        }
        var x = parseFloat(data[i]);
        return (x | 0) === x;
    }
    return true;
}

exports.sendChat = async (id_user, status, ep_id, new_com_id, new_update_position, new_update_dep_id, created_at, type) => {
    
    const data = {
    SenderId: id_user,
    Status: status,
    EmployeeId: ep_id,
    ListReceive: '[' + ep_id + ']',
    NewCompanyId: new_com_id,
    Position: new_update_position,
    Department: new_update_dep_id,
    CreateAt: created_at,
    // Type: 'Appoint',
    Type: type,
    CompanyId: new_com_id,
    };

    axios.post('https://mess.timviec365.vn/Notification/NotificationPersonnelChange', data)
    .then(response => {
        // Xử lý phản hồi thành công
        console.log(response.data);
    })
    .catch(error => {
        // Xử lý lỗi
        console.error(error);
    });
}
