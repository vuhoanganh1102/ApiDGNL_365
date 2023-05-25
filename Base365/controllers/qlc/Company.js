const Users = require('../../models/Users');
const functions = require('../../services/functions');
const md5 = require('md5');

//Đăng kí tài khoản công ty 
exports.createAccCom = async (req,res)=>{
    const { userName, email , phoneTK, password, companyId,  } = req.body;

        if ((userName && password && companyId && email && phoneTK) !== undefined) {

                //  check email co trong trong database hay khong
                let user = await functions.getDatafindOne(Users, { email: email , type : 1})
                if (user == null) {
                        const user = await new Users({
                            _id: newMaxID,
                            email:req.body.email,
                            phoneTK:req.body.phoneTK,
                            userName: req.body.userName,
                            phone: req.body.phone,
                            type: 1,
                            password: md5(password),
                            address: req.body.address,
                            otp: req.body.otp,
                            fromWeb: "quanlichung.timviec365",
                            role: 1,
                            idQLC: req.body.idQLC,
                    })
                    await user.save().then(() => {
                        console.log("Thêm mới thành công ID Công ty: " + email + "," + phoneTK);
                    }).catch((e) => {
                        console.log(e);
                    });
                } else {
                    await functions.setError(res, 'email đã tồn tại', 404);
                }    
            
        }else {
            await functions.setError(res,'Một trong số các trường yêu cầu bị thiếu',404)
     }
}

//Đăng nhập tài khoản công ty
exports.loginCom = async (req,res)=>{
        try {
            if (req.body.email && req.body.password) {
                const type = 1;
                const email = req.body.email
                const password = req.body.password

                let checkPhoneNumber = await functions.checkEmail(email);
                if (checkPhoneNumber) {
                    let findUser = await functions.getDatafindOne(Users, { email: email, type: 1 })
                    if (!findUser) {
                        return functions.setError(res, "không tìm thấy tài khoản trong user model", 404)
                    }
                    let checkPassword = await functions.verifyPassword(password, findUser.password)
                    if (!checkPassword) {
                        return functions.setError(res, "Mật khẩu sai", 404)
                    }
                    const token = await functions.createToken(findUser, "1d")
                    const refreshToken = await functions.createToken({ userId: findUser._id }, "1y")
                    let data = {
                        access_token: token,
                        refresh_token: refreshToken,
                        user_info: {
                            usc_id: findUser._id,
                            usc_email: findUser.email,
                            usc_phone_tk: findUser.phoneTK,
                            usc_pass: findUser.password,
                            usc_company: findUser.userName,
                            usc_address: findUser.address,
                            usc_authentic: findUser.authentic,

                        }
                    }
                    return functions.success(res, 'Đăng nhập thành công', data)

                } else {
                    return functions.setError(res, "không đúng định dạng email", 404)
                }
            }
        } catch (error) {
            console.log(error)
            return functions.setError(res, error)
        }
    }
// hàm gửi otp qua gmail khi kích hoạt tài khoản
exports.sendOTP = async(req, res, next) => {
    try {//người dùng nhập email
        let email = req.body.email;
        if (email != undefined) {//nếu đựợc user điền đủ
            let checkEmail = await functions.checkEmail(email)
            if (checkEmail) {//nếu đúng cú pháp
                let user = await functions.getDatafindOne(Users, { email: email, type: 1 })
                if (user) {//nếu tìm thấy user
                    let otp = await functions.randomNumber
                    await Users.updateOne({ email: email }, {
                        $set: {
                            otp: otp
                        }
                    });
                    await functions.sendEmailVerificationRequest(otp, email, user.userName)
                    const token = await functions.createToken({
                        email: user.email,
                        idQLC: user.idQLC
                    }, '30m')
                    return functions.success(res, 'Gửi mã OTP thành công', { token })
                }else{
                    return functions.setError(res, 'tài khoản không tồn tại', 404)}
            } else {
                return functions.setError(res, 'email không đúng định dạng', 404)
            }
        } else {
            return functions.setError(res, 'thiếu dữ liệu gmail', 404)
        }

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}
// hàm xác nhận otp để kích hoạt tài khoản
exports.verify = async(req, res, next) => {
    try {
        let otp = req.body.ma_xt,
            email = req.user.data.email;
        if (otp && email) {
            let verify = await Users.findOne({ email, otp, type: 1 });
            if (verify != null) {
                await Users.updateOne({ email: email }, {
                    $set: {
                        authentic: 1
                    }
                });
                return functions.success(res, 'xác thực thành công')
            }else{
                return functions.setError(res, 'xác thực thất bại', 404)}
        }else{
            return functions.setError(res, 'thiếu dữ liệu', 404)}

        } catch (error) {
            console.log(error)
            return functions.setError(res, error)
        }
    }

// hàm bước 1 của quên mật khẩu
exports.forgotPasswordCheckMail = async(req, res, next) => {
    try {
        let email = req.body.email;
        let checkEmail = await functions.checkEmail(email);
        if (checkEmail) {
            let verify = await Users.findOne({ email: email, type: 1 });
            if (verify != null) {
                // api lẫy mã OTP qua app Chat
                let data = await functions.getDataAxios('http://43.239.223.142:9000/api/users/RegisterMailOtp', { email });
                let otp = data.data.otp
                if (otp) {
                    await Users.updateOne({ email: email }, {
                        $set: {
                            otp: otp
                        }
                    });
                    const token = await functions.createToken(verify, '30m')
                    return functions.success(res, 'xác thực thành công', { token })
                }
                return functions.setError(res, 'chưa lấy được mã otp', 404)

            }
            return functions.setError(res, 'email không đúng', 404)
        }
        return functions.setError(res, 'sai định dạng email', 404)


    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm bước 2 của quên mật khẩu
exports.forgotPasswordCheckOTP = async(req, res, next) => {
    try {
        let email = req.user.data.email;
        let otp = req.body.ma_xt;
        if (otp) {
            let verify = await Users.findOne({ email: email, otp: otp, type: 1 });
            if (verify != null) {
                return functions.success(res, 'xác thực thành công')
            }
            return functions.setError(res, 'mã otp không đúng', 404)
        }
        return functions.setError(res, 'thiếu mã otp', 404)


    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm bước 3 của quên mật khẩu
exports.updatePassword = async(req, res, next) => {
    try {
        let email = req.user.data.email,
            password = req.body.password;
        if (password) {
            await Users.updateOne({ email: email, type: 1 }, {
                $set: {
                    password: md5(password)
                }
            });
            return functions.success(res, 'đổi mật khẩu thành công')

        }
        return functions.setError(res, 'thiếu mật khẩu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đổi mật khẩu bước 1
exports.changePasswordSendOTP = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let id = req.user.data._id
        let otp = await functions.randomNumber;
        let data = {
            UserID: id,
            SenderID: 1191,
            MessageType: 'text',
            Message: `Chúng tôi nhận được yêu cầu tạo mật khẩu mới tài khoản ứng viên trên timviec365.vn. Mã OTP của bạn là: '${otp}'`
        }
        await functions.getDataAxios('http://43.239.223.142:9000/api/message/SendMessageIdChat', data)
        await Users.updateOne({ email: email, type: 1 }, {
            $set: {
                otp: otp
            }
        });
        return functions.success(res, 'update thành công')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm bước 2  đổi mật khẩu
exports.changePasswordCheckOTP = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let otp = req.body.ma_xt
        if (otp) {
            let verify = await Users.findOne({ email, otp, type: 1 });
            if (verify != null) {
                return functions.success(res, 'xác thực thành công')
            }
            return functions.setError(res, 'mã otp không đúng', 404)
        }
        return functions.setError(res, 'thiếu otp', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đổi mật khẩu bước 3
exports.changePassword = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let password = req.body.password
        if (password) {
            await Users.updateOne({ email: email, type: 1 }, {
                $set: {
                    password: md5(password),
                }
            });
            return functions.success(res, 'đổi mật khẩu thành công')
        }
        return functions.setError(res, 'thiếu mật khẩu', 404)


    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}