USE hermandad_db;
DROP PROCEDURE IF EXISTS sp_report_yearly;
DELIMITER $$

CREATE PROCEDURE sp_report_yearly()
BEGIN
    /*
      Reporte anual de ingresos y egresos
      Compatible con ONLY_FULL_GROUP_BY
      y flexible con columnas de fecha en 'expenses'
    */

    SELECT 
        year_data.year_no AS period,
        SUM(year_data.total_income) AS total_income,
        SUM(year_data.total_expense) AS total_expense
    FROM (
        -- Subconsulta con agrupación interna
        SELECT 
            YEAR(i_date) AS year_no,
            MIN(i_date) AS i_date,
            SUM(total_income) AS total_income,
            SUM(total_expense) AS total_expense
        FROM (
            -- Ingresos
            SELECT 
                MIN(i.income_date) AS i_date,
                SUM(i.amount) AS total_income,
                0 AS total_expense
            FROM incomes i
            WHERE i.is_deleted = 0
            GROUP BY YEAR(i.income_date)

            UNION ALL

            -- Egresos
            SELECT 
                MIN(COALESCE(e.expense_date, e.created_at)) AS i_date,
                0 AS total_income,
                SUM(e.amount) AS total_expense
            FROM expenses e
            WHERE e.is_deleted = 0
            GROUP BY YEAR(COALESCE(e.expense_date, e.created_at))
        ) AS base_data
        GROUP BY YEAR(i_date)
    ) AS year_data
    GROUP BY year_data.year_no
    ORDER BY year_data.year_no DESC;
END$$

DELIMITER ;