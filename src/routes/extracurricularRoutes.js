import express from 'express'
import {
  getAllExtracurriculars,
  createExtracurricular,
  updateExtracurricular,
  deleteExtracurricular
} from '../controllers/extracurricularController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getAllExtracurriculars)
router.post('/', authenticateToken, createExtracurricular)
router.put('/:id', authenticateToken, updateExtracurricular)
router.delete('/:id', authenticateToken, deleteExtracurricular)

export default router