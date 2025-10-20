USE hermandad_db;
DELIMITER $$

-- ===========================================================
-- 📈 SP: Reporte anual
-- ===========================================================
DROP PROCEDURE IF EXISTS sp_report_yearly $$
CREATE PROCEDURE sp_report_yearly()
BEGIN
  SELECT 
    YEAR(income_date) AS year,
    SUM(amount) AS total_income,
    0 AS total_expense
  FROM incomes
  WHERE is_deleted = 0
  GROUP BY YEAR(income_date)

  UNION ALL

  SELECT 
    YEAR(expense_date) AS year,
    0 AS total_income,
    SUM(amount) AS total_expense
  FROM expenses
  WHERE is_deleted = 0
  GROUP BY YEAR(expense_date)
  ORDER BY year ASC;
END$$

DELIMITER ;