import express from 'express'
import { login, getProfile } from '../controllers/authController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Endpoint publik: login
router.post('/login', login)

// Endpoint terproteksi: profil admin
router.get('/me', authenticateToken, getProfile)

export default router