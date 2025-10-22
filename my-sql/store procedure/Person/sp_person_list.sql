USE hermandad_db;
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_person_list $$
CREATE PROCEDURE sp_person_list()
BEGIN
  SELECT 
    p.id,
    CONCAT(p.first_name, ' ', p.last_name) AS full_name,
    p.first_name,
    p.last_name,
    p.dni,
    p.phone,
    p.address,
    p.birth_date,
    r.name AS role_name,       -- nombre del rol
    p.created_at
  FROM persons p
  LEFT JOIN users u ON p.user_id = u.id
  LEFT JOIN roles r ON u.role_id = r.id
  WHERE p.is_deleted = 0
  ORDER BY p.created_at DESC;
END$$

DELIMITER ;