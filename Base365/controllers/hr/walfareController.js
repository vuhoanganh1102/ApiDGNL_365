const functions = require('../../services/functions');

exports.addAchievement = (req,res,next)=>{
    try {
        console.log('2');
        functions.success(res, 'success')  
    } catch (error) {
        functions.setError(res, error)
    }
}