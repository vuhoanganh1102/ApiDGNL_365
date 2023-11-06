const New = require('../../models/Timviec365/UserOnSite/Company/New');
const HistoryNewPoint = require('../../models/Timviec365/HistoryNewPoint');
const LikePost = require('../../models/Timviec365/UserOnSite/LikePost');
const CommentPost = require('../../models/Timviec365/UserOnSite/CommentPost');
const PermissionNotify = require('../../models/Timviec365/PermissionNotify');
const axios = require('axios');
const functions = require("../../services/functions");

exports.checkExistTitle = async(comID, title, newID = null) => {
    let condition = {
        new_user_id: Number(comID),
        new_title: title
    };

    if (newID) condition.new_id = { $ne: Number(newID) };

    const result = await New.findOne(condition).lean();
    if (result) {
        return false;
    } else {
        return true;
    }
}

exports.checkSpecalCharacter = async(title) => {
    var pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return pattern.test(title);
}

exports.foundKeywordHot = async(title) => {
    if ((title.indexOf("hot") || title.indexOf("tuyển gấp") || title.indexOf("cần gấp") || title.indexOf("lương cao")) > -1) return false;
    else return true;
}

exports.recognition_tag_tin = async(cateID, title, description, require) => {
    let result;
    try {
        let takeData = await axios({
            method: "post",
            url: "http://43.239.223.10:5001/recognition_tag_tin",
            data: {
                key_cat_lq: cateID,
                new_title: title,
                new_mota: description,
                new_yeucau: require
            },
            headers: { "Content-Type": "multipart/form-data" }
        });
        result = takeData.data.data.items;
    } catch (error) {
        result = "";
    }
    return result;
}

exports.getMoney = async(typeNewMoney, money, minValue, maxValue) => {
    switch (Number(typeNewMoney)) {
        case 1:
            maxValue = null;
            minValue = null;
            break;
        case 2:
            for (const threshold of functions.thresholds) {
                if (minValue >= threshold.minValue && minValue < threshold.maxValue) {
                    money = threshold.money;
                    break;
                }
            }
            maxValue = null;
            break;
        case 3:
            for (const threshold of functions.thresholds) {
                if (maxValue > threshold.minValue && maxValue <= threshold.maxValue) {
                    money = threshold.money;
                    break;
                }
            }
            minValue = null;
            break;
        case 4:
            for (const threshold of functions.thresholds) {
                if (minValue >= threshold.minValue && maxValue <= threshold.maxValue) {
                    money = threshold.money;
                    break;
                }
            }
            minValue = null;
            break;
        case 5:
            money = money;
            break;
        default:
            break;
    }
    return { money, maxValue, minValue };
}

exports.suggest_vl_ut = async(new_id, pagination = 1, size = 12, ghim = 0, list_id_hide = "") => {
    let result;
    try {
        let takeData = await axios({
            method: "post",
            url: "http://43.239.223.10:4001/recommendation_ungvien_ut",
            data: {
                site: "timviec365",
                new_id: new_id,
                pagination: pagination,
                size: size,
                find_new_ghim: ghim,
                hide_list_id: list_id_hide
            },
            headers: { "Content-Type": "multipart/form-data" }
        });
        result = takeData.data.data.items;
    } catch (error) {
        result = "";
    }
    return result;
}
exports.logHistoryNewPoint = async(new_id, point, type) => {
    const getMaxItem = await HistoryNewPoint.findOne({}, { nh_id: 1 }).sort({ nh_id: -1 }).limit(1).lean(),
        itemHistory = new HistoryNewPoint({
            nh_id: Number(getMaxItem.nh_id) + 1,
            nh_new_id: new_id,
            nh_point: point,
            nh_type_point: type,
            nh_created_at: functions.getTimeNow(),
        });
    await itemHistory.save();
}

exports.inforLikeComment = async(new_id) => {
    let element = {};
    // Lấy danh sách thả cảm xúc
    element.arr_likes_new = await LikePost.aggregate([{
            $match: {
                lk_new_id: Number(new_id),
                lk_type: { $ne: 8 },
                lk_for_comment: 0
            }
        },
        {
            $lookup: {
                from: "Users",
                localField: "lk_user_idchat",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $skip: 0
        },
        {
            $project: {
                lk_id: 1,
                lk_type: 1,
                lk_for_comment: 1,
                lk_user_name: "$user.userName",
                lk_user_avatar: "$user.avatarUser",
                lk_user_idchat: "$user._id"
            }
        },
    ]);
    // lấy danh sách chia sẻ
    element.arr_share_new = await LikePost.aggregate([{
            $match: {
                lk_new_id: Number(new_id),
                lk_type: { $eq: 8 },
                lk_for_comment: 0
            }
        },
        {
            $lookup: {
                from: "Users",
                localField: "lk_user_idchat",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $skip: 0
        },
        {
            $project: {
                lk_id: 1,
                lk_type: 1,
                lk_for_comment: 1,
                lk_user_name: "$user.userName",
                lk_user_avatar: "$user.avatarUser",
                lk_user_idchat: "$user._id"
            }
        },
    ]);
    // lấy tổng số bình luận
    element.count_comments = await CommentPost.countDocuments({ cm_parent_id: 0, cm_new_id: Number(new_id) });

    return element;
}

exports.inforLikeChild = async(new_id, parent) => {
    // Lấy danh sách thả cảm xúc
    const arr_likes_new = await LikePost.aggregate([{
            $match: {
                lk_new_id: Number(new_id),
                lk_type: { $ne: 8 },
                lk_for_comment: 0
            }
        },
        {
            $lookup: {
                from: "Users",
                localField: "lk_user_idchat",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $skip: 0
        },
        {
            $sort: {
                lk_type: 1
            }
        }, {
            $project: {
                lk_id: 1,
                lk_type: 1,
                lk_for_comment: 1,
                lk_user_name: "$user.userName",
                lk_user_avatar: "$user.avatarUser",
                lk_user_idchat: "$user._id"
            }
        },
    ]);
    return arr_likes_new;
}

exports.inforCommentChild = async(new_id, parent) => {
    const list = await CommentPost.aggregate([{
            $match: {
                cm_new_id: new_id,
                cm_parent_id: parent
            }
        }, {
            $lookup: {
                from: "Users",
                localField: "cm_sender_idchat",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $sort: {
                cm_time: 1
            }
        }, {
            $project: {
                cm_id: 1,
                cm_url: 1,
                cm_new_id: 1,
                cm_sender_idchat: "$user.userName",
                cm_sender_avatar: "$user.avatarUser",
                cm_sender_idchat: 1,
                cm_comment: 1,
                cm_img: 1,
                cm_ip: 1,
                cm_tag: 1,
                cm_time: 1
            }
        }
    ]);
    return list;
}

exports.up_notify = async(arr_noti, pn_usc_id = 0, pn_use_id = 0, type = 0, id_new = 0) => {
    if (arr_noti) {
        const array = JSON.parse(arr_noti);
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            const time = functions.getTimeNow();
            const pn = await PermissionNotify.findOne({}, { pn_id: 1 }).sort({ pn_id: -1 }).limit(1);
            const item = new PermissionNotify({
                pn_id: Number(pn.pn_id) + 1,
                pn_usc_id: pn_usc_id,
                pn_use_id: pn_use_id,
                pn_id_chat: element.id_chat,
                pn_id_new: id_new,
                pn_type: type,
                pn_type_noti: element.type_noti,
                pn_created_at: time
            });
            await item.save();
        }
    }
};

exports.update_notify = async(arr_delete, arr_noti, pn_usc_id = 0, pn_use_id = 0, type = 0, id_new = 0) => {
    if (arr_delete) {
        const arrayDelete = JSON.parse(arr_delete);
        for (let i = 0; i < arrayDelete.length; i++) {
            const element = arrayDelete[i];
            await PermissionNotify.deleteOne({
                pn_id_new: id_new,
                pn_id_chat: element,
                pn_usc_id: pn_usc_id
            });

        }
    }

    if (arr_noti) {
        const array = JSON.parse(arr_noti);
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            const time = functions.getTimeNow();
            if (element.check == 1) {
                const pn = await PermissionNotify.findOne({}, { pn_id: 1 }).sort({ pn_id: -1 }).limit(1);
                const item = new PermissionNotify({
                    pn_id: Number(pn.pn_id) + 1,
                    pn_usc_id: pn_usc_id,
                    pn_use_id: pn_use_id,
                    pn_id_chat: element.id_chat,
                    pn_id_new: id_new,
                    pn_type: type,
                    pn_type_noti: element.type_noti,
                    pn_created_at: time
                });
                await item.save();
            } else if (element.check == 0) {
                await PermissionNotify.updateOne({
                    pn_id_chat: element.id_chat,
                    pn_id_new: id_new,
                    pn_usc_id: pn_usc_id
                }, {
                    $set: { pn_type_noti: element.type_noti }
                });
            }

        }
    }
}