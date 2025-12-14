import pool from "../config/db.js";

/**
 * 👥 Obtener lista de personas con su rol
 */
export const getAllPersons = async (_, res) => {
  try {
    const [rows] = await pool.query("CALL sp_person_list()");
    const persons = rows[0] || [];

    return res.json({
      success: true,
      total: persons.length,
      persons, // 🔹 Lista completa con rol incluido
    });
  } catch (error) {
    console.error("❌ Error fetching persons:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching persons",
      error: error.message,
    });
  }
};

/**
 * 👥 Obtener lista de personas con usuario asociado
 */
export const getPersonUsers = async (_, res) => {
  try {
    const [rows] = await pool.query("CALL sp_person_get_users()");
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

/**
 * ➕ Crear nueva persona con usuario y rol
 */
export const createPerson = async (req, res) => {
  const { first_name, last_name, dni, phone, address, birth_date, role_id } = req.body;

  if (!first_name || !last_name || !dni || !role_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const created_by = req.user?.username || "system";

    // 🚀 Llamamos al SP pasando el rol
    const [rows] = await pool.query("CALL sp_person_add(?, ?, ?, ?, ?, ?, ?, ?)", [
      first_name,
      last_name,
      dni,
      phone || null,
      address || null,
      birth_date || null,
      role_id,
      created_by,
    ]);

    const result = rows[0]?.[0];

    if (!result) {
      return res.status(500).json({ message: "Unexpected empty result from procedure" });
    }

    // ⚠️ No devolvemos contraseña, solo los datos del SP
    res.json({
      success: true,
      message: "Person created successfully",
      person: {
        id: result.id,
        full_name: result.full_name,
        username: result.username, // DNI
        phone: result.phone,
        address: result.address,
        birth_date: result.birth_date,
        role_name: result.role_name,
        created_at: result.created_at,
      },
    });
  } catch (error) {
    console.error("❌ Error creating person:", error);

    if (error.errno === 1644) {
      // SIGNAL lanzado por MySQL
      return res.status(400).json({ message: error.sqlMessage });
    }

    res.status(500).json({ message: "Error creating person" });
  }
};