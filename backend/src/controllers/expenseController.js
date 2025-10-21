import pool from "../config/db.js";

/**
 * 🔹 Obtener lista de egresos
 */
export const getExpenses = async (_, res) => {
  try {
    // Llamamos al procedimiento almacenado que devuelve todos los egresos
    const [rows] = await pool.query("CALL sp_expense_list()");
    res.json(rows[0]); // Devuelve la primera capa de resultados
  } catch (error) {
    console.error("❌ Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};

/**
 * 🔹 Agregar un nuevo egreso
 */
export const addExpense = async (req, res) => {
  const { person_id, amount, expense_type, description, date } = req.body;

  // Validar campos obligatorios
  if (!person_id || !amount) {
    return res.status(400).json({ message: "Missing required fields: person_id or amount." });
  }

  try {
    const created_by = req.user?.username || "system";

    // Llamar al procedimiento almacenado para registrar el gasto
    const [rows] = await pool.query("CALL sp_expense_add(?, ?, ?, ?, ?)", [
      person_id,
      amount,
      description || "",
      date || new Date(), // Si no se envía fecha, se usa la actual
      created_by,
    ]);

    const result = rows[0]?.[0];

    res.json({
      success: true,
      message: "Expense added successfully.",
      expense: result,
    });
  } catch (error) {
    console.error("❌ Error adding expense:", error);

    // Captura de SIGNAL SQLSTATE (error controlado desde el SP)
    if (error.errno === 1644) {
      return res.status(400).json({ message: error.sqlMessage });
    }

    res.status(500).json({ message: "Error adding expense" });
  }
};

/**
 * 🔹 Obtener egresos por persona (opcional)
 */
export const getExpensesByPerson = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM expenses WHERE person_id = ? AND is_deleted = 0 ORDER BY created_at DESC",
      [id]
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching expenses by person:", error);
    res.status(500).json({ message: "Error fetching expenses by person" });
  }
};

/**
 * 🔹 Eliminar (lógicamente) un egreso (opcional)
 */
export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "UPDATE expenses SET is_deleted = 1, updated_at = NOW() WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({
      success: true,
      message: "Expense deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Error deleting expense:", error);
    res.status(500).json({ message: "Error deleting expense" });
  }
};