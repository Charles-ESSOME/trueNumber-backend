const User = require('../models/user');

const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      balance: user.balance
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du solde:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

module.exports = {
  getBalance
};