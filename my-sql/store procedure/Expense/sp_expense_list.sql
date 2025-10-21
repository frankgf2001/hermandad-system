USE hermandad_db;
DROP PROCEDURE IF EXISTS sp_expense_list;
DELIMITER $$

CREATE PROCEDURE sp_expense_list()
BEGIN
    SELECT 
        e.id AS expense_id,
        CONCAT(p.first_name, ' ', p.last_name) AS person_name,
        e.amount,
        e.expense_type,
        e.description,
        e.expense_date,
        e.created_at
    FROM expenses e
    INNER JOIN persons p ON e.person_id = p.id
    WHERE e.is_deleted = FALSE
    ORDER BY e.created_at DESC;
END$$

DELIMITER ;
