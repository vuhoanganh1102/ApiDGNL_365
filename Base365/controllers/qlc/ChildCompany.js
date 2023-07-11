const ChildCompany = require("../../models/qlc/ChildCompany")
const Users = require("../../models/Users")
const functions = require("../../services/functions")
const fnc = require("../../services/qlc/functions")

//tìm danh sách công ty 
exports.getListCompany = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        const type = req.user.data.type
        if(type == 1){

        // let com_id = req.body.com_id
        if ((com_id) == undefined) {
            functions.setError(res, "lack of input")
        } else if (isNaN(com_id)) {
            functions.setError(res, "id must be a Number")
        } else {

            const data = await ChildCompany.find({ com_id: com_id }).select('companyName companyImage com_id companyPhone companyAddress ')
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
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
        const { companyName, companyPhone, companyEmail, companyAddress } = req.body;
        let File = req.files || null;
        let companyImage = null;
        if(type == 1){

        if (com_id && companyEmail && companyPhone && companyAddress && companyName) {
            const check_com_parent = await Users.findOne({ idQLC: com_id, type: 1 }).lean();
            
            if (check_com_parent) {
                let maxID = await ChildCompany.findOne({},{},{sort:{_id:-1}}).lean() ||0;
                let _id = Number(maxID._id) + 1
                if (File.companyImage) {
                    let upload = fnc.uploadFileQLC('avt_child_com', _id, File.companyImage, ['.jpeg', '.jpg', '.png']);
                    if (!upload) {
                        return functions.setError(res, 'Định dạng ảnh không hợp lệ', 400)
                    }
                    companyImage = fnc.createLinkFileQLC('avt_child_com', _id, File.companyImage.name)
                    const company = new ChildCompany({
                        _id: _id ,
                        companyName: companyName,
                        companyImage: companyImage,
                        com_id: com_id,
                        companyPhone: companyPhone,
                        companyEmail: companyEmail,
                        companyAddress: companyAddress,
                    });
                    await company.save()
                return functions.success(res, "Tạo thành công",{company});
                }else{//no avatar
                    const company = new ChildCompany({
                        _id: Number(maxID._id)+1,
                        companyName: companyName,
                        companyImage: companyImage,
                        com_id: com_id,
                        companyPhone: companyPhone,
                        companyEmail: companyEmail,
                        companyAddress: companyAddress,
                    });
                    await company.save()
                return functions.success(res, "Tạo thành công",{company});
                }

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
        const com_id = req.user.data.com_id
        // let com_id = req.body.com_id
        const _id = req.body.id;
        if(type == 1){

       
            const { companyName, companyPhone, companyEmail, companyAddress } = req.body;

                const company = await functions.getDatafindOne(ChildCompany, {com_id:com_id,_id: _id });
                if (company) {
                    await functions.getDatafindOneAndUpdate(ChildCompany, {com_id:com_id,_id: _id }, {
                        companyName: companyName,
                        companyPhone: companyPhone,
                        companyEmail: companyEmail,
                        companyAddress: companyAddress,

                    })
                   return functions.success(res, "Deparment edited successfully", { company })
                }    
                return functions.setError(res, "company does not exist!", 510);
                
                
         
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);   
    } catch (error) {
        return functions.setError(res, error.message)
    }
};