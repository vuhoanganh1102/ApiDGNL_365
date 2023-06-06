
const fs = require('fs');

exports.uploadFileVanThu = (id, file) => {
    let path = `../Storage/VanThuLuuTru/pictures/${id}/`;
    let filePath = `../Storage/VanThuLuuTru/pictures/${id}/` + file.originalFilename;

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