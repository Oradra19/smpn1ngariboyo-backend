import db from '../config/db.js'
import fs from 'fs'
import path from 'path'

// ==========================================
// GET /api/teachers
// Ambil semua data guru
// ==========================================
export const getAllTeachers = async (req, res) => {
  try {
    const [teachers] = await db.query(`
      SELECT *
      FROM teacher
      ORDER BY id ASC
    `)

    res.json({
      success: true,
      data: teachers
    })
  } catch (error) {
    console.error('Get all teachers error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ==========================================
// GET /api/teachers/:id
// Ambil detail guru
// ==========================================
export const getTeacherById = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID guru tidak valid.'
      })
    }

    const [rows] = await db.query(
      `
        SELECT *
        FROM teacher
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    const teacher = rows[0]

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Data guru tidak ditemukan'
      })
    }

    res.json({
      success: true,
      data: teacher
    })
  } catch (error) {
    console.error('Get teacher by id error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ==========================================
// POST /api/teachers
// Tambah data guru
// ==========================================
export const createTeacher = async (req, res) => {
  try {
    const {
      name,
      role,
      category,
      nip,
      subject
    } = req.body

    if (!name || !nip || !category) {
      return res.status(400).json({
        success: false,
        message: 'Nama, NIP, dan kategori wajib diisi.'
      })
    }

    // Path foto
    const photoPath = req.file
      ? `/uploads/${req.file.filename}`
      : null

    // Insert data guru
    const [result] = await db.query(
      `
        INSERT INTO teacher (
          name,
          role,
          category,
          nip,
          subject,
          photo
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        role || 'Guru Mata Pelajaran',
        category,
        nip,
        subject || '-',
        photoPath
      ]
    )

    // Ambil data yang baru dibuat
    const [rows] = await db.query(
      `
        SELECT *
        FROM teacher
        WHERE id = ?
        LIMIT 1
      `,
      [result.insertId]
    )

    res.status(201).json({
      success: true,
      message: 'Data guru berhasil ditambahkan!',
      data: rows[0]
    })
  } catch (error) {
    console.error('Create teacher error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ==========================================
// PUT /api/teachers/:id
// Update data guru
// ==========================================
export const updateTeacher = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID guru tidak valid.'
      })
    }

    const {
      name,
      role,
      category,
      nip,
      subject
    } = req.body

    // Cari data guru lama
    const [rows] = await db.query(
      `
        SELECT *
        FROM teacher
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    const existing = rows[0]

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Data guru tidak ditemukan.'
      })
    }

    // Pertahankan foto lama
    let photoPath = existing.photo

    // Jika upload foto baru
    if (req.file) {
      photoPath = `/uploads/${req.file.filename}`

      // Hapus foto lama
      if (
        existing.photo &&
        existing.photo.startsWith('/uploads/')
      ) {
        const oldPath = path.join(
          process.cwd(),
          existing.photo.replace(/^\/+/, '')
        )

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
    }

    // Update database
    await db.query(
      `
        UPDATE teacher
        SET
          name = ?,
          role = ?,
          category = ?,
          nip = ?,
          subject = ?,
          photo = ?
        WHERE id = ?
      `,
      [
        name ?? existing.name,
        role ?? existing.role,
        category ?? existing.category,
        nip ?? existing.nip,
        subject ?? existing.subject,
        photoPath,
        id
      ]
    )

    // Ambil data terbaru
    const [updatedRows] = await db.query(
      `
        SELECT *
        FROM teacher
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    res.json({
      success: true,
      message: 'Data guru berhasil diperbarui!',
      data: updatedRows[0]
    })
  } catch (error) {
    console.error('Update teacher error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ==========================================
// DELETE /api/teachers/:id
// Hapus data guru
// ==========================================
export const deleteTeacher = async (req, res) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID guru tidak valid.'
      })
    }

    // Cari data guru
    const [rows] = await db.query(
      `
        SELECT *
        FROM teacher
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    const existing = rows[0]

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Data guru tidak ditemukan.'
      })
    }

    // Hapus file foto
    if (
      existing.photo &&
      existing.photo.startsWith('/uploads/')
    ) {
      const oldPath = path.join(
        process.cwd(),
        existing.photo.replace(/^\/+/, '')
      )

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    // Hapus data dari database
    await db.query(
      `
        DELETE FROM teacher
        WHERE id = ?
      `,
      [id]
    )

    res.json({
      success: true,
      message: 'Data guru berhasil dihapus!'
    })
  } catch (error) {
    console.error('Delete teacher error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}