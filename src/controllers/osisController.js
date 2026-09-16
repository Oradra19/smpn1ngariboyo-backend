import db from '../config/db.js'

// GET semua program kerja OSIS
export const getAllOsisPrograms = async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT *
      FROM osisprogram
      ORDER BY id ASC
    `)
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST program kerja baru
export const createOsisProgram = async (req, res) => {
  try {
    const { title, desc } = req.body
    if (!title || !desc) {
      return res.status(400).json({ success: false, message: 'Judul dan deskripsi program kerja wajib diisi!' })
    }

    const [result] = await db.query(
      'INSERT INTO osisprogram (title, `desc`) VALUES (?, ?)',
      [title, desc]
    )
    const [rows] = await db.query(
      'SELECT * FROM osisprogram WHERE id = ? LIMIT 1',
      [result.insertId]
    )
    res.status(201).json({ success: true, message: 'Program OSIS berhasil ditambahkan', data: rows[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// PUT edit program kerja
export const updateOsisProgram = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { title, desc } = req.body

    const [existingRows] = await db.query(
      'SELECT id FROM osisprogram WHERE id = ? LIMIT 1',
      [id]
    )
    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data program kerja tidak ditemukan' })
    }

    await db.query(
      'UPDATE osisprogram SET title = ?, `desc` = ? WHERE id = ?',
      [title, desc, id]
    )
    const [rows] = await db.query(
      'SELECT * FROM osisprogram WHERE id = ? LIMIT 1',
      [id]
    )
    res.json({ success: true, message: 'Program OSIS berhasil diperbarui', data: rows[0] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// DELETE hapus program kerja
export const deleteOsisProgram = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [result] = await db.query(
      'DELETE FROM osisprogram WHERE id = ?',
      [id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data program kerja tidak ditemukan' })
    }
    res.json({ success: true, message: 'Program OSIS berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}