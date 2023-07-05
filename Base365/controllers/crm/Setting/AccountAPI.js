const functions = require('../../../services/CRM/CRMservice')
const set = require('../../../models/crm/account_api')
const axios = require('axios');
const http = require('http');
const md5 = require('md5');
// cài đặt hợp đồng 
exports.addContract = async (req,res) =>{
  let { account, password, switchboard,domain,status} = req.body;
  let com_id = '';
    if(req.user.data.type == 1) {
     com_id = req.user.data.idQLC
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
}





//kết nối tổng đài kiểm tra theo com nếu có sẽ hiển thị ko có sẽ tạo mới
exports.connectTd = async (req,res) => {
    try{
        let { account,password,switchboard,domain,status,com_id,id} = req.body;
        console.log(req.body);
        // const com_id = req.user.data.inForPerson.employee.com_id;
       let checkCom = await set.find({com_id : com_id})
       console.log(checkCom);
        if(checkCom){
           res.status(200).json({checkCom})
        }else{
            if((account&& password&& switchboard&&domain)== undefined) {
                functions.setError(res," nhap thieu truong ")
            }else{
                let max = set.findOne({},{id:1}).sort( {id : -1}).limit(1).lean()
                const setting = new set({
                    id : Number(max) + 1||1,
                    switchboard:switchboard,
                    account:account,
                    password:password,
                    domain:domain,
                    status:status,
                    created_at: new Date(),
        
                })
               let saveST = await setting.save()
               res.status(200).json({saveST})
            }
        }
    }catch (error) {
      console.error('Failed to connect', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xử lý.' });
    }

}

//hàm chỉnh sửa kết nối tổng đài














