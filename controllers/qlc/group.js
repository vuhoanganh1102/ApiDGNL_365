const Group = require('../../models/qlc/Group')
const functions = require("../../services/functions")
exports.getListGroup = async (req, res) => {
    await functions.getDatafind(Group, {})
        .then((group) => functions.success(res, "", group))
        .catch((err => functions.setError(res, err.message, 701)))
};

exports.getGroupById = async (req, res) => {
    const _id = req.params.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 702)
    } else {
        const group = await Group.findById(_id)
        if (!group) {
            functions.setError(res, "Group cannot be found or does not exist", 703)
        } else {
            functions.success(res, "Group found", group)
        }
    }


};

exports.createGroup = async (req, res) => {
    const { teamId, groupName, groupOrder } = req.body;

    if (!teamId) {
        //Kiểm tra Id tổ khác null
        functions.setError(res, "Team Id required", 704);

    } else if (typeof teamId !== "number") {
        //Kiểm tra Id tổ có phải số không
        functions.setError(res, "Team Id must be a number", 705);

    } else if (!groupName) {
        //Kiểm tra tên nhóm khác null
        functions.setError(res, "Group name required", 706);

    } else if (!groupOrder) {
        //Kiểm tra xếp thứ tự khác null
        functions.setError(res, "Group order required", 707);

    } else if (typeof groupOrder !== "number") {
        //Kiểm tra xếp thứ tự có phải là số không
        functions.setError(res, "Group order must be a number", 708);

    } else {
        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 1
        let maxID = await functions.getMaxID(Group);
        if (!maxID) {
            maxID = 0;
        };
        const _id = Number(maxID) + 1;

        const group = new Group({
            _id: _id,
            teamId: teamId,
            groupName: groupName,
            managerId: null,
            groupOrder: groupOrder
        })

        await group.save()
            .then(() => {
                functions.success(res, "Group created successfully", group)
            })
            .catch((err) => {
                functions.setError(res, err.message, 709)
            });
    }
};

exports.editGroup = async (req, res) => {
    const _id = req.params.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 702)
    } else {
        const { teamId, groupname, groupOrder } = req.body;

        if (!teamId) {
            //Kiểm tra Id tổ khác null
            functions.setError(res, "Team Id required", 704);

        } else if (typeof teamId !== "number") {
            //Kiểm tra Id tổ có phải số không
            functions.setError(res, "Team Id must be a number", 705);

        } else if (!groupName) {
            //Kiểm tra tên nhóm khác null
            functions.setError(res, "Group name required", 706);

        } else if (!groupOrder) {
            //Kiểm tra xếp thứ tự khác null
            functions.setError(res, "Group order required", 707);

        } else if (typeof groupOrder !== "number") {
            //Kiểm tra xếp thứ tự có phải là số không
            functions.setError(res, "Group order must be a number", 708);

        } else {
            const group = await functions.getDatafindOne(Group, { _id: _id });
            if (!group) {
                functions.setError(res, "Group does not exist", 710)
            } else {

                await functions.getDatafindOneAndUpdate(Team, { _id: _id }, {
                    teamId: teamId,
                    groupName: groupName,
                    groupOrder: groupOrder,
                })
                    .then((group) => functions.success(res, "Group edited successfully".group))
                    .catch(err => functions.setError(res, err.message), 711)
            }
        }
    }
};

exports.deleteGroup = async (req, res) => {
    const _id = req.params.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 702)
    } else {
        const group = await functions.getDatafindOne(Group, { _id: _id });
        if (!group) {
            functions.setError(res, "Group does not exist", 710)
        } else {
            functions.getDataDeleteOne(Group, { _id: _id })
                .then(() => functions.success(res, "Delete group successfully", group))
                .catch(err => functions.setError(res, err.message, 712))
        }
    }


};

exports.deleteAllGroups = async (req, res) => {
    if (!await functions.getMaxID(Group)) {
        functions.setError(res, "No group existed", 713)
    } else {
        Group.deleteMany()
            .then(() => functions.success(res, "Delete all groups successfully"))
            .catch(() => functions.error(res, err.message, 714))
    }
}