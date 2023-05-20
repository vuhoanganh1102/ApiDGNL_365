const functions = require('../../services/functions')
const City = require('../../models/Timviec365/Timviec/City.model')
const District = require('../../models/Timviec365/Timviec/District.model');
const NewTV365 = require('../../models/Timviec365/Timviec/Company/New.model');
const Users = require('../../models/Users')
const ApplyForJob = require('../../models/Timviec365/Timviec/Candicate/ApplyForJob.model');
const UserSavePost = require('../../models/Timviec365/Timviec/Candicate/UserSavePost.model')

// đăng tin
exports.postNewTv365 = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365,
            request = req.body,
            title = request.new_title,
            cateID = request.new_cat_id,
            soLuong = request.new_soluong,
            capBac = request.new_cap_bac,
            hinhThuc = request.new_hinhthuc,
            city = request.new_city,
            district = request.new_qh,
            address = request.new_addr,
            until = request.new_money_unit,
            hoaHong = request.new_hh,
            typeNewMoney = request.new_money_kg,
            tgtv = request.new_tgtv,
            minValue = request.new_money_min,
            maxValue = request.new_money_max,
            moTa = request.new_mota,
            yeuCau = request.new_yeucau,
            exp = request.new_exp,
            bangCap = request.bangCap,
            sex = request.new_gender,
            quyenLoi = request.new_quyenloi,
            hoSo = request.new_hoso,
            hanNop = request.hannop,
            userContactName = request.namelh,
            userContactAddress = request.addresslh,
            userContactPhone = request.phonelh,
            userContactEmail = request.emaillh,
            linkVideo = req.linkVideo,
            avatar = req.files.avatarUser,
            videoType = req.files.videoType,
            lv = request.new_lv,
            money = 1;
        let video = '';
        let link = '';
        // mảng chứa danh sách ảnh của tin
        let listImg = [];
        // mảng chưa danh sách các tiêu đề đã có
        let listArrPost = [];
        if (title && cateID && soLuong && capBac && hinhThuc && city && district && address &&
            until && moTa && yeuCau && exp && bangCap && sex && quyenLoi && hanNop && userContactName &&
            userContactAddress && userContactPhone && userContactEmail && typeNewMoney) {
            // check title trùng với title đã đăng hay không
            let listPost = await functions.getDatafind(NewTV365, { userID: idCompany });
            if (listPost.length > 0) {
                listPost.forEach((element) => {
                    listArrPost.push(element.title)
                })
            }
            let checkTile = await functions.checkTilte(title, listArrPost);
            // validate title
            let checkValidateTilte = await functions.checkTilte(title, functions.keywordsTilte);
            if ((checkValidateTilte == false || checkTile == false)) {
                await functions.deleteImgVideo(avatar, videoType)
                return functions.setError(res, 'tiêu đề đã có từ bài viết trước hoặc chưa từ khóa không cho phép', 404)
            }
            // check type của new money
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
                        if (maxValue > threshold.maxValue) {
                            money = threshold.money
                        }
                    }
                    minValue = null;
                    break;
                case 5:
                    money = request.money;
                    break;
                default:
                    break;
            }
            //check video
            if (videoType) {
                if (videoType.length == 1) {
                    let checkVideo = await functions.checkVideo(videoType[0]);
                    if (checkVideo) {
                        video = videoType[0].filename
                    } else {
                        videoType.forEach(async(element) => {
                            await functions.deleteImg(element)
                        })
                        return functions.setError(res, 'video không đúng định dạng hoặc lớn hơn 100MB ', 404)
                    }
                } else
                if (videoType.length > 1) {
                    await functions.deleteImgVideo(avatar, videoType)
                    return functions.setError(res, 'chỉ được đưa lên 1 video', 404)
                }
            }

            //check ảnh
            if (avatar && avatar.length >= 1 && avatar.length <= 6) {
                let isValid = true;
                for (let i = 0; i < avatar.length; i++) {
                    let checkImg = await functions.checkImage(avatar[i].path);
                    if (checkImg) {
                        listImg.push(avatar[i].filename);
                    } else {
                        isValid = false;
                    }
                }
                if (isValid == false) {
                    await functions.deleteImgVideo(avatar, videoType)
                    return functions.setError(res, 'đã có ảnh sai định dạng hoặc lớn hơn 2MB', 404)
                }
            } else if (avatar && avatar.length > 6) {
                await functions.deleteImgVideo(avatar, videoType)
                return functions.setError(res, 'chỉ được đưa lên tối đa 6 ảnh', 404)
            }

            // check link video
            if (linkVideo) {
                let checkLink = await functions.checkLink(linkVideo);
                if (checkLink) {
                    link = linkVideo;
                } else {
                    await functions.deleteImgVideo(avatar, videoType)
                    return functions.setError(res, 'link không đúng định dạng ', 404)
                }
            }
            // check thời gian hạn nộp
            let checkTime = await functions.checkTime(hanNop)
            if (checkTime == false) {
                await functions.deleteImgVideo(avatar, videoType)
                return functions.setError(res, 'thời gian hạn nộp phải lớn hơn thời gian hiện tại', 404)
            }
            let checkEmail = await functions.checkEmail(userContactEmail);
            let checkPhone = await functions.checkPhoneNumber(userContactPhone);
            if (checkEmail == false || checkPhone == false) {
                return functions.setError(res, 'email hoặc số điện thoại không đúng định dạng', 404)
            }
            //check kho ảnh

            let maxID = await functions.getMaxID(NewTV365) || 1;
            const newTV = new NewTV365({
                _id: (Number(maxID) + 1),
                title: title,
                userID: idCompany,
                alias: '',
                redirect301: '',
                cateID: [cateID],
                cityID: [city],
                districtID: [district],
                address: address,
                money: money,
                capBac: capBac,
                exp: exp,
                sex: sex,
                bangCap: bangCap,
                soLuong: soLuong,
                hinhThuc: hinhThuc,
                createTime: new Date().getTime(),
                updateTime: new Date().getTime(),
                active: 0,
                type: 1,
                viewCount: 0,
                hanNop: hanNop,
                newMutil: {
                    moTa: moTa,
                    yeuCau: yeuCau,
                    quyenLoi: quyenLoi,
                    hoSo: hoSo,
                    hoaHong: hoaHong || " ",
                    tgtv: tgtv || " ",
                    videoType: video || " ",
                    images: listImg || null,
                    link: link,
                    lv: lv,
                },
                newMoney: {
                    type: typeNewMoney,
                    minValue: minValue || null,
                    maxValue: maxValue || null,
                    until: until || 1,
                }
            });
            await newTV.save();
            await Users.updateOne({ idTimViec365: idCompany }, {
                $set: {
                    'inForCompany.userContactName': userContactName,
                    'inForCompany.userContactPhone': userContactPhone,
                    'inForCompany.userContactAddress': userContactAddress,
                    'inForCompany.userContactEmail': userContactEmail,
                }
            });
            return functions.success(res, "tạo bài tuyển dụng thành công")
        } else {
            await functions.deleteImgVideo(avatar, videoType)
            return functions.setError(res, 'thiếu dữ liệu', 404)
        }

    } catch (error) {
        console.log(error)
        await functions.deleteImgVideo(req.files.avatarUser, req.files.videoType)
        return functions.setError(res, error)
    }
}

// lấy danh sach thành phố
exports.getDataCity = async(req, res, next) => {
    try {
        let city = await functions.getDatafind(City)
        if (city.length != 0) {
            return functions.success(res, "Láy dữ liệu thành công", city)
        }
        return functions.setError(res, 'Không có dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// lấy danh sách quận huyện theo id thành phố
exports.getDataDistrict = async(req, res, next) => {
    try {
        let idCity = req.body.cit_id;
        let listDistrict = await functions.getDatafind(District);
        if (listDistrict.length != 0 && idCity != undefined) {
            let district = await functions.getDatafind(District, { parent: idCity })
            return functions.success(res, "Láy dữ liệu thành công", district)
        }
        return functions.setError(res, 'error', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// lấy danh sách các bài post của nhà tuyển  dụng
exports.getListPost = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let listPost = await functions.pageFind(NewTV365, { userID: idCompany }, { _id: -1 }, skip, limit);
            const totalCount = await functions.findCount(NewTV365, { userID: idCompany });
            const totalPages = Math.ceil(totalCount / pageSize);
            if (listPost) {
                return functions.success(res, "Lấy danh sách tin đăng thành công", { totalCount, totalPages, listPost: listPost });
            }
            return functions.setError(res, 'không lấy được danh sách', 404)
        } else {
            let listPost = await functions.getDatafind(NewTV365, { userID: idCompany });
            return functions.success(res, "Lấy danh sách tin đăng thành công", { listPost });

        }

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// lấy 1 bài post 
exports.getPost = async(req, res, next) => {
    try {
        let id = req.body.new_id;
        let post = await functions.getDatafindOne(NewTV365, { _id: id })
        if (post) {
            return functions.success(res, "Láy dữ liệu thành công", { post })
        }
        return functions.setError(res, 'sai id', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// check 10p đăng tin 1 lần
exports.checkPostNew10p = async(req, res, next) => {
    try {
        let id = req.user.data._id;
        let post = await NewTV365.findOne({ userID: id }).sort({ id: -1 });
        if (post) {
            let checkPost = await functions.isCurrentTimeGreaterThanInputTime(post.createTime);
            console.log(checkPost)
            if (checkPost) {
                return functions.success(res, "Láy dữ liệu thành công")
            }
            return functions.setError(res, 'chưa đủ 10p', 404)
        }
        return functions.setError(res, 'không có dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// cập nhập tin tuyển dụng
exports.updateNewTv365 = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365,
            request = req.body,
            idNew = req.body.new_id,
            title = request.new_title,
            cateID = request.new_cat_id,
            soLuong = request.new_soluong,
            capBac = request.new_cap_bac,
            hinhThuc = request.new_hinhthuc,
            city = request.new_city,
            district = request.new_qh,
            address = request.new_addr,
            until = request.new_money_unit,
            hoaHong = request.new_hh,
            typeNewMoney = request.new_money_kg,
            tgtv = request.new_tgtv,
            minValue = request.new_money_min,
            maxValue = request.new_money_max,
            moTa = request.new_mota,
            yeuCau = request.new_yeucau,
            exp = request.new_exp,
            bangCap = request.bangCap,
            sex = request.new_gender,
            quyenLoi = request.new_quyenloi,
            hoSo = request.new_hoso,
            hanNop = request.hannop,
            userContactName = request.namelh,
            userContactAddress = request.addresslh,
            userContactPhone = request.phonelh,
            userContactEmail = request.emaillh,
            linkVideo = req.linkVideo,
            avatar = req.files.avatarUser,
            videoType = req.files.videoType,
            lv = request.new_lv,
            money = 1;
        let video = '';
        let link = '';
        // mảng chứa danh sách ảnh của tin
        let listImg = [];
        // mảng chưa danh sách các tiêu đề đã có
        let listArrPost = [];
        // mảng chứa danh sách tiêu đề trừ tiêu đề đang cập nhập
        let listTilte = [];
        if (title && cateID && soLuong && capBac && hinhThuc && city && district && address &&
            until && moTa && yeuCau && exp && bangCap && sex && quyenLoi && hanNop && userContactName &&
            userContactAddress && userContactPhone && userContactEmail && typeNewMoney && idNew) {
            let newTV = await functions.getDatafindOne(NewTV365, { _id: idNew });
            if (newTV) {

                // check title trùng với title đã đăng hay không
                let listPost = await functions.getDatafind(NewTV365, { userID: idCompany });
                let oldTitle = newTV.title;
                if (listPost.length > 0) {
                    for (let i = 0; i < listPost.length; i++) {
                        listArrPost.push(listPost[i].title)
                    }
                    listTilte = await functions.removeSimilarKeywords(oldTitle, listArrPost)
                }
                let checkTile = await functions.checkTilte(title, listTilte);
                // validate title
                let checkValidateTilte = await functions.checkTilte(title, functions.keywordsTilte);
                if ((checkValidateTilte == false || checkTile == false)) {
                    await functions.deleteImgVideo(avatar, videoType)
                    return functions.setError(res, 'tiêu đề đã có từ bài viết trước hoặc chưa từ khóa không cho phép', 404)
                }
                // check type của new money
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
                            if (maxValue > threshold.maxValue) {
                                money = threshold.money
                            }
                        }
                        minValue = null;
                        break;
                    case 5:
                        money = request.money;
                        break;
                    default:
                        break;
                }
                //check video
                if (videoType) {
                    if (videoType.length == 1) {
                        let checkVideo = await functions.checkVideo(videoType[0]);
                        if (checkVideo) {
                            video = videoType[0].filename
                        } else {
                            await functions.deleteImg(videoType[0])
                            return functions.setError(res, 'video không đúng định dạng hoặc lớn hơn 100MB ', 404)
                        }
                    } else
                    if (videoType.length > 1) {
                        await functions.deleteImgVideo(avatar, videoType)
                        return functions.setError(res, 'chỉ được đưa lên 1 video', 404)
                    }
                }

                //check ảnh
                if (avatar && avatar.length >= 1 && avatar.length <= 6) {
                    for (let i = 0; i < avatar.length; i++) {
                        let checkImg = await functions.checkImage(avatar[i].path);
                        let isValid = true;
                        if (checkImg) {
                            listImg.push(avatar[i].filename);
                        } else {
                            isValid = false;
                        }
                        if (isValid == false) {
                            await functions.deleteImgVideo(avatar, videoType)

                            return functions.setError(res, 'đã có ảnh sai định dạng hoặc lớn hơn 2MB', 404)
                        }
                    }
                } else if (avatar && avatar.length > 6) {
                    await functions.deleteImgVideo(avatar, videoType)
                    return functions.setError(res, 'chỉ được đưa lên tối đa 6 ảnh', 404)
                }
                // check link video
                if (linkVideo) {
                    let checkLink = await functions.checkLink(linkVideo);
                    if (checkLink) {
                        link = linkVideo;
                    } else {
                        await functions.deleteImgVideo(avatar, videoType)
                        return functions.setError(res, 'link không đúng định dạng ', 404)
                    }
                }
                // check thời gian hạn nộp
                let checkTime = await functions.checkTime(hanNop)
                if (checkTime == false) {
                    await functions.deleteImgVideo(avatar, videoType)
                    return functions.setError(res, 'thời gian hạn nộp phải lớn hơn thời gian hiện tại', 404)
                }
                await NewTV365.updateOne({ _id: idNew }, {
                    $set: {
                        title: title,
                        alias: '',
                        cateID: [cateID],
                        cityID: [city],
                        districtID: [district],
                        address: address,
                        money: money,
                        capBac: capBac,
                        exp: exp,
                        sex: sex,
                        bangCap: bangCap,
                        soLuong: soLuong,
                        hinhThuc: hinhThuc,
                        hanNop: hanNop,
                        updateTime: new Date().getTime(),
                        newMutil: {
                            moTa: moTa,
                            yeuCau: yeuCau,
                            quyenLoi: quyenLoi,
                            hoSo: hoSo,
                            hoaHong: hoaHong || " ",
                            tgtv: tgtv || " ",
                            videoType: video || " ",
                            images: listImg || null,
                            lv: lv,
                        },
                        newMoney: {
                            type: typeNewMoney,
                            minValue: minValue || null,
                            maxValue: maxValue || null,
                            until: until || 1,
                        }
                    }
                });
                await Users.updateOne({ idTimViec365: idCompany }, {
                    $set: {
                        'inForCompany.userContactName': userContactName,
                        'inForCompany.userContactPhone': userContactPhone,
                        'inForCompany.userContactAddress': userContactAddress,
                        'inForCompany.userContactEmail': userContactEmail,
                    }
                });
                return functions.success(res, "cập nhập bài tuyển dụng thành công")
            }
            await functions.deleteImgVideo(avatar, videoType)
            return functions.setError(res, 'bài viết không tồn tại', 404)
        }
        await functions.deleteImgVideo(avatar, videoType)
        return functions.setError(res, 'thiếu dữ liệu', 404)
    } catch (error) {
        console.log(error)
        await functions.deleteImgVideo(req.files.avatarUser, req.files.videoType)
        return functions.setError(res, error)
    }
}

// hàm xóa tin
exports.deleteNewTv365 = async(req, res, next) => {
    try {
        let idNew = req.params.idNew;
        if (idNew) {
            await functions.getDataDeleteOne(NewTV365, { _id: idNew })
            return functions.success(res, "xóa bài tuyển dụng thành công")
        }
        return functions.setError(res, 'thiếu dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm làm mới tin
exports.refreshNew = async(req, res, next) => {
    try {
        let idNew = req.body.new_id;
        if (idNew) {
            await NewTV365.updateOne({ _id: idNew }, {
                $set: { updateTime: new Date.getTime() }
            });
            return functions.success(res, "làm mới bài tuyển dụng thành công")
        }
        return functions.setError(res, 'thiếu dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// chi tiết tin tuyển 
exports.getNew = async(req, res, next) => {
    try {
        let newID = req.body.new_id;
        let statusApply = false
        let statusSavePost = false
        if (req.user) {
            let userID = req.user.data.idTimViec365;
            let apply = await functions.getDatafindOne(ApplyForJob, { userID: userID, newID: newID });
            let savePost = await functions.getDatafindOne(UserSavePost, { userID: userID, newID: newID });
            if (apply) {
                statusApply = true
            } else {
                statusApply = false
            }
            if (savePost) {
                statusSavePost = true
            } else {
                statusSavePost = false
            }
        }
        if (newID) {
            let post = await functions.getDatafindOne(NewTV365, { _id: newID });
            return functions.success(res, "làm mới bài tuyển dụng thành công", { post, statusApply, statusSavePost })
        }
        return functions.setError(res, 'thiếu dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}


// hàm lấy danh sách tin tuyển dụng lương cao
exports.listNewCao = async(req, res, next) => {
    try {
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        let now = new Date();
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let listPostTG = await functions.pageFind(NewTV365, { newCao: { $ne: 0 }, hanNop: { $gt: now }, newGap: 0, newHot: 0, redirect301: "" }, { updateTime: -1 }, skip, limit);
            const totalCount = await functions.findCount(NewTV365, { newCao: { $ne: 0 }, hanNop: { $gt: now }, newGap: 0, newHot: 0, redirect301: "" });
            const totalPages = Math.ceil(totalCount / pageSize);
            if (listPostTG) {
                return functions.success(res, "Lấy danh sách tin đăng thành công", { totalCount, totalPages, listPost: listPostTG });
            }
            return functions.setError(res, 'không lấy được danh sách', 404)
        } else {
            let listPostTG = await functions.getDatafind(NewTV365, { newCao: { $ne: 0 } });
            return functions.success(res, "Lấy danh sách tin đăng thành công", listPostTG);

        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy danh sách tin tuyển dụng tuyển gấp
exports.listNewGap = async(req, res, next) => {
    try {
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        let now = new Date();
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let listPostVLLC = await functions.pageFind(NewTV365, { hanNop: { $gt: now }, newCao: 0, newHot: 0, redirect301: "" }, [
                ['newCao', -1],
                ['updateTime', -1]
            ], skip, limit);
            const totalCount = await functions.findCount(NewTV365, { newGap: { $ne: 0 }, hanNop: { $gt: now }, newCao: 0, newHot: 0, redirect301: "" });
            const totalPages = Math.ceil(totalCount / pageSize);
            if (listPostVLLC) {
                return functions.success(res, "Lấy danh sách tin đăng thành công", { totalCount, totalPages, listPost: listPostVLLC });
            }
            return functions.setError(res, 'không lấy được danh sách', 404)
        } else {
            let listPostVLLC = await functions.getDatafind(NewTV365, { newGap: { $ne: 0 } });
            return functions.success(res, "Lấy danh sách tin đăng thành công", listPostVLLC);

        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy danh sách tin tuyển dụng hấp dẫn
exports.listNewHot = async(req, res, next) => {
    try {
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        let now = new Date();
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let listPostVLHD = await functions.pageFind(NewTV365, { newHot: { $ne: 0 }, hanNop: { $gt: now }, newCao: 0, newGGap: 0, redirect301: "" }, { updateTime: -1 }, skip, limit);
            const totalCount = await functions.findCount(NewTV365, { newHot: { $ne: 0 }, hanNop: { $gt: now }, newCao: 0, newGGap: 0, redirect301: "" });
            const totalPages = Math.ceil(totalCount / pageSize);
            if (listPostVLHD) {
                return functions.success(res, "Lấy danh sách tin đăng thành công", { totalCount, totalPages, listPost: listPostVLHD });
            }
            return functions.setError(res, 'không lấy được danh sách', 404)
        } else {
            let listPostVLHD = await functions.getDatafind(NewTV365, { newHot: { $ne: 0 } });
            return functions.success(res, "Lấy danh sách tin đăng thành công", listPostVLHD);

        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm viêc làm mới nhất
exports.listJobNew = async(req, res, next) => {
    try {
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        let job = req.body.cate_id;
        let city = req.body.city
        let now = new Date();
        let listJobNew = [];
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            const totalCount = await functions.findCount(NewTV365, { hanNop: { $gt: now } });
            const totalPages = Math.ceil(totalCount / pageSize);
            if (job == undefined) {
                listJobNew = await functions.pageFind(NewTV365, { hanNop: { $gt: now }, cityID: { $in: [city] } }, { newGhim: -1, updateTime: -1 }, skip, limit);
            }
            if (city == undefined) {
                listJobNew = await functions.pageFind(NewTV365, { hanNop: { $gt: now }, cateID: { $in: [job] } }, { newGhim: -1, updateTime: -1 }, skip, limit);
            }
            if (city == undefined && job == undefined) {
                listJobNew = await functions.pageFind(NewTV365, { hanNop: { $gt: now } }, { newGhim: -1, updateTime: -1 }, skip, limit);
            }
            if (job && city) {
                listJobNew = await functions.pageFind(NewTV365, { hanNop: { $gt: now }, cityID: { $in: [city] }, cateID: { $in: [job] } }, { newGhim: -1, updateTime: -1 }, skip, limit);
            }
            if (listJobNew) {
                return functions.success(res, "Lấy danh sách tin đăng thành công", { totalCount, totalPages, listPost: listJobNew });
            }
            return functions.setError(res, 'không lấy được danh sách', 404)
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm viêc làm phù hợp nhất
exports.listJobSuitable = async(req, res, next) => {
    try {
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        let job = req.body.cate_id;
        let city = req.body.city
        let now = new Date();
        let listJobNew = [];
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            const totalCount = await functions.findCount(NewTV365, { hanNop: { $gt: now } });
            const totalPages = Math.ceil(totalCount / pageSize);
            if (job == undefined) {
                listJobNew = await functions.pageFind(NewTV365, {
                    hanNop: { $gt: now },
                    cityID: { $in: [city] },
                }, {
                    newHot: -1,
                    newCao: -1,
                    newGap: -1,
                    newNganh: -1,
                    updateTime: -1
                }, skip, limit);
            }
            if (city == undefined) {
                listJobNew = await functions.pageFind(NewTV365, {
                    hanNop: { $gt: now },
                    cateID: { $in: [job] },
                }, {
                    newHot: -1,
                    newCao: -1,
                    newGap: -1,
                    newNganh: -1,
                    updateTime: -1
                }, skip, limit);
            }
            if (city == undefined && job == undefined) {
                listJobNew = await functions.pageFind(NewTV365, {
                    hanNop: { $gt: now },
                }, {
                    newHot: -1,
                    newCao: -1,
                    newGap: -1,
                    newNganh: -1,
                    updateTime: -1
                }, skip, limit);
            }
            if (job && city) {
                listJobNew = await functions.pageFind(NewTV365, {
                    hanNop: { $gt: now },
                    cityID: { $in: [city] },
                    cateID: { $in: [job] },
                }, {
                    newHot: -1,
                    newCao: -1,
                    newGap: -1,
                    newNganh: -1,
                    updateTime: -1
                }, skip, limit);
            }
            if (listJobNew) {
                return functions.success(res, "Lấy danh sách tin đăng thành công", { totalCount, totalPages, listPost: listJobNew });
            }
            return functions.setError(res, 'không lấy được danh sách', 404)
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm viêc làm lương cao nhất
exports.listJobHightSalary = async(req, res, next) => {
    try {
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        let job = req.body.cate_id;
        let city = req.body.city;
        let now = new Date();
        let listJobNew = [];
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            const totalCount = await functions.findCount(NewTV365, { hanNop: { $gt: now } });
            const totalPages = Math.ceil(totalCount / pageSize);
            if (job == undefined) {
                listJobNew = await functions.pageFind(NewTV365, {
                    hanNop: { $gt: now },
                    cityID: { $in: [city] },
                }, {
                    money: -1,
                    newGhim: -1,
                    updateTime: -1,
                }, skip, limit);
            }
            if (city == undefined) {
                listJobNew = await functions.pageFind(NewTV365, {
                    hanNop: { $gt: now },
                    cateID: { $in: [job] },
                }, {
                    money: -1,
                    newGhim: -1,
                    updateTime: -1,
                }, skip, limit);
            }
            if (city == undefined && job == undefined) {
                listJobNew = await functions.pageFind(NewTV365, {
                    hanNop: { $gt: now },
                }, {
                    money: -1,
                    newGhim: -1,
                    updateTime: -1,
                }, skip, limit);
            }
            if (job && city) {
                listJobNew = await functions.pageFind(NewTV365, {
                    hanNop: { $gt: now },
                    cityID: { $in: [city] },
                    cateID: { $in: [job] },
                }, {
                    money: -1,
                    newGhim: -1,
                    updateTime: -1,
                }, skip, limit);
            }
            if (listJobNew) {
                return functions.success(res, "Lấy danh sách tin đăng thành công", { totalCount, totalPages, listPost: listJobNew });
            }
            return functions.setError(res, 'không lấy được danh sách', 404)
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm danh sách job  địa điểm theo tag
exports.getJobListByLocation = async(req, res, next) => {
    try {
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        let city = req.body.city;
        let district = req.body.district;
        let now = new Date();
        if (city && district) {
            if (page && pageSize) {
                const skip = (page - 1) * pageSize;
                const limit = pageSize;
                let listPost = await functions.pageFind(NewTV365, {
                    hanNop: { $gt: now },
                    cityID: { $in: [city] },
                    districtID: { $in: [district] },
                }, { newGhim: -1, updateTime: -1 }, skip, limit);
                const totalCount = await functions.findCount(NewTV365, {
                    hanNop: { $gt: now },
                    cityID: { $in: [city] },
                    districtID: { $in: [district] },
                });
                const totalPages = Math.ceil(totalCount / pageSize);
                if (listPost) {
                    return functions.success(res, "Lấy danh sách tin đăng thành công", { totalCount, totalPages, listPost: listPost });
                }
                return functions.setError(res, 'không lấy được danh sách', 404)
            } else {
                let listPost = await functions.getDatafind(NewTV365, {
                    hanNop: { $gt: now },
                    cityID: { $in: [city] },
                    districtID: { $in: [district] },
                });
                return functions.success(res, "Lấy danh sách tin đăng thành công", listPost);
            }
        }
        return functions.setError(res, 'thiếu đữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm danh sách job chức danh  theo tag
exports.getJobListByJob = async(req, res, next) => {
    try {
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        let city = req.body.city;
        let district = req.body.district;
        let cate = req.body.cate_id;
        let now = new Date();
        if (city && district & cate) {
            if (page && pageSize) {
                const skip = (page - 1) * pageSize;
                const limit = pageSize;
                let listPost = await functions.pageFind(NewTV365, {
                    hanNop: { $gt: now },
                    cityID: { $in: [city] },
                    districtID: { $in: [district] },
                    cateID: { $in: [cate] },
                }, { newGhim: -1, updateTime: -1 }, skip, limit);
                const totalCount = await functions.findCount(NewTV365, {
                    hanNop: { $gt: now },
                    cityID: { $in: [city] },
                    districtID: { $in: [district] },
                    cateID: { $in: [cate] },
                });
                const totalPages = Math.ceil(totalCount / pageSize);
                if (listPost) {
                    return functions.success(res, "Lấy danh sách tin đăng thành công", { totalCount, totalPages, listPost: listPost });
                }
                return functions.setError(res, 'không lấy được danh sách', 404)
            } else {
                let listPost = await functions.getDatafind(NewTV365, {
                    hanNop: { $gt: now },
                    cityID: { $in: [city] },
                    districtID: { $in: [district] },
                    cateID: { $in: [cate] }
                });
                return functions.success(res, "Lấy danh sách tin đăng thành công", listPost);
            }
        }
        return functions.setError(res, 'thiếu đữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm danh sách job tên công ty theo tag
exports.getJobListByCompany = async(req, res, next) => {
    try {
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        let city = req.body.city;
        let district = req.body.district;
        let now = new Date();
        if (city && district) {
            if (page && pageSize) {
                const skip = (page - 1) * pageSize;
                const limit = pageSize;
                let listPost = await NewTV365.aggregate([
                    { $match: { hanNop: { $gt: now }, cityID: { $in: [city] }, districtID: { $in: [district] } } },
                    { $lookup: { from: 'Users', localField: 'userID', foreignField: 'idTimViec365', as: 'referencedData' } },
                    { $project: { _id: 1, referencedData: { userName: 1 } } },
                    { $sort: { newGhim: -1, updateTime: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                ]);
                const totalCount = await functions.findCount(NewTV365, {
                    hanNop: { $gt: now },
                    cityID: { $in: [city] },
                    districtID: { $in: [district] },
                });
                const totalPages = Math.ceil(totalCount / pageSize);
                if (listPost) {
                    return functions.success(res, "Lấy danh sách tin đăng thành công", { totalCount, totalPages, listPost: listPost });
                }
                return functions.setError(res, 'không lấy được danh sách', 404)
            } else {
                let listPostVLHD = await functions.getDatafind(NewTV365, { newHot: { $ne: 0 } });
                return functions.success(res, "Lấy danh sách tin đăng thành công", listPostVLHD);
            }
        }
        return functions.setError(res, 'thiếu đữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm danh sách job tiêu chí theo tag
exports.getJobsByCriteria = async(req, res, next) => {
    try {
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);
        let cate = req.body.cate_id;
        let now = new Date();
        if (cate) {
            if (page && pageSize) {
                const skip = (page - 1) * pageSize;
                const limit = pageSize;
                let listPost = await functions.pageFind(NewTV365, {
                    hanNop: { $gt: now },
                    cateID: { $in: [cate] },
                }, { newGhim: -1, updateTime: -1 }, skip, limit);
                const totalCount = await functions.findCount(NewTV365, {
                    hanNop: { $gt: now },
                    cateID: { $in: [cate] },
                });
                const totalPages = Math.ceil(totalCount / pageSize);
                if (listPost) {
                    return functions.success(res, "Lấy danh sách tin đăng thành công", { totalCount, totalPages, listPost: listPost });
                }
                return functions.setError(res, 'không lấy được danh sách', 404)
            } else {
                let listPost = await functions.getDatafind(NewTV365, {
                    hanNop: { $gt: now },
                    cateID: { $in: [cate] },
                });
                return functions.success(res, "Lấy danh sách tin đăng thành công", listPost);
            }
        }
        return functions.setError(res, 'thiếu đữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}