import db from '../config/db.js'

export const getAllAchievements = async (req, res) => {
  try {
    const [achievements] = await db.query(`
      SELECT *
      FROM achievement
      ORDER BY id DESC
    `)

    res.json({
      success: true,
      data: achievements
    })
  } catch (error) {
    console.error('Get achievements error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const createAchievement = async (req, res) => {
  try {
    const {
      title,
      category,
      level,
      year,
      medal,
      medalLabel,
      student,
      organizer,
      desc
    } = req.body

    if (!title || !category || !student) {
      return res.status(400).json({
        success: false,
        message: 'Judul, kategori, dan nama siswa wajib diisi.'
      })
    }

    const [result] = await db.query(
      `
        INSERT INTO achievement
        (
          title,
          category,
          level,
          year,
          medal,
          medalLabel,
          student,
          organizer,
          \`desc\`,
          updatedAt
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3))
      `,
      [
        title,
        category,
        level || 'Kabupaten',
        year || '2026',
        medal || 'gold',
        medalLabel || 'Juara 1',
        student,
        organizer || '-',
        desc || ''
      ]
    )

    const [rows] = await db.query(
      `
        SELECT *
        FROM achievement
        WHERE id = ?
      `,
      [result.insertId]
    )

    res.status(201).json({
      success: true,
      message: 'Prestasi berhasil dicatat!',
      data: rows[0]
    })
  } catch (error) {
    console.error('Create achievement error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await db.query(
      `
        DELETE FROM achievement
        WHERE id = ?
      `,
      [Number(id)]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Prestasi tidak ditemukan.'
      })
    }

    res.json({
      success: true,
      message: 'Prestasi berhasil dihapus!'
    })
  } catch (error) {
    console.error('Delete achievement error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}