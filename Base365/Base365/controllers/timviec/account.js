const functions = require('../../services/functions');
const Users = require('../../models/Users');
const md5 = require('md5');
const fs = require('fs');

exports.getAccPermission = async(req, res) => {
    try {
        let { account, password, password_type } = req.body;
        if (account && password) {
            // Giải thích: Nếu không truyền type_pass thì sẽ mặc định sẽ dùng pass mã hóa, còn không sẽ dùng pass bình thường phục vụ app QR
            password = (password_type == 0) ? md5(password) : password;

            let condition = {};
            if (account.trim().includes('@')) {
                condition = { email: account, password: password };
            } else {
                condition = { phoneTK: account, password: password };
            }

            const listUser = await Users.aggregate([
                { $match: condition },
                {
                    $project: {
                        user_id: "$idTimViec365",
                        user_name: "$userName",
                        user_type: "$type",
                        email: "$email",
                        phone_tk: "$phoneTK",
                        pass: "$password",
                    }
                }
            ]);
            return functions.success(res, "", { listUser });
        } else {
            return functions.setError(res, "Thiếu tham số truyền lên");
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.deleteVideo = async(req, res) => {
    try {
        const user = req.user.data;
        const { type } = req.body; // 1: Xóa video trong kho, 2: Xóa video của tin tuyển dụng, 3: Xóa video ứng viên
        if (type && [1, 2, 3].indexOf(type)) {

            // Xử lý xóa video trong kho
            if (user.type == 1 && type == 1) {
                const company = await Users.findOne({ _id: user._id }, {
                    createdAt: 1,
                    "inForCompany.timviec365.usc_video": 1,
                    "inForCompany.timviec365.usc_video_type": 1,
                }).lean();
                if (company) {

                }
                return functions.setError(res, "Công ty không tồn tại");
            }
            // Xử lý xóa video trong tin
            else if (user.type == 1 && type == 2) {

            }
            // Xử lý xóa video của ứng viên
            else if (user.type == 0 && type == 3) {
                const array = await Users.aggregate([
                    { $match: { _id: user._id } },
                    {
                        $project: {
                            cv_video: "$inForPerson.candidate.cv_video",
                            cv_video_type: "$inForPerson.candidate.cv_video_type",
                            use_create_time: "$createdAt"
                        }
                    }
                ]);
                const candidate = array[0];
                if (candidate.cv_video != '' && candidate.cv_video_type == 1) {
                    const dir = `../storage/base365/timviec365/pictures/cv/${functions.convertDate(candidate.use_create_time, true)}`;
                    const filePath = `${dir}/${candidate.cv_video}`;
                    await fs.access(filePath, fs.constants.F_OK, (error) => {
                        if (error) {} else {
                            // Tệp tin tồn tại
                            fs.unlink(filePath, (err) => {
                                if (err) throw err;
                            });
                        }
                    });
                    await Users.updateOne({ _id: user._id }, {
                        $set: { "inForPerson.candidate.cv_video": "" }
                    });
                    return functions.success(res, "Xóa file thành công");
                }
                return functions.success(res, "Không có thông tin cần xóa");
            }
        }
        return functions.setError(res, "Chưa truyền đối tượng cần xóa");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}