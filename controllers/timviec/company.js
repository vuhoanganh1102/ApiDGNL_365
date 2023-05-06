const md5= require('md5')
const multer=require('multer')
const jwt = require('jsonwebtoken')

const Users=require('../../models/Timviec365/Timviec/Users')
const functions=require('../../services/functions')
const CompanyUnset=require('../../models/Timviec365/Timviec/userCompanyUnset')

exports.index = (req, res, next) => {
    res.json('123 123123123') 
}

exports.register = async(req,res,next)=>{
    try{
        let request= req.body,
        email=request.email,
        phone=request.phone,
        username=request.userName,
        password=request.password,
        city=request.city,
        district=request.district,
        address=request.address,
        mst=request.mst,
        avatarUser=req.file.filename,
        idKd=request.idKD,
        linkVideo=request.linkVideo,
        videoType=request.videoType,
        description=request.description;
        let pathAvatarUSer=req.file.path
       // check du lieu khong bi undefined
       if ((username && password && city && district &&
            address && email && idKd && mst && avatarUser && phone )!==undefined){
               // validate email,phone
                   let CheckEmail=await functions.CheckEmail(email),
                       CheckPhoneNumber=await functions.CheckPhoneNumber(phone);
                       if((CheckPhoneNumber && CheckEmail )==true){
                       //  check email co trong trong database hay khong
                       let user =await functions.getDatafindOne(Users,{email})
                       console.log(user)
                               if(user==null){
                                // check anh 
                                   let checkImg=await functions.checkImage(pathAvatarUSer) 
                                   if(checkImg==true ){
                                     // tim ID max trong DB
                                   let maxID=await functions.getMaxID(Users);
                                   const company = new Users({
                                       _id:(Number(maxID)+1),
                                       email: email,
                                       password: md5(password),
                                       phone:phone,
                                       userName:username,
                                       type: 1,
                                       city:city,
                                       district:district,
                                       address:address,
                                       avatarUser:avatarUser,
                                       inForCompanyTV365:{
                                           userID:(Number(maxID)+1),
                                           idKD:idKd,
                                           mst:mst,
                                           videoType:videoType || null,
                                           linkVideo:linkVideo || null,
                                           description:description || null,
                                       }
                                     });
                                     await company.save();   
                                     let companyUnset= await functions.getDatafindOne(CompanyUnset,{email})
                                     if(companyUnset!=null){
                                       await functions.getDataDeleteOne(CompanyUnset,{email})
                                     }   
                                   return res.status(200).json(await functions.success('Dang ky thanh cong'))
                                }
                                   else {
                                    return res.status(404).json(await functions.setError(404,'anh >2mb hoac khong dung dinh dang'));
                                }
                                  
                               }
                               else {
                                   return res.status(404).json(await functions.setError(404,'email da ton tai'));
                               }
                       }
                       else{
                           return res.status(404).json(await functions.setError(404,'email hoac so dien thoai khong dung dinh dang'));
                       }
               
       }else{
          
           return res.status(404).json(await functions.setError(404,'Khong du du lieu'));
       }
    }catch (error){
        console.log(error)
        return res.status(404).json({messege:error})
    }
  
}
exports.registerFall = async(req,res,next) => {
    try{
        let request= req.body,
        email=request.email,
        phone=request.phone,
        nameCompany=request.nameCompany,
        password=request.password,
        city=request.city,
        district=request.district,
        address=request.address,
        regis=request.regis;
        let maxID=await functions.getMaxID(CompanyUnset) || 1;
        if(email!=undefined){
           let checkEmail=functions.CheckEmail(email)
           let CheckPhoneNumber=functions.CheckPhoneNumber(phone)
           if((checkEmail && CheckPhoneNumber)==true){
               let company =await functions.getDatafindOne(CompanyUnset,{email})
               if(company==null){
                   const companyUnset = new CompanyUnset({
                       _id:(Number(maxID)+1),
                       email: email ,
                       password: md5(password) | null,
                       nameCompany:nameCompany | null,
                       type: 1,
                       phone:phone,
                       city:city | null,
                       district:district | null,
                       address:address || null,
                       avatarUser:avatarUser || null,
                       errTime: new Date().getTime(),
                       regis:regis || null
                   
                     });
                     await companyUnset.save();
                     return res.status(200).json(await functions.success('thanh cong'))
               } 
               else {
                   return res.status(404).json(await functions.setError(404,'email da ton tai'));
               }
           }
           else{
               return res.status(404).json(await functions.setError(404,'email hoac so dien thoai khong dung dinh dang'));
           }
        }else{
           return res.status(404).json( await functions.setError(404,'Thieu du lieu gmail'));
       }
    }catch(error){
        return res.status(404).json({error})
    }
   
}


exports.login = async(req,res) => {
    const type = 1;

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
