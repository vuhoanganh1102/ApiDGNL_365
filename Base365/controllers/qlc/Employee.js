const { isNull } = require('util');
const Users = require('../../models/Users')
const functions = require('../../services/functions')
const md5 = require('md5');
//đăng kí tài khoản nhân viên 
exports.register = async (req, res) => {
try{
    const { userName, email, phoneTK, password, com_id, address, position_id, dep_id, phone, avatarUser, role, group_id, birthday, gender, married, experience, startWorkingTime, education, otp } = req.body;

    if ((userName && password && com_id && address && phoneTK) !== undefined) {
        let checkPhone = await functions.checkPhoneNumber(phoneTK);
        if (checkPhone) {
            //  check email co trong trong database hay khong
            let user = await functions.getDatafindOne(Users, { phoneTK: phoneTK, type: 2 })
            let MaxId = await functions.getMaxID(Users) || 0
            if (user == null) {
                const user = new Users({
                    _id: Number(MaxId) + 1 || 1,
                    email: email,
                    phoneTK: phoneTK,
                    userName: userName,
                    phone: phone,
                    avatarUser: avatarUser,
                    "inForPerson.employee.position_id": position_id,
                    "inForPerson.employee.com_id": com_id,
                    "inForPerson.employee.dep_id": dep_id,
                    type: 2,
                    password: md5(password),
                    address: address,
                    otp: otp,
                    authentic: null || 0,
                    fromWeb: "quanlichung.timviec365",
                    role: 0,
                    avatarUser: null,
                    idQLC: (Number(MaxId) + 1),
                    "inForPerson.employee.group_id": group_id,
                    "inForPerson.account.birthday": birthday,
                    "inForPerson.account.gender": gender,
                    "inForPerson.account.married": married,
                    "inForPerson.account.experience": experience,
                    startWorkingTime: startWorkingTime,
                    "inForPerson.account.education": education,
                })
                const token = await functions.createToken({
                    email : user.email,
                    idQLC : user.idQLC
                },"1d")
                const refreshToken = await functions.createToken({userId : user._id}, "1y")

                await user.save().then(() => functions.success(res, "tạo tài khoản thành công", { user ,token, refreshToken  })).catch((e) => {
                    console.log(e);


                });
            } else {
                await functions.setError(res, 'SDT đã tồn tại', 404);

            }
        } else {
            await functions.setError(res, ' định dạng sdt không đúng', 404);
        }

    } else {
        await functions.setError(res, 'Một trong các trường yêu cầu bị thiếu', 404)
    }
}catch (e){
     functions.setError(res, e.message)

}

}

// hàm gửi otp qua gmail khi kích hoạt tài khoản
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
                let findUser = await Users.findOne({$or:[ { email:email, type: 2 },{phoneTK:phoneTK ,type :2}]})
                if(findUser) {
                    let otp = functions.randomNumber
                    data = await Users.updateOne({$or:[ { email:email, type: 2 },{phoneTK:phoneTK ,type :2}]},{
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
            let verify = await Users.findOne( {$or:[ { email:email,otp, type: 2 },{phoneTK:phoneTK,otp ,type :2}]});
            if (verify != null){
                await Users.updateOne({$or:[ { email:email, type: 2 },{phoneTK:phoneTK ,type :2}]},{
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
        return functions.setError(res , e.message)
    }
}
// hàm xác nhận otp để kích hoạt tài khoản check qua filebase
// exports.verify = async (req,res)=>{
//     try{
//         let otp = req.body.ma_xt,
//             phoneTK = req.user.data.phoneTK;
//         if(otp&&phoneTK) {
//             let verify = await findOne({phoneTK, otp , type : 2});
//             if (verify != null){
//                 await Users.updateOne({phoneTK :phoneTK}, {
//                     $set: {
//                         authentic :1 
//                     }
//                 });
//                 return functions.success(res,"xác thực thành công");
//             }else{
//                 return functions.setError(res,"xác thực thất bại",404);
//             }
//         }else{
//             return functions.setError(res,"thiếu dữ liệu",404);
//         }
//     }catch(e){
//         console.log(e)
//         return functions.setError(res, error)
//     }
// }
//hàm đăng nhập
exports.login = async (req,res)=>{
    try {
        let email = req.body.email
        let phoneTK = req.body.phoneTK
        password = req.body.password
        type = 2
        if ((email||phoneTK) && password) {
            let checkMail = await functions.checkEmail(email)
            let checkPhone = await functions.checkPhoneNumber(phoneTK)
            if(checkMail || checkPhone){
                let findUser = await Users.findOne({$or:[ { email:email, type: 2 },{phoneTK : phoneTK ,type :2}]})
                let crmtoken = await Users.findOne({ email, type: 2 }).select("idQLC row inForPerson.employee.position_id inForPerson.employee.com_id type")
                if (!findUser) {
                    return functions.setError(res, "không tìm thấy tài khoản trong bảng user", 404)
                }
                let checkPassword = await functions.verifyPassword(password, findUser.password)
                if (!checkPassword) {
                    return functions.setError(res, "Mật khẩu sai", 404)
                }
                if (findUser != null) {
                const token = await functions.createToken(findUser, "1d");
                const tokenCRM = await functions.createToken(crmtoken, "1d")

                const refreshToken = await functions.createToken({userId : findUser._id}, "1y")
                let data = {
                    access_token : "bear" + " " + token,
                    access_token_CRM: "bear" + " " + tokenCRM,
                    refresh_token : refreshToken,
                    user_info: {
                        // user_id : findUser._id,
                        user_email :findUser.email,
                        // user_phoneTK : findUser.phoneTK,
                        // user_password :findUser.password,
                        // user_name : findUser.userName,
                        // user_address : findUser.address,
                        // user_authentic : findUser.authentic,
                        // user_avatar : findUser.avatarUser,
                        // user_com_id: findUser.com_id,
                        // user_dep_id: findUser.dep_id,
                        // user_group_id : findUser.group_id,
                        // user_birthday : findUser.birthday,
                        // user_gender : findUser.gender,
                        // user_married : findUser.married,
                        // user_exp : findUser.exp,
                        // user_startWorkingTime: findUser.startWorkingTime,
                        // user_education : findUser.education,
                        
                    }

                }
                return functions.success(res,"dang nhap thanh cong",{data})
            }else{
                await functions.setError(res,"mail khong ton tai ")
            }
        }else{
            await functions.setError(res,"thieu email hoac password")
        }
    }
    }catch(e){
        console.log(e);
        return functions.setError(res, e.message)
    }
}
    // hàm đổi mật khẩu 
    exports.updatePassword = async (req, res, next) => {
        try {
            let idQLC = req.user.body.idQLC
            let password = req.body.password;
            let re_password = req.body.re_password;
            let checkPassword = await functions.verifyPassword(password)
            if (!checkPassword) {
                return functions.setError(res, "sai dinh dang Mk", 404)
            }
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
                let checkPass = await functions.getDatafindOne(Users, { idQLC, password: md5(password), type: 2 })
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
            return functions.setError(res, error.message)
        }
    }
// hàm cập nhập thông tin nhan vien

exports.updateInfoEmployee = async (req, res, next) => {
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

// hàm quên mật khẩu
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
                    let findUser = await Users.findOne({$or:[ { email:email, type: 2 },{phoneTK:phoneTK ,type :2}]})
                    if(findUser) {
                        let otp = functions.randomNumber
                        data = await Users.updateOne({$or:[ { email:email, type: 2 },{phoneTK:phoneTK ,type :2}]},{
                            $set:{
                                otp : otp
                            }
                        })
                        return functions.success(res,"Gửi mã OTP thành công",{data, otp})
                    }else {
                        return functions.setError(res,"tài khoản không tồn tại")
                    }
                }else{
                    return functions.setError(res," email không đúng định dạng ",404)
                }
    
            }else if (otp&&(phoneTK||email)){
                let verify = await Users.findOne({$or:[ { email:email,otp, type: 2 },{phoneTK:phoneTK,otp ,type :2}]});
                if (verify != null){
                    await Users.updateOne({$or:[ { email:email, type: 2 },{phoneTK:phoneTK ,type :2}]},{
                        $set: {
                            authentic :1 
                        }
                    });
                    await functions.success(res,"xác thực thành công");
                    
                   

                }else{
                    return functions.setError(res,"xác thực thất bại",404);
                }
            }else if ( password && re_password){
                let checkPassword = await functions.verifyPassword(password)
                if (!checkPassword) {
                    return functions.setError(res, "sai dinh dang Mk", 404)
                }
                if(!password && !re_password){
                    return functions.setError(res, 'Missing data', 400)
                }
                if(password.length < 6){
                    return functions.setError(res, 'Password quá ngắn', 400)
                }
                if(password !== re_password)
                {
                    return functions.setError(res, 'Password nhập lại không trùng khớp', 400)
                }
                        await Users.updateOne({$or:[ { email:email,authentic:1, type: 2 },{phoneTK:phoneTK,authentic:1 ,type :2}]},{
                            $set: {
                                password: md5(password),
                            }
                        });
                        await functions.success(res, 'cập nhập MK thành công')
            
             }else{
                return functions.setError(res,"thiếu dữ liệu",404)
            }
        } catch(e) {
            // console.log(e);
            return functions.setError(res , e.message)
        }
    }

// // hàm bước 3 của quên mật khẩu
// exports.updatePassword = async (req, res, next) => {
//     try {
//         let idQLC = req.user.data.idQLC,
//             password = req.body.password;
//         if (password) {
//             let checkPass = await functions.getDatafindOne(Users, { idQLC,type : 2})
//             if (!checkPass) {    
//                 await Users.updateOne({ idQLC: idQLC, type: 2 }, {
//                     $set: {
//                         password: md5(password)
//                     }
//                 });
//                 return functions.success(res, 'đổi mật khẩu thành công')
//             }else{
//                 return functions.setError(res,'mật khẩu đã tồn tại')
//             }
//         }
//         return functions.setError(res, 'nhập lại mật khẩu', 404)

//     } catch (error) {
//         console.log(error)
//         return functions.setError(res, error)
//     }
// }
