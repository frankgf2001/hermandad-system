USE hermandad_db;
DROP PROCEDURE IF EXISTS sp_person_add;
DELIMITER $$

CREATE PROCEDURE sp_person_add(
  IN p_first_name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  IN p_last_name  VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  IN p_dni        VARCHAR(20)  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  IN p_phone      VARCHAR(20)  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  IN p_address    VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  IN p_birth_date DATE,
  IN p_role_id    INT UNSIGNED,
  IN p_created_by VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci
)
BEGIN
  DECLARE v_creator_user_id INT;
  DECLARE v_person_exists INT DEFAULT 0;
  DECLARE v_user_exists INT DEFAULT 0;
  DECLARE v_new_person_id INT;
  DECLARE v_new_user_id INT;

  START TRANSACTION;

  IF p_first_name IS NULL OR p_last_name IS NULL OR p_dni IS NULL THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'First name, last name, and DNI are required.';
  END IF;

  IF p_role_id IS NULL OR p_role_id <= 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Role ID is required.';
  END IF;

  SELECT id INTO v_creator_user_id
  FROM users
  WHERE username COLLATE utf8mb4_0900_ai_ci = p_created_by COLLATE utf8mb4_0900_ai_ci
  LIMIT 1;

  IF v_creator_user_id IS NULL THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Creator username not found in users table.';
  END IF;

  SELECT COUNT(*) INTO v_person_exists
  FROM persons
  WHERE dni COLLATE utf8mb4_0900_ai_ci = p_dni COLLATE utf8mb4_0900_ai_ci
    AND is_deleted = 0;

  IF v_person_exists > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'A person with this DNI already exists.';
  END IF;

  SELECT COUNT(*) INTO v_user_exists
  FROM users
  WHERE username COLLATE utf8mb4_0900_ai_ci = p_dni COLLATE utf8mb4_0900_ai_ci;

  IF v_user_exists > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'A user with this DNI (username) already exists.';
  END IF;

  INSERT INTO persons (
    user_id, first_name, last_name, dni, phone, address, birth_date, created_by, created_at
  )
  VALUES (
    v_creator_user_id,
    TRIM(p_first_name),
    TRIM(p_last_name),
    TRIM(p_dni),
    NULLIF(TRIM(p_phone), ''),
    NULLIF(TRIM(p_address), ''),
    p_birth_date,
    p_created_by,
    NOW()
  );

  SET v_new_person_id = LAST_INSERT_ID();

  INSERT INTO users (
    role_id, username, password, created_by
  )
  VALUES (
    p_role_id,
    p_dni,
    p_dni,
    p_created_by
  );

  SET v_new_user_id = LAST_INSERT_ID();

  UPDATE persons
  SET user_id = v_new_user_id
  WHERE id = v_new_person_id;

  COMMIT;

  SELECT 
    p.id,
    CONCAT(p.first_name, ' ', p.last_name) AS full_name,
    p.dni AS username,
    p.phone,
    p.address,
    p.birth_date,
    r.name AS role_name,
    p.created_at
  FROM persons p
  INNER JOIN users u ON p.user_id = u.id
  INNER JOIN roles r ON u.role_id = r.id
  WHERE p.id = v_new_person_id;
END$$

DELIMITER ;