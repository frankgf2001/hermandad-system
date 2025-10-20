USE hermandad_db;

DELIMITER //

CREATE PROCEDURE sp_expense_list ()
BEGIN
    SELECT 
        e.id AS expense_id,
        CONCAT(p.first_name, ' ', p.last_name) AS person_name,
        e.amount,
        e.description,
        e.date,
        e.created_at
    FROM expenses e
    INNER JOIN persons p ON e.person_id = p.id
    WHERE e.is_deleted = 0
    ORDER BY e.created_at DESC;
END //

DELIMITER ;
