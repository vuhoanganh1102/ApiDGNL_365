const functions = require('../../services/functions');
const New = require('../../models/Raonhanh365/New');
const User = require('../../models/Users');
const Order = require('../../models/Raonhanh365/Order');
const Bidding = require('../../models/Raonhanh365/Bidding');
const raoNhanh = require('../../services/rao nhanh/raoNhanh');
const Cart = require('../../models/Raonhanh365/Cart');
const { CommaAndColonSeparatedRecord } = require('mongodb-connection-string-url');
// đặt hàng
exports.order = async (req, res, next) => {
    try {
      
        let request = req.body;
        let codeOrder = request.arr_madh.split(',');
        let phone = request.sdt_lienhe;
        let deliveryAddress = request.dchi_nhanhang;
        let sellerId = request.arr_idnban.split(',');
        let note = request.ghi_chu || null;
        let paymentType = request.loai_ttoan;
        let totalProductCost = request.arr_tongtiensp.split(',');
        let promotionType = request.arr_lkmai.split(',');
        let promotionValue = request.arr_gtri_km.split(',');
        let shipFee = request.arr_phivc.split(',');
        let shipType = request.arr_vchuyen.split(',');
        let tien_ttoan_ctra = request.tien_ttoan_ctra;
        let paymentMethod = request.phuong_thuc;
        let cartID = request.arr_idgh.split(',');
        let unitPrice = request.arr_dongia.split(',');
        let buyerId = req.user.data.idRaoNhanh365 || 3585;
        let status = 0;
        let amountPaid = 0;
        if (codeOrder && codeOrder.length !== 0) {
            for (let i = 0; i < codeOrder.length; i++) {
                if ( phone && deliveryAddress && sellerId[i] &&
                    note && paymentType && totalProductCost[i] &&
                    promotionType[i] && promotionValue[i] && shipFee[i] && shipType[i]
                    && tien_ttoan_ctra && paymentMethod && cartID[i] && unitPrice[i]) {
                    if (await functions.checkNumber(tien_ttoan_ctra) === false
                    || await functions.checkNumber(totalProductCost[i]) === false
                    || await functions.checkNumber(promotionValue[i]) === false
                    || await functions.checkNumber(shipFee[i]) === false) {
                        return functions.setError(res, 'invalid number', 400)
                    }
        
                    let check_money = await User.find({ idRaoNhanh365: 3585 })
                    if(!check_money || check_money.length === 0 )
                    {
                        return functions.setError(res,'người dùng không tồn tại',400)
                    }
                    if (paymentMethod === 0 && tien_ttoan_ctra !== 0) {
                        if (tien_ttoan_ctra > check_money[0].money) {
                            return functions.setError(res,'Số tiền của bạn không đầy đủ mua hàng',400)
                        }
                    }
                    let check_sellerId = await User.find({ idRaoNhanh365: 3585 })
                    if(!check_sellerId || check_sellerId.length === 0 )
                    {
                        return functions.setError(res,'người dùng không tồn tại',400)
                    }
                    if(await functions.checkPhoneNumber(phone) === false)
                    {
                        return functions.setError(res,'invalid phone number',400)
                    }
                    let dataCart = await Cart.findById(cartID[i],{newsId:1,quantity:1})
                    if(!dataCart)
                    {
                        return functions.setError(res,'hàng không tồn tại')
                    }
                    if(paymentType === 1){
                        amountPaid = totalProductCost[i]
                    }else{
                        if(promotionType[i] !== 0)
                        {
                            if(promotionType[i] === 1)
                            {
                                amountPaid = (((unitPrice[i] - ((unitPrice[i]*promotionValue[i])/100))*dataCart.quantity)*10)/100;
                            }else{
                                amountPaid = (((unitPrice[i] - promotionValue[i])*dataCart.quantity)*10)/100;
                            }
                        }
                        else{
                            amountPaid = ((unitPrice[i] * dataCart.quantity)*10)/100;

                        }
                    }
                    let _id = await functions.getMaxID(Order) + 1;
                    await Order.create({_id,codeOrder:codeOrder[i],phone,deliveryAddress,sellerId:sellerId[i],note,paymentType,
                        totalProductCost:totalProductCost[i],promotionType:promotionType[i],promotionValue:promotionValue[i],shipFee:shipFee[i],shipType:shipType[i],
                        tien_ttoan_ctra,paymentMethod,unitPrice:unitPrice[i],buyerId,status}
                        )
                    if (paymentMethod == 0) {
                        let tienConLai = check_money[0].money - tien_ttoan_ctra;
                        await User.findOneAndUpdate({idRaoNhanh365:buyerId},{money:tienConLai})
                        }
                    await Cart.findByIdAndDelete(cartID[i])
                } else {
                    return functions.setError(res, 'missing data', 404)
                }
            }
        }
        return functions.success(res, 'order success')
    } catch (error) {
        console.log("🚀 ~ file: order.js:43 ~ exports.order= ~ error:", error)
        return functions.setError(res, error)
    }
}
// Đấu thầu
exports.bidding = async (req, res, next) => {
    try {
        let { newId, productName, productDesc, price, priceUnit } = req.body;
        let userID = req.user.data.idRaoNhanh365;
        let product_link = req.body.product_link || null;
        let user_intro = req.body.user_intro || null;
        let uploadfile = req.files;
        let userFile = null;
        let userProfile = req.body.userProfile || null;
        let userProfileFile = null;
        let promotion = req.body.promotion || null;
        let promotionFile = null;
        let _id = await functions.getMaxID(Bidding) + 1;
        let status = 0;
        if (await functions.checkNumber(price) === false) {
            return functions.setError(res, 'invalid price', 400)
        }
        let check = await Bidding.find({ userID, newId })
        if (check.length) {
            return functions.setError(res, 'chỉ đấu thầu 1 lần với 1 tin', 400)
        }
        if (uploadfile.userFile) {
            if (uploadfile.userFile.length) return functions.setError(res, 'Tải lên quá nhiều file', 400)
            raoNhanh.uploadFileRaoNhanh('avt_dthau', userID, uploadfile.userFile, ['.jpg', '.png', '.docx', '.pdf'])
            userFile = functions.createLinkFileRaonhanh('avt_dthau', userID, uploadfile.userFile.name)
        } else if (uploadfile.userProfileFile) {
            if (uploadfile.userProfileFile.length) return functions.setError(res, 'Tải lên quá nhiều file', 400)
            raoNhanh.uploadFileRaoNhanh('avt_dthau', userID, uploadfile.userProfileFile, ['.jpg', '.png', '.docx', '.pdf'])
            userProfileFile = functions.createLinkFileRaonhanh('avt_dthau', userID, uploadfile.userProfileFile.name)
        } else if (uploadfile.promotionFile) {
            if (uploadfile.promotionFile.length) return functions.setError(res, 'Tải lên quá nhiều file', 400)
            raoNhanh.uploadFileRaoNhanh('avt_dthau', userID, uploadfile.promotionFile, ['.jpg', '.png', '.docx', '.pdf'])
            promotionFile = functions.createLinkFileRaonhanh('avt_dthau', userID, uploadfile.promotionFile.name)
        }
        await Bidding.create({ _id, newId, userID, productName, productDesc, status, price, priceUnit, product_link, user_intro, userFile, userProfile, userProfileFile, promotion, promotionFile })
        return functions.success(res, 'bidding success')
    } catch (error) {
        return functions.setError(res, error)
    }
}

// api thông báo kết quả đấu thầu
exports.announceResult = async (req, res, next) => {
    try {
        let { status, id_dauthau } = req.body;
        if (!status || !id_dauthau) {
            return functions.setError(res, 'missing data', 400);
        }
        if (await functions.checkNumber(status) === false || await functions.checkNumber(id_dauthau) === false) {
            return functions.setError(res, 'invalid number', 400);
        }
        let data = await Bidding.findById(id_dauthau);
        if (!data) {
            return functions.setError(res, 'not exits', 400);
        }
        if (data.updatedAt) {
            return functions.setError(res, 'Chỉ được cập nhật 1 lần', 400);
        }
        let updatedAt = new Date(Date.now())
        await Bidding.findByIdAndUpdate(id_dauthau, { status, updatedAt })
        return functions.success(res, 'Thông báo thành công')
    } catch (error) {
        return functions.setError(res, error)
    }
}

// quản lý đơn hàng mua
exports.manageOrderBuy = async (req, res, next) => {
    try {
        let linkTitle = req.params.linkTitle;
        let buyerId = req.user.data.idRaoNhanh365;
        let data = [];
        let sl_choXacNhan = await Order.find({ buyerId, status: 0 }).count();
        let sl_dangXuLy = await Order.find({ buyerId, status: 1 }).count();
        let sl_dangGiao = await Order.find({ buyerId, status: 2 }).count();
        let sl_daGiao = await Order.find({ buyerId, status: 3 }).count();
        let sl_daHuy = await Order.find({ buyerId, status: 4 }).count();
        let sl_hoanTat = await Order.find({ buyerId, status: 5 }).count();
        if (linkTitle === 'quan-ly-don-hang-mua.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "RN365_Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.buyerId": buyerId, "Order.status": 0 }
                },
                {
                    $project: { title: 1, img: 1, Order: { status: 1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-dang-xu-ly-nguoi-mua.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "RN365_Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.buyerId": buyerId, "Order.status": 1 }
                }, {
                    $project: { title: 1, img: 1, Order: { status: 1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-dang-giao-nguoi-mua.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "RN365_Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.buyerId": buyerId, "Order.status": 2 }
                }, {
                    $project: { title: 1, img: 1, Order: { status: 1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-da-giao-nguoi-mua.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "RN365_Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.buyerId": buyerId, "Order.status": 3 }
                }, {
                    $project: { title: 1, img: 1, Order: { status: 1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-da-huy-nguoi-mua.html') {
            console.log('2')
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "RN365_Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.buyerId": 1000, "Order.status": 4 }
                }, 
                {
                    $project: { title: 1, img: 1, Order: { status: 1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-hoan-tat-nguoi-mua.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "RN365_Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.buyerId": buyerId, "Order.status": 5 }
                }, {
                    $project: { title: 1, img: 1, Order: { status: 1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else {
            return functions.setError(res, 'link not exits', 404)
        }
        return functions.success(res, 'get data success', { sl_choXacNhan, sl_dangXuLy, sl_dangGiao, sl_daGiao, sl_daHuy, sl_hoanTat, data })
    } catch (error) {
        return functions.setError(res, error)
    }
}

// quản lý đơn hàng bán
exports.manageOrderSell = async (req, res, next) => {
    try {
        let linkTitle = req.params.linkTitle;
        let sellerId = req.user.data.idRaoNhanh365;
        let data = [];
        let sl_choXacNhan = await Order.find({ sellerId, status: 0 }).count();
        let sl_dangXuLy = await Order.find({ sellerId, status: 1 }).count();
        let sl_dangGiao = await Order.find({ sellerId, status: 2 }).count();
        let sl_daGiao = await Order.find({ sellerId, status: 3 }).count();
        let sl_daHuy = await Order.find({ sellerId, status: 4 }).count();
        let sl_hoanTat = await Order.find({ sellerId, status: 5 }).count();
        if (linkTitle === 'quan-ly-don-hang-ban.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "RN365_Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.sellerId": sellerId, "Order.status": 0 }
                },
                {
                    $project: { title: 1, img: 1, Order: { status: 1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-dang-xu-ly-nguoi-ban.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "RN365_Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.sellerId": sellerId, "Order.status": 1 }
                }, {
                    $project: { title: 1, img: 1, Order: { status: 1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-dang-giao-nguoi-ban.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "RN365_Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.sellerId": sellerId, "Order.status": 2 }
                }, {
                    $project: { title: 1, img: 1, Order: { status: 1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-da-giao-nguoi-ban.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "RN365_Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.sellerId": sellerId, "Order.status": 3 }
                }, {
                    $project: { title: 1, img: 1, Order: { status: 1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-da-huy-nguoi-ban.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "RN365_Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.sellerId": sellerId, "Order.status": 4 }
                }, {
                    $project: { title: 1, img: 1, Order: { status: 1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-hoan-tat-nguoi-ban.html') {
            data = await New.aggregate([
                {
                    $lookup: {
                        from: "RN365_Order",
                        localField: "_id",
                        foreignField: "newId",
                        as: "Order"
                    }
                },
                {
                    $match: { "Order.sellerId": sellerId, "Order.status": 5 }
                }, {
                    $project: { title: 1, img: 1, Order: { status: 1, codeOrder: 1, quantity: 1, classify: 1, buyTime: 1, totalProductCost: 1, amountPaid: 1 } }
                }
            ])
        } else {
            return functions.setError(res, 'link not exits', 404)
        }
        return functions.success(res, 'get data success', { sl_choXacNhan, sl_dangXuLy, sl_dangGiao, sl_daGiao, sl_daHuy, sl_hoanTat, data })
    } catch (error) {
        return functions.setError(res, error)
    }
}

// trạng thái đơn hàng
exports.statusOrder = async (req, res, next) => {
    try {
        let status = req.body.status;
        let orderId = req.body.orderId;
        let userID = req.user.data.idRaoNhanh365;
        let check = await Order.findById(orderId);
        if (!check || check.length === 0) {
            return functions.setError(res, 'không tìm thấy đơn hàng', 400)
        }
        if (await functions.checkNumber(status) === false) {
            return functions.setError(res, 'invalid data', 400)
        }
        if (userID === check[0].sellerId) {
            if (status === 1) {
                let sellerConfirmTime = new Date(Date.now());
                await Order.findByIdAndUpdate({ orderId }, { sellerConfirmTime, status })
            } else if (status === 2) {
                let deliveryStartTime = new Date(Date.now());
                await Order.findByIdAndUpdate({ orderId }, { deliveryStartTime, status })
            } else if (status === 3) {
                let totalDeliveryTime = new Date(Date.now());
                await Order.findByIdAndUpdate({ orderId }, { totalDeliveryTime, status })
            } else
                if (status === 4) {
                    let deliveryEndTime = new Date(Date.now());
                    await Order.findByIdAndUpdate({ orderId }, {
                        deliveryEndTime, status
                    })
                } else if (status === 5) {
                    let deliveryFailedTime = new Date(Date.now());
                    let deliveryFailureReason = req.body.deliveryFailureReason || null;
                    await Order.findByIdAndUpdate({ orderId }, { deliveryFailedTime, deliveryFailureReason })
                } else {
                    return functions.setError(res, 'invalid data', 400)
                }
        } else if (userID === check[0].buyerId) {
            if (status === 6) {
                let buyerConfirm = 1;
                let buyerConfirmTime = new Date(Date.now());
                await Order.findByIdAndUpdate({ orderId }, { buyerConfirm, buyerConfirmTime })
            } else {
                return functions.setError(res, 'invalid data', 400)
            }
        } else {
            return functions.setError(res, 'invalid data', 400)
        }
        return functions.success(res, 'change status success')
    }
    catch (error) {
        return functions.setError(res, error)
    }
}
// Huỷ đơn hàng
exports.cancelOrder = async (req, res, next) => {
    try {
        let orderId = req.body.orderId;
        let userID = req.user.data.idRaoNhanh365;
        let orderCancellationReason = req.body.orderCancellationReason || null;
        let check = await Order.findById(orderId);
        if (!check || check.length === 0) {
            return functions.setError(res, 'không tìm thấy đơn hàng', 400)
        }
        if (check[0].status === 4) {
            return functions.setError(res, 'không thể huỷ đơn hàng trong thời điểm này', 400)
        }
        if (userID === check[0].sellerId) {
            let orderCancellationTime = new Date();
            await Order.findByIdAndUpdate(orderId, { cancelerId: userID, orderCancellationTime, orderCancellationReason, status: 5 })
        }
        else {
            if (check[0].status === 2) {
                return functions.setError(res, 'không thể huỷ đơn hàng trong thời điểm này', 400)
            }
            if (check[0].status !== 3) {
                let orderCancellationTime = new Date();
                await Order.findByIdAndUpdate(orderId, { cancelerId: userID, orderCancellationTime, orderCancellationReason, status: 5 })
            }
            if (check[0].status === 3) {
                let buyerCancelsDelivered = 1;
                let buyerCancelsDeliveredTime = new Date();
                await Order.findByIdAndUpdate(orderId, { cancelerId: userID, buyerCancelsDelivered, buyerCancelsDeliveredTime, status: 5, orderCancellationReason })
            }
        }
        return functions.success(res, 'Huỷ đơn hàng thành công')
    }
    catch (error) {
        console.log("🚀 ~ file: order.js:478 ~ exports.cancelOrder= ~ error:", error)
        return functions.setError(res, error)
    }
}