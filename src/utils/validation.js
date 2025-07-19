const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Erreurs de validation',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Format d\'email invalide')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  
  body('phone')
    .isMobilePhone()
    .withMessage('Format de numéro de téléphone invalide'),
  
  handleValidationErrors
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Format d\'email invalide')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
  
  handleValidationErrors
];

const userUpdateValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Format d\'email invalide')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Format de numéro de téléphone invalide'),
  
  body('role')
    .optional()
    .isIn(['client', 'admin'])
    .withMessage('Le rôle doit être "client" ou "admin"'),
  
  handleValidationErrors
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID invalide'),
  
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  userUpdateValidation,
  idValidation,
  handleValidationErrors
};
