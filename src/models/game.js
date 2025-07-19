const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *           description: ID de l'utilisateur
 *         generatedNumber:
 *           type: number
 *           description: Nombre généré (0-100)
 *         result:
 *           type: string
 *           enum: [gagné, perdu]
 *         balanceChange:
 *           type: number
 *           description: Changement du solde (+50 ou -35)
 *         newBalance:
 *           type: number
 *           description: Nouveau solde après la partie
 *         playedAt:
 *           type: string
 *           format: date-time
 */

const gameSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  generatedNumber: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  result: {
    type: String,
    required: true,
    enum: ['gagné', 'perdu']
  },
  balanceChange: {
    type: Number,
    required: true
  },
  newBalance: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      ret.playedAt = ret.createdAt;
      delete ret._id;
      delete ret.__v;
      delete ret.updatedAt;
      return ret;
    }
  }
});

// Index pour améliorer les performances
gameSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Game', gameSchema);