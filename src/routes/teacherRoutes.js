import express from 'express'
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from '../controllers/teacherController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/', getAllTeachers)
router.get('/:id', getTeacherById)
router.post('/', authenticateToken, upload.single('photo'), createTeacher)
router.put('/:id', authenticateToken, upload.single('photo'), updateTeacher)
router.delete('/:id', authenticateToken, deleteTeacher)

export default router