const jwt = require('jsonwebtoken');
const User = require('../../models/user');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà'
      });
    }

    // Créer le nouvel utilisateur
    const user = new User({
      username,
      email,
      password,
      phone
    });

    await user.save();

    res.status(201).json({
      message: 'Compte créé avec succès',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Cet email ou nom d\'utilisateur est déjà utilisé'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Erreur de validation',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      message: 'Erreur interne du serveur lors de la création du compte'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rechercher l'utilisateur
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({
        message: 'Identifiants invalides'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Identifiants invalides'
      });
    }

    // Générer le token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur lors de la connexion'
    });
  }
};

const logout = async (req, res) => {
  // Dans une implémentation plus avancée, on pourrait blacklister le token
  res.json({ message: 'Déconnexion réussie' });
};

module.exports = {
  register,
  login,
  logout
};