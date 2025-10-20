USE hermandad_db;
DROP PROCEDURE IF EXISTS sp_income_list;
DELIMITER $$

CREATE PROCEDURE sp_income_list()
BEGIN
  SELECT 
    i.id,
    i.person_id,
    CONCAT(p.first_name, ' ', p.last_name) AS person_name,
    i.amount,
    i.description,
    i.date,
    i.created_at
  FROM incomes i
  INNER JOIN persons p ON p.id = i.person_id
  WHERE i.is_deleted = 0
  ORDER BY i.created_at DESC;
END$$

DELIMITER ;