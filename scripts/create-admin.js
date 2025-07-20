const mongoose = require('mongoose');
const User = require('../src/models/user');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connexion MongoDB réussie');

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Un administrateur existe déjà:', existingAdmin.email);
      process.exit(0);
    }

    // Créer l'utilisateur admin
    const admin = new User({
      username: 'admin',
      email: 'admin@truenumber.com',
      password: 'admin123', // Sera hashé automatiquement
      phone: '+237697586422',
      role: 'admin',
      balance: 1000 // Solde initial pour l'admin
    });

    await admin.save();

    console.log('✅ Administrateur créé avec succès !');
    console.log('📧 Email:', admin.email);
    console.log('��� Mot de passe: admin123');
    console.log('⚠️ Changez le mot de passe après la première connexion !');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion MongoDB fermée');
    process.exit(0);
  }
};

createAdmin();