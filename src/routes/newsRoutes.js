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

const uploadNewsImage = (req, res, next) => {
  upload.single('image')(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }

    next()
  })
}

// Endpoint publik
router.get('/', getAllNews)
router.get('/:id', getNewsById)

// Endpoint khusus Admin (wajib login & bawa token)
router.post('/', authenticateToken, uploadNewsImage, createNews)
router.put('/:id', authenticateToken, uploadNewsImage, updateNews)
router.delete('/:id', authenticateToken, deleteNews)

export default router