// api bài toán 2 
// hàm phụ trợ
const handleCalculateSeen = async (userId,type) =>{
    try{
        let checkUserExist = await HandleQuery(`SELECT * FROM  manage_point_history WHERE userId = ${userId} AND type = ${type}`);
        if(checkUserExist && checkUserExist.length){
            let id = checkUserExist[0].id
            let poinOrigin = Number(checkUserExist[0].point_see);
            let pointSumOrigin = Number(checkUserExist[0].sum);
            let point_to_change = Number(checkUserExist[0].point_to_change);
            let newPoint = poinOrigin + 1/300;
            if(newPoint > 10){
                newPoint = 10;
            }
            let newSum;
            newSum = pointSumOrigin + 1/300;
            let new_point_to_change = point_to_change + 1/300;
            await HandleQuery(`UPDATE manage_point_history SET sum = ${newSum},point_see = ${newPoint},point_to_change = ${new_point_to_change}  WHERE id = ${id}`);
        }
        else{
            let sum = 1/300;
            let point = 1/300;
            await HandleQuery(`INSERT INTO manage_point_history (userId, type, point_see,point_to_change,sum)
            VALUES (${userId}, ${type},${point},${sum},${sum})`);
        }
        return true;
    }
    catch(e){
        console.log('error handleCaculateSeen')
        console.log(e);
        return false;
    }
}
const insertSeenRequest = async (userId,type,userIdBeSeen,typeIdBeSeen) =>{
   try{
        let check1 = await isUserExists(userId,type);
        let check2 = await isUserExists(userIdBeSeen,typeIdBeSeen);
        if(check1 && check2){
            let checkExistRequest = await HandleQuery(`SELECT id FROM  save_see_request WHERE userId = ${userId} AND type = ${type} 
            AND userIdBeSeen = ${userIdBeSeen} AND typeIdBeSeen = ${typeIdBeSeen}`);
            if(checkExistRequest){
                if(checkExistRequest.length){
                    return true;
                }
                else{
                    let time = new Date().getTime()/1000;
                    await HandleQuery(`INSERT INTO save_see_request (userId,type,userIdBeSeen,typeIdBeSeen,time)
                    VALUES (${userId}, ${type},${userIdBeSeen},${typeIdBeSeen},${time})`);
                    await handleCalculateSeen(userId,type)
                    return true;
                }
            }
            else{
                return false;
            }
            
        }
        else{
            return false;
        }
   }
   catch(e){
        console.log('error InserSeenRequest');
        console.log(e);
        return false;
   }
}
// api 
const calculatePointSeen = async (req, res, next) => {
    try{
        if(req.body.userId && req.body.userIdBeSeen){ 
            const userId = Number(req.body.userId);
            const userIdBeSeen = Number(req.body.userIdBeSeen);
            const type = Number(req.body.type) || 0;
            const typeIdBeSeen = Number(req.body.typeIdBeSeen) || 0;
            insertSeenRequest(userId,type,userIdBeSeen,typeIdBeSeen);
            return res.json({
                data:{
                    result:true
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}
