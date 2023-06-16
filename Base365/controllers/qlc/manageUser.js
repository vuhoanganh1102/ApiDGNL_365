const manageUser = require("../../models/Users")
const functions = require("../../services/functions")
const md5 = require('md5');

//tìm danh sách admin va nv
exports.getlistAdmin = async(req, res) => {
    try{
        const pageNumber = req.body.pageNumber || 1;
        let companyID = req.body.companyID
        let idQLC = req.body.idQLC;
        let depID = req.body.depID
        let role = req.body.role

        let condition = {};
        //Function tìm user là TK nhân viên và TK Cty
        if((companyID)==undefined){
            functions.setError(res,"lack of input")
        }else if(isNaN(companyID)){
            functions.setError(res,"id must be a Number")
        }else{
            if(idQLC) condition.idQLC = idQLC
            if(depID) condition.depID = "inForPerson.depID"
            if(role) condition.role = role
            console.log(idQLC,depID,role)
            const data = await manageUser.find(condition).select('userName phoneTK email inForPerson.depID inForPerson.positionID ').skip((pageNumber - 1) * 20).limit(20).sort({ _id : 1});
            if (data) {
                return await functions.success(res, 'Lấy thành công', { data, pageNumber });
            };
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
   
    }catch(err){
    console.log(err);
    
    functions.setError(res,err.message)
    }
};
//tao nv
exports.createUser = async(req, res) => {

    const {companyID, userName, email, phoneTK,idQLC, password,role,address,birthday,depID,groupID,teamID,positionID, gender, createdAt} = req.body;

    if ((companyID&&userName&& email&&idQLC&& password&&role&&address&&positionID&& gender)==undefined) {
        //Kiểm tra tên nhân viên khác null
        functions.setError(res, "user name required", 506);
    } else if (isNaN(companyID)) {
        //Kiểm tra sdt có phải là số không
        functions.setError(res, "number phone must be a number", 508);

    } else {
        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 0 có giá trị max thì bằng max + 1 
        let maxID = await functions.getMaxID(manageUser);
        if (!maxID) {
            maxID = 0
        };
        const _id = Number(maxID) + 1;
        const ManagerUser = new manageUser({
            _id : _id,
            idQLC: Number(maxID) + 1 || idQLC,
            "inForPerson.companyID": companyID,
            userName: userName,
            email: email,
            phoneTK: phoneTK,
            password: md5(password),
            gender: gender,
            birthday: birthday,
            address: address,
            "inForPerson.positionID": positionID,
            type: 2,
            "inForPerson.depID": depID,
            "inForPerson.groupID": groupID,
            "inForPerson.teamID":teamID,
            role : role,
            createdAt: Date.now()
        });

        await ManagerUser.save()
            .then(() => {
                functions.success(res, "user created successfully", {ManagerUser})
            })
            .catch((err) => {
                functions.setError(res, err.message, 509);
            })
    }
};


// chỉnh sửa
exports.editUser = async(req, res) => {

    const {companyID, userName, email, phoneTK,idQLC, password,role,address,birthday,depID,groupID,teamID,positionID, gender, createdAt} = req.body;

    if ((companyID&&userName&& email&&idQLC&& password&&role&&address&&positionID&& gender)==undefined) {
        //Kiểm tra tên nhân viên khác null
        functions.setError(res, "info required", 506);
    } else if (isNaN(companyID)) {
        //Kiểm tra sdt có phải là số không
        functions.setError(res, "number phone must be a number", 508);

    } else {

        

            const manager = await functions.getDatafindOne(manageUser, { idQLC: idQLC, type: 2 });
            if (!manager) {
                functions.setError(res, "manager does not exist!", 510);
            } else {
                await functions.getDatafindOneAndUpdate(manageUser, { idQLC: idQLC, type: 2 }, {
                    "inForPerson.companyID": companyID,
                    userName: userName,
                    email: email,
                    phoneTK: phoneTK,
                    password: md5(password),
                    gender: gender,
                    birthday: birthday,
                    address: address,
                    "inForPerson.positionID": positionID,
                    type: 2,
                    "inForPerson.depID": depID,
                    "inForPerson.groupID": groupID,
                    "inForPerson.teamID":teamID,
                    role : role,

                    })
                    .then((manager) => functions.success(res, "Deparment edited successfully", {manager}))
                    .catch((err) => functions.setError(res, err.message, 511));
            }
        }
    }

//xoa nhan vien
exports.deleteUser = async(req, res) => {
    //tạo biến đọc idQLC
    const companyID = req.body.companyID;
    const idQLC = req.body.idQLC;

    //nếu idQLC không phải số
    if(isNaN(idQLC)) {
        functions.setError(res, "Id must be a number", 502);
    } else { // thì tìm trong 1 idQLC trong user model 
        const manager = await functions.getDatafindOne(manageUser, {"inForPerson.companyID":companyID, idQLC: idQLC, type: 2 });
        if (!manager) { //nếu biến manager không tìm thấy  trả ra fnc lỗi 
            functions.setError(res, "user not exist!", 510);
        } else { //tồn tại thì xóa 
            functions.getDataDeleteOne(manageUser, { idQLC: idQLC })
                .then(() => functions.success(res, "Delete user successfully!", {manager}))
                .catch(err => functions.setError(res, err.message, 512));
        }
    }
};


exports.deleteAllUser = async(req, res) => {
    if (!await functions.getMaxID(manageUser)) {
        functions.setError(res, "No manager existed", 513);
    } else {
        manageUser.deleteMany()
            .then(() => functions.success(res, "Delete all companies successfully"))
            .catch(err => functions.setError(res, err.message, 514));
    }
}