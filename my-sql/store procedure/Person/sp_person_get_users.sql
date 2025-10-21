use hermandad_db;

DELIMITER //

CREATE PROCEDURE sp_person_get_users()
BEGIN
  SELECT 
    a.id,
    a.first_name,
    a.last_name,
    a.dni
  FROM persons a
  INNER JOIN users b
  ON a.user_id = b.id
  INNER JOIN roles c
  ON b.role_id = c.id
  ORDER BY a.first_name, a.last_name;
END //

DELIMITER ;