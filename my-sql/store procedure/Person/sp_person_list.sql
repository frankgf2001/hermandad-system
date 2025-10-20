USE hermandad_db;
DROP PROCEDURE IF EXISTS sp_person_list;
DELIMITER $$

CREATE PROCEDURE sp_person_list()
BEGIN
  SELECT 
    p.id,
    CONCAT(p.first_name, ' ', p.last_name) AS full_name,
    p.dni,
    p.phone,
    p.address,
    p.birth_date,
    p.created_at
  FROM persons p
  WHERE p.is_deleted = 0
  ORDER BY p.created_at DESC;
END$$

DELIMITER ;
