USE hermandad_db;

DROP PROCEDURE IF EXISTS sp_income_add;
DELIMITER $$

CREATE PROCEDURE sp_income_add (
  IN p_person_id INT,
  IN p_amount DECIMAL(10,2),
  IN p_income_type VARCHAR(100),
  IN p_reference VARCHAR(100),
  IN p_notes TEXT,
  IN p_date DATE,
  IN p_created_by VARCHAR(100)
)
BEGIN
  DECLARE v_effective_date DATE;

  -- Validaciones basicas
  IF p_person_id IS NULL OR p_person_id <= 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'El ID de la persona es invalido o nulo.';
  END IF;

  IF p_amount IS NULL OR p_amount <= 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'El monto del ingreso debe ser mayor que cero.';
  END IF;

  -- Validar que la persona exista
  IF NOT EXISTS (SELECT 1 FROM persons WHERE id = p_person_id) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'La persona especificada no existe.';
  END IF;

  -- Si no se envia fecha, usar la actual
  SET v_effective_date = COALESCE(p_date, CURDATE());

  -- Insercion del registro
  INSERT INTO incomes (
    person_id,
    amount,
    income_date,
    income_type,
    reference,
    notes,
    created_by,
    created_at
  )
  VALUES (
    p_person_id,
    p_amount,
    v_effective_date,
    NULLIF(TRIM(p_income_type), ''),
    NULLIF(TRIM(p_reference), ''),
    NULLIF(TRIM(p_notes), ''),
    NULLIF(TRIM(p_created_by), ''),
    NOW()
  );

  -- Retornar el registro recien insertado con datos de la persona
  SELECT 
    i.id,
    i.person_id,
    CONCAT(p.first_name, ' ', p.last_name) AS person_name,
    i.amount,
    i.income_date,
    i.income_type,
    i.reference,
    i.notes,
    i.created_by,
    i.created_at
  FROM incomes i
  INNER JOIN persons p ON i.person_id = p.id
  WHERE i.id = LAST_INSERT_ID();
END$$

DELIMITER ;
