
const fs = require('fs');
const multer = require('multer');


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