const functions = require('../../services/functions');
const Category = require('../../models/Raonhanh365/Category');
const New = require('../../models/Raonhanh365/UserOnSite/New');
const CategoryRaoNhanh365 = require('../../models/Raonhanh365/Category');
const User = require('../../models/Users');
const LoveNews = require('../../models/Raonhanh365/UserOnSite/LoveNews');
const Order = require('../../models/Raonhanh365/Order');
const Bidding = require('../../models/Raonhanh365/Bidding');
const md5 = require('md5');
const raoNhanh = require('../../services/rao nhanh/raoNhanh')
// gửi otp
exports.changePasswordSendOTP = async (req, res, next) => {
    try {
        let id = req.user.data._id
        let otp = await functions.randomNumber;
        let data = {
            UserID: 637990,
            SenderID: 1191,
            MessageType: 'text',
            Message: `[RaoNhanh365 - OTP đổi mật khẩu]
                     Chúng tôi nhận được yêu cầu đổi mật khẩu tài khoản của bạn trên Raonhanh365.vn. Mã OTP của bạn là: ${otp}.`
        }
        await functions.getDataAxios('http://43.239.223.142:9000/api/message/SendMessageIdChat', data)
        await User.findByIdAndUpdate(id, { otp })
        return functions.success(res, 'update thành công')
    } catch (error) {
        return functions.setError(res, error)
    }
}

// kiểm tra OTP
exports.changePasswordCheckOTP = async (req, res, next) => {
    try {
        let otp = req.body.otp;
        let userID = req.user.data._id;
        if (otp) {
            let verify = await User.findOne({ _id: userID, otp});
            if (verify) {
                return functions.success(res, 'Xác thực thành công')
            }else{
                return functions.success(res, 'Mã otp không chính xác',404)
            }
        }else{
            return functions.setError(res, 'Vui lòng nhập otp ', 400)
        }
    } catch (error) {
        return functions.setError(res, error)
    }
}

// hàm đổi mật khẩu 
exports.changePassword = async (req, res, next) => {
    try {
        let userID = req.user.data._id;
        let password = req.body.password;
        let re_password = req.body.re_password;
        if(!password || !re_password){
            return functions.setError(res, 'Missing data', 400)
        }
        if(password.length < 6){
            return functions.setError(res, 'Password quá ngắn', 400)
        }
        if(password !== re_password)
        {
            return functions.setError(res, 'Password nhập lại không trùng khớp', 400)
        }
        await User.findByIdAndUpdate(userID, {password: md5(password)});
        return functions.success(res, 'đổi mật khẩu thành công')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// chỉnh sửa thông tin tài khoản
exports.updateInfoUserRaoNhanh = async (req, res, next) => {
    try {
        let _id = req.user.data._id;
        let { userName } = req.body;
        let email = req.body.email || null;
        let address = req.body.address || null;
        let File = req.files || null;
        let avatarUser = null;
        let updatedAt = new Date();
        if(email){
            if (await functions.checkEmail(email) === false) {
                return functions.setError(res, 'invalid email',400)
            } else {
                let check_email = await User.findById(_id);
                if (check_email.email !== email) {
                    let check_email_lan2 = await User.find({ email });
                    if (check_email_lan2.length !== 0) {
                        return functions.setError(res, "email is exits",400)
                    }
                }
            }
        }
        if (File.avatarUser) {
            let upload = raoNhanh.uploadFileRaoNhanh('avt_dangtin', _id, File.avatarUser, ['.jpeg', '.jpg', '.png']);
            if (!upload) {
                return functions.setError(res, 'Định dạng ảnh không hợp lệ',400)
            }
            avatarUser = functions.createLinkFileRaonhanh('avt_dangtin', _id, File.avatarUser.name)
            await User.findByIdAndUpdate(_id, { email, address, userName, avatarUser, updatedAt });
        }
        await User.findByIdAndUpdate(_id, { email, address, userName, updatedAt });
        return functions.success(res, 'update data user success')
    } catch (error) {
        return functions.setError(res, error)
    }
}
// thông báo kết quả đấu thầu
exports.announceResult = async (req, res, next) => {
    try {
        let { status, id_dauthau } = req.body;
        if (!status || !id_dauthau) {
            return functions.setError(res, 'missing data',400);
        }
        if (await functions.checkNumber(status) === false || await functions.checkNumber(id_dauthau) === false) {
            return functions.setError(res, 'invalid number',400);
        }
        let data = await Bidding.findById(id_dauthau);
        if (!data) {
            return functions.setError(res, 'not exits',400);
        }
        if (data.updatedAt) {
            return functions.setError(res, 'Chỉ được cập nhật 1 lần',400);
        }
        let updatedAt = new Date(Date.now())
        await Bidding.findByIdAndUpdate(id_dauthau, { status, updatedAt })
        return functions.success(res, 'Thông báo thành công')
    } catch (error) {
        return functions.setError(res, error)
    }
}

// danh sách khách hàng online
exports.listUserOnline = async (req,res,next)=>{
    try {
        let link = req.params.link;
        let data = [];
        if(link === 'trang-chu.html')
        {
            data = await User.find({isOnline:1},{userName:1,avatarUser:1}).limit(20);
        }else if(link === 'danh-sach-khach-hang-online.html')
        {
            data = await User.find({isOnline:1},{userName:1,avatarUser:1}); 
        }
        return functions.success(res, 'get data success',{data})    
    } catch (error) {
        return functions.setError(res, error)
    }
}
