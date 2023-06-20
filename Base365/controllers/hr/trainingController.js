const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');
const JobDescription = require('../../models/hr/JobDescriptions');
const folderFile = 'job';

// lay ra danh sach tat ca cac quy trinh tuyen dung cua cty
exports.getListJobDescription= async(req, res, next) => {
    try {
        let {page, pageSize, name} = req.body;
        if(!page || !pageSize){
            return functions.setError(res, "Missing input page or pageSize", 401);
        }
        page = Number(req.body.page);
        pageSize = Number(req.body.pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        
        let listCondition = {comId: req.comId};

        // dua dieu kien vao ob listCondition
        if(name) listCondition.name =  new RegExp(name);
        const listJob = await functions.pageFind(JobDescription, listCondition, { _id: 1 }, skip, limit); 
        const totalCount = await functions.findCount(JobDescription, listCondition);
        return functions.success(res, "Get list recruitment success", {totalCount: totalCount, data: listJob });
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

exports.createJobDescription = async(req, res, next) => {
    try {
        let {name, depName, des, jobRequire} = req.body;
        if(!name || !depName || !des || !jobRequire) {
            return functions.setError(res, "Missing input value!", 404);
        }
        //lay id max
        const comId = req.comId;
        const maxIdJob = await JobDescription.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdJob;
        if (maxIdJob) {
            newIdJob = Number(maxIdJob.id) + 1;
        } else newIdJob = 1;

        let roadMap = req.files.roadMap;
        if(!await hrService.checkFile(roadMap.path)){
            return functions.setError(res, 'ảnh sai định dạng hoặc lớn hơn 20MB', 405);
        }
        await hrService.uploadFile(folderFile,comId,roadMap);
        let linkFile = await hrService.createLinkFile(folderFile, comId, roadMap.name);
        //tao quy trinh
        let job = new JobDescription({
            id: newIdJob,
            name: name,
            depName: depName,
            des: des,
            jobRequire: jobRequire,
            roadMap: linkFile,
            comId: req.comId
        });
        job = await job.save();
        console.log(job);
        
        return functions.success(res, 'Create recruitment success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.softDeleteJobDescription = async(req, res, next) => {
    try {
        let jobId = req.query.jobId;
        if(!jobId){
            return functions.setError(res, "Missing input jobId", 404);
        }
        let job = await JobDescription.findOneAndUpdate({id: jobId}, {
            deletedAt: Date.now(),
            isDelete: 1
        })
        if(!job) {
            return functions.setError(res, "JobDescription not found!", 505);
        }
        return functions.success(res, "Soft delete JobDescription success!");
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}