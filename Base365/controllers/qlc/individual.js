const Users = require("../../models/Users")
const functions = require("../../services/functions")
const md5 = require("md5")

//đăng kí tài khoản cá nhân 
exports.register = async (req, res) => {
    try{
        const { userName, email, password, phoneTK, address } = req.body

    if (userName  && password && phoneTK && address) {
        let checkPhone = await functions.checkPhoneNumber(phoneTK);
        if (checkPhone) {
            //  check email co trong trong database hay khong
            let user = await functions.getDatafindOne(Users, { phoneTK: phoneTK, type: 0 })

            let MaxId = await functions.getMaxID(Users) || 0
            if (user == null) {
                const Inuser = new Users({
                    _id: Number(MaxId) + 1 || 1,
                    email: req.body.email,
                    userName: req.body.userName,
                    phoneTK: req.body.phoneTK,
                    password: md5(password),
                    address: req.body.address,
                    type: 0,
                    role: 0,
                    otp: null,
                    authentic: null,
                    idQLC: (Number(MaxId) + 1),
                    "inForPerson.employee.com_id": req.body.com_id,
                    "inForPerson.employee.dep_id": req.body.dep_id,
                })
                const token = await functions.createToken({
                    email: user.email,
                    idQLC: user.idQLC
                }, "1d")
                const refreshToken = await functions.createToken({ userId: Inuser._id }, "1y")
                await Inuser.save().then(() => functions.success(res, "tạo tài khoản thành công", { Inuser, token, refreshToken })).catch((e) => {
                    console.log(e);
                

                
                });
        } else {
            await functions.setError(res, " email đã tồn tại")
        }
    } else {
        functions.setError(res, "định dạng sdt không đúng ")
    }
}else{
    functions.setError(res, "thiếu thông tin để đăng kí ")

}
    }catch(e){
        functions.setError(res, e.message)

    }
    
}
// hàm xác thực otp bước 1: gửi OTP qua phone khi kích hoạt tài khoản
exports.verify = async (req,res)=>{
    try{
        let otp = req.body.ma_xt || null
        let phoneTK = req.body.phoneTK;
        let email = req.body.email;
        let data = []
        if((phoneTK || email )&&(!otp)){
            let checkMail = await functions.checkEmail(email)
            let checkPhone = await functions.checkPhoneNumber(phoneTK)
            if(checkMail || checkPhone){
                let findUser = await Users.findOne($or[ { email:email, type: 0 },{phoneTK:phoneTK ,type :0}])
                if(findUser) {
                    let otp = functions.randomNumber
                    data = await Users.updateOne($or[ { email:email, type: 0 },{phoneTK:phoneTK ,type :0}],{
                        $set:{
                            otp : otp
                        }
                    })
                    return functions.success(res,"Gửi mã OTP thành công",{data ,otp})
                }else {
                    return functions.setError(res,"tài khoản không tồn tại")
                }
            }else{
                return functions.setError(res," email không đúng định dạng ",404)
            }

        }else if (otp&&(phoneTK||email)){
            let verify = await findOne($or[ { email:email,otp, type: 0 },{phoneTK:phoneTK,otp ,type :0}]);
            if (verify != null){
                await Users.updateOne($or[ { email:email, type: 0 },{phoneTK:phoneTK ,type :0}],{
                    $set: {
                        authentic :1 
                    }
                });
                return functions.success(res,"xác thực thành công");
            }else{
                return functions.setError(res,"xác thực thất bại",404);
            }
        
        
         }else{
            return functions.setError(res,"thiếu dữ liệu gmail",404)
        }
    } catch(e) {
        console.log(e);
        return functions.setError(res , error)
    }
}
exports.login = async (req, res) => {

    try {
        let email = req.body.email
            password = req.body.password
            type = 0
        if (email && password) {
            let checkMail = await functions.checkEmail(email)
            if (checkMail) {
                let findUser = await functions.getDatafindOne(Users, { email, type: 0 })
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
                        user_info: {
                            user_id: findUser._id,
                            user_email: findUser.email,
                            user_phoneTK: findUser.phoneTK,
                            user_password: findUser.password,
                            user_name: findUser.userName,
                            user_address: findUser.address,
                            user_authentic: findUser.authentic,
                            user_avatar: findUser.avatarUser,
                            user_com_id: findUser.com_id,
                            user_dep_id: findUser.dep_id,
                            user_groupID: findUser.groupID,
                            user_birthday: findUser.birthday,
                            user_gender: findUser.gender,
                            user_married: findUser.married,
                            user_exp: findUser.exp,
                            user_startWorkingTime: findUser.startWorkingTime,
                            user_candiHocVan: findUser.candiHocVan,

                        }

                    }
                    return functions.success(res, "dang nhap thanh cong", {data})
                } else {
                    await functions.setError(res, "mail khong ton tai ")
                }
            } else {
                await functions.setError(res, "thieu email hoac password")
            }
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, error)
    }
}

// hàm đổi mật khẩu 
exports.updatePassword = async (req, res, next) => {
    try {
        let idQLC = req.user.body.idQLC
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
            let checkPass = await functions.getDatafindOne(Users, { idQLC, password: md5(password), type: 0 })
            if (!checkPass) {
                await Users.updateOne({ idQLC: idQLC }, {
                    $set: {
                        password: md5(password),
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ', 404)
        } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập thông tin cá nhân
exports.updateInfoindividual = async(req, res, next) => {
    try {
        let idQLC = req.user.data.idQLC;
        const { userName, email , phoneTK, password, com_id, address ,position_id,dep_id,phone,avatarUser,role,group_id,birthday,gender,married,experience,startWorkingTime,education,otp} = req.body;
        
        let File = req.files || null;
        let avatarCompany = null;
        let updatedAt = new Date();
        if ((userName && password && com_id &&
            address && email && phoneTK) !== undefined) {
        if(email){
            if (await functions.checkEmail(email) === false) {
                return functions.setError(res, 'invalid email',400)
            } else {
                let check_email = await Users.findById(idQLC);
                if (check_email.email !== email) {
                    let check_email_lan2 = await Users.find({ email });
                    if (check_email_lan2.length !== 0) {
                        return functions.setError(res, "email is exits",400)
                    }
                }
            }
        }
        if (File.avatarCompany) {
            let upload = functions.uploadFileQLC('avt_com', idQLC, File.avatarCompany, ['.jpeg', '.jpg', '.png']);
            if (!upload) {
                return functions.setError(res, 'Định dạng ảnh không hợp lệ',400)
            }
            avatarCompany = functions.createLinkFileQLC('avt_com', idQLC, File.avatarCompany.name)
            await Users.findByIdAndUpdate(idQLC, { userName, email , phoneTK, password, com_id, address ,position_id,dep_id,phone,avatarUser,role,group_id,birthday,gender,married,experience,startWorkingTime,education, avatarCompany, updatedAt });
        }
        await Users.findByIdAndUpdate(idQLC, { userName, email , phoneTK, password, com_id, address ,position_id,dep_id,phone,avatarUser,role,group_id,birthday,gender,married,experience,startWorkingTime,education,updatedAt  });
        return functions.success(res, 'update data user success')
    }
}catch(error) {
    return functions.setError(res, error.message)
}
}

// // hàm cập nhập avatar
// exports.updateImg = async(req, res, next) => {
//     try {
//         let email = req.user.data.email,
//             avatarUser = req.file;
//         if (avatarUser) {
//             let checkImg = await functions.checkImage(avatarUser.path)
//             if (checkImg) {
//                 await Users.updateOne({ email: email, type: 2 }, {
//                     $set: {
//                         avatarUser: avatarUser.filename,
//                     }
//                 });
//                 return functions.success(res, 'thay đổi ảnh thành công')
//             } else {
//                 await functions.deleteImg(avatarUser)
//                 return functions.setError(res, 'sai định dạng ảnh hoặc ảnh lớn hơn 2MB', 404)
//             }
//         } else {
//             await functions.deleteImg(avatarUser)
//             return functions.setError(res, 'chưa có ảnh', 404)
//         }
//     } catch (error) {
//         console.log(error)
//         await functions.deleteImg(req.file)
//         return functions.setError(res, error)
//     }
// }

// hàm bước 1 của quên mật khẩu
exports.forgotPassword = async (req,res)=>{
    try{
        let otp = req.body.ma_xt || null
        let phoneTK = req.body.phoneTK;
        let email = req.body.email;
        let password = req.body.password;
        let re_password = req.body.re_password;
        let data = []
        if((phoneTK || email )&&(!otp)){
            let checkMail = await functions.checkEmail(email)
            let checkPhone = await functions.checkPhoneNumber(phoneTK)
            if(checkMail || checkPhone){
                let findUser = await Users.findOne($or[ { email:email, type: 0 },{phoneTK:phoneTK ,type :0}])
                if(findUser) {
                    let otp = functions.randomNumber
                    data = await Users.updateOne($or[ { email:email, type: 0 },{phoneTK:phoneTK ,type :0}],{
                        $set:{
                            otp : otp
                        }
                    })
                    return functions.success(res,"Gửi mã OTP thành công",{data})
                }else {
                    return functions.setError(res,"tài khoản không tồn tại")
                }
            }else{
                return functions.setError(res," email không đúng định dạng ",404)
            }

        }else if (otp&&(phoneTK||email)){
            let verify = await findOne($or[ { email:email,otp, type: 0 },{phoneTK:phoneTK,otp ,type :0}]);
            if (verify != null){
                await Users.updateOne($or[ { email:email, type: 0 },{phoneTK:phoneTK ,type :0}],{
                    $set: {
                        authentic :1 
                    }
                });
                await functions.success(res,"xác thực thành công");
                
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
                    let checkPass = await functions.getDatafindOne(Users, { idQLC, password: md5(password), type: 0 })
                    if (!checkPass) {
                        await Users.updateOne({ idQLC: idQLC }, {
                            $set: {
                                password: md5(password),
                            }
                        });
                        return functions.success(res, 'cập nhập thành công',{})
                    }
                    return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ', 404)


            }else{
                return functions.setError(res,"xác thực thất bại",404);
            }
        
        
         }else{
            return functions.setError(res,"thiếu dữ liệu gmail",404)
        }
    } catch(e) {
        console.log(e);
        return functions.setError(res , error)
    }
}
