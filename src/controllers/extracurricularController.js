import db from '../config/db.js'

// GET: Ambil semua data ekstrakurikuler
export const getAllExtracurriculars = async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT *
      FROM extracurriculars
      ORDER BY id ASC
    `)
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST: Tambah eskul baru
export const createExtracurricular = async (req, res) => {
  try {
    const { name, category, coach, schedule, description } = req.body

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Nama dan kategori eskul wajib diisi!' })
    }

    const [result] = await db.query(`
      INSERT INTO extracurriculars (name, category, coach, schedule, description, updatedAt)
      VALUES (?, ?, ?, ?, ?, NOW(3))
    `, [name, category, coach || '-', schedule || '-', description || ''])

    const [rows] = await db.query(
      'SELECT * FROM extracurriculars WHERE id = ? LIMIT 1',
      [result.insertId]
    )

    res.status(201).json({
      success: true,
      message: 'Ekstrakurikuler berhasil ditambahkan',
      data: rows[0]
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// PUT: Perbarui eskul
export const updateExtracurricular = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { name, category, coach, schedule, description } = req.body

    const [existingRows] = await db.query(
      'SELECT id FROM extracurriculars WHERE id = ? LIMIT 1',
      [id]
    )
    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data eskul tidak ditemukan' })
    }

    await db.query(`
      UPDATE extracurriculars
      SET name = ?, category = ?, coach = ?, schedule = ?, description = ?, updatedAt = NOW(3)
      WHERE id = ?
    `, [name, category, coach || '-', schedule || '-', description || '', id])

    const [rows] = await db.query(
      'SELECT * FROM extracurriculars WHERE id = ? LIMIT 1',
      [id]
    )

    res.json({ success: true, message: 'Data eskul berhasil diperbarui', data: rows[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// DELETE: Hapus eskul
export const deleteExtracurricular = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [existingRows] = await db.query(
      'SELECT id FROM extracurriculars WHERE id = ? LIMIT 1',
      [id]
    )
    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data eskul tidak ditemukan' })
    }

    await db.query('DELETE FROM extracurriculars WHERE id = ?', [id])
    res.json({ success: true, message: 'Ekstrakurikuler berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}