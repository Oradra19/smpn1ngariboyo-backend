import express from 'express'
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/newsController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

// Endpoint publik
router.get('/', getAllNews)
router.get('/:id', getNewsById)

// Endpoint khusus Admin (wajib login & bawa token)
router.post('/', authenticateToken, upload.single('image'), createNews)
router.put('/:id', authenticateToken, upload.single('image'), updateNews)
router.delete('/:id', authenticateToken, deleteNews)

export default router