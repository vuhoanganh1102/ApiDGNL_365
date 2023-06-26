const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');
const Permision = require('../../models/hr/Permision');
const PermisionUser = require('../../models/hr/PermisionUser');
const Users = require('../../models/Users');
const Candidates = require('../../models/hr/Candidates');
const AchievementFors = require('../../models/hr/AchievementFors');
const InfringesFors = require('../../models/hr/InfringesFors');

//---------api home
exports.getListInfo= async(req, res, next) => {
    try {
        let comId = req.infoLogin.comId;
        let totalEmployee = await Users.countDocuments({"inForPerson.employee.com_id": comId});
        let totalAchievement = await AchievementFors.countDocuments({comId: comId});
        let totalInfringe = await InfringesFors.countDocuments({comId: comId});
        let totalCandi = await Candidates.countDocuments({comId: comId});
        let totalCandiInter = await Candidates.countDocuments({status: 1});
        let totalCandiWork = await Candidates.countDocuments({status: 2});

        return functions.success(res, `Get list infomaiton for page home success`, {totalEmployee, totalAchievement, totalInfringe, totalCandi, totalCandiInter, totalCandiWork});
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}