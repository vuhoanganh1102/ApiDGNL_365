const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');
const JobDescription = require('../../models/hr/JobDescriptions');
const ProcessTraining = require('../../models/hr/ProcessTraining');
const StageProcessTraining = require('../../models/hr/StageProcessTraining');
const folderFile = 'roadmap';

// lay ra danh sach cac vi tri cong viec trong cty
exports.getListJobDescription= async(req, res, next) => {
    try {
        let {page, pageSize, name} = req.body;
        if(!page) page = 1;
        if(!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        
        let listCondition = {comId: req.infoLogin.comId, isDelete: 0};

        // dua dieu kien vao ob listCondition
        if(name) listCondition.name =  new RegExp(name, 'i');
        let listJob = await functions.pageFind(JobDescription, listCondition, { _id: 1 }, skip, limit); 
        for(let i=0; i<listJob.length;i++) {
            let job = listJob[i];
            if(job.roadMap!="") {
                job.linkFile = hrService.createLinkFile(folderFile, job.roadMap);
                listJob[i] = job;
            }
        }
        const totalCount = await functions.findCount(JobDescription, listCondition);
        return functions.success(res, "Get list job description success", {totalCount: totalCount, data: listJob });
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, e.message);
    }
}

exports.createJobDescription = async(req, res, next) => {
    try {
        let {name, depName, des, jobRequire} = req.body;
        if(!name || !depName || !des || !jobRequire) {
            return functions.setError(res, "Missing input value!", 404);
        }
        //lay id max
        const comId = req.infoLogin.comId;
        const maxIdJob = await JobDescription.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdJob;
        if (maxIdJob) {
            newIdJob = Number(maxIdJob.id) + 1;
        } else newIdJob = 1;

        let nameFile = '';
        if(req.files && req.files.roadMap) {
            let roadMap = req.files.roadMap;
            if(!await hrService.checkFile(roadMap.path)){
                return functions.setError(res, 'ảnh sai định dạng hoặc lớn hơn 20MB', 405);
            }
            nameFile = await hrService.uploadFileNameRandom(folderFile,roadMap);
        }
        
        //tao quy trinh
        let job = new JobDescription({
            id: newIdJob,
            name: name,
            depName: depName,
            des: des,
            jobRequire: jobRequire,
            roadMap: nameFile,
            comId: comId
        });
        job = await job.save();
        return functions.success(res, 'Create job description success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, e.message);
    }
}

exports.softDeleteJobDescription = async(req, res, next) => {
    try {
        let jobId = req.body.jobId;
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
        return functions.setError(res, e.message);
    }
}

//----------------------quy trinh dao tao

// lay ra danh sach quy trinh dao tao
exports.getListProcessTraining= async(req, res, next) => {
    try {
        let infoLogin = req.infoLogin;
        let comId = infoLogin.comId;
        let {page, pageSize, name, processTrainId} = req.body;
        if(!page) page = 1;
        if(!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        
        let listCondition = {comId: comId, isDelete: 0};

        // dua dieu kien vao ob listCondition
        if(name) listCondition.name =  new RegExp(name, 'i');
        if(processTrainId) listCondition.id =  processTrainId;
        const listProcess = await functions.pageFind(ProcessTraining, listCondition, { _id: -1 }, skip, limit); 
        const totalCount = await functions.findCount(ProcessTraining, listCondition);
        return functions.success(res, "Get list process training success", {totalCount: totalCount, data: listProcess });
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, e.message);
    }
}

exports.getDetailProcessTraining= async(req, res, next) => {
    try {
        let infoLogin = req.infoLogin;
        let comId = infoLogin.comId;
        let processTrainId = req.body.processTrainId;
        if(!processTrainId){
            return functions.setError(res, "Missing input processTrainId", 504);  
        }
        var processTrain = await ProcessTraining.findOne({id: processTrainId});
        if(!processTrain) {
            return functions.setError(res, "process training not found", 504);   
        }

        let listStage = await StageProcessTraining.find({trainingProcessId: processTrainId});
        return functions.success(res, "Get list process training success", {processTrain, listStage});
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, e.message);
    }
}

exports.createProcessTraining = async(req, res, next) => {
    try {
        let infoLogin = req.infoLogin;
        let comId = infoLogin.comId;
        let {name, description} = req.body;
        if(!name || !description) {
            return functions.setError(res, "Missing input value!", 404);
        }
        //lay id max
        let newIdProcessTrain = await ProcessTraining.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        if (newIdProcessTrain) {
            newIdProcessTrain = Number(newIdProcessTrain.id) + 1;
        } else newIdProcessTrain = 1;

        //tao quy trinh
        let processTrain = new ProcessTraining({
            id: newIdProcessTrain,
            name: name,
            description: description,
            comId: comId
        });
        processTrain = await processTrain.save();
        
        return functions.success(res, 'Create process train success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, e.message);
    }
}

exports.softDeleteProcessTraining = async(req, res, next) => {
    try {
        let processTrainId = req.body.processTrainId;
        if(!processTrainId){
            return functions.setError(res, "Missing input processTrainId", 404);
        }
        let job = await ProcessTraining.findOneAndUpdate({id: processTrainId}, {
            deletedAt: Date.now(),
            isDelete: 1
        })
        if(!job) {
            return functions.setError(res, "ProcessTraining not found!", 505);
        }
        return functions.success(res, "Soft delete ProcessTraining success!");
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, e.message);
    }
}

// giai doan trong quy trinh dao tao


//them moi giai doan
exports.createStageProcessTraining = async(req, res, next) => {
    try {
        let {name ,objectTraining, content, trainingProcessId} = req.body;
        if(!name || !objectTraining || !content || !trainingProcessId) {
            return functions.setError(res, "Missing input value!", 404);
        }
        //lay id max
        const maxIdStageTraining = await StageProcessTraining.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdStageTraining;
        if (maxIdStageTraining) {
            newIdStageTraining = Number(maxIdStageTraining.id) + 1;
        } else newIdStageTraining = 1;
        
        //tao cac giai doan cua quy trinh do
        let stageProcessTraining = new StageProcessTraining({
            id: newIdStageTraining,
            name: name,
            objectTraining: objectTraining,
            content: content,
            trainingProcessId: trainingProcessId
        });
        await StageProcessTraining.create(stageProcessTraining);
        return functions.success(res, 'Create stage training success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, e.message);
    }
}

// chinh sua 
exports.updateStageProcessTraining = async(req, res, next) => {
    try {
        let {name ,objectTraining, content, stageProcessTrainingId} = req.body;
        if(!name || !objectTraining || !content || !stageProcessTrainingId) {
            return functions.setError(res, "Missing input value!", 404);
        }
        //
        const stageRecruit = await StageProcessTraining.findOneAndUpdate({id: stageProcessTrainingId}, {
            name: name,
            objectTraining: objectTraining,
            content: content,
            updatedAt: Date.now()
        })
        if(!stageRecruit) {
            return functions.setError(res, "Stage training not found!", 505);
        }
        return functions.success(res, "update state training success!");
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, e.message);
    }
}

// xoa
exports.softDeleteStageProcessTraining = async(req, res, next) => {
    try {
        let stageProcessTrainingId = req.body.stageProcessTrainingId;
        let recruitment = await StageProcessTraining.findOneAndUpdate({id: stageProcessTrainingId}, {
            deletedAt: Date.now(),
            isDelete: 1
        })
        if(!recruitment) {
            return functions.setError(res, "Stage training not found!", 505);
        }
        return functions.success(res, "Soft delete stage training success!");
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, e.message);
    }
}