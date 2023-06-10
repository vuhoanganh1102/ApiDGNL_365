const Deparment = require("../../models/qlc/Deparment")
const functions = require("../../services/functions")
const Users = require("../../models/Users")


//API lấy tất cả dữ liệu phòng ban 
    exports.getListDeparment = async(req, res) => {
        try{
            let companyID = req.body.companyID
            let _id = req.body._id
            let depID = req.body.depID
            console.log(_id,companyID,depID)

            let condition = {};
            let data = []
            let numberUser = {}

            if((companyID)==undefined){
                functions.setError(res,"lack of input")
            }else if(isNaN(companyID)){
                functions.setError(res,"id must be a Number")
            }else{
                if(companyID) condition.companyID = companyID
                if(_id) condition._id = _id
                console.log(_id,companyID)
                numberUser = await functions.findCount(Users,{ "inForPerson.companyID":companyID , "inForPerson.depID": depID, type: 2})
                console.log(numberUser)
                
                data = await Deparment.find(condition).select('deparmentName managerId deputyId ')
                if (!data) {
                    return functions.setError(res, 'Không có dữ liệu', 404);
                };
                return await functions.success(res, 'Lấy thành công', { data,numberUser });
            }
       
        }catch(err){
        console.log(err);
        
        functions.setError(res,err.message)
        }
    };

//API đếm số lượng nhân viên phòng ban 
exports.countUserInDepartment = async (req, res) => {
   try{
    const {depID, companyID} = req.body;
    console.log(depID, companyID)
     const numberUser = await functions.findCount(Users,{ "inForPerson.companyID":companyID , "inForPerson.depID": depID, type: 2})
        // .then(() => functions.success(res, "",{numberUser}))
        // .catch((err) => functions.setError(res, err.message, 501));
        console.log(numberUser)
        if (!numberUser) {
            functions.setError(res, "Deparment cannot be found or does not exist", 503);
        } else {
            functions.success(res, "Deparment found", {numberUser});
        }
   }catch(e){
    console.log(e)
    functions.setError(res, "Deparment does not exist", 503);
   }
}


// //API lấy dữ liệu một phòng ban
// exports.getDeparmentById = async (req, res) => {
//     const _id = req.params.id;
//     if (isNaN(_id)) {
//         functions.setError(res, "Id must be a number", 502);
//     } else {
//         const deparment = await Deparment.findById(_id);
//         if (!deparment) {
//             functions.setError(res, "Deparment cannot be found or does not exist", 503);
//         } else {
//             functions.success(res, "Deparment found", deparment);
//         }
//     }
//     //

// };
//API tạo mới một phòng ban
exports.createDeparment = async (req, res) => {

    const { companyID, deparmentName ,managerId,deputyId } = req.body;
    console.log(companyID)
    if ((companyID&&deparmentName)==undefined) {
        //Kiểm tra Id công ty khác null
        functions.setError(res, "Company Id required", 504);

    } else if (isNaN(companyID)) {
        //Kiểm tra Id company có phải số không
        functions.setError(res, "Company Id must be a number", 505);

    } else if (!deparmentName) {
        //Kiểm tra ID phòng ban khác null
        functions.setError(res, "name Deparment required", 506);

    } else {
        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 1
        let maxID = await functions.getMaxID(Deparment);
        const deparment = new Deparment({
            _id: Number(maxID) + 1 || 1,
            companyID: companyID,
            deparmentName: deparmentName,
            managerId: managerId || null,
            deputyId: deputyId || null,
        });

        await deparment.save()
            .then(() => {
                functions.success(res, "Deparment created successfully", {deparment})
            })
            .catch((err) => {
                functions.setError(res, err.message, 509);
            })
    }
};
//API thay dổi thông tin của một phòng ban
exports.editDeparment = async (req, res) => {
    const _id = req.body.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 502)
    } else {
        const { companyID, deparmentName, managerId,deputyId } = req.body;

        if (!companyID) {
            //Kiểm tra Id công ty khác null
            functions.setError(res, "Company ID required", 504);

        } else if (isNaN(companyID)) {
            //Kiểm tra Id công ty có phải số không
            functions.setError(res, "Company ID must be a number", 505);

        } else {

            const deparment = await functions.getDatafindOne(Deparment, { _id: _id });
            if (!deparment) {
                functions.setError(res, "Deparment does not exist!", 510);
            } else {
                await functions.getDatafindOneAndUpdate(Deparment, {companyID:companyID, _id: _id }, {
                    companyID: companyID,
                    deparmentName: deparmentName,
                    managerId: managerId||null,
                    deputyId: deputyId || null,
                })
                    .then((deparment) => functions.success(res, "Deparment edited successfully", {deparment}))
                    .catch((err) => functions.setError(res, err.message, 511));
            }
        }
    }
};
//API xóa một phòng ban theo id
exports.deleteDeparment = async (req, res) => {
    const _id = req.params.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 502);
    } else {
        const deparment = await functions.getDatafindOne(Deparment, { _id: _id });
        if (!deparment) {
            functions.setError(res, "Deparment not exist!", 510);
        } else {
            functions.getDataDeleteOne(Deparment, { _id: _id })
                .then(() => functions.success(res, "Delete deparment successfully!", deparment))
                .catch(err => functions.setError(res, err.message, 512));
        }
    }
};
// API xóa toàn bộ phòng ban hiện có
exports.deleteAllDeparmants = async (req, res) => {

    if (!await functions.getMaxID(Deparment)) {
        functions.setError(res, "No deparment existed", 513);
    } else {
        Deparment.deleteMany()
            .then(() => functions.success(res, "Delete all deparments successfully"))
            .catch(err => functions.setError(res, err.message, 514));
    }

};