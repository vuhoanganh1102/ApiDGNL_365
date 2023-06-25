const Users = require('../../models/Users')
const functions = require('../../services/functions')
const md5 = require('md5');
//đăng kí tài khoản nhân viên 
exports.register = async (req,res)=>{
    
        const { userName, email , phoneTK, password, com_id, address ,position_id,dep_id,phone,avatarUser,role,group_id,birthday,gender,married,experience,startWorkingTime,education,otp} = req.body;
    
            if ((userName && password && com_id &&
                address && email && phoneTK) !== undefined) {
    
                    //  check email co trong trong database hay khong
                    let user = await functions.getDatafindOne(Users, { email: email , type : 2})
                    let MaxId = await functions.getMaxID(Users) || 0
                    if (user == null) {
                            const user = new Users({
                                _id: Number(MaxId) + 1||1 ,
                                email :email,
                                phoneTK :phoneTK,
                                userName: userName,
                                phone: phone,
                                avatarUser: avatarUser,
                                "inForPerson.employee.position_id":position_id,
                                "inForPerson.employee.com_id":com_id,
                                "inForPerson.employee.dep_id":dep_id,
                                type: 2,
                                password: md5(password),
                                address: address,
                                otp: otp,
                                authentic: null||0,
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
                        await user.save().then(() => functions.success(res,"tạo tài khoản thành công",{user})).catch((e) => {
                            console.log(e);
                        });
                    } else {
                        await functions.setError(res, 'email đã tồn tại', 404);
                    }    
                
            }else {
                await functions.setError(res,'Một trong các trường yêu cầu bị thiếu',404)
         }
}

// hàm gửi otp qua gmail khi kích hoạt tài khoản
exports.sendOTP = async (req,res)=>{
    try{
        let email = req.body.email;
        if(email != undefined){
            let checkEmail = await functions.checkEmail(email);
            if(checkEmail){
                let user = await functions.getDatafindOne(User,{email , type :2})
                if(user) {
                    let otp = functions.randomNumber
                    await Users.updateOne({email:email},{
                        $set:{
                            otp : otp
                        }
                    })
                    await functions.sendEmailVerificationRequest( otp, email, user.userName )
                    const token = await functions.createToken({
                        email : user.email,
                        idQLC : user.idQLC
                    },"30m")
                    return functions.success(res,"Gửi mã OTP thành công",{token})
                }else {
                    return functions.setError(res,"tài khoản không tồn tại")
                }
            }else{
                return functions.setError(res," email không đúng định dạng ",404)
            }
        }else{
            return functions.setError(res,"thiếu dữ liệu gmail",404)
        }
    } catch(e) {
        console.log(e);
        return functions.setError(res , error)
    }
}
// hàm xác nhận otp để kích hoạt tài khoản
exports.verify = async (req,res)=>{
    try{
        let otp = req.body.ma_xt,
            email = req.user.data.email;
        if(otp&&email) {
            let verify = await findOne({email, otp , type : 2});
            if (verify != null){
                await Users.updateOne({email :email}, {
                    $set: {
                        authentic :1 
                    }
                });
                return functions.success(res,"xác thực thành công");
            }else{
                return functions.setError(res,"xác thực thất bại",404);
            }
        }else{
            return functions.setError(res,"thiếu dữ liệu",404);
        }
    }catch(e){
        console.log(e)
        return functions.setError(res, error)
    }
}
//hàm đăng nhập
exports.login = async (req,res)=>{
    try {
        let email = req.body.email
        password = req.body.password
        type = 2
        if (email && password) {
            let checkMail = await functions.checkEmail(email)
            if(checkMail){
                let findUser = await functions.getDatafindOne(Users, { email, type: 2 })
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
        return functions.setError(res, e)
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
            return functions.setError(res, error)
        }
    }
// hàm cập nhập thông tin nhan vien
exports.updateInfoEmployee = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let request = req.body,
            phone = request.phone,
            com_id = request.com_id,
            userName = request.userName,
            address = request.address,
            avatarUser = request.avatarUser,
            dep_id = request.dep_id,
            birthday = request.birthday
            gender = request.gender
            married = request.married
            exp = request.exp
            startWorkingTime = request.startWorkingTime
            education = request.education
            positionID = request.positionID
            group_id = request.group_id


        if (phone || userName || email ||positionID || education || avatarUser || address||avatarUser||dep_id||birthday||gender||married||exp) {
            let checkPhone = await functions.checkPhoneNumber(phone)
            if (checkPhone) {
                await Users.updateOne({ email: email, type: 2 }, {
                    $set: {
                        'userName': userName,
                        'phone': phone,
                        'email': email,
                        'address': address,
                        'com_id':com_id || null,
                        'avatarUser': avatarUser || null,
                        'department': dep_id || null,
                        'group' : group_id || null,
                        'birthday': birthday,
                        'gender': gender,
                        'married': married,
                        'exp': exp,
                        'startWorkingTime': startWorkingTime,
                        'education': education,
                        'positionID': positionID,
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
            avatarUser = req.file;
        if (avatarUser) {
            let checkImg = await functions.checkImage(avatarUser.path)
            if (checkImg) {
                await Users.updateOne({ email: email, type: 2 }, {
                    $set: {
                        avatarUser: avatarUser.filename,
                    }
                });
                return functions.success(res, 'thay đổi ảnh thành công')
            } else {
                await functions.deleteImg(avatarUser)
                return functions.setError(res, 'sai định dạng ảnh hoặc ảnh lớn hơn 2MB', 404)
            }
        } else {
            await functions.deleteImg(avatarUser)
            return functions.setError(res, 'chưa có ảnh', 404)
        }
    } catch (error) {
        console.log(error)
        await functions.deleteImg(req.file)
        return functions.setError(res, error)
    }
}

// hàm bước 1 của quên mật khẩu
exports.forgotPasswordCheckMail = async (req, res, next) => {
    try {
        let email = req.body.email;
        let checkEmail = await functions.checkEmail(email);
        if (checkEmail) {
            let verify = await Users.findOne({ email: email, type: 2 });
            if (verify != null) {
                //tạo otp
                let otp = functions.randomNumber
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
exports.forgotPasswordCheckOTP = async (req, res, next) => {
    try {
        let email = req.user.data.email;
        let otp = req.body.ma_xt;
        if (otp) {
            let verify = await Users.findOne({ email: email, otp: otp, type: 2 });
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
exports.updatePassword = async (req, res, next) => {
    try {
        let email = req.user.data.email,
            password = req.body.password;
        if (password) {
            let checkPass = await functions.getDatafindOne(Users, { idQLC,password : md5(password),type : 2})
            if (!checkPass) {    
                await Users.updateOne({ idQLC: idQLC, type: 2 }, {
                    $set: {
                        password: md5(password)
                    }
                });
                return functions.success(res, 'đổi mật khẩu thành công')
            }else{
                return functions.setError(res,'mật khẩu đã tồn tại')
            }
        }
        return functions.setError(res, 'nhập lại mật khẩu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}