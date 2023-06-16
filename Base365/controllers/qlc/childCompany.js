const ChildCompany = require("../../models/qlc/childCompany")
const functions = require("../../services/functions")

//tìm danh sách công ty 
exports.getListCompany = async(req, res) => {
        // try{
            const companyID = req.body.companyID
            console.log(companyID)
            if((companyID)==undefined){
                functions.setError(res,"lack of input")
            }else if(isNaN(companyID)){
                functions.setError(res,"id must be a Number")
            }else{
                
                const data = await ChildCompany.find({companyID: companyID}).select('companyName companyImage companyID companyPhone companyAddress ')
                if (data) {
                    return await functions.success(res, 'Lấy thành công', { data });
                };
                return functions.setError(res, 'Không có dữ liệu', 404);
            }
       
        // }catch(err){
        // console.log(err);
        
        // functions.setError(res,err.message)
        // }
};
//tạo công ty con
exports.createCompany = async (req, res) => {

    const {companyID, companyName,companyImage,companyPhone ,companyEmail,companyAddress} = req.body;

    if (!companyName) {
        functions.setError(res, "Company name required", 506);

    } else if (!companyID) {
        functions.setError(res, "Company order required", 507);

    } else if (isNaN(companyID)) {
        functions.setError(res, "Company order must be a number", 508);

    } else {
        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 1
        let maxID = await functions.getMaxID(ChildCompany);
        if (!maxID) {
            maxID = 0
        };
        const _id = Number(maxID) + 1;
        const company = new ChildCompany({
            _id: _id,
            companyName: companyName,
            companyImage: companyImage,
            companyID:  companyID,
            companyPhone: companyPhone,
            companyEmail: companyEmail,
            companyAddress: companyAddress,
        });

        await company.save()
            .then(() => {
                functions.success(res, "Company created successfully", {company})
            })
            .catch((err) => {
                functions.setError(res, err.message, 509);
            })
    }
};
// sửa công ty con 
exports.editCompany = async (req, res) => {
    const _id = req.body.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 502)
    } else {
        const {  companyName,companyPhone,companyEmail,companyAddress,companyID } = req.body;

        if (!companyName) {
            //Kiểm tra tên cty
            functions.setError(res, "company name required", 506)

        } else {

            const company = await functions.getDatafindOne(ChildCompany, { _id: _id });
            if (!company) {
                functions.setError(res, "company does not exist!", 510);
            } else {
                await functions.getDatafindOneAndUpdate(ChildCompany, { _id: _id }, {
                    companyName: companyName,
                    companyPhone: companyPhone,
                    companyEmail: companyEmail,
                    companyAddress: companyAddress,
                    
                })
                    .then((company) => functions.success(res, "Deparment edited successfully", {company}))
                    .catch((err) => functions.setError(res, err.message, 511));
            }
        }
    }
};
// exports.deleteCompany = async (req, res) => {
//     const _id = req.params.id;

//     if (isNaN(_id)) {
//         functions.setError(res, "Id must be a number", 502);
//     } else {
//         const company = await functions.getDatafindOne(ChildCompany, { _id: _id });
//         if (!company) {
//             functions.setError(res, "company not exist!", 510);
//         } else {
//             functions.getDataDeleteOne(ChildCompany, { _id: _id })
//                 .then(() => functions.success(res, "Delete company successfully!", company))
//                 .catch(err => functions.setError(res, err.message, 512));
//         }
//     }
// };


// exports.deleteAllCompanys = async (req, res) =>{
//     if (!await functions.getMaxID(ChildCompany)) {
//         functions.setError( res, "No company existed",513);
//     }else {
//         ChildCompany.deleteMany()
//             .then(() => functions.success(res, "Delete all companies successfully"))
//             .catch(err => functions.setError(res, err.message,514));
//     }
// }