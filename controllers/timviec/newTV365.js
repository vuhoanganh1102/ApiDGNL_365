const functions = require('../../services/functions')
const City = require('../../models/Timviec365/Timviec/City')
const District = require('../../models/Timviec365/Timviec/District');
const NewTV365 = require('../../models/Timviec365/Timviec/NewTV365');
const Users = require('../../models/Timviec365/Timviec/Users')

// đăng tin
exports.postNewTv365 = async(req, res, next) => {
        try {
            let idCompany = req.user.data.idTimViec365,
                request = req.body,
                title = request.title,
                cateID = request.cateID,
                soLuong = request.soLuong,
                capBac = request.capBac,
                hinhThuc = request.hinhThuc,
                city = request.city,
                district = request.district,
                address = request.address,
                until = request.until,
                hoaHong = request.hoaHong,
                typeNewMoney = request.typeNewMoney,
                tgtv = request.tgtv,
                minValue = request.minValue,
                maxValue = request.maxValue,
                moTa = request.moTa,
                yeuCau = request.yeuCau,
                exp = request.exp,
                bangCap = request.bangCap,
                sex = request.sex,
                quyenLoi = request.quyenLoi,
                hoSo = request.hoSo,
                hanNop = request.hanNop,
                userContactName = request.userContactName,
                userContactAddress = request.userContactAddress,
                userContactPhone = request.userContactPhone,
                userContactEmail = request.userContactEmail,
                linkVideo = req.linkVideo,
                avatar = req.files.avatarUser,
                videoType = req.files.videoType,
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
                    return functions.setError(res, 'tiêu đề đã có từ bài viết trước hoặc chưa từ khóa không cho phép', 404)
                }
                // check type của new money
                switch (Number(typeNewMoney)) {
                    case 1:
                        maxValue = null;
                        minValue = null;
                        break;
                    case 2:
                        maxValue = null;
                        break;
                    case 3:
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
                        for (let i = 0; i < avatar.length; i++) {
                            await functions.deleteImg(avatar[i])
                        }
                        if (videoType) {
                            await functions.deleteImg(videoType[0])
                        }
                        return functions.setError(res, 'đã có ảnh sai định dạng hoặc lớn hơn 2MB', 404)
                    }
                } else if (avatar && avatar.length > 6) {
                    return functions.setError(res, 'chỉ được đưa lên tối đa 6 ảnh', 404)
                }

                // check link video
                if (linkVideo) {
                    let checkLink = await functions.checkLink(linkVideo);
                    if (checkLink) {
                        link = linkVideo;
                    } else {
                        if (avatar) {
                            avatar.forEach(async(element) => {
                                await functions.deleteImg(element)
                            })
                        }
                        if (videoType) {
                            await functions.deleteImg(videoType[0])
                        }
                        return functions.setError(res, 'link không đúng định dạng ', 404)
                    }
                }
                // check thời gian hạn nộp
                let checkTime = await functions.checkTime(hanNop)
                if (checkTime == false) {
                    if (avatar) {
                        avatar.forEach(async(element) => {
                            await functions.deleteImg(element)
                        })
                    }
                    if (videoType) {
                        await functions.deleteImg(videoType[0])
                    }
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
                    cateID: cateID,
                    cityID: city,
                    districtID: district,
                    address: address,
                    money: money,
                    capBac: capBac,
                    exp: exp,
                    sex: sex,
                    bangCap: bangCap,
                    soLuong: soLuong,
                    hinhThuc: hinhThuc,
                    createTime: new Date().getTime(),
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
                        images: listImg || " ",
                        link: link,
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
                        inForCompanyTV365: {
                            userContactName: userContactName,
                            userContactEmail: userContactEmail,
                            userContactAddress: userContactAddress,
                            userContactPhone: userContactPhone,
                        }
                    }
                });
                return functions.success(res, "tạo bài tuyển dụng thành công")
            }
            return functions.setError(res, 'thiếu dữ liệu', 404)
        } catch (error) {
            console.log(error)
            if (req.files.avatarUser) {
                req.files.avatarUser.forEach(async(element) => {
                    await functions.deleteImg(element)
                })
            }
            if (req.files.videoType) {
                await functions.deleteImg(req.files.videoType[0])
            }
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
            let idCity = req.params.idCity;
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
                return functions.success(res, "Lấy danh sách tin đăng thành công", listPost);

            }

        } catch (error) {
            console.log(error)
            return functions.setError(res, error)
        }
    }
    // lấy 1 bài post 
exports.getPost = async(req, res, next) => {
        try {
            let id = req.params.idNew;
            let post = await functions.getDatafindOne(NewTV365, { _id: id })
            if (post) {
                return functions.success(res, "Láy dữ liệu thành công", [post])
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
                idNew = req.params.idNew,
                title = request.title,
                cateID = request.cateID,
                soLuong = request.soLuong,
                capBac = request.capBac,
                hinhThuc = request.hinhThuc,
                city = request.city,
                district = request.district,
                address = request.address,
                until = request.until,
                hoaHong = request.hoaHong,
                typeNewMoney = request.typeNewMoney,
                tgtv = request.tgtv,
                minValue = request.minValue,
                maxValue = request.maxValue,
                moTa = request.moTa,
                yeuCau = request.yeuCau,
                exp = request.exp,
                bangCap = request.bangCap,
                sex = request.sex,
                quyenLoi = request.quyenLoi,
                hoSo = request.hoSo,
                hanNop = request.hanNop,
                userContactName = request.userContactName,
                userContactAddress = request.userContactAddress,
                userContactPhone = request.userContactPhone,
                userContactEmail = request.userContactEmail,
                linkVideo = req.linkVideo,
                avatar = req.files.avatarUser,
                videoType = req.files.videoType,
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
                // check title trùng với title đã đăng hay không
                let listPost = await functions.getDatafind(NewTV365, { userID: idCompany });
                let newTV = await functions.getDatafindOne(NewTV365, { _id: idNew });
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
                    if (avatar) {
                        avatar.forEach(async(element) => {
                            await functions.deleteImg(element)
                        })
                    }
                    if (videoType) {
                        await functions.deleteImg(videoType[0])
                    }
                    return functions.setError(res, 'tiêu đề đã có từ bài viết trước hoặc chưa từ khóa không cho phép', 404)
                }
                // check type của new money
                switch (Number(typeNewMoney)) {
                    case 1:
                        maxValue = null;
                        minValue = null;
                        break;
                    case 2:
                        maxValue = null;
                        break;
                    case 3:
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
                        return functions.setError(res, 'chỉ được đưa lên 1 video', 404)
                    }
                }

                //check ảnh
                if (avatar && avatar.length >= 1 && avatar.length <= 6) {
                    for (let i = 0; i < avatar.length; i++) {
                        let checkImg = await functions.checkImage(avatar[i].path);
                        if (checkImg) {
                            listImg.push(avatar[i].filename);
                        } else {
                            await functions.deleteImg(avatar[i]);
                            return functions.setError(res, `sai định dạng ảnh hoặc ảnh lớn hơn 2MB :${avatar[i].originalname}`, 404);
                        }
                    }
                } else if (avatar && avatar.length > 6) {
                    return functions.setError(res, 'chỉ được đưa lên tối đa 6 ảnh', 404)
                }
                // check link video
                if (linkVideo) {
                    let checkLink = await functions.checkLink(linkVideo);
                    if (checkLink) {
                        link = linkVideo;
                    } else {
                        if (avatar) {
                            avatar.forEach(async(element) => {
                                await functions.deleteImg(element)
                            })
                        }
                        if (videoType) {
                            await functions.deleteImg(videoType[0])
                        }
                        return functions.setError(res, 'link không đúng định dạng ', 404)
                    }
                }
                // check thời gian hạn nộp
                let checkTime = await functions.checkTime(hanNop)
                if (checkTime == false) {
                    if (avatar) {
                        avatar.forEach(async(element) => {
                            await functions.deleteImg(element)
                        })
                    }
                    if (videoType) {
                        await functions.deleteImg(videoType[0])
                    }
                    return functions.setError(res, 'thời gian hạn nộp phải lớn hơn thời gian hiện tại', 404)
                }
                await NewTV365.updateOne({ _id: idNew }, {
                    $set: {
                        title: title,
                        alias: '',
                        cateID: cateID,
                        cityID: city,
                        districtID: district,
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
                        inForCompanyTV365: {
                            userContactName: userContactName,
                            userContactEmail: userContactEmail,
                            userContactAddress: userContactAddress,
                            userContactPhone: userContactPhone,
                        }
                    }
                });
                return functions.success(res, "cập nhập bài tuyển dụng thành công")
            }
            return functions.setError(res, 'thiếu dữ liệu', 404)
        } catch (error) {
            console.log(error)
            if (req.files.avatarUser) {
                req.files.avatarUser.forEach(async(element) => {
                    await functions.deleteImg(element)
                })
            }
            if (req.files.videoType) {
                await functions.deleteImg(req.files.videoType[0])
            }
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