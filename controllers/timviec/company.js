const md5= require('md5')
const axios= require('axios')

const Users=require('../../models/Timviec365/Timviec/Users')
const functions=require('../../services/functions')
const CompanyUnset=require('../../models/Timviec365/Timviec/userCompanyUnset')
const { response } = require('express')

// bị lỗi khi uploadImg và uploadVideo cùng chạy
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
        avatarUser=req.file,
        idKd=request.idKD,
        linkVideo=request.linkVideo,
        videoType=request.videoType,
        description=request.description,
        from=request.from;
       // check dữ liệu không bị undefined
       if ((username && password && city && district &&
            address && email && phone )!==undefined){
               // validate email,phone
                   let CheckEmail=await functions.CheckEmail(email),
                       CheckPhoneNumber=await functions.CheckPhoneNumber(phone);
                       if((CheckPhoneNumber && CheckEmail )==true){
                       //  check email co trong trong database hay khong
                       let user =await functions.getDatafindOne(Users,{email})
                               if(user==null){
                                // check ảnh 
                                // let avatar=""
                                // if(avatarUser){
                                //     let checkImg=await functions.checkImage(avatarUser.path) 
                                //     if(checkImg==true ){
                                //       avatar =avatarUser.filename
                                //  }
                                // }
                                     // tìm Id max trong DB
                                    let maxID=await functions.getMaxID(Users);
                                    const maxIDTimviec = await (Users.findOne({type:1},{idTimViec365:1}).sort({ idTimViec365: -1 }).lean())
                                    let newIDTimViec=maxIDTimviec.idTimViec365 || 1
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
                                      avatarUser:null,
                                      createdAt:new Date().getTime(),
                                      role:1,
                                      authentic:0,
                                      from:from || null,
                                      idTimViec365:(Number(newIDTimViec)+1),
                                      inForCompanyTV365:{
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
                                    if(avatarUser==null){
                                        await functions.deleteImg(avatarUser)
                                    }
                                  return  functions.success(res,'đăng ký thành công')
                                }
                               else {
                                await functions.deleteImg(avatarUser)
                                return  functions.setError(res,'email đã tồn tại',404)
                               }
                       }
                       else{
                        await functions.deleteImg(avatarUser)
                        return  functions.setError(res,'email hoặc số điện thoại định dạng không hợp lệ',404)
                       }
               
       }else{
        await functions.deleteImg(avatarUser)

        return  functions.setError(res,'Thiếu dữ liệu',404)
       }
    }catch (error){
        console.log(error)
        await functions.deleteImg(avatarUser)
        return  functions.setError(res,error)
    }
  
}
exports.registerFall = async(req,res,next) => {
    try{
        let request= req.body,
        email=request.email,
        phone=request.phone,
        nameCompany=request.nameCompany,
        city=request.city,
        district=request.district,
        address=request.address,
        regis=request.regis;
        let maxID=await functions.getMaxID(CompanyUnset) || 1;
        if((email)!=undefined){
            // check email ,phone
           let checkEmail=await functions.CheckEmail(email)
           let CheckPhoneNumber=await functions.CheckPhoneNumber(phone)
           if((checkEmail && CheckPhoneNumber)==true){
               let company =await functions.getDatafindOne(CompanyUnset,{email})
               if(company==null){
                   const companyUnset = new CompanyUnset({
                       _id:(Number(maxID)+1),
                       email: email ,
                       nameCompany:nameCompany | null,
                       type: 1,
                       phone:phone,
                       city:city | null,
                       district:district | null,
                       address:address || null,
                       errTime: new Date().getTime(),
                       regis:regis || null
                   
                     });
                     await companyUnset.save();
                     return  functions.success(res,'tạo thành công')

               } 
               else {
                await CompanyUnset.updateOne({ email: email }, { 
                    $set: { 
                        nameCompany: nameCompany,
                        phone: phone,
                        city: city,
                        district: district,
                        address: address,
                        errTime: new Date().getTime(),
                        regis: regis
                    }
                });
                  return  functions.success(res,'update thành công')

                  
               }
           }
           else{
               return  functions.setError(res,'email hoặc số điện thoại không đúng định dạng',404)
           }
        }else{
           return  functions.setError(res,'thiếu dữ liệu gmail',404)

       }
    }catch(error){
        console.log(error)
        return  functions.setError(res,error)
    }
}
exports.sendOTP = async(req,res,next) => {
    try{
        let email=req.body.email,
        nameCompany=req.body.userName;

        if (email!=undefined){
            let checkEmail=await functions.CheckEmail(email)
            if(checkEmail){
                let otp=await functions.randomNumber
                console.log(otp)
                await Users.updateOne({ email: email }, { 
                    $set: { 
                       otp:otp
                    }
                });
                await functions.sendEmailVerificationRequest(otp,email,nameCompany)
                return  functions.success(res,'Gửi mã OTP thành công',)

            }
            else{
                return  functions.setError(res,'email không đúng định dạng',404)
            }
        }else{
            return  functions.setError(res,'thiếu dữ liệu gmail',404)
        }

    }catch(error){
        console.log(error)
        return  functions.setError(res,error)
    }
}
exports.verify = async(req,res,next) => {
    try{
        let otp=req.body.otp,
        email=req.body.email;
        let verify=await Users.findOne({email,otp});
        if(verify != null){
            await Users.updateOne({ email: email }, { 
                $set: { 
                    authentic:1
                }
            });
            return  functions.success(res,'xác thực thành công')

        }
        return  functions.setError(res,'xác thực thất bại',404)
    }catch(error){
        console.log(error)
        return  functions.setError(res,error)
    }
}
exports.forgotPasswordCheckMail= async(req,res,next) => {
    try{
        let email=req.body.email;
         // api lẫy mã OTP qua app Chat
         await axios({
            method: "post",
            url: "http://43.239.223.142:9000/api/users/RegisterMailOtp",
            data: {
              email:email
            },
            headers: { "Content-Type": "multipart/form-data" }
          }).then(async (response)=>{
           let otp=response.data.data.otp;
           let checkEmail=await functions.CheckEmail(email);
           if(checkEmail){
               let verify=await Users.findOne({email});
               if(verify != null){
                await Users.updateOne({ email: email }, { 
                    $set: { 
                       otp:otp
                    }
                   });
                   return  functions.success(res,'xác thực thành công')
               }
               return  functions.setError(res,'email không đúng',404)
           }
           return  functions.setError(res,'sai định dạng email',404)

          }).catch(async (error) => {
            console.log(error); // in ra lỗi nếu có
            return  functions.setError(res,error)
        });
       
      
    }catch(error){
        console.log(error)
        return  functions.setError(res,error)
    }
}
exports.forgotPasswordCheckOTP= async(req,res,next) => {
    try{
        let email=req.body.email;
        let otp=req.body.otp;
        let verify=await Users.findOne({email,otp});
        if(verify != null){
            return  functions.success(res,'xác thực thành công')
        }
        return  functions.setError(res,'mã otp không đúng',404)

       
    }catch(error){
        console.log(error)
        return  functions.setError(res,error)
    }
}

exports.updatePassword= async(req,res,next) => {
    try{
        email=req.body.email,
        password=req.body.password;
        await Users.updateOne({ email: email }, { 
            $set: { 
               password:md5(password)
            }
        });          
    }catch(error){
        console.log(error)
        return  functions.setError(res,error)
    }
}
exports.updateInfoCompany = async(req,res,next) => {
    let request= req.body,
        phone=request.phone,
        username=request.userName,
        city=request.city,
        address=request.address,
        site=request.site,
        website=request.website,
        description=request.description,
        mst=request.mst,
        idKD=request.idKD;


    let verifyToken= await functions.checkToken(req,res);
    if(verifyToken){

    }
}