const AdminUser = require('../../models/AdminUser');
const SettingDX = require('../../models/Vanthu/setting_dx');
const functions = require("../../services/functions");

// Hàm lấy dữ liệu Setting
exports.getSettings = async (req, res) => {
    try {
        const settings = await SettingDX.find();
        res.status(200).json(settings)
    } catch (error) {
        console.error('Failed to get settings', error);
        res.status(500).json({ error: 'Failed to get settings' });
    }
};

exports.findOneSetting = async (req,res) => {
    try {
        let id_setting = req.body.id
        let settingCom = await SettingDX.findOne({id_setting} )
        res.status(200).json(settingCom)
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed ' });
    }
}

exports.createSettingDx = async (req,res) => {
    try {
        let response = new SettingDX(req.body);
        let createSettings = await response.save();
        res.status(200).json(createSettings)
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed ' });
    }
}

exports.editSettingDx = async (req,res) => {
    try {
        let id = req.params._id;
        let updateSetting = req.body._id;
        let editSetting = await SettingDX.findByIdAndUpdate({_id : id},updateSetting)
        if (!editSetting) {
            return res.status(404).json({ error: 'Setting not found' });
        }
        res.status(200).json(editSetting)
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed ' });
    }
}

// Xóa setting

exports.removeSetting = async (req,res) => {
    try {
        let id = req.body._id;
        console.log(id)
         let deleteSetting=   await SettingDX.deleteOne({_id : id});
        if (!deleteSetting) {
            return res.status(404).json({ error: 'Setting not found' });
        }
        res.status(200).json(deleteSetting)
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed ' });
    }
}

