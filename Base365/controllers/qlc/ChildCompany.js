const Users = require("../../models/Users")
const functions = require("../../services/functions")
const fnc = require("../../services/qlc/functions")

//tìm danh sách công ty 
exports.getListCompany = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        const type = req.user.data.type
        // let com_id = req.body.com_id
        if(type == 1){

       
            const data = await Users.find({ "inForCompany.cds.com_parent_id": com_id }).select('userName avatarUser com_id phone address ')
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data });
            };

            return functions.setError(res, 'Không có dữ liệu', 404);

    }
    return functions.setError(res, "Tài khoản không phải Công ty", 604);   
    } catch (err) {

        return functions.setError(res, err.message)
    }
};
//tạo công ty con
exports.createCompany = async(req, res) => {
    try {
        
        const com_id = req.user.data.com_id
        const type = req.user.data.type
        // let com_id = req.body.com_id
        const { userName, phone, emailContact, address } = req.body;
        let File = req.files || null;
        let avatarUser = null;
        let now = new Date()
        if(type == 1){

        if (com_id && emailContact && phone && address && userName) {
            const check_com_parent = await Users.findOne({ idQLC: com_id, type: 1 }).lean();
            
            if (check_com_parent) {
                let maxID = await functions.getMaxUserID("company")
                let _id = maxID._id
                if (File.avatarUser) {
                    let upload = fnc.uploadFileQLC('avt_child_com', _id, File.avatarUser, ['.jpeg', '.jpg', '.png']);
                    if (!upload) {
                        return functions.setError(res, 'Định dạng ảnh không hợp lệ', 400)
                    }
                    avatarUser = fnc.createLinkFileQLC('avt_child_com', _id, File.avatarUser.name)   
                }
                const company = new Users({
                    _id: _id ,
                    userName: userName,
                    avatarUser: avatarUser,
                    com_id: com_id,
                    type: 1,
                    idQLC: maxID._idQLC,
                    idTimViec365: maxID._idTV365,
                    idRaoNhanh365: maxID._idRN365,
                    phone: phone,
                    emailContact: emailContact,
                    address: address,
                    createdAt:Date.parse(now),
                    "inForCompany.cds.com_parent_id": com_id,
                });
                await company.save()
                    return functions.success(res, "Tạo thành công",{company});
            }
            return functions.setError(res, "Công ty mẹ không tồn tại");
        }
        return functions.setError(res, "Thiếu thông tin truyền lên");

    }
    return functions.setError(res, "Tài khoản không phải Công ty", 604);   
    } catch (error) {
        return functions.setError(res, error.message)
    }
};
// sửa công ty con 
exports.editCompany = async(req, res) => {
    try {
        const type = req.user.data.type
        // const com_id = req.user.data.com_id
        let com_id = req.body.com_id
        const _id = req.body.id;
        if(type == 1){

       
            const { userName, phone, emailContact, address } = req.body;

                const company = await functions.getDatafindOne(Users, {idQLC:com_id , type : 1});
                if (company) {
                    await functions.getDatafindOneAndUpdate(Users, {idQLC:com_id, type : 1 }, {
                        userName: userName,
                        phone: phone,
                        emailContact: emailContact,
                        address: address,

                    })
                   return functions.success(res, "Chỉnh sửa thành công", { company })
                }    
                return functions.setError(res, "không tìm thấy công ty ", 510);
                
                
         
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);   
    } catch (error) {
        return functions.setError(res, error.message)
    }
};