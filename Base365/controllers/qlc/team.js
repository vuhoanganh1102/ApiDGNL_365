const Team = require('../../models/qlc/Team');
const functions = require("../../services/functions");
//tìm kiếm danh sách tổ
exports.getListTeam = async (req, res) => {
    await functions.getDatafind(Team, {})
        .then((team) => functions.success(res, "", team))
        .catch(err => functions.setError(err, 601, err.message));
};
//tìm kiếm tổ theo id
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
//API đếm số lượng nhân viên trong tổ
exports.countUserInTeam = async (req, res) => {
    try{
     const {depID, companyID, teamID} = req.body;
     console.log(depID, companyID, teamID)
      const numberUser = await functions.findCount(Users,{ "inForPerson.companyID":companyID , "inForPerson.depID": depID,"inForPerson.teamID": teamID, type: 2})
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
 //Tạo mới dữ liệu của một tổ
exports.createTeam = async (req, res) => {

    const { depID, teamName, companyID } = req.body;

    if (!depID) {
        //Kiểm tra Id phòng ban có khác null
        functions.setError(res, "Deparment Id required", 604);
    } else if (isNaN(depID) ) {
        //Kiểm tra Id phòng ban có thuộc kiểu number không
        functions.setError(res, "Deparment Id must be a number", 605);
    } else if (!teamName) {
        //Kiểm tra tên của tổ có khác null
        functions.setError(res, "Team name required", 606);
    } else if (!companyID) {
        //Kiểm tra sắp xếp thứ tự có khác null
        functions.setError(res, "Team order required", 607);
    } else if (isNaN(companyID)  ) {
        //Kiểm tra sắp xếp thứ tự có phải kiểu number hay không
        functions.setError(res, "Team order must be a number", 608);
    } else {

        //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 1
        let maxID = await functions.getMaxID(Team);
        const team = new Team({
            _id:  Number(maxID) + 1 || 1,
            companyID: companyID,
            depID: depID,
            teamName: teamName,
            deputyTeamId: deputyTeamId || null,
            managerTeamId: managerTeamId ||null
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
//Chỉnh sửa dự liệu của một tổ
exports.editTeam = async (req, res) => {
    const _id = req.params.id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 602)
    } else {
        const { depID, teamName, companyID } = req.body

        if (!depID) {
            //Kiểm tra Id phòng ban có khác null
            functions.setError(res, "Deparment Id required", 604);
        } else if (isNaN(depID)  ) {
            //Kiểm tra Id phòng ban có thuộc kiểu number không
            functions.setError(res, "Deparment Id must be a number", 605);
        } else if (!teamName) {
            //Kiểm tra tên của tổ có khác null
            functions.setError(res, "Team name required", 606);
        } else if (!companyID) {
            //Kiểm tra sắp xếp thứ tự có khác null
            functions.setError(res, "Team order required", 607);
        } else if (isNaN(companyID)  ) {
            //Kiểm tra sắp xếp thứ tự có phải kiểu number hay không
            functions.setError(res, "Team order must be a number", 608)
        } else {
            const team = await functions.getDatafindOne(Team, { _id: _id });
            if (!team) {
                functions.setError(res, "Team not exist", 610);
            } else {
                await functions.getDatafindOneAndUpdate(Team, { _id: _id }, {
                    depID: dearmentId,
                    teamName: teamName,
                    companyID: companyID,
                    deputyTeamId: deputyTeamId || null,
                    managerTeamId: managerTeamId ||null
                })
                    .then((team) => functions.success(res, "Team edited successfully", team))
                    .catch((err) => functions.setError(res, err.message, 611));
            }

        }
    }


};
//Xóa dữ liệu của một tổ
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
//Xoá toàn bộ dữ liệu tổ
exports.deleteAllTeams = async (req, res) => {
    if (!await functions.getMaxID(Team)) {
        functions.setError(res, "No Team existed", 613);
    } else {
        Team.deleteMany()
            .then(() => functions.success(res, "Delete all teams successfully"))
            .catch(() => functions.error(res, err.message, 614));
    }
}