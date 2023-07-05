const Status_cus = require("../../models/crm/Customer/customer_status");

exports.add_status_cus = async (req, res) => {
    try{

        let { name_status, created_user, type_created } = req.body;
        let com_id = '';
        if(req.user.data.type == 1){
            com_id = req.user.data.idQLC
            let maxID = 0;
            let stt_cus = await Status_cus.findOne({}, {}, { sort: { stt_id: -1 } }).lean() || 0;   
            if (stt_cus) {
                maxID = Number(stt_cus.stt_id);
            }
            let new_status = await Status_cus({
                stt_id: (maxID + 1),
                stt_name: name_status,
                com_id: com_id,
                created_user: created_user,
                type_created: type_created,//cty or nhan vien tao
                status: 0,
                is_delete: 0,
                created_at: new Date(),
                updated_at: new Date(),
            })
            await new_status.save();
            return res.status(200).json({ data: new_status, message: "sucess" }); 
        }
        if(req.user.data.type == 2) {
            com_id = req.user.data.inForPerson.employee.com_id
            let maxID = 0;
            let stt_cus = await Status_cus.findOne({}, {}, { sort: { stt_id: -1 } }).lean() || 0;
        
            if (stt_cus) {
                maxID = Number(stt_cus.stt_id);
            }
            let new_status = await Status_cus({
                stt_id: (maxID + 1),
                stt_name: name_status,
                com_id: com_id,
                created_user: created_user,
                type_created: type_created,//cty or nhan vien tao
                status: 0,
                is_delete: 0,
                created_at: new Date(),
                updated_at: new Date(),
            })
            await new_status.save();
            return res.status(200).json({ data: new_status, message: "sucess" }); 
        }
        
    }catch (error) {
        console.error("Failed to add", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }
    
}

exports.get_list_status_Cus = async (req, res) => {
    try{
        let name_stt = req.body.name_stt;
        let skip = req.body.skip || 1;
        let limit = req.body.limit || 20;
        let list_status = await Status_cus.find({ stt_name: { $regex: `${name_stt}` }, is_delete: 0 }).skip((skip - 1) * 10).limit(limit);
        return res.status(200).json({ data: list_status, message: "sucess" });
    }catch (error) {
        console.error("Failed to add", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }
  }   


exports.edit_status = async (req, res) => {
    try{
        let { stt_id, ole_stt_name, new_stt_name, com_id, status } = req.body;
        if (!isNaN(stt_id)) {
            let check = await Status_cus.findOne({ stt_id: stt_id, com_id: com_id });
            if (check) {
                let stt_edit = await Status_cus.findOneAndUpdate({ stt_id: stt_id, com_id: com_id, stt_name: ole_stt_name }, {
                    stt_name: new_stt_name,
                    status: status,
                    updated_at: new Date()
                });
                return res.status(200).json({ data: stt_edit, message: "sucess" });
            } else {
                return res.status(200).json({ message: "trang thai khong ton tai trong db" });
            }
        } else {
            return res.status(404).json({ message: "bad request" });
        }
    }catch (error) {
        console.error("Failed to edit", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }
    
}
exports.edit_item_Status = async (req, res) => {
    try{
        let { id_stt, comid, status } = req.body;
        if (isNaN(id_stt)) {
            return res.status(404).json({ message: "bad  requeest" });
        } else {
            let check_exit = await Status_cus.findOne({ stt_id: stt_id, com_id: comid });
            if (check_exit) {
                let stt_edit = await Status_cus.findOneAndUpdate({ stt_id: stt_id, com_id: com_id }, {
                    status: status,
                });
                return res.status(200).json({ data: stt_edit, message: "sucess" });
            }
        }
    }catch (error) {
        console.error("Failed to edit", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }
    
}


exports.delete_Status = async (req, res) => {
    try{
        let { id_stt } = req.body;
        console.log(id_stt);
        if (!isNaN(id_stt)) {
            let stt_del = await Status_cus.findOneAndUpdate({ stt_id: id_stt }, { is_delete: 1, updated_at: new Date() });
            return res.status(200).json({ data: stt_del, message: "success" });
        } else {
            return res.status(404).json({ message: "bad request" });
        }
    }catch (error) {
        console.error("Failed to edit", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }
}