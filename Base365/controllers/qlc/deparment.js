const Deparment = require("../../models/qlc/Deparment")
const functions = require("../../services/functions")

exports.getListDeparment = async (req, res) => {
    await functions.getDatafind(Deparment, {})
        .then((deparments) => functions.success(res, "", deparments))
        .catch((err) => functions.setError(res, err.message, 501));
}

exports.getDeparmentById = async (req, res) => {
    const _id = req.params.id;
    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 502);
    } else {
        const deparment = await Deparment.findById(_id);
        if (!deparment) {
            functions.setError(res, "Deparment cannot be found or does not exist", 503);
        } else {
            functions.success(res, "Deparment found", deparment);
        }
    }
    //

};

exports.createDeparment = async (req, res) => {

    const { companyID, deparmentName } = req.body;

    if (!companyID) {
        //Kiểm tra Id công ty khác null
        functions.setError(res, "Company Id required", 504);

    } else if (typeof companyID !== "number") {
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
                functions.success(res, "Deparment created successfully", deparment)
            })
            .catch((err) => {
                functions.setError(res, err.message, 509);
            })
    }
};

exports.editDeparment = async (req, res) => {
    const _id = req.params.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 502)
    } else {
        const { companyID, deparmentName, managerId } = req.body;

        if (!companyID) {
            //Kiểm tra Id công ty khác null
            functions.setError(res, "Company ID required", 504);

        } else if (typeof companyID !== "number") {
            //Kiểm tra Id công ty có phải số không
            functions.setError(res, "Company ID must be a number", 505);

        } else if (!deparmentName) {
            //Kiểm tra ID phòng ban
            functions.setError(res, "ID Deparment required", 506);

        } else if (!managerId) {
            //Kiểm tra xếp thứ tự có khác null
            functions.setError(res, "Deparment order required", 507);

        } else if (typeof managerId !== "number") {
            //Kiểm tra xếp thứ tự có phải là số không
            functions.setError(res, "Deparment order must be a number", 508);

        } else {

            const deparment = await functions.getDatafindOne(Deparment, { _id: _id });
            if (!deparment) {
                functions.setError(res, "Deparment does not exist!", 510);
            } else {
                await functions.getDatafindOneAndUpdate(Deparment, { _id: _id }, {
                    companyID: companyID,
                    deparmentName: deparmentName,
                    managerId: managerId,
                    deputyId: deputyId || null,
                })
                    .then((deparment) => functions.success(res, "Deparment edited successfully", deparment))
                    .catch((err) => functions.setError(res, err.message, 511));
            }
        }
    }
};

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

exports.deleteAllDeparmants = async (req, res) => {

    if (!await functions.getMaxID(Deparment)) {
        functions.setError(res, "No deparment existed", 513);
    } else {
        Deparment.deleteMany()
            .then(() => functions.success(res, "Delete all deparments successfully"))
            .catch(err => functions.setError(res, err.message, 514));
    }

};