const Individual = require("../../models/Users");
const functions = require("../../services/functions");

//tao moi 1 ca nhan
exports.createIndividual = async (req, res) => {

    const type = 0;
    const phoneTK = req.body.phoneTK;
    const userName = req.body.userName;
    const password = req.body.password;
    const phone = req.body.phone;
    const address = req.body.address;
    
    if (!phoneTK) {
        //Kiểm tra id company khác null
        functions.setError(res, "companyID required", 405);
    } else if (!userName) {
         //Kiểm tra tên nhân viên khác null
        functions.setError(res, "user name required", 406);
    } else if (!password) {
        //Kiểm tra password khác null
        functions.setError(res, "password required", 407);

    }else if (!address) {
        //Kiểm tra address khác null
        functions.setError(res, "address required", 408);

    }
    else {
        let checkPhoneNumber = await functions.checkPhoneNumber(phoneTK);
        if(checkPhoneNumber) {
            let checkUser = await functions.getDatafindOne(Individual, { phoneTK:phoneTK, type: type });
            if(checkUser) {
                return functions.setError(res, "Số điện thoại đã được đăng kí", 200);
            }
        }
        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 0 có giá trị max thì bằng max + 1 
        let maxID = await functions.getMaxIDQLC(Individual);
        if (!maxID) {
            maxID = 0
        };
        let idQLC = Number(maxID) + 1;
        const maxIDUser = await Individual.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIDUser;
        if (maxIDUser) {
            newIDUser = Number(maxIDUser._id) + 1;
        } else newIDUser = 1;
        const individual = new Individual({
            _id: newIDUser,
            idQLC : idQLC,
            userName : userName,
            phoneTK :  phoneTK,
            password : password,
            phone: phone? phone: null,
            address : address,
            type : type,
            createdAt: new Date(Date.now())
        });

        await individual.save()
            .then(() => {
                functions.success(res, "individual created successfully", individual)
            })
            .catch((err) => {
                functions.setError(res, err.message, 500);
            })
    }
};

// lay ra danh sach tat ca ca nhan
exports.getIndividual = async(req, res, next) => {
    try {
        let idQLC = req.query.idQLC;
        let type = 0;
        if (idQLC) {
            let individual = await Individual.findOne({idQLC: idQLC, type: type}, 
                {phoneTK: 1, userName:1, phone:1, emailContact:1, address:1, 
                    inForPerson: {gender:1, birthday:1, condiHocVan:1, married:1, positionID:1, depID:1, groupID:1}
                });
            if (individual) {
                return functions.success(res, "Get individual by idQLC success", { individual: individual});
            }else {
                return functions.setError(res, "Individual not found", 500);
            }
        } else {
            //lay ra tat ca ca nhan bao gom cac truong phoneTK, useName, ...
            let individuals = await Individual.find({type: type}, {phoneTK: 1, userName:1, phone:1, emailContact:1, address:1, inForPerson: {gender:1, birthday:1, condiHocVan:1, married:1, positionID:1, depID:1, groupID:1}});
            if (individuals) {
                return functions.success(res, "Get all individual success", { individuals: individuals});
            }else {
                return functions.setError(res, "Individuals not found", 500);
            }
        }
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}

//chinh sua thong tin ca nhan
exports.editIndividual = async (req, res) => {
    console.log(req.body);
    const idQLC = req.body.idQLC;
    // const companyID = req.body.companyID;
    const type = 0;
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
    // const positionID = req.body.positionID;
    // const depID = req.body.depID;
    // const groupID = req.body.groupID;

    
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
        const individual = await functions.getDatafindOne(Individual, { idQLC: idQLC , type : type});
        if (!individual) {
            functions.setError(res, "individual does not exist!", 510);
        } else {
            await functions.getDatafindOneAndUpdate(Individual, { idQLC: idQLC, type : type }, {
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
                    startWorkingTime: startWorkingTime
                }
            })

                .then((manager) => functions.success(res, "Individual edited successfully", manager))
                .catch((err) => functions.setError(res, err.message, 511));
        }
    }
};

exports.deleteIndividual = async(req, res, next) => {
    try {
        let idQLC = req.query.idQLC;
        if (idQLC) {
            let individual = await functions.getDataDeleteOne(Individual ,{idQLC: idQLC});
            if (individual.deletedCount===1) {
                return functions.success(res, "Delete individual by idQLC success");
            }else{
                return functions.success(res, "Individual not found");
            }
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}

//tim kiem danh sach ca nhan theo cac dieu kien---------------------------------------------------------------------------
//theo exp
exports.getListIndividualByExp = async(req, res, next) => {
    try {
        if (req.body) {
            let page = Number(req.body.page);
            let pageSize = Number(req.body.pageSize);
            let exp = Number(req.body.exp);
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let listIndividual = await functions.pageFindWithFields(Individual, 
                { "inForPerson.exp": {"$eq" : exp, "$exists" : true} }, 
                {phoneTK: 1, userName:1, phone:1, emailContact:1, address:1, 
                    inForPerson: {gender:true, birthday:true, condiHocVan:true, married:true, positionID:true, depID:true, groupID:true}
                }, 
                { _id: 1 }
                , skip, 
                limit
            )
            const totalCount = await Individual.countDocuments({ "inForPerson.exp": exp })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (listIndividual) {
                functions.success(res, "get list individual by experience success", { individuals: { totalCount, totalPages, listIndividual: listIndividual } });
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
exports.getListIndividualByEducation = async(req, res, next) => {
    try {
        if (req.body) {
            let page = Number(req.body.page);
            let pageSize = Number(req.body.pageSize);
            let candiHocVan = Number(req.body.candiHocVan);
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let listIndividual = await functions.pageFindWithFields(Individual, 
                { "inForPerson.candiHocVan": {"$eq" : candiHocVan, "$exists" : true} }, 
                {phoneTK: 1, userName:1, phone:1, emailContact:1, address:1, 
                    inForPerson: {gender:true, birthday:true, condiHocVan:true, married:true, positionID:true, depID:true, groupID:true}
                }, 
                { _id: 1 }
                , skip, 
                limit
            )
            const totalCount = await Individual.countDocuments({ "inForPerson.candiHocVan": candiHocVan })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (listIndividual) {
                functions.success(res, "get list individual by education success", { individuals: { totalCount, totalPages, listIndividual: listIndividual } });
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
exports.getListIndividualByBirthday = async(req, res, next) => {
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
            let listIndividual = await functions.pageFindWithFields(Individual, 
                { "inForPerson.birthday": {"$eq" : birthday, "$exists" : true} }, 
                {phoneTK: 1, userName:1, phone:1, emailContact:1, address:1, 
                    inForPerson: {gender:true, birthday:true, condiHocVan:true, married:true, positionID:true, depID:true, groupID:true}
                }, 
                { _id: 1 }
                , skip, 
                limit
            )
            const totalCount = await Individual.countDocuments({ "inForPerson.birthday": birthday })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (listIndividual) {
                functions.success(res, "get list individual by birthday success", { individuals: { totalCount, totalPages, listIndividual: listIndividual } });
            }
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}