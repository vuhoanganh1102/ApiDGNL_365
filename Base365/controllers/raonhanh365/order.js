const functions = require('../../services/functions');
const New = require('../../models/Raonhanh365/New');
const User = require('../../models/Users');
const Order = require('../../models/Raonhanh365/Order');
const Bidding = require('../../models/Raonhanh365/Bidding');
const raoNhanh = require('../../services/raoNhanh');
const Cart = require('../../models/Raonhanh365/Cart');
const Notify = require('../../models/Raonhanh365/Notify');

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
        let idRaoNhanh365 = req.user.data.idRaoNhanh365;
        let status = 0;
        let amountPaid = 0;
        if (Array.isArray(codeOrder)) {
            for (let i = 0; i < codeOrder.length; i++) {
                if (phone && deliveryAddress && sellerId[i]
                    && paymentType && totalProductCost[i] &&
                    shipFee[i] && shipType[i]
                    && tien_ttoan_ctra && paymentMethod && cartID[i] && unitPrice[i]) {
                    if (await functions.checkNumber(tien_ttoan_ctra) === false
                        || await functions.checkNumber(totalProductCost[i]) === false) {
                        return functions.setError(res, 'invalid number', 400)
                    }
                    let check_money = await User.findOne({ idRaoNhanh365 })
                    if (!check_money) {
                        return functions.setError(res, 'người dùng không tồn tại', 400)
                    }
                    if (paymentMethod === 0 && tien_ttoan_ctra !== 0) {
                        if (tien_ttoan_ctra > check_money.inforRN365.money) {
                            return functions.setError(res, 'Số tiền của bạn không đầy đủ mua hàng', 400)
                        }
                    }
                    if (await functions.checkPhoneNumber(phone) === false) {
                        return functions.setError(res, 'invalid phone number', 400)
                    }
                    let dataCart = await Cart.findById(cartID[i], { newsId: 1, quantity: 1 })
                    if (!dataCart) {
                        return functions.setError(res, 'hàng không tồn tại', 400)
                    }
                    if (paymentType === 1) {
                        amountPaid = totalProductCost[i]
                    } else {
                        if (promotionType[i] !== 0) {
                            if (promotionType[i] === 1) {
                                amountPaid = (((unitPrice[i] - ((unitPrice[i] * promotionValue[i]) / 100)) * dataCart.quantity) * 10) / 100;
                            } else {
                                amountPaid = (((unitPrice[i] - promotionValue[i]) * dataCart.quantity) * 10) / 100;
                            }
                        }
                        else {
                            amountPaid = ((unitPrice[i] * dataCart.quantity) * 10) / 100;

                        }
                    }
                    let _id = await functions.getMaxID(Order) + 1;
                    await Order.create({
                        _id, codeOrder: codeOrder[i], phone, deliveryAddress, sellerId: sellerId[i], note, paymentType,
                        totalProductCost: totalProductCost[i], promotionType: promotionType[i], promotionValue: promotionValue[i], shipFee: shipFee[i], shipType: shipType[i],
                        amountPaid, paymentMethod, unitPrice: unitPrice[i], buyerId: idRaoNhanh365, status, newId: dataCart.newsId
                    }
                    )
                    if (paymentMethod == 0) {
                        if (check_money.inforRN365) {
                            let tienConLai = check_money.inforRN365.money - tien_ttoan_ctra;
                            await User.findOneAndUpdate({ idRaoNhanh365 }, { 'inforRN365.money': tienConLai })
                        }
                    }
                    await Cart.findByIdAndDelete(cartID[i])
                } else {
                    return functions.setError(res, 'missing data', 404)
                }
            }
            return functions.success(res, 'order success')
        }
        return functions.setError(res, 'missing data', 404)
    } catch (error) {
        console.log("🚀 ~ file: order.js:43 ~ exports.order= ~ error:", error)
        return functions.setError(res, error.message)
    }
}
// Đấu thầu
exports.bidding = async (req, res, next) => {
    try {
        let { newId, productName, productDesc, price, priceUnit } = req.body;
        let userID = req.user.data.idRaoNhanh365;
        let productLink = req.body.productLink || null;
        let uploadfile = req.files;
        let userFile = null;
        let userProfile = req.body.userProfile || null;
        let userProfileFile = null;
        let promotion = req.body.promotion || null;
        let promotionFile = null;
        let _id = await functions.getMaxID(Bidding) + 1;
        let status = 0;
        let userIntro = req.body.userIntro || null;
        let userName = req.body.userName;
        if (await functions.checkNumber(price) === false) {
            return functions.setError(res, 'invalid price', 400)
        }
        let check = await Bidding.find({ userID, newId })
        if (check.length) {
            return functions.setError(res, 'chỉ đấu thầu 1 lần với 1 tin', 400)
        }
        if (uploadfile.userFile) {
            if (uploadfile.userFile.length) return functions.setError(res, 'Tải lên quá nhiều file', 400)
            userFile = await raoNhanh.uploadFileRaoNhanh('avt_dthau', userID, uploadfile.userFile, ['.jpg', '.png', '.docx', '.pdf'])
        }
        if (uploadfile.userProfileFile) {
            if (uploadfile.userProfileFile.length) return functions.setError(res, 'Tải lên quá nhiều file', 400)
            userProfileFile = await raoNhanh.uploadFileRaoNhanh('avt_dthau', userID, uploadfile.userProfileFile, ['.jpg', '.png', '.docx', '.pdf'])
        }
        if (uploadfile.promotionFile) {
            if (uploadfile.promotionFile.length) return functions.setError(res, 'Tải lên quá nhiều file', 400)
            promotionFile = await raoNhanh.uploadFileRaoNhanh('avt_dthau', userID, uploadfile.promotionFile, ['.jpg', '.png', '.docx', '.pdf'])
        }
        await Bidding.create({ _id, newId, userName, userIntro, userID, productName, productDesc, status, price, priceUnit, productLink, userFile, userProfile, userProfileFile, promotion, promotionFile })
        return functions.success(res, 'bidding success', { id: _id })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

// quản lý đơn hàng mua
exports.manageOrderBuy = async (req, res, next) => {
    try {

        let linkTitle = req.body.linkTitle;
        let buyerId = req.user.data.idRaoNhanh365;
        let data = [];
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let sl_choXacNhan = await Order.find({ buyerId, status: 0 }).count();
        let sl_dangXuLy = await Order.find({ buyerId, status: 1 }).count();
        let sl_dangGiao = await Order.find({ buyerId, status: 2 }).count();
        let sl_daGiao = await Order.find({ buyerId, status: 3 }).count();
        let sl_daHuy = await Order.find({ buyerId, status: 4 }).count();
        let sl_hoanTat = await Order.find({ buyerId, status: 5 }).count();
        let searchItem = {
            sellerId: 1,
            new: { _id: 1, userID: 1, until: 1, type: 1, linkTitle: 1, title: 1, money: 1, img: 1, cateID: 1 },
            user: { userName: 1, avatarUser: 1, type: 1, _id: 1, },
            orderActive: 1, _id: 1, buyerId: 1, sellerConfirmTime: 1, codeOrder: 1, quantity: 1, classify: 1, unitPrice: 1, amountPaid: 1
        }
        if (linkTitle === 'quan-ly-don-hang-mua.html') {
            data = await Order.aggregate([
                {
                    $match: { buyerId, status: 0 }
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                { $unwind: "$new" },
                {
                    $lookup: {
                        from: "Users",
                        localField: "sellerId",
                        foreignField: "idRaoNhanh365",
                        as: "user"
                    }
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-dang-xu-ly-nguoi-mua.html') {
            data = await Order.aggregate([
                { $match: { buyerId, status: 1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "sellerId",
                        foreignField: "idRaoNhanh365",
                        as: "user"
                    }
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                { $project: searchItem },

            ])
        } else if (linkTitle === 'quan-ly-don-hang-dang-giao-nguoi-mua.html') {
            data = await Order.aggregate([
                { $match: { buyerId, status: 2 } },
                { $skip: skip },
                { $limit: pageSize },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "sellerId",
                        foreignField: "idRaoNhanh365",
                        as: "user"
                    }
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                { $project: searchItem },

            ])
        } else if (linkTitle === 'quan-ly-don-hang-da-giao-nguoi-mua.html') {
            data = await Order.aggregate([
                {
                    $match: { buyerId, status: 3 }
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                { $unwind: "$new" },
                {
                    $lookup: {
                        from: "Users",
                        localField: "sellerId",
                        foreignField: "idRaoNhanh365",
                        as: "user"
                    }
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-da-huy-nguoi-mua.html') {
            data = await Order.aggregate([
                { $match: { buyerId, status: 4 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                { $unwind: "$new" },
                {
                    $lookup: {
                        from: "Users",
                        localField: "sellerId",
                        foreignField: "idRaoNhanh365",
                        as: "user"
                    }
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-hoan-tat-nguoi-mua.html') {
            data = await Order.aggregate([
                { $match: { buyerId, status: 5 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                { $unwind: "$new" },
                {
                    $lookup: {
                        from: "Users",
                        localField: "sellerId",
                        foreignField: "idRaoNhanh365",
                        as: "user"
                    }
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                { $project: searchItem }

            ])

        } else {
            return functions.setError(res, 'link not exits', 404)
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].new.img) {
                data[i].new.img = await raoNhanh.getLinkFile(data[i].new.userID, data[i].new.img, data[i].new.cateID, 2);
            }
            if (data[i].user && data[i].user.avatarUser) {
                data[i].user.avatarUser = await raoNhanh.getLinkAvatarUser(data[i].user.avatarUser);
            }
        }
        return functions.success(res, 'get data success', { sl_choXacNhan, sl_dangXuLy, sl_dangGiao, sl_daGiao, sl_daHuy, sl_hoanTat, data })
    } catch (error) {
        console.log("🚀 ~ file: order.js:370 ~ exports.manageOrderBuy= ~ error:", error)
        return functions.setError(res, error.message)
    }
}

// quản lý đơn hàng bán
exports.manageOrderSell = async (req, res, next) => {
    try {
        let linkTitle = req.body.linkTitle;
        let sellerId = req.user.data.idRaoNhanh365;
        let data = [];
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let sl_choXacNhan = await Order.find({ sellerId, status: 0 }).count();
        let sl_dangXuLy = await Order.find({ sellerId, status: 1 }).count();
        let sl_dangGiao = await Order.find({ sellerId, status: 2 }).count();
        let sl_daGiao = await Order.find({ sellerId, status: 3 }).count();
        let sl_daHuy = await Order.find({ sellerId, status: 4 }).count();
        let sl_hoanTat = await Order.find({ sellerId, status: 5 }).count();
        let searchItem = {
            sellerId: 1, new: { _id: 1, userID: 1, until: 1, type: 1, linkTitle: 1, title: 1, money: 1, img: 1, cateID: 1 },
            user: { userName: 1, avatarUser: 1, type: 1, _id: 1, },
            orderActive: 1, _id: 1, buyerId: 1, sellerConfirmTime: 1, codeOrder: 1, quantity: 1, classify: 1,

        };
        if (linkTitle === 'quan-ly-don-hang-ban.html') {

            data = await Order.aggregate([
                {
                    $match: { sellerId, status: 0 }
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                { $unwind: "$new" },
                {
                    $lookup: {
                        from: "Users",
                        localField: "buyerId",
                        foreignField: "idRaoNhanh365",
                        as: "user"
                    }
                },
                { $unwind: "$user" },

                { $project: searchItem }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-dang-xu-ly-nguoi-ban.html') {

            data = await Order.aggregate([
                {
                    $match: { sellerId, status: 1, orderActive: 1 }
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                {
                    $unwind: "$new"
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "buyerId",
                        foreignField: "idRaoNhanh365",
                        as: "user"
                    }
                },
                { $unwind: "$user" },

                { $project: searchItem }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-dang-giao-nguoi-ban.html') {
            data = await Order.aggregate([
                {
                    $match: { sellerId, status: 2 }
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                { $unwind: "$new" },
                {
                    $lookup: {
                        from: "Users",
                        localField: "buyerId",
                        foreignField: "idRaoNhanh365",
                        as: "user"
                    }
                },
                { $unwind: "$user" },

                { $project: searchItem }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-da-giao-nguoi-ban.html') {
            data = await Order.aggregate([
                {
                    $match: { sellerId, status: 3 }
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                { $unwind: "$new" },
                {
                    $lookup: {
                        from: "Users",
                        localField: "buyerId",
                        foreignField: "idRaoNhanh365",
                        as: "user"
                    }
                },
                { $unwind: "$user" },

                { $project: searchItem }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-da-huy-nguoi-ban.html') {
            data = await Order.aggregate([
                {
                    $match: { sellerId, status: 4 }
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                { $unwind: "$new" },
                {
                    $lookup: {
                        from: "Users",
                        localField: "buyerId",
                        foreignField: "idRaoNhanh365",
                        as: "user"
                    }
                },
                { $unwind: "$user" },

                { $project: searchItem }
            ])
        } else if (linkTitle === 'quan-ly-don-hang-hoan-tat-nguoi-ban.html') {
            data = await Order.aggregate([
                {
                    $match: { sellerId, status: 5 }
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "RN365_News",
                        localField: "newId",
                        foreignField: "_id",
                        as: "new"
                    }
                },
                { $unwind: "$new" },
                {
                    $lookup: {
                        from: "Users",
                        localField: "buyerId",
                        foreignField: "idRaoNhanh365",
                        as: "user"
                    }
                },
                { $unwind: "$user" },

                { $project: searchItem }
            ])

        } else {
            return functions.setError(res, 'link not exits', 404)
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].new.img) {
                data[i].new.img = await raoNhanh.getLinkFile(data[i].new.userID, data[i].new.img, data[i].new.cateID, 2);
            }
            if (data[i].user && data[i].user.avatarUser) {
                data[i].user.avatarUser = await raoNhanh.getLinkAvatarUser(data[i].user.avatarUser);
            }
        }
        return functions.success(res, 'get data success', { sl_choXacNhan, sl_dangXuLy, sl_dangGiao, sl_daGiao, sl_daHuy, sl_hoanTat, data })
    } catch (error) {
        console.log("🚀 ~ file: order.js:422 ~ exports.manageOrderSell= ~ error:", error)
        return functions.setError(res, error.message)
    }
}

// trạng thái đơn hàng
exports.statusOrder = async (req, res, next) => {
    try {
        let status = Number(req.body.status);
        let orderId = Number(req.body.orderId);
        let userID = req.user.data.idRaoNhanh365;
        let check = await Order.aggregate([
            { $match: { _id: orderId } },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'sellerId',
                    foreignField: 'idRaoNhanh365',
                    as: 'nguoiban'
                }
            },
            { $unwind: '$nguoiban' },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'buyerId',
                    foreignField: 'idRaoNhanh365',
                    as: 'nguoimua'
                }
            },
            { $unwind: '$nguoimua' },
            {
                $lookup: {
                    from: 'RN365_News',
                    localField: 'newId',
                    foreignField: '_id',
                    as: 'new'
                }
            },
            { $unwind: '$new' },
            {
                $project: {
                    _id: 1,
                    sellerId: 1,
                    buyerId: 1,
                    nguoiban: { _id: 1, chat365_secret: 1, chat365_id: 1 },
                    nguoimua: { _id: 1, chat365_secret: 1, chat365_id: 1 },
                    newId: 1,
                    status: 1,
                    title: 'new.title'
                }
            }

        ]);
        if (!check || check.length === 0) {
            return functions.setError(res, 'không tìm thấy đơn hàng', 400)
        }
        check = check[0]
        if (await functions.checkNumber(status) === false) {
            return functions.setError(res, 'invalid data', 400)
        }
        let id = await functions.getMaxID(Notify) + 1 || 1;
        if (userID === check.sellerId) {
            if (status === 1) {
                let sellerConfirmTime = new Date();
                await Order.findByIdAndUpdate(orderId, { sellerConfirmTime, status })
                let noi_dung = "thông báo xác nhận sản phẩm mua và đang xử lý";
                var noidunggui = `thông báo xác nhận sản phẩm mua và đang xử lý ${check.title}`;
                await Notify.create({
                    _id:id,
                    from: check.sellerId,
                    newId: check.newId,
                    to: check.buyerId,
                    type: 5,
                    createdAt: sellerConfirmTime,
                    content: noi_dung
                })
                await raoNhanh.sendChat(check.sellerId, check.newId, noidunggui)
            } else if (status === 2) {
                let deliveryStartTime = new Date();
                await Order.findByIdAndUpdate(orderId, { deliveryStartTime, status })
                let noi_dung = "thông báo bắt đầu giao hàng";
                var noidunggui = `Bắt đầu giao hàng cho bạn:  ${check.title}`;
                await Notify.create({
                    _id:id,
                    from: check.sellerId,
                    newId: check.newId,
                    to: check.buyerId,
                    type: 6,
                    createdAt: deliveryStartTime,
                    content: noi_dung
                })
                await raoNhanh.sendChat(check.sellerId, check.newId, noidunggui)
            } else if (status === 3) {
                let totalDeliveryTime = new Date();
                await Order.findByIdAndUpdate(orderId, { totalDeliveryTime, status })
                let noi_dung = "thông báo giao hàng thành công";
                var noidunggui = `Giao hàng thành công cho bạn:   ${check.title}`;
                await Notify.create({
                    _id:id,
                    from: check.sellerId,
                    newId: check.newId,
                    to: check.buyerId,
                    type: 8,
                    createdAt: totalDeliveryTime,
                    content: noi_dung
                })
                await raoNhanh.sendChat(check.sellerId, check.newId, noidunggui)
            } else if (status === 4) {
                let deliveryEndTime = new Date();
                await Order.findByIdAndUpdate(orderId, {
                    deliveryEndTime, status
                })
                let noi_dung = "thông báo hoàn tất đơn hàng";
                var noidunggui = `Hoàn tất đơn hàng cho bạn:    ${check.title}`;
                await Notify.create({
                    _id:id,
                    from: check.sellerId,
                    newId: check.newId,
                    to: check.buyerId,
                    type: 9,
                    createdAt: deliveryEndTime,
                    content: noi_dung
                })
                await raoNhanh.sendChat(check.sellerId, check.newId, noidunggui)
                await raoNhanh.sendChat(56387, check.newId, noidunggui)
            } else if (status === 5) {
                let deliveryFailedTime = new Date();
                let deliveryFailureReason = req.body.deliveryFailureReason || null;
                await Order.findByIdAndUpdate(orderId, { deliveryFailedTime, deliveryFailureReason })
            } else {
                return functions.setError(res, 'invalid data', 400)
            }
        } else if (userID === check.buyerId) {
            if (status === 6) {
                let buyerConfirm = 1;
                let buyerConfirmTime = new Date();
                await Order.findByIdAndUpdate(orderId, { buyerConfirm, buyerConfirmTime })
            } else {
                return functions.setError(res, 'invalid data1', 400)
            }
        } else {
            return functions.setError(res, 'invalid data2', 400)
        }
        return functions.success(res, 'change status success')
    }
    catch (error) {
        return functions.setError(res, error.message)
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
        if (userID === check.sellerId) {
            let orderCancellationTime = new Date();
            await Order.findByIdAndUpdate(orderId, { cancelerId: userID, orderCancellationTime, orderCancellationReason, status: 5 })
            return functions.success(res, 'Huỷ đơn hàng thành công')

        }
        if (check.status === 4) {
            return functions.setError(res, 'không thể huỷ đơn hàng trong thời điểm này', 400)
        }
        else {
            if (check.status === 2) {
                return functions.setError(res, 'không thể huỷ đơn hàng trong thời điểm này', 400)
            }
            if (check.status !== 3) {
                let orderCancellationTime = new Date();
                await Order.findByIdAndUpdate(orderId, { cancelerId: userID, orderCancellationTime, orderCancellationReason, status: 5 })
            }
            if (check.status === 3) {
                let buyerCancelsDelivered = 1;
                let buyerCancelsDeliveredTime = new Date();
                await Order.findByIdAndUpdate(orderId, { cancelerId: userID, buyerCancelsDelivered, buyerCancelsDeliveredTime, status: 5, orderCancellationReason })
            }
        }
        return functions.success(res, 'Huỷ đơn hàng thành công')
    }
    catch (error) {
        console.log("🚀 ~ file: order.js:478 ~ exports.cancelOrder= ~ error:", error)
        return functions.setError(res, error.message)
    }
}