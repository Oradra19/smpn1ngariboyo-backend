import express from 'express'
import {
  getAllAgendas,
  createAgenda,
  updateAgenda,
  deleteAgenda
} from '../controllers/agendaController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getAllAgendas)
router.post('/', authenticateToken, createAgenda)
router.put('/:id', authenticateToken, updateAgenda)
router.delete('/:id', authenticateToken, deleteAgenda)

export default router