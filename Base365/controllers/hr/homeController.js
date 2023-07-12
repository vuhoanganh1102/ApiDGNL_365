const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');
const Users = require('../../models/Users');
const Candidates = require('../../models/hr/Candidates');
const AchievementFors = require('../../models/hr/AchievementFors');
const InfringesFors = require('../../models/hr/InfringesFors');
const GetJob = require('../../models/hr/GetJob');
const Candidate = require('../../models/hr/Candidates');

//---------api home
exports.getListInfo= async(req, res, next) => {
    try {
        let comId = req.infoLogin.comId;

        var currentDate = new Date(); // Lấy ngày hiện tại
        // Thiết lập ngày bắt đầu
        var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây và mili-giây về 0

        // Thiết lập ngày kết thúc
        var nextMonth = currentDate.getMonth() + 1;
        var endDate = new Date(currentDate.getFullYear(), nextMonth, 0);
        endDate.setHours(23, 59, 59, 999); // Đặt giờ, phút, giây và mili-giây về cuối ngày

        let totalEmployee = await Users.countDocuments({"inForPerson.employee.com_id": comId});
        let totalAchievement = await AchievementFors.countDocuments({comId: comId, createdAt: {$gte: startDate, $lt: endDate}});
        let totalInfringe = await InfringesFors.countDocuments({comId: comId, createdAt: {$gte: startDate, $lt: endDate}});
        
        let totalCandi = await Candidates.countDocuments({comId: comId, isDelete: 0});
        let totalCandidateInterview = await Candidate.aggregate([
                {$match: {comId: comId, isDelete: 0}},
                {
                    $lookup: {
                        from: "HR_ScheduleInterviews",
                        localField: "id",
                        foreignField: "canId",
                        as: "Interview"
                    }
                },
                {$match: {"Interview.isSwitch": 0}},
                {
                    $count: "totalDocuments"
                }
            ]);
        let totalCandidateGetJob = await Candidate.aggregate([
                {$match: {comId: comId, isDelete: 0}},
                {
                    $lookup: {
                        from: "HR_GetJobs",
                        localField: "id",
                        foreignField: "canId",
                        as: "GetJob"
                    }
                },
                {$match: {"GetJob.isSwitch": 0}},
                {
                    $count: "totalDocuments"
                }
            ]);
        totalCandidateGetJob = totalCandidateGetJob.length>0? totalCandidateGetJob[0].totalDocuments: 0;
        totalCandidateInterview = totalCandidateInterview.length>0? totalCandidateInterview[0].totalDocuments: 0;

        return functions.success(res, `Get list infomaiton for page home success`, {totalEmployee, totalAchievement, totalInfringe, totalCandi, totalCandidateInterview, totalCandidateGetJob});
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, e.massage, 500);
    }
}