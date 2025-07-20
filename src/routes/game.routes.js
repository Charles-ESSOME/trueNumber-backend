const express = require('express');
const { playGame } = require('../controllers/game/game.controller');
const { getMyHistory, getAllHistory } = require('../controllers/history.controller');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     GameResult:
 *       type: object
 *       properties:
 *         result:
 *           type: string
 *           enum: [gagné, perdu]
 *         generatedNumber:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         balanceChange:
 *           type: number
 *         previousBalance:
 *           type: number
 *         newBalance:
 *           type: number
 *     GameHistory:
 *       type: object
 *       properties:
 *         gameId:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         generatedNumber:
 *           type: number
 *         result:
 *           type: string
 *         balanceChange:
 *           type: number
 *         previousBalance:
 *           type: number
 *         newBalance:
 *           type: number
 *     HistoryResponse:
 *       type: object
 *       properties:
 *         history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GameHistory'
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: number
 *             totalPages:
 *               type: number
 *             totalRecords:
 *               type: number
 *             hasNext:
 *               type: boolean
 *             hasPrev:
 *               type: boolean
 */

/**
 * @swagger
 * /api/game/play:
 *   post:
 *     summary: Jouer une partie
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Partie jouée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameResult'
 *       401:
 *         description: Token invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/play', auth, playGame);

/**
 * @swagger
 * /api/game/history:
 *   get:
 *     summary: Récupérer l'historique des parties de l'utilisateur connecté
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Historique récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoryResponse'
 *       401:
 *         description: Token invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/history', auth, getMyHistory);

/**
 * @swagger
 * /api/game/history/all:
 *   get:
 *     summary: Récupérer l'historique complet de toutes les parties (Admin seulement)
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Historique complet récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/GameHistory'
 *                       - type: object
 *                         properties:
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               username:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *                     totalRecords:
 *                       type: number
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       401:
 *         description: Token invalide
 *       403:
 *         description: Accès réservé aux administrateurs
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/history/all', auth, adminOnly, getAllHistory);

module.exports = router;