import express from 'express'
import {
  getAllAchievements,
  createAchievement,
  deleteAchievement
} from '../controllers/achievementController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getAllAchievements)
router.post('/', authenticateToken, createAchievement)
router.delete('/:id', authenticateToken, deleteAchievement)

export default router