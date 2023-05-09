const Users = require('../../models/Timviec365/Timviec/Users');
const userUnset = require('../../models/Timviec365/Timviec/userUnset');
//mã hóa mật khẩu
const md5 = require('md5');
//token
var jwt = require('jsonwebtoken');
const axios = require('axios');
const functions=require('../../services/functions');
const { token } = require('morgan');


exports.index = (req, res, next) => {
    res.json('123 123123123') 
}

exports.RegisterB1 = async(req,res,next) =>{
    try {
        if(req.body.phoneTK ){
            const phoneTk = req.body.phoneTK
            const password = md5(req.body.password)
            const userName = req.body.userName
            const email = req.body.email
            const city = req.body.city
            const district = req.body.district
            const address = req.body.address
            const candiCateID = req.body.candiCateID
            const candiCityID = req.body.candiCityID
            const candiMucTieu = req.body.candiMucTieu
            const uRegis = req.body.uRegis
            
            // check số điện thoại đã đăng kí trong bảng user
            let CheckEmail=await functions.checkEmail(email)
            let CheckPhoneNumber=await functions.checkPhoneNumber(phoneTk);
            
            if(CheckPhoneNumber){ //check định dạng sdt
                let checkUser = await functions.getDatafindOne(Users,{phoneTk})
                
                if(checkUser){ // check trùng số điện thoại trong user
                    return res.status(200).json(setError(200, "Số điện thoại đã được đăng kí"));
                }else{
                    if(!email || CheckEmail){// check định dạng email
                        // const newID
                        const maxID = await userUnset.findOne({},{_id:1}).sort({ _id: -1 }).limit(1).lean();
                        if(maxID){
                          newID=Number(maxID._id)+1;
                        }
                        else newID = 1 
                            let findUserUv = await functions.getDatafindOne(userUnset,{usePhoneTk:phoneTk})
                            if(findUserUv){
                                let updateUserUv = await functions.getDatafindOneAndUpdate(userUnset,{usePhoneTk:phoneTk},{
                                    usePass:password,
                                    useFirstName:userName,
                                    useMail:email,
                                    useCity:city,
                                    useQh:district,
                                    useAddr:address,
                                    uRegis:uRegis,
                                    useCvCate:candiCateID,
                                    useCvCity:candiCityID,
                                    useCvTitle:candiMucTieu})
                                    
                            }else{
                                let UserUV = new userUnset({
                                    _id:newID,
                                    usePhoneTk: phoneTk,
                                    usePass:password,
                                    useFirstName:userName,
                                    useMail:email,
                                    useCity:city,
                                    useQh:district,
                                    useAddr:address,
                                    uRegis:uRegis,
                                    useCvCate:candiCateID,
                                    useCvCity:candiCityID,
                                    useCvTitle:candiMucTieu,
                                    usePhone:"",
                                    useCreateTime: new Date(Date.now()),
                                    useLink: "",
                                    useActive: 0,
                                    useDelete: 0,
                                    type: 0,
                                
                                    
                                })
                                let saveUserUV = UserUV.save()
                            }
                         
                        const token = await functions.createToken(req.body,"2d")
                        
                        return  functions.success(res,'Them moi hoặc cập nhật UV chua hoan thanh ho so thanh cong',token)
                    } else return  functions.setError(res, "Email không hợp lệ",200);
                }
            }else return functions.setError(res, "Số điện thoại không hợp lệ",200);
        }
      }
      catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí B1", e);
        return functions.setError(res, "Đã có lỗi xảy ra",400);
      }
    
}

exports.RegisterB2VideoUpload = async(req,res,next) =>{
    try { 
        if(req && req.body && req.body.token && req.file){
            const token = req.body.token
            const videoUpload = req.file
            const videoLink = req.body.videoLink
            const userInfo = await functions.decodeToken(token,"2d")
            const phoneTK = userInfo.data.phoneTK
            const password = userInfo.data.password
            const userName = userInfo.data.userName
            const email = userInfo.data.email
            const city = userInfo.data.city
            const district = userInfo.data.district
            const address = userInfo.data.address
            const from = userInfo.data.uRegis
            const candiCateID = userInfo.data.candiCateID
            const candiCityID = userInfo.data.candiCityID
            const candiMucTieu = userInfo.data.candiMucTieu
        
            let findUser = await functions.getDatafindOne(Users,{phoneTK:phoneTK})
            if(findUser && findUser.phoneTK && findUser.phoneTK == phoneTK){// check tồn tại tài khoản chưa
                return functions.setError(res, "Số điện thoại này đã được đăng kí",200);
            }else{
                const maxID = await Users.findOne({},{_id:1}).sort({ _id: -1 }).limit(1).lean();
                if(maxID){
                  newID=Number(maxID._id)+1;
                }
                const maxIDTimviec = await Users.findOne({type:0},{idTimViec365:1}).sort({ idTimViec365: -1 }).lean();
                if(maxIDTimviec){
                  newIDTimviec=Number(maxIDTimviec.idTimViec365)+1;
                }
                if(videoUpload && !videoLink){ // check video tải lên là file video
                    let User = new Users({
                        _id:newID,
                        phoneTK: phoneTK,
                        password:password,
                        userName:userName,
                        type:0,
                        email:email,
                        city:city,
                        district:district,
                        address:address,
                        from:from,
                        idTimViec365:newIDTimviec,
                        authentic:0,
                        createdAt: new Date(Date.now()),
                        inForCandidateTV365:{
                            user_id:0,
                            candiCateID:candiCateID,
                            candiCityID:candiCityID,
                            candiMucTieu:candiMucTieu,
                            video:videoUpload.filename,
                            videoType:1,
                            videoActive:1
                        }
                    })
                    let saveUser = User.save()
                }
                if(videoLink && !videoUpload){ //check video upload là link
                    
                    let User = new Users({
                        _id:newID,
                        phoneTK: phoneTK,
                        password:password,
                        userName:userName,
                        type: 0,
                        email:email,
                        city:city,
                        district:district,
                        address:address,
                        from:from,
                        idTimViec365:newIDTimviec,
                        authentic:0,
                        createdAt: new Date(Date.now()),
                        inForCandidateTV365:{
                            user_id:0,
                            candiCateID:candiCateID,
                            candiCityID:candiCityID,
                            candiMucTieu:candiMucTieu,
                            video:videoLink,
                            videoType:2,
                            videoActive:1
                        }
                    })
                    let saveUser = User.save()
                }
                let deleteUser = userUnset.findOneAndDelete({usePhoneTk:phoneTK})
               return functions.success(res,"Đăng kí thành công")
            }
        }else  return functions.setError(res, "Thông tin truyền lên không đầy đủ",200);
      }
      catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
       return functions.setError(res, "Đã có lỗi xảy ra",200)
      }
    
    
}

exports.login = async (req,res,next) =>{

    // tai khoan -> email ? phone
    // email: email: account, password: pass, type
    // phone: phoneTK: account, password: pass, type
    const type = 0;

    if(req.body.account && req.body.password){
        const account = req.body.account
        const password = req.body.password
        var CheckPhoneNumber
        var checkAccount

        if(await functions.CheckPhoneNumber(account)){
            CheckPhoneNumber =  await functions.getDatafindOne(Users,{phoneTK:account})
            console.log('tai khoan la so dien thoai')
            checkAccount = CheckPhoneNumber.phoneTK
        }
        if(await functions.CheckEmail(account)){
            CheckPhoneNumber =  await functions.getDatafindOne(Users,{email:account})
            console.log('tai khoan la email')

            checkAccount = CheckPhoneNumber.email
        }    

        console.log(CheckPhoneNumber.userName)

        let checkPassword = CheckPhoneNumber.password
        let checkType = CheckPhoneNumber.type

        if(account === checkAccount && await functions.verifyPassword(password,checkPassword) === true && checkType === type){
            let payload = {
                username: CheckPhoneNumber.userName ,
                type : checkType
            }
            
            const secret_key = 'HHP1234568'

            const token = jwt.sign(payload,secret_key)

            res.json(await functions.success('Dang nhap thanh cong',token))
        }else{
            console.log(await functions.createError(200, "Sai tai khoan hoac mat khau"))
            return res.status(200).json(await functions.createError(200, "Sai tai khoan hoac mat khau"));
        }
    }
}

exports.RegisterB2CvUpload = async(req,res,next) =>{
    try { 
        
        if(req && req.body && req.body.token && req.files){
            
            const token = req.body.token
            const birthday = req.body.birthday
            const candiExp = req.body.candiExp
            const candiHocVan = req.body.candiHocVan
            const candiSchool = req.body.candiSchool
            const fileUpload = req.files
            const videoLink = req.body.videoLink
            const userInfo = await functions.decodeToken(token,"2d")
            const phoneTK = userInfo.data.phoneTK
            const password = userInfo.data.password
            const userName = userInfo.data.userName
            const email = userInfo.data.email
            const city = userInfo.data.city
            const district = userInfo.data.district
            const address = userInfo.data.address
            const from = userInfo.data.uRegis
            const candiCateID = userInfo.data.candiCateID
            const candiCityID = userInfo.data.candiCityID
            const candiMucTieu = userInfo.data.candiMucTieu
            let cvUpload, videoUpload
            for(let i=0;i<fileUpload.length;i++){
                if(!fileUpload[i].fieldname == "cvUpload"){
                    return functions.setError(req, "không tải Cv",200)
                }
                if(fileUpload[i].fieldname == "cvUpload"){
                    cvUpload = fileUpload[i]
                }
                if(fileUpload[i].fieldname == "videoUpload"){
                    videoUpload = fileUpload[i]
                    if(videoUpload.size > (100 * 1024 * 1024)){
                        return functions.setError(req, "dung lượng file vượt quá 100 MB",200)
                    }
                }
            }
           
            let findUser = await functions.getDatafindOne(Users,{phoneTK:phoneTK})
            if(findUser && findUser.phoneTK && findUser.phoneTK == phoneTK){// check tồn tại tài khoản chưa
                return functions.setError(res, "Số điện thoại này đã được đăng kí",200);
            }else{
                const maxID = await Users.findOne({},{_id:1}).sort({ _id: -1 }).limit(1).lean();
                if(maxID){
                  newID=Number(maxID._id)+1;
                }
                const maxIDTimviec = await Users.findOne({type:0},{idTimViec365:1}).sort({ idTimViec365: -1 }).lean();
                if(maxIDTimviec){
                  newIDTimviec=Number(maxIDTimviec.idTimViec365)+1;
                }
                if(videoUpload && !videoLink){ // check video tải lên là file video
                    console.log(1)
                    let User = new Users({
                        _id:newID,
                        phoneTK: phoneTK,
                        password:password,
                        userName:userName,
                        type:0,
                        email:email,
                        city:city,
                        district:district,
                        address:address,
                        from:from,
                        idTimViec365:newIDTimviec,
                        authentic:0,
                        createdAt: new Date(Date.now()),
                        birthday:birthday,
                        inForCandidateTV365:{
                            user_id:0,
                            candiCateID:candiCateID,
                            candiCityID:candiCityID,
                            candiMucTieu:candiMucTieu,
                            candiExp:candiExp,
                            candiHocVan:candiHocVan,
                            candiSchool:candiSchool,
                            video:videoUpload.filename,
                            videoType:1,
                            videoActive:1
                        }
                    })
                    let saveUser = User.save()
                }
                if(videoLink && !videoUpload){ //check video upload là link
                    
                    let User = new Users({
                        _id:newID,
                        phoneTK: phoneTK,
                        password:password,
                        userName:userName,
                        type: 0,
                        email:email,
                        city:city,
                        district:district,
                        address:address,
                        from:from,
                        idTimViec365:newIDTimviec,
                        authentic:0,
                        createdAt: new Date(Date.now()),
                        birthday:birthday,
                        inForCandidateTV365:{
                            user_id:0,
                            candiCateID:candiCateID,
                            candiCityID:candiCityID,
                            candiMucTieu:candiMucTieu,
                            candiExp:candiExp,
                            candiHocVan:candiHocVan,
                            candiSchool:candiSchool,
                            video:videoLink,
                            videoType:2,
                            videoActive:1
                        }
                    })
                    let saveUser = User.save()
                }
                let deleteUser = userUnset.findOneAndDelete({usePhoneTk:phoneTK})
               return functions.success(res,"Đăng kí thành công")
            }
        }else  return functions.setError(res, "Thông tin truyền lên không đầy đủ",200);
      }
      catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
       return functions.setError(res, "Đã có lỗi xảy ra",200)
      }
    
    
}

exports.AddUserChat365 = async(req,res,next) =>{
    try {
        // for(let i=0;i<325900;i=i+100){
            let takeData = await axios({
                method: "post",
                url: "http://43.239.223.142:9006/api/users/TakeDataUser",
                data: {
                  count: 0
                },
                headers: { "Content-Type": "multipart/form-data" }
              });
              for(let j=0;j<takeData.data.data.length;j++){
                let CheckEmail=await functions.CheckEmail(takeData.data.data.email)
                let CheckPhoneNumber=await functions.CheckPhoneNumber(takeData.data.data.email)
                let checkUser = await functions.getDatafindOne(Users,{phoneTK:takeData.data.data.email, type:takeData.data.data.email})
                if(!checkUser && CheckPhoneNumber){
                    let user = new Users({
                        _id: takeData.data.data._id,
                        idQLC: takeData.data.data.id365,
                        type: takeData.data.data.type365,
                        phoneTK: takeData.data.data.email,
                        password: takeData.data.data.password,
                        userName: takeData.data.data.userName,
                        avatarUser: takeData.data.data.avatarUser,
                        lastActivedAt: takeData.data.data.lastActive,
                        isOnline: takeData.data.data.isOnline,
                        idTimViec365: takeData.data.data.idTimviec,
                        from: takeData.data.data.fromWeb,
                        chat365_secret: takeData.data.data.secretCode,
                        latitude: takeData.data.data.latitude,
                        longitude: takeData.data.data.longitude,
                    })
                }
                if(!checkUser && CheckEmail){
                    let user = new Users({
                        _id: takeData.data.data._id,
                        idQLC: takeData.data.data.id365,
                        type: takeData.data.data.type365,
                        email: takeData.data.data.email,
                        password: takeData.data.data.password,
                        userName: takeData.data.data.userName,
                        avatarUser: takeData.data.data.avatarUser,
                        lastActivedAt: takeData.data.data.lastActive,
                        isOnline: takeData.data.data.isOnline,
                        idTimViec365: takeData.data.data.idTimviec,
                        from: takeData.data.data.fromWeb,
                        chat365_secret: takeData.data.data.secretCode,
                        latitude: takeData.data.data.latitude,
                        longitude: takeData.data.data.longitude,
                    })
                }
              }
        // }
        res.json(await functions.success("Add dữ liệu thành công"))

      }
      catch (e) {
        console.log("add sữu liệu lỗi", e);
        functions.setError(res,'Add sữu liệu lỗi',404)
      }
    
}
