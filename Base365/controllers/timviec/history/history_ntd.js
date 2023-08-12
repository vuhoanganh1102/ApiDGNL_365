// api bài toán 3 
// hàm phụ trợ 
const handleCalculatePointOrder = async (userId,type,point,expiry_date)=>{
    try{
        let check = await isUserExists(userId,type);
        if(check){
            let time = new Date().getTime()/1000;
            await HandleQuery(`INSERT INTO save_exchange_point_buy (userId,type,point,expiry_date,time)
                        VALUES (${userId}, ${type},${point},${expiry_date},${time})`);
            // let checkUserExist = await HandleQuery(`SELECT id,point_use_point,sum FROM  manage_point_history WHERE userId = ${userId} AND type = ${type}`);
            // if(checkUserExist && checkUserExist.length){
            //     let id = checkUserExist[0].id
            //     let poinOrigin = Number(checkUserExist[0].point_use_point);
            //     let pointSumOrigin = Number(checkUserExist[0].sum);
            //     let newPoint = poinOrigin + point/50;
            //     if(newPoint > 20){
            //         newPoint = 20;
            //     }
            //     let newSum;
            //     newSum = pointSumOrigin + point/50;
            //     await HandleQuery(`UPDATE manage_point_history SET sum = ${newSum},point_use_point = ${newPoint}  WHERE id = ${id}`);
            // }
            // else{
            //     let pointInsert = point/50;
            //     let sum = pointInsert;
            //     await HandleQuery(`INSERT INTO manage_point_history (userId, type, point_use_point,sum)
            //     VALUES (${userId}, ${type},${pointInsert},${sum})`);
            // }
            return true;
        }
        else{
            return false;
        }
    }
    catch(e){
        console.log('error handleCaculatePointOrder')
        console.log(e);
        return false;
    }
}
// api 
const calculatePointOrder = async (req, res, next) => {
    try{
        if(req.body.userId && req.body.point){ 
            const userId = Number(req.body.userId); 
            const type = Number(req.body.type); 
            const point = Number(req.body.point) || 0; 
            const expiry_date = req.body.expiry_date; 
            handleCalculatePointOrder(userId,type,point,expiry_date);
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

// hàm phụ trợ 
const handleUsePoint = async (userId,type,point)=>{
    try{
        let check = await isUserExists(userId,type);
        if(check){
            let time = new Date().getTime()/1000;
            let checkUserExist = await HandleQuery(`SELECT * FROM  manage_point_history WHERE userId = ${userId} AND type = ${type}`);
            if(checkUserExist && checkUserExist.length){
                let id = checkUserExist[0].id
                let poinOrigin = Number(checkUserExist[0].point_use_point);
                let pointSumOrigin = Number(checkUserExist[0].sum);
                let point_to_change = Number(checkUserExist[0].point_to_change)
                let newPoint = poinOrigin + point/50;
                if(newPoint > 20){
                    newPoint = 20;
                }
                let newSum;
                newSum = pointSumOrigin + point/50;
                point_to_change = point_to_change + point/50;
                await HandleQuery(`UPDATE manage_point_history SET sum = ${newSum},point_use_point = ${newPoint},point_to_change=${point_to_change}  WHERE id = ${id}`);
            }
            else{
                let pointInsert = point/50;
                let sum = pointInsert;
                await HandleQuery(`INSERT INTO manage_point_history (userId, type, point_use_point,sum,point_to_change)
                VALUES (${userId}, ${type},${pointInsert},${sum},${point_to_change})`);
            }
            return true;
        }
        else{
            return false;
        }
    }
    catch(e){
        console.log('error handleCaculatePointOrder')
        console.log(e);
        return false;
    }
}
// api dùng điểm 
const usePoint = async (req, res, next) => {
    try{
        if(req.body.userId && req.body.point){ 
            const userId = Number(req.body.userId); 
            const type = Number(req.body.type); 
            const point = Number(req.body.point) || 0; 
            handleUsePoint(userId,type,point);
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

// api bài toán 4
const handleCalculatePointShareNew = async (userId, userType, newId, socialName, linkPage)=>{
    try{
        let checkUser = await isUserExists(userId, userType),
            checkNew = await HandleQuery(`SELECT new_id FROM new WHERE new_id = ${newId}`);

        if(checkUser && ((newId > 0 && checkNew && checkNew.length) || newId == 0)){
            let time = new Date().getTime()/1000;
            await HandleQuery(`INSERT INTO save_share_social_new (userId, userType, newId, linkPage, socialName, time)
                        VALUES (${userId}, ${userType},${newId}, '${linkPage}','${socialName}',${time})`);
            let checkUserExist = await HandleQuery(`SELECT * FROM  manage_point_history WHERE userId = ${userId} AND type = ${userType}`);
            if (checkUserExist) {
                if(checkUserExist.length){
                    let id = checkUserExist[0].id,
                        poinOrigin = (newId == 0) ? Number(checkUserExist[0].point_share_social_url) : Number(checkUserExist[0].point_share_social_new),
                        pointSumOrigin = Number(checkUserExist[0].sum),
                        newPoint = poinOrigin + 1/10;
                    let point_to_change = Number(checkUserExist[0].point_to_change);
                    if(newPoint > 20){
                        newPoint = 20;
                    }
                    let newSum;
                    newSum = pointSumOrigin + 1/10;
                    let new_point_to_change = point_to_change + 1/10;
                    if (newId == 0) {
                        await HandleQuery(`UPDATE manage_point_history SET sum = ${newSum},point_share_social_url = ${newPoint},point_to_change = ${new_point_to_change}  WHERE id = ${id}`);
                    } else {
                        await HandleQuery(`UPDATE manage_point_history SET sum = ${newSum},point_share_social_new = ${newPoint},point_to_change = ${new_point_to_change}  WHERE id = ${id}`);
                    }
                } else {
                    let pointShare = 1/10;
                    let sum = pointShare;
                    let point_to_change = pointShare;
                    if (newId == 0) {
                        await HandleQuery(`INSERT INTO manage_point_history (userId, type, point_share_social_url,sum,point_to_change)
                        VALUES (${userId}, ${userType},${pointShare},${sum},${point_to_change})`);
                    } else {
                        await HandleQuery(`INSERT INTO manage_point_history (userId, type, point_share_social_new,sum,point_to_change)
                        VALUES (${userId}, ${userType},${pointShare},${sum},${point_to_change})`);
                    }
                }
            } else{
                return false;
            }
        }
        else{
            return false;
        }
    }
    catch(e){
        console.log(e);
        return false;
    }
}
let AntiSpamShareNew = [];
const handleAntiSpamNew = (ip) =>{
    try{
        let obj = AntiSpamShareNew.find((e)=>e.ip == ip) || null;
        if(obj){
            if((new Date().getTime()/1000 - obj.time) < 16){
                 AntiSpamShareNew = AntiSpamShareNew.filter((e)=> e.ip!= ip);
                 AntiSpamShareNew.push({
                    ip:ip,
                    time:new Date().getTime()/1000
                 })
                 return false;
            }
            else{
                AntiSpamShareNew = AntiSpamShareNew.filter((e)=> e.ip!= ip);
                AntiSpamShareNew.push({
                    ip:ip,
                    time:new Date().getTime()/1000
                })
                return true;
            }
        }
        else{
            AntiSpamShareNew.push({
                ip:ip,
                time:new Date()
            })
        }
        return true;
    }
    catch(e){
        console.log(e);
        console.log('HandleAntiSpamNew');
        return false;
    }
}
const calculatePointShareNew = async (req,res,next) =>{
    try{
        if(req.body.userId && req.body.socialName && req.body.linkPage){
            const userId = Number(req.body.userId),
                  userType = Number(req.body.userType),
                  newId = Number(req.body.newId),
                  socialName = req.body.socialName; 
                  linkPage = req.body.linkPage; 
            let check = handleAntiSpamNew(userId);
            if(!check){
                return res.json({
                    data:null,
                    error:"Spam"
                })
            }
            else{
                handleCalculatePointShareNew(userId, userType, newId, socialName, linkPage);
                return res.json({
                    data:{
                        result:true
                    }
                })
            }
        } else {
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        console.log(e)
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

// api bài toán 5
const handleCalculatePointShareUser = async (userId, userType, userIdBeShare, typeIdBeShare, socialName)=>{
    try{
        let checkUser = await isUserExists(userId,userType);
        let checkUserToShare = await isUserExists(userIdBeShare,typeIdBeShare);
        if(checkUser && checkUserToShare){
            let time = new Date().getTime()/1000;
            await HandleQuery(`INSERT INTO save_share_social_user (userId, userType, userIdBeShare, typeIdBeShare, socialName, time)
                        VALUES (${userId}, ${userType},${userIdBeShare},${typeIdBeShare},'${socialName}',${time})`);
            let checkUserExist = await HandleQuery(`SELECT * FROM  manage_point_history WHERE userId = ${userId} AND type = ${userType}`);
            if (checkUserExist) {
                if(checkUserExist.length){
                    let id = checkUserExist[0].id,
                        poinOrigin = Number(checkUserExist[0].point_share_social_user),
                        pointSumOrigin = Number(checkUserExist[0].sum),
                        newPoint = poinOrigin + 1/10;
                    let point_to_change = Number(checkUserExist[0].point_to_change)
                    if(newPoint > 20){
                        newPoint = 20;
                    }
                    let newSum;
                    newSum = pointSumOrigin + 1/10;
                    let new_point_to_change = point_to_change + 1/10;
                    await HandleQuery(`UPDATE manage_point_history SET sum = ${newSum},point_share_social_user = ${newPoint},point_to_change=${new_point_to_change}  WHERE id = ${id}`);
                } else {
                    let pointShare = 1/10;
                    let sum = pointShare;
                    let point_to_change = pointShare;
                    await HandleQuery(`INSERT INTO manage_point_history (userId, type, point_share_social_user,sum,point_to_change)
                    VALUES (${userId}, ${userType},${pointShare},${sum},${point_to_change})`);
                }
            } else{
                return false;
            }
        }
        else{
            return false;
        }
    }
    catch(e){
        console.log(e);
        return false;
    }
}
let AntiSpamShareUser = [];
const handleAntiSpamUser = (ip) =>{
    try{
        let obj = AntiSpamShareUser.find((e)=>e.ip == ip) || null;
        if(obj){
            if((new Date().getTime()/1000 - obj.time) < 16){
                 AntiSpamShareUser = AntiSpamShareUser.filter((e)=> e.ip!= ip);
                 AntiSpamShareUser.push({
                    ip:ip,
                    time:new Date().getTime()/1000
                 })
                 return false;
            }
            else{
                AntiSpamShareUser = AntiSpamShareUser.filter((e)=> e.ip!= ip);
                AntiSpamShareUser.push({
                    ip:ip,
                    time:new Date().getTime()/1000
                })
                return true;
            }
        }
        else{
            AntiSpamShareUser.push({
                ip:ip,
                time:new Date()
            })
        }
        return true;
    }
    catch(e){
        console.log(e);
        console.log('HandleAntiSpamUser');
        return false;
    }
}
const calculatePointShareUser = async (req,res,next) =>{
    try{
        if(req.body.userId && req.body.userIdBeShare && req.body.socialName){
            const userId = Number(req.body.userId),
                  userType = Number(req.body.userType) || 0,
                  userIdBeShare = Number(req.body.userIdBeShare),
                  typeIdBeShare = Number(req.body.typeIdBeShare) || 0,
                  socialName = req.body.socialName;
            let check = handleAntiSpamUser(userId);
            if(!check){
                return res.json({
                    data:null,
                    error:"Spam"
                })
            }
            else{
                handleCalculatePointShareUser(userId, userType, userIdBeShare, typeIdBeShare, socialName);
                return res.json({
                    data:{
                        result:true
                    }
                })
            }
        } else {
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        console.log(e)
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

// bài toán 7
// mảng điểm theo số sao đánh giá
const arrPointStar = (star)=>{
    let arr = [
        {
            star: 1,
            point: -10
        },
        {
            star: 2,
            point: -5
        },
        {
            star: 3,
            point: 0
        },
        {
            star: 4,
            point: 5
        },
        {
            star: 5,
            point: 10
        }
    ];
    if (star > 0 && star <= 5) {
        return arr[star - 1].point;
    } else {
        return 0;
    }
}
// hàm xử ý tính điểm khi đánh giá
// vote tin tuyển dụng 
const handleCalculatePointVoteNew = async (userId, userType, star, newId) =>{
    try{
        let checkUser = await isUserExists(userId,userType);
        if(checkUser){
            let checkBeVoted = await HandleQuery(`SELECT new_id, new_user_id FROM new WHERE new_id = ${newId}`);
            if (checkBeVoted && checkBeVoted.length) {
                let creater_be_vote = checkBeVoted[0].new_user_id;
                let time = new Date().getTime()/1000;
                let type = 'new';
                let type_create = 1; 
                // userId: người vote
                // user_type_vote: loại tài khoản của người vote
                // id_be_vote: id chủ thể được vote 
                // type: loại đối tượng được vote
                // create_be_vote: người tạo ra đối tượng được vote
                // type_create: loại tài khoản của người tạo ra đối tượng 
                let checkVote = await HandleQuery(`SELECT id FROM save_vote WHERE userId = ${userId} AND user_type_vote = ${userType} AND id_be_vote = ${newId} AND type = '${type}'`);
                if (checkVote) {
                    if (checkVote.length) {
                        await HandleQuery(`UPDATE save_vote SET star = ${star},time = ${time} WHERE id = ${checkVote[0].id}`);
                    } else {
                        await HandleQuery(`INSERT INTO save_vote (userId, user_type_vote, star, id_be_vote, type, creater_be_vote, type_create, time)
                                                        VALUES (${userId},${userType},${star},${newId},'${type}',${creater_be_vote},${type_create},${time})`);
                    }
                    let TotalVote = await HandleQuery(`SELECT SUM(star) as sum, COUNT(star) as count FROM save_vote WHERE creater_be_vote = ${creater_be_vote} AND type_create = ${type_create}`);
                    let sum = TotalVote[0].sum;
                    let count = TotalVote[0].count;
                    let avg = 1;
                    avg = Math.floor(sum / count);
                    if(avg < 1){
                        avg = 1;
                    }
                    let point = arrPointStar(avg);
                    let checkPointNtd = await HandleQuery(`SELECT * FROM manage_point_history WHERE userId = ${creater_be_vote} AND type = 1`);
                    if (checkPointNtd) {
                        if(checkPointNtd.length){
                            let id = checkPointNtd[0].id;
                            let poinOrigin = Number(checkPointNtd[0].point_vote);
                            let pointSumOrigin = Number(checkPointNtd[0].sum);
                            let point_to_change = Number(checkPointNtd[0].point_to_change)
                            let newSum;
                            newSum = pointSumOrigin + point - poinOrigin;
                            let new_point_to_change = point_to_change + point - poinOrigin;
                            await HandleQuery(`UPDATE manage_point_history SET sum = ${newSum},point_vote = ${point},point_to_change=${new_point_to_change} WHERE id = ${id}`);
                        } else {
                            await HandleQuery(`INSERT INTO manage_point_history (userId, type, point_vote, sum,point_to_change)
                            VALUES (${creater_be_vote}, 1,${point},${point},${point})`);
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    catch(e){
        console.log(e);
        return false;
    }
}
// api tính điểm khi đánh giá
const calculatePointVoteNew = async (req,res,next) =>{
    try{
        if(req.body.userId && req.body.star  && req.body.newId){
            const userId = Number(req.body.userId),
                  userType = Number(req.body.userType) || 0,
                  star = Number(req.body.star);
            const newId = Number(req.body.newId);
            handleCalculatePointVoteNew(userId, userType, star, newId);
            return res.json({
                data:{ 
                    result:true
                }
            })
        } else {
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        console.log(e)
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}


// bài toán 9
// api tính điểm và lưu lại lịch sử khi chuyển page
// hàm xử ý tính điểm và lưu lại lịch sử khi chuyển page
const handleCalculatePointNextPage = async (userId, userType, link) =>{
    try{
        let checkUser = await isUserExists(userId,userType);
        if(checkUser){
            let time = new Date().getTime()/1000;
            await HandleQuery(`INSERT INTO save_next_page (userId, userType, link, startTime, endTime)
                            VALUES (${userId},${userType},'${link}',${time},${time+1})`);
            let checkPointUser = await HandleQuery(`SELECT * FROM manage_point_history WHERE userId = ${userId} AND type = ${userType}`);
            if (checkPointUser) {
                if(checkPointUser.length){
                    let id = checkPointUser[0].id,
                        poinOrigin = Number(checkPointUser[0].point_next_page),
                        pointSumOrigin = Number(checkPointUser[0].sum),
                        newPoint = poinOrigin + 1/500;
                    let point_to_change = Number(checkPointUser[0].point_to_change);
                    if(newPoint > 10){
                        newPoint = 10;
                    }
                    let newSum;
                    newSum = pointSumOrigin + 1/500;
                    let new_point_to_change = point_to_change + 1/500;
                    await HandleQuery(`UPDATE manage_point_history SET sum = ${newSum},point_next_page = ${newPoint},point_to_change=${new_point_to_change} WHERE id = ${id}`);
                } else {
                    let point_next_page = 1/500,
                        sum = point_next_page;
                    await HandleQuery(`INSERT INTO manage_point_history (userId, type, point_next_page, sum,point_to_change)
                    VALUES (${userId}, ${userType},${point_next_page},${sum},${sum})`);
                }
            }
        } else {
            return false;
        };
        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}
const caculatePointNextPage = async (req,res,next) =>{
    try{
        if(req.body.userId && req.body.link){
            const userId = Number(req.body.userId),
                  userType = Number(req.body.userType) || 0,
                  link = req.body.link;
            handleCalculatePointNextPage(userId, userType, link);
            return res.json({
                data:{
                    result:true
                }
            })

        } else {
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        console.log(e)
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

// 0 : ứng viên, 1 là nhà tuyển dụng 
const handleUpdateEndTimeNextPage = async (idChat) =>{
    let userId = 0;
    let userType = 0;
    let infoUserUv = await HandleQuery(`SELECT use_id FROM user WHERE chat365_id = ${idChat} LIMIT 1`);
    if (infoUserUv && infoUserUv.length) {
        userId = infoUserUv[0].use_id;
        userType = 0;
    } else {
        let infoUserNtd = await HandleQuery(`SELECT usc_id FROM user_company WHERE chat365_id = ${idChat} LIMIT 1`);
        if (infoUserNtd && infoUserNtd.length) {
            userId = infoUserNtd[0].usc_id;
            userType = 1;
        } else {
            return false;
        }
    }
    let nextPage = await HandleQuery(`SELECT id FROM save_next_page WHERE userId = ${userId} AND userType = ${userType} ORDER BY startTime DESC LIMIT 1`);
    if (nextPage && nextPage.length) {
        let time = new Date().getTime()/1000;
        await HandleQuery(`UPDATE save_next_page SET endTime = ${time-1} WHERE id = ${nextPage[0].id}`);
        return true;
    } else {
        return false;
    }
}
// api cập nhật tgian thoát page theo id chat
const updateEndTimeNextPage = async (req,res,next) =>{
    try{
        if(req.body.idChat){
            const idChat = Number(req.body.idChat);
            handleUpdateEndTimeNextPage(idChat);
            return res.json({
                data:{
                    result:true
                }
            }) 
        } else {
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    }
    catch(e){
        console.log(e)
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

// api đổi điểm  
const handleExchangePointHistory = async (userId,type) =>{
    try{
       let check = await isUserExists(userId,type);
       if(check){
            let checkPointNtd = await HandleQuery(`SELECT * FROM manage_point_history WHERE userId = ${userId} AND type = ${type}`);
            if (checkPointNtd) {
                let id = checkPointNtd[0].id;
                await HandleQuery(`UPDATE manage_point_history 
                                   SET point_time_active = 0, point_vote = 0, point_see=0, point_use_point=0, 
                                   point_share_social_new =0, point_share_social_user= 0, point_next_page = 0 WHERE id = ${id}`);
                // point_see_em_apply, point_vote
                // no update point_vote 
                // no update point_see_em_apply
            }
       }
    }
    catch(e){
        console.log('HandleExchangePointHistory error')
    }
}
const exchangePointHistory = async (req,res,next) =>{
    try{
        // cập nhật tất cả các thông số điểm về 0 ngoại trừ sum trong bảng manage_point_history
        // xóa hết dữ liệu xem ở bài toán 2 của user đó 
        const userId = Number(req.body.userId),
              type = Number(req.body.type) || 0;
        handleExchangePointHistory(userId,type);
        return res.json({
            data:{
                result:true
            }
        })
        
    }
    catch(e){
        
    }
}

// api đổi điểm thành tiền theo số điểm nhất định
// point_to_change : số điểm còn lại 
// số điểm còn lại này bằng tổng số các đầu điểm nhỏ 
const handleExchangeNumberPoints = async (userId,userType,point) =>{
    try{
       let checkUser = await isUserExists(userId,userType);
       if(checkUser){
            let checkPointNtd = await HandleQuery(`SELECT * FROM manage_point_history WHERE userId = ${userId} AND type = ${userType}`);
            if (checkPointNtd && checkPointNtd.length) {
                let obj = checkPointNtd[0];
                let id_history = obj.id;

                //lưu lại lịch sử mua hàng 
                let money = point*1000,
                    point_later = obj.sum - point;
                // lưu lại lịch sử đổi điểm thành tiền
                let time = new Date().getTime()/1000;
                await HandleQuery(`INSERT INTO save_exchange_point (userId,userType,point,money,point_later,time)
                    VALUES (${userId}, ${userType},${point},${money},${point_later},${time})`);

                // xử lý điểm còn 
                let point_to_change = obj.point_to_change;
                let sum = obj.sum;
                point_to_change = point_to_change - point;
                if(point_to_change<0){
                    point_to_change = 0;
                };

                // điểm trung bình các đầu điểm sau khi trừ 

                let diem_tru_tb = 0;
                let listkey = Object.keys(obj);
                    let a = 0;
                    let listkey_khackhong = [];
                    for(let i = 0; i < listkey.length; i++){
                        if(obj[listkey[i]]){
                            a = a+1;
                            listkey_khackhong.push(listkey[i]);
                        }
                    }
                    if(a){
                        diem_tru_tb = point / a;  
                        let str = `${listkey_khackhong[0]} = ${obj[listkey_khackhong[0]] - diem_tru_tb}`;
                        if(listkey_khackhong.length > 1){
                            for(let i = 1; i < listkey_khackhong.length; i++){
                                str = `${str},${listkey_khackhong[i]} = ${obj[listkey_khackhong[i]] - diem_tru_tb}`;
                            }
                        };
                        
                        await HandleQuery(`UPDATE manage_point_history 
                                           SET point_to_change = ${point_to_change}, ${str} WHERE id = ${id_history}`);
                        return true;
                    }
                    else{
                        await HandleQuery(`UPDATE manage_point_history 
                        SET point_to_change = ${point_to_change} WHERE id = ${id_history}`);
                        return true;
                    }

            } else {
                return false;
            }
       }
    } catch(e){
        console.log(e);
        return false;
    }
}
const exchangeNumberPoints = async (req,res,next) =>{
    try{
        if(req.body.userId && req.body.point){
            const userId = Number(req.body.userId),
                  userType = Number(req.body.userType) || 0,
                  point = Number(req.body.point)
            handleExchangeNumberPoints(userId, userType, point);
            return res.json({
                data:{
                    result:true
                }
            })
        } else {
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    } catch(e){
        console.log(e)
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

const changeIdChat = async (req,res,next) =>{
    try{
        if(req.body.IdTimviec && req.body.IdChat){
            let IdTimviec = Number(req.body.IdTimviec);
            let IdChat = Number(req.body.IdChat);
            await HandleQuery(`UPDATE user SET chat365_id = ${IdChat} WHERE use_id = ${IdTimviec} LIMIT 1`)
            return res.json({
                data:{
                    result:true
                }
            })
        } else {
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    } catch(e){
        console.log(e)
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

const handleCountComment = async (IdNew) =>{
    try{
        let news = await HandleQuery(`SELECT new_id,new_user_id FROM new WHERE new_id = ${IdNew} LIMIT 1`);
        if(news && news.length){
            let listComment = await HandleQuery(`SELECT cm_id FROM cm_comment WHERE IdNew IN (SELECT new_id FROM new WHERE new_user_id = ${news[0].new_user_id} )`);
            let point = listComment.length / 2;
            if(point > 10 ){point = 10};
            let checkPointNtd = await HandleQuery(`SELECT * FROM manage_point_history WHERE userId = ${news[0].new_user_id} AND type = 1`);
            if (checkPointNtd) {
                if(checkPointNtd.length){
                    let id = checkPointNtd[0].id;
                    let poinOrigin = Number(checkPointNtd[0].point_comment);
                    let point_to_change = Number(checkPointNtd[0].point_to_change)
                    let pointSumOrigin = Number(checkPointNtd[0].sum);
                    let newSum;
                    newSum = pointSumOrigin + point - poinOrigin;
                    let new_point_to_change = point_to_change +  point - poinOrigin;
                    await HandleQuery(`UPDATE manage_point_history SET sum = ${newSum},point_comment = ${point}, point_to_change=${new_point_to_change} WHERE id = ${id}`);
                }
            } else {
                return false;
            }
            return true;
        }
        else{
            return false;
        }
    }
    catch(e){
        console.log(e);
        return false;
    }
}
const countComment = async (req,res,next)=>{
    try{
        if(req.body.IdNewComment && !isNaN(req.body.IdNewComment)){
             const IdNew = Number(req.body.IdNewComment) || 0;
             if(IdNew){
                handleCountComment(IdNew);
                return res.json({
                    data:{
                        result:true
                    }
                })
             }
             else{
                return res.json({
                    data:{
                        result:true
                    }
                })
             }
        }
        else{
            return res.json({
                data:null,
                error:"Đã có lỗi xảy ra"
            })
        }
    }
    catch(e){
        console.log(e)
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

// Điểm đánh giá nội dung tin tuyển dụng
const handleEvaluateContentNew = async (userId) =>{
    try{
        let checkUser = await isUserExists(userId, 1);
        if(checkUser){
            let listNew = await HandleQuery(`SELECT new.new_id,new_mota,new_quyenloi,new_yeucau FROM new JOIN new_multi ON new.new_id = new_multi.new_id WHERE new_user_id = ${userId}`);
            if (listNew.length >= 2) {
                let number = 0;
                for(let i = 0; i < listNew.length; i++){
                    let mota = listNew[i].new_mota.length;
                    let quyenloi = listNew[i].new_quyenloi.length;
                    let yeucau = listNew[i].new_yeucau.length;
                    if ((mota + quyenloi + yeucau) > 1000) {
                        number += 1;
                    }
                };
                let check = number / listNew.length;
                let point_content = 0;
                if (check >= 0.6) {
                    point_content = 5;
                }
                let percent_content_new = check * 100;
                let checkPointUser = await HandleQuery(`SELECT * FROM manage_point_history WHERE userId = ${userId} AND type = 1`);
                if (checkPointUser) {
                    if(checkPointUser.length){
                        let id = checkPointUser[0].id,
                            poinOrigin = Number(checkPointUser[0].point_content_new),
                            pointSumOrigin = Number(checkPointUser[0].sum);
                        let point_to_change = Number(checkPointUser[0].point_to_change);

                        let newSum;
                        newSum = pointSumOrigin + point_content - poinOrigin;
                        let new_point_to_change = point_to_change + point_content - poinOrigin;
                        await HandleQuery(`UPDATE manage_point_history SET sum = ${newSum},point_content_new = ${point_content},percent_content_new = ${percent_content_new},
                        point_to_change = ${new_point_to_change}
                        WHERE id = ${id}`);
                    } else {
                        if (point_content > 0) {
                            await HandleQuery(`INSERT INTO manage_point_history (userId, type, point_content_new, percent_content_new, sum,point_to_change)
                            VALUES (${userId}, 1,${point_content},${percent_content_new},${point_content},${point_content})`);
                        }
                    }
                }
            } else {
                return false;
            }
            return true;
        } else {
            return false;
       }
    } catch(e){
        console.log(e);
        return false;
    }
}
const evaluateContentNew = async (req,res,next) =>{
    try{
        if(req.body.userId){
            const userId = Number(req.body.userId);
            handleEvaluateContentNew(userId);
            return res.json({
                data:{
                    result:true
                }
            })
        } else {
            return res.json({
                data:null,
                error:"Thông tin truyền lên không đầy đủ"
            })
        }
    } catch(e){
        console.log(e)
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

// điểm ứng viên xem tin tuyển dụng 
const handleStartSee = async (UserId,Type,Name,IdNew,HostId,Url)=>{
    try{
        let check1 = await isUserExists(UserId,Type);
        let check2 = await isUserExists(HostId,1);
        if(check1 && check2){
            let now = new Date().getTime()/1000;
            now = Math.round(now);
            let end = now + 1; 
            let duration = 1;
            await HandleQuery(`INSERT INTO save_see_new_by_em (userId,type,name,start,end,duration,url,newId,hostId)
                                                       VALUES (${UserId},${Type},'${Name}',${now},${end},${duration},'${Url}',${IdNew},${HostId})`);
        }
        else{
            return false;
        }
    }
    catch(e){
        console.log('error HandleStartSee');
        console.log(e);
        return false;
    }
}
// api 
const startSee = async (req,res,next)=>{
    try{
        if(req.body.UserId && req.body.Type && req.body.IdNew && req.body.HostId && req.body.Url){
            const UserId = Number(req.body.UserId);
            const Type = Number(req.body.Type);
            const Name = String(req.body.Name);
            const IdNew = Number(req.body.IdNew);
            const HostId = Number(req.body.HostId);
            const Url = String(req.body.Url);
            handleStartSee(UserId,Type,Name,IdNew,HostId,Url);
            return res.json({
                data:{
                    result:true
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Đã có lỗi xảy ra"
            })
        }
    }
    catch(e){
        console.log(e)
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}
// function end see 
const hanldeEndSee = async (idChat)=>{
    try{
        let userId = 0;
        let userType = 0;
        let infoUserUv = await HandleQuery(`SELECT use_id FROM user WHERE chat365_id = ${idChat} LIMIT 1`);
        if (infoUserUv && infoUserUv.length) {
            userId = infoUserUv[0].use_id;
            userType = 0;
        } else {
            let infoUserNtd = await HandleQuery(`SELECT usc_id FROM user_company WHERE chat365_id = ${idChat} LIMIT 1`);
            if (infoUserNtd && infoUserNtd.length) {
                userId = infoUserNtd[0].usc_id;
                userType = 1;
            } else {
                return false;
            }
        }
        let nextPage = await HandleQuery(`SELECT * FROM save_see_new_by_em WHERE userId = ${userId} AND type = ${userType} ORDER BY start DESC LIMIT 1`);
        
        if (nextPage && nextPage.length) {
            userId = nextPage[0].hostId;
            userType = 1;
            let time = (new Date().getTime()/1000)+1;
            let duration = time - nextPage[0].start;
            if (nextPage[0].end - nextPage[0].start <= 2) {
                let point = duration / 3 / 60;
                await HandleQuery(`UPDATE save_see_new_by_em SET end = ${time},	duration = ${duration} WHERE id = ${nextPage[0].id}`);
                let checkPointUser = await HandleQuery(`SELECT * FROM manage_point_history WHERE userId = ${userId} AND type = ${userType}`);
                if (checkPointUser) {
                    if(checkPointUser.length){
                        let id = checkPointUser[0].id,
                            poinOrigin = Number(checkPointUser[0].point_be_seen_by_em),
                            pointSumOrigin = Number(checkPointUser[0].sum),
                            newPoint = poinOrigin + point;
                        let point_to_change = Number(checkPointUser[0].point_to_change)
                        if(newPoint > 10){
                            newPoint = 10;
                        }
                        let newSum;
                        newSum = pointSumOrigin + point; 
                        let new_point_to_change = point_to_change + point;
                        await HandleQuery(`UPDATE manage_point_history SET sum = ${newSum},point_be_seen_by_em = ${newPoint},point_to_change=${new_point_to_change} WHERE id = ${id}`);
                    } 
                }
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    catch(e){
        console.log('error HanldeEndSee',e);
        return false;
    }
}
// api 
const endSee = async (req,res,next)=>{
    try{
        if(req.body.idChat){
            const idChat = Number(req.body.idChat);
            hanldeEndSee(idChat);
            return res.json({
                data:{
                    result:true
                }
            })
        }
        else{
            return res.json({
                data:null,
                error:"Đã có lỗi xảy ra"
            })
        }
    }
    catch(e){
        console.log(e)
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}

// tính điểm khi NTD bình luận
const handleCalculatePointNTDComment = async (userId, userType) =>{
    try{
        let qrUser;
        if (userType == 1) {
            qrUser = `SELECT usc_id, chat365_id FROM  user_company WHERE usc_id = ${userId} LIMIT 1`;
        } else {
            qrUser = `SELECT use_id, chat365_id FROM  user WHERE use_id = ${userId} LIMIT 1`;
        }
        let userCheck = await HandleQuery(qrUser);
        if(userCheck && userCheck.length && userCheck[0].chat365_id != 0){
            let listComment = await HandleQuery(`SELECT cm_id FROM cm_comment WHERE cm_sender_idchat = ${userCheck[0].chat365_id}`);
            let point = listComment.length / 2;
            let checkPointNtd = await HandleQuery(`SELECT id, point_ntd_comment, sum FROM manage_point_history WHERE userId = ${userId} AND type = ${userType}`);
            if (checkPointNtd) {
                if(checkPointNtd.length){
                    let id = checkPointNtd[0].id;
                    let poinOrigin = Number(checkPointNtd[0].point_ntd_comment);
                    let pointSumOrigin = Number(checkPointNtd[0].sum);
                    let point_to_change = Number(checkPointNtd[0].point_to_change);
         
                    let newPoint = point;
                    if(newPoint > 10 ){newPoint = 10};
                    let newSum;
                    newSum = pointSumOrigin + point - poinOrigin;
                    let new_point_to_change = point_to_change + point - poinOrigin;
                    await HandleQuery(`UPDATE manage_point_history SET sum = ${newSum},point_ntd_comment = ${newPoint},point_to_change =${new_point_to_change} WHERE id = ${id}`);
                }
            } else {
                return false;
            }
            return true;
        } else{
            return false;
        }
    }
    catch(e){
        console.log(e);
        return false;
    }
}
const calculatePointNTDComment = async (req,res,next)=>{
    try{
        if(req.body.userId){
            const userId = Number(req.body.userId),
                  userType = Number(req.body.userType) || 0;
            handleCalculatePointNTDComment(userId, userType);
        }
        else{
            return res.json({
                data:null,
                error:"Đã có lỗi xảy ra"
            })
        }
    }
    catch(e){
        console.log(e)
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}
const takeUser = async (req,res,next)=>{
    try{
        if(req.params.userId){
            return res.json({
              data:await HandleQuery(`SELECT 	use_phone_tk,	use_email FROM user WHERE use_id = ${req.params.userId} LIMIT 1`)
            })
        }
        else{
            return res.json({
                data:null,
                error:"Đã có lỗi xảy ra"
            })
        }
    }
    catch(e){
        console.log(e)
        return res.json({
            data:null,
            error:"Đã có lỗi xảy ra"
        })
    }
}


module.exports = {
    CaculateBaseTimeOnline: calculateBaseTimeOnline,
    CaculatePointSeen: calculatePointSeen,
    CaculatePointOrder: calculatePointOrder,
    CaculatePointShareNew: calculatePointShareNew,
    CaculatePointShareUser: calculatePointShareUser,
    CaculatePointVoteNew: calculatePointVoteNew,
    CaculatePointNextPage: caculatePointNextPage,
    updateEndTimeNextPage,
    ExchangePointHistory: exchangePointHistory,
    ExchangeNumberPoints: exchangeNumberPoints,
    UsePoint: usePoint,
    ChangeIdChat: changeIdChat,
    CountComment: countComment,
    EvaluateContentNew: evaluateContentNew,
    StartSee: startSee,
    EndSee: endSee,
    CaculatePointNTDComment: calculatePointNTDComment,
    TakeUser: takeUser
}