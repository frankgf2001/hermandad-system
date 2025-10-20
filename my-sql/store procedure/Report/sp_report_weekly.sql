USE hermandad_db;
DELIMITER $$

-- ===========================================================
-- 🗓️ SP: Reporte semanal
-- ===========================================================
DROP PROCEDURE IF EXISTS sp_report_weekly $$
CREATE PROCEDURE sp_report_weekly()
BEGIN
  SELECT 
    YEARWEEK(income_date, 1) AS week,
    YEAR(income_date) AS year,
    SUM(amount) AS total_income,
    0 AS total_expense
  FROM incomes
  WHERE is_deleted = 0
  GROUP BY YEARWEEK(income_date, 1)

  UNION ALL

  SELECT 
    YEARWEEK(expense_date, 1) AS week,
    YEAR(expense_date) AS year,
    0 AS total_income,
    SUM(amount) AS total_expense
  FROM expenses
  WHERE is_deleted = 0
  GROUP BY YEARWEEK(expense_date, 1)
  ORDER BY year, week;
END$$

DELIMITER ;