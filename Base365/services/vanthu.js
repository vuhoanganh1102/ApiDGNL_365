
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const dotenv = require("dotenv");
dotenv.config();
const path = require('path');

exports.uploadFileVanThu = (id, file) => {
    let path = `../Storage/base365/vanthu/tailieu/${id}/`;
    let filePath = `../Storage/base365/vanthu/tailieu/${id}/` + file.originalFilename;

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
exports.createLinkFileVanthu = (id, name) => {
    let link = process.env.DOMAIN_VAN_THU + '/base365/vanthu/dexuat' + '/' + id + '/' + name;
    return link;
}

exports.getMaxID = async(model) => {
    const maxUser = await model.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
    return maxUser._id + 1;
};

// const storageVanthu = (destination) => {
//     return storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//             // console.log(file_kem)
//             cb(null, destination);
//         },
//         filename: (req, file, cb) => {
//             cb(null, Date.now() + path.extname(file));
//         }
//     })

// };
// exports.upload = multer({ storage: storageVanthu('../../../Storage/VanThu') });
exports.chat = async (id_user, id_user_duyet, com_id, name_dx, id_user_theo_doi, status, link, file_kem) => {
    return await axios.post('http://43.239.223.142:9000/api/V2/Notification/NotificationOfferReceive', {
        SenderID: id_user,
        ListReceive: id_user_duyet,
        CompanyId: com_id,
        Message: name_dx,
        ListFollower: id_user_theo_doi,
        Status: status,
        Link: status,
        file_kem: file_kem,
        // SenderID :nguoi gui , ListReceive: nguoi duyet , CompanyId, Message: ten de_xuat,ListFollower: nguoi thoe doi,Status,Link
    }).then(function (response) {
        //  console.log("name_dx: " + name_dx + "user_dx :  " + user_dx + " noi_dung: " + noi_dung + " fileKem: " + fileKem);
    })
        .catch(function (error) {
            console.log(error);
        });

}

exports.uploadFileNameRandom = async(folder, file_img) => {
    let filename='';
    const time_created = Date.now();
    const date = new Date(time_created);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const timestamp = Math.round(date.getTime()/1000);

    const dir = `../Storage/base365/vanthu/uploads/${folder}/${year}/${month}/${day}/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    filename = `${timestamp}-tin-${file_img.originalFilename}`.replace(/,/g, '');
    const filePath = dir + filename;
    filename = filename + ',';
    // if (NameFile === '') {
    //     NameFile += `'${file_img.name.replace(/,/g, '')}'`;
    //     InfoFile += `'https://vanthu.timviec365.vn/uploads/file_van_ban/${year}/${month}/${day}/${filename}'`;
    // } else {
    //     NameFile += `,'${file_img.name.replace(/,/g, '')}'`;
    //     InfoFile += `,'https://vanthu.timviec365.vn/uploads/file_van_ban/${year}/${month}/${day}/${filename}'`;
    // }

    fs.readFile(file_img.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.log(err)
            }
        });
    });
    return filename;
}

exports.getLinkFile = (folder, time, fileName) => {
    let date = new Date(time*1000);
    const y = date.getFullYear();
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);
    let link = process.env.DOMAIN_VAN_THU + `/base365/vanthu/uploads/${folder}/${y}/${m}/${d}/`;
    let res = '';
    
    let arrFile = fileName.split(',').slice(0, -1);
    for(let i=0; i<arrFile.length; i++) {
        if(res == '') res = `${link}${arrFile[i]}`
        else  res = `${res}, ${link}${arrFile[i]}`
    }
    return res;
}

exports.getMaxId = async(model) => {
    let maxId = await model.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
    if (maxId) {
        maxId = Number(maxId._id) + 1;
    } else maxId = 1;
    return maxId;
}

exports.sendChat = async (link, data) => {
    return await axios
    .post(link, data)
    .then(response => {
        console.log(response.data);
        // Xử lý phản hồi từ server
    })
    .catch(error => {
        console.error(error);
        // Xử lý lỗi
    });
}

exports.checkToken = (req, res, next)=> {
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
            if(!user.data || !user.data.type || !user.data.idQLC || !user.data.userName) {
                return res.status(404).json({ message: "Token missing info!" });
            }
            var infoLogin = {type: user.data.type, role: user.data.role, id: user.data.idQLC, name: user.data.userName};
            if(user.data.type!=1){
                if(user.data.inForPerson && user.data.inForPerson.employee && user.data.inForPerson.employee.com_id){
                    infoLogin.comId = user.data.inForPerson.employee.com_id;
                }else {
                    return res.status(405).json({ message: "Missing info inForPerson!" });
                }
            }else {
                infoLogin.comId = user.data.idQLC;
            }
            req.id = infoLogin.id;
            req.comId = infoLogin.comId;
            req.userName = infoLogin.name;
            req.type = infoLogin.type;
            req.role = infoLogin.role;
            req.infoLogin = infoLogin;
            next();
            
        });
    }catch(err){
        console.log(err);
        return res.status(503).json({ message: "Error from server!" });
    }
    
}

exports.arrAPI = ()=>{
    return {
        'NotificationOfferReceive': "http://43.239.223.142:9000/api/V2/Notification/NotificationOfferReceive",
        'NotificationOfferSent': "http://43.239.223.142:9000/api/V2/Notification/NotificationOfferSent",
        "NotificationReport": "http://43.239.223.142:9000/api/V2/Notification/NotificationReport",
        "SendContractFile": "http://43.239.223.142:9000/api/V2/Notification/SendContractFile"
    }
} 

exports.replaceTitle = (title) => {
  // Hàm replaceTitle() là hàm tùy chỉnh của bạn để thay thế các ký tự không hợp lệ trong tiêu đề
  // Hãy thay thế nó bằng cách xử lý phù hợp với yêu cầu của bạn
    return title.replace(/[^a-zA-Z0-9]/g, '-');
};

exports.uploadfile = async(folder, file_img,time) => {
    let filename='';
    const date = new Date(time);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const timestamp = Math.round(date.getTime()/1000);

    const dir = `../Storage/base365/vanthu/uploads/${folder}/${year}/${month}/${day}/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    filename = `${timestamp}-${file_img.originalFilename}`.replace(/,/g, '');
    const filePath = dir + filename;
    filename = filename + ',';
    fs.readFile(file_img.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.log(err)
            }
        });
    });
    console.log(filename)
    return filename;
}
exports.deleteFile = (file) => {
    let namefile = file.replace(`${process.env.DOMAIN_VAN_THU}/base365/vanthu/uploads/`,'');
    let filePath = '../Storage/base365/vanthu/uploads/' + namefile;
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });
}

exports.convertTimestamp = (date) => {
    let time = new Date(date);
    return Math.round(time.getTime()/1000);
}

exports.convertDate = (timestamp) => {
    return new Date(timestamp*1000);
}