const Users = require("../../models/Users")
const functions = require("../../services/functions")

exports.editUserCompanyMulti = async (req, res) => {
    try {
        let {
            usc_map,
            usc_dgc,
            usc_dgtv,
            usc_dg_time,
            usc_skype,
            usc_video_com,
            usc_lv,
            usc_zalo
        } = req.body;
        if (!req.user||!req.user.data||!req.user.data._id) return functions.setError(res, "Công ty không tồn tại", 429);
        let companyID = req.user.data._id;
        let data = {
            'inForCompany.timviec365.usc_map': usc_map,
            'inForCompany.timviec365.usc_dgc': usc_dgc,
            'inForCompany.timviec365.usc_dgtv': usc_dgtv,
            'inForCompany.timviec365.usc_dg_time': usc_dg_time,
            'inForCompany.timviec365.usc_skype': usc_skype,
            'inForCompany.timviec365.usc_video_com': usc_video_com,
            'inForCompany.timviec365.usc_lv': usc_lv,
            'inForCompany.timviec365.usc_zalo': usc_zalo
        };
        await Users.updateOne({ _id: companyID }, {
            $set: data
        });
        
        return functions.success(res, "Thành công", {data});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.createUserCompanyAddressBranch = async (req, res) => {
    try {
        let {
            usc_branch_cit,
            usc_branch_qh,
            usc_branch_address,
        } = req.body;
        if (!req.user||!req.user.data||!req.user.data._id) return functions.setError(res, "Công ty không tồn tại", 429);
        let companyID = req.user.data._id;
        let data = {usc_branch_cit, usc_branch_qh, usc_branch_address, usc_branch_time: functions.getTimeNow()};
        let company = await Users.findOne({ _id: companyID });
        if (company) {
            if (company.inForCompany) {
                if (company.inForCompany.timviec365) {
                    if (!company.inForCompany.timviec365.usc_branches) {
                        company.inForCompany.timviec365.usc_branches = [data];
                    } else {
                        company.inForCompany.timviec365.usc_branches.push(data);
                    }
                    await company.save()
                }
            }
        }
        return functions.success(res, "Thành công", {data});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.editUserCompanyAddressBranch = async (req, res) => {
    try {
        let {
            index,
            usc_branch_cit,
            usc_branch_qh,
            usc_branch_address,
        } = req.body;
        if (!req.user||!req.user.data||!req.user.data._id) return functions.setError(res, "Công ty không tồn tại", 429);
        let companyID = req.user.data._id;
        let data = {usc_branch_cit, usc_branch_qh, usc_branch_address};
        let company = await Users.findOne({ _id: companyID });
        if (!company||
            !company.inForCompany||
            !company.inForCompany.timviec365||
            !company.inForCompany.timviec365.usc_branches
            ) return functions.setError(res, "Công ty không tồn tại", 400);
        let branch = company.inForCompany.timviec365.usc_branches[index];
        if (branch) {
            let newBranch = JSON.parse(JSON.stringify(branch));
            newBranch.usc_branch_cit = data.usc_branch_cit?data.usc_branch_cit:branch.usc_branch_cit;
            newBranch.usc_branch_qh = data.usc_branch_qh?data.usc_branch_qh:branch.usc_branch_qh;
            newBranch.usc_branch_address = data.usc_branch_address?data.usc_branch_address:branch.usc_branch_address;
            let query = {};
            query[`inForCompany.timviec365.usc_branches.${index}`] = newBranch;
            await Users.updateOne({_id: companyID}, query);
        } else {
            return functions.setError(res, "Không tồn tại chi nhánh này", 400);
        }
    return functions.success(res, "Thành công", {data});
        
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.deleteUserCompanyAddressBranch = async (req, res) => {
    try {
        let {
            index
        } = req.params;
        if (!req.user||!req.user.data||!req.user.data._id) return functions.setError(res, "Công ty không tồn tại", 429);
        let companyID = req.user.data._id;
        let company = await Users.findOne({ _id: companyID });
        if (!company||
            !company.inForCompany||
            !company.inForCompany.timviec365||
            !company.inForCompany.timviec365.usc_branches
            ) return functions.setError(res, "Công ty không tồn tại", 400);
        let branch = company.inForCompany.timviec365.usc_branches[index];
        let unset = {};
        unset[`inForCompany.timviec365.usc_branches.${index}`] = 1;
        if (branch) {
            await Users.updateOne({_id: companyID}, {$unset : unset});
            await Users.updateOne({_id: companyID}, {$pull : {"inForCompany.timviec365.usc_branches" : null}});
        }else {
            return functions.setError(res, "Không tồn tại chi nhánh này", 400);
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}