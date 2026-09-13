import db from '../config/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password wajib diisi.'
      })
    }

    // Cari user berdasarkan username
    const [rows] = await db.query(
      `
        SELECT id, username, password, name, role
        FROM user
        WHERE username = ?
        LIMIT 1
      `,
      [username]
    )

    const user = rows[0]

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah.'
      })
    }

    // Bandingkan password dengan hash di database
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah.'
      })
    }

    // Buat token JWT (berlaku 1 hari)
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    )

    res.json({
      success: true,
      message: 'Login berhasil!',
      token,
      admin: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Cek profil admin yang sedang login
export const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
        SELECT id, username, name, role, createdAt
        FROM user
        WHERE id = ?
        LIMIT 1
      `,
      [req.user.id]
    )

    const user = rows[0]

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan.'
      })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Get profile error:', error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}