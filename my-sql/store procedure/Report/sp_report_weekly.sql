USE hermandad_db;
DROP PROCEDURE IF EXISTS sp_report_weekly;
DELIMITER $$

CREATE PROCEDURE sp_report_weekly()
BEGIN
    /*
      Reporte semanal de ingresos y egresos
      Totalmente compatible con ONLY_FULL_GROUP_BY
      y flexible con columnas de fecha en 'expenses'
    */

    SELECT 
        CONCAT(YEAR(week_data.i_date), '-', LPAD(week_data.week_no, 2, '0')) AS period,
        SUM(week_data.total_income) AS total_income,
        SUM(week_data.total_expense) AS total_expense
    FROM (
        -- Subconsulta interna con datos agregados
        SELECT 
            YEAR(i_date) AS year_no,
            WEEK(i_date, 1) AS week_no,
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
            GROUP BY YEAR(i.income_date), WEEK(i.income_date, 1)

            UNION ALL

            -- Egresos
            SELECT 
                MIN(COALESCE(e.expense_date, e.created_at)) AS i_date,
                0 AS total_income,
                SUM(e.amount) AS total_expense
            FROM expenses e
            WHERE e.is_deleted = 0
            GROUP BY YEAR(COALESCE(e.expense_date, e.created_at)), WEEK(COALESCE(e.expense_date, e.created_at), 1)
        ) AS base_data
        GROUP BY YEAR(i_date), WEEK(i_date, 1)
    ) AS week_data
    GROUP BY week_data.year_no, week_data.week_no
    ORDER BY week_data.year_no DESC, week_data.week_no DESC;
END$$

DELIMITER ;
