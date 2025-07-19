const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-généré de l'utilisateur
 *         username:
 *           type: string
 *           description: Nom d'utilisateur unique
 *         email:
 *           type: string
 *           description: Email unique de l'utilisateur
 *         phone:
 *           type: string
 *           description: Numéro de téléphone
 *         role:
 *           type: string
 *           enum: [client, admin]
 *           default: client
 *         balance:
 *           type: number
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Le nom d\'utilisateur est requis'],
    unique: true,
    trim: true,
    minlength: [3, 'Le nom d\'utilisateur doit avoir au moins 3 caractères'],
    maxlength: [30, 'Le nom d\'utilisateur ne peut pas dépasser 30 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Format d\'email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit avoir au moins 6 caractères']
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    trim: true
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client'
  },
  balance: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Index pour améliorer les performances de recherche
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);
