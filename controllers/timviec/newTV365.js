const functions=require('../../services/functions')
const City=require('../../models/Timviec365/Timviec/City')
const District=require('../../models/Timviec365/Timviec/District');
const NewTV365 = require('../../models/Timviec365/Timviec/NewTV365');

exports.postNewTv365 =async (req,res,next) => {
    try{
        let id=req.user.data._id,
        request=req.body,
        title=request.title,
        cateID=request.cateID,
        soLuong=request.soLuong,
        capBac=request.capBac,
        hinhThuc=request.hinhThuc,
        city=request.city,
        district=request.district,
        address=request.address,
        until=request.until,
        hoaHong=request.hoaHong,
        typeNewMoney=request.typeNewMoney,
        tgtv=request.tgtv,
        minValue=request.minValue,
        maxValue=request.maxValue,
        moTa=request.moTa,
        yeuCau=request.yeuCau,
        exp=request.exp,
        bangCap=request.bangCap,
        sex=request.sex,
        quyenLoi=request.quyenLoi,
        hoSo=request.hoSo,
        hanNop=request.hanNop,
        userContactName=request.userContactName,
        userContactAddress=request.userContactAddress,
        userContactPhone=request.userContactPhone,
        userContactEmail=request.userContactEmail,
        linkVideo=req.linkVideo,
        avatar=req.files.avatarUser,
        videoType=req.files.videoType,
        money=1;
        let video='';
        let link='';
        let listImg=[];
        if(title && cateID && soLuong && capBac && hinhThuc && city && district && address &&
            until && moTa && yeuCau && exp && bangCap && sex && quyenLoi && hanNop && userContactName
            && userContactAddress && userContactPhone && userContactEmail && typeNewMoney){
                switch(Number(typeNewMoney)){
                    case 1:
                        maxValue=null;
                        minValue=null;
                        break;
                    case 2:
                        maxValue=null;
                        break;
                    case 3: 
                         minValue=null;
                         break;
                         case 5:
                            money=request.money;
                            break;
                    default:
                        break;
                }
                //check video
                if(videoType){
                    if(videoType.length==1){
                        let checkVideo= await functions.checkVideo(videoType[0]);
                        if(checkVideo){
                         video=videoType[0].filename
                        }
                        else {
                         await functions.deleteImg(videoType[0])
                         return functions.setError(res,'video không đúng định dạng hoặc lớn hơn 100MB ',404)
                        }                }
                    else
                     if(videoType.length>1){
                        return  functions.setError(res,'chỉ được đưa lên 1 video',404)
                    }
                }
                
                //check ảnh
                if(avatar){
                    if(avatar.length >=1 && avatar.length <=6){
                        avatar.forEach(async(element) => {
                            let checkImg=await functions.checkImage(element.path)
                            if (checkImg) {
                                listImg.push(element.filename);
                            } else {
                                await functions.deleteImg(element);
                                return functions.setError(res, `sai định dạng ảnh hoặc ảnh lớn hơn 2MB :${element.originalname}`, 404);
                            }
                        });
                    }
                }
               
                // check link video
                if(linkVideo){
                    let checkLink = await functions.checkLink(linkVideo);
                    if(checkLink){
                        link=linkVideo;
                    }else{
                        return functions.setError(res,'link không đúng định dạng ',404)
                    }
                }
                let checkTime=await functions.checkTime(hanNop)
                if(checkTime==false){
                    if( avatar){
                        avatar.forEach(async(element)=>{
                            await functions.deleteImg(element)
                        })
                    }
                    if(videoType){
                        await functions.deleteImg(videoType[0])
                    }
                    return  functions.setError(res,'thời gian hạn nộp phải lớn hơn thời gian hiện tại',404)
                }
                let maxID=await functions.getMaxID(NewTV365) || 1;
                const newTV = new NewTV365({
                    _id:(Number(maxID)+1),
                    title:title,
                    userID:id,
                    alias:'',
                    redirect301:'',
                    cateID:cateID,
                    cityID:city,
                    districtID:district,
                    address:address,
                    money:money,
                    capBac:capBac,
                    exp:exp,
                    sex:sex,
                    bangCap:bangCap,
                    soLuong:soLuong,
                    hinhThuc:hinhThuc,
                    createTime:new Date().getTime(),
                    active:0,
                    type:1,
                    viewCount:0,
                    hanNop:hanNop,
                    newMutil:{
                        moTa:moTa,
                        yeuCau:yeuCau,
                        quyenLoi:quyenLoi,
                        hoSo:hoSo,
                        hoaHong:hoaHong || " ",
                        tgtv:tgtv || " ",
                        videoType:video || " ",
                        images:listImg || " "
                    },
                    newMoney:{
                        type:typeNewMoney,
                        minValue:minValue || null,
                        maxValue:maxValue || null,
                        until:until || 1,
                    }
                  });
                  await newTV.save();    
                  return functions.success(res,"tạo bài tuyển dụng thành công")
                }
        return  functions.setError(res,'thiếu dữ liệu',404)
    }catch(error){
        console.log(error)
        if( req.files.avatarUser){
            req.files.avatarUser.forEach(async(element)=>{
                await functions.deleteImg(element)
            })
        }
        if(req.files.videoType){
            await functions.deleteImg(req.files.videoType[0])
        }
        return  functions.setError(res,error)
    }
}
exports.getDataCity = async(req,res,next) => {
    try{
        let city=await functions.getDatafind(City)
        if(city.length !=0){
            return functions.success(res,"Láy dữ liệu thành công",city)
        }
        return  functions.setError(res,'Không có dữ liệu',404)

    }catch(error){
        console.log(error)
        return  functions.setError(res,error)
}
}
exports.getDataDistrict= async(req,res,next) => {
    try{
        let idCity=req.body.parent;
        let listDistrict=await functions.getDatafind(District);
        if(listDistrict.length!= 0 && idCity != undefined){
         let district=await functions.getDatafind(District,{parent:idCity})
         return functions.success(res,"Láy dữ liệu thành công",district)
        }
        return  functions.setError(res,'error',404)
    }catch(error){
        console.log(error)
        return  functions.setError(res,error)
}
}
// 
exports.getListPost= async(req,res,next) => {
    try{
        let idCompany=req.user.data._id;
        let listPost=await functions.getDatafind(NewTV365,{userID:idCompany})
        return functions.success(res,"Láy dữ liệu thành công",listPost)
    }catch(error){
        console.log(error)
        return  functions.setError(res,error)
}
}
exports.getPost= async(req,res,next) => {
    try{
        let id=req.query.id;
        let post=await functions.getDatafindOne(NewTV365,{_id:id})
        if(post){
            return functions.success(res,"Láy dữ liệu thành công",[post])
        }
        return  functions.setError(res,'sai id',404)

    }catch(error){
        console.log(error)
        return  functions.setError(res,error)
}
}