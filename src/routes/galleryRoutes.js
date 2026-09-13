import express from 'express'
import {
  getAllGalleries,
  createGallery,
  updateGallery,
  deleteGallery
} from '../controllers/galleryController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

// Endpoint publik
router.get('/', getAllGalleries)

// Endpoint admin (butuh token & upload foto)
router.post('/', authenticateToken, upload.single('image'), createGallery)
router.put('/:id', authenticateToken, upload.single('image'), updateGallery)
router.delete('/:id', authenticateToken, deleteGallery)

export default router