import db from '../config/db.js'

export const getAllAgendas = async (req, res) => {
  try {
    const [agendas] = await db.query(`
      SELECT *
      FROM agenda
      ORDER BY id DESC
    `)

    res.json({
      success: true,
      data: agendas
    })
  } catch (error) {
    console.error('Get agendas error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const createAgenda = async (req, res) => {
  try {
    const {
      dateDay,
      dateMonth,
      title,
      period,
      desc
    } = req.body

    if (!dateDay || !dateMonth || !title) {
      return res.status(400).json({
        success: false,
        message: 'Tanggal, bulan, dan judul wajib diisi.'
      })
    }

    const [result] = await db.query(
      `
        INSERT INTO agenda
        (
          dateDay,
          dateMonth,
          title,
          period,
          \`desc\`
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        dateDay,
        dateMonth,
        title,
        period || '-',
        desc || ''
      ]
    )

    // Ambil data yang baru dibuat
    const [rows] = await db.query(
      `
        SELECT *
        FROM agenda
        WHERE id = ?
      `,
      [result.insertId]
    )

    res.status(201).json({
      success: true,
      message: 'Agenda berhasil ditambahkan!',
      data: rows[0]
    })
  } catch (error) {
    console.error('Create agenda error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateAgenda = async (req, res) => {
  try {
    const { id } = req.params

    const {
      dateDay,
      dateMonth,
      title,
      period,
      desc
    } = req.body

    const [result] = await db.query(
      `
        UPDATE agenda
        SET
          dateDay = ?,
          dateMonth = ?,
          title = ?,
          period = ?,
          \`desc\` = ?
        WHERE id = ?
      `,
      [
        dateDay,
        dateMonth,
        title,
        period,
        desc,
        Number(id)
      ]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Agenda tidak ditemukan.'
      })
    }

    // Ambil data setelah update
    const [rows] = await db.query(
      `
        SELECT *
        FROM agenda
        WHERE id = ?
      `,
      [Number(id)]
    )

    res.json({
      success: true,
      message: 'Agenda berhasil diperbarui!',
      data: rows[0]
    })
  } catch (error) {
    console.error('Update agenda error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteAgenda = async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await db.query(
      `
        DELETE FROM agenda
        WHERE id = ?
      `,
      [Number(id)]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Agenda tidak ditemukan.'
      })
    }

    res.json({
      success: true,
      message: 'Agenda berhasil dihapus!'
    })
  } catch (error) {
    console.error('Delete agenda error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}