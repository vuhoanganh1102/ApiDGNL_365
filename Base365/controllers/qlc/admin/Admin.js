const functions = require("../../../services/functions")
const user = require("../../../models/Users")

//cai dat dich vu Vip
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

// lay danh sach KH
exports.getList= async (req,res) =>{

    try {
        const idQLC = req.user.data.idQLC
        const pageNumber = req.body.pageNumber || 1;
        const request = req.body;

        let fromWeb = request.fromWeb 
            // CreateAt = request.CreateAt || true
            // CreateAt = ""
            // userName = ""
            inputNew = request.inputNew 
            inputOld = request.inputOld 
            find = request.find
            com_vip = request.com_vip
            time_vip = request.time_vip
            ComRegisInDay = request.ComRegisInDay
            ComRegisterErr = request.ComRegisterErr
            comHaveTimekeepingInDay = request.comHaveTimekeepingInDay
            
            
            // findpreviousDay = request.findpreviousDay
            let type = 1
            let data = [];
            let listCondition = {};
            let userName = { $regex: find }
            let checkNew = new Date(inputNew)
            let checkOld = new Date(inputOld)
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
            const day = currentDate.getDate()  ;
            
            // const formattedDate = `${year}-${month}-${day}`;

            const previousDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
            const inDay = new Date(previousDate)
   
            console.log(inDay)
            let createdAt = { $gte: checkOld , $lte: checkNew }
            if(checkOld > checkNew){
                await functions.setError(res,"thời gian nhập không đúng quy định")
            } 

            // if((com_id)==undefined){
            //     functions.setError(res,"lack of input")
            // }else if(isNaN(com_id)){
            //     functions.setError(res,"id must be a Number")
            // }else{
                //tiìm kiếm công ty đang vip thì cho vip = 1 
                if(com_vip) listCondition['inForCompany.cds.com_vip'] = Number(com_vip);
                //tìm kiếm công ty từng vip thì cho time vip != 0
                if(time_vip) listCondition['inForCompany.cds.com_vip_time'] = {$ne : Number(time_vip)};
                //tìm kiếm công ty chưa vip thì cho vip = 0 va time vip = 0
                if((com_vip && time_vip)) listCondition['inForCompany.cds.com_vip'] = Number(com_vip), listCondition['inForCompany.cds.com_vip_time'] = Number(time_vip)
                
                
                if(fromWeb) listCondition.fromWeb = fromWeb;
                if(inputNew || inputOld) listCondition.createdAt = createdAt;
                if(find) listCondition.userName = userName;
                if(type) listCondition.type = type;
                //danh sach cty dang ki loi , chua kich hoat
                if(ComRegisterErr) listCondition["authentic"] = 0;
                //danah sach cong ty ddang ki trong ngay
                if(ComRegisInDay) listCondition['createdAt'] = {$gte: inDay}
                //danh sach cong ty su dung cham cong trong ngay
                if(comHaveTimekeepingInDay) listCondition['inForCompany.cds.type_timekeeping'] = {$ne : 0},listCondition['createdAt'] = {$gte: inDay}


            
            console.log(listCondition)
             data = await user.find(listCondition).select('com_id userName Email phoneTK address fromWeb createdAt status_com authentic inForCompany.cds.com_vip inForCompany.cds.com_ep_vip inForCompany.cds.com_vip_time ').skip((pageNumber - 1) * 25).limit(25).sort({ _id : -1});
             console.log(data)
             if (data === []) {
                //  let vip = data[0].inForCompany.cds.com_vip
                //  let EpVip = data[0].inForCompany.cds.com_ep_vip
                //  let comVipTime = data[0].inForCompany.cds.com_vip_time
                //  console.log(vip,EpVip,comVipTime)

                // data.vip = vip
                // data.EpVip = EpVip
                // data.comVipTime = comVipTime
                await functions.setError(res, 'Không có dữ liệu', 404);
                
            }else{
                let count = await user.countDocuments(listCondition)
            // console.log(count)
                // data.count = count

                await functions.success(res, 'Lấy thành công', { data,count });
            }
        // }
   

    } catch (err) {
        functions.setError(res, err.message);
    };

 
}
exports.getListComVip = async (req, res)=>{

}