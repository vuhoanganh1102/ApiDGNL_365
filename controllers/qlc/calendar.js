const Calendar = require("../../models/qlc/Calendar");
const functions = require("../../services/functions");

exports.getAllCalendar = async (req, res) => {
    await functions.getDatafind(Calendar, {})
    .then((calendars) => functions.success(res,"Get data successfully", calendars))
    .catch((err) => functions.setError(res, err.message));
};

exports.getAllCalendarCompany = async (req, res) => {
    const {compnayId} = req.body

    if(!compnayId){
        functions.setError(res, )
    }
};

exports.getCalendarById = async (req, res) => {
    const _id = req.params.id

    if(functions.checkNumber(_id)){
        functions.setError(res, "Id must be a number");
    } else {
        const calendars = await functions.getDatafindOne(Calendar, {_id: _id});
        if(!calendars){
            functions.setError(res, "Calendar cannot be found or does not exist");
        }else {
            funtions.success(res, "Get calendar successfully", calendars);
        }
    }
};