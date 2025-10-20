USE hermandad_db;
DROP PROCEDURE IF EXISTS sp_person_add;
DELIMITER $$

CREATE PROCEDURE sp_person_add(
  IN p_first_name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_last_name  VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_dni        VARCHAR(20)  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_phone      VARCHAR(20)  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_address    VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  IN p_birth_date DATE,
  IN p_created_by VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
)
BEGIN
  DECLARE v_user_id INT;
  DECLARE v_exists INT DEFAULT 0;

  -- Validaciones básicas
  IF p_first_name IS NULL OR p_last_name IS NULL OR p_dni IS NULL THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'First name, last name, and DNI are required.';
  END IF;

  -- Buscar ID del usuario creador
  SELECT id INTO v_user_id
  FROM users
  WHERE username COLLATE utf8mb4_unicode_ci = p_created_by COLLATE utf8mb4_unicode_ci
  LIMIT 1;

  IF v_user_id IS NULL THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Creator username not found in users table.';
  END IF;

  -- Validar duplicado por DNI
  SELECT COUNT(*) INTO v_exists
  FROM persons
  WHERE dni COLLATE utf8mb4_unicode_ci = p_dni COLLATE utf8mb4_unicode_ci
    AND is_deleted = 0;

  IF v_exists > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'A person with this DNI already exists.';
  END IF;

  -- Inserción segura vinculando con el usuario creador
  INSERT INTO persons (
    user_id, first_name, last_name, dni, phone, address, birth_date, created_by, created_at
  )
  VALUES (
    v_user_id,
    TRIM(p_first_name),
    TRIM(p_last_name),
    TRIM(p_dni),
    NULLIF(TRIM(p_phone), ''),
    NULLIF(TRIM(p_address), ''),
    p_birth_date,
    p_created_by,
    NOW()
  );

  -- Retornar persona recién creada
  SELECT 
    LAST_INSERT_ID() AS id,
    CONCAT(TRIM(p_first_name), ' ', TRIM(p_last_name)) AS full_name,
    p_dni AS dni,
    p_phone AS phone,
    p_address AS address,
    p_birth_date AS birth_date,
    p_created_by AS created_by;
END$$

DELIMITER ;
