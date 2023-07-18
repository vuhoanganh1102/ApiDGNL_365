const Users = require('../../models/Users');
const fnc = require('../../services/qlc/functions');
const functions = require("../../services/functions")
const md5 = require('md5');
const Deparment = require("../../models/qlc/Deparment")
const comErr = require("../../models/qlc/ComError")


//Đăng kí tài khoản công ty 
exports.register = async(req, res) => {
        try {
            const { userName, emailContact, phoneTK, password, address, phone } = req.body;
            const createdAt = new Date()
            if (userName && password && phoneTK && address) {
                let checkPhone = await functions.checkPhoneNumber(phoneTK)
                if (checkPhone) {
                    let finduser = await Users.findOne({ phoneTK: phoneTK, type: 1 }).lean()
                    let MaxId = await functions.getMaxUserID("company")
                    let _id = MaxId._id
                    if (!finduser) {
                        const user = new Users({
                            _id: _id,
                            emailContact: emailContact,
                            phoneTK: phoneTK,
                            userName: userName,
                            phone: phone,
                            address: address,
                            type: 1,
                            chat365_secret: Buffer.from(_id.toString()).toString('base64'),
                            password: md5(password),
                            fromWeb: "quanlychung",
                            role: 1,
                            createdAt: Date.parse(createdAt) / 1000,
                            idQLC: MaxId._idQLC,
                            idTimViec365: MaxId._idTV365,
                            idRaoNhanh365: MaxId._idRN365,
                            'inForCompany.cds.com_vip': 0,
                            'inForCompany.cds.com_ep_vip': 5,
                            'inForCompany.cds.com_vip_time': 0,
                        })
                        await user.save()
                        const token = await functions.createToken({
                            _id: user._id,
                            idTimViec365: user.idTimViec365,
                            idQLC: user.idQLC,
                            idRaoNhanh365: user.idRaoNhanh365,
                            email: user.email,
                            phoneTK: user.phoneTK,
                            createdAt: user.createdAt,
                            type: user.type,
                            com_id: user.idQLC,
                            userName: user.userName,
                        }, "1d")
                        const refreshToken = await functions.createToken({ userId: user._id }, "1y")
                        let data = {
                            access_token: token,
                            refresh_token: refreshToken,
                        };
                        //tìm kiếm trong bảng đăng kí lỗi , nếu tồn tại sdt đăng kí thành công thì xóa 
                        let checkComErr = await comErr.findOne({ com_phone: phoneTK }).lean()
                        if (checkComErr) {
                            await comErr.deleteOne({ com_phone: phoneTK })
                        }
                        return functions.setError(res, 'sdt đã tồn tại');

                    } else {
                        return functions.setError(res, 'sai địng dạng số điện thoại')

                    }
                } else {
                    //nếu nhập thiếu trường thì lưu lại bảng đăng kí lỗi 
                    let writeErr = await comErr.findOne({ com_phone: phoneTK }).lean()
                    if (!writeErr) {
                        const max1 = await comErr.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean() || 0
                        const com = new comErr({
                            id: Number(max1.id) + 1 || 1,
                            com_email: emailContact,
                            com_phone: phoneTK,
                            com_name: userName,
                            com_address: address,
                            com_pass: password,
                            com_time_err: Date.parse(createdAt) / 1000,
                        })
                        await com.save()
                        return functions.success(res, 'Một trong số các trường yêu cầu bị thiếu, danh sách đăng kí lỗi đã được ghi lại', { com })
                    }
                    return functions.setError(res, 'Một trong số các trường yêu cầu bị thiếu')
                }
            } else {
                //nếu nhập thiếu trường thì lưu lại bảng đăng kí lỗi 
                let writeErr = await comErr.findOne({ com_phone: phoneTK }).lean()
                    //nếu không tìm thấy thì tạo mới 
                if (!writeErr) {
                    const max1 = await comErr.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean() || 0
                    const com = new comErr({
                        id: Number(max1.id) + 1 || 1,
                        com_email: emailContact,
                        com_phone: phoneTK,
                        com_name: userName,
                        com_address: address,
                        com_pass: password,
                        com_time_err: Date.parse(createdAt) / 1000,
                    })
                    await com.save()
                    return functions.setError(res, 'Một trong số các trường yêu cầu bị thiếu, danh sách đăng kí lỗi đã được ghi lại')
                } else {
                    //nếu tìm thấy thì cập nhật 
                    await Users.updateOne({ com_phone: phoneTK }, {
                        $set: {
                            com_email: emailContact,
                            com_phone: phoneTK,
                            com_name: userName,
                            com_address: address,
                            com_pass: password,
                            com_time_err: Date.parse(createdAt) / 1000,
                        }
                    })
                    return functions.setError(res, 'Một trong số các trường yêu cầu bị thiếu, danh sách đăng kí lỗi đã được cập nhật')
                };
            }
        } else {
            //nếu nhập thiếu trường thì lưu lại bảng đăng kí lỗi 
            let writeErr = await comErr.findOne({ com_phone: phoneTK }).lean()
                //nếu không tìm thấy thì tạo mới 
            if (!writeErr) {
                const max1 = await comErr.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean() || 0
                const com = new comErr({
                    id: Number(max1.id) + 1 || 1,
                    com_email: emailContact,
                    com_phone: phoneTK,
                    com_name: userName,
                    com_address: address,
                    com_pass: password,
                    com_time_err: Date.parse(createdAt) / 1000,
                })
                await com.save()
                return functions.setError(res, 'Một trong số các trường yêu cầu bị thiếu, danh sách đăng kí lỗi đã được ghi lại')
            } else {
                //nếu tìm thấy thì cập nhật 
                await comErr.updateOne({ com_phone: phoneTK }, {
                    $set: {
                        com_email: emailContact,
                        com_phone: phoneTK,
                        com_name: userName,
                        com_address: address,
                        com_pass: password,
                        com_time_err: Date.parse(createdAt) / 1000,
                    }
                })
                return functions.setError(res, 'Một trong số các trường yêu cầu bị thiếu, danh sách đăng kí lỗi đã được cập nhật')
            };
        }

    }
    //Đăng nhập tài khoản công ty
exports.login = async(req, res, next) => {
    try {
        let phoneTK = req.body.phoneTK
        let email = req.body.email
        password = req.body.password
        type_user = {};
        if (phoneTK && password) {

            let checkPhone = await functions.checkPhoneNumber(phoneTK)
            if (checkPhone) {
                let checkTypeUser = await Users.findOne({ phoneTK: phoneTK }).lean()
                if (checkTypeUser.type == 0) {
                    type_user = 0
                    functions.success(res, "tài khoản là tài khoản cá nhân", { type_user })
                } else if (checkTypeUser.type == 1) {
                    type_user = 1
                    let checkPassword = await functions.verifyPassword(password, checkTypeUser.password)
                    if (!checkPassword) {
                        return functions.setError(res, "Mật khẩu sai")
                    }
                    if (checkTypeUser != null) {
                        const token = await functions.createToken(checkTypeUser, "1d")
                        const refreshToken = await functions.createToken({ userId: checkTypeUser._id }, "1y")
                        let data = {
                            access_token: token,
                            refresh_token: refreshToken,
                            com_info: {
                                com_id: checkTypeUser._id,
                                com_phone_tk: checkTypeUser.phoneTK,
                            }
                        }
                        data.type_user = type_user
                        return functions.success(res, 'Đăng nhập thành công bằng SDT', { data })

                    } else {
                        return functions.setError(res, "sai tai khoan hoac mat khau")
                    }
                } else if (checkTypeUser.type == 2) {
                    type_user = 2
                    functions.success(res, "tài khoản là tài khoản nhân viên", { type_user })
                } else {
                    functions.setError(res, "không tìm thấy tài khoản ")
                }

            } else {
                return functions.setError(res, "không đúng định dạng SDT")
            }
        } else if (email && password) {
            let checkMail = await functions.checkEmail(email)
            if (checkMail) {
                let checkTypeUser = await Users.findOne({ email: email }).lean()
                if (checkTypeUser.type == 0) {
                    type_user = 0
                    functions.success(res, "tài khoản là tài khoản cá nhân", { type_user })
                } else if (checkTypeUser.type == 1) {
                    type_user = 1
                    let checkPassword = await functions.verifyPassword(password, checkTypeUser.password)
                    if (!checkPassword) {
                        return functions.setError(res, "Mật khẩu sai")
                    }
                    if (checkTypeUser != null) {
                        const token = await functions.createToken(checkTypeUser, "1d")
                        const refreshToken = await functions.createToken({ userId: checkTypeUser._id }, "1y")
                        let data = {
                            access_token: token,
                            refresh_token: refreshToken,
                            com_info: {
                                com_id: checkTypeUser._id,
                                com_email: checkTypeUser.email,
                            }
                        }
                        data.type_user = type_user
                        return functions.success(res, 'Đăng nhập thành công bằng email', { data })

                    } else {
                        return functions.setError(res, "sai tai khoan hoac mat khau")
                    }
                } else if (checkTypeUser.type == 2) {
                    type_user = 2
                    functions.success(res, "tài khoản là tài khoản nhân viên", { type_user })
                } else {
                    functions.setError(res, "không tìm thấy tài khoản ")
                }
            } else {
                return functions.setError(res, "không đúng định dạng email")
            }
        } else {
            return functions.setError(res, "thiếu dữ liệu email hoặc sdt hoặc password ")

        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.verify = async(req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK;
        let data = []
        if (otp) {
            data = await Users.updateOne({ phoneTK: phoneTK, type: 1 }, {
                $set: {
                    otp: otp
                }
            });
            return functions.success(res, "lưu OTP thành công", { data })
        } else if (!otp) {
            await Users.updateOne({ phoneTK: phoneTK, type: 1 }, {
                $set: {
                    authentic: 1
                }
            });
            return functions.success(res, "xác thực thành công");
        } else {
            return functions.setError(res, "thiếu dữ liệu sdt")
        };
    } catch (e) {
        return functions.setError(res, e.message)
    }
}

exports.verifyCheckOTP = async(req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK;

        if (otp) {
            let findUser = await Users.findOne({ phoneTK: phoneTK, type: 1 }).select("otp")
            if (findUser) {
                let data = findUser.otp
                if (data === otp) {
                    functions.success(res, "xác thực thành công")
                } else {
                    functions.setError(res, "xác thực thất bại")
                };
            } else {
                return functions.setError(res, "tài khoản không tồn tại")
            };
        } else {
            return functions.setError(res, "vui lòng nhập mã xác thực")
        };
    } catch (e) {
        return functions.setError(res, e.message)
    };
}

exports.CheckUpdatePasswordByInput = async(req, res, next) => {
    try {
        let input = req.body.input
        if (input) {
            let user;
            if (!await functions.checkPhoneNumber(input)) {
                user = await Users.findOne({
                    email: input,
                }).lean();
            } else {
                user = await Users.findOne({
                    phoneTK: input,
                }).lean();
            }
            if (user) {
                return functions.success(res, " tài khoản tồn tại ")
            }
            return functions.setError(res, " tài khoản chưa tồn tại ")
        }
        return functions.setError(res, " nhập thiếu email hoặc sdt ")


    } catch (error) {
        return functions.setError(res, error)
    }
}

// hàm đổi mật khẩu 
exports.updatePassword = async(req, res, next) => {
    try {
        let idQLC = req.user.data.idQLC
        let old_password = req.body.old_password
        let password = req.body.password;
        if (!password) {
            return functions.setError(res, 'điền thiếu thông tin')
        }
        if (password.length < 6) {
            return functions.setError(res, 'Password quá ngắn')
        }
        if (old_password) {
            let checkOldPassword = await Users.findOne({ idQLC: idQLC, password: md5(old_password), type: 1 })
            if (checkOldPassword) {
                await Users.updateOne({ idQLC: idQLC, type: 1 }, {
                    $set: {
                        password: md5(password),
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(res, 'Mật khẩu cũ không đúng, vui lòng kiểm tra lại')
        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}
exports.updatePasswordbyInput = async(req, res, next) => {
        try {
            let phoneTK = req.body.phoneTK
            let email = req.body.email
            let password = req.body.password;
            if (phoneTK && password) {
                if (password.length < 6) {
                    return functions.setError(res, 'Password quá ngắn')
                }
                let checkPass = await functions.getDatafindOne(Users, { phoneTK, password: md5(password), type: 1 })
                if (!checkPass) {
                    await Users.updateOne({ phoneTK: phoneTK, type: 1 }, {
                        $set: {
                            password: md5(password),
                        }
                    });
                    return functions.success(res, 'cập nhập thành công')
                }
                return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ');
            } else if (email && password) {
                if (password.length < 6) {
                    return functions.setError(res, 'Password quá ngắn')
                }
                let checkPass = await functions.getDatafindOne(Users, { email, password: md5(password), type: 1 })
                if (!checkPass) {
                    await Users.updateOne({ email: email, type: 1 }, {
                        $set: {
                            password: md5(password),
                        }
                    });
                    return functions.success(res, 'cập nhập thành công')
                }
                return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ');
            } else {
                return functions.setError(res, ' điền thiếu trường ')
            };

        } catch (error) {
            return functions.setError(res, error.message)
        }
    }
    // // hàm bước 1 của quên mật khẩu
    // exports.forgotPassword = async(req, res) => {
    //     try {
    //         let otp = req.body.ma_xt || null
    //         let phoneTK = req.body.phoneTK;
    //         let email = req.body.email;
    //         let password = req.body.password;
    //         let re_password = req.body.re_password;
    //         let data = []
    //         if ((phoneTK || email) && (!otp)) {
    //             let checkMail = await functions.checkEmail(email)
    //             let checkPhone = await functions.checkPhoneNumber(phoneTK)
    //             if (checkMail || checkPhone) {
    //                 let findUser = await Users.findOne({ $or: [{ email: email, type: 1 }, { phoneTK: phoneTK, type: 1 }] })
    //                 if (findUser) {
    //                     let otp = functions.randomNumber
    //                     data = await Users.updateOne({ $or: [{ email: email, type: 1 }, { phoneTK: phoneTK, type: 1 }] }, {
    //                         $set: {
    //                             otp: otp
    //                         }
    //                     })
    //                     return functions.success(res, "Gửi mã OTP thành công", { data, otp })
    //                 } else {
    //                     return functions.setError(res, "tài khoản không tồn tại")
    //                 }
    //             } else {
    //                 return functions.setError(res, " email không đúng định dạng ")
    //             }

//         } else if (otp && (phoneTK || email)) {
//             let verify = await Users.findOne({ $or: [{ email: email, otp, type: 1 }, { phoneTK: phoneTK, otp, type: 1 }] });
//             if (verify != null) {
//                 await Users.updateOne({ $or: [{ email: email, type: 1 }, { phoneTK: phoneTK, type: 1 }] }, {
//                     $set: {
//                         authentic: 1
//                     }
//                 });
//                 await functions.success(res, "xác thực thành công");
//             } else {
//                 return functions.setError(res, "xác thực thất bại");
//             }
//         } else if (password && re_password) {
//             let checkPassword = await functions.verifyPassword(password)
//             if (!checkPassword) {
//                 return functions.setError(res, "sai dinh dang Mk")
//             }
//             if (!password && !re_password) {
//                 return functions.setError(res, 'Missing data')
//             }
//             if (password.length < 6) {
//                 return functions.setError(res, 'Password quá ngắn')
//             }
//             if (password !== re_password) {
//                 return functions.setError(res, 'Password nhập lại không trùng khớp')
//             }
//             await Users.updateOne({ $or: [{ email: email, authentic: 1, type: 1 }, { phoneTK: phoneTK, authentic: 1, type: 1 }] }, {
//                 $set: {
//                     password: md5(password),
//                 }
//             });
//             return functions.success(res, 'cập nhập MK thành công')

//         } else {
//             return functions.setError(res, "thiếu dữ liệu")
//         }
//     } catch (e) {
//         return functions.setError(res, e.message)
//     }
// }

exports.updateInfoCompany = async(req, res, next) => {
    try {
        let idQLC = req.user.data.idQLC;
        let data = [];
        let data1 = [];
        const { userName, emailContact, phone, address } = req.body;
        let updatedAt = new Date()
        let File = req.files || null;
        let avatarUser = null;
        if ((idQLC) !== undefined) {
            let findUser = Users.findOne({ idQLC: idQLC, type: 1 })
            if (findUser) {
                if (File && File.avatarUser) {
                    //  const namefiles = req.files.avatarUser.originalFilename;
                    let upload = await fnc.uploadAvaComQLC(File.avatarUser, ['.jpeg', '.jpg', '.png']);
                    if (!upload) {
                        return functions.setError(res, 'Định dạng ảnh không hợp lệ')
                    }
                    avatarUser = upload
                }
                data = await Users.updateOne({ idQLC: idQLC, type: 1 }, {
                    $set: {
                        userName: userName,
                        emailContact: emailContact,
                        phone: phone,
                        avatarUser: avatarUser,
                        address: address,
                        updatedAt: Date.parse(updatedAt) / 1000,
                    }
                })
                await functions.success(res, 'update company info success', { data })
            } else {
                return functions.setError(res, "không tìm thấy user")
            }
        } else {
            return functions.setError(res, "không tìm thấy token")
        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}
exports.info = async(req, res) => {
    try {
        const idQLC = req.user.data.idQLC
        const data = await Users.findOne({ idQLC: idQLC, type: 1 }).select('idQLC userName email phoneTK address avatarUser authentic inForCompany.cds.com_vip createdAt').lean();
        if (data) {
            const com_vip = data.inForCompany.cds.com_vip
            const avatar = await fnc.createLinkFileComQLC(data.createdAt, data.avatarUser)
            const departmentsNum = await Deparment.countDocuments({ com_id: idQLC })
            const userNum = await Users.countDocuments({ "inForPerson.employee.com_id": idQLC })
            if (departmentsNum !== null) data.departmentsNum = departmentsNum
            if (userNum !== null) data.userNum = userNum
            if (com_vip !== null) data.com_vip = com_vip
            if (avatar) data.avatar = avatar
            return functions.success(res, 'Lấy thành công', { data });
        };
        return functions.setError(res, 'Không có dữ liệu');
    } catch (e) {
        return functions.setError(res, e.message)
    }
}