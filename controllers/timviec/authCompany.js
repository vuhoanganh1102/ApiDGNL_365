const md5= require('md5')

const Users=require('../../models/Timviec365/Timviec/Users')
const functions=require('../../services/functions')

exports.register = async(req,res,next)=>{
//    const response = await functions.success('Thanh cong', [
//     1,2
//    ]);
const response = await functions.setError(404, "Khong tim trhay");
    res.json(response);
    
    // let request= req.body,
    //  email=request.email,
    //  phone=request.phone,
    //  username=request.userName,
    //  password=request.password,
    //  city=request.city,
    //  district=request.district,
    //  address=request.address,
    //  mst=request.mst,
    //  avatarUser=request.avatarUser,
    //  idKd=request.idKD,
    //  linkVideo=request.linkVideo,
    //  videoType=request.videoType;
    // // check du lieu khong bi undefined
    // if ((username && password && city && district &&
    //      address && email && idKd && mst && avatarUser && phone )!==undefined){
    //             let CheckEmail=await functions.CheckEmail(email),
    //                 CheckPhoneNumber=await functions.CheckPhoneNumber(phone);
    //                 console.log(CheckPhoneNumber)
    //                 if((CheckPhoneNumber && CheckEmail )==true){
    //                 //  check email co trung trong database hay khong
    //                 let user=await functions.getDatafindOne(Users,{email})
    //                         if(user==null){
    //                             return res.status(200).json('succes')

    //                             // tim ID max trong DB
    //                             // const maxID = await Users.find().sort({ _id: -1 }).limit(1).lean();
    //                             // maxID=maxID[0].toObject();
    //                             // newID=Number(maxID._id)+1;
    //                             // const insert = new Users({
    //                             //     _id:newID,
    //                             //     email: request.email,
    //                             //     password: md5(request.password),
    //                             //     userName:request.userName,
    //                             //     type: 1,
    //                             //     city:request.city,
    //                             //     district:request.district,
    //                             //     address:request.address,
    //                             //     avatarUser:request.avatarUser,
    //                             //   });
    //                             //   await insert.save();
                                    
    //                         }
    //                         else {
    //                             return res.status(404).json('email da ton tai')
    //                         }
    //                 }
    //                 else{
    //                     return res.status(404).json('email hoac so dien thoai khong dung dinh dang')
    //                 }
            
    // }else{
    //     return res.status(404).json('Khong du du lieu')
    // }
}