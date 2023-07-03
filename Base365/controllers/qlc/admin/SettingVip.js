const functions = require("../../../services/functions")
const user = require("../../../models/Users")


exports.setVip = async (req, res) => {
    let idQLC = req.body.idQLC
    let com_ep_vip = req.body.com_ep_vip
    let com_vip_time = req.body.com_vip_time

    if(com_ep_vip < 5 ){
        functions.setError(res,"số lượng nhân viên được đăng kí vip không được dưới 5")
    }else if(isNaN(com_ep_vip)){
        functions.setError(res,"số lượng nhân viên phải là số")
    }else{
        let data = await user.findOneAndUpdate({idQLC : idQLC , type : 1 },{
            $set : {
                
            }
        })
    }
}


exports.getList= async (req,res) =>{

    try {
        const pageNumber = req.body.pageNumber || 1;
        const request = req.body;
        let idQLC = request.idQLC || null
            com_id = request.com_id,
            depID = request.depID || null
            CreateAt = request.CreateAt || true
            inputNew = request.inputNew || null
            inputOld = request.inputOld || null
            let data = [];
            let listCondition = {};
            let getTime = {CreateAt : { $gte: inputOld , $lte: inputNew }} 
            if((com_id)==undefined){
                functions.setError(res,"lack of input")
            }else if(isNaN(com_id)){
                functions.setError(res,"id must be a Number")
            }else{
            
            if(idQLC) listCondition.idQLC = idQLC;
            if(depID) listCondition.depID =  depID;
            if(inputNew || inputOld) listCondition.getTime = getTime;
            if(inputOld) listCondition.inputOld = inputOld;
            // const data = await Tracking.find({com_id: com_id, CreateAt: { $gte: '2023-06-01', $lte: '2023-06-06' } }).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 20).limit(20).sort({ CreateAt : -1});
             data = await user.find(listCondition).select('_id idQLC Location CreateAt shiftID status  ').skip((pageNumber - 1) * 25).limit(25).sort({ _id : -1});
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
   

    } catch (err) {
        functions.setError(res, err.message);
    };

 
}