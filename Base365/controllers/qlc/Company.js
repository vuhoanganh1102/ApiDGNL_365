const Users = require('../../models/Users');
const functions = require('../../services/functions');
const md5 = require('md5');

//Đăng kí tài khoản công ty 
exports.register = async (req,res)=>{
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
                            avatarCompany: null
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
exports.login = async (req,res)=>{
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
                        com_info: {
                            com_id: findUser._id,
                            com_email: findUser.email,
                            com_phone_tk: findUser.phoneTK,
                            com_pass: findUser.md5(password),
                            com_name: findUser.userName,
                            com_address: findUser.address,
                            com_authentic: findUser.authentic,
                            com_avatar: findUser.avatarCompany,

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

// hàm đổi mật khẩu 
    exports.updateNewPassword = async(req, res, next) => {
        try {
            let email = req.user.data.email;
            let password = req.body.password;
            if (email) {
                let company = await functions.getDatafindOne(Users, { idQLC: idQLC,type : 1})
                if (company) {
                    await Users.updateOne({ idQLC: idQLC }, {
                        $set: {
                            password: md5(password),
                        }
                    });
                    return functions.success(res, 'cập nhập thành công')
                }
                return functions.setError(res, 'nguoi dung không tồn tại', 404)
            }
            return functions.setError(res, 'không đủ dữ liệu', 404)
        } catch (error) {
            console.log(error)
            return functions.setError(res, error)
        }
    }

// hàm cập nhập thông tin công ty
exports.updateInfoCompany = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let request = req.body,
            phone = request.phone,
            companyName = request.userName,
            address = request.address,
            avatarCompany = request.avatarCompany
            depID = request.depID
              = request.groupID
        if (phone || companyName || email || avatarCompany || address) {
            let checkPhone = await functions.checkPhoneNumber(phone)
            if (checkPhone) {
                await Users.updateOne({ email: email, type: 1 }, {
                    $set: {
                        'userName': companyName,
                        'phone': phone,
                        'email': email,
                        'address': address,
                        'avatarCompany': avatarCompany || null,
                        'department': depID || null,
                        'group' : groupID || null,
                    }
                });
                return functions.success(res, 'update thành công', 404)
            }
            return functions.setError(res, 'sai định dạng số điện thoại', 404)
        }
        return functions.setError(res, 'không có dữ liệu cần cập nhật', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập avatar
exports.updateImg = async(req, res, next) => {
    try {
        let email = req.user.data.email,
            avatarCompany = req.file;
        if (avatarCompany) {
            let checkImg = await functions.checkImage(avatarCompany.path)
            if (checkImg) {
                await Users.updateOne({ email: email, type: 1 }, {
                    $set: {
                        avatarCompany: avatarCompany.filename,
                    }
                });
                return functions.success(res, 'thay đổi ảnh thành công')
            } else {
                await functions.deleteImg(avatarCompany)
                return functions.setError(res, 'sai định dạng ảnh hoặc ảnh lớn hơn 2MB', 404)
            }
        } else {
            await functions.deleteImg(avatarCompany)
            return functions.setError(res, 'chưa có ảnh', 404)
        }
    } catch (error) {
        console.log(error)
        await functions.deleteImg(req.file)
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
                //tạo otp
                let otp = await functions.randomNumber
                // gửi OTP qua mail 
                let send = await functions.sendEmailVerificationRequest(otp, email, verify.userName)
                let RecOPT = send.otp
                if (otp == RecOPT) {
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

