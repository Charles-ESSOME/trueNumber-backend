const User = require('../../models/user');
const GameHistory = require('../../models/game-history.model');

const playGame = async (req, res) => {
  try {
    const userId = req.user._id;

    // Générer un nombre aléatoire entre 0 et 100
    const generatedNumber = Math.floor(Math.random() * 101);
    
    // Déterminer le résultat
    const result = generatedNumber > 70 ? 'gagné' : 'perdu';
    
    // Calculer le changement de solde
    const balanceChange = result === 'gagné' ? 50 : -35;

    console.log(`Joueur ID: ${req.user?.username || userId}, Nombre généré: ${generatedNumber}, Résultat: ${result}, Changement de solde: ${balanceChange}`);
    
    
    // Récupérer l'utilisateur avec le solde actuel
    const user = await User.findById(userId);
    const previousBalance = user.balance;
    const newBalance = previousBalance + balanceChange; // Le solde peut pas être négatif
    
    // Mettre à jour le solde de l'utilisateur
    await User.findByIdAndUpdate(userId, { balance: newBalance });
    
    // Enregistrer l'historique de la partie
    const gameRecord = new GameHistory({
      userId,
      generatedNumber,
      result,
      balanceChange: newBalance - previousBalance, // Changement réel (peut être différent si le solde était déjà à 0)
      previousBalance,
      newBalance
    });
    
    await gameRecord.save();

    res.json({
      result,
      generatedNumber,
      balanceChange: newBalance - previousBalance,
      previousBalance,
      newBalance
    });
  } catch (error) {
    console.error('Erreur lors du jeu:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur lors du jeu'
    });
  }
};

module.exports = {
  playGame
};