const Users = require("../../models/Users")
const functions = require("../../services/functions")
const md5 = require("md5")

//đăng kí tài khoản cá nhân 
exports.register = async (req, res) => {
    try {
        const { userName, email, password, phoneTK, address, com_id, dep_id ,birthday,phone,
            gender,
            married,
            experience,
            education,} = req.body

        if (userName && password && phoneTK && address) {
            // let checkMail = await functions.checkEmail(email)
            console.log(phoneTK)
            let checkPhone = await functions.checkPhoneNumber(phoneTK);
            if (checkPhone) {
                let user = await Users.findOne({ phoneTK: phoneTK, type: 0 })
                console.log(user)
                let MaxId = await functions.getMaxID(Users) || 0
                if (user == null) {
                    const Inuser = new Users({
                        _id: Number(MaxId) + 1 || 1,
                        email: email,
                        userName: userName,
                        phoneTK: phoneTK,
                        phone: phone || phoneTK,
                        password: md5(password),
                        address: address,
                        type: 0,
                        role: 0,
                        otp: null,
                        authentic: 0,
                        idQLC: (Number(MaxId) + 1),
                        "inForPerson.employee.com_id": com_id,
                        "inForPerson.employee.dep_id": dep_id,
                        "inForPerson.account.birthday" : birthday,
                        "inForPerson.account.gender" : gender,
                        "inForPerson.account.married" : married,
                        "inForPerson.account.experience" : experience,
                        "inForPerson.account.education" : education,
                    })
                    
                    await Inuser.save()
                    const token = await functions.createToken(Inuser, "1d")
                    const refreshToken = await functions.createToken({ userId: Inuser._id }, "1y")
                    let data = {
                        access_token:  token,
                        refresh_token: refreshToken,
                    }
                    await functions.success(res, "tạo tài khoản thành công", { Inuser,data })



                } else {
                    await functions.setError(res, " sdt đã tồn tại")
                }
            } else {
                functions.setError(res, "định dạng sdt không đúng ")
            }
        } else {
            functions.setError(res, "thiếu thông tin để đăng kí ")

        }
    } catch (e) {
        functions.setError(res, e.message)

    }

}
// hàm xác thực otp bước 1: gửi OTP qua phone khi kích hoạt tài khoản
// exports.verify = async (req,res)=>{
//     try{
//         let otp = req.body.ma_xt || null
//         let phoneTK = req.user.data.phoneTK;
//         console.log(phoneTK)
//         console.log(phoneTK)
//         let data = []
//         if(!otp){
//                 let findUser = await Users.findOne({phoneTK:phoneTK ,type :0})
//                 if(findUser) {
//                     let otp = functions.randomNumber
//                     data = await Users.updateOne({phoneTK:phoneTK ,type :0},{
//                         $set:{
//                             otp : otp
//                         }
//                     })
//                     return functions.success(res,"Gửi mã OTP thành công",{data ,otp})
//                 }else {
//                     return functions.setError(res,"tài khoản không tồn tại")
//                 }


//         }else if (otp){
//             let verify = await Users.findOne({phoneTK:phoneTK,otp ,type :0});
//             if (verify != null){
//                 await Users.updateOne({phoneTK:phoneTK ,type :0},{
//                     $set: {
//                         authentic :1 
//                     }
//                 });
//                 return functions.success(res,"xác thực thành công");
//             }else{
//                 return functions.setError(res,"xác thực thất bại",404);
//             }
        
        
//          }else{
//             return functions.setError(res,"thiếu dữ liệu sdt",404)
//         }
//     } catch(e) {
//         console.log(e);
//         return functions.setError(res , e.message)
//     }
// }
exports.verify = async (req,res)=>{
    try{
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK;
        console.log(phoneTK)
        let data = []
        if(otp){
            let findUser = await Users.findOne({phoneTK:phoneTK ,type :0})
            if(findUser) {
                data = await Users.updateOne({phoneTK:phoneTK ,type :0},{
                    $set:{
                        otp : otp
                    }
                })
                return functions.success(res,"lưu OTP thành công",{data ,otp})
            }else {
                return functions.setError(res,"tài khoản không tồn tại")
            }
            
            
        }else if(!otp){
            let verify = await Users.findOne({phoneTK:phoneTK ,type :0});
            if (verify){
                await Users.updateOne({phoneTK:phoneTK ,type :0},{
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
                let findUser = await Users.findOne({phoneTK:phoneTK ,type :0}).select("otp")
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

exports.login = async (req, res) => {

    try {
        let email = req.body.email
        let phoneTK = req.body.phoneTK
            password = req.body.password
            type = 0
            
            if ((email||phoneTK) && password) {

            let checkMail = await functions.checkEmail(email)
            let checkPhone = await functions.checkPhoneNumber(phoneTK)
            if(checkMail || checkPhone){
                let findUser = await Users.findOne({$or:[ { email:email, type: 0 },{phoneTK : phoneTK ,type :0}]})
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
                            // user_password: findUser.password,
                            // user_name: findUser.userName,
                            // user_address: findUser.address,
                            // user_authentic: findUser.authentic,
                            // user_avatar: findUser.avatarUser,
                            // user_com_id: findUser.com_id,
                            // user_dep_id: findUser.dep_id,
                            // user_groupID: findUser.groupID,
                            // user_birthday: findUser.birthday,
                            // user_gender: findUser.gender,
                            // user_married: findUser.married,
                            // user_exp: findUser.exp,
                            // user_startWorkingTime: findUser.startWorkingTime,
                            // user_candiHocVan: findUser.candiHocVan,

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
            if(!password || !re_password){
                return functions.setError(res, 'điền thiếu thông tin', 400)
            }
            if(password.length < 6){
                return functions.setError(res, 'Password quá ngắn', 400)
            }
            if(password !== re_password)
            {
                return functions.setError(res, 'Password nhập lại không trùng khớp', 400)
            }
            if(old_password){
                let checkOldPassword = await Users.findOne({idQLC : idQLC ,password : md5(old_password), type :2})
                if(!checkOldPassword){
                    functions.setError(res, 'Mật khẩu cũ không đúng, vui lòng kiểm tra lại', 400)
                }else{
                    let checkPass = await functions.getDatafindOne(Users, { idQLC, password: md5(password), type: 2 })
                    if (!checkPass) {
                        await Users.updateOne({ idQLC: idQLC, type :2 }, {
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
     if (phoneTK&&password&&password){
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
            let checkPass = await functions.getDatafindOne(Users, { phoneTK, password: md5(password), type: 0 })
            if (!checkPass) {
                await Users.updateOne({ phoneTK: phoneTK , type : 0}, {
                    $set: {
                        password: md5(password),
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ', 404)
    }else if(email&&password&&password){
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
            let checkPass = await functions.getDatafindOne(Users, { email, password: md5(password), type: 0 })
            if (!checkPass) {
                await Users.updateOne({ email: email,type : 0 }, {
                    $set: {
                        password: md5(password),
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ', 404)

        }else{
            return functions.setError(res, ' điền thiếu trường ', 404)
        }
        
        } catch (error) {
        console.log(error)
        return functions.setError(res, error.message)
    }
}
// hàm cập nhập thông tin cá nhân
exports.updateInfoindividual = async (req, res, next) => {
        try {
            let idQLC = req.user.data.idQLC;
            let data = [];
            let data1 = [];
            const { userName, email, phoneTK, com_id, address, position_id, dep_id, phone, group_id, birthday, gender, married, experience, startWorkingTime, education, otp } = req.body;
    
            let File = req.files || null;
            let avatarUser = null;
            if ((idQLC) !== undefined) {
                let findUser = Users.findOne({ idQLC: idQLC})
                if(findUser){
                    if (File.avatarUser) {
                        let upload = functions.uploadFileQLC('avt_individual', idQLC, File.avatarUser, ['.jpeg', '.jpg', '.png']);
                        if (!upload) {
                            return functions.setError(res, 'Định dạng ảnh không hợp lệ', 400)
                        }
                        avatarUser = functions.createLinkFileQLC('avt_individual', idQLC, File.avatarUser.name)
                      
                        data = await Users.updateOne({ idQLC: idQLC }, {
                            $set: {
                                userName: userName,
                                email: email,
                                phoneTK: phoneTK,
                                phone: phone,
                                avatarUser: avatarUser,
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
                let findUser = await Users.findOne({$or:[ { email:email, type: 0 },{phoneTK:phoneTK ,type :0}]})
                if(findUser) {
                    let otp = functions.randomNumber
                    data = await Users.updateOne({$or:[ { email:email, type: 0 },{phoneTK:phoneTK ,type :0}]},{
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
            let verify = await Users.findOne({$or:[ { email:email,otp, type: 0 },{phoneTK:phoneTK,otp ,type :0}]});
            if (verify != null){
                await Users.updateOne({$or:[ { email:email, type: 0 },{phoneTK:phoneTK ,type :0}]},{
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
                    await Users.updateOne({$or:[ { email:email,authentic:1, type: 0 },{phoneTK:phoneTK,authentic:1 ,type :0}]},{
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

exports.info = async (req,res) =>{
    try{
        const idQLC = req.user.data.idQLC
        // const com_id = req.user.data.com_id
        if((idQLC)==undefined){
            functions.setError(res," không tìm thấy thông tin từ token ")
        }else if(isNaN(idQLC)){
            functions.setError(res,"id phải là số")
        }else{
            // const data = await Users.findOne({idQLC}).select(' userName email phoneTK password inForPerson.employee.com_id address inForPerson.employee.position_id inForPerson.employee.dep_id phone avatarUser role inForPerson.employee.group_id inForPerson.account.birthday inForPerson.account.gender inForPerson.account.married inForPerson.account.experience inForPerson.account.startWorkingTime inForPerson.account.education inForPerson.employee.dep_id inForPerson.employee.position_id ').lean();

            const data = await Users.findOne({idQLC: idQLC , type :0 }).select('userName email phone phoneTK address avatarUser authentic inForPerson.account.birthday inForPerson.account.gender inForPerson.account.married inForPerson.account.experience inForPerson.account.education').lean()
            console.log(data)
            
            const birthday = data.inForPerson.account.birthday
            const gender = data.inForPerson.account.gender
            const married = data.inForPerson.account.married
            const experience = data.inForPerson.account.experience
            const education = data.inForPerson.account.education

        //     if((data2&&data) == undefined){
        //     return functions.setError(res, 'Không có dữ liệu ', 404);
            
        // }
        data.birthday = birthday
        data.gender = gender
        data.married = married
        data.experience = experience
        data.education = education
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
    }catch (e) {
        functions.setError(res, e.message)
    }
} 