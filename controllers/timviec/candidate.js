const Users = require('../../models/Timviec365/Timviec/Users');
const userUnset = require('../../models/Timviec365/Timviec/userUnset');
const md5 = require('md5');
var jwt = require('jsonwebtoken');
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
            let CheckEmail=await functions.CheckEmail(email)
            let CheckPhoneNumber=await functions.CheckPhoneNumber(phoneTk);
            
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
                        //check UV lỗi hay UV chưa hoàn thiện hồ sơ để cập nhật trường error
                            let findUserUv = await functions.findOne(userUnset,{usePhoneTk:phoneTk})
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
                                    error : 0
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
                                    empId: 0,
                                    error: 0,
                                })
                                let saveUserUV = UserUV.save()
                            }
                        const token = await functions.encodeToken(req.body)
                        res.json(await functions.success("Them moi hoặc cập nhật UV chua hoan thanh ho so thanh cong",token))
                    } else return res.status(200).json(await functions.setError(200, "Email không hợp lệ"));
                }
            }else return res.status(200).json(await functions.setError(200, "Số điện thoại không hợp lệ"));
        }
      }
      catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí B1", e);
        res.status(200).json(await functions.setError(200, "Đã có lỗi xảy ra"));
      }
    
}

exports.RegisterB2VideoUpload = async(req,res,next) =>{
    try {
        if(req && req.body && req.body.token && req.file){
            const token = req.body.token
            const videoUpload = req.file
            const videoLink = req.body.videoLink
            const userInfo = functions.decodeToken(token)
            console.log(userInfo)
            let findUser = await functions.getDatafindOne(Users,{phoneTK:userInfo.phoneTK})
            if(findUser){// check tồn tại tài khoản chưa
                return res.status(200).json(functions.setError(200, "Số điện thoại này đã được đăng kí"));
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
                        phoneTK: userInfo.phoneTk,
                        password:userInfo.password,
                        userName:userInfo.userName,
                        email:userInfo.email,
                        city:userInfo.city,
                        district:userInfo.district,
                        address:userInfo.address,
                        from:userInfo.from,
                        idTimViec365:newIDTimviec,
                        authentic:0,
                        createdAt: new Date(Date.now()),
                        inForCandidateTV365:{
                            candiCateID:userInfo.candiCateID,
                            candiCityID:userInfo.candiCityID,
                            candiMucTieu:userInfo.candiMucTieu,
                            video:videoUpload.filename
                        }
                    })
                    let saveUser = User.save()
                    console.log(saveUser)
                }
                if(videoLink && !videoUpload){ //check video upload là link
                    
                    let User = new Users({
                        _id:newID,
                        phoneTK: userInfo.phoneTk,
                        password:userInfo.password,
                        userName:userInfo.userName,
                        email:userInfo.email,
                        city:userInfo.city,
                        district:userInfo.district,
                        address:userInfo.address,
                        from:userInfo.from,
                        idTimViec365:newIDTimviec,
                        authentic:0,
                        createdAt: new Date(Date.now()),
                        inForCandidateTV365:{
                            candiCateID:userInfo.candiCateID,
                            candiCityID:userInfo.candiCityID,
                            candiMucTieu:userInfo.candiMucTieu,
                            video:videoLink
                        }
                    })
                    let saveUser = User.save()
                }
                let deleteUser = userUnset.findOneAndDelete({usePhoneTk:userInfo.phoneTK})
                res.json(await functions.success("Đăng kí thành công"))
            }
        }else  res.status(200).json(await functions.setError(200, "Thông tin truyền lên không đầy đủ"));
      }
      catch (e) {
        console.log("Đã có lỗi xảy ra khi đăng kí", e);
        return false;
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
