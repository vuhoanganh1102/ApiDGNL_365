const childCompany = require("../../models/Users")
const functions = require("../../services/functions")

//tìm danh sách công ty 
exports.getListCompany= async (req, res) => {
    //Function tìm tất cả cty theo model user có điều kiện là tài khoản cty
    await functions.getDatafind(childCompany, { companyID : companyID , type : 1 })
        //thành công trả models
        .then((childCompany) => functions.success(res, "", childCompany))
        // bắt lỗi 
        .catch((err) => functions.setError(res, err.message, 501));
};
//tìm id company qua model user
exports.getCompanyById = async (req, res) => {
    //tạo biến chứa param id 
    const companyID = req.params.companyID;
    // nếu param id k phải số trả lỗi 
    if (isNaN(companyID)) {
        functions.setError(res, "companyID must be a number", 502);
    } else {
    //nếu tìm được id của cty 
        const Company = await childCompany.findOne({ companyID : companyID , type : 1  });
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

    const { companyID, userContactPhone, userContactEmail } = req.body;

    if (!companyID) {
        //Kiểm tra id công ty  khác null
        functions.setError(res, "Company name required", 506);
    }else if (!userContactEmail) {
        //kiển tra Email rỗng không 
        functions.setError(res, "Company email required",)
    } else if (!userContactPhone) {
        //Kiểm tra xếp thứ tự khác null
        functions.setError(res, "Company phone required", 507);

    } else if (typeof userContactPhone !== "number") {
        //Kiểm tra xếp thứ tự có phải là số không
        functions.setError(res, "Company phone must be a number", 508);

    } else {
        //tìm company ID max , nếu chưa có giá trị nào thì bằng 0 tìm thấy thì bằng max + 1
        let maxID = await functions.getMaxIDcompany(childCompany);
        if (!maxID) {
            maxID = 0
        };
        const companyID = Number(maxID) + 1;
        const company = new childCompany({
            companyID: companyID,
            avatarCompany: avatarCompany,
            idparent:  idparent,
            userContactEmail: userContactEmail,
            userContactPhone: userContactPhone,
            userContactAddress: userContactAddress,
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
    const companyID = req.params.companyID;

    if (isNaN(companyID)) {
        functions.setError(res, "Id must be a number", 502)
    } else {
        const {  companyName, userContactEmail, userContactPhone } = req.body;

        if (!companyName) {
            //Kiểm tra tên cty
            functions.setError(res, "company name required", 506);
        }else if(!userContactEmail){
            //kiem tra email 
            functions.setError(res, "user contact email required", 506);
        } else if (!userContactPhone) {
            //Kiểm tra xếp thứ tự có khác null
            functions.setError(res, "company phone required", 507);         
            //Kiểm tra phone có phải là số không
        } else if (typeof userContactPhone !== "number") {
            functions.setError(res, "company phone must be a number", 508);

        } else {

            const company = await functions.getDatafindOne(childCompany, { companyID: companyID ,type : 1 });
            if (!company) {
                functions.setError(res, "company does not exist!", 510);
            } else {
                await functions.getDatafindOneAndUpdate(childCompany, { companyID: companyID, type :1 }, {
                    companyName: companyName,
                    userContactPhone: userContactPhone,
                    userContactEmail: userContactEmail
                })
                    .then((company) => functions.success(res, "Company edited successfully", company))
                    .catch((err) => functions.setError(res, err.message, 511));
            }
        }
    }
};
exports.deleteCompany = async (req, res) => {
    const companyID = req.params.companyID;
    //companyID
    if (isNaN(companyID)) {
        functions.setError(res, "Id must be a number", 502);
    } else {
        const company = await functions.getDatafindOne(childCompany, { companyID: companyID , type : 1});
        if (!company) {
            functions.setError(res, "company not exist!", 510);
        } else {
            functions.getDataDeleteOne(childCompany, { companyID: companyID, type :1 })
                .then(() => functions.success(res, "Delete company successfully!", company))
                .catch(err => functions.setError(res, err.message, 512));
        }
    }
};


exports.deleteAllCompanys = async (req, res) =>{
    if (!await functions.getMaxIDcompany(childCompany)) {
        functions.setError( res, "No company existed",513);
    }else {
        childCompany.deleteMany()
            .then(() => functions.success(res, "Delete all companies successfully"))
            .catch(err => functions.setError(res, err.message,514));
    }
}