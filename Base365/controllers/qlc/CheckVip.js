const functions = require("../../services/functions")
const user = require("../../models/Users")
const datetime = require("datetime")


exports.check1 = async (req, res) => {
    try {
        const com_id = req.user.data.com_id
        let data = []
        let count = []

        const timeStart = "2023-05-20 23:59:59"

        data = await user.findOne({ "inForPerson.employee.com_id": com_id }).select("inForCompany.cds.com_vip inForCompany.cds.com_vip_time inForCompany.cds.com_ep_vip createdAt").lean()
        console.log(data)
        const createdAt = data.createdAt
        count = await user.countDocuments({ "inForPerson.employee.com_id": com_id }).lean()
        console.log(count)
        const comVip = data.inForCompany.cds.com_vip
        const timeVip = data.inForCompany.cds.com_vip_time
        const userVip = data.inForCompany.cds.com_ep_vip
        const startTime = new Date(timeStart);
        const createdTime = new Date(createdAt);
        const now = new Date()
        // console.log(now)
        
        const timeVips = new Date(timeVip)
        // console.log(timeVips)
        
        if (createdTime < startTime) {
            console.log("thời gian tạo trước 20/05/20");
            if (comVip === 1) {
                functions.success(res, "Cong ty tạo trước 20/05/20 va VIP")
            } else if (comVip === 0) {
                functions.success(res, "Cong ty tạo trước 20/05/20 va thường")
            } else {
                functions.setError(res, "Công ty tạo trước 20/05/20, vip không xác định ")

            }
        } else if (createdTime > startTime) {
            console.log("thời gian tạo sau 20/05/20");
            if (timeVip === 0) {//vip

                if (count >= userVip) {
                    if(comVip === 0 ){
                        functions.success(res, "Cong ty tạo sau 20/05/20 và cty thường và số lượng nhân viên vượt quá góp mặc định")

                    }else{
                        functions.success(res, "Cong ty tạo sau 20/05/20 và cty vip và số lượng nhân viên vượt quá góp mặc định")

                    }
                }else {
                    if(comVip === 0 ){
                    functions.success(res, "Cong ty tạo sau 20/05/20 và cty thường và con them duoc nhan vien ")
                    }else{
                    functions.success(res, "Cong ty tạo sau 20/05/20 và cty vip và con them duoc nhan vien ")
                    
                    }
                }


            } else {//
                if (now >= timeVips) {//het han vip
                    functions.success(res, "Cong ty tạo sau 20/05/20 va het han VIP")
                    if (count >= userVip) {
                    functions.success(res, "Cong ty tạo sau 20/05/20 va het han VIP va số lượng nhân viên vượt quá góp vip" )

                    }else{
                        functions.success(res, "Cong ty tạo sau 20/05/20 va het han VIP va con  them duoc nhân viên vip" )
                    }

                } else { // con han vip
                    if (count >= userVip) {

                        functions.success(res, "Cong ty tạo sau 20/05/20 va VIP va số lượng nhân viên vượt quá góp vip")
                    }else{
                        functions.success(res, "Cong ty tạo sau 20/05/20 va VIP va con  them duoc nhân viên vip")

                    }
                }
            }



        } else {
            console.log("Thời gian tạo lập và thời gian bắt đầu bằng nhau");
        }

    } catch (e) {
        functions.setError(res, e.message)
    }
}

exports.check2 = async (req, res) => {
    try {
        const com_id = req.body.com_id
        let data = []
        let count = []

        const timeStart = "2023-05-20 23:59:59"

        data = await user.findOne({ "inForPerson.employee.com_id": com_id }).select("inForCompany.cds.com_vip inForCompany.cds.com_vip_time inForCompany.cds.com_ep_vip createdAt").lean()
        console.log(data)
        const createdAt = data.createdAt
        count = await user.countDocuments({ "inForPerson.employee.com_id": com_id }).lean()
        console.log(count)
        const comVip = data.inForCompany.cds.com_vip
        const timeVip = data.inForCompany.cds.com_vip_time
        const userVip = data.inForCompany.cds.com_ep_vip
        const startTime = new Date(timeStart);
        const createdTime = new Date(createdAt);
        const now = new Date()
        // console.log(now)
        
        const timeVips = new Date(timeVip)
        // console.log(timeVips)
        
        if (createdTime < startTime) {
            console.log("thời gian tạo trước 20/05/20");
            if (comVip === 1) {
                functions.success(res, "Cong ty tạo trước 20/05/20 va VIP")
            } else if (comVip === 0) {
                functions.success(res, "Cong ty tạo trước 20/05/20 va thường")
            } else {
                functions.setError(res, "Công ty tạo trước 20/05/20, vip không xác định ")

            }
        } else if (createdTime > startTime) {
            console.log("thời gian tạo sau 20/05/20");
            if (timeVip === 0) {//vip

                if (count >= userVip) {
                    if(comVip === 0 ){
                        functions.success(res, "Cong ty tạo sau 20/05/20 và cty thường và số lượng nhân viên vượt quá góp mặc định")

                    }else{
                        functions.success(res, "Cong ty tạo sau 20/05/20 và cty vip và số lượng nhân viên vượt quá góp mặc định")

                    }
                }else {
                    if(comVip === 0 ){
                    functions.success(res, "Cong ty tạo sau 20/05/20 và cty thường và con them duoc nhan vien ")
                    }else{
                    functions.success(res, "Cong ty tạo sau 20/05/20 và cty vip và con them duoc nhan vien ")
                    
                    }
                }


            } else {//
                if (now >= timeVips) {//het han vip
                    functions.success(res, "Cong ty tạo sau 20/05/20 va het han VIP")
                    if (count >= userVip) {
                    functions.success(res, "Cong ty tạo sau 20/05/20 va het han VIP va số lượng nhân viên vượt quá góp vip" )

                    }else{
                        functions.success(res, "Cong ty tạo sau 20/05/20 va het han VIP va con  them duoc nhân viên vip" )
                    }

                } else { // con han vip
                    if (count >= userVip) {

                        functions.success(res, "Cong ty tạo sau 20/05/20 va VIP va số lượng nhân viên vượt quá góp vip")
                    }else{
                        functions.success(res, "Cong ty tạo sau 20/05/20 va VIP va con  them duoc nhân viên vip")

                    }
                }
            }



        } else {
            console.log("Thời gian tạo lập và thời gian bắt đầu bằng nhau");
        }

    } catch (e) {
        functions.setError(res, e.message)
    }
}