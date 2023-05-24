const Team = require('../../models/qlc/Team');
const functions = require("../../services/functions");

exports.getListTeam = async (req, res) => {
    await functions.getDatafind(Team, {})
        .then((team) => functions.success(res, "", team))
        .catch(err => functions.setError(err, 601, err.message));
};

exports.getTeamById = async (req, res) => {
    const _id = req.params.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 602);
    } else {
        const team = await Team.findById(_id);
        if (!team) {
            functions.setError(res, "Team cannot be or does not exist", 603);
        } else {
            functions.success(res, "Team found", team);
        }
    }


};

exports.createTeam = async (req, res) => {

    const { deparmentId, teamName, teamOrder } = req.body;

    if (!deparmentId) {
        //Kiểm tra Id phòng ban có khác null
        functions.setError(res, "Deparment Id required", 604);
    } else if (typeof deparmentId !== "number") {
        //Kiểm tra Id phòng ban có thuộc kiểu number không
        functions.setError(res, "Deparment Id must be a number", 605);
    } else if (!teamName) {
        //Kiểm tra tên của tổ có khác null
        functions.setError(res, "Team name required", 606);
    } else if (!teamOrder) {
        //Kiểm tra sắp xếp thứ tự có khác null
        functions.setError(res, "Team order required", 607);
    } else if (typeof teamOrder !== "number") {
        //Kiểm tra sắp xếp thứ tự có phải kiểu number hay không
        functions.setError(res, "Team order must be a number", 608);
    } else {

        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 1
        let maxID = await functions.getMaxID(Team);
        if (!maxID) {
            maxID = 0;
        };
        const _id = Number(maxID) + 1;
        const team = new Team({
            _id: _id,
            deparmentId: deparmentId,
            teamName: teamName,
            managerId: null,
            teamOrder: teamOrder
        });

        await team.save()
            .then(() => {
                functions.success(res, "Team created successfully", team)
            })
            .catch(err => {
                functions.setError(res, err.message, 609);
            })
    }
};

exports.editTeam = async (req, res) => {
    const _id = req.params.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 602)
    } else {
        const { deparmentId, teamName, teamOrder } = req.body

        if (!deparmentId) {
            //Kiểm tra Id phòng ban có khác null
            functions.setError(res, "Deparment Id required", 604);
        } else if (typeof deparmentId !== "number") {
            //Kiểm tra Id phòng ban có thuộc kiểu number không
            functions.setError(res, "Deparment Id must be a number", 605);
        } else if (!teamName) {
            //Kiểm tra tên của tổ có khác null
            functions.setError(res, "Team name required", 606);
        } else if (!teamOrder) {
            //Kiểm tra sắp xếp thứ tự có khác null
            functions.setError(res, "Team order required", 607);
        } else if (typeof teamOrder !== "number") {
            //Kiểm tra sắp xếp thứ tự có phải kiểu number hay không
            functions.setError(res, "Team order must be a number", 608)
        } else {
            const team = await functions.getDatafindOne(Team, { _id: _id });
            if (!team) {
                functions.setError(res, "Team not exist", 610);
            } else {
                await functions.getDatafindOneAndUpdate(Team, { _id: _id }, {
                    deparmentId: dearmentId,
                    teamName: teamName,
                    teamOrder: teamOrder
                })
                    .then((team) => functions.success(res, "Team edited successfully", team))
                    .catch((err) => functions.setError(res, err.message, 611));
            }

        }
    }


};

exports.deleteTeam = async (req, res) => {
    const _id = req.params.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 602)
    } else {
        const team = await functions.getDatafindOne(Team, { _id: _id });
        if (!team) {
            functions.setError(res, "Team does not exist", 610);
        } else {
            functions.getDataDeleteOne(Team, { _id: _id })
                .then(() => functions.success(res, "Delete team successfully", team))
                .catch(err => functions.setError(res, err.message, 612));
        }
    }


};

exports.deleteAllTeams = async (req, res) => {
    if (!await functions.getMaxID(Team)) {
        functions.setError(res, "No Team existed", 613);
    } else {
        Team.deleteMany()
            .then(() => functions.success(res, "Delete all teams successfully"))
            .catch(() => functions.error(res, err.message, 614));
    }
}