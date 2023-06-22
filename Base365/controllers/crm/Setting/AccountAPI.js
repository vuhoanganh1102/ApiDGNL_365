const functions = require('../../../services/CRM/CRMservice')
const set = require('../../../models/crm/setting/AccountAPI')
const md5 = require('md5');
// cài đặt hợp đồng 
exports.addContract = async (req,res) =>{
    const com_id = req.user.data.inForPerson.employee.com_id

    const { account, password, switchboard,domain,status,} = req.body;

    if((account&& password&& switchboard&&domain)== undefined) {
        functions.setError(res," nhap thieu truong ")
    }else{
        let max = set.findOne({},{_id:1}).sort( {_id : -1}).limit(1).lean()
        const setting = new set({
            _id : Number(max) + 1||1,
            switchboard:switchboard,
            account:account,
            password:md5(password),
            domain:domain,
            status:status,
            created_at: new Date(),

        })
        await setting.save()
        .then(()=>functions.success(res , "lasy thanh cong",{setting}))
        .catch((err)=>functions.setError(res,err.message))
    }
}


exports.showSwichboard = async (req,res) =>{
    try{
        const com_id = req.user.data.inForPerson.employee.com_id

        const data = await set.find({switchboard:switchboard},{switchboard:1})
        if(!data){
        functions.setError(res,"tong dai khong ton tai")
        }
        functions.success(res,"lay thanh cong",{data})
    }catch(err){
        console.log(err)
        functions.setError(res,err.message)
    }


}