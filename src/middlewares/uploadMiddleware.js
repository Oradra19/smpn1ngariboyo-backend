import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDirectory = path.join(__dirname, '../../uploads')

fs.mkdirSync(uploadDirectory, { recursive: true })

// Konfigurasi tempat simpan dan nama file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
  }
})

// Filter hanya menerima file gambar
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Hanya file gambar (.jpg, .jpeg, .png, .webp) yang diperbolehkan!'), false)
  }
}

export const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Maksimal 3MB
  fileFilter
})

export const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }

    next()
  })
}