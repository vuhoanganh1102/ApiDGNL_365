const childCompany = require("../../models/Users")
const functions = require("../../services/functions")

//tìm danh sách công ty 
exports.getListCompany= async (req, res) => {
    //Function tìm tất cả không có điều kiện rằng buộc
    await functions.getDatafind(childCompany, {type :1 || 2 })
        //thành công trả models
        .then((childCompany) => functions.success(res, "", childCompany))
        // bắt lỗi 
        .catch((err) => functions.setError(res, err.message, 501));
};
//
 
exports.getCompanyById = async (req, res) => {
    //tạo biến chứa param id 
    const _id = req.params.id;
    // nếu không có param id trả lỗi 
    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 502);
    } else {
    //nếu tìm được id của cty 
        const Company = await Company.findById(_id);
        if (!Company) {
    //nếu biến cty rỗng
            functions.setError(res, "childCompany cannot be found or does not exist", 503);
        } else {
            functions.success(res, "childCompany found", Company);
        }
    }
};
//tạo công ty
exports.createCompany = async (req, res) => {

    const { companyName, companyOrder } = req.body;

    if (!companyName) {
        //Kiểm tra tên phòng ban khác null
        functions.setError(res, "Company name required", 506);

    } else if (!companyOrder) {
        //Kiểm tra xếp thứ tự khác null
        functions.setError(res, "Company order required", 507);

    } else if (typeof companyOrder !== "number") {
        //Kiểm tra xếp thứ tự có phải là số không
        functions.setError(res, "Company order must be a number", 508);

    } else {
        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 1
        let maxID = await functions.getMaxID(_id);
        if (!maxID) {
            maxID = 0
        };
        const _id = Number(maxID) + 1;
        const company = new childCompany({
            _id: _id,
            companyName: companyName,
            companyImage: companyImage,
            holdingCompanyId:  holdingCompanyId,
            companyPhone: companyPhone,
            companyEmail: companyEmail,
            companyAddress: companyAddress,
            companyOrder:   companyOrder,
        });

        await company.save()
            .then(() => {
                functions.success(res, "Company created successfully", company)
            })
            .catch((err) => {
                functions.setError(res, err.message, 509);
            })
    }
};
// sửa công ty con 
exports.editCompany = async (req, res) => {
    const _id = req.params.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 502)
    } else {
        const {  companyName, companyOrder } = req.body;

        if (!companyName) {
            //Kiểm tra tên cty
            functions.setError(res, "company name required", 506);

        } else if (!companyOrder) {
            //Kiểm tra xếp thứ tự có khác null
            functions.setError(res, "company order required", 507);

        } else if (typeof companyOrder !== "number") {
            //Kiểm tra xếp thứ tự có phải là số không
            functions.setError(res, "Deparment order must be a number", 508);

        } else {

            const company = await functions.getDatafindOne(childCompany, { _id: _id });
            if (!company) {
                functions.setError(res, "company does not exist!", 510);
            } else {
                await functions.getDatafindOneAndUpdate(childCompany, { _id: _id }, {
                    companyName: companyName,
                    companyOrder: companyOrder
                })
                    .then((company) => functions.success(res, "Deparment edited successfully", company))
                    .catch((err) => functions.setError(res, err.message, 511));
            }
        }
    }
};
exports.deleteCompany = async (req, res) => {
    const _id = req.params.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 502);
    } else {
        const company = await functions.getDatafindOne(childCompany, { _id: _id });
        if (!company) {
            functions.setError(res, "company not exist!", 510);
        } else {
            functions.getDataDeleteOne(childCompany, { _id: _id })
                .then(() => functions.success(res, "Delete company successfully!", company))
                .catch(err => functions.setError(res, err.message, 512));
        }
    }
};


exports.deleteAllCompanys = async (req, res) =>{
    if (!await functions.getMaxID(childCompany)) {
        functions.setError( res, "No company existed",513);
    }else {
        childCompany.deleteMany()
            .then(() => functions.success(res, "Delete all companies successfully"))
            .catch(err => functions.setError(res, err.message,514));
    }
}