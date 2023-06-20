const Team = require('../../models/qlc/Team');
const functions = require("../../services/functions");
const Users = require("../../models/Users")

//tìm kiếm danh sách tổ
   
    exports.getListTeam = async(req, res) => {
        try{
            let companyID = req.body.companyID
            let _id = req.body.id
            let teamID = req.body.teamID || null
            console.log(_id,companyID)
            let data = []
            let numberUser = {}
            let condition = {};
            if((companyID)==undefined){
                functions.setError(res,"lack of input")
            }else if(isNaN(companyID)){
                functions.setError(res,"id must be a Number")
            }else{
                if(companyID) condition.companyID = companyID
                if(_id) condition._id = _id
                console.log(_id,companyID)
                numberUser = await functions.findCount(Users,{ "inForPerson.companyID":companyID , "inForPerson.teamID": teamID, type: 2})
                console.log(numberUser)
                
                data = await Team.find(condition).select('teamName depID deputyTeamId managerTeamId ')
                if (data) {
                    return await functions.success(res, 'Lấy thành công', { data,numberUser });
                };
                return functions.setError(res, 'Không có dữ liệu', 404);
            }
       
        }catch(err){
        console.log(err);
        
        functions.setError(res,err.message)
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

    const { depID, teamName, companyID ,deputyTeamId,managerTeamId } = req.body;

    if (!depID) {
        //Kiểm tra Id phòng ban có khác null
        functions.setError(res, "Deparment Id required", 604);
    } else if (isNaN(depID) ) {
        //Kiểm tra Id phòng ban có thuộc kiểu number không
        functions.setError(res, "Deparment Id must be a number", 605);
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
                functions.success(res, "Team created successfully", {team})
            })
            .catch(err => {
                functions.setError(res, err.message, 609);
            })
    }
};
//Chỉnh sửa dự liệu của một tổ
exports.editTeam = async (req, res) => {
    const _id = req.body._id;

    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 602)
    } else {
        const { depID, teamName, companyID ,deputyTeamId,managerTeamId} = req.body

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
                await functions.getDatafindOneAndUpdate(Team, {companyID: companyID, _id: _id }, {
                    depID: depID,
                    teamName: teamName,
                    companyID: companyID,
                    deputyTeamId: deputyTeamId || null,
                    managerTeamId: managerTeamId ||null
                })
                    .then((team) => functions.success(res, "Team edited successfully", {team}))
                    .catch((err) => functions.setError(res, err.message, 611));
            }

        }
    }


};
//Xóa dữ liệu của một tổ
exports.deleteTeam = async (req, res) => {
    const {_id, companyID} = req.body
    if((companyID&&_id)== undefined){
        functions.setError(res, "lack of input", 502);
    }else if (isNaN(_id)) {
        functions.setError(res, "Id must be a number", 602)
    } else {
        const team = await functions.getDatafindOne(Team, {companyID:companyID, _id: _id });
        if (!team) {
            functions.setError(res, "Team does not exist", 610);
        } else {
            functions.getDataDeleteOne(Team, {companyID:companyID, _id: _id })
                .then(() => functions.success(res, "Delete team successfully", {team}))
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