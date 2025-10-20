import pool from "../config/db.js";

/**
 * 📄 Obtener lista de ingresos
 */
export const getIncomes = async (_, res) => {
  try {
    const [rows] = await pool.query("CALL sp_income_list()");
    res.json(rows[0]); // Devuelve la primera capa del resultado
  } catch (error) {
    console.error("❌ Error fetching incomes:", error);
    res.status(500).json({ message: "Error fetching incomes" });
  }
};

/**
 * 💰 Agregar un ingreso
 */
export const addIncome = async (req, res) => {
  const { person_id, amount, description, date } = req.body;

  if (!person_id || !amount || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const created_by = req.user?.username || "system";

    const [rows] = await pool.query("CALL sp_income_add(?, ?, ?, ?, ?)", [
      person_id,
      amount,
      description || "",
      date,
      created_by,
    ]);

    const result = rows[0]?.[0];

    res.json({
      success: true,
      message: "Income added successfully",
      income: result,
    });
  } catch (error) {
    console.error("❌ Error adding income:", error);

    if (error.errno === 1644) {
      // SIGNAL desde el SP
      return res.status(400).json({ message: error.sqlMessage });
    }

    res.status(500).json({ message: "Error adding income" });
  }
};