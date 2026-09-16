import express from 'express'
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from '../controllers/teacherController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'
import { uploadSingle } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/', getAllTeachers)
router.get('/:id', getTeacherById)
router.post('/', authenticateToken, uploadSingle('photo'), createTeacher)
router.put('/:id', authenticateToken, uploadSingle('photo'), updateTeacher)
router.delete('/:id', authenticateToken, deleteTeacher)

export default router