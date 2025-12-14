USE hermandad_db;
DROP PROCEDURE IF EXISTS sp_role_list;
DELIMITER $$

CREATE PROCEDURE sp_role_list()
BEGIN
  SELECT 
    id,
    name AS role_name,
    description,
    is_active,
    created_at
  FROM roles
  WHERE is_deleted = 0
  ORDER BY name ASC;
END$$

DELIMITER ;