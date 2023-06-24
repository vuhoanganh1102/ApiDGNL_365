const functions = require('../../../services/functions');
const User = require('../../../models/Users');
const Order = require('../../../models/Raonhanh365/Order');

exports.getListUserVerifyPayment = async(req, res, next) => {
    try {
        if (req.body) {
            if(!req.body.page){
                return functions.setError(res, "Missing input page", 401);
            }
            if(!req.body.pageSize){
                return functions.setError(res, "Missing input pageSize", 402);
            }
            let page = Number(req.body.page);
            let pageSize = Number(req.body.pageSize);
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let {userName, cccd, startDate, endDate} = req.body; 
            let listCondition = {};
            // let listCondition = {
            //     $or: [{"inforRN365.active": 1}, {"inforRN365.active": 2}]
            // }
            if(userName) listCondition.userName = new RegExp(userName);
            if(cccd) listCondition["inforRN365.cccd"] = new RegExp(cccd);
            if(startDate) listCondition["inforRN365.time"]  = {$gte: new Date(startDate)};
            if(endDate) listCondition["inforRN365.time"]  = {$lte: new Date(endDate)};
            let fieldsGet = 
            {   
                _id: 1, userName: 1, phone: 1,
                inforRN365: {
                    cccd:1,cccdFrontImg:1,cccdBackImg:1,bankName:1,stk:1,ownerName:1,time:1,active:1
                }
            }
            const listUserVerified = await functions.pageFindWithFields(User, listCondition, fieldsGet, { _id: 1 }, skip, limit); 
            const totalCount = await functions.findCount(User, listCondition);
            return functions.success(res, "get list user verify paymet success", {totalCount: totalCount, data: listUserVerified });
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

exports.adminVerifyPayment = async(req, res, next) => {
    try {
        let {userId, active} = req.body;
        if(!userId || !active){
            return functions.setError(res, "Missing input value!", 404);
        }
        let user = await User.findOne({_id: userId}, {userName: 1});
        if(!user)
            return functions.setError(res, "User not fount!", 404);
        if(active==2) {
            await User.findOneAndUpdate({_id: userId}, {
            inforRN365: {
                active: active
            }
            }, {new: true})
            return functions.success(res, 'admin verify payment success!');
        }
        await User.findOneAndUpdate({_id: userId}, {
            inforRN365: {
                cccd: null,
                cccdFrontImg: null,
                cccdBackImg: null,
                bankName: null,
                stk: null,
                ownerName: null,
                time: null,
                active: 0
            }
        })
        return functions.success(res, 'admin delete verify payment success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}


exports.getListOrderPayment = async(req, res, next) => {
    try {
        if (req.body) {
            if(!req.body.page){
                return functions.setError(res, "Missing input page", 401);
            }
            if(!req.body.pageSize){
                return functions.setError(res, "Missing input pageSize", 402);
            }
            let page = Number(req.body.page);
            let pageSize = Number(req.body.pageSize);
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let {buyerName, buyerId, startDate, endDate} = req.body; 
            let listCondition = {};
            if(buyerName) listCondition.name = new RegExp(buyerName);
            if(buyerId) listCondition.buyerId = buyerId
            if(startDate) listCondition.buyTime  = {$gte: new Date(startDate)};
            if(endDate) listCondition.buyTime  = {$lte: new Date(endDate)};
            let fieldsGet = 
            {   
                _id: 1, name: 1, buyerId: 1, sellerId: 1, paymentType: 1, amountPaid: 1, buyTime: 1, orderActive: 1
            }
            var listUserVerified = await functions.pageFindWithFields(Order, listCondition, fieldsGet, { _id: 1 }, skip, limit); 
            for(let i=0; i<listUserVerified.length; i++){
                
                let seller = await User.findOne({_id: listUserVerified[i].sellerId}, {userName: 1});
                if(seller){
                    listUserVerified[i].sellerName = seller.userName;
                }
            }
            const totalCount = await functions.findCount(Order, listCondition);
            return functions.success(res, "get list user verify paymet success", {totalCount: totalCount, data: listUserVerified });
        } else {
            return functions.setError(res, "Missing input data", 400);
        }
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

exports.adminVerifyOrder = async(req, res, next) => {
    try{
        let {orderId, active} = req.body;
        if(!orderId || !active){
            return functions.setError(res, "Missing input value!", 404);
        }
        let order = await Order.findOne({_id: orderId});
        if(!order)
            return functions.setError(res, "Order not fount!", 404);
        await Order.findOneAndUpdate({_id: orderId}, {orderActive: active})
        return functions.success(res, 'admin verify payment success!');
    }catch(e){
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}
