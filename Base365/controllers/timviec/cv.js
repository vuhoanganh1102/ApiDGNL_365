const functions = require('../../services/functions');
const CV = require('../../models/Timviec365/CV/CV');
const CVUV = require('../../models/Timviec365/CV/CVUV');
const NganhCV = require('../../models/Timviec365/CV/Category');
const CVGroup = require('../../models/Timviec365/CV/CVGroup');


exports.getListCV = async(req, res, next) => {
    try {
        const pageNumber = req.query.pageNumber || 1;
        const data = await functions.getDataCVSortById({}, pageNumber);
        if (data) {
            return await functions.success(res, 'Lấy mẫu CV thành công', data);
        };
        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        functions.setError(res, err.message);
    };
};

// lấy danh sách ngành cv
exports.getNganhCV = async(req, res, next) => {
    try {
        const data = await NganhCV.find().select('_id name');

        if (data.length > 0) return functions.success(res, 'Danh sách ngành cv', data);

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// lấy theo điều kiện --- func getDataCV nhận 2 tham số là điều kiện và cách sắp xếp( cập nhật mới hoặc download)
exports.getListCVByCondition = async(req, res, next) => {
    try {
        const pageNumber = req.query.pageNumber || 1;
        const cateId = req.query.cateId;
        const langId = req.query.langId;
        const designId = req.query.designId;
        const sort = req.query.sort || 0; // 0 ||1 (_id|| download)
        let data = [];
        if (sort == 1) {
            if (cateId || langId || designId) {
                if (cateId) {
                    data = await functions.getDataCVSortByDownload({ cateId }, pageNumber);
                    return await functions.success(res, 'Lấy dữ liệu thành công', { data });
                };
                if (langId) {
                    data = await functions.getDataCVSortByDownload({ langId }, pageNumber);
                    return await functions.success(res, 'Lấy dữ liệu thành công', { data });
                };
                if (designId) {
                    data = await functions.getDataCVSortByDownload({ designId }, pageNumber);
                    return await functions.success(res, 'Lấy dữ liệu thành công', { data });
                };
            };

            data = await functions.getDataCVSortByDownload({}, pageNumber);
            return await functions.success(res, 'Lấy dữ liệu thành công', { data });
        } else {
            if (cateId) {
                data = await functions.getDataCVSortById({ cateId }, pageNumber);
                return await functions.success(res, 'Lấy dữ liệu thành công', { data });
            };
            if (langId) {
                data = await functions.getDataCVSortById({ langId }, pageNumber);
                return await functions.success(res, 'Lấy dữ liệu thành công', { data });
            };
            if (designId) {
                data = await functions.getDataCVSortById({ designId }, pageNumber);
                return await functions.success(res, 'Lấy dữ liệu thành công', { data });
            };
            data = await functions.getDataCVSortById({}, pageNumber);
            return await functions.success(res, 'Lấy dữ liệu thành công', { data });
        };
    } catch (e) {
        functions.setError(res, e.message, );
    }
};

//xem trước CV
exports.previewCV = async(req, res, next) => {
    try {
        const _id = req.params._id;
        const data = await CV.findOne({ _id: _id }).select('_id lang_id name image mota_cv colors view ');

        if (data) {
            let view = data.view + 1; // cập nhật số lượng xem 
            await CV.updateOne({ _id: _id }, { view: view });

            return await functions.success(res, 'Lấy mẫu cv thành công', data);
        }
        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (e) {
        functions.setError(res, e.message, );
    };

};

// chi tiết cv ( tạo cv)
exports.detailCV = async(req, res, text) => {
    try {
        const _id = req.query._id;
        const lang_id = req.query.lang_id;

        // lang_id: 0,1,2,3,4,5 tương ứng tất cả, việt, anh, nhật, trung, hàn 
        const html = ['html_vi html_en html_jp html_cn html_kr', 'html_vi', 'html_en', 'html_jp', 'html_cn', 'html_kr'];
        const html_lang = html[lang_id];
        const data = await CV.findOne({ _id: _id }).select(`_id name ${html_lang} view cate_id color lang`);

        if (!data) {
            await functions.setError(res, 'Không có dữ liệu', 404);
        }
        let view = data.view + 1; // cập nhật số lượng xem 
        await CV.updateOne({ _id: _id }, { view: view });
        return await functions.success(res, 'Lấy CV thành công', data);
    } catch (e) {
        functions.setError(res, e.message, );
    };
};

//lưu và tải cv
exports.saveCV = async(req, res, next) => {
    try {
        // 0 : ko, 1 có 
        const upload = req.query.upload || 1;
        const download = req.query.download || 0;
        const imageFile = req.file;
        const userId = req.user.data._id;
        const data = req.body;
        if (upload == 0 && download == 1) {
            if (fs.existsSync(`../Storage/TimViec365/${userId}/cv/${data.nameImage.slice(0,-4)}.pdf`) &&
                fs.existsSync(`../Storage/TimViec365/${userId}/cv/${data.nameImage}`)) {
                //pdf tồn tại
                const host = '';
                const linkPdf = `${host}/TimViec365/${userId}/cv/${data.nameImage}`;
                const linkImg = `${host}/TimViec365/${userId}/cv/${data.nameImage.slice(0,-4)}.pdf`;
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

        const uploadImage = await functions.uploadAndCheckPathIMG(userId, imageFile, 'cv');
        if (uploadImage.status != 'EXIT') return await functions.setError(res, 'Upload ảnh thất bại', 404);
        const cvUV = {
            userId: userId,
            cvId: data._id,
            html: data.html,
            nameImage: nameImage.filename,
            lang: data.lang,
        };
        if (checkAvatar == true) {
            const cv = await CV.findOne({ _id: data._id }).select('download');
            if (!cv) return await functions.setError(res, 'Lưu thất bại 1', 404);
            let _id = 1;
            await functions.getMaxID(CVUV)
                .then(res => {
                    if (res) {
                        _id = res + 1;
                    }
                });

            cvUV._id = _id;
            const newCVUV = await CVUV.create(cvUV);
            if (newCVUV) {
                // cập nhật số luot download 
                await CV.updateOne({ _id: cv._id }, { $set: { download: cv.download + 1 } });

                //Gửi ảnh về
                if (download == 1) {
                    const host = '';
                    const linkPdf = `${host}/${uploadImage.imgPath.slice(11)}`;
                    const linkImg = `${host}/${uploadImage.pdfPath.slice(11)}`;
                    const senderId = 1191;
                    const text = '';
                    const data = {
                        userId: userId,
                        senderId: senderId,
                        linkImg: linkImg,
                        linkPdf: linkPdf,
                        Title: text,
                    };
                    const respone = await axios.post('http://43.239.223.142:9000/api/message/SendMessageCv', data);

                    message += ',tải';

                };
                return await functions.success(res, `${message} thành công`, { newCVUV });
            };
            return functions.setError(res, 'Lỗi ảnh', 404);

        }
    } catch (e) {
        functions.setError(res, e.message, );
    }
}

// xem CV viết sẵn
exports.viewAvailable = async(req, res, next) => {
    try {
        const cateId = req.params.cateId;
        const data = await CV.findOne({ cateId }).sort('-cvPoint').select('');
        if (!data) return await functions.setError(res, 'Không có dữ liệu', 404);
        return await functions.success(res, 'Thành công cv viết sẵn', data);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// tính điểm cv
exports.countPoints = async(req, res, next) => {
    try {
        const _id = req.query.id; // id cv
        const point = +req.query.p; // số point đc cộng
        const cv = await CV.findOne({ _id });
        if (cv) {

            const data = await CV.updateOne({ _id }, { $set: { cvPoint: cv.cvPoint + point } }).select('');
            if (data) return await functions.success(res, 'Cập nhật điểm cv thành công');
        }
        return await functions.setError(res, 'Không có dũ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// tạo mới mẫu cv
exports.createCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập', 404);
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(CV)
            .then(res => {
                if (res) {
                    _id = res + 1;
                }
            });
        data._id = _id;
        await CV.create(data);
        return await functions.success(res, 'Tạo mới cv thành công', );
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// lấy dữ liệu mẫu cv cũ
exports.findCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await CV.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// update dữ liệu mẫu cv
exports.updateCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await CV.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

//xóa mẫu cv
exports.deleteCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await CV.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// thêm ngành cv vào danh sách NganhCV
exports.createNganhCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(NganhCV)
            .then(res => {
                if (res) {
                    _id = res + 1;
                }
            });
        data._id = _id;
        await NganhCV.create(data);
        return await functions.success(res, 'Tạo mới NganhcCV thành công', );
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// lấy dữ liệu NganhCV cũ
exports.findNganhCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await NganhCV.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// update NganhCV
exports.updateNganhCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await NganhCV.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

//xóa NganhCV
exports.deleteNganhCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await NganhCV.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};