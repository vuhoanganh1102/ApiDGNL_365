
const functions = require('../../services/functions')



exports.addTutor = async(req,res)=>{
    try{

    }catch (e) {
        console.log(e);
        return functions.setError(res, e.message)
    }
}