const GameHistory = require('../models/game-history.model');

const getMyHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const history = await GameHistory.find({ userId })
      .sort({ playedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username');

    const total = await GameHistory.countDocuments({ userId });
    const totalPages = Math.ceil(total / limit);

    const formattedHistory = history.map(game => ({
      gameId: game._id,
      date: game.playedAt,
      generatedNumber: game.generatedNumber,
      result: game.result,
      balanceChange: game.balanceChange,
      previousBalance: game.previousBalance,
      newBalance: game.newBalance
    }));

    res.json({
      history: formattedHistory,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

const getAllHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const history = await GameHistory.find()
      .sort({ playedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email');

    const total = await GameHistory.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const formattedHistory = history.map(game => ({
      gameId: game._id,
      user: {
        id: game.userId._id,
        username: game.userId.username,
        email: game.userId.email
      },
      date: game.playedAt,
      generatedNumber: game.generatedNumber,
      result: game.result,
      balanceChange: game.balanceChange,
      previousBalance: game.previousBalance,
      newBalance: game.newBalance
    }));

    res.json({
      history: formattedHistory,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique complet:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
};

module.exports = {
  getMyHistory,
  getAllHistory
};
