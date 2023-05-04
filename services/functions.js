exports.CheckPhoneNumber =async(phone)=>{
    const phoneNumberRegex = /^(?:\+84|0|\+1)?([1-9][0-9]{8,9})$/;
    return phoneNumberRegex.test(phone)
}
exports.CheckEmail = async(email)=>{
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email)
}
exports.getDatafindOne =async(model,condition)=>{
     model.findOne(condition).then(async(user)=>{
        return user
    })
}
exports.success =async(messsage = "", data = [])=>{
    return {
        code: 200,
        data,
        messsage
    };
}
exports.setError = async (code,message) => {
    return {
        code, message
    }
}