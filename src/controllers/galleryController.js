import db from '../config/db.js'
import fs from 'fs'
import path from 'path'

// GET: Ambil semua galeri
export const getAllGalleries = async (req, res) => {
  try {
    const [galleries] = await db.query(`
      SELECT *
      FROM gallery
      ORDER BY id DESC
    `)

    res.json({
      success: true,
      data: galleries
    })
  } catch (error) {
    console.error('Get galleries error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// POST: Tambah foto galeri baru
export const createGallery = async (req, res) => {
  try {
    const {
      title,
      category,
      desc,
      date
    } = req.body

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : null

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Judul dokumentasi wajib diisi!'
      })
    }

    // Format tanggal default
    const defaultDate = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    const [result] = await db.query(
      `
        INSERT INTO gallery
        (
          title,
          category,
          \`desc\`,
          date,
          image
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        title,
        category || 'Upacara',
        desc || '',
        date || defaultDate,
        image
      ]
    )

    // Ambil data yang baru dibuat
    const [rows] = await db.query(
      `
        SELECT *
        FROM gallery
        WHERE id = ?
      `,
      [result.insertId]
    )

    res.status(201).json({
      success: true,
      message: 'Foto berhasil ditambahkan ke galeri',
      data: rows[0]
    })
  } catch (error) {
    console.error('Create gallery error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// PUT: Perbarui data galeri
export const updateGallery = async (req, res) => {
  try {
    const id = Number(req.params.id)

    const {
      title,
      category,
      desc
    } = req.body

    // Cari data galeri yang lama
    const [rows] = await db.query(
      `
        SELECT *
        FROM gallery
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    const existing = rows[0]

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Data galeri tidak ditemukan'
      })
    }

    let image = existing.image

    // Jika ada gambar baru
    if (req.file) {
      // Hapus file lama
      if (existing.image) {
        const oldPath = path.join(
          process.cwd(),
          existing.image.replace(/^\/+/, '')
        )

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }

      image = `/uploads/${req.file.filename}`
    }

    // Update database
    await db.query(
      `
        UPDATE gallery
        SET
          title = ?,
          category = ?,
          \`desc\` = ?,
          image = ?
        WHERE id = ?
      `,
      [
        title,
        category,
        desc || '',
        image,
        id
      ]
    )

    // Ambil data setelah update
    const [updatedRows] = await db.query(
      `
        SELECT *
        FROM gallery
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    res.json({
      success: true,
      message: 'Data galeri berhasil diperbarui',
      data: updatedRows[0]
    })
  } catch (error) {
    console.error('Update gallery error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// DELETE: Hapus galeri
export const deleteGallery = async (req, res) => {
  try {
    const id = Number(req.params.id)

    // Cari data terlebih dahulu
    const [rows] = await db.query(
      `
        SELECT *
        FROM gallery
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    const existing = rows[0]

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Data galeri tidak ditemukan'
      })
    }

    // Hapus file fisik gambar
    if (existing.image) {
      const filePath = path.join(
        process.cwd(),
        existing.image.replace(/^\/+/, '')
      )

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    // Hapus data dari database
    await db.query(
      `
        DELETE FROM gallery
        WHERE id = ?
      `,
      [id]
    )

    res.json({
      success: true,
      message: 'Foto galeri berhasil dihapus'
    })
  } catch (error) {
    console.error('Delete gallery error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}