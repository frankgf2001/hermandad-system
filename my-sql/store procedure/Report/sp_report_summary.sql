USE hermandad_db;
DROP PROCEDURE IF EXISTS sp_report_summary;
DELIMITER $$

-- ===========================================================
-- 🔹 SP: Resumen general
-- ===========================================================
CREATE PROCEDURE sp_report_summary()
BEGIN
  DECLARE v_total_income DECIMAL(12,2) DEFAULT 0.00;
  DECLARE v_total_expense DECIMAL(12,2) DEFAULT 0.00;
  DECLARE v_balance DECIMAL(12,2) DEFAULT 0.00;

  SELECT IFNULL(SUM(amount), 0.00)
  INTO v_total_income FROM incomes WHERE is_deleted = 0;

  SELECT IFNULL(SUM(amount), 0.00)
  INTO v_total_expense FROM expenses WHERE is_deleted = 0;

  SET v_balance = v_total_income - v_total_expense;

  SELECT 
    v_total_income AS total_income,
    v_total_expense AS total_expense,
    v_balance AS balance,
    NOW() AS generated_at;
END$$

DELIMITER ;
