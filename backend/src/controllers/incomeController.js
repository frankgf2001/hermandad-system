import pool from "../config/db.js";

/**
 * Obtener lista de ingresos
 */
export const getIncomes = async (_, res) => {
  try {
    const [rows] = await pool.query("CALL sp_income_list()");
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ message: "Error fetching incomes" });
  }
};

/**
 * Agregar un ingreso
 */
export const addIncome = async (req, res) => {
  const { person_id, amount, income_type, reference, notes, date } = req.body;

  // Validar campos mínimos
  if (!person_id || !amount) {
    return res.status(400).json({ message: "Faltan campos obligatorios: persona o monto." });
  }

  try {
    const created_by = req.user?.username || "system";

    // Llamada al procedimiento actualizado
    const [rows] = await pool.query("CALL sp_income_add(?, ?, ?, ?, ?, ?, ?)", [
      person_id,
      amount,
      income_type || null,
      reference || null,
      notes || null,
      date || null,       // Puede ser null (el SP usa CURDATE() por defecto)
      created_by,
    ]);

    const result = rows[0]?.[0];

    res.json({
      success: true,
      message: "Ingreso registrado correctamente.",
      income: result,
    });
  } catch (error) {
    console.error("Error adding income:", error);

    if (error.errno === 1644) {
      // SIGNAL SQLSTATE desde el procedimiento
      return res.status(400).json({ message: error.sqlMessage });
    }

    res.status(500).json({ message: "Error al registrar el ingreso." });
  }
};