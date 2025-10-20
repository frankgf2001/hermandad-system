import pool from "../config/db.js";

/**
 * 📊 Resumen general (total ingresos, egresos y balance)
 */
export const getSummary = async (_, res) => {
  try {
    const [rows] = await pool.query("CALL sp_report_summary()");
    res.json({
      success: true,
      message: "Summary report generated successfully",
      summary: rows[0]?.[0],
    });
  } catch (error) {
    console.error("❌ Error generating summary:", error);
    res.status(500).json({ success: false, message: "Error generating summary" });
  }
};

/**
 * 📅 Reporte diario
 */
export const getDailyReport = async (_, res) => {
  try {
    const [rows] = await pool.query("CALL sp_report_daily()");
    res.json({
      success: true,
      message: "Daily report generated successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("❌ Error generating daily report:", error);
    res.status(500).json({ success: false, message: "Error generating daily report" });
  }
};

/**
 * 🗓️ Reporte semanal
 */
export const getWeeklyReport = async (_, res) => {
  try {
    const [rows] = await pool.query("CALL sp_report_weekly()");
    res.json({
      success: true,
      message: "Weekly report generated successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("❌ Error generating weekly report:", error);
    res.status(500).json({ success: false, message: "Error generating weekly report" });
  }
};

/**
 * 📆 Reporte mensual
 */
export const getMonthlyReport = async (_, res) => {
  try {
    const [rows] = await pool.query("CALL sp_report_monthly()");
    res.json({
      success: true,
      message: "Monthly report generated successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("❌ Error generating monthly report:", error);
    res.status(500).json({ success: false, message: "Error generating monthly report" });
  }
};

/**
 * 📈 Reporte anual
 */
export const getYearlyReport = async (_, res) => {
  try {
    const [rows] = await pool.query("CALL sp_report_yearly()");
    res.json({
      success: true,
      message: "Yearly report generated successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("❌ Error generating yearly report:", error);
    res.status(500).json({ success: false, message: "Error generating yearly report" });
  }
};
