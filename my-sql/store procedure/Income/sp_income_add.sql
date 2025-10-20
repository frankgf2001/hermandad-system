USE hermandad_db;

DROP PROCEDURE IF EXISTS sp_income_add;
DELIMITER $$

CREATE PROCEDURE sp_income_add (
  IN p_person_id INT,
  IN p_amount DECIMAL(10,2),
  IN p_description VARCHAR(255),
  IN p_date DATE,
  IN p_created_by VARCHAR(100)
)
BEGIN
  -- Validaciones básicas
  IF p_person_id IS NULL OR p_amount <= 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Invalid income data.';
  END IF;

  INSERT INTO incomes (person_id, amount, description, date, created_by, created_at)
  VALUES (p_person_id, p_amount, p_description, p_date, p_created_by, NOW());

  -- Retornar el registro recién insertado
  SELECT 
    LAST_INSERT_ID() AS id,
    p_person_id AS person_id,
    p_amount AS amount,
    p_date AS date,
    p_created_by AS created_by;
END$$

DELIMITER ;
