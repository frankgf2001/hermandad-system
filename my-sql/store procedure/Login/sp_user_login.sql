USE hermandad_db;

DROP PROCEDURE IF EXISTS sp_user_login;
DELIMITER $$

CREATE PROCEDURE sp_user_login (
    IN p_username VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_role_id INT;
    DECLARE v_role_name VARCHAR(100);
    DECLARE v_is_active BOOLEAN;
    DECLARE v_is_deleted BOOLEAN;

    -- =======================================================
    -- Buscar usuario (con conversión de colación)
    -- =======================================================
    SELECT 
        u.id, u.role_id, u.is_active, u.is_deleted
    INTO 
        v_user_id, v_role_id, v_is_active, v_is_deleted
    FROM users u
    WHERE 
        CONVERT(u.username USING utf8mb4) COLLATE utf8mb4_unicode_ci =
        CONVERT(TRIM(p_username) USING utf8mb4) COLLATE utf8mb4_unicode_ci
      AND 
        CONVERT(u.password USING utf8mb4) COLLATE utf8mb4_unicode_ci =
        CONVERT(TRIM(p_password) USING utf8mb4) COLLATE utf8mb4_unicode_ci
    LIMIT 1;

    -- =======================================================
    -- Validaciones de seguridad
    -- =======================================================
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid username or password.';
    END IF;

    IF v_is_deleted THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'This account has been deleted.';
    END IF;

    IF NOT v_is_active THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'This account is inactive.';
    END IF;

    -- =======================================================
    -- Obtener el nombre del rol
    -- =======================================================
    SELECT name INTO v_role_name
    FROM roles
    WHERE id = v_role_id
    LIMIT 1;

    -- =======================================================
    -- Registrar último inicio de sesión
    -- =======================================================
    UPDATE users 
    SET last_login = NOW(), updated_at = NOW()
    WHERE id = v_user_id;

    -- =======================================================
    -- Retornar datos al backend
    -- =======================================================
    SELECT 
        v_user_id AS user_id,
        TRIM(p_username) AS username,
        v_role_name AS role,
        NOW() AS login_time;
END$$

DELIMITER ;