const md5= require('md5')

const Users=require('../../models/Timviec365/Timviec/Users')
const functions=require('../../services/functions')
const CompanyUnset=require('../../models/Timviec365/Timviec/userCompanyUnset')

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
            address && email && idKd && mst && phone )!==undefined){
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
                                          userID:(Number(newIDTimViec)+1),
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
                                  return res.status(200).json(await functions.success('đăng ký thành công'))
                                }
                               else {
                                return res.status(404).json(await functions.setError(404,'email đã tồn tại',avatarUser));
                               }
                       }
                       else{
                        return res.status(404).json(await functions.setError(404,'email hoặc số điện thoại định dạng không hợp lệ ',avatarUser));
                       }
               
       }else{
        return res.status(404).json(await functions.setError(404,'thiếu dữ liệu',avatarUser));
       }
    }catch (error){
        console.log(error)
        return  res.status(404).json(await functions.setError(404,error,req.avatarUser));
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
                     return res.status(200).json(await functions.success('thành công'))
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
                  return res.status(200).json(await functions.success('update thành công'))
               }
           }
           else{
               return res.status(404).json(await functions.setError(404,'email hoặc số điện thoại không đúng định dạng'));
           }
        }else{
           return res.status(404).json( await functions.setError(404,'thiếu dữ liệu gmail'));
       }
    }catch(error){
        console.log(error)
        return res.status(404).json( await functions.setError(404,error));
    }
}
exports.sendOTP = async(req,res,next) => {
    try{
        let email=req.body.email,
        nameCompany=req.body.userName;

        if (email!=undefined){
            let checkEmail=await functions.CheckEmail(email)
            if(checkEmail){
                await functions.sendEmailVerificationRequest(email,nameCompany)
                return res.status(200).json(await functions.success('Gửi mã OTP thành công'))
            }
            else{
                return res.status(404).json(await functions.setError(404,'email không đúng định dạng'));
            }
        }else{
            return res.status(404).json( await functions.setError(404,'thiếu dữ liệu gmail'));
        }

    }catch(error){
        console.log(error)
        return res.status(404).json( await functions.setError(404,error));
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
            return res.status(200).json(await functions.success('xác thực thành công'))
        }
        return res.status(404).json( await functions.setError(404,'xác thực thất bại'));
    }catch(error){
        console.log(error)
        return res.status(404).json( await functions.setError(404,error));
    }
}