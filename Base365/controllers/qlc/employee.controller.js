const Employee = require("../../models/Users");
const functions = require("../../services/functions");

//tao moi 1 nhan vien
exports.createEmployee = async (req, res) => {

    const companyID = req.body.companyID;
    const type = 2;
    const phoneTK = req.body.phoneTK;
    const userName = req.body.userName;
    const password = req.body.password;
    const phone = req.body.phone;
    const address = req.body.address;
    const gender = req.body.gender;
    const birthday = req.body.birthday;
    const candiHocVan = req.body.candiHocVan;
    const married = req.body.married;
    const exp = req.body.exp;
    const positionID = req.body.positionID;
    const depID = req.body.depID;
    const groupID = req.body.groupID;

    
    if (!companyID) {
        //Kiểm tra id company khác null
        functions.setError(res, "companyID required", 405);

    } else if (!userName) {
       
         //Kiểm tra tên nhân viên khác null
        functions.setError(res, "user name required", 406);

    } else if (!phoneTK) {
        //Kiểm tra sdt khác null
        functions.setError(res, "number phone required", 407);

    } else if (!await functions.checkPhoneNumber(phoneTK)) {
        //Kiểm tra sdt dan ky tk có phải là số không
        functions.setError(res, "number phone invalid", 408);

    }else if (!password) {
        //Kiểm tra password khác null
        functions.setError(res, "password required", 409);

    }else if (!address) {
        //Kiểm tra address khác null
        functions.setError(res, "address required", 410);

    } else if (!birthday) {
        //Kiểm tra ngay sinh khác null
        functions.setError(res, "birthday required", 411);

    }else if (!exp) {
        //Kiểm tra kinh nghiem lam viec khác null
        functions.setError(res, "exp required", 412);

    }else if (!candiHocVan) {
        //Kiểm tra trinh do hoc van khác null
        functions.setError(res, "candiHocVan required", 413);

    }
    else {
        let checkPhoneNumber = await functions.checkPhoneNumber(phoneTK);
        if(checkPhoneNumber) {
            let checkUser = await functions.getDatafindOne(Employee, { phoneTK:phoneTK, type: 2 });
            if(checkUser) {
                return functions.setError(res, "Số điện thoại đã được đăng kí", 200);
            }
        }
        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 0 có giá trị max thì bằng max + 1 
        let maxID = await functions.getMaxIDQLC(Employee);
        if (!maxID) {
            maxID = 0
        };
        let idQLC = Number(maxID) + 1;
        const maxIDUser = await Employee.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIDUser;
        if (maxIDUser) {
            newIDUser = Number(maxIDUser._id) + 1;
        } else newIDUser = 1;
        const employee = new Employee({
            _id: newIDUser,
            idQLC : idQLC,
            userName : userName,
            phoneTK :  phoneTK,
            password : password,
            phone: phone? phone: null,
            address : address,
            type : type,
            createdAt: new Date(Date.now()),
            inForPerson: {
                companyID: companyID,
                gender: gender,
                birthday: birthday,
                candiHocVan: candiHocVan,
                married: married,
                exp: exp,
                positionID: positionID,
                depID: depID,
                groupID: groupID
            },
            // 'inForPerson.groupID' : groupID,
        });

        await employee.save()
            .then(() => {
                functions.success(res, "user created successfully", employee)
            })
            .catch((err) => {
                functions.setError(res, err.message, 500);
            })
    }
};

// lay ra danh sach tat ca nhan vien
exports.getEmployee = async(req, res, next) => {
    try {
        let idQLC = req.query.idQLC;
        let type = 2;
        if (idQLC) {
            let employee = await Employee.findOne({idQLC: idQLC}, 
                {phoneTK: 1, userName:1, phone:1, emailContact:1, address:1, 
                    inForPerson: {gender:1, birthday:1, condiHocVan:1, married:1, positionID:1, depID:1, groupID:1}
                });
            if (employee) {
                return functions.success(res, "Get employee by idQLC success", { employee: employee});
            }else {
                return functions.setError(res, "Employee not found", 500);
            }
        } else {
            //lay ra tat ca nhan vien bao gom cac truong phoneTK, useName, ...
            let employees = await Employee.find({type: type}, {phoneTK: 1, userName:1, phone:1, emailContact:1, address:1, inForPerson: {gender:1, birthday:1, condiHocVan:1, married:1, positionID:1, depID:1, groupID:1}});
            if (employees) {
                return functions.success(res, "Get all employee success", { employees: employees});
            }else {
                return functions.setError(res, "Employees not found", 500);
            }
        }
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}

//chinh sua thong tin nhan vien
exports.editEmployee = async (req, res) => {
    console.log(req.body);
    const idQLC = req.body.idQLC;
    const companyID = req.body.companyID;
    const type = 2;
    const userName = req.body.userName;
    const emailContact = req.body.emailContact;
    const phone = req.body.phone;
    const address = req.body.address;
    const gender = req.body.gender;
    const birthday = req.body.birthday;
    const candiHocVan = req.body.candiHocVan;
    const married = req.body.married;
    const exp = req.body.exp;
    const startWorkingTime = req.body.startWorkingTime;
    const positionID = req.body.positionID;
    const depID = req.body.depID;
    const groupID = req.body.groupID;

    
    if (!userName) {
        //Kiểm tra tên nhân viên khác null
        functions.setError(res, "user name required", 506);

    } else if (!idQLC) {
        //Kiểm tra idQLC khác null
        functions.setError(res, "idQLC required", 407);

    } else if (!emailContact) {
        //Kiểm tra sdt khác null
        functions.setError(res, "number phone required", 409);

    } else if (!await functions.checkEmail(emailContact)) {
        //Kiểm tra sdt dan ky tk có phải là số không
        functions.setError(res, "Email invalided", 410);

    }else if (!married) {
        //Kiểm tra password khác null
        functions.setError(res, "married required", 411);

    }else if (!address) {
        //Kiểm tra address khác null
        functions.setError(res, "address required", 412);

    } else if (!birthday) {
        //Kiểm tra ngay sinh khác null
        functions.setError(res, "birthday required", 413);

    }else if (!exp) {
        //Kiểm tra kinh nghiem lam viec khác null
        functions.setError(res, "exp required", 414);

    }else if (!candiHocVan) {
        //Kiểm tra trinh do hoc van khác null
        functions.setError(res, "candiHocVan required", 415);

    } else {
        const employee = await functions.getDatafindOne(Employee, { idQLC: idQLC , type : 2});
        if (!employee) {
            functions.setError(res, "employee does not exist!", 510);
        } else {
            await functions.getDatafindOneAndUpdate(Employee, { idQLC: idQLC, type : 2 }, {
                userName : userName,
                emailContact: emailContact,
                phone: phone,
                address: address,
                updatedAt: new Date(Date.now()),
                inForPerson: {
                    gender: gender,
                    birthday: birthday,
                    candiHocVan: candiHocVan,
                    married: married,
                    exp: exp,
                    startWorkingTime: startWorkingTime,
                    positionID: positionID,
                    depID: depID,
                    groupID: groupID
                }
            })

                .then((manager) => functions.success(res, "Deparment edited successfully", manager))
                .catch((err) => functions.setError(res, err.message, 511));
        }
    }
};

exports.deleteEmployee = async(req, res, next) => {
    try {
        let idQLC = req.query.idQLC;
        if (idQLC) {
            let employee = await functions.getDataDeleteOne(Employee ,{idQLC: idQLC});
            if (employee.deletedCount===1) {
                return functions.success(res, "Delete employee by idQLC success");
            }else{
                return functions.success(res, "Employee not found");
            }
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}

//tim kiem danh sach nhan vien theo cac dieu kien---------------------------------------------------------------------------
//theo exp
exports.getListEmployeeByExp = async(req, res, next) => {
    try {
        if (req.body) {
            let page = Number(req.body.page);
            let pageSize = Number(req.body.pageSize);
            let exp = Number(req.body.exp);
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let listEmployee = await functions.pageFindWithFields(Employee, 
                { "inForPerson.exp": {"$eq" : exp, "$exists" : true} }, 
                {phoneTK: 1, userName:1, phone:1, emailContact:1, address:1, 
                    inForPerson: {gender:true, birthday:true, condiHocVan:true, married:true, positionID:true, depID:true, groupID:true}
                }, 
                { _id: 1 }
                , skip, 
                limit
            )
            const totalCount = await Employee.countDocuments({ "inForPerson.exp": exp })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (listEmployee) {
                functions.success(res, "get list employee by experience success", { employees: { totalCount, totalPages, listEmployee: listEmployee } });
            }
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

//theo education
exports.getListEmployeeByEducation = async(req, res, next) => {
    try {
        if (req.body) {
            let page = Number(req.body.page);
            let pageSize = Number(req.body.pageSize);
            let candiHocVan = Number(req.body.candiHocVan);
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let listEmployee = await functions.pageFindWithFields(Employee, 
                { "inForPerson.candiHocVan": {"$eq" : candiHocVan, "$exists" : true} }, 
                {phoneTK: 1, userName:1, phone:1, emailContact:1, address:1, 
                    inForPerson: {gender:true, birthday:true, condiHocVan:true, married:true, positionID:true, depID:true, groupID:true}
                }, 
                { _id: 1 }
                , skip, 
                limit
            )
            const totalCount = await Employee.countDocuments({ "inForPerson.candiHocVan": candiHocVan })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (listEmployee) {
                functions.success(res, "get list employee by education success", { employees: { totalCount, totalPages, listEmployee: listEmployee } });
            }
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

//theo department
exports.getListEmployeeByDepartment = async(req, res, next) => {
    try {
        if (req.body) {
            let page = Number(req.body.page);
            let pageSize = Number(req.body.pageSize);
            let depID = Number(req.body.depID);
            if(!page){
                return functions.setError(res, "Missing input page", 401);
            }
            if(!pageSize){
                return functions.setError(res, "Missing input pageSize", 402);
            }
            if(!depID){
                return functions.setError(res, "Missing input page", 403);
            }
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let listEmployee = await functions.pageFindWithFields(Employee, 
                { "inForPerson.depID": {"$eq" : depID, "$exists" : true} }, 
                {phoneTK: 1, userName:1, phone:1, emailContact:1, address:1, 
                    inForPerson: {gender:true, birthday:true, condiHocVan:true, married:true, positionID:true, depID:true, groupID:true}
                }, 
                { _id: 1 }
                , skip, 
                limit
            )
            const totalCount = await Employee.countDocuments({ "inForPerson.depID": depID })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (listEmployee) {
                functions.success(res, "get list employee by department success", { employees: { totalCount, totalPages, listEmployee: listEmployee } });
            }
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}
//theo position
exports.getListEmployeeByPosition = async(req, res, next) => {
    try {
        if (req.body) {
            let page = Number(req.body.page);
            let pageSize = Number(req.body.pageSize);
            let positionID = Number(req.body.positionID);
            if(!page){
                return functions.setError(res, "Missing input page", 401);
            }
            if(!pageSize){
                return functions.setError(res, "Missing input pageSize", 402);
            }
            if(positionID==undefined){
                return functions.setError(res, "Missing input page", 403);
            }
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let listEmployee = await functions.pageFindWithFields(Employee, 
                { "inForPerson.positionID": {"$eq" : positionID, "$exists" : true} }, 
                {phoneTK: 1, userName:1, phone:1, emailContact:1, address:1, 
                    inForPerson: {gender:true, birthday:true, condiHocVan:true, married:true, positionID:true, positionID:true, groupID:true}
                }, 
                { _id: 1 }
                , skip, 
                limit
            )
            const totalCount = await Employee.countDocuments({ "inForPerson.positionID": positionID })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (listEmployee) {
                functions.success(res, "get list employee by position success", { employees: { totalCount, totalPages, listEmployee: listEmployee } });
            }
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}
//theo phone
exports.getListEmployeeByBirthday = async(req, res, next) => {
    try {
        if (req.body) {
            let page = Number(req.body.page);
            let pageSize = Number(req.body.pageSize);
            let birthday = req.body.birthday;
            if(!page){
                return functions.setError(res, "Missing input page", 401);
            }
            if(!pageSize){
                return functions.setError(res, "Missing input pageSize", 402);
            }
            if(birthday==undefined){
                return functions.setError(res, "Missing input page", 403);
            }
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let listEmployee = await functions.pageFindWithFields(Employee, 
                { "inForPerson.birthday": {"$eq" : birthday, "$exists" : true} }, 
                {phoneTK: 1, userName:1, phone:1, emailContact:1, address:1, 
                    inForPerson: {gender:true, birthday:true, condiHocVan:true, married:true, positionID:true, depID:true, groupID:true}
                }, 
                { _id: 1 }
                , skip, 
                limit
            )
            const totalCount = await Employee.countDocuments({ "inForPerson.birthday": birthday })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (listEmployee) {
                functions.success(res, "get list employee by birthday success", { employees: { totalCount, totalPages, listEmployee: listEmployee } });
            }
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}