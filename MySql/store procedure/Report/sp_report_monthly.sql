USE hermandad_db;
DELIMITER $$

-- ===========================================================
-- 📆 SP: Reporte mensual
-- ===========================================================
DROP PROCEDURE IF EXISTS sp_report_monthly $$
CREATE PROCEDURE sp_report_monthly()
BEGIN
  SELECT 
    DATE_FORMAT(income_date, '%Y-%m') AS month,
    SUM(amount) AS total_income,
    0 AS total_expense
  FROM incomes
  WHERE is_deleted = 0
  GROUP BY DATE_FORMAT(income_date, '%Y-%m')

  UNION ALL

  SELECT 
    DATE_FORMAT(expense_date, '%Y-%m') AS month,
    0 AS total_income,
    SUM(amount) AS total_expense
  FROM expenses
  WHERE is_deleted = 0
  GROUP BY DATE_FORMAT(expense_date, '%Y-%m')
  ORDER BY month ASC;
END$$

DELIMITER ;