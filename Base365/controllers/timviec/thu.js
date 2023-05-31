const functions = require('../../services/functions');
const Thu = require('../../models/Timviec365/CV/Letter');
const NganhThu = require('../../models/Timviec365/CV/LetterCategory');
const ThuUV = require('../../models/Timviec365/CV/LetterUV');

// lấy danh sách mẫu thư
exports.getThu = async(req, res, next) => {
    try {
        const pageNumber = req.query.pageNumber || 1;
        const data = await Thu.find({}).skip((pageNumber - 1) * 20).limit(20);

        if (data) return await functions.success(res, 'Lấy mẫu THU thành công', data);

        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        functions.setError(res, err.message);
    };
};

// tìm thư theo ngành
exports.getByNganh = async(req, res, next) => {
    try {
        const pageNumber = req.query.pageNumber || 1;
        const cateId = req.body.cateId;
        const data = await Thu.find({ cateId: cateId }).skip((pageNumber - 1) * 20).limit(20); // tìm theo id Ngành

        if (data) return await functions.success(res, `THU theo ngành ${cateId}`, data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message, );
    };
};

// lấy danh sách ngành thư
exports.getNganhThu = async(req, res, next) => {
    try {
        const data = await NganhThu.find().select('_id name');

        if (data.length > 0) return functions.success(res, 'Danh sách ngành THU', data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// xem trước 
exports.previewThu = async(req, res, next) => {
    try {
        const _id = req.params._id;
        const data = await Thu.findOne({ _id: _id }).select('_id image view');

        if (!data) return await functions.setError(res, 'Không có dữ liệu', 404);

        let view = data.view + 1; // cập nhật số lượng xem 
        await Thu.updateOne({ _id: _id }, { view: view });
        return await functions.success(res, 'Lấy mâũ THU thanh công', data);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// xem chi tiết thư ( tạo)
exports.detailThu = async(req, res, next) => {
    try {
        const _id = req.params._id;
        const user = req.user.data;
        const data = await Thu.findOne({ _id: _id }).select('_id name htmlVi htmlCn htmlJp htmlKr htmlEn view color langId');

        if (data) {
            let view = data.view + 1; // cập nhật số lượng xem 
            await Thu.updateOne({ _id: _id }, { view: view });

            const token = await functions.createToken(user, '24h');
            res.setHeader('authorization', `Bearer ${token}`);

            return await functions.success(res, 'Lấy THU thành công', data);
        };
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

//lưu và tải thư
exports.saveThu = async(req, res, next) => {
    try {
        // 0 : ko, 1 có 
        const upload = req.query.upload || 1;
        const download = req.query.download || 0;
        const imageFile = req.file;
        const userId = req.user.data._id;
        const data = req.body;
        if (upload == 0 && download == 1) {
            if (fs.existsSync(`../Storage/TimViec365/${userId}/letter/${data.nameImage.slice(0,-4)}.pdf`) &&
                fs.existsSync(`../Storage/TimViec365/${userId}/letter/${data.nameImage}`)) {
                //pdf img tồn tại
                const host = '';
                const linkPdf = `${host}/TimViec365/${userId}/letter/${data.nameImage}`;
                const linkImg = `${host}/TimViec365/${userId}/letter/${data.nameImage.slice(0,-4)}.pdf`;
                const senderId = 1191;
                const text = '';
                const data = {
                    userId: userId,
                    senderId: senderId,
                    linkImg: linkImg,
                    linkPdf: linkPdf,
                    Title: text,
                };
                await axios.post('http://43.239.223.142:9000/api/message/SendMessageCv', data);
                return await functions.success(res, `Tải thành công`, );

            }
            return functions.setError(res, 'Chưa upload ảnh', 404);
        };


        let message = 'Lưu';
        const checkImage = await functions.checkImage(imageFile.path);

        if (checkImage == false) return functions.setError(res, 'Lỗi ảnh', 404);

        const uploadImage = await functions.uploadAndCheckPathIMG(userId, imageFile, 'letter');
        if (uploadImage.status != 'EXIT') return await functions.setError(res, 'Upload ảnh thất bại', 404);

        const thuUV = {
            userId: userId,
            tId: data._id,
            html: data.html,
            nameImage: nameImage.filename,
            lang: data.lang,
        };

        if (checkImage == true) {
            const thu = await HoSo.findOne({ _id: data._id }).select('download');
            if (!thu) return await functions.setError(res, 'Lưu thất bại 1', 404);
            let _id = 1;
            await functions.getMaxID(ThuUV)
                .then(res => {
                    if (res) {
                        _id = res + 1;
                    }
                });

            thuUV._id = _id;
            const newThuUV = await ThuUV.create(thuUV);

            if (newThuUV) {
                // cập nhật số lượt download 
                await Thu.updateOne({ _id: cv._id }, { $set: { download: cv.download + 1 } });
                return await functions.success(res, 'Lưu thành công', newThuUV);
            };
            return await functions.setError(res, 'Lưu thất bại 2', 404);
        };
        return functions.setError(res, 'Lỗi ảnh', 404);

    } catch (e) {
        functions.setError(res, e.message, );
    }
};

// thêm mới NganhThu
exports.createNganhThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(NganhThu)
            .then(res => {
                if (res) {
                    _id = res + 1;
                }
            });
        data._id = _id;
        await NganhThu.create(data);
        return await functions.success(res, 'Tạo mới NganhcDon thành công', );
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// lấy dữ liệu NganhThu cũ
exports.findNganhThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await NganhThu.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// update NganhThu
exports.updateNganhThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await NganhThu.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

//xóa NganhThu
exports.deleteNganhThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await NganhThu.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// tạo mới mẫu Thu
exports.createThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập', 404);
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(Thu)
            .then(res => {
                if (res) {
                    _id = res + 1;
                }
            });
        data._id = _id;
        await Thu.create(data);
        return await functions.success(res, 'Tạo mới Thu thành công', );
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// lấy dữ liệu mẫu Thu cũ
exports.findThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await Thu.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// update dữ liệu mẫu Thu
exports.updateThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await Thu.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

//xóa mẫu Thu
exports.deleteThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await Thu.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};