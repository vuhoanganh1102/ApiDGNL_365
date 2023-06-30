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
                    "inForPerson.employee.startWorkingTime": startWorkingTime,
                    "inForPerson.account.education": education,
                })


                await user.save()
                const token = await functions.createToken(user, "1d")
                const refreshToken = await functions.createToken({ userId: user._id }, "1y")
                let data = {
                    access_token: token,
                    refresh_token: refreshToken,
                }
                 functions.success(res, "tạo tài khoản thành công", { user , data  })
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
        let phoneTK = req.user.data.phoneTK;
        console.log(phoneTK)
        console.log(phoneTK)
        let data = []
        if(otp){
                let findUser = await Users.findOne({phoneTK:phoneTK ,type :2})
                if(findUser) {
                    data = await Users.updateOne({phoneTK:phoneTK ,type :2},{
                        $set:{
                            otp : otp
                        }
                    })
                    return functions.success(res,"lưu OTP thành công",{data ,otp})
                }else {
                    return functions.setError(res,"tài khoản không tồn tại")
                }


        }else if (!otp){
            let verify = await Users.findOne({phoneTK:phoneTK,otp ,type :2});
            if (verify != null){
                await Users.updateOne({phoneTK:phoneTK ,type :2},{
                    $set: {
                        authentic :1 
                    }
                });
                return functions.success(res,"xác thực thành công");
            }else{
                return functions.setError(res,"xác thực thất bại",404);
            }
        
        
         }else{
            return functions.setError(res,"thiếu dữ liệu sdt",404)
        }
    } catch(e) {
        console.log(e);
        return functions.setError(res , e.message)
    }
}
exports.verifyCheckOTP = async (req,res)=>{
    try{
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK;
       
        if(otp){
                let findUser = await Users.findOne({phoneTK:phoneTK ,type :2}).select("otp")
                if(findUser) {
                    let data = findUser.otp
                    console.log(data)
                    if(data === otp){
                        functions.success(res,"xác thực thành công")
                    }else{
                        functions.setError(res,"xác thực thất bại")

                    }
                }else {
                    return functions.setError(res,"tài khoản không tồn tại")
                }
        }else{
            return functions.setError(res,"vui lòng nhập mã xác thực")
            
        }
    }catch(e){
        return functions.setError(res,e.message)
        
    }
}


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
                    access_token :  token,
                    access_token_CRM: tokenCRM,
                    refresh_token : refreshToken,
                    user_info: {
                        user_id : findUser._id,
                        user_email :findUser.email,
                        user_phoneTK : findUser.phoneTK,
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
            let idQLC = req.user.data.idQLC
            let password = req.body.password;
            let re_password = req.body.re_password;
            let checkPassword = await functions.verifyPassword(password)
            if (checkPassword) {
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
        let data = [];
        let data1 = [];
        const { userName, email, phoneTK, password, com_id, address, position_id, dep_id, phone, role, group_id, birthday, gender, married, experience, startWorkingTime, education, otp } = req.body;

        let File = req.files || null;
        let avatarUser = null;
        if ((idQLC) !== undefined) {
            let findUser = Users.findOne({ idQLC: idQLC})
            if(findUser){
                if (File.avatarUser) {
                    let upload = functions.uploadFileQLC('avt_ep', idQLC, File.avatarUser, ['.jpeg', '.jpg', '.png']);
                    if (!upload) {
                        return functions.setError(res, 'Định dạng ảnh không hợp lệ', 400)
                    }
                    avatarUser = functions.createLinkFileQLC('avt_ep', idQLC, File.avatarUser.name)
                  
                    data = await Users.updateOne({ idQLC: idQLC }, {
                        $set: {
                            userName: userName,
                            email: email,
                            phoneTK: phoneTK,
                            phone: phone,
                            avatarUser: avatarUser,
                            "inForPerson.employee.position_id": position_id,
                            "inForPerson.employee.com_id": com_id,
                            "inForPerson.employee.dep_id": dep_id,
                            password: md5(password),
                            address: address,
                            otp: otp,
                            authentic: null || 0,
                            fromWeb: "quanlichung.timviec365",
                            avatarUser: avatarUser,
                            updatedAt: new Date(),
                            "inForPerson.employee.group_id": group_id,
                            "inForPerson.account.birthday": birthday,
                            "inForPerson.account.gender": gender,
                            "inForPerson.account.married": married,
                            "inForPerson.account.experience": experience,
                            "inForPerson.employee.startWorkingTime": startWorkingTime,
                            "inForPerson.account.education": education,
                        }
                    })
                    await functions.success(res, 'update avartar user success', { data })

    
                    
                }else{
                     data1 = await Users.updateOne({ idQLC: idQLC }, {
                        $set: {
                            userName: userName,
                            email: email,
                            phoneTK: phoneTK,
                            phone: phone,
                            avatarUser: avatarUser,
                            "inForPerson.employee.position_id": position_id,
                            "inForPerson.employee.com_id": com_id,
                            "inForPerson.employee.dep_id": dep_id,
                            password: md5(password),
                            address: address,
                            otp: otp,
                            authentic: null || 0,
                            fromWeb: "quanlichung.timviec365",
                            avatarUser: avatarUser,
                            updatedAt: new Date(),
                            "inForPerson.employee.group_id": group_id,
                            "inForPerson.account.birthday": birthday,
                            "inForPerson.account.gender": gender,
                            "inForPerson.account.married": married,
                            "inForPerson.account.experience": experience,
                            "inForPerson.employee.startWorkingTime": startWorkingTime,
                            "inForPerson.account.education": education,
                        }
                    })
                    await functions.success(res, 'update 1 user success', { data1 })
                }
            }else{
            functions.setError(res,"không tìm thấy user")

            }
            
        }else{
            functions.setError(res,"không tìm thấy token")
        }
    }catch (error) {
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


// show info
exports.info = async (req,res) =>{
    try{
        const idQLC = req.user.data.idQLC
        if((idQLC)==undefined){
            functions.setError(res,"lack of input")
        }else if(isNaN(idQLC)){
            functions.setError(res,"id must be a Nubmer")
        }else{
            const data = await Users.findOne({idQLC}).select(' userName email phoneTK password com_id address position_id dep_id phone avatarUser role inForPerson.employee.group_id inForPerson.account.birthday inForPerson.account.gender inForPerson.account.married inForPerson.account.experience inForPerson.account.startWorkingTime inForPerson.account.education inForPerson.employee.dep_id inForPerson.employee.position_id ').lean();
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
    }catch (e) {
        functions.setError(res, e.message)
    }
} 