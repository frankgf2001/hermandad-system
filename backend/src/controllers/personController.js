import pool from "../config/db.js";

/**
 * 👥 Obtener lista de personas
 */
export const getAllPersons = async (_, res) => {
  try {
    const [rows] = await pool.query("CALL sp_person_list()");
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching persons:", error);
    res.status(500).json({ message: "Error fetching persons" });
  }
};

/**
 * 👥 Obtener lista de personas de tipo usuario
 */

export const getPersonUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL sp_person_get_users()");
    res.json(rows[0]); // ✅ Devolvemos el primer conjunto de resultados
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

/**
 * ➕ Crear nueva persona
 */
export const createPerson = async (req, res) => {
  const { first_name, last_name, dni, phone, address, birth_date } = req.body;

  if (!first_name || !last_name || !dni) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const created_by = req.user?.username || "system";

    const [rows] = await pool.query("CALL sp_person_add(?, ?, ?, ?, ?, ?, ?)", [
      first_name,
      last_name,
      dni,
      phone || null,
      address || null,
      birth_date || null,
      created_by,
    ]);

    const result = rows[0]?.[0];

    res.json({
      success: true,
      message: "Person created successfully",
      person: result,
    });
  } catch (error) {
    console.error("❌ Error creating person:", error);

    if (error.errno === 1644) {
      // SIGNAL del procedimiento
      return res.status(400).json({ message: error.sqlMessage });
    }

    res.status(500).json({ message: "Error creating person" });
  }
};
