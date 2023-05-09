const functions=require('../../services/functions')
const City=require('../../models/Timviec365/Timviec/City')
const District=require('../../models/Timviec365/Timviec/District')

exports.postNewTv365 =async (req,res,next) => {
    try{
        let id=req.user.data._id,
        request=req.body,
        position=request.position,
        cateID=request.cateID,
        soLuong=request.soLuong,
        capBac=request.capBac,
        hinhThuc=request.hinhThuc,
        city=request.city,
        district=request.District,
        address=request.address,
        until=request.until,
        hoaHong=request.hoaHong,
        typeNewMoney=request.typeNewMoney,
        tgtv=request.tgtv,
        minValue=request.minValue,
        maxValue=request.minValue,
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
        linkVideo=request.linkVideo,
        avatar=request.avatarUser,
        videoType=request.videoType;
        if(position && cateID && soLuong && capBac && hinhThuc && city && district && address &&
            until && moTa && yeuCau && exp && bangCap && sex && quyenLoi && hanNop && userContactName
            && userContactAddress && userContactPhone && userContactEmail && typeNewMoney){
                switch(typeNewMoney){
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
                    default:
                        break;
                }
                
        }
        return  functions.setError(res,'Không có dữ liệu',404)
    }catch(error){
        console.log(error)
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