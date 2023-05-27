const functions = require('../../services/functions')
const AdminUser = require('../../models/Raonhanh365/Admin/AdminUser')

//đăng nhập admin
exports.loginAdminUser = async(req, res, next) => {
    try {
        if (req.body.loginName && req.body.password) {
            const loginName = req.body.loginName
            const password = req.body.password
            let findUser = await functions.getDatafindOne(AdminUser, { loginName })
            if (!findUser) {
                return functions.setError(res, "không tìm thấy tài khoản trong bảng user", 200)
            }
            let checkPassword = await functions.verifyPassword(password, findUser.password)
            if (!checkPassword) {
                return functions.setError(res, "Mật khẩu sai", 200)
            }
            let updateUser = await functions.getDatafindOneAndUpdate(Users, { loginName }, {
                date: new Date(Date.now())
            })
            const token = await functions.createToken(findUser, "2d")
            return functions.success(res, 'Đăng nhập thành công', { token: token })

        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }

}