USE hermandad_db;
DELIMITER $$

-- ===========================================================
-- 📅 SP: Reporte diario
-- ===========================================================
DROP PROCEDURE IF EXISTS sp_report_daily $$
CREATE PROCEDURE sp_report_daily()
BEGIN
  SELECT 
    DATE(income_date) AS date,
    SUM(amount) AS total_income,
    0 AS total_expense
  FROM incomes
  WHERE is_deleted = 0
  GROUP BY DATE(income_date)

  UNION ALL

  SELECT 
    DATE(expense_date) AS date,
    0 AS total_income,
    SUM(amount) AS total_expense
  FROM expenses
  WHERE is_deleted = 0
  GROUP BY DATE(expense_date)
  ORDER BY date ASC;
END$$

DELIMITER ;