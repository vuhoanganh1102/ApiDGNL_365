const functions = require("../../services/functions")
const setIp = require("../../models/qlc/settingIP")



//lấy danh sách 

exports.getListByID = async (req,res)=>{
    // try{
        const _id = req.body.id || null;
        const companyID = req.body.companyID;
        let condition = {}
        if(!companyID){
            functions.setError(res,"id required")
        }else if(isNaN(companyID)){
            functions.setError(res,"id not a number")
            
        }else{
            if(_id) condition._id = _id
            if(companyID) condition.companyID = companyID
            console.log(_id,companyID)
            const data = await setIp.find(condition).select('_id fromSite accessIP createAt updateAt');
            console.log(data)
            if(!data){
                functions.setError(res, 'not found')
            }else{
                functions.success(res,'found successfull',{data})
            }
        };
    // }catch(error){
    //     console.log(error);
    //     functions.setError(res,error.message);
    // }
}
//tạo 1 thiết lập Ip
exports.createIP = async (req,res)=>{
    const {companyID,accessIP, fromSite , createAt,updateAt } = req.body;
    // let nameApp = "";
    if (( accessIP && fromSite&&companyID) == undefined) {
        functions.setError(res,"info required")
    }else if(isNaN(companyID) ){
        functions.setError(res,"fromSite must be a number")
    }else {
        const maxId = await functions.getMaxID(setIp);
        
        const _id = Number(maxId) + 1 || 1;
        const settingIP = new setIp({
            _id: _id,
            companyID:companyID,
            fromSite : fromSite,
            accessIP : accessIP,
            createAt : new Date().toJSON().slice(0,10),
            updateAt :updateAt || null
        })
        await settingIP.save()
        .then(()=>functions.success(res,'create successful',{settingIP} ))
        .catch((e)=>functions.setError(res,e.message))
    }
    
}
exports.editsettingIP = async (req, res) => {
    const _id = req.body.id;
    console.log(_id)
    const {companyID,accessIP, fromSite, updateAt } = req.body;
    if (( accessIP && fromSite && companyID) == undefined) {
        functions.setError(res,"info required")
    }else if(isNaN(companyID) ){
        functions.setError(res,"companyID must be a number")
    }else {
        const settingIP = await functions.getDatafindOne(setIp, { companyID:companyID , _id: _id });
        if (!settingIP) {
            functions.setError(res, "setIp does not exist!");
        } else {
            await functions.getDatafindOneAndUpdate(setIp,{companyID:companyID, _id: _id }, {
                fromSite: fromSite,
                // nameApp: nameApp,
                accessIP: accessIP,
                updateAt: new Date(),
            })
            .then((settingIP) => functions.success(res, "setIp edited successfully", {settingIP}))
            .catch((err) => functions.setError(res, err.message));
            }
        }
    }
    
    // exports.deleteSetIpByID = async (req, res) => {
        //     const _id = req.params.id;
        //     console.log(_id)
        //     if (isNaN(_id)) {
            //         functions.setError(res, "Id must be a number", 621);
            //     } else {
                //         const settingIp = await functions.getDatafindOne(setIp, { _id: _id });
                //         console.log(settingIp)
//         if (!settingIp) {
//             functions.setError(res, "setIp does not exist");
//         } else {
//             functions.getDataDeleteOne(setIp, { _id: _id })
//                 .then(() => functions.success(res, "Delete setIp successfully", settingIp))
//                 .catch((err) => functions.setError(res, err.message));
//         }
//     }
// }

exports.deleteSetIpByID = async (req, res) => {
    const  companyID = req.body.companyID;
    const  _id = req.body.id;
    // console.log(_id,companyID)
    
    if (!companyID) {
        functions.setError(res, "Company id required");
    } else if (isNaN(companyID)) {
        functions.setError(res, "Company id must be a number");
    } else {
        const settingIp = await functions.getDatafind(setIp, {companyID: companyID , _id :_id});
        // console.log(settingIp)
        if (!settingIp) {
            functions.setError(res, "No setIp found in this company");
        }else{
             await functions.getDataDeleteOne(setIp,{companyID:companyID ,_id :_id })
                .then(() => functions.success(res, "setIp deleted successfully", {settingIp}))
                .catch((err) => functions.setError(res, err.message));
        }
    }



}

// exports.deleteAllsetIp = async (req, res) => {
//     if (!await functions.getMaxID(setIp)) {
//         functions.setError(res, "No setIp existed");
//     } else {
//         setIp.deleteMany()
//             .then(() => functions.success(res, "Delete all setIp sucessfully"))
//             .catch(err => functions.setError(err, err.message));
//     }
// }