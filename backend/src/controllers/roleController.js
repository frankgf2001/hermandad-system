import pool from "../config/db.js";

/**
 * 🎭 Obtener lista de roles
 */
export const getAllRoles = async (_, res) => {
  try {
    const [rows] = await pool.query("CALL sp_role_list()");
    res.json(rows[0]); // ✅ Devuelve el primer conjunto de resultados
  } catch (error) {
    console.error("❌ Error fetching roles:", error);
    res.status(500).json({ message: "Error fetching roles" });
  }
};