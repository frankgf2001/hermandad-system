USE hermandad_db;
DROP PROCEDURE IF EXISTS sp_expense_add;
DELIMITER $$

CREATE PROCEDURE sp_expense_add (
    IN p_person_id INT,
    IN p_amount DECIMAL(10,2),
    IN p_description TEXT,
    IN p_expense_date DATE,
    IN p_created_by VARCHAR(100)
)
BEGIN
    DECLARE v_exists INT;

    -- Validar que la persona exista y esté activa
    SELECT COUNT(*) INTO v_exists
    FROM persons
    WHERE id = p_person_id AND is_deleted = 0 AND is_active = 1;

    IF v_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The specified person does not exist or is inactive.';
    END IF;

    -- Registrar el gasto
    INSERT INTO expenses (person_id, amount, description, expense_date, created_by, created_at)
    VALUES (p_person_id, p_amount, TRIM(p_description), p_expense_date, p_created_by, NOW());

    -- Actualizar estado de cuenta (si existe)
    UPDATE account_status
    SET total_expense = total_expense + p_amount,
        last_update = NOW()
    WHERE person_id = p_person_id;

    -- Confirmar respuesta
    SELECT 
        LAST_INSERT_ID() AS expense_id,
        p_person_id AS person_id,
        p_amount AS amount,
        p_description AS description,
        p_expense_date AS expense_date,
        NOW() AS created_at;
END$$

DELIMITER ;
