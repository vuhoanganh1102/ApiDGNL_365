const fnc = require('../../services/functions')
const capPhat = require('../../models/QuanLyTaiSan/CapPhat')


exports.createAllocationDep = async(req,res)=>{
    try{
        const role = req.user.data.role
        const com_id = req.user.data.com_id
        if()





    }catch(e){
        return fnc.setError(res , e.message)
    }
}