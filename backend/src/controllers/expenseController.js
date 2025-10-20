import pool from '../config/db.js';

/**
 * 🔹 Obtener lista de gastos
 */
export const getExpenses = async (_, res) => {
  try {
    const [rows] = await pool.query("CALL sp_expense_list()");
    res.json(rows[0]); // Devuelve la primera capa de resultados
  } catch (error) {
    console.error("❌ Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};

/**
 * 🔹 Agregar un gasto
 */
export const addExpense = async (req, res) => {
  const { person_id, amount, description, date } = req.body;

  if (!person_id || !amount || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const created_by = req.user?.username || "system";

    const [rows] = await pool.query("CALL sp_expense_add(?, ?, ?, ?, ?)", [
      person_id,
      amount,
      description || "",
      date,
      created_by,
    ]);

    const result = rows[0]?.[0];

    res.json({
      success: true,
      message: "Expense added successfully",
      expense: result,
    });
  } catch (error) {
    console.error("❌ Error adding expense:", error);

    if (error.errno === 1644) {
      // SIGNAL desde el SP
      return res.status(400).json({ message: error.sqlMessage });
    }

    res.status(500).json({ message: "Error adding expense" });
  }
};