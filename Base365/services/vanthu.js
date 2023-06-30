
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');
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
    let link = process.env.DOMAIN_VAN_THU + '/base365/vanthu/tailieu' + '/' + id + '/' + name;
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


exports.vanThuUpload = async(folder, id, file, allowedExtensions) => {

    let path1 = `../Storage/base365/vanthu/${folder}/${id}/`;
    let filePath = `../Storage/base365/vanthu/${folder}/${id}/` + file.name;

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