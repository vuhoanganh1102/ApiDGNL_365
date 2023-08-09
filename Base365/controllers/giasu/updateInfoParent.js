const fnc = require("../../services/GiaSu/functions")
const functions = require("../../services/functions")
const Users = require("../../models/Users")

exports.updateInfoParent = async(req, res, next) => {
    try {
        let idGiaSu = req.user.data.idGiaSu;
        let data = [];
        const { userName, emailContact, address, phone, birthday, gender,  ugs_about_us,ugs_city,ugs_county } = req.body;
        let File = req.files || null;
        let avatarUser = null;
            let findUser = await Users.findOne({ idGiaSu: idGiaSu, "inforGiaSu.ugs_ft": 1 })
            if (findUser) {
                if (File && File.avatarUser) {
                    let upload = await fnc.uploadAvaPH( File.avatarUser, ['.jpeg', '.jpg', '.png']);
                    if (!upload) {
                        return functions.setError(res, 'Định dạng ảnh không hợp lệ')
                    }
                    avatarUser = upload
                }
                data = await Users.updateOne({ idGiaSu: idGiaSu, "inforGiaSu.ugs_ft": 1}, {
                    $set: {
                        userName: userName,
                        emailContact: emailContact,
                        phone: phone,
                        avatarUser: avatarUser,
                        address: address,
                        updatedAt: functions.getTimeNow(),
                        "inForPerson.account.birthday": birthday?Date.parse(birthday) / 1000:undefined,
                        "inForPerson.account.gender": gender,
                        "inforGiaSu.ugs_about_us": ugs_about_us,
                        "inforGiaSu.ugs_city": ugs_city,
                        "inforGiaSu.ugs_county": ugs_county,
                    }
                })
                return functions.success(res, 'cập nhật thành công')
            } else {
                return functions.setError(res, "không tìm thấy Phụ huynh")
            }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}