const User = require('../../models/user');

const getMe = async (req, res) => {
    try {
        res.json({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role,
            balance: req.user.balance
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({
            message: 'Erreur interne du serveur'
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isActive: true })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({
            message: 'Erreur interne du serveur'
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ _id: id, isActive: true })
            .select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        res.json(user);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({
            message: 'Erreur interne du serveur'
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { username, email, password, phone, role } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà'
            });
        }

        const user = new User({
            username,
            email,
            password,
            phone,
            role: role || 'client'
        });

        await user.save();

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
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
        console.error('Erreur lors de la création de l\'utilisateur:', error);

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
            message: 'Erreur interne du serveur'
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone, role } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ _id: id, isActive: true });
        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        // Vérifier l'unicité de l'email et du nom d'utilisateur si modifiés
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email, _id: { $ne: id } });
            if (emailExists) {
                return res.status(400).json({
                    message: 'Cet email est déjà utilisé'
                });
            }
        }

        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username, _id: { $ne: id } });
            if (usernameExists) {
                return res.status(400).json({
                    message: 'Ce nom d\'utilisateur est déjà utilisé'
                });
            }
        }

        // Mettre à jour les champs
        const updateFields = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (phone) updateFields.phone = phone;
        if (role) updateFields.role = role;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            message: 'Utilisateur mis à jour avec succès',
            user: updatedUser
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Erreur de validation',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            message: 'Erreur interne du serveur'
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier que l'admin ne se supprime pas lui-même
        if (id === req.user._id.toString()) {
            return res.status(400).json({
                message: 'Vous ne pouvez pas supprimer votre propre compte'
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            message: 'Utilisateur supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        res.status(500).json({
            message: 'Erreur interne du serveur'
        });
    }
};

module.exports = {
    getMe,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};