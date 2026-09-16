import express from 'express'
import {
  getAllOsisPrograms,
  createOsisProgram,
  updateOsisProgram,
  deleteOsisProgram
} from '../controllers/osisController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getAllOsisPrograms)
router.post('/', authenticateToken, createOsisProgram)
router.put('/:id', authenticateToken, updateOsisProgram)
router.delete('/:id', authenticateToken, deleteOsisProgram)

export default router