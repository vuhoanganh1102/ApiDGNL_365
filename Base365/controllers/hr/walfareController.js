const functions = require('../../services/functions');
exports.addAchievement = (req,res,next)=>{
    try {
        functions.success(res, 'success')  
    } catch (error) {
        functions.setError(res, error)
    }
}