const Users = require('../../models/Users')
const functions = require('../../services/functions')
const md5 = require('md5');
//đăng kí tài khoản nhân viên 
exports.createEmpAcc = async (req,res)=>{
    
        const { userName, email , phoneTK, password, companyId, address } = req.body;
    
            if ((userName && password && companyId &&
                address && email && phoneTK) !== undefined) {
    
                    //  check email co trong trong database hay khong
                    let user = await functions.getDatafindOne(Users, { email: email , type : 2})
                    if (user == null) {
                            const user = await new Users({
                                _id: newMaxID,
                                email,
                                phoneTK,
                                userName: req.body.userName,
                                phone: req.body.phone,
                                avatarUser: req.body.avatarUser,
                                type: 2,
                                password: md5(password),
                                address: req.body.address,
                                otp: req.body.otp,
                                authentic: req.body.authentic,
                                fromWeb: "quanlichung.timviec365",
                                role: 0,
                                avatarUser: null ,
                                idQLC: req.body.idQLC,
                                companyID: req.body.companyID,
                                depID: req.body.depID,
                                groupID: req.body.groupID,
                                birthday: req.body.birthday,
                                gender: req.body.gender,
                                married: req.body.married,
                                exp: req.body.exp,
                                startWorkingTime: req.body.startWorkingTime,
                                candiHocVan: req.body.candiHocVan,
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
                await functions.setError(res,'Một trong các trường yêu cầu bị thiếu',404)
         }
}

exports.loginEmp = async (req,res)=>{
    try{
        if (req.body.email&&req.body.password) {
        const email = req.body.email
        const password = req.body.password
        const type = 2 
            let checkMail = await functions.checkMail(email);
            if(checkMail){
                let findUser = await functions.getDatafindOne(email,{type : 2})
                if (!findUser) {
                    return functions.setError(res,"k timm thay Data can tim")
                }
                
                const checkPass = functions.verifyPassword()
                if(!checkPass ){
                    return functions.setError(res,"tai khoan hoac mat khau khong dung",404)

                }
                const token = await functions.createToken(findUser, "1d");
                const refreshToken = await functions.createToken({userId : findUser._id}, "1y")
                let data = {
                    access_token : token,
                    refresh_token : refreshToken,
                    user_info: {
                        user_id : findUser._id,
                        user_email :findUser.email,
                        user_phoneTK : findUser.phoneTK,
                        user_password :findUser.md5(password),
                        user_name : findUser.userName,
                        user_address : findUser.address,
                        user_authentic : findUser.authentic,
                        user_avatar : findUser.avatarUser,
                        user_companyID: findUser.companyID,
                        user_depID: findUser.depID,
                        user_groupID : findUser.groupID,
                        user_birthday : findUser.birthday,
                        user_gender : findUser.gender,
                        user_married : findUser.married,
                        user_exp : findUser.exp,
                        user_startWorkingTime: findUser.startWorkingTime,
                        user_candiHocVan : findUser.candiHocVan,
                        
                    }

                }
                return functions.success(res,"dang nhap thanh cong",data)
            }else{
                await functions.setError(res,"mail khong ton tai ")
            }
        }else{
            await functions.setError(res,"thieu email hoac password")
        }
    }catch(e){
        console.log(e);
        return functions.setError(res, error)
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
                    let otp = await functions.randomNumber
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
    // hàm đổi mật khẩu 
    exports.updatePassword = async(req, res, next) => {
        try {
            let id = req.body.idQLC;
            let password = req.body.password;
            if (id) {
                let admin = await functions.getDatafindOne(Users, { idQLC: idQLC,type : 2})
                if (admin) {
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
            companyID = request.companyID,
            userName = request.userName,
            address = request.address,
            avatarUser = request.avatarUser,
            depID = request.depID,
            birthday = request.birthday
            gender = request.gender
            married = request.married
            exp = request.exp
            startWorkingTime = request.startWorkingTime
            candiHocVan = request.candiHocVan
            positionID = request.positionID
            groupID = request.groupID



              = request.groupID
        if (phone || userName || email ||positionID || candiHocVan || avatarUser || address||avatarUser||depID||birthday||gender||married||exp) {
            let checkPhone = await functions.checkPhoneNumber(phone)
            if (checkPhone) {
                await Users.updateOne({ email: email, type: 2 }, {
                    $set: {
                        'userName': userName,
                        'phone': phone,
                        'email': email,
                        'address': address,
                        'companyID':companyID || null,
                        'avatarUser': avatarUser || null,
                        'department': depID || null,
                        'group' : groupID || null,
                        'birthday': birthday,
                        'gender': gender,
                        'married': married,
                        'exp': exp,
                        'startWorkingTime': startWorkingTime,
                        'candiHocVan': candiHocVan,
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
                await Users.updateOne({ email: email, type: 1 }, {
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