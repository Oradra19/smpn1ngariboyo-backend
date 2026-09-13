import db from '../config/db.js'
import fs from 'fs'
import path from 'path'

// ==========================================
// GET /api/news
// Ambil semua berita
// ==========================================
export const getAllNews = async (req, res) => {
  try {
    const [news] = await db.query(`
      SELECT *
      FROM news
      ORDER BY createdAt DESC
    `)

    res.json({
      success: true,
      data: news
    })
  } catch (error) {
    console.error('Get all news error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ==========================================
// GET /api/news/:id
// Detail berita
// ==========================================
export const getNewsById = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID berita tidak valid.'
      })
    }

    const [rows] = await db.query(
      `
        SELECT *
        FROM news
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    const newsItem = rows[0]

    if (!newsItem) {
      return res.status(404).json({
        success: false,
        message: 'Berita tidak ditemukan.'
      })
    }

    res.json({
      success: true,
      data: newsItem
    })
  } catch (error) {
    console.error('Get news by id error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ==========================================
// POST /api/news
// Tambah berita + upload gambar
// ==========================================
export const createNews = async (req, res) => {
  try {
    const {
      title,
      category,
      categoryColor,
      author,
      content
    } = req.body

    if (!title || !category || !content) {
      return res.status(400).json({
        success: false,
        message: 'Judul, kategori, dan konten wajib diisi.'
      })
    }

    // Path gambar jika ada file
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : null

    // Ambil nama admin yang sedang login
    const authorName =
      author || req.user?.name || 'Admin'

    const [result] = await db.query(
      `
        INSERT INTO news (
          title,
          category,
          categoryColor,
          author,
          content,
          image
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        category,
        categoryColor || 'blue',
        authorName,
        content,
        imagePath
      ]
    )

    // Ambil data yang baru dibuat
    const [rows] = await db.query(
      `
        SELECT *
        FROM news
        WHERE id = ?
        LIMIT 1
      `,
      [result.insertId]
    )

    res.status(201).json({
      success: true,
      message: 'Berita berhasil diterbitkan!',
      data: rows[0]
    })
  } catch (error) {
    console.error('Create news error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ==========================================
// PUT /api/news/:id
// Update berita
// ==========================================
export const updateNews = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID berita tidak valid.'
      })
    }

    const {
      title,
      category,
      categoryColor,
      author,
      content
    } = req.body

    // Cari berita lama
    const [rows] = await db.query(
      `
        SELECT *
        FROM news
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    const existingNews = rows[0]

    if (!existingNews) {
      return res.status(404).json({
        success: false,
        message: 'Berita tidak ditemukan.'
      })
    }

    // Pertahankan gambar lama
    let imagePath = existingNews.image

    // Jika upload gambar baru
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`

      // Hapus gambar lama
      if (
        existingNews.image &&
        existingNews.image.startsWith('/uploads/')
      ) {
        const oldFilePath = path.join(
          process.cwd(),
          existingNews.image.replace(/^\/+/, '')
        )

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath)
        }
      }
    }

    // Update database
    await db.query(
      `
        UPDATE news
        SET
          title = ?,
          category = ?,
          categoryColor = ?,
          author = ?,
          content = ?,
          image = ?
        WHERE id = ?
      `,
      [
        title ?? existingNews.title,
        category ?? existingNews.category,
        categoryColor ?? existingNews.categoryColor,
        author ?? existingNews.author,
        content ?? existingNews.content,
        imagePath,
        id
      ]
    )

    // Ambil data terbaru
    const [updatedRows] = await db.query(
      `
        SELECT *
        FROM news
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    res.json({
      success: true,
      message: 'Berita berhasil diperbarui!',
      data: updatedRows[0]
    })
  } catch (error) {
    console.error('Update news error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ==========================================
// DELETE /api/news/:id
// Hapus berita
// ==========================================
export const deleteNews = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID berita tidak valid.'
      })
    }

    // Cari berita
    const [rows] = await db.query(
      `
        SELECT *
        FROM news
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    const existingNews = rows[0]

    if (!existingNews) {
      return res.status(404).json({
        success: false,
        message: 'Berita tidak ditemukan.'
      })
    }

    // Hapus file fisik gambar
    if (
      existingNews.image &&
      existingNews.image.startsWith('/uploads/')
    ) {
      const filePath = path.join(
        process.cwd(),
        existingNews.image.replace(/^\/+/, '')
      )

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    // Hapus data dari database
    await db.query(
      `
        DELETE FROM news
        WHERE id = ?
      `,
      [id]
    )

    res.json({
      success: true,
      message: 'Berita berhasil dihapus!'
    })
  } catch (error) {
    console.error('Delete news error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}