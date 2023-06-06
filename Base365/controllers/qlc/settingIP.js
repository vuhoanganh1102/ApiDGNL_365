const functions = require("../../services/functions")
const setIp = require("../../models/qlc/settingIP")


// lấy danh sách ip 
exports.getListIP = async(req, res, next) => {
    try {
        const data = await setIp.find().select('_id nameApp accessIP createAt');

        if (data.length > 0) return functions.success(res, 'Danh sách ngành cv', data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

//lấy danh sách theo id

exports.getListByID = async (req,res)=>{
    try{
        const _id = req.body.id;
        console.log(_id)
        if(!_id){
            functions.setError(res,"id required")
        }else if(isNaN(_id)){
            functions.setError(res,"id not a number")
    
        }else{
            const data = await setIp.findOne({_id : _id}).select('_id nameApp accessIP createAt');
            if(!data){
                functions.setError(res, 'not found')
            }else{
                functions.success(res,'found successfull',{data})
            }
        };
    }catch(error){
        console.log(error);
        functions.setError(res,error.message);
    }
}
//tạo 1 thiết lập Ip
exports.createIP = async (req,res)=>{
    const {accessIP, appID , createAt } = req.body;
    let nameApp = "";
    if (( accessIP && appID) == undefined) {
        functions.setError(res,"info required")
    }else if(isNaN(appID) ){
        functions.setError(res,"appid must be a number")
    }else {
        // await findOne()
        // if(appID === 1){
        //     return nameApp = "cham cong 365"
        // }else if (appID === 2 ){
        //     console.log(nameApp)
        //     return nameApp = "tinh luong 365"
        // }else if (appID === 3 ){
        //     return nameApp = "quản trị nhân sự"
        // }else if (appID === 4 ){
        //     return nameApp = "văn thư lưu trữ"
        // }else if (appID === 5 ){
        //     return nameApp = "truyền thông văn hóa"
        // }else if (appID === 6 ){
        //     return nameApp = "chuyển đổi văn bản thành giọng nói"
        // }else if (appID === 7 ){
        //     return nameApp = "quản lí lịch biểu"
        // }else if (appID === 8 ){
        //     return nameApp = "CRM"
        // }else if (appID === 9 ){
        //     return nameApp = "đánh giá năng lực nhân viên"
        // }else if (appID === 10 ){
        //     return nameApp = "quản lí KPI"
        // }else if (appID === 11 ){
        //     return nameApp = "DMS"
        // }else if (appID === 12 ){
        //     return nameApp = "quản lí cung ứng"
        // }else if (appID === 13 ){
        //     return nameApp = "quản lí vật tư xây dựng"
        // }else if (appID === 14 ){
        //     return nameApp = "quản lí tài sản"
        // }
      
        const maxId = await functions.getMaxID(setIp);
        
        const _id = Number(maxId) + 1 || 1;
        const settingIP = new setIp({
            _id: _id,
            appID : appID,
            nameApp : nameApp,
            accessIP : accessIP,
            createAt : new Date().toJSON().slice(0,10)
        })
        await settingIP.save()
        .then(()=>functions.success(res,'create successful',{settingIP} ))
        .catch((e)=>functions.setError(res,e.message))
    }
    
}
exports.editsettingIP = async (req, res) => {
    const _id = req.body.id;
    console.log(_id)
    const {accessIP, appID, nameApp, upDateTime } = req.body;
    if (( accessIP && appID ) == undefined) {
        functions.setError(res,"info required")
    }else if(isNaN(appID) ){
        functions.setError(res,"appid must be a number")
    }else {
            const settingIP = await functions.getDatafindOne(setIp, { _id: _id });
            if (!settingIP) {
                functions.setError(res, "setIp does not exist!");
            } else {
                await functions.getDatafindOneAndUpdate(setIp,{ _id: _id }, {
                    appID: appID,
                    nameApp: nameApp,
                    accessIP: accessIP,
                    upDateTime: Date.now(),
                })
                    .then((settingIP) => functions.success(res, "setIp edited successfully", settingIP))
                    .catch((err) => functions.setError(res, err.message));
            }
        }
    }

exports.deleteSetIpByID = async (req, res) => {
    const _id = req.params.id;
    console.log(_id)
    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 621);
    } else {
        const settingIp = await functions.getDatafindOne(setIp, { _id: _id });
        console.log(settingIp)
        if (!settingIp) {
            functions.setError(res, "setIp does not exist");
        } else {
            functions.getDataDeleteOne(setIp, { _id: _id })
                .then(() => functions.success(res, "Delete setIp successfully", settingIp))
                .catch((err) => functions.setError(res, err.message));
        }
    }
}

exports.deleteSetIpCompany = async (req, res) => {
    const { companyID } = req.body;

    if (!companyID) {
        functions.setError(res, "Company id required");
    } else if (isNaN(companyID)) {
        functions.setError(res, "Company id must be a number");
    } else {
        const settingIp = await functions.getDatafind(setIp, { companyID: companyID });
        if (!settingIp) {
            functions.setError(res, "No setIp found in this company");
        } else {
            await settingIp.deleteMany({ companyID: companyID })
                .then(() => functions.success(res, "setIp deleted successfully", settingIp))
                .catch((err) => functions.setError(res, err.message));
        }
    }



}

exports.deleteAllsetIp = async (req, res) => {
    if (!await functions.getMaxID(setIp)) {
        functions.setError(res, "No setIp existed");
    } else {
        setIp.deleteMany()
            .then(() => functions.success(res, "Delete all setIp sucessfully"))
            .catch(err => functions.setError(err, err.message));
    }
}