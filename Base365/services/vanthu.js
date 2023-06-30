
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');


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
exports.createLinkFileVanthu = (id, name) => {
    let link = process.env.DOMAIN_VAN_THU + '/base365/vanthu/dexuat' + '/' + id + '/' + name;
    return link;
}

exports.getMaxID = async(model) => {
    const maxUser = await model.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
    return maxUser._id;
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

    const dir = `../Storage/base365/vanthu/uploads/${folder}/${year}${month}${day}/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    filename = `${time_created}-tin-${file_img.originalFilename}`.replace(/,/g, '');
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