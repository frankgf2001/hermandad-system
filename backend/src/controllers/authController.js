import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 🔐 LOGIN CONTROLLER
 * Usa el procedimiento almacenado sp_user_login
 */
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Se requiere usuario y contraseña." });
  }

  try {
    // 🧭 Llamar al procedimiento almacenado
    const [rows] = await pool.query("CALL sp_user_login(?, ?)", [username, password]);
    
    // El procedimiento devuelve un array doble [ [rows], [metadata] ]
    const result = rows[0]?.[0];

    if (!result) {
      return res.status(401).json({ message: "Usuario o contraseña inválida." });
    }

    // 🔑 Crear token JWT seguro
    const token = jwt.sign(
      {
        id: result.user_id,
        username: result.username,
        role: result.role,
      },
      process.env.JWT_SECRET || "hermandad_secret_key_2025",
      { expiresIn: "2h" }
    );

    // 🧾 Respuesta profesional
    return res.json({
      success: true,
      message: "Has iniciado sesioón correctamente.",
      token,
      user: {
        id: result.user_id,
        username: result.username,
        role: result.role,
        login_time: result.login_time,
      },
    });
  } catch (error) {
    console.error("❌ Error in login:", error);

    // Si el procedimiento lanza SIGNAL, MySQL devuelve error 1644
    if (error.errno === 1644) {
      return res.status(401).json({ message: error.sqlMessage });
    }

    return res.status(500).json({ message: "Ocurrió un error en el servidor." });
  }
};