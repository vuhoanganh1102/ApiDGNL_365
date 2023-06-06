const VanBan = require('../../../models/Vanthu/van_ban')

exports.showAll = async(req,res) => {
    try {
      
        const showVanBan = await VanBan.find();
        res.status(200).json(showVanBan)
    } catch (error) {
        console.error('Failed to get history', error);
        res.status(500).json({ error: 'Failed to get history' });
    }
}
