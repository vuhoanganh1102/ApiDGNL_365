
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');


exports.uploadFileVanThu = (id, file) => {
    let path = `../Storage/base365/vanthu/dexuat/${id}/`;
    let filePath = `../Storage/base365/vanthu/dexuat/${id}/` + file.originalFilename;

    if (!fs.existsSync(path)) { // Nếu thư mục chưa tồn tại thì tạo mới
        console.log("chua ton tai")
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
exports.chat = async (name_dx, user_dx, noi_dung, fileKem) => {
    return await axios.post('http://43.239.223.142:9000/api/V2/Notification/NotificationOfferReceive', {
        name_dx: name_dx,
        user_dx: user_dx,
        noi_dung: noi_dung,
        fileKem: fileKem,
    }).then(function (response) {
        console.log("name_dx: " + name_dx + "user_dx :  " + user_dx + " noi_dung: " + noi_dung + " fileKem: " + fileKem);
    })
        .catch(function (error) {
            console.log(error);
        });
}

exports.getMaxID = async (model) => {
    const maxUser = await model.findOne({}, {}, { sort: { _id: -1 } }).lean() || 0;
    return maxUser._id;
};


exports.createLinkFileVanthu = ( id, name) => {
    let link = process.env.DOMAIN_VAN_THU + '/base365/vanthu/dexuat' + '/' + id + '/' + name;
    return link;
}
