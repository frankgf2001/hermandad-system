USE hermandad_db;
DROP PROCEDURE IF EXISTS sp_report_daily;
DELIMITER $$

CREATE PROCEDURE sp_report_daily()
BEGIN
    /*
      Reporte diario de ingresos y egresos
      Compatible con ONLY_FULL_GROUP_BY
      y flexible con columnas de fecha en 'expenses'
    */

    SELECT 
        DATE_FORMAT(day_data.i_date, '%Y-%m-%d') AS period,
        SUM(day_data.total_income) AS total_income,
        SUM(day_data.total_expense) AS total_expense
    FROM (
        -- Subconsulta con agrupación interna
        SELECT 
            DATE(i_date) AS i_date,
            SUM(total_income) AS total_income,
            SUM(total_expense) AS total_expense
        FROM (
            -- Ingresos
            SELECT 
                DATE(i.income_date) AS i_date,
                SUM(i.amount) AS total_income,
                0 AS total_expense
            FROM incomes i
            WHERE i.is_deleted = 0
            GROUP BY DATE(i.income_date)

            UNION ALL

            -- Egresos
            SELECT 
                DATE(COALESCE(e.expense_date, e.created_at)) AS i_date,
                0 AS total_income,
                SUM(e.amount) AS total_expense
            FROM expenses e
            WHERE e.is_deleted = 0
            GROUP BY DATE(COALESCE(e.expense_date, e.created_at))
        ) AS base_data
        GROUP BY DATE(i_date)
    ) AS day_data
    GROUP BY day_data.i_date
    ORDER BY day_data.i_date DESC;
END$$

DELIMITER ;