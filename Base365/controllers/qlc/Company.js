const Users = require('../../models/Users');
const functions = require('../../services/qlc/functions');
const md5 = require('md5');
const Deparment = require("../../models/qlc/Deparment")


//Đăng kí tài khoản công ty 
exports.register = async (req, res) => {
    const { userName, emailContact, phoneTK, password, address, phone } = req.body;
    let idTimViec365 = ""
    idRaoNhanh365 = ""
    if (userName && password && phoneTK && address) {
        // let checkMail = await functions.checkEmail(email)
        let checkPhone = await functions.checkPhoneNumber(phoneTK)
        if (checkPhone) {
            let finduser = await Users.findOne({ phoneTK: phoneTK, type: 1 })
            let MaxId = await functions.getMaxUserID("company")
            if (finduser == null) {
                const user = new Users({
                    _id: MaxId._id,
                    emailContact: emailContact,
                    phoneTK: phoneTK,
                    userName: userName,
                    phone: phone,
                    address: address,
                    type: 1,
                    authentic: 0,
                    password: md5(password),
                    otp: null,
                    fromWeb: "quanlichung",
                    role: 1,
                    createdAt: new Date(),
                    idQLC: MaxId._idQLC,
                    idTimViec365: MaxId._idTV365,
                    idRaoNhanh365: MaxId._idRN365,
                    'inForCompany.cds.com_vip': 0,
                    'inForCompany.cds.com_ep_vip': 5,
                    'inForCompany.cds.com_vip_time': 0,
                })
                await user.save()
                const token = await functions.createToken(user, "1d")
                const refreshToken = await functions.createToken({ userId: user._id }, "1y")
                let data = {
                    access_token: token,
                    refresh_token: refreshToken,
                }
                await functions.success(res, "tạo tài khoản thành công", { user, data })
            } else {
                await functions.setError(res, 'sdt đã tồn tại', 404);
            }

        } else {
            await functions.setError(res, 'sai dinh dang sdt', 404)

        }
    } else {
        await functions.setError(res, 'Một trong số các trường yêu cầu bị thiếu', 404)

    }
}
//Đăng nhập tài khoản công ty
exports.login = async (req, res, next) => {
    try {
        let phoneTK = req.body.phoneTK
        let email = req.body.email
        password = req.body.password

        type = 1
        if (phoneTK && password) {
            let checkPhone = await functions.checkPhoneNumber(phoneTK)
            if (checkPhone) {
                let findUser = await Users.findOne({ phoneTK: phoneTK, type: 1 })
                console.log(findUser.password)
                console.log(findUser.idQLC)
                if (!findUser) {
                    return functions.setError(res, "không tìm thấy tài khoản trong bảng user", 404)
                }
                let checkPassword = await functions.verifyPassword(password, findUser.password)
                if (!checkPassword) {
                    return functions.setError(res, "Mật khẩu sai", 404)
                }
                // if (findUser.type == type) {
                if (findUser != null) {
                    const token = await functions.createToken(findUser, "1d")
                    const refreshToken = await functions.createToken({ userId: findUser._id }, "1y")
                    let data = {
                        access_token: token,
                        refresh_token: refreshToken,
                        com_info: {
                            com_id: findUser._id,
                            com_email: findUser.email,
                            com_phone_tk: findUser.phoneTK,
                            // com_pass: findUser.password,
                            // com_name: findUser.userName,
                            // com_address: findUser.address,
                            // com_authentic: findUser.authentic,
                            // com_avatar: findUser.avatarCompany,
                            // idQLC: findUser.idQLC

                        }
                    }
                    return functions.success(res, 'Đăng nhập thành công bằng SDT', { data })

                } else {
                    return functions.setError(res, "sai tai khoan hoac mat khau")
                }
            } else {
                return functions.setError(res, "không đúng định dạng SDT", 404)
            }
        } else if (email && password) {
            let checkMail = await functions.checkEmail(email)
            if (checkMail) {
                let findUser = await Users.findOne({ email: email, type: 1 })
                if (!findUser) {
                    return functions.setError(res, "không tìm thấy tài khoản trong bảng user", 404)
                }
                let checkPassword = await functions.verifyPassword(password, findUser.password)
                if (!checkPassword) {
                    return functions.setError(res, "Mật khẩu sai", 404)
                }
                if (findUser != null) {
                    const token = await functions.createToken(findUser, "1d")
                    const refreshToken = await functions.createToken({ userId: findUser._id }, "1y")
                    let data = {
                        access_token: token,
                        refresh_token: refreshToken,
                        com_info: {
                            com_id: findUser._id,
                            com_email: findUser.email,
                            com_phone_tk: findUser.phoneTK,
                            // com_pass: findUser.password,
                            // com_name: findUser.userName,
                            // com_address: findUser.address,
                            // com_authentic: findUser.authentic,
                            // com_avatar: findUser.avatarCompany,
                            // idQLC: findUser.idQLC

                        }
                    }
                    return functions.success(res, 'Đăng nhập thành công bằng Email', { data })

                } else {
                    return functions.setError(res, "sai tai khoan hoac mat khau")
                }
            } else {
                return functions.setError(res, "không đúng định dạng email", 404)
            }
        } else {
            return functions.setError(res, "thiếu dữ liệu email hoặc sdt hoặc password ", 404)

        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.verify = async (req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK;
        console.log(phoneTK)
        let data = []
        if (otp) {
            let findUser = await Users.findOne({ phoneTK: phoneTK, type: 1 })
            if (findUser) {
                data = await Users.updateOne({ phoneTK: phoneTK, type: 1 }, {
                    $set: {
                        otp: otp
                    }
                })
                return functions.success(res, "lưu OTP thành công", { data, otp })
            } else {
                return functions.setError(res, "tài khoản không tồn tại")
            }


        } else if (!otp) {
            let verify = await Users.findOne({ phoneTK: phoneTK, type: 1 });
            console.log(verify)
            if (verify != null) {
                await Users.updateOne({ phoneTK: phoneTK, type: 1 }, {
                    $set: {
                        authentic: 1
                    }
                });
                return functions.success(res, "xác thực thành công");
            } else {
                return functions.setError(res, "xác thực thất bại", 404);
            }


        } else {
            return functions.setError(res, "thiếu dữ liệu sdt", 404)
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message)
    }
}
exports.verifyCheckOTP = async (req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK;

        if (otp) {
            let findUser = await Users.findOne({ phoneTK: phoneTK, type: 1 }).select("otp")
            if (findUser) {
                let data = findUser.otp
                console.log(data)
                if (data === otp) {
                    functions.success(res, "xác thực thành công")
                } else {
                    functions.setError(res, "xác thực thất bại")

                }
            } else {
                return functions.setError(res, "tài khoản không tồn tại")
            }
        } else {
            return functions.setError(res, "vui lòng nhập mã xác thực")

        }
    } catch (e) {
        return functions.setError(res, e.message)

    }
}


// hàm đổi mật khẩu 
exports.updatePassword = async (req, res, next) => {
    try {
        let idQLC = req.user.data.idQLC
        let old_password = req.body.old_password
        let password = req.body.password;
        let re_password = req.body.re_password;
        let checkPassword = await functions.verifyPassword(password)
        if (checkPassword) {
            return functions.setError(res, "sai dinh dang Mk", 404)
        }
        if (!password || !re_password) {
            return functions.setError(res, 'điền thiếu thông tin', 400)
        }
        if (password.length < 6) {
            return functions.setError(res, 'Password quá ngắn', 400)
        }
        if (password !== re_password) {
            return functions.setError(res, 'Password nhập lại không trùng khớp', 400)
        }
        if (old_password) {
            let checkOldPassword = await Users.findOne({ idQLC: idQLC, password: md5(old_password), type: 1 })
            if (!checkOldPassword) {
                functions.setError(res, 'Mật khẩu cũ không đúng, vui lòng kiểm tra lại', 400)
            } else {
                let checkPass = await functions.getDatafindOne(Users, { idQLC, password: md5(password), type: 1 })
                if (!checkPass) {
                    await Users.updateOne({ idQLC: idQLC, type: 1 }, {
                        $set: {
                            password: md5(password),
                        }
                    });
                    return functions.success(res, 'cập nhập thành công')
                }
                return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ', 404)
            }
        }

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}
exports.updatePasswordbyInput = async (req, res, next) => {
    try {
        let phoneTK = req.body.phoneTK
        let email = req.body.email
        let password = req.body.password;
        let re_password = req.body.re_password;
        if (phoneTK && password && re_password) {
            let checkPassword = await functions.verifyPassword(password)
            if (checkPassword) {
                return functions.setError(res, "sai dinh dang Mk", 404)
            }
            if (!password || !re_password) {
                return functions.setError(res, 'Missing data', 400)
            }
            if (password.length < 6) {
                return functions.setError(res, 'Password quá ngắn', 400)
            }
            if (password !== re_password) {
                return functions.setError(res, 'Password nhập lại không trùng khớp', 400)
            }
            let checkPass = await functions.getDatafindOne(Users, { phoneTK: phoneTK, type: 1 })
            console.log(checkPass)
            if (checkPass) {
                await Users.findOneAndUpdate({ phoneTK: phoneTK, type: 1 }, {
                    $set: {
                        password: md5(password),
                    }
                });
                await functions.success(res, 'cập nhập thành công', { checkPass })
            } else {
                functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ', 404)

            }
        } else if (email && password && re_password) {
            let checkPassword = await functions.verifyPassword(password)
            if (checkPassword) {
                return functions.setError(res, "sai dinh dang Mk", 404)
            }
            if (!password || !re_password) {
                return functions.setError(res, 'Missing data', 400)
            }
            if (password.length < 6) {
                return functions.setError(res, 'Password quá ngắn', 400)
            }
            if (password !== re_password) {
                return functions.setError(res, 'Password nhập lại không trùng khớp', 400)
            }
            let checkPass = await functions.getDatafindOne(Users, { email: email, password: md5(password), type: 1 })
            if (!checkPass) {
                await Users.updateOne({ email: email, type: 1 }, {
                    $set: {
                        password: md5(password),
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ', 404)

        } else {
            return functions.setError(res, ' điền thiếu trường ', 404)
        }

    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message)
    }
}

// hàm bước 1 của quên mật khẩu
exports.forgotPassword = async (req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.body.phoneTK;
        let email = req.body.email;
        let password = req.body.password;
        let re_password = req.body.re_password;
        let data = []
        if ((phoneTK || email) && (!otp)) {
            let checkMail = await functions.checkEmail(email)
            let checkPhone = await functions.checkPhoneNumber(phoneTK)
            if (checkMail || checkPhone) {
                let findUser = await Users.findOne({ $or: [{ email: email, type: 1 }, { phoneTK: phoneTK, type: 1 }] })
                if (findUser) {
                    let otp = functions.randomNumber
                    data = await Users.updateOne({ $or: [{ email: email, type: 1 }, { phoneTK: phoneTK, type: 1 }] }, {
                        $set: {
                            otp: otp
                        }
                    })
                    return functions.success(res, "Gửi mã OTP thành công", { data, otp })
                } else {
                    return functions.setError(res, "tài khoản không tồn tại")
                }
            } else {
                return functions.setError(res, " email không đúng định dạng ", 404)
            }

        } else if (otp && (phoneTK || email)) {
            let verify = await Users.findOne({ $or: [{ email: email, otp, type: 1 }, { phoneTK: phoneTK, otp, type: 1 }] });
            if (verify != null) {
                await Users.updateOne({ $or: [{ email: email, type: 1 }, { phoneTK: phoneTK, type: 1 }] }, {
                    $set: {
                        authentic: 1
                    }
                });
                await functions.success(res, "xác thực thành công");



            } else {
                return functions.setError(res, "xác thực thất bại", 404);
            }
        } else if (password && re_password) {
            let checkPassword = await functions.verifyPassword(password)
            if (!checkPassword) {
                return functions.setError(res, "sai dinh dang Mk", 404)
            }
            if (!password && !re_password) {
                return functions.setError(res, 'Missing data', 400)
            }
            if (password.length < 6) {
                return functions.setError(res, 'Password quá ngắn', 400)
            }
            if (password !== re_password) {
                return functions.setError(res, 'Password nhập lại không trùng khớp', 400)
            }
            await Users.updateOne({ $or: [{ email: email, authentic: 1, type: 1 }, { phoneTK: phoneTK, authentic: 1, type: 1 }] }, {
                $set: {
                    password: md5(password),
                }
            });
            await functions.success(res, 'cập nhập MK thành công')

        } else {
            return functions.setError(res, "thiếu dữ liệu", 404)
        }
    } catch (e) {
        // console.log(e);
        return functions.setError(res, e.message)
    }
}

exports.updateInfoCompany = async (req, res, next) => {

    try {
        let idQLC = req.user.data.idQLC;
        let data = [];
        let data1 = [];
        const { userName, email, phoneTK, address } = req.body;

        let File = req.files || null;
        let avatarUser = null;
        if ((idQLC) !== undefined) {
            let findUser = Users.findOne({ idQLC: idQLC })
            if (findUser) {
                if (File.avatarUser) {
                    let upload = functions.uploadFileQLC('avt_com', idQLC, File.avatarUser, ['.jpeg', '.jpg', '.png']);
                    if (!upload) {
                        return functions.setError(res, 'Định dạng ảnh không hợp lệ', 400)
                    }
                    avatarUser = functions.createLinkFileQLC('avt_com', idQLC, File.avatarUser.name)

                    data = await Users.updateOne({ idQLC: idQLC }, {
                        $set: {
                            userName: userName,
                            email: email,
                            phoneTK: phoneTK,
                            avatarUser: avatarUser,
                            address: address,
                            fromWeb: "quanlichung",
                            updatedAt: new Date(),

                        }
                    })
                    await functions.success(res, 'update avartar company success', { data })



                } else {
                    data1 = await Users.updateOne({ idQLC: idQLC }, {
                        $set: {
                            userName: userName,
                            email: email,
                            phoneTK: phoneTK,
                            avatarUser: avatarUser,
                            address: address,
                            fromWeb: "quanlichung",
                            updatedAt: new Date(),
                        }
                    })
                    await functions.success(res, 'update company info success', { data1 })
                }
            } else {
                functions.setError(res, "không tìm thấy user")

            }

        } else {
            functions.setError(res, "không tìm thấy token")
        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}


exports.info = async (req, res) => {
    try {
        const idQLC = req.user.data.idQLC
        if ((idQLC) == undefined) {
            functions.setError(res, "lack of input")
        } else if (isNaN(idQLC)) {
            functions.setError(res, "id must be a Nubmer")
        } else {
            const data = await Users.findOne({ idQLC }).select('userName email phoneTK address avatarUser authentic').lean();
            console.log(data)

            const departmentsNum = await Deparment.countDocuments({ com_id: idQLC })
            const userNum = await Users.countDocuments({ "inForPerson.employee.com_id": idQLC })

            console.log(departmentsNum)
            data.departmentsNum = departmentsNum
            data.userNum = userNum
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
    } catch (e) {
        functions.setError(res, e.message)
    }
} 
